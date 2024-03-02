import React, { useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { Text } from "./text";

const priceOptions = [
  0, 250000, 500000, 750000, 950000, 1000000, 1250000, 1500000, 2000000,
]; // Add more options as needed

const PriceDropdown = ({ onPriceSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState("Any");
  const [isMinDropdownOpen, setIsMinDropdownOpen] = useState(false);
  const [isMaxDropdownOpen, setIsMaxDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    onPriceSelect(minPrice, maxPrice);
  };
  const toggleMinDropdown = () => {
    if (!isMinDropdownOpen) setIsMaxDropdownOpen(false);
    setIsMinDropdownOpen(!isMinDropdownOpen);
  };
  const toggleMaxDropdown = () => {
    if (!isMaxDropdownOpen) setIsMinDropdownOpen(false);
    setIsMaxDropdownOpen(!isMaxDropdownOpen);
  };
  const selectMinPrice = (price) => {
    setMinPrice(price);
    setIsMinDropdownOpen(false);
  };
  const selectMaxPrice = (price) => {
    setMaxPrice(price);
    setIsMaxDropdownOpen(false);
  };
  const resetSelection = () => {
    setMinPrice(0);
    setMaxPrice("Any");
  };

  const createLabel = () => {
    const minText = minPrice !== 0 ? `${minPrice.toLocaleString()} BDT` : "0";
    const maxText =
      maxPrice !== "Any" ? `${maxPrice.toLocaleString()} BDT` : "Any";
    return `Price: ${minText} - ${maxText}`;
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
          className={`${
            isOpen && "rotate-180 transition-transform duration-100"
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute mt-1 bg-gray-51 shadow-lg p-4 rounded-md">
          <div className="flex flex-row gap-[91px]">
            <Text className="font-extrabold font-manrope opacity-60 pb-[20px]">
              Minimum
            </Text>
            <Text className="font-extrabold font-manrope opacity-60 pb-[20px]">
              Maximum
            </Text>
          </div>
          <div className="flex gap-2 mb-4 relative">
            <div className="flex-1">
              <input
                type="text"
                value={minPrice}
                readOnly
                onClick={toggleMinDropdown}
                className="border-black border-2 p-2 rounded-md w-full cursor-pointer border-opacity-30 bg-gray-51"
                placeholder="Minimum"
              />
              {isMinDropdownOpen && (
                <div className="absolute bg-white-A700 shadow-lg p-2 rounded-md w-[150px] max-h-40 overflow-y-auto">
                  {priceOptions.map((price, index) => (
                    <button
                      key={index}
                      onClick={() => selectMinPrice(price)}
                      className={`block p-2 rounded-md w-full text-left ${
                        minPrice === price
                          ? "bg-black text-white-A700 font-semibold font-manrope"
                          : "bg-gray-51 font-semibold font-manrope"
                      }`}
                    >
                      {price.toLocaleString()}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={maxPrice}
                readOnly
                onClick={toggleMaxDropdown}
                className="border-2 border-black border-opacity-30 bg-gray-51 p-2 rounded-md w-full cursor-pointer"
                placeholder="Maximum"
              />
              {isMaxDropdownOpen && (
                <div className="absolute bg-white-A700 shadow-lg p-2 rounded-md w-[150px] max-h-40 overflow-y-auto">
                  {priceOptions.map((price, index) => (
                    <button
                      key={index}
                      onClick={() => selectMaxPrice(price)}
                      className={`block p-2 rounded-md w-full text-left ${
                        maxPrice === price
                          ? "bg-black text-white-A700 font-semibold font-manrope"
                          : "bg-gray-51 font-semibold font-manrope"
                      }`}
                    >
                      {price.toLocaleString()}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
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

export default PriceDropdown;
