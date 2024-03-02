// import React, { useState } from 'react';

// const SearchBar = () => {
//   const [inputValue, setInputValue] = useState('');
//   const [filters, setFilters] = useState([]);

//   const handleInputChange = (e) => {
//     setInputValue(e.target.value);
//   };

//   const handleAddFilter = () => {
//     if (inputValue.trim() && !filters.includes(inputValue.trim())) {
//       setFilters([...filters, inputValue.trim()]);
//       setInputValue('');
//     }
//   };

//   const handleRemoveFilter = (filter) => {
//     setFilters(filters.filter((f) => f !== filter));
//   };

//   return (
//     <div className="flex flex-col p-4">
//       <div className="flex items-center border-2 rounded">
//         <input
//           type="text"
//           placeholder="Enter your address"
//           value={inputValue}
//           onChange={handleInputChange}
//           className="p-2 outline-none flex-grow"
//         />
//         <button onClick={handleAddFilter} className="p-2">
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             {/* Icon from Heroicons */}
//           </svg>
//         </button>
//       </div>
//       <div className="flex flex-wrap mt-2">
//         {filters.map((filter, index) => (
//           <div key={index} className="flex items-center m-1 bg-gray-200 rounded">
//             <span className="p-2">{filter}</span>
//             <button onClick={() => handleRemoveFilter(filter)} className="p-2">
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 {/* X icon from Heroicons */}
//               </svg>
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SearchBar;

import React from "react";
import { useState, useEffect } from "react";
import { Button } from "../components/button.jsx";
import { Img } from "../components/image.jsx";
import { Input } from "../components/input.jsx";
import { List } from "../components/list.jsx";
import { SelectBox } from "../components/SelectBox.jsx";
import { Text } from "../components/text.jsx";
import Select from "react-select";
import Selector from "../components/selector.jsx";
import Dropdown_buy_rent from "../components/dropdown_rent.jsx";
import Dropdown_apartment from "../components/dropdown_apartments.jsx";
import Dropdown_beds_baths from "../components/dropdown_beds_baths.jsx";
import Dropdown_price from "../components/dropdown_price.jsx";
import Dropdown_area from "../components/dropdown_area.jsx";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import SearchResults from "./SearchResults.jsx";

import LandingPageCard from "../components/LandingPageCard.jsx";
import LandingPageFooter from "../components/LandingPageFooter.jsx";
import { ShowApartments } from "../components/GoogleMap.jsx";
import { all } from "axios";

