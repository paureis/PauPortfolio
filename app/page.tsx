import { Contact } from "@/components/document/Contact";
import { Credentials } from "@/components/document/Credentials";
import { Hero } from "@/components/document/Hero";
import { HowIWork } from "@/components/document/HowIWork";
import { OffTheClock } from "@/components/document/OffTheClock";
import { SceneSlot } from "@/components/document/SceneSlot";
import { Work } from "@/components/document/Work";
import { site } from "@/content/site";
import type { StationId } from "@/content/types";

function station(id: StationId) {
  const found = site.stations.find((s) => s.id === id);
  if (!found) throw new Error(`content has no station ${id}`);
  return found;
}

// The document. Six stations in story order, rendered from the content
// model and nothing else. This is the whole site for anyone without WebGL,
// with reduced motion, or using a screen reader, and the page every other
// visitor reads underneath the scene.
export default function HomePage() {
  const work = station("main-monitor");
  return (
    <>
      <SceneSlot />
      <main className="document">
        <Hero
          profile={site.profile}
          contact={site.contact}
          station={station("wide")}
          workAnchor={work.anchor}
        />
        <Work station={work} entries={site.work} timeline={site.timeline} />
        <HowIWork station={station("side-monitor")} content={site.howIWork} />
        <Credentials station={station("wall")} credentials={site.credentials} education={site.education} />
        <OffTheClock station={station("desk-end")} content={site.offTheClock} />
        <Contact station={station("window")} content={site.contact} />
      </main>
    </>
  );
}
