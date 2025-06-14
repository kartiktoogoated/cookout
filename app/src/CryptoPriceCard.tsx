import { useEffect, useState } from "react";
import axios from "axios";

const coins = ["bitcoin", "ethereum", "solana", "dogecoin"];

export default function CryptoPriceCard() {
  const [coin, setCoin] = useState("solana");
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPrice = async (selectedCoin: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/crypto-price`, {
        params: { coin: selectedCoin },
      });
      setPrice(data.price);
    } catch (err) {
      console.error("Error fetching price:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrice(coin);
  }, [coin]);

  return (
    <div>
      <h2>Live Crypto Price (INR)</h2>
      <select value={coin} onChange={(e) => setCoin(e.target.value)}>
        {coins.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <div style={{ marginTop: "1rem" }}>
        {loading ? (
          <p>Loading...</p>
        ) : price !== null ? (
          <p>
            <strong>{coin.toUpperCase()}</strong>: ₹{price.toLocaleString()}
          </p>
        ) : (
          <p>No data</p>
        )}
      </div>
    </div>
  );
}
