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
      signal = "DEKAT BRN - tung
