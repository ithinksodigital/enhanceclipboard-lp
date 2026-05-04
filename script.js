(() => {
  const textSlider = document.querySelector("[data-text-slider]");
  const revealNodes = document.querySelectorAll("[data-reveal]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
  );

  revealNodes.forEach((node) => observer.observe(node));

  if (textSlider) {
    const track = textSlider.querySelector(".text-slider-track");
    const slides = textSlider.querySelectorAll(".text-slider-slide");
    const prevBtn = textSlider.querySelector(".text-slider-prev");
    const nextBtn = textSlider.querySelector(".text-slider-next");
    const dotsRoot = textSlider.querySelector(".text-slider-dots");
    const counter = textSlider.querySelector("[data-slider-counter]");
    const viewport = textSlider.querySelector(".text-slider-viewport");

    let index = 0;
    let touchStartX = null;

    const total = slides.length;
    const pad = (n) => String(n).padStart(2, "0");

    function goTo(nextIndex) {
      if (total === 0) return;
      index = ((nextIndex % total) + total) % total;
      if (track) {
        track.style.transform = `translateX(-${index * 100}%)`;
      }
      slides.forEach((slide, i) => {
        slide.setAttribute("aria-hidden", i === index ? "false" : "true");
      });
      dotsRoot?.querySelectorAll(".text-slider-dot").forEach((dot, i) => {
        dot.setAttribute("aria-current", i === index ? "true" : "false");
      });
      if (counter) {
        counter.textContent = `${pad(index + 1)} / ${pad(total)}`;
      }
    }

    slides.forEach((slide, i) => {
      const label = slide.getAttribute("data-dot-label") ?? `Slide ${i + 1}`;
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "text-slider-dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", label);
      dot.addEventListener("click", () => goTo(i));
      dotsRoot?.appendChild(dot);
    });

    goTo(0);

    prevBtn?.addEventListener("click", () => goTo(index - 1));
    nextBtn?.addEventListener("click", () => goTo(index + 1));

    viewport?.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    viewport?.addEventListener(
      "touchend",
      (e) => {
        if (touchStartX == null) return;
        const dx = e.changedTouches[0].screenX - touchStartX;
        touchStartX = null;
        if (dx > 56) goTo(index - 1);
        else if (dx < -56) goTo(index + 1);
      },
      { passive: true }
    );

    viewport?.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(index - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(index + 1);
      }
    });
  }
})();
