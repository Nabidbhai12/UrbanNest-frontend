import React, { useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { Text } from "./text";

const completionStatusOptions = ["New", "Used", "Under Construction"];

const PurchaseTypeDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPurpose, setSelectedPurpose] = useState("Buy");
  const [selectedStatus, setSelectedStatus] = useState("New");

  const toggleDropdown = () => setIsOpen(!isOpen);
  const selectPurpose = (purpose) => setSelectedPurpose(purpose);
  const selectStatus = (status) => setSelectedStatus(status);
  const resetSelection = () => {
    setSelectedPurpose("Buy");
    setSelectedStatus("All");
  };

  const createButtonLabel = () => {
    if (selectStatus) {
      return `${selectedPurpose} - ${selectedStatus}`;
    }
    return selectPurpose || selectStatus || "Rent";
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
        <div className="absolute mt-1 flex flex-col bg-gray-51 shadow-lg p-4 rounded-md w-full">
          <div className="flex flex-col justify-between mb-4">
            <div className="flex flex-row w-full">
              <Text className="font-extrabold font-manrope opacity-60 pb-[20px]">
                Purpose
              </Text>
            </div>
            <div className="flex flex-row border border-black border-opacity-30 rounded-[10px]">
              <button
                onClick={() => selectPurpose("Buy")}
                className={`w-1/2 p-2 my-[3px] mx-[5px] rounded-md font-semibold font-manrope ${
                  selectedPurpose === "Buy"
                    ? "bg-black text-white-A700 font-semibold font-manrope"
                    : "bg-gray-51 font-semibold font-manrope"
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => selectPurpose("Rent")}
                className={`w-1/2 p-2 my-[3px] mx-[5px] rounded-md font-semibold font-manrope ${
                  selectedPurpose === "Rent"
                    ? "bg-black text-white-A700 font-semibold font-manrope"
                    : "bg-gray-51 font-semibold font-manrope"
                }`}
              >
                Rent
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-between mb-4">
            <div className="flex flex-row w-full">
              <Text className="font-extrabold font-manrope opacity-60 pb-[20px]">
                Status
              </Text>
            </div>
            <div className="flex flex-col gap-[5px] border border-black border-opacity-30 rounded-[10px] my-[3px] mx-[5px] w-full">
              {completionStatusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => selectStatus(status)}
                  className={`w-full p-2 rounded-md border-black border-opacity-30 font-semibold font-manrope ${
                    selectedStatus === status
                      ? "bg-black text-white-A700"
                      : "bg-gray-51"
                  }`}
                >
                  {status}
                </button>
              ))}
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

export default PurchaseTypeDropdown;
