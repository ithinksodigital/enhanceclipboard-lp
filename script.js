(() => {
  const orbA = document.querySelector(".orb-a");
  const orbB = document.querySelector(".orb-b");
  const revealNodes = document.querySelectorAll("[data-reveal]");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxClose = document.getElementById("lightbox-close");
  const shotImages = document.querySelectorAll(".shot img");

  // Reveal cards/sections while scrolling.
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

  // Screenshot lightbox.
  function closeLightbox() {
    if (!lightbox || !lightboxImage) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    lightboxImage.alt = "";
  }

  shotImages.forEach((img) => {
    img.addEventListener("click", () => {
      if (!lightbox || !lightboxImage) return;
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }

  window.addEventListener("mousemove", (event) => {
    const xRatio = event.clientX / window.innerWidth;
    const yRatio = event.clientY / window.innerHeight;

    if (orbA && orbB) {
      orbA.style.transform = `translate(${(xRatio - 0.5) * 18}px, ${(yRatio - 0.5) * 18}px)`;
      orbB.style.transform = `translate(${(0.5 - xRatio) * 14}px, ${(0.5 - yRatio) * 14}px)`;
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });
})();
