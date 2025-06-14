import { useEffect, useState } from "react";
import axios from "axios";

export default function WeatherCard() {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    axios.get("/api/weather?city=Noida").then((res) => {
      setWeather(res.data); // clean, custom-shaped response
    });    
  }, []);

  if (!weather) return <p>Loading...</p>;

  return (
    <div>
      <h1>{weather.name}</h1>
      <p>{weather.weather[0].description}</p>
      <p>{weather.main.temp} °C</p>
    </div>
  );
}
