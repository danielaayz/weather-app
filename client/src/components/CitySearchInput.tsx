import React, { useState } from "react";
import { FaSearch, FaRainbow } from "react-icons/fa";
import axios from "axios";
import { FaMapMarkerAlt } from "react-icons/fa";
//import IconBanner from "./IconBanner";

export interface CitySearchInputProps {
   city: string;
   setCity: React.Dispatch<React.SetStateAction<string>>;
   onSearch: (name?: string, country?: string) => Promise<void>;
}

interface City {
   name: string;
   country: string;
}

interface CityApiResponse {
   name: string;
   country: string;
   state?: string;
}

const CitySearchInput: React.FC<CitySearchInputProps> = ({
   city,
   setCity,
   onSearch,
}) => {
   const [suggestions, setSuggestions] = useState<City[]>([]);
   const [showIcon, setShowIcon] = useState(true);

   // Funktion för att hämta stadssökningar
   const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      setCity(inputValue);

      if (inputValue.length >= 2) {
         try {
            const response = await axios.get<CityApiResponse[]>(
               `http://localhost:5000/api/city-search?city=${inputValue}`
            );
            console.log(response.data);

            const filteredSuggestions: City[] = response.data
               .filter((city: CityApiResponse) =>
                  city.name.toLowerCase().includes(inputValue.toLowerCase())
               )
               .map((city: CityApiResponse) => ({
                  name: city.name,
                  country: city.country,
               }));
            //    .filter((city: City) => city.name && city.sys.country);

            // Filtrera bort dubbletter baserat på både stadens namn och land
            const uniqueSuggestions = filteredSuggestions.filter(
               (city, index, self) =>
                  index ===
                  self.findIndex(
                     (t) => t.name === city.name && t.country === city.country
                  )
            );

            setSuggestions(uniqueSuggestions);
         } catch (error) {
            console.error("Error fetching city suggestions", error);
         }
      } else {
         setSuggestions([]);
      }
   };

   // Funktion för att hantera formulärinlämning
   const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
      if (city.trim()) {
         setShowIcon(false);
         setSuggestions([]);
         onSearch();

         const [cityName, countryCode] = city
            .split(", ")
            .map((item) => item.trim());
         onSearch(cityName, countryCode);
      }
   };

   // Funktion för att hantera klick på en stad
   const handleSuggestionClick = (suggestion: City) => {
      setCity(`${suggestion.name}, ${suggestion.country}`);
      setSuggestions([]); // Dölj dropdown när användaren har valt en stad
      setShowIcon(false);
      onSearch(suggestion.name, suggestion.country);
   };

   return (
      <div className="relative mb-8">
         {/* Visa ikonen ovanför sökfältet om showIcon är true */}
         {showIcon && (
            <div className="flex justify-center mb-4">
               <FaRainbow className="text-5xl animate-fade-in" />
            </div>
         )}

         {/* Sökfält */}
         <form onSubmit={handleSubmit} className="relative ">
            <input
               type="text"
               value={city}
               onChange={handleInputChange}
               placeholder="Enter city name"
               className="w-full bg-transparent pl-10 pr-4 py-2 shadow-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 placeholder-gray-500"
            />
            <button
               type="submit"
               className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none">
               <FaSearch className="text-lg" />
            </button>
         </form>

         {/* Dropdown med stadförslag */}
         {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white shadow-md max-h-40 overflow-auto">
               {suggestions.map((suggestion, index) => (
                  <li
                     key={index}
                     onClick={() => handleSuggestionClick(suggestion)}
                     className="pl-10 pr-4 py-2 cursor-pointer hover:bg-gray-100 relative w-full border-b last:border-b-0">
                     <FaMapMarkerAlt className="absolute left-2.5 text-gray-500" />
                     <span className="text-left">
                        {suggestion.name}, {suggestion.country}
                     </span>
                  </li>
               ))}
            </ul>
         )}
         {suggestions.length === 0 && city.length >= 2 && (
            <div className="p-2 text-gray-500">No results where found.</div>
         )}
      </div>
   );
};

export default CitySearchInput;