const ListingMapViewPage = () => {
  const landingPageCardPropList = [];

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  const API_KEY =
    "bkoi_475a8f4e8b6d64df619ca67a296b8454a6b20ed5bbeeade0f50f4e65adee8e7b";
  const [districts, setDistricts] = useState([]);

  var districtsData = [];
  useEffect(() => {
    const loadCsvFile = async () => {
      try {
        const response = await fetch("assets/districts.csv"); // Update the path to your CSV file
        const csvText = await response.text();

        const lines = csvText.split("\n");
        //const districtsData = []; // Renamed to avoid confusion with state variable

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

  const handleCitySelection = (selectedCity) => {
    setFilters({
      ...filters,
      city: selectedCity,
    });
  };

  const handlePropertyType = (selectedType) => {
    setFilters({
      ...filters,
      propertyType: selectedType,
    });
  };

  const handleApartmentType = (selectedApartment) => {
    setFilters({
      ...filters,
      apartmentType: selectedApartment,
    });
  };

  const handlePriceChange = (min_price, max_price) => {
    setFilters({
      ...filters,
      priceRange_min: min_price,
      priceRange_max: max_price,
    });
  };

  const handleAreaChange = (min_area, max_area) => {
    setFilters({
      ...filters,
      areaRange_min: min_area,
      areaRange_max: max_area,
    });
  };

  const handleBedBath = (bedrooms, bathrooms) => {
    setFilters({
      ...filters,
      beds: bedrooms,
      baths: bathrooms,
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
      zip: "" + zipcode,
    });
  };

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
  //   if (filters.thana) {
  //     handleZipAPICall();
  //   }
  // }, [filters.address]);

  const [searchResults, setSearchResults] = useState([]); // State to manage search results

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted filters:", filters);

    // Retrieve the token from local storage or cookies

    try {
      const response = await fetch("/api/search/property", {
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
          areaRange_max: filters.areaRange_max[1],
          priceRange_min: filters.priceRange_min[0],
          priceRange_max: filters.priceRange_max[1],
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
      console.log(typeof data[0].addess);
      setSearchResults(data); // Set the search results in the state
      navigate("/search-results", { state: { listings: data } }); // Pass searchResults as state      // Handle the search results as needed
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  const location = useLocation(); // Access location
  const allListings = location.state?.listings; // Access listings from state

  const center = { lat: null, lng: null };

  //console.log(districts.length);

  for (var i = 0; i < districts.length; i++) {
    //console.log(districts);
    if (districts[i].name == allListings[2].location.district) {
      center.lat = districts[i].latitude;
      center.lng = districts[i].longitude;
      break;
    }
  }

  console.log(center);

  console.log("Inside test Listings:" + allListings.length);
  //console.log("Inside test Listings:" + allListings[0].location.json);
  for (var i = 0; i < allListings.length; i++) {
    console.log(allListings[i]);
  }

  for (var i = 2; i < allListings.length; i++) {
    let bed_string = "bed",
      bath_string = "bath";
    if (allListings[i].beds > 1) {
      bed_string = "beds";
    }
    if (allListings[i].baths > 1) {
      bath_string = "baths";
    }

    console.log(allListings[2].location);

    landingPageCardPropList.push({
      image: allListings[i].images[0].url,
      images: allListings[i].images,
      location: allListings[i].location.address,
      beds: allListings[i].rooms.bedrooms + " " + bed_string,
      baths: allListings[i].rooms.bathrooms + " " + bath_string,
      size: allListings[i].size + " sqft",
      type: allListings[i].apartmentType,
      area: allListings[i].location.area,
      district: allListings[i].location.district,
      zipcode: allListings[i].location.zipCode,
      price: allListings[i].price.amount + " " + allListings[i].price.currency,
      latitude: allListings[i].location.coordinates.coordinates[1],
      longitude: allListings[i].location.coordinates.coordinates[0],
      title: allListings[i].title,
      description: allListings[i].description,
      condition: allListings[i].condition,
      apartmentType: allListings[i].apartmentType,
      propertyStatus: allListings[i].propertyStatus,
      id: allListings[i]._id,
      owner: allListings[i].owner,
    });
  }

  for (var i = 0; i < landingPageCardPropList.length; i++) {
    console.log(landingPageCardPropList[i]);
  }
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 8;
  const totalPages = Math.ceil(allListings?.length / listingsPerPage);

  // Calculate the currently displayed listings
  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = allListings?.slice(
    indexOfFirstListing,
    indexOfLastListing
  );

  console.log(currentListings);

  const currentPropList = [];

  for (var i = 2; i < currentListings.length; i++) {
    let bed_string = "bed",
      bath_string = "bath";
    if (currentListings[i].rooms.bedrooms > 1) {
      bed_string = "beds";
    }
    if (currentListings[i].rooms.bathrooms > 1) {
      bath_string = "baths";
    }
    currentPropList.push({
      image: currentListings[i].images[0].url,
      images: allListings[i].images,
      location: currentListings[i].location.address,
      beds: currentListings[i].rooms.bedrooms + " " + bed_string,
      baths: currentListings[i].rooms.bathrooms + " " + bath_string,
      size: currentListings[i].size + " sqft",
      type: currentListings[i].apartmentType,
      area: currentListings[i].location.area,
      district: currentListings[i].location.district,
      zipcode: allListings[i].location.zipCode,
      price: currentListings[i].price.amount + " " + allListings[i].price.currency,
      latitude: currentListings[i].location.coordinates.coordinates[1],
      longitude: currentListings[i].location.coordinates.coordinates[0],
      title: allListings[i].title,
      description: allListings[i].description,
      condition: allListings[i].condition,
      apartmentType: allListings[i].apartmentType,
      propertyStatus: allListings[i].propertyStatus,
      id: allListings[i]._id,
      owner: allListings[i].owner,
    });
  }

  // Pagination Pages
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  console.log(pageNumbers);

  const handleNextPageClick = () => {
    let num = pageNumbers.length;
    let i = 0;
    if (i < num) {
      console.log("Inside if");
      setCurrentPage(i + 1);
    }
  };

  // if (!allListings || allListings.length === 0) {
  //   return <div className="text-center py-12">No Listings Found</div>;
  // }

  return (
    <>
      <div className="bg-gray-51 flex flex-col font-markoone sm:gap-10 md:gap-10 gap-[100px] items-start justify-start mx-auto w-auto sm:w-full md:w-full">
        <div className="flex flex-col md:gap-10 gap-[60px] items-center justify-center w-full">
          <div className="flex flex-col font-manrope items-center justify-start md:px-10 sm:px-5 px-[120px] w-full">
            <div className="flex flex-col gap-6 items-center justify-center max-w-[1200px] mx-auto w-full">
              <Text
                className="text-4xl sm:text-[32px] md:text-[34px] text-gray-900 tracking-[-0.72px] w-full"
                size="txtManropeExtraBold36"
              >
                Find Property
              </Text>
              <div>
                <div className="flex flex-row gap-[50px] items-start justify-start w-full">
                  <div className="flex flex-row gap-5 items-start justify-start w-auto">
                    <div className="flex sm:flex-1 flex-col items-start justify-start w-auto sm:w-full">
                      <Selector
                        districts={district_names}
                        onCitySelect={handleDistrictSelection}
                        place_holder={"Select district"}
                      />
                    </div>
                  </div>

                  <div className="flex flex-row gap-5 items-start justify-start w-auto">
                    <div className="flex sm:flex-1 flex-col items-start justify-start w-auto sm:w-full">
                      <Selector
                        districts={areas}
                        onCitySelect={handleAreaSelection}
                        place_holder={"Select Area"}
                      />
                    </div>
                  </div>
                  <div className="flex flex-row px-3 py-[10px]">
                    <Dropdown_buy_rent />
                  </div>
                </div>
                <div className="flex flex-row gap-[50px] items-start justify-start w-full">
                  <div className="flex flex-row gap-[50px] items-start justify-start w-auto">
                    <div className="flex flex-row py-[10px]">
                      <Dropdown_apartment
                        onTypeSelect={handlePropertyType}
                        onClassSelect={handleApartmentType}
                      />
                    </div>
                    <div className="flex flex-row py-[10px]">
                      <Dropdown_beds_baths
                        propertyType={filters.propertyType}
                        onBedBathSelect={handleBedBath}
                      />
                    </div>
                    <div className="flex flex-row px-[10px] py-[10px]">
                      <Dropdown_price onPriceSelect={handlePriceChange} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-[50px] items-start justify-start w-full">
                  <div className="flex flex-row gap-[50px] items-start justify-start w-auto">
                    <div className="flex flex-row py-[10px]">
                      <Dropdown_area onAreaSelect={handleAreaChange} />
                    </div>
                    <div className="flex flex-row py-[10px]">
                      <input
                        type="text"
                        name="zip"
                        value={filters.zip}
                        onChange={handleInputChange}
                        placeholder="Zip"
                        className="block bg-white-A700 border border-black border-opacity-30 w-[350px] h-[45px] mt-1 rounded-[10px] font-extrabold font-manrope items-center justify-center text-center"
                      />
                    </div>
                    <div className="flex flex-row px-[10px] py-[10px]">
                      <Button
                        type="submit"
                        className="bg-gray-900 cursor-pointer flex items-center justify-center min-w-[150px] px-4 py-[8px] rounded-[10px]"
                        rightIcon={
                          <Img
                            className="h-5 mt-px mb-[3px] ml-2.5"
                            src="images/img_search_white_a700.svg"
                            alt="search"
                          />
                        }
                        onClick={handleSubmit}
                      >
                        <div className="font-bold text-left text-lg text-white-A700">
                          Search
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row font-manrope items-center justify-center md:px-10 px-[50px] sm:px-5 w-full">
            <div className="flex flex-col md:gap-10 gap-[60px] items-center justify-start max-w-[1200px] mx-auto w-1/2">
              <div>
                <div className="flex flex-col items-start justify-start w-full">
                  <div className="md:gap-5 gap-6 grid sm:grid-cols-1 md:grid-cols-2 grid-cols-2 justify-center min-h-[auto] w-full">
                    {currentPropList.map((props, index) => (
                      <React.Fragment key={`LandingPageCard${index}`}>
                        <LandingPageCard
                          className="flex flex-1 flex-col h-[560px] md:h-auto items-start justify-start w-full"
                          {...props}
                        />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="flex sm:flex-col flex-row gap-5 items-center justify-between w-full">
                  <div className="flex flex-row gap-[5px] items-start justify-start w-auto">
                    {pageNumbers.map((number) => (
                      <Button
                        key={number}
                        className={`border border-gray-700 border-solid cursor-pointer font-semibold h-12 py-[13px] rounded-[10px] text-base text-center text-gray-900 w-12 ${
                          currentPage === number
                            ? "bg-black text-white-A700"
                            : ""
                        } text-white rounded`}
                        onClick={() => setCurrentPage(number)}
                      >
                        {number}
                      </Button>
                    ))}
                  </div>
                  {/*
                <Button
                  className="border border-bluegray-102 border-solid cursor-pointer flex items-center justify-center min-w-[134px] px-[17px] py-[13px] rounded-[10px]"
                  rightIcon={
                    <Img
                      className="h-4 mt-px mb-[5px] ml-1"
                      src="images/img_arrowright_gray_900.svg"
                      alt="arrow_right"
                    />
                  }
                  onClick={handleNextPageClick}
                >
                  <div className="font-semibold text-base text-gray-900 text-left">
                    Next Page
                  </div>
                </Button>
                */}
                </div>
              </div>

              <div className="flex justify-center mt-8"></div>
            </div>
            <div className="w-px bg-black h-full mx-4"></div>
            <div className="flex flex-col md:gap-10 items-start justify-start mx-auto w-1/2 h-auto border border-black border-opacity-30 rounded-[20px] overflow-auto">
              <ShowApartments apartments={landingPageCardPropList} />
            </div>
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
    </>
  );
};

export default ListingMapViewPage;
