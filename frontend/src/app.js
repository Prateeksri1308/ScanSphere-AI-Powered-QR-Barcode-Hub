
import QRCode from "https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js";

const form = document.getElementById("qrForm");
const qrResult = document.getElementById("qrResult");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = document.getElementById("qrText").value;
  qrResult.innerHTML = "";
  qrResult.classList.remove("hidden");
  const canvas = document.createElement("canvas");
  await QRCode.toCanvas(canvas, text, { color: { dark: "#000000", light: "#ffffff" } });
  qrResult.appendChild(canvas);
  const btn = document.createElement("a");
  btn.textContent = "Download QR";
  btn.className = "btn";
  btn.download = "qr.png";
  btn.href = canvas.toDataURL();
  qrResult.appendChild(btn);
});
