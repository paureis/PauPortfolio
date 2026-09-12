import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, realpathSync, statSync } from 'node:fs';
import { isAbsolute, relative, resolve, sep } from 'node:path';

export const ANCHORS = ['cam_wide','cam_main_monitor','cam_side_monitor','cam_wall','cam_desk_end','cam_window'];
export const SURFACES = ['screen_main','screen_side','glass_case','glass_window','strip_window_left','strip_window_right','strip_wall','keys_rgb','frames_credentials'];
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const need = (ok, message) => { if (!ok) throw new Error(message); };
const finite = (v,n) => Array.isArray(v) && v.length===n && v.every(Number.isFinite);
const near = (a,b) => finite(a,b.length) && a.every((v,i)=>Math.abs(v-b[i])<1e-5);
const sub = (a,b) => a.map((v,i)=>v-b[i]);
const dot = (a,b) => a.reduce((s,v,i)=>s+v*b[i],0);
const norm = a => Math.sqrt(dot(a,a));
function transform(p,node) {
  need(!node.matrix,'Screen nodes must use TRS');
  const s=node.scale ?? [1,1,1], t=node.translation ?? [0,0,0], q=node.rotation ?? [0,0,0,1];
  const v=p.map((x,i)=>x*s[i]), [x,y,z,w]=q;
  const cross=[y*v[2]-z*v[1],z*v[0]-x*v[2],x*v[1]-y*v[0]];
  const cross2=[y*cross[2]-z*cross[1],z*cross[0]-x*cross[2],x*cross[1]-y*cross[0]];
  return v.map((value,i)=>value+2*w*cross[i]+2*cross2[i]+t[i]);
}

function assetPath(base,name) {
  need(typeof name==='string' && /^[\w./-]+$/.test(name) && !isAbsolute(name)
    && !name.split('/').some(p=>p==='..' || p===''), `Unsafe scene path: ${name}`);
  const root=realpathSync(base), path=realpathSync(resolve(root,name));
  const rel=relative(root,path);
  need(rel && rel!=='..' && !rel.startsWith('..'+sep) && !isAbsolute(rel), `Scene path escapes public/scene: ${name}`);
  return path;
}

export function parseGlb(bytes) {
  need(bytes.length>=28 && bytes.readUInt32LE(0)===0x46546c67 && bytes.readUInt32LE(4)===2
    && bytes.readUInt32LE(8)===bytes.length, 'Invalid GLB header/length');
  const chunks=[];
  for (let offset=12;offset<bytes.length;) {
    need(offset+8<=bytes.length,'Truncated GLB chunk');
    const size=bytes.readUInt32LE(offset), kind=bytes.readUInt32LE(offset+4);
    need(size%4===0 && offset+8+size<=bytes.length,'Invalid GLB chunk length');
    chunks.push({kind,bytes:bytes.subarray(offset+8,offset+8+size)}); offset+=8+size;
  }
  need(chunks.length===2 && chunks[0].kind===0x4e4f534a && chunks[1].kind===0x004e4942,'Expected JSON and BIN GLB chunks');
  const doc=JSON.parse(chunks[0].bytes.toString());
  need(doc.asset?.version==='2.0' && doc.buffers?.length===1 && !doc.buffers[0].uri
    && doc.buffers[0].byteLength<=chunks[1].bytes.length && doc.buffers[0].byteLength>chunks[1].bytes.length-4,'Invalid embedded GLB buffer');
  for (const v of doc.bufferViews ?? []) need(v.buffer===0 && Number.isInteger(v.byteLength) && v.byteLength>0
    && Number.isInteger(v.byteOffset ?? 0) && (v.byteOffset ?? 0)>=0
    && (v.byteOffset ?? 0)+v.byteLength<=doc.buffers[0].byteLength,'GLB bufferView exceeds buffer');
  return doc;
}

