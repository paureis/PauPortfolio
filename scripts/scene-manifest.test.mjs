import test from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { ANCHORS, SURFACES, checkScene, parseGlb, sha256 } from './scene-manifest.mjs';

const repository=fileURLToPath(new URL('..',import.meta.url));

test('scene export build gate',async t=>{
  const root=mkdtempSync(resolve(tmpdir(),'pau-scene-test-'));
  assert.equal(dirname(root),resolve(tmpdir()));
  function fixture() {
    mkdirSync(resolve(root,'scene'),{recursive:true});
    mkdirSync(resolve(root,'public'),{recursive:true});
    cpSync(resolve(repository,'scene/desk.blend'),resolve(root,'scene/desk.blend'));
    cpSync(resolve(repository,'public/scene'),resolve(root,'public/scene'),{recursive:true});
  }
  const manifestPath=resolve(root,'public/scene/manifest.json');
  function editManifest(edit) {
    const m=JSON.parse(readFileSync(manifestPath));edit(m);writeFileSync(manifestPath,JSON.stringify(m));
  }
  function editGlb(edit) {
    const path=resolve(root,'public/scene/desk.glb'), bytes=readFileSync(path), doc=parseGlb(bytes);
    edit(doc);
    const tail=bytes.subarray(20+bytes.readUInt32LE(12));
    const json=Buffer.from(JSON.stringify(doc));
    const padded=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,32)]);
    const header=Buffer.alloc(20);header.writeUInt32LE(0x46546c67,0);header.writeUInt32LE(2,4);
    header.writeUInt32LE(20+padded.length+tail.length,8);header.writeUInt32LE(padded.length,12);header.writeUInt32LE(0x4e4f534a,16);
    const output=Buffer.concat([header,padded,tail]);writeFileSync(path,output);
    editManifest(m=>{m.artifacts['desk.glb']={bytes:output.length,sha256:sha256(output)};});
  }
  async function rejects(name,edit,pattern) {
    await t.test(name,()=>{fixture();edit();assert.throws(()=>checkScene(root),pattern);});
  }
  try {
    await t.test('real committed exports pass',()=>{fixture();assert.equal(checkScene(root).anchors,6);});
    await t.test('CI command exits nonzero and names the missing anchor',()=>{
      fixture();mkdirSync(resolve(root,'scripts'),{recursive:true});
      for (const file of ['check-manifest.mjs','scene-manifest.mjs']) cpSync(resolve(repository,'scripts',file),resolve(root,'scripts',file));
      editManifest(m=>delete m.anchors.cam_window);
      const result=spawnSync(process.execPath,[resolve(root,'scripts/check-manifest.mjs')],{encoding:'utf8',windowsHide:true});
      assert.equal(result.status,1);assert.match(result.stderr,/Missing anchor cam_window/);
    });
    for (const name of ANCHORS) await rejects(`missing ${name}`,()=>editManifest(m=>delete m.anchors[name]),new RegExp(name));
    for (const name of SURFACES) await rejects(`missing ${name}`,()=>editManifest(m=>delete m.surfaces[name]),new RegExp(name));
    for (const tier of ['full','reduced','minimal']) await rejects(`missing tier ${tier}`,()=>editManifest(m=>delete m.tiers[tier]),new RegExp(tier));
    await rejects('absent manifest is fatal',()=>rmSync(manifestPath),/ENOENT/);
    await rejects('changed blend source is fatal',()=>writeFileSync(resolve(root,'scene/desk.blend'),'changed'),/blendHash/);
    await rejects('nonunit quaternion',()=>editManifest(m=>m.anchors.cam_wide.quaternion=[0,0,0,2]),/cam_wide/);
    await rejects('invalid FOV',()=>editManifest(m=>m.anchors.cam_wide.fov=180),/cam_wide/);
    await rejects('nonplanar screen',()=>editManifest(m=>m.surfaces.screen_main.corners[2][2]+=.1),/screen_main/);
    await rejects('translated manifest screen differs from GLB',()=>editManifest(m=>m.surfaces.screen_main.corners.forEach(p=>p[0]+=1)),/geometry\/corners/);
    await rejects('budget cannot be weakened',()=>editManifest(m=>m.budgets.glbBytes*=2),/budget/i);
    await rejects('path traversal',()=>editManifest(m=>{m.glb=m.tiers.full.glb='../outside.glb';}),/Unsafe/);
    await rejects('remote texture URI',()=>editManifest(m=>m.tiers.full.textures='https://example.com'),/Unsafe/);
    await rejects('missing tier GLB',()=>rmSync(resolve(root,'public/scene/desk-lite.glb')),/ENOENT/);
    await rejects('tampered GLB',()=>writeFileSync(resolve(root,'public/scene/desk.glb'),'changed'),/hash/);
    await rejects('missing GLB anchor',()=>editGlb(d=>{d.nodes.find(n=>n.name==='cam_window').name='renamed';}),/cam_window/);
    await rejects('GLB pose mismatch',()=>editGlb(d=>{d.nodes.find(n=>n.name==='cam_wide').translation[0]+=1;}),/cam_wide/);
    await rejects('missing compression',()=>editGlb(d=>{d.extensionsRequired=[];}),/Draco/);
    await rejects('invalid buffer view',()=>editGlb(d=>{d.bufferViews[0].byteLength=1e9;}),/bufferView/);
    await rejects('camera export rejected',()=>editGlb(d=>{d.cameras=[{}];}),/cameras/);
    await rejects('missing curve rejected',()=>editGlb(d=>{d.nodes.find(n=>n.name==='iem_cable_0').name='lost';}),/iem_cable_0/);
    await rejects('screen UVs required',()=>editGlb(d=>{
      const n=d.nodes.find(n=>n.name==='screen_main');delete d.meshes[n.mesh].primitives[0].attributes.TEXCOORD_0;
    }),/screen_main/);
  } finally {
    // This is only the unique fixture directory created above, never a repo path.
    assert.equal(dirname(root),resolve(tmpdir()));
    rmSync(root,{recursive:true,force:true});
  }
});
