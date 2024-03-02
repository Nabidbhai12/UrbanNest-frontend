import React, { useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { Text } from "./text";

const propertyTypes = {
  Residential: ["House", "Penthouse", "Studio", "Plot", "Duplex", "Room"],
  Commercial: [
    "Office",
    "Shop",
    "Floor",
    "Apartment",
    "Plaza",
    "Plot",
    "Building",
    "Warehouse",
    "Factory",
  ],
};

const PropertyTypeDropdown = ({onTypeSelect, onClassSelect}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [currentSection, setCurrentSection] = useState("Residential");

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectType = (type) => {
    setSelectedType(type);
    setIsOpen(false); // Optionally close dropdown upon selection
    onClassSelect(type);
  };

  const resetSelection = () => setSelectedType(null);
  const changeSection = (section) => {
    setCurrentSection(section);
    onTypeSelect(section);
  }

  const createButtonLabel = () => selectedType || "Select Property Type";

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="bg-white-A700 items-center border border-black border-opacity-30 opacity-60 justify-center flex w-[350px] h-[45px] rounded-[10px] font-extrabold font-manrope"
      >
        {createButtonLabel()}
        <BiChevronDown
          size={20}
          className={`${
            isOpen && "rotate-180 transition-transform duration-100"
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute mt-1 bg-gray-51 shadow-lg p-4 rounded-md w-full">
          <div className="flex flex-row w-full">
            <Text className="font-extrabold font-manrope opacity-60 pb-[20px]">
              Type
            </Text>
          </div>
          <div className="flex flex-row border border-black border-opacity-30 rounded-[10px]">
            <button
              onClick={() => changeSection("Residential")}
              className={`w-1/2 p-2 my-[3px] mx-[5px] rounded-md font-semibold font-manrope ${
                currentSection === "Residential"
                  ? "bg-black text-white-A700 font-semibold font-manrope"
                  : "bg-gray-51 font-semibold font-manrope"
              }`}
            >
              Residential
            </button>
            <button
              onClick={() => changeSection("Commercial")}
              className={`w-1/2 p-2 my-[3px] mx-[5px] rounded-md font-semibold font-manrope ${
                currentSection === "Commercial"
                  ? "bg-black text-white-A700 font-semibold font-manrope"
                  : "bg-gray-51 font-semibold font-manrope"
              }`}
            >
              Commercial
            </button>
          </div>
          <div className="flex flex-row w-full">
            <Text className="font-extrabold font-manrope opacity-60 pt-[20px] pb-[20px]">
              Class
            </Text>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4 font-semibold font-manrope">
            {propertyTypes[currentSection].map((type) => (
              <button
                key={type}
                onClick={() => selectType(type)}
                className={`p-2 rounded-md border-2 ${
                  selectedType === type
                    ? "bg-black text-white-A700 font-semibold font-manrope"
                    : "bg-gray-51 font-semibold font-manrope"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="flex justify-between">
            <button
              onClick={resetSelection}
              className="bg-gray-51 border border-black border-opacity-30 font-extrabold font-manrope hover:bg-red-600 text-white p-2 rounded-md w-1/2"
            >
              Reset
            </button>
            <button
              onClick={toggleDropdown}
              className="bg-gray-51 border border-black border-opacity-30 font-extrabold font-manrope hover:bg-green-500 text-black p-2 rounded-md w-1/2"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyTypeDropdown;
