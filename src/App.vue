<script setup lang="ts">
import CommandPanel from './components/CommandPanel.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { github, labSource, linkedin } from './content'
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header wrap">
    <a class="wordmark" href="#top" aria-label="Emir, back to top">Emir.</a>
    <nav class="site-nav" aria-label="Main navigation">
      <a href="#lab">Lab</a><a href="#notes">Notes</a><a href="#about">About</a
      ><a href="#contact">Contact</a>
    </nav>
    <div class="header-tools">
      <p class="location">Frontend development · Tuzla, Bosnia &amp; Herzegovina</p>
      <ThemeToggle />
    </div>
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
            <span>Interfaces with</span>{{ ' ' }}<span>a little more <em>feeling.</em></span>
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
        <h2 id="lab-title" tabindex="-1">Timing meets<br /><span>interface craft.</span></h2>
        <p>
          A qualifying-lap workbench, built with Vue and TypeScript. Real historical data, linked
          traces, and the decisions behind a reliable interface.
        </p>
        <a class="section-scroll" href="/lab/lap-compare/" aria-label="Open the lap workbench"
          ><svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.4"
            aria-hidden="true"
          >
            <path d="M5 12h14m-6-6 6 6-6 6" /></svg
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
              <path d="M3 18V6m0 12h18M5 14l3-5 4 4 4-7 4 4" />
            </svg>
          </div>
          <h3>Two qualifying laps.<br />One closer look.</h3>
          <p class="lap-preview-times">Sainz 1:30.984 · Russell 1:31.056</p>
          <a class="button button--primary" href="/lab/lap-compare/">Compare the laps</a>
        </div>
        <div class="lab-explanation">
          <h3>Meet the lap workbench.</h3>
          <p>
            Compare reported sector times, explore linked telemetry and inspect the samples beneath
            the curves. A motorsport interest, turned into a frontend problem.
          </p>
          <ul class="detail-list">
            <li>
              <span>Data with context</span><span>OpenF1 historical laps, explicit sources.</span>
            </li>
            <li>
              <span>State you can trust</span
              ><span>Validated results, cancellation and recovery.</span>
            </li>
            <li>
              <span>More than a chart</span
              ><span>Keyboard controls, raw data and shareable views.</span>
            </li>
          </ul>
          <a class="text-link" :href="labSource">View the source</a>
        </div>
      </div>
    </section>

    <section id="notes" class="notes section wrap" aria-labelledby="notes-title">
      <div class="notes-heading">
        <h2 id="notes-title" tabindex="-1">Notes.</h2>
        <p>Under the surface: the decisions that make the whole thing work.</p>
      </div>
      <div class="notes-grid">
        <article>
          <span class="note-symbol" aria-hidden="true">&lt;input&gt;</span>
          <h3>Start with what’s already there.</h3>
          <p>
            Native selects, a range input and an ordinary table carry the interaction. Vue connects
            the data. The traces are SVG, with no chart library between the samples and the screen.
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
          <h3>A result keeps its identity.</h3>
          <p>
            Requested drivers and displayed results have separate state. A slow or failed request
            keeps the previous comparison correctly named. A late response cannot replace a newer
            one.
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
          <h3>Know what the data can say.</h3>
          <p>
            Reported timing and estimated progress are different kinds of evidence. Missing samples
            stay missing, and the interface explains where interpretation should stop.
          </p>
        </article>
      </div>
    </section>

    <section id="about" class="about section wrap" aria-labelledby="about-title">
      <div>
        <h2 id="about-title" tabindex="-1">About me.</h2>
        <p class="about-lead">
          I’m Emir, a software developer<br class="desktop-break" />
          based in Tuzla.
        </p>
      </div>
      <div class="about-copy">
        <p>
          I work with Vue, TypeScript, and Electron. I’m drawn to the parts of frontend development
          where structure and experience meet: readable architecture, accessible interactions, and
          details that make software feel right.
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
      <a class="button button--primary" :href="linkedin"
        >Say hello on LinkedIn
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
    <p>Made with care in Tuzla.</p>
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
