import { profile } from "@/content/profile";

// Placeholder hero. It is the first thing every visitor sees, before any
// scene loads, so it is real HTML from the content source. Issue 2 replaces
// this with the full document.
export default function HomePage() {
  return (
    <main className="hero">
      <p className="hero-name">{profile.name}</p>
      <h1 className="hero-positioning">{profile.positioning}</h1>
      <p className="hero-supporting">{profile.supporting}</p>
      <p className="hero-note">
        This site is being built in public by two coding agents. The full page
        is on its way.
      </p>
    </main>
  );
}
