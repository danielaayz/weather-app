import React from "react";
import {
   FaSun,
   FaCloud,
   FaCloudRain,
   FaSnowflake,
   FaBolt,
   FaSmog,
} from "react-icons/fa";

export interface WeatherIconProps {
   weatherMain: string | null;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ weatherMain }) => {
   if (!weatherMain) return null;

   switch (weatherMain.toLowerCase()) {
      case "clear":
         return <FaSun className="text-yellow-500 text-[150px]" />;
      case "clouds":
         return <FaCloud className="text-gray-500 text-[150px]" />;
      case "rain":
         return <FaCloudRain className="text-blue-500 text-[150px]" />;
      case "snow":
         return <FaSnowflake className="text-blue-300 text-[150px]" />;
      case "thunderstorm":
         return <FaBolt className="text-yellow-600 text-[150px]" />;
      case "mist":
      case "fog":
         return <FaSmog className="text-gray-400 text-[150px]" />;
      default:
         return null;
   }
};

export default WeatherIcon;
