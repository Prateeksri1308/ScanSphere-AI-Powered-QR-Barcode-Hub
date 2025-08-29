/* ============================================================
   QR Pro — AI Utilities (Offline-first, no server required)
   ------------------------------------------------------------
   Provides:
   • Brand color extraction from logos
   • Smart text/content suggestions (templates + tones)
   • Copy improver
   • Optional cloud LLM hook
   • URL safety heuristics
   ============================================================ */
window.QRAI = (function () {
  /* ---------- Brand color from logo (dominant color) ---------- */
  async function extractBrandFromFile(file) {
    // Basic sanity check: reject very large files (e.g. >5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File too large (max 5MB)");
    }

    const img = await fileToImage(file);
    const c = document.createElement("canvas");
    const s = 120; // downscale for speed
    c.width = s;
    c.height = s;
    const g = c.getContext("2d", { willReadFrequently: true });
    g.drawImage(img, 0, 0, s, s);

    const data = g.getImageData(0, 0, s, s).data;
    const buckets = {};

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i],
        g1 = data[i + 1],
        b = data[i + 2],
        a = data[i + 3];
      if (a < 10) continue; // ignore transparency
      const key = `${r >> 4}-${g1 >> 4}-${b >> 4}`;
      buckets[key] = (buckets[key] || 0) + 1;
    }

    const [key] =
      Object.entries(buckets).sort((a, b) => b[1] - a[1])[0] || [["8-8-8"]];
    const [r, g2, b] = key.split("-").map((n) => (parseInt(n, 10) << 4) + 8);

    const hex = toHex(r, g2, b);
    return {
      color: hex,
      gradient: `linear-gradient(135deg, ${hex} 0%, ${tint(hex, 0.25)} 100%)`,
    };
  }

  function fileToImage(file) {
    return new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => {
        const im = new Image();
        im.onload = () => res(im);
        im.onerror = rej;
        im.src = fr.result;
      };
      fr.onerror = rej;
      fr.readAsDataURL(file);
    });
  }

  function toHex(r, g, b) {
    return (
      "#" +
      [r, g, b]
        .map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0"))
        .join("")
    );
  }

  function hexToRgb(hex) {
    hex = hex.replace("#", "");
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }

  function tint(hex, amt) {
    const { r, g, b } = hexToRgb(hex);
    const mix = (c) => Math.round(c + (255 - c) * amt);
    return toHex(mix(r), mix(g), mix(b));
  }

  /* ---------- “AI” content templates (offline) ---------- */
  const templates = {
    industries: {
      restaurant: [
        "Explore seasonal dishes crafted daily — scan for menu + reservations.",
        "Fresh • Local • Hand-made — scan to order now.",
      ],
      ecommerce: [
        "Shop the drop — exclusive launch inside.",
        "Scan for fast checkout, limited stock.",
      ],
      education: [
        "Enroll in our next cohort — scan for syllabus + dates.",
        "Learn faster with micro-lessons — scan to preview.",
      ],
      events: [
        "Your pass to VIP perks — scan to add to calendar.",
        "Find stage times, maps, and offers — scan inside.",
      ],
    },
    tones: {
      friendly: (t) => t,
      bold: (t) =>
        t.replace(/\b(?:scan)\b/gi, "SCAN").replace(/—/g, " — "),
      luxury: (t) => "◦ " + t.replace(/\bscan\b/gi, "discover") + " ◦",
    },
  };

  function suggestContent(industry = "events", tone = "friendly") {
    const list = templates.industries[industry] || templates.industries.events;
    const pick = list[Math.floor(Math.random() * list.length)];
    return (templates.tones[tone] || templates.tones.friendly)(pick);
  }

  function improveCopy(text, tone = "friendly") {
    if (!text) return "";
    let out = text
      .trim()
      .replace(/\s+/g, " ")
      .replace(/\.\s*$/, "")
      .replace(/^./, (c) => c.toUpperCase());
    out = out + ".";
    return (templates.tones[tone] || ((x) => x))(out);
  }

  /* ---------- Optional cloud LLM hook ---------- */
  async function callLLM(prompt) {
    // Replace with your endpoint (example: "/api/ai" or full URL)
    const ENDPOINT = "";
    if (!ENDPOINT) return null;
    try {
      const r = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!r.ok) return null;
      const j = await r.json();
      return j.text || null;
    } catch {
      return null;
    }
  }

  /* ---------- URL safety heuristics ---------- */
  function checkUrlSafety(value) {
    const url = value?.trim() || "";
    const res = { isUrl: false, ok: true, reasons: [] };

    const rx = /^(https?:\/\/|www\.)[^\s/$.?#].[^\s]*$/i;
    res.isUrl = rx.test(url);
    if (!res.isUrl) return res;

    const s = url.toLowerCase();
    const badTlds = [".zip", ".mov", ".xyz"];
    if (badTlds.some((t) => s.endsWith(t))) {
      res.ok = false;
      res.reasons.push("Uncommon or risky TLD");
    }
    if (s.includes("@")) {
      res.ok = false;
      res.reasons.push("Suspicious @ in URL");
    }
    if (/(?:\d{1,3}\.){3}\d{1,3}/.test(s))
      res.reasons.push("Raw IP address");
    if (!/^https:\/\//.test(s))
      res.reasons.push("Not HTTPS");

    if (res.reasons.length) res.ok = false;
    return res;
  }

  /* ---------- Public API ---------- */
  return {
    extractBrandFromFile,
    suggestContent,
    improveCopy,
    callLLM,
    checkUrlSafety,
    tint,
  };
})();
