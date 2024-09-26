import React, { useState, useCallback } from "react";
import axios from "axios";
import WeatherBackground from "./WeatherBackground";
import { FaSearch } from "react-icons/fa";

export interface WeatherData {
   name: string;
   main: {
      temp: number;
      humidity: number;
   };
   weather: Array<{
      description: string;
      main: string;
   }>;
}

const Weather: React.FC = () => {
   // En variabel som lagrar namnet på den stad som användaren anger. Initialiseras med en tom sträng.
   const [city, setCity] = useState<string>("");
   // Lagrar väderdata när den hämtas.
   const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
   // Lagrar eventuella felmeddelanden som kan uppstå.
   const [error, setError] = useState<string | null>(null);
   // Loading tillstånd
   const [loading, setLoading] = useState<boolean>(false);

   // En asynkron funktion, som hämtar väderdata från servern.
   const fetchWeather = useCallback(async (): Promise<void> => {
      // Loading true vid API-anrop
      setLoading(true);
      // Försöker att hämta data med axios.
      try {
         // Typa axios-svaret för att matcha WeatherData
         const response = await axios.get<WeatherData>(
            `http://localhost:5000/api/weather?city=${city}`
         );
         // Om anropet lyckas, sätt weatherData till svaret från servern och error sätts till null
         setWeatherData(response.data);
         console.log(response.data);
         setError(null);
         // Om det uppstår ett fel sätt error med ett felmeddelande och weatherData sätt till null.
      } catch (error: unknown) {
         // Kontrollera om felet är ett AxiosError
         if (axios.isAxiosError(error) && error.response) {
            setError("City not found or server error");
         } else {
            setError("Network error or server is down");
         }
         setWeatherData(null);
      } finally {
         // Slå av loading när anropet är klart
         setLoading(false);
      }
   }, [city]);

   // Funktion som hanterar ändringar i inputfältet
   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      setCity(e.target.value);
   };

   // Funktion som anropas när användaren klickar på knappen
   const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
      if (city.trim()) {
         fetchWeather();
         setCity("");
      }
   };

   return (
      <WeatherBackground weatherData={weatherData}>
         <div>
            <form onSubmit={handleSubmit} className="relative">
               <input
                  type="text"
                  value={city}
                  onChange={handleInputChange}
                  placeholder="Enter city name"
                  className="w-full bg-transparent pl-10 pr-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300 placeholder-gray-500"
               />
               <button
                  type="submit"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none">
                  <FaSearch className="text-lg" />
               </button>
            </form>

            {/* Visa laddningsmeddelande, väderdata eller felmeddelande */}
            {loading ? (
               <p>Loading weather data...</p>
            ) : error ? (
               <p>{error}</p>
            ) : weatherData ? (
               <div>
                  <h2>{weatherData.name}</h2>
                  <p>{weatherData.main.temp}°C</p>
                  <p>Condition: {weatherData.weather[0].description}</p>
                  <p>Humidity: {weatherData.main.humidity}%</p>
               </div>
            ) : (
               <p>Enter a city to get weather information.</p>
            )}
         </div>
      </WeatherBackground>
   );
};

export default Weather;