function checkGlb(doc,m,name) {
  need(!doc.cameras?.length && !doc.extensions?.KHR_lights_punctual,`${name}: cameras/lights prohibited`);
  need(doc.extensionsRequired?.includes('KHR_draco_mesh_compression'),`${name}: Draco required`);
  need(doc.asset.extras?.blendHash===m.blendHash,`${name}: blendHash mismatch`);
  const nodes=doc.nodes ?? [], roots=doc.scenes?.[doc.scene ?? 0]?.nodes ?? [], reached=new Set();
  function visit(i) { need(nodes[i] && !reached.has(i),`${name}: invalid node graph`); reached.add(i); (nodes[i].children ?? []).forEach(visit); }
  roots.forEach(visit);
  for (const key of [...ANCHORS,...SURFACES]) {
    const matches=nodes.map((node,index)=>({node,index})).filter(x=>x.node.name===key);
    need(matches.length===1 && reached.has(matches[0].index),`${name}: missing or duplicate node ${key}`);
    const {node,index}=matches[0];
    if (ANCHORS.includes(key)) {
      const p=m.anchors[key];
      need(roots.includes(index) && !node.children?.length && node.mesh===undefined && !node.matrix
        && near(node.translation ?? [0,0,0],p.position) && near(node.rotation ?? [0,0,0,1],p.quaternion)
        && near(node.scale ?? [1,1,1],[1,1,1]) && node.extras?.fov===p.fov && node.extras?.path===p.path,
      `${name}: anchor transform/properties mismatch ${key}`);
    } else {
      const mesh=doc.meshes?.[node.mesh]; need(mesh?.primitives?.length>0,`${name}: missing mesh ${key}`);
      const materials=new Set(mesh.primitives.map(p=>p.material));
      need(materials.size===1 && doc.materials?.[[...materials][0]],`${name}: ${key} requires one material`);
      if (key.startsWith('screen_')) {
        need(roots.includes(index),`${key}: screen must be a root node`);
        need(mesh.primitives.every(p=>doc.accessors?.[p.attributes?.TEXCOORD_0]?.type==='VEC2'),`${name}: ${key} missing UVs`);
        const points=[];
        for (const primitive of mesh.primitives) {
          const accessor=doc.accessors[primitive.attributes.POSITION];
          need(finite(accessor.min,3) && finite(accessor.max,3),`${key}: missing position bounds`);
          for (let bits=0;bits<8;bits++) points.push(transform([0,1,2].map(i=>(bits&(1<<i))?accessor.max[i]:accessor.min[i]),node));
        }
        const bounds={min:[0,1,2].map(i=>Math.min(...points.map(p=>p[i]))),max:[0,1,2].map(i=>Math.max(...points.map(p=>p[i])))};
        const corners=m.surfaces[key].corners;
        need(near(bounds.min,[0,1,2].map(i=>Math.min(...corners.map(p=>p[i]))))
          && near(bounds.max,[0,1,2].map(i=>Math.max(...corners.map(p=>p[i])))),`${key}: GLB geometry/corners mismatch`);
      }
    }
  }
  for (const mesh of doc.meshes ?? []) for (const p of mesh.primitives ?? []) {
    const draco=p.extensions?.KHR_draco_mesh_compression;
    need(draco && doc.bufferViews?.[draco.bufferView] && Number.isInteger(draco.attributes?.POSITION),`${name}: uncompressed/invalid primitive`);
  }
  if (name===m.tiers.minimal.glb) need(!nodes.some(n=>/^(collectible_|sill_|diffuser_|couch_|foam_roller|iem_cable_|iem_lead)/.test(n.name)),'minimal tier contains excluded detail');
  else for (const curve of ['iem_cable_0','iem_cable_1','iem_lead','mic_shock_ring_0']) need(nodes.some(n=>n.name===curve),`${name}: missing converted curve ${curve}`);
  need(!doc.images?.length && !doc.textures?.length,`${name}: block-out must not contain textures`);
}

export function checkScene(root) {
  const base=resolve(root,'public/scene'), m=JSON.parse(readFileSync(resolve(base,'manifest.json'),'utf8'));
  need(m.version===1 && m.stage==='blockout','Unsupported scene version/stage');
  need(m.budgets?.glbBytes===4194304 && m.budgets?.textureBytes===6291456,'Budgets must match contract');
  need(typeof m.exportedAt==='string' && Number.isFinite(Date.parse(m.exportedAt)),'Invalid exportedAt');
  need(/^[a-f0-9]{64}$/.test(m.blendHash) && sha256(readFileSync(resolve(root,'scene/desk.blend')))===m.blendHash,'scene/desk.blend blendHash mismatch; export committed source again');
  for (const key of ANCHORS) {
    const p=m.anchors?.[key]; need(p,`Missing anchor ${key}`);
    need(finite(p.position,3) && finite(p.quaternion,4) && Math.abs(norm(p.quaternion)-1)<1e-5
      && Number.isFinite(p.fov) && p.fov>0 && p.fov<180 && ['direct','arc'].includes(p.path),`Invalid anchor ${key}`);
  }
  for (const key of SURFACES) {
    const s=m.surfaces?.[key]; need(s,`Missing surface ${key}`);
    need(finite(s.bounds?.min,3) && finite(s.bounds?.max,3) && s.bounds.min.every((v,i)=>v<=s.bounds.max[i]),`Invalid bounds ${key}`);
    if (key.startsWith('screen_')) {
      need(Array.isArray(s.corners) && s.corners.length===4 && s.corners.every(p=>finite(p,3)),`${key}: four finite corners required`);
      const [a,b,c,d]=s.corners,u=sub(b,a),v=sub(d,a);
      need(Number.isFinite(s.width) && Number.isFinite(s.height) && s.width>0 && s.height>0
        && Math.abs(norm(u)-s.width)<1e-5 && Math.abs(norm(v)-s.height)<1e-5 && Math.abs(dot(u,v))<1e-6
        && near(c,b.map((x,i)=>x+v[i])),`${key}: corners must form declared planar rectangle`);
      need(u[0]*v[1]-u[1]*v[0]>0,`${key}: normal must face chair (+Z)`);
    }
  }
  const glbs=new Set(), slots=new Set();
  for (const tier of ['full','reduced','minimal']) {
    const t=m.tiers?.[tier]; need(t,`Missing tier ${tier}`);
    need(t.glb?.endsWith('.glb'),`${tier}: GLB path required`);glbs.add(t.glb);
    const dir=assetPath(base,t.textures);need(statSync(dir).isDirectory(),`${tier}: texture slot must be a directory`);
    for (const name of readdirSync(dir)) {
      const path=assetPath(base,t.textures+'/'+name);need(name==='README.txt',`${tier}: unexpected block-out texture ${name}`);slots.add(path);
    }
  }
  need(m.glb===m.tiers.full.glb,'Default GLB must match full tier');
  const sizes={};
  for (const name of glbs) {
    const bytes=readFileSync(assetPath(base,name)), record=m.artifacts?.[name];
    need(bytes.length<4194304,`${name}: GLB exceeds 4 MB budget`);
    need(record?.bytes===bytes.length && record.sha256===sha256(bytes),`${name}: artifact hash/size mismatch`);
    checkGlb(parseGlb(bytes),m,name);sizes[name]=bytes.length;
  }
  need([...slots].reduce((n,p)=>n+statSync(p).size,0)<6291456,'Texture budget exceeded');
  return {glbs:sizes,textureBytes:0,anchors:ANCHORS.length,surfaces:SURFACES.length};
}
