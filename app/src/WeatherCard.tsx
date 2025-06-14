import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

interface WeatherRespone {
  city: string;
  temp: number;
  condition: string;
}

export default function WeatherCard() {
  const [city] = useState("Noida");
  const [data, setData] = useState<WeatherRespone | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {

    } catch(err: any) {
      
    }
  })
}
