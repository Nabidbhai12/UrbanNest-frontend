import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import LandingPageHeader from "../components/LandingPageHeader";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { CheckBox } from "../components/checkBox";
import { Img } from "../components/image";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Selector from "../components/selector";
import SearchResults from "./SearchResults";
import { AiFillWarning } from "react-icons/ai";
import LandingPageFooter from "../components/LandingPageFooter";

export default function search() {
  const API_KEY =
    "bkoi_475a8f4e8b6d64df619ca67a296b8454a6b20ed5bbeeade0f50f4e65adee8e7b";
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    const loadCsvFile = async () => {
      try {
        const response = await fetch("assets/districts.csv"); // Update the path to your CSV file
        const csvText = await response.text();

        const lines = csvText.split("\n");
        const districtsData = []; // Renamed to avoid confusion with state variable

        lines.forEach((line, index) => {
          // Skip the header or empty lines if present
          if (index !== 0 && line) {
            const columns = line.split(",");
            if (columns.length > 5) {
              // Ensure there are enough columns
              let district = columns[2].trim(); // Assuming the third column contains the districts
              let lat = columns[4].trim();
              let lon = columns[5].trim();
              // Remove potential quotes
              district = district.replace(/^"|"$/g, "");
              lat = lat.replace(/^"|"$/g, "");
              lon = lon.replace(/^"|"$/g, "");

              districtsData.push({
                name: district,
                latitude: lat,
                longitude: lon,
              });
            }
          }
        });

        setDistricts(districtsData); // Update state
      } catch (error) {
        console.error("Error loading or parsing CSV:", error);
      }
    };

    loadCsvFile();
  }, []);

  const [filters, setFilters] = useState({
    saleType: "sell", // 'sell' or 'rent'
    propertyType: "residential", // 'commercial' or 'residential'
    condition: "new", // 'new', 'used', or 'under-construction'
    district: "",
    area: "",
    postoffice: "",
    zip: "",
    address: "",
    areaRange_min: [0, 10000],
    areaRange_max: [0, 10000],
    priceRange_min: [0, 1000000],
    priceRange_max: [0, 1000000],
    beds: 1,
    baths: 1,
    apartmentType: "house", // 'house', 'penthouse', 'duplex', 'studio'
    email: "",
    contactInfo: "",
  });

  let district_names = [];

  for (let i = 0; i < districts.length; i++) {
    district_names.push(districts[i].name);
  }

  let data = [];
  let areas = [];
  const handleAreaAPICall = async () => {
    areas.splice(0, areas.length);
    console.log("Inside function: " + filters.district);
    const request_link =
      "https://barikoi.xyz/v1/api/" + API_KEY + "/cities?q=" + filters.district;

    try {
      console.log("Inside fnction");
      const response = await fetch(request_link, {
        method: "GET",
        headers: {},
      });
      //console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      data = await response.json();

      console.log(data);

      let i = 0;
      if (data.places[0].areas.length == 0) {
        var string = filters.district + " sadar";
        areas.push(string);
      } else {
        for (i = 0; i < data.places[0].areas.length; i++) {
          areas.push(data.places[0].areas[i].name);
        }
        if (areas[0] == "test") {
          areas.shift();
        }
      }
      //return data;
    } catch (err) {
      console.error(err);
    }
  };

  
  let result = [];
  let zipcode;
  const handleZipAPICall = async () => {
    const request_link =
      "https://barikoi.xyz/v2/api/search/rupantor/geocode?api_key=" + API_KEY;
    const formData = new FormData();
    formData.append("q", filters.address);
    formData.append("thana", "yes");
    formData.append("district", "yes");
    formData.append("bangla", "yes");

    try {
      const response = await axios.post(request_link, formData, {
        headers: formData.getHeaders ? formData.getHeaders() : {},
      });
      result = response.data;
      console.log("Geocode result: ", result);
      zipcode = result.geocoded_address.postcode;
      console.log(zipcode);
      //return zipcode;
    } catch (err) {
      console.error(err);
    }
  };

  // handleZipAPICall().then(zipcode => {
  //   console.log("Zipcode outside the function:", zipcode);
  // });
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDistrictSelection = (selectedCity) => {
    setFilters({
      ...filters,
      district: selectedCity,
    });
  };

  const handleZipSelection = () => {
    setFilters({
      ...filters,
      zip : ('' + zipcode),
    });
  }

  const handleAreaSelection = (selectedArea) => {
    setFilters({
      ...filters,
      area: selectedArea,
    });
  };

  useEffect(() => {
    // Ensure district is not an empty string
    if (filters.district) {
      handleAreaAPICall();
    }
  }, [filters.district]);

  useEffect(() => {
    if (filters.district) {
      handleAreaAPICall();
    }
  }, [filters.area]);

  // useEffect(() => {
  //   if (filters.area) {
  //     handleZipAPICall();
  //   }
  // }, [filters.address]);

  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value.split(",").map(Number),
    });

    //console.log("Name: " + name + " Value: " + value);
  };

  console.log(
    "Selected District: " +
      filters.district +
      ", Selected Area: " +
      filters.area
  );

  const BackButton = () => {
    const navigate = useNavigate();

    const goBack = () => {
      navigate(-1);
    };

    return (
      <button
        onClick={goBack}
        className="font-extrabold font-manrope shadow-xl transition duration-300 ease-in-out cursor-pointer  items-center justify-center px-[50px] py-[10px] bg-gray-200 text-black rounded-[30px] hover:bg-red-700 hover:text-black"
      >
        Cancel
      </button>
    );
  };

  const renderAreaLabels = () => {
    if (filters.propertyType === "commercial") {
      return (
        <>
          <span className="text-sm text-black dark:text-gray-400 absolute start-0 -bottom-6 transition-opacity duration-300">
            0
          </span>
          <span className="text-sm text-black dark:text-gray-400 absolute start-1/4 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6 transition-opacity duration-300">
            3000
          </span>
          <span className="text-sm text-black dark:text-gray-400 absolute start-2/4 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6 transition-opacity duration-300">
            6000
          </span>
          <span className="text-sm text-black dark:text-gray-400 absolute start-3/4 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6 transition-opacity duration-300">
            9000
          </span>
          <span className="text-sm text-black dark:text-gray-400 absolute end-0 -bottom-6 transition-opacity duration-300">
            12000
          </span>
        </>
      );
    } else {
      return (
        <>
          <span className="text-sm text-black dark:text-gray-400 absolute start-0 -bottom-6 transition-opacity duration-300">
            0
          </span>
          <span className="text-sm text-black dark:text-gray-400 absolute start-1/4 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6 transition-opacity duration-300">
            1000
          </span>
          <span className="text-sm text-black dark:text-gray-400 absolute start-2/4 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6 transition-opacity duration-300">
            2000
          </span>
          <span className="text-sm text-black dark:text-gray-400 absolute start-3/4 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6 transition-opacity duration-300">
            3000
          </span>
          <span className="text-sm text-black dark:text-gray-400 absolute end-0 -bottom-6 transition-opacity duration-300">
            4000
          </span>
        </>
      );
    }
  };

  const renderBedLabels = () => {
    if (filters.propertyType === "commercial") {
      return (
        <>
          <span className="text-sm text-black dark:text-gray-400 absolute start-0 -bottom-6 transition-opacity duration-300">
            5
          </span>
          <span className="text-sm text-black dark:text-gray-400 absolute start-1/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6 transition-opacity duration-300">
            10
          </span>
          <span className="text-sm text-black dark:text-gray-400 absolute start-2/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6 transition-opacity duration-300">
            15
          </span>
          <span className="text-sm text-black dark:text-gray-400 absolute end-0 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6 transition-opacity duration-300">
            20+
          </span>
        </>
      );
    } else {
      return (
        <>
          <span className="text-sm text-black dark:text-gray-400 absolute start-0 -bottom-6 transition-opacity duration-300">
            1
          </span>
          <span className="text-sm text-black dark:text-gray-400 absolute start-1/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6 transition-opacity duration-300">
            3
          </span>
          <span className="text-sm text-black dark:text-gray-400 absolute start-2/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6 transition-opacity duration-300">
            5
          </span>
          <span className="text-sm text-black dark:text-gray-400 absolute end-0 -bottom-6 transition-opacity duration-300">
            7+
          </span>
        </>
      );
    }
  };

  const renderBathLabels = () => {
    if (filters.propertyType === "commercial") {
      return (
        <>
          <span className="text-sm text-black dark:text-gray-400 absolute start-0 -bottom-6 transition-opacity duration-300">
            2
          </span>
          <span className="text-sm text-black dark:text-gray-400 absolute start-1/4 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6 transition-opacity duration-300">
            4
          </span>
          <span className="text-sm text-black dark:text-gray-400 absolute start-2/4 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6 transition-opacity duration-300">
            6
          </span>
          <span className="text-sm text-black dark:text-gray-400 absolute start-3/4 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6 transition-opacity duration-300">
            8
          </span>
          <span className="text-sm text-black dark:text-gray-400 absolute end-0 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6 transition-opacity duration-300">
            10+
          </span>
        </>
      );
    } else {
      return (
        <>
          <span className="text-sm text-black dark:text-gray-400 absolute start-0 -bottom-6 transition-opacity duration-300">
            1
          </span>
          <span className="text-sm text-black dark:text-gray-400 absolute start-1/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6 transition-opacity duration-300">
            2
          </span>
          <span className="text-sm text-black dark:text-gray-400 absolute start-2/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6 transition-opacity duration-300">
            3
          </span>
          <span className="text-sm text-black dark:text-gray-400 absolute end-0 -bottom-6 transition-opacity duration-300">
            4+
          </span>
        </>
      );
    }
  };

  const changeBedToRooms = () => {
    if (filters.propertyType === "commercial") {
      return (
        <span className="bg-black text-white-A700 w-[90px] h-[30px] flex items-center justify-center rounded-[25px] font-extrabold font-manrope">
          Rooms
        </span>
      );
    } else {
      return (
        <span className="bg-black text-white-A700 w-[90px] h-[30px] flex items-center justify-center rounded-[25px] font-extrabold font-manrope">
          Beds
        </span>
      );
    }
  };

  const changeBathsToWashrooms = () => {
    if (filters.propertyType === "commercial") {
      return (
        <span className="bg-black text-white-A700 w-[110px] h-[30px] flex items-center justify-center rounded-[25px] font-extrabold font-manrope">
          Washrooms
        </span>
      );
    } else {
      return (
        <span className="bg-black text-white-A700 w-[90px] h-[30px] flex items-center justify-center rounded-[25px] font-extrabold font-manrope">
          Baths
        </span>
      );
    }
  };

  const changeBedandBathToRoomsandBaths = () => {
    if (filters.propertyType === "commercial") {
      return (
        <span className="bg-black text-white-A700 px-4 py-2 w-[250px] h-[50px] flex items-center justify-center rounded-[25px] font-extrabold font-manrope">
          Rooms & Washrooms
        </span>
      );
    } else {
      return (
        <span className="bg-black text-white-A700 px-4 py-2 w-[250px] h-[50px] flex items-center justify-center rounded-[25px] font-extrabold font-manrope">
          Beds & Baths
        </span>
      );
    }
  };

  const changeApartmentToProperty = () => {
    if (filters.propertyType === "commercial") {
      return (
        <span className="bg-black text-white-A700 px-4 py-2 w-[250px] h-[50px] flex items-center justify-center rounded-[25px] font-extrabold font-manrope">
          Select Property Type
        </span>
      );
    } else {
      return (
        <span className="bg-black text-white-A700 px-4 py-2 w-[250px] h-[50px] flex items-center justify-center rounded-[25px] font-extrabold font-manrope">
          Select Apartment Type
        </span>
      );
    }
  };

  const [searchResults, setSearchResults] = useState([]); // State to manage search results
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted filters:", filters);

    // Retrieve the token from local storage or cookies

    try {
      const response = await fetch("https://urbannest-backend.onrender.com/api/search/property", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          saleType: filters.saleType,
          propertyType: filters.propertyType,
          condition: filters.condition,
          district: filters.district,
          area: filters.area,
          postoffice: filters.postoffice,
          zip: filters.zip,
          address: filters.address,
          areaRange_min: filters.areaRange_min[0],
          areaRange_max: filters.areaRange_max[0],
          priceRange_min: filters.priceRange_min[0],
          priceRange_max: filters.priceRange_max[0],
          beds: filters.beds,
          baths: filters.baths,
          apartmentType: filters.apartmentType,
          // Add other fields as needed
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Search results:", data);
      console.log("Search results returned: " + data.length);
      console.log("Search results: ", data[0]);
      setSearchResults(data); // Set the search results in the state
      navigate("/search-results", { state: { listings: data } }); // Pass searchResults as state      // Handle the search results as needed
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  return (
    <div className="bg-yellow-50 flex flex-col font-markoone sm:gap-10 md:gap-10 gap-[100px] items-center justify-start mx-auto w-full sm:w-full md:w-full">
      <div className="flex flex-col items-center justify-start w-full py-[50px]">
        <div className="bg-gradient-to-br from-white-A700 to-yellow-50 flex flex-col font-manrope items-center justify-start md:pl-10 sm:pl-5 px-[120px] py-[50px] w-3/4 h-3/4 overflow-hidden rounded-lg shadow-lg">
          <div className="bg-white-A700 flex flex-col items-center justify-start overflow-hidden pb-[100px] rounded-lg shadow-lg w-[1050px] h-[350px]">
            <Img
              className="scale-100 w-full h-auto rounded-lg shadow-md"
              src="images/img_search_page_image.jpg"
              alt="Description"
            />
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 pt-[50px]">
            <div className="flex flex-col space-y-[45px] font-markoone pl-[100px]">
              <div className="flex sm:flex-col flex-row gap-[135px] items-start justify-start w-full">
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      className="h-2 w-2 checked:bg-black p-3 my-4 checked:hover:bg-black checked:active:bg-black checked:focus:bg-black focus:bg-black focus-within:outline-none focus:ring-1 focus:ring-black"
                      name="saleType"
                      value="sell"
                      checked={filters.saleType === "sell"}
                      onChange={handleInputChange}
                    />
                    <span
                      className={`rounded-full px-4 py-2 text-lg ${
                        filters.saleType === "sell"
                          ? "bg-black text-white-A700 px-[150px] rounded-[10px]"
                          : "bg-gray-200 text-black px-[150px] rounded-[10px]"
                      } hover:bg-black hover:text-white-A700 shadow-xl cursor-pointer transition duration-300 ease-in-out font-extrabold font-manrope`}
                    >
                      Buy
                    </span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      className="h-2 w-2 checked:bg-black p-3 my-4 checked:hover:bg-black checked:active:bg-black checked:focus:bg-black focus:bg-black focus-within:outline-none focus:ring-1 focus:ring-black"
                      name="saleType"
                      value="rent"
                      checked={filters.saleType === "rent"}
                      onChange={handleInputChange}
                    />
                    <span
                      className={`rounded-full px-4 py-2 text-lg ${
                        filters.saleType === "rent"
                          ? "bg-black text-white-A700 px-[150px] rounded-[10px]"
                          : "bg-gray-200 text-black px-[150px] rounded-[10px]"
                      } hover:bg-black hover:text-white-A700 shadow-xl cursor-pointer transition duration-300 ease-in-out font-extrabold font-manrope`}
                    >
                      Rent
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex sm:flex-col flex-row gap-24 items-start justify-start w-full">
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      className="h-2 w-2 checked:bg-black p-3 my-4 checked:hover:bg-black checked:active:bg-black checked:focus:bg-black focus:bg-black focus-within:outline-none focus:ring-1 focus:ring-black"
                      name="propertyType"
                      value="commercial"
                      checked={filters.propertyType === "commercial"}
                      onChange={handleInputChange}
                    />
                    <span
                      className={`rounded-full px-4 py-2 text-lg ${
                        filters.propertyType === "commercial"
                          ? "bg-black text-white-A700 px-[130px] rounded-[10px]"
                          : "bg-gray-200 text-black px-[130px] rounded-[10px]"
                      } hover:bg-black hover:text-white-A700 shadow-xl cursor-pointer transition duration-300 ease-in-out font-extrabold font-manrope`}
                    >
                      Commercial
                    </span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="propertyType"
                      className="h-2 w-2 checked:bg-black p-3 my-4 checked:hover:bg-black checked:active:bg-black checked:focus:bg-black focus:bg-black focus-within:outline-none focus:ring-1 focus:ring-black"
                      value="residential"
                      checked={filters.propertyType === "residential"}
                      onChange={handleInputChange}
                    />
                    <span
                      className={`rounded-full px-4 py-2 text-lg ${
                        filters.propertyType === "residential"
                          ? "bg-black text-white-A700 px-[130px] rounded-[10px]"
                          : "bg-gray-200 text-black px-[130px] rounded-[10px]"
                      } hover:bg-black hover:text-white-A700 shadow-xl cursor-pointer transition duration-300 ease-in-out font-extrabold font-manrope`}
                    >
                      Residential
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex sm:flex-col flex-row gap-16 items-start justify-start w-full">
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      className="h-2 w-2 checked:bg-black p-3 my-4 checked:hover:bg-black checked:active:bg-black checked:focus:bg-black focus:bg-black focus-within:outline-none focus:ring-1 focus:ring-black"
                      name="condition"
                      value="new"
                      checked={filters.condition === "new"}
                      onChange={handleInputChange}
                    />
                    <span
                      className={`rounded-full px-4 py-2 text-lg ${
                        filters.condition === "new"
                          ? "bg-black text-white-A700 px-[120px] rounded-[10px]"
                          : "bg-gray-200 text-black px-[120px] rounded-[10px]"
                      } hover:bg-black hover:text-white-A700 shadow-xl cursor-pointer transition duration-300 ease-in-out font-extrabold font-manrope`}
                    >
                      New
                    </span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      className="h-2 w-2 checked:bg-black p-3 my-4 checked:hover:bg-black checked:active:bg-black checked:focus:bg-black focus:bg-black focus-within:outline-none focus:ring-1 focus:ring-black"
                      name="condition"
                      value="used"
                      checked={filters.condition === "used"}
                      onChange={handleInputChange}
                    />
                    <span
                      className={`rounded-full px-4 py-2 text-lg ${
                        filters.condition === "used"
                          ? "bg-black text-white-A700 px-[120px] rounded-[10px]"
                          : "bg-gray-200 text-black px-[120px] rounded-[10px]"
                      } hover:bg-black hover:text-white-A700 shadow-xl cursor-pointer transition duration-300 ease-in-out font-extrabold font-manrope`}
                    >
                      Used
                    </span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      className="h-2 w-2 checked:bg-black p-3 my-4 checked:hover:bg-black checked:active:bg-black checked:focus:bg-black focus:bg-black focus-within:outline-none focus:ring-1 focus:ring-black"
                      name="condition"
                      value="under_construction"
                      checked={filters.condition === "under_construction"}
                      onChange={handleInputChange}
                    />
                    <span
                      className={`rounded-full px-4 py-2 text-lg ${
                        filters.condition === "under_construction"
                          ? "bg-black text-white-A700 px-[57px] rounded-[10px]"
                          : "bg-gray-200 text-black px-[57px] rounded-[10px]"
                      } hover:bg-black hover:text-white-A700 shadow-xl cursor-pointer transition duration-300 ease-in-out font-extrabold font-manrope`}
                    >
                      Under Construction
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-row">
                  <div className="flex flex-row space-y-[1px] gap-[40px] pt-[50px] pr-[40px] font-markoone w-1/2">
                    <span className="bg-black text-white-A700 px-4 py-2 w-[150px] h-[50px] flex items-center justify-center rounded-[25px] font-extrabold font-manrope">
                      Select District
                    </span>
                    <Selector
                      districts={district_names}
                      onCitySelect={handleDistrictSelection}
                      place_holder={"Select district"}
                    />
                  </div>

                  <div className="flex flex-row space-y-[1px] gap-[40px] pt-[50px] pr-[40px] font-markoone w-1/2">
                    <span className="bg-black text-white-A700 px-4 py-2 w-[150px] h-[50px] flex items-center justify-center rounded-[25px] font-extrabold font-manrope">
                      Select Area
                    </span>
                    <Selector
                      districts={areas}
                      onCitySelect={handleAreaSelection}
                      place_holder={"Select area"}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-[1px] pt-[50px] font-markoone">
                <span className="bg-black text-white-A700 px-4 py-2 w-[250px] h-[50px] flex items-center justify-center rounded-[25px] font-extrabold font-manrope">
                  Area (sqft)
                </span>

                <div className="relative flex flex-col">
                  <div className="relative mb-6 flex flex-row gap-[30px] pr-[20px] items-center justify-center w-full">
                    <span className="bg-black text-white-A700 w-[90px] h-[30px] flex items-center justify-center rounded-[25px] font-extrabold font-manrope">
                      Min
                    </span>
                    <div className="flex-grow relative mb-6 pt-[20px]">
                      <input
                        type="range"
                        id="steps-range"
                        name="areaRange_min"
                        value={filters.areaRange_min.join(",")}
                        min={filters.propertyType === "commercial" ? 2000 : 500}
                        max={
                          filters.propertyType === "commercial" ? 12000 : 4500
                        }
                        step={filters.propertyType === "commercial" ? 500 : 50}
                        onChange={handleRangeChange}
                        className="block w-full mt-1 accent-black cursor-pointer"
                      />
                      {renderAreaLabels()}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex flex-row gap-[30px] pr-[20px] items-center justify-center w-full">
                    <span className="bg-black text-white-A700 w-[90px] h-[30px] flex items-center justify-center rounded-[25px] font-extrabold font-manrope">
                      Max
                    </span>
                    <div className="flex-grow relative mb-6 pt-[20px]">
                      <input
                        type="range"
                        id="steps-range"
                        name="areaRange_max"
                        value={filters.areaRange_max.join(",")}
                        min={filters.propertyType === "commercial" ? 2000 : 500}
                        max={
                          filters.propertyType === "commercial" ? 12000 : 4000
                        }
                        step={filters.propertyType === "commercial" ? 500 : 50}
                        onChange={handleRangeChange}
                        className="block w-full mt-1 accent-black cursor-pointer"
                      />
                      {renderAreaLabels()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-[1px] pt-[50px] font-markoone">
                <span className="bg-black text-white-A700 px-4 py-2 w-[250px] h-[50px] flex items-center justify-center rounded-[25px] font-extrabold font-manrope">
                  Price
                </span>

                <div className="relative flex flex-col">
                  <div className="relative mb-6 flex flex-row gap-[30px] pr-[20px] items-center justify-center w-full">
                    <span className="bg-black text-white-A700 w-[90px] h-[30px] flex items-center justify-center rounded-[25px] font-extrabold font-manrope">
                      Min
                    </span>
                    <div className="flex-grow relative mb-6 pt-[20px]">
                      <input
                        type="range"
                        id="steps-range"
                        name="priceRange_min"
                        value={filters.priceRange_min.join(",")}
                        min={filters.propertyType === "commercial" ? 2000 : 500}
                        max={
                          filters.propertyType === "commercial" ? 12000 : 4000
                        }
                        step={filters.propertyType === "commercial" ? 500 : 50}
                        onChange={handleRangeChange}
                        className="block w-full mt-1 accent-black cursor-pointer"
                      />
                      {renderAreaLabels()}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex flex-row gap-[30px] pr-[20px] items-center justify-center w-full">
                    <span className="bg-black text-white-A700 w-[90px] h-[30px] flex items-center justify-center rounded-[25px] font-extrabold font-manrope">
                      Max
                    </span>
                    <div className="flex-grow relative mb-6 pt-[20px]">
                      <input
                        type="range"
                        id="steps-range"
                        name="priceRange_max"
                        value={filters.priceRange_max.join(",")}
                        min={filters.propertyType === "commercial" ? 2000 : 500}
                        max={
                          filters.propertyType === "commercial" ? 12000 : 4000
                        }
                        step={filters.propertyType === "commercial" ? 500 : 50}
                        onChange={handleRangeChange}
                        className="block w-full mt-1 accent-black cursor-pointer"
                      />
                      {renderAreaLabels()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-[1px] pt-[50px] font-markoone">
                {changeBedandBathToRoomsandBaths()}

                <div className="relative flex flex-col">
                  <div className="relative mb-6 flex flex-row gap-[30px] pr-[20px] items-center justify-center w-full">
                    {changeBedToRooms()}
                    <div className="flex-grow relative mb-6 pt-[20px]">
                      <input
                        type="range"
                        id="steps-range"
                        name="beds"
                        value={filters.beds}
                        min={filters.propertyType === "commercial" ? 5 : 1}
                        max={filters.propertyType === "commercial" ? 20 : 7}
                        step={filters.propertyType === "commercial" ? 1 : 1}
                        onChange={handleRangeChange}
                        className="block w-full mt-1 accent-black cursor-pointer"
                      />
                      {renderBedLabels()}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex flex-row gap-[30px] pr-[20px] items-center justify-center w-full">
                    {changeBathsToWashrooms()}
                    <div className="flex-grow relative mb-6 pt-[20px]">
                      <input
                        type="range"
                        id="steps-range"
                        name="baths"
                        value={filters.baths}
                        min={filters.propertyType === "commercial" ? 2 : 1}
                        max={filters.propertyType === "commercial" ? 10 : 4}
                        step={filters.propertyType === "commercial" ? 1 : 1}
                        onChange={handleRangeChange}
                        className="block w-full mt-1 accent-black cursor-pointer"
                      />
                      {renderBathLabels()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-[1px] gap-[20px] pt-[50px] font-markoone">
                {changeApartmentToProperty()}

                <div className="flex sm:flex-col flex-row gap-[135px] items-start justify-start w-full">
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        className="h-2 w-2 checked:bg-black p-3 my-4 checked:hover:bg-black checked:active:bg-black checked:focus:bg-black focus:bg-black focus-within:outline-none focus:ring-1 focus:ring-black"
                        name="apartmentType"
                        value="House"
                        checked={filters.apartmentType === "House"}
                        onChange={handleInputChange}
                      />
                      <span
                        className={`rounded-full px-4 py-2 text-lg ${
                          filters.apartmentType === "House"
                            ? "bg-black text-white-A700 px-[150px] rounded-[10px]"
                            : "bg-gray-200 text-black px-[150px] rounded-[10px]"
                        } hover:bg-black hover:text-white-A700 shadow-xl cursor-pointer transition duration-300 ease-in-out font-extrabold font-manrope`}
                      >
                        House
                      </span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        className="h-2 w-2 checked:bg-black p-3 my-4 checked:hover:bg-black checked:active:bg-black checked:focus:bg-black focus:bg-black focus-within:outline-none focus:ring-1 focus:ring-black"
                        name="apartmentType"
                        value="Penthouse"
                        checked={filters.apartmentType === "Penthouse"}
                        onChange={handleInputChange}
                      />
                      <span
                        className={`rounded-full px-4 py-2 text-lg ${
                          filters.apartmentType === "Penthouse"
                            ? "bg-black text-white-A700 px-[150px] rounded-[10px]"
                            : "bg-gray-200 text-black px-[150px] rounded-[10px]"
                        } hover:bg-black hover:text-white-A700 shadow-xl cursor-pointer transition duration-300 ease-in-out font-extrabold font-manrope`}
                      >
                        Penthouse
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex sm:flex-col flex-row gap-[135px] items-start justify-start w-full">
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        className="h-2 w-2 checked:bg-black p-3 my-4 checked:hover:bg-black checked:active:bg-black checked:focus:bg-black focus:bg-black focus-within:outline-none focus:ring-1 focus:ring-black"
                        name="apartmentType"
                        value="Duplex"
                        checked={filters.apartmentType === "Duplex"}
                        onChange={handleInputChange}
                      />
                      <span
                        className={`rounded-full px-4 py-2 text-lg ${
                          filters.apartmentType === "Duplex"
                            ? "bg-black text-white-A700 px-[150px] rounded-[10px]"
                            : "bg-gray-200 text-black px-[150px] rounded-[10px]"
                        } hover:bg-black hover:text-white-A700 shadow-xl cursor-pointer transition duration-300 ease-in-out font-extrabold font-manrope`}
                      >
                        Duplex
                      </span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        className="h-2 w-2 checked:bg-black p-3 my-4 checked:hover:bg-black checked:active:bg-black checked:focus:bg-black focus:bg-black focus-within:outline-none focus:ring-1 focus:ring-black"
                        name="apartmentType"
                        value="Studio"
                        checked={filters.apartmentType === "Studio"}
                        onChange={handleInputChange}
                      />
                      <span
                        className={`rounded-full px-4 py-2 text-lg ${
                          filters.apartmentType === "Studio"
                            ? "bg-black text-white-A700 px-[150px] rounded-[10px]"
                            : "bg-gray-200 text-black px-[150px] rounded-[10px]"
                        } hover:bg-black hover:text-white-A700 shadow-xl cursor-pointer transition duration-300 ease-in-out font-extrabold font-manrope`}
                      >
                        Studio
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-[30px] w-full items-center justify-center pt-[30px]">
              <button
                type="submit"
                className="font-extrabold font-manrope shadow-xl transition duration-300 ease-in-out cursor-pointer  items-center justify-center px-[50px] py-[10px] bg-gray-200 text-black rounded-[30px] hover:bg-black hover:text-white-A700"
              >
                Apply
              </button>
              <BackButton />
            </div>
          </form>
        </div>
      </div>
      <LandingPageFooter className="bg-white-A700 flex gap-2 items-center justify-center md:px-5 px-[120px] py-20 w-full" />
      <Routes>
        <Route
          path="/search-results"
          element={<SearchResults listings={searchResults} />}
        />
      </Routes>
    </div>
  );
}
