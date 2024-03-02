import React, { useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { Text } from "./text";

const bedOptions = ["1", "2", "3", "4", "5", "6", "7", "8+"];
const bathOptions = ["1", "2", "3", "4", "5", "6+"];

const DropdownMenu = ({ propertyType, onBedBathSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBeds, setSelectedBeds] = useState("");
  const [selectedBaths, setSelectedBaths] = useState("");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    onBedBathSelect(selectedBeds, selectedBaths);
  }
  const selectBeds = (beds) => {
    setSelectedBeds(beds);
    //setIsOpen(false); // Optional: close dropdown upon selection
  };
  const selectBaths = (baths) => {
    setSelectedBaths(baths);
    //setIsOpen(false); // Optional: close dropdown upon selection
  };
  const resetSelection = () => {
    setSelectedBeds("");
    setSelectedBaths("");
  };

  console.log(typeof propertyType);
  // Function to create the label for the button
  const createButtonLabel = () => {
    if (propertyType === "Residential") {
      const bedText = selectedBeds
        ? `${selectedBeds} Bed${
            selectedBeds !== "Studio" && selectedBeds !== "1" ? "s" : ""
          }`
        : "";
      const bathText = selectedBaths
        ? `${selectedBaths} Bath${selectedBaths !== "1" ? "s" : ""}`
        : "";

      if (bedText && bathText) {
        return `${bedText} & ${bathText}`;
      }
      return bedText || bathText || "Beds & Baths";
    } else {
      const bedText = selectedBeds
        ? `${selectedBeds} Room${
            selectedBeds !== "Studio" && selectedBeds !== "1" ? "s" : ""
          }`
        : "";
      const bathText = selectedBaths
        ? `${selectedBaths} Washroom${selectedBaths !== "1" ? "s" : ""}`
        : "";

      if (bedText && bathText) {
        return `${bedText} & ${bathText}`;
      }
      return bedText || bathText || "Rooms & Washrooms";
    }

    //return `${bedText} & ${bathText}`.trim() || 'Beds & Baths';
  };

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
        <div className="absolute mt-1 bg-gray-51 shadow-lg p-4 rounded-md">
          <div className="flex flex-row w-full">
            <Text className="font-extrabold font-manrope opacity-60 pb-[20px]">
              {propertyType === "Residential" ? "Bed" : "Room"}
            </Text>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {bedOptions.map((bed, index) => (
              <button
                key={index}
                onClick={() => selectBeds(bed)}
                className={`p-2 rounded-md border-2 ${
                  selectedBeds === bed
                    ? "bg-black text-white-A700 font-semibold font-manrope"
                    : "bg-gray-51 font-semibold font-manrope"
                }`}
              >
                {bed}
              </button>
            ))}
          </div>
          <div className="flex flex-row w-full">
            <Text className="font-extrabold font-manrope opacity-60 pb-[20px]">
              {propertyType === "Residential" ? "Bath" : "Washroom"}
            </Text>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {bathOptions.map((bath, index) => (
              <button
                key={index}
                onClick={() => selectBaths(bath)}
                className={`p-2 rounded-md border-2 ${
                  selectedBaths === bath
                    ? "bg-black text-white-A700 font-semibold font-manrope"
                    : "bg-gray-51 font-semibold font-manrope"
                }`}
              >
                {bath}
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

export default DropdownMenu;
