import React, { useState, useCallback } from "react";
import axios from "axios";
import WeatherBackground from "./WeatherBackground";
import WeatherIcon from "./WeatherIcon";
import CitySearchInput from "./CitySearchInput";

export interface WeatherData {
   name: string;
   sys: {
      country: string;
   };
   main: {
      temp: number;
      temp_max: number;
      temp_min: number;
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
         setCity("");
      }
   }, [city]);

   // Formatera dagens datum
   const getFormattedDate = (): string => {
      const today = new Date();
      const options: Intl.DateTimeFormatOptions = {
         weekday: "long",
         year: "numeric",
         month: "short",
         day: "numeric",
      };
      return today.toLocaleDateString("en-GB", options);
   };

   return (
      <WeatherBackground weatherData={weatherData}>
         <div className="w-full max-w-md mx-auto p-4">
            {/* <form onSubmit={handleSubmit} className="relative mb-8">
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
            </form> */}
            <CitySearchInput
               city={city}
               setCity={setCity}
               onSearch={fetchWeather}
            />

            {/* Visa laddningsmeddelande, väderdata eller felmeddelande */}
            {loading ? (
               <p>Loading weather data...</p>
            ) : error ? (
               <p>{error}</p>
            ) : weatherData ? (
               <div className="text-left">
                  {/* Visa datum */}
                  <div className="mb-4">
                     <p className="text-sm sm:text-md md:text-xl font-medium text-gray-700">
                        {getFormattedDate()}
                     </p>
                  </div>
                  {/* Stadens namn */}
                  <h2 className="text-3xl  mb-[8px]">{weatherData.name}</h2>

                  {/* Land */}
                  <p className="text-sm text-gray-600 mb-4">
                     {weatherData.sys.country}
                  </p>

                  {/* Väderikonen */}
                  <div className="mb-4">
                     <WeatherIcon
                        weatherMain={weatherData.weather[0]?.main || null}
                     />
                  </div>

                  {/* Temperatur och annan väderinformation */}
                  <div className="text-[20px] font-light">
                     <p className="text-[50px] flex items-start">
                        {Math.round(weatherData.main.temp)}
                        <span className="text-sm ml-1 mt-[15px]">°C</span>
                     </p>
                     <p>{weatherData.weather[0].description}</p>
                     <p className="text-sm">
                        H: {Math.round(weatherData.main.temp_max)} L:{" "}
                        {Math.round(weatherData.main.temp_min)}
                     </p>
                  </div>
               </div>
            ) : (
               <p>Enter a city to get weather information.</p>
            )}
         </div>
      </WeatherBackground>
   );
};

export default Weather;
