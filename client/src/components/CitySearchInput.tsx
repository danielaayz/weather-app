import React, { useState } from "react";
import { FaSearch, FaRainbow } from "react-icons/fa";
import axios from "axios";
//import IconBanner from "./IconBanner";

export interface CitySearchInputProps {
   city: string;
   setCity: React.Dispatch<React.SetStateAction<string>>;
   onSearch: () => Promise<void>;
}

interface City {
   name: string;
   country: string;
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
            const response = await axios.get(
               `http://localhost:5000/api/city-search?city=${inputValue}`
            );

            const filteredSuggestions: City[] = response.data
               .filter((city: City) =>
                  city.name.toLowerCase().startsWith(inputValue.toLowerCase())
               )
               .map((city: City) => ({
                  name: city.name,
                  country: city.country,
               }));

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

   // Funktion för att hantera ändringar i inputfältet
   //    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
   //       setCity(e.target.value);
   //    };

   // Funktion för att hantera formulärinlämning
   const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
      if (city.trim()) {
         setShowIcon(false);
         setSuggestions([]);
         onSearch();
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
         <form onSubmit={handleSubmit} className="relative mb-8">
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

         {/* Dropdown med stadförslag */}
         {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white shadow-md max-h-40 overflow-auto rounded-md">
               {suggestions.map((suggestion, index) => (
                  <li
                     key={index}
                     onClick={() => handleSuggestionClick(suggestion)}
                     className="p-2 cursor-pointer hover:bg-gray-100">
                     {suggestion.name}, {suggestion.country}
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
};

export default CitySearchInput;
