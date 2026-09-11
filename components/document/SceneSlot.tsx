// Where the scene will go. A fixed layer behind the document that Issue 3
// fills with the canvas and the wide-shot still. It carries no content and
// is hidden from assistive technology, so removing it changes nothing a
// reader would notice. For now it is the room's ground with the faint
// warmth of a lamp, so the page reads as a lit room before any scene loads.
export function SceneSlot() {
  return <div className="scene-slot" aria-hidden="true" data-scene-slot />;
}
