// Where the scene will go. A fixed layer behind the document that the 3D
// lane fills with the canvas and, for visitors without WebGL, the wide-shot
// still. It carries no content and is hidden from assistive technology, so
// removing it changes nothing a reader would notice.
//
// Until Issue 3 exports the room there is no still to show: the wide shot
// is a render of the Blender scene, and a drawn or generated stand-in would
// be a picture of a desk that is not Pau's. So for now the slot is flat
// Room Base, and light comes from the scene when it lands, never from CSS.
export function SceneSlot() {
  return <div className="scene-slot" aria-hidden="true" data-scene-slot />;
}
