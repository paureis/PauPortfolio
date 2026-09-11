// Where the scene will go. A fixed layer behind the document that Issue 3
// fills with the canvas and the wide-shot still. It carries no content and
// is hidden from assistive technology, so removing it changes nothing a
// reader would notice. For now it is flat Room Base: light comes from the
// scene when it lands, never from CSS.
export function SceneSlot() {
  return <div className="scene-slot" aria-hidden="true" data-scene-slot />;
}
