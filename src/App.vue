<script setup lang="ts">
import CommandPanel from './components/CommandPanel.vue'
import CommandDialog from './components/CommandDialog.vue'
import { github, labSource } from './content'
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header wrap">
    <a class="wordmark" href="#top" aria-label="Emir, back to top">Emir.</a>
    <nav class="site-nav" aria-label="Main navigation">
      <a href="#lab">Lab</a><a href="#about">About</a><a href="#contact">Contact</a>
    </nav>
    <p class="location">Frontend development · Tuzla, Bosnia &amp; Herzegovina</p>
  </header>
  <main id="main" tabindex="-1">
    <section id="top" class="hero" aria-labelledby="intro-title">
      <picture class="hero-scenery" aria-hidden="true">
        <source
          type="image/avif"
          srcset="
            /assets/clear-air-768.avif   768w,
            /assets/clear-air-1024.avif 1024w,
            /assets/clear-air-1536.avif 1536w
          "
          sizes="100vw"
        />
        <img
          src="/assets/clear-air-1536.webp"
          srcset="/assets/clear-air-768.webp 768w, /assets/clear-air-1536.webp 1536w"
          sizes="100vw"
          alt=""
          width="1536"
          height="1024"
          fetchpriority="high"
          decoding="async"
        />
      </picture>
      <div class="hero-wash" aria-hidden="true"></div>
      <div class="hero-inner wrap">
        <div class="hero-copy">
          <h1 id="intro-title">
            <span>Interfaces with</span><span>a little more <em>feeling.</em></span>
          </h1>
          <p class="hero-intro">
            I build thoughtful interfaces with Vue, TypeScript,<br class="desktop-break" />
            and a respect for the web platform.
          </p>
          <div class="hero-actions">
            <a class="button button--primary" href="#lab"
              >Explore the lab
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                aria-hidden="true"
              >
                <path d="M5 12h14m-6-6 6 6-6 6" /></svg></a
            ><a class="button button--glass" href="#contact">Say hello</a>
          </div>
        </div>
        <div class="hero-panel"><CommandPanel /></div>
      </div>
    </section>

    <section id="lab" class="lab section wrap" aria-labelledby="lab-title">
      <div class="section-intro">
        <h2 id="lab-title" tabindex="-1">
          Small interface.<br /><span>Considered decisions.</span>
        </h2>
        <p>
          One focused experiment exploring interaction on the modern web. Built with Vue and
          TypeScript, with attention to clarity, accessibility, and the details underneath.
        </p>
        <a class="section-scroll" href="#lab-demo" aria-label="Try the command menu"
          ><svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.4"
            aria-hidden="true"
          >
            <path d="M12 5v14m-6-6 6 6 6-6" /></svg
        ></a>
      </div>
      <div class="lab-workbench">
        <div class="lab-experiment">
          <div class="experiment-mark" aria-hidden="true">
            <svg
              width="38"
              height="38"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.2"
            >
              <rect x="3" y="5" width="18" height="14" rx="3" />
              <path d="M7 10h4m-4 4h10m-3-4h3" />
            </svg>
          </div>
          <h3 id="lab-demo" tabindex="-1">
            A familiar interaction,<br />built from the foundations.
          </h3>
          <CommandDialog />
        </div>
        <div class="lab-explanation">
          <h3>Meet the command menu.</h3>
          <p>
            A small study in what happens between an intention and an action: where focus starts,
            how the keyboard moves, and where you land.
          </p>
          <ul class="detail-list">
            <li><span>Built on the platform</span><span>Native dialog, ordinary links.</span></li>
            <li>
              <span>Made for more than a mouse</span><span>Keyboard, touch, and clear focus.</span>
            </li>
            <li><span>Open to a closer look</span><span>Real source. Explicit tradeoffs.</span></li>
          </ul>
          <a class="text-link" :href="labSource"
            >View the source
            <svg
              class="external-icon"
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              aria-hidden="true"
            >
              <path d="M7 17 17 7M7 7h10v10" /></svg
          ></a>
        </div>
      </div>
    </section>

    <section id="notes" class="notes section wrap" aria-labelledby="notes-title">
      <div class="notes-heading">
        <h2 id="notes-title" tabindex="-1">Under the surface.</h2>
        <p>The small decisions that make the whole thing work.</p>
      </div>
      <div class="notes-grid">
        <article>
          <span class="note-symbol" aria-hidden="true">&lt;dialog&gt;</span>
          <h3>Start with what’s already there.</h3>
          <p>
            The browser owns modal semantics and makes the rest of the page inert. Vue connects the
            actions. A component library would add more machinery than this experiment needs.
          </p>
        </article>
        <article>
          <svg
            class="note-symbol"
            width="36"
            height="30"
            viewBox="0 0 36 30"
            fill="none"
            stroke="currentColor"
            stroke-width="1.3"
            aria-hidden="true"
          >
            <rect x="1" y="5" width="34" height="20" rx="4" />
            <path d="M8 12h4m5 0h4m5 0h3M8 18h20" />
          </svg>
          <h3>Focus has somewhere to go.</h3>
          <p>
            Closing returns you to the button that opened the menu. Choosing a section moves focus
            to its heading instead. The interaction ends where the intention leads.
          </p>
        </article>
        <article>
          <svg
            class="note-symbol"
            width="34"
            height="30"
            viewBox="0 0 34 30"
            fill="none"
            stroke="currentColor"
            stroke-width="1.3"
            aria-hidden="true"
          >
            <path d="M4 22h26M8 17V8m9 9V3m9 14v-5" />
            <circle cx="8" cy="21" r="3" fill="currentColor" />
            <circle cx="17" cy="11" r="3" fill="currentColor" />
            <circle cx="26" cy="7" r="3" fill="currentColor" />
          </svg>
          <h3>A little motion. On your terms.</h3>
          <p>
            Light adds a quiet moment to the glass. When reduced motion is preferred, it stays
            still. The content and controls never wait for an animation to finish.
          </p>
        </article>
      </div>
    </section>

    <section id="about" class="about section wrap" aria-labelledby="about-title">
      <div>
        <h2 id="about-title" tabindex="-1">A little about me.</h2>
        <p class="about-lead">
          I’m Emir, a software developer<br class="desktop-break" />
          based in Tuzla.
        </p>
      </div>
      <div class="about-copy">
        <p>
          I work with Vue, TypeScript, and Electron. I’m drawn to the parts of frontend development
          where structure and experience meet: readable architecture, accessible interactions, and
          small details that make software feel right.
        </p>
        <p>
          Outside the editor, it’s cars, loud guitars, and a soft spot for the optimistic digital
          world of the Vista and Windows 7 era. Some of that found its way here.
        </p>
        <a class="text-link" :href="github"
          >Find me on GitHub
          <svg
            class="external-icon"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            aria-hidden="true"
          >
            <path d="M7 17 17 7M7 7h10v10" /></svg
        ></a>
      </div>
    </section>

    <section id="contact" class="contact section wrap" aria-labelledby="contact-title">
      <div>
        <h2 id="contact-title" tabindex="-1">Good things start<br />with a <em>hello.</em></h2>
        <p>
          A question about interfaces, code,<br class="desktop-break" />
          or something in the lab?
        </p>
      </div>
      <a class="button button--primary" :href="github"
        >Say hello on GitHub
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          aria-hidden="true"
        >
          <path d="M5 12h14m-6-6 6 6-6 6" /></svg
      ></a>
    </section>
  </main>
  <footer class="footer wrap">
    <a class="wordmark" href="#top" aria-label="Emir, back to top">Emir.</a>
    <p>Made with care, and a little feeling.</p>
    <a :href="labSource"
      >Lab source
      <svg
        class="external-icon"
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        aria-hidden="true"
      >
        <path d="M7 17 17 7M7 7h10v10" /></svg
    ></a>
  </footer>
</template>
