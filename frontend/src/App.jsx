import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import jsQR from "jsqr";

export default function App() {
  const [content, setContent] = useState("https://example.com");
  const [qrList, setQrList] = useState([]);
  const [aiInput, setAiInput] = useState("business website");
  const [aiOut, setAiOut] = useState("");
  const [decodeText, setDecodeText] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load history from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("qr_history")) || [];
    setQrList(saved);
  }, []);

  // Save history
  const saveHistory = (newList) => {
    setQrList(newList);
    localStorage.setItem("qr_history", JSON.stringify(newList));
  };

  const handleGen = () => {
    if (!content.trim()) return;
    const entry = { text: content, date: new Date().toLocaleString() };
    const updated = [entry, ...qrList];
    saveHistory(updated);
    setMessage("✅ QR Generated!");
  };

  const handleDownload = (text) => {
    const canvas = document.getElementById(`qr-${text}`);
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `qr-${text}.png`;
    link.click();
  };

  const handleAI = () => {
    setLoading(true);
    setMessage("");
    setTimeout(() => {
      setAiOut(
        `💡 Suggested content for "${aiInput}": https://${aiInput.replace(/\s+/g, "")}.com`
      );
      setLoading(false);
    }, 800);
  };

  const handleDecode = (file) => {
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        if (code) {
          setDecodeText(code.data);
        } else {
          setMessage("❌ No QR detected!");
        }
        setLoading(false);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleShorten = () => {
    if (!content.trim()) return;
    const fakeCode = btoa(content).slice(0, 6);
    const short = `https://qr.pro/${fakeCode}`;
    setShortUrl(short);
  };

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        padding: 20,
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: "rgba(255,255,255,0.1)",
          borderRadius: 16,
          padding: 24,
          backdropFilter: "blur(10px)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: 24 }}>🚀 QR Pro</h1>

        {message && (
          <div
            style={{
              padding: 12,
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.3)",
              marginBottom: 12,
              borderRadius: 8,
            }}
          >
            {message}
          </div>
        )}
        {loading && <div>⏳ Loading...</div>}

        {/* Generate */}
        <section
          style={{
            marginBottom: 24,
            padding: 16,
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 12,
          }}
        >
          <h2>Generate QR</h2>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 6,
              border: "none",
              marginBottom: 8,
            }}
          />
          <button
            onClick={handleGen}
            style={{
              padding: "8px 12px",
              background: "#fff",
              color: "#333",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
            }}
          >
            Generate
          </button>
        </section>

        {/* AI Suggest */}
        <section
          style={{
            marginBottom: 24,
            padding: 16,
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 12,
          }}
        >
          <h2>AI Suggestion</h2>
          <input
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 6,
              border: "none",
              marginBottom: 8,
            }}
          />
          <button
            onClick={handleAI}
            style={{
              padding: "8px 12px",
              background: "#fff",
              color: "#333",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
            }}
          >
            Get Suggestion
          </button>
          {aiOut && (
            <pre
              style={{
                whiteSpace: "pre-wrap",
                marginTop: 12,
                background: "rgba(255,255,255,0.15)",
                padding: 8,
                borderRadius: 6,
              }}
            >
              {aiOut}
            </pre>
          )}
        </section>

        {/* Decode */}
        <section
          style={{
            marginBottom: 24,
            padding: 16,
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 12,
          }}
        >
          <h2>Decode QR</h2>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleDecode(e.target.files?.[0])}
          />
          {decodeText && (
            <div style={{ marginTop: 12 }}>
              <strong>Decoded:</strong> {decodeText}
            </div>
          )}
        </section>

        {/* Shorten */}
        <section
          style={{
            marginBottom: 24,
            padding: 16,
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 12,
          }}
        >
          <h2>Short Link</h2>
          <button
            onClick={handleShorten}
            style={{
              padding: "8px 12px",
              background: "#fff",
              color: "#333",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
            }}
          >
            Create Short Link
          </button>
          {shortUrl && (
            <div style={{ marginTop: 8 }}>
              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#ffeb3b" }}
              >
                {shortUrl}
              </a>
            </div>
          )}
        </section>

        {/* History */}
        <section
          style={{
            marginBottom: 24,
            padding: 16,
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 12,
          }}
        >
          <h2>History</h2>
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            }}
          >
            {qrList.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: 12,
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 8,
                  textAlign: "center",
                  background: "rgba(255,255,255,0.1)",
                }}
              >
                <QRCode id={`qr-${item.text}`} value={item.text} size={128} />
                <p style={{ fontSize: 12, wordBreak: "break-word", marginTop: 8 }}>
                  {item.text}
                </p>
                <p style={{ fontSize: 11, opacity: 0.8 }}>{item.date}</p>
                <button
                  onClick={() => handleDownload(item.text)}
                  style={{
                    marginTop: 6,
                    padding: "4px 8px",
                    fontSize: 12,
                    border: "none",
                    borderRadius: 6,
                    background: "#fff",
                    color: "#333",
                    cursor: "pointer",
                  }}
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import jsQR from "jsqr";

