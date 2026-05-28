import { useState } from "react";

export default function App() {
  const [price, setPrice] = useState("");
  const [timeframe, setTimeframe] = useState("H1");
  const [result, setResult] = useState(null);

  function getThreshold(tf) {
    if (tf === "M1") return 2;
    if (tf === "H1") return 5;
    if (tf === "H4") return 10;
    if (tf === "H8") return 15;
    return 5;
  }

  function getLevels(price) {
    const base = Math.floor(price / 100) * 100;
    return [base, base + 25, base + 50, base + 75, base + 100];
  }

  function nearest(price, levels) {
    let n = levels[0];
    let d = Math.abs(price - n);

    for (let i = 1; i < levels.length; i++) {
      const dist = Math.abs(price - levels[i]);
      if (dist < d) {
        d = dist;
        n = levels[i];
      }
    }
    return n;
  }

  function analyze() {
    const p = parseFloat(price);

    if (isNaN(p)) {
      setResult("Sila masukkan harga yang betul");
      return;
    }

    const levels = getLevels(p);
    const n = nearest(p, levels);
    const diff = p - n;
    const threshold = getThreshold(timeframe);

    let signal = "NO TRADE";

    if (Math.abs(diff) <= threshold) {
      signal = "DEKAT BRN - tunggu confirmation candle";
    } else if (diff > 0) {
      signal = "SELL bias - cari rejection";
    } else {
      signal = "BUY bias - cari rejection";
    }

    setResult({
      price: p,
      timeframe,
      base: Math.floor(p / 100) * 100,
      levels,
      nearest: n,
      signal
    });
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial", background: "#0f0f0f", minHeight: "100vh", color: "white" }}>
      <h2>BRN Trading Assistant</h2>

      <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
        <option value="M1">M1</option>
        <option value="H1">H1</option>
        <option value="H4">H4</option>
        <option value="H8">H8</option>
      </select>

      <br /><br />

      <input
        placeholder="Gold price contoh 4373.17"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={{ padding: 8 }}
      />

      <br /><br />

      <button onClick={analyze} style={{ padding: 10, background: "blue", color: "white" }}>
        Analyze Market
      </button>

      <br /><br />

      {result && typeof result === "object" && (
        <div>
          <p>Timeframe: {result.timeframe}</p>
          <p>Price: {result.price}</p>
          <p>BRN Base: {result.base}</p>
          <p>Nearest BRN: {result.nearest}</p>
          <p><b>{result.signal}</b></p>
          <p>Levels: {result.levels.join(" / ")}</p>
        </div>
      )}

      {typeof result === "string" && <p>{result}</p>}
    </div>
  );
}
