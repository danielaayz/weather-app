import React from "react";
import { WeatherData } from "./Weather";

interface WeatherBackgroundProps {
   weatherData: WeatherData | null;
   children: React.ReactNode;
}

const WeatherBackground: React.FC<WeatherBackgroundProps> = ({
   weatherData,
   children,
}) => {
   // Funktion för att bestämma bakgrundfärg baserat på väder
   const getBackgroundColor = (): string => {
      if (!weatherData || !weatherData.weather[0]) {
         // Standard bakgrundsfärg
         return "#D5D9D4";
      }
      // Hämtar väderbeskrivningen från det första elementen i weather-arrayen
      const weatherMain = weatherData.weather[0].main;

      // switch-sats för att returnera olika bakgrundsfärger beroende på vädret
      switch (weatherMain.toLowerCase()) {
         case "clear":
            return "bg-[#FFF1C7]";
         case "clouds":
            return "bg-[#D9D9D9]";
         case "rain":
            return "bg-[#C2DFF0]";
         case "snow":
            return "bg-[#E0F7FA]";
         case "thunderstorm":
            return "bg-[#50597B]";
         case "mist":
         case "fog":
            return "bg-[#E6E6E6]";
         default:
            return "#D5D9D4";
      }
   };

   return (
      <>
         <div
            className={`${getBackgroundColor()} min-h-screen transition-colors duration-500 flex flex-col justify-center items-center`}>
            {children}
         </div>
      </>
   );
};

export default WeatherBackground;
