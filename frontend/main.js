document.addEventListener("DOMContentLoaded", () => {
  /* ---------- MOBILE NAV ---------- */
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      hamburger.classList.toggle("active");
    });
  }

  /* ---------- THEME TOGGLE ---------- */
  const themeToggle = document.getElementById("themeToggle");
  const html = document.documentElement;

  // Load saved theme or default
  const savedTheme = localStorage.getItem("theme") || "dark";
  html.dataset.theme = savedTheme;
  themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";

  themeToggle.addEventListener("click", () => {
    if (html.dataset.theme === "dark") {
      html.dataset.theme = "light";
      themeToggle.textContent = "🌙";
      localStorage.setItem("theme", "light");
    } else {
      html.dataset.theme = "dark";
      themeToggle.textContent = "☀️";
      localStorage.setItem("theme", "dark");
    }
  });

  /* ---------- QR GENERATOR ---------- */
  const qrText = document.getElementById("qrText");
  const qrColor = document.getElementById("qrColor");
  const bgColor = document.getElementById("bgColor");
  const generateBtn = document.getElementById("generateBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const qrContainer = document.getElementById("qrcode");

  let qr;

  function generateQR() {
    qrContainer.innerHTML = "";
    const text = qrText.value.trim();
    if (!text) return;

    qr = new QRCode(qrContainer, {
      text: text,
      width: 200,
      height: 200,
      colorDark: qrColor.value,
      colorLight: bgColor.value,
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  // Live preview
  [qrText, qrColor, bgColor].forEach(input => {
    if (input) input.addEventListener("input", generateQR);
  });

  if (generateBtn) generateBtn.addEventListener("click", generateQR);

  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      if (!qrContainer.querySelector("canvas")) return;
      const canvas = qrContainer.querySelector("canvas");
      const link = document.createElement("a");
      link.download = "qrcode.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  }
});
