// ================== THEME & DRAWER ==================

// ---------- Theme ----------
const ROOT = document.documentElement;
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
ROOT.setAttribute("data-theme", savedTheme || (prefersDark ? "dark" : "light"));

function updateThemeButtons() {
  document.querySelectorAll("[data-theme-toggle]").forEach((b) => {
    const isLight = ROOT.getAttribute("data-theme") === "light";
    b.textContent = isLight ? "🌓" : "☀️";
    b.setAttribute("aria-label", isLight ? "Switch to dark" : "Switch to light");
  });
}
updateThemeButtons();

document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-theme-toggle]");
  if (!t) return;
  const isLight = ROOT.getAttribute("data-theme") === "light";
  const newTheme = isLight ? "dark" : "light";
  ROOT.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeButtons();
});

// ---------- Drawer ----------
const drawer = document.querySelector(".mobile-drawer");
const backdrop = document.querySelector(".drawer-backdrop");
const burger = document.querySelector(".hamburger");
const closeBtn = document.querySelector(".mobile-drawer .close-btn");

function openDrawer() {
  drawer?.classList.add("active");
  backdrop?.classList.add("active");
  document.body.classList.add("drawer-open"); // 🔒 freeze scroll
}
function closeDrawer() {
  drawer?.classList.remove("active");
  backdrop?.classList.remove("active");
  document.body.classList.remove("drawer-open"); // 🔓 unfreeze scroll
}

burger?.addEventListener("click", openDrawer);
closeBtn?.addEventListener("click", closeDrawer);
backdrop?.addEventListener("click", closeDrawer);

// ================== PAGE TRANSITIONS & LOADER ==================

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("page-loader");
  const body = document.body;

  // Fix loader height
  if (loader) {
    loader.style.height = window.innerHeight + "px";
    window.addEventListener("resize", () => {
      loader.style.height = window.innerHeight + "px";
    });
  }

  // On full load → hide loader
  window.addEventListener("load", () => {
    setTimeout(() => {
      if (loader) loader.classList.add("hidden");
      body.classList.add("page-loaded");
    }, 600);
  });

  // --------- Transition Overlay ---------
  const transitionOverlay = document.createElement("div");
  transitionOverlay.className = "page-transition";
  document.body.appendChild(transitionOverlay);

  // Intercept internal links
  document.querySelectorAll("a[href]").forEach((link) => {
    if (
      link.hostname === window.location.hostname &&
      !link.href.includes("#") &&
      !link.target
    ) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const href = link.getAttribute("href");

        // Trigger overlay fade
        transitionOverlay.classList.add("active");

        // Navigate after delay
        setTimeout(() => {
          window.location.href = href;
        }, 500);
      });
    }
  });

  // --------- Loader status cycling ---------
  const statusText = document.querySelector(".status-text");
  if (statusText) {
    const messages = ["Initializing...", "Loading assets...", "Finalizing..."];
    let i = 0;
    const cycle = setInterval(() => {
      statusText.textContent = messages[i];
      i++;
      if (i >= messages.length) clearInterval(cycle);
    }, 1000);
  }
});

// --------- Extra Loader Messages (looping) ---------
const statusMessages = [
  "Generating QR...",
  "Optimizing design...",
  "Loading experience...",
  "AI magic in progress...",
  "Finalizing..."
];

let msgIndex = 0;
setInterval(() => {
  const textEl = document.getElementById("loader-text");
  if (textEl) {
    textEl.textContent = statusMessages[msgIndex];
    msgIndex = (msgIndex + 1) % statusMessages.length;
  }
}, 1600);

// ================== SOFT-NAV FADE ==================
document.addEventListener("click", (e) => {
  const link = e.target.closest("a[data-softnav]");
  if (!link || link.target === "_blank") return;
  e.preventDefault();
  document.body.style.opacity = "0";
  setTimeout(() => {
    window.location.href = link.href;
  }, 120);
});
window.addEventListener("pageshow", () => {
  document.body.style.opacity = "";
});

// ================== ACTIVE LINK HIGHLIGHT ==================
document.querySelectorAll("a[data-softnav]").forEach((a) => {
  if (
    a.getAttribute("href") &&
    location.pathname.endsWith(a.getAttribute("href"))
  ) {
    a.classList.add("active");
  }
});

// ================== QR STORAGE API ==================
window.QRPRO = {
  saveLastQRText(t) {
    try {
      localStorage.setItem("qrpro:lastText", t);
    } catch {}
  },
  getLastQRText() {
    try {
      return localStorage.getItem("qrpro:lastText") || "";
    } catch {
      return "";
    }
  },
  saveLastQRPng(dataUrl) {
    try {
      localStorage.setItem("qrpro:lastPNG", dataUrl);
    } catch {}
  },
  getLastQRPng() {
    try {
      return localStorage.getItem("qrpro:lastPNG") || "";
    } catch {
      return "";
    }
  }
};
