// qrpro.js
window.QRPRO = {
  saveLastQRText(text) {
    try { localStorage.setItem("lastQRText", text); } catch {}
  },
  loadLastQRText() {
    return localStorage.getItem("lastQRText") || "";
  },
  saveLastQRPng(dataUrl) {
    try { localStorage.setItem("lastQRPng", dataUrl); } catch {}
  },
  loadLastQRPng() {
    return localStorage.getItem("lastQRPng") || "";
  }
};
