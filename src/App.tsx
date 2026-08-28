import { StoreLinksLab } from "./components/store-links-lab";

export function App() {
  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="UI home">UI</a>
        <nav aria-label="Primary navigation">
          <a href="#store-links">Components</a>
          <a href="https://github.com/akiralazycat/ui" target="_blank" rel="noreferrer">GitHub ↗</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <p className="eyebrow"><span /> Open interface primitives</p>
        <h1>Small pieces.<br />Native to the web.</h1>
        <p className="hero__copy">Reusable UI components designed around context rather than screenshots: theme, platform, input, accessibility, motion, and rendering environment.</p>
      </section>

      <StoreLinksLab />

      <footer>
        <strong>UI</strong>
        <span>Open source · MIT</span>
        <span>ui.manabeakira.com</span>
      </footer>
    </main>
  );
}
