/* FOLLOW YOUR DREAMS — DIGITAL EXPERIENCE v1.0 RC1 */
(() => {
  "use strict";

  const timings = {
    errorDuration: 3000,
    transitionDuration: 1100,
    introDuration: 4200,
    reflectionDuration: 5200
  };

  const errorScene = document.querySelector("#error-scene");
  const transitionFlash = document.querySelector("#transition-flash");
  const errorEcho = document.querySelector("#error-echo");
  const experience = document.querySelector("#experience");
  const introMessage = document.querySelector(".intro-message");
  const reflectionMessage = document.querySelector(".reflection-message");
  const scrollCue = document.querySelector("#scroll-cue");
  const coordinatesButton = document.querySelector("#coordinates");
  const copyFeedback = document.querySelector("#copy-feedback");
  const journeyScene = document.querySelector("#scene-journey");
  const routePath = document.querySelector("#route-path");
  const revealElements = document.querySelectorAll(".reveal-on-scroll");

  const delay = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

  async function startExperience() {
    await delay(timings.errorDuration);

    transitionFlash.classList.add("is-active");
    errorEcho.classList.add("is-visible");
    errorScene.classList.add("is-leaving");
    experience.classList.add("is-visible");
    experience.setAttribute("aria-hidden", "false");

    await delay(timings.transitionDuration);
    errorScene.hidden = true;
    transitionFlash.classList.remove("is-active");
    errorEcho.classList.remove("is-visible");

    await delay(timings.introDuration);
    introMessage.classList.add("is-hidden");
    reflectionMessage.classList.add("is-visible");
    reflectionMessage.setAttribute("aria-hidden", "false");

    await delay(timings.reflectionDuration);
    scrollCue.classList.add("is-visible");
  }

  scrollCue.addEventListener("click", () => {
    journeyScene.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  coordinatesButton.addEventListener("click", async () => {
    const coordinates = "91°00′00″N, 181°00′00″E";
    try {
      await navigator.clipboard.writeText(coordinates);
    } catch {
      const temp = document.createElement("textarea");
      temp.value = coordinates;
      temp.style.position = "fixed";
      temp.style.opacity = "0";
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      temp.remove();
    }
    copyFeedback.classList.add("is-visible");
    window.setTimeout(() => copyFeedback.classList.remove("is-visible"), 1500);
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: 0.35 });

  revealElements.forEach((element) => revealObserver.observe(element));

  function updateRoute() {
    if (!experience.classList.contains("is-visible")) return;
    const rect = journeyScene.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const progress = Math.min(1, Math.max(0, (viewportHeight - rect.top) / (rect.height + viewportHeight)));
    routePath.style.strokeDashoffset = String(1450 * (1 - progress));
    journeyScene.classList.toggle("route-complete", progress > 0.86);
  }

  window.addEventListener("scroll", updateRoute, { passive: true });
  window.addEventListener("resize", updateRoute);
  startExperience();
})();
