import React, { useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { Text } from "./text";

// Adjusted for area options in square feet
const areaOptions = [
  0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000,
]; // Add more options as needed

const AreaDropdown = ({ onAreaSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [minArea, setMinArea] = useState(0);
  const [maxArea, setMaxArea] = useState("Any");
  const [isMinDropdownOpen, setIsMinDropdownOpen] = useState(false);
  const [isMaxDropdownOpen, setIsMaxDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    onAreaSelect(minArea, maxArea); // Ensure you define onAreaSelect in your parent component
  };
  const toggleMinDropdown = () => {
    if (!isMinDropdownOpen) setIsMaxDropdownOpen(false);
    setIsMinDropdownOpen(!isMinDropdownOpen);
  };
  const toggleMaxDropdown = () => {
    if (!isMaxDropdownOpen) setIsMinDropdownOpen(false);
    setIsMaxDropdownOpen(!isMaxDropdownOpen);
  };
  const selectMinArea = (area) => {
    setMinArea(area);
    setIsMinDropdownOpen(false);
  };
  const selectMaxArea = (area) => {
    setMaxArea(area);
    setIsMaxDropdownOpen(false);
  };
  const resetSelection = () => {
    setMinArea(0);
    setMaxArea("Any");
  };

  const createLabel = () => {
    const minText = minArea !== 0 ? `${minArea.toLocaleString()} sq ft` : "0";
    const maxText = maxArea !== "Any" ? `${maxArea.toLocaleString()} sq ft` : "Any";
    return `Area: ${minText} - ${maxText}`;
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="bg-white-A700 items-center border border-black border-opacity-30 opacity-60 justify-center flex w-[350px] h-[45px] rounded-[10px] font-extrabold font-manrope"
      >
        {createLabel()}
        <BiChevronDown
          size={20}
          className={`${isOpen && "rotate-180 transition-transform duration-100"}`}
        />
      </button>

      {isOpen && (
        <div className="absolute mt-1 bg-gray-51 shadow-lg p-4 rounded-md">
          {/* Minimum and Maximum dropdown for area */}
          <div className="flex flex-row gap-[91px]">
            <Text className="font-extrabold font-manrope opacity-60 pb-[20px]">Minimum</Text>
            <Text className="font-extrabold font-manrope opacity-60 pb-[20px]">Maximum</Text>
          </div>
          {/* Dropdowns for selecting min and max area */}
          <div className="flex gap-2 mb-4 relative">
            {/* Min Area Dropdown */}
            <div className="flex-1">
              <input
                type="text"
                value={minArea}
                readOnly
                onClick={toggleMinDropdown}
                className="border-black border-2 p-2 rounded-md w-full cursor-pointer border-opacity-30 bg-gray-51"
                placeholder="Minimum"
              />
              {isMinDropdownOpen && (
                <div className="absolute bg-white-A700 shadow-lg p-2 rounded-md w-[150px] max-h-40 overflow-y-auto">
                  {areaOptions.map((area, index) => (
                    <button
                      key={index}
                      onClick={() => selectMinArea(area)}
                      className={`block p-2 rounded-md w-full text-left ${minArea === area ? "bg-black text-white-A700 font-semibold font-manrope" : "bg-gray-51 font-semibold font-manrope"}`}
                    >
                      {area.toLocaleString()} sq ft
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Max Area Dropdown */}
            <div className="flex-1">
              <input
                type="text"
                value={maxArea}
                readOnly
                onClick={toggleMaxDropdown}
                className="border-2 border-black border-opacity-30 bg-gray-51 p-2 rounded-md w-full cursor-pointer"
                placeholder="Maximum"
              />
              {isMaxDropdownOpen && (
                <div className="absolute bg-white-A700 shadow-lg p-2 rounded-md w-[150px] max-h-40 overflow-y-auto">
                  {areaOptions.map((area, index) => (
                    <button
                      key={index}
                      onClick={() => selectMaxArea(area === 0 ? "Any" : area)}
                      className={`block p-2 rounded-md w-full text-left ${maxArea === area ? "bg-black text-white-A700 font-semibold font-manrope" : "bg-gray-51 font-semibold font-manrope"}`}
                    >
                      {area === 0 ? "Any" : `${area.toLocaleString()} sq ft`}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Reset and Done buttons */}
          <div className="flex justify-between w-full">
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

export default AreaDropdown;