export default function App() {
  const [content, setContent] = useState("https://example.com");
  const [qrList, setQrList] = useState([]);
  const [aiInput, setAiInput] = useState("business website");
  const [aiOut, setAiOut] = useState("");
  const [decodeText, setDecodeText] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load history
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("qr_history")) || [];
    setQrList(saved);
  }, []);

  // Save history
  const saveHistory = (newList) => {
    setQrList(newList);
    localStorage.setItem("qr_history", JSON.stringify(newList));
  };

  const handleGen = () => {
    if (!content.trim()) return;
    const entry = { text: content, date: new Date().toLocaleString() };
    const updated = [entry, ...qrList];
    saveHistory(updated);
    setMessage("QR Generated!");
  };

  const handleDownload = (text) => {
    const canvas = document.getElementById(`qr-${text}`);
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `qr-${text}.png`;
    link.click();
  };

  const handleAI = () => {
    setLoading(true);
    setMessage("");
    const start = Date.now();

    setTimeout(() => {
      setAiOut(`Suggested content for "${aiInput}": https://${aiInput.replace(/\s+/g, "")}.com`);
      // 👇 ensure loading shows at least 1s
      const elapsed = Date.now() - start;
      const delay = elapsed < 1000 ? 1000 - elapsed : 0;
      setTimeout(() => setLoading(false), delay);
    }, 800);
  };

  const handleDecode = (file) => {
    if (!file) return;
    setLoading(true);
    const start = Date.now();

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        if (code) {
          setDecodeText(code.data);
        } else {
          setMessage("No QR detected!");
        }

        // 👇 ensure minimum duration visible
        const elapsed = Date.now() - start;
        const delay = elapsed < 1000 ? 1000 - elapsed : 0;
        setTimeout(() => setLoading(false), delay);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleShorten = () => {
    if (!content.trim()) return;
    const fakeCode = btoa(content).slice(0, 6);
    const short = `https://qr.pro/${fakeCode}`;
    setShortUrl(short);
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h1>🚀 QR Pro — Frontend Only</h1>

      {/* ✅ Loading Overlay */}
      {loading && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "20px",
          fontWeight: "bold",
          zIndex: 1000,
          animation: "fadeIn 0.3s ease"
        }}>
          ⏳ Processing...
        </div>
      )}

      {message && (
        <div style={{ padding: 12, background: "#eef", border: "1px solid #99f", marginBottom: 12 }}>
          {message}
        </div>
      )}

      {/* Generate */}
      <section style={{ marginBottom: 24, padding: 16, border: "1px solid #ddd" }}>
        <h2>Generate QR</h2>
        <input value={content} onChange={(e) => setContent(e.target.value)} style={{ width: "100%", padding: 8 }} />
        <button onClick={handleGen} style={{ marginTop: 8 }}>Generate</button>
      </section>

      {/* AI Suggest */}
      <section style={{ marginBottom: 24, padding: 16, border: "1px solid #ddd" }}>
        <h2>AI Suggestion</h2>
        <input value={aiInput} onChange={(e) => setAiInput(e.target.value)} style={{ width: "100%", padding: 8 }} />
        <button onClick={handleAI} style={{ marginTop: 8 }}>Get Suggestion</button>
        {aiOut && <pre style={{ whiteSpace: "pre-wrap", marginTop: 12 }}>{aiOut}</pre>}
      </section>

      {/* Decode */}
      <section style={{ marginBottom: 24, padding: 16, border: "1px solid #ddd" }}>
        <h2>Decode QR</h2>
        <input type="file" accept="image/*" onChange={(e) => handleDecode(e.target.files?.[0])} />
        {decodeText && <div style={{ marginTop: 12 }}><strong>Decoded:</strong> {decodeText}</div>}
      </section>

      {/* Shorten */}
      <section style={{ marginBottom: 24, padding: 16, border: "1px solid #ddd" }}>
        <h2>Short Link</h2>
        <button onClick={handleShorten}>Create Short Link</button>
        {shortUrl && (
          <div style={{ marginTop: 8 }}>
            <a href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a>
          </div>
        )}
      </section>

      {/* History */}
      <section style={{ marginBottom: 24, padding: 16, border: "1px solid #ddd" }}>
        <h2>History</h2>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
          {qrList.map((item, idx) => (
            <div key={idx} style={{ padding: 12, border: "1px solid #ccc", borderRadius: 8, textAlign: "center" }}>
              <QRCode id={`qr-${item.text}`} value={item.text} size={128} />
              <p style={{ fontSize: 12, wordBreak: "break-word", marginTop: 8 }}>{item.text}</p>
              <p style={{ fontSize: 11, color: "#555" }}>{item.date}</p>
              <button onClick={() => handleDownload(item.text)} style={{ marginTop: 6, padding: "4px 8px", fontSize: 12 }}>Download</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Scanner from "./pages/Scanner";
import Cube from "./pages/Cube";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/cube" element={<Cube />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
