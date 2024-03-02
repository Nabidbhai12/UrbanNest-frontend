import React from "react";
import { useState, useEffect } from "react";
import { Button } from "../components/button";
import { Img } from "../components/image";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LandingPageFooter from "../components/LandingPageFooter";
import Selector from "../components/selector";
import axios from "axios";
import { useDebounce } from "use-debounce";
import AddressSelectionModal from "../modals/mapModal";

export default function test() {
  const API_KEY =
    "bkoi_475a8f4e8b6d64df619ca67a296b8454a6b20ed5bbeeade0f50f4e65adee8e7b";

  const GOOGLE_API_KEY = "AIzaSyC2qBiJzOitO345ed0T-BAVgnM0XRnOH8g";

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

  const { currentUser } = useSelector((state) => state.user);

  const [filters, setFilters] = useState({
    saleType: "sell", // 'sell' or 'rent'
    propertyType: "residential", // 'commercial' or 'residential'
    condition: "new", // 'new', 'used', or 'under-construction'
    district: "",
    area: "",
    zip: "",
    latitude: null,
    longitude: null,
    address: "",
    areaRange: 0,
    priceRange: 1000000,
    beds: 1,
    baths: 1,
    apartmentType: "house", // 'house', 'penthouse', 'duplex', 'studio'
    email: currentUser.email,
    contactInfo: "",
    parking: false,
    pets: false,
    gym: false,
    mosque: false,
    title: "",
    description: "",
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [sentImages, setSentImages] = useState([]);

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

  var area_info;

  const getAreaInfo = async () => {
    const request_link =
      "https://barikoi.xyz/v2/api/search/autocomplete/place?api_key=API_KEY&q=jessore&city=dhaka&bangla=true";
  };

  const [debouncedValue] = useDebounce(filters.address, 500);

  console.log(debouncedValue);

  let result = [];
  let zipcode;
  const handleZipAPICall = async () => {
    const request_link =
      "https://barikoi.xyz/v2/api/search/rupantor/place?api_key=" + API_KEY;
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

  let globalCoordinates = { lat: null, lng: null }; // Global variable

  const [coords, setCoords] = useState({
    lat : null,
    lng : null
  });

  const getAreaCoordinates = async () => {
    const areaName = filters.area + ", " + filters.district;

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      areaName
    )}&key=${GOOGLE_API_KEY}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "OK") {
          const { lat, lng } = data.results[0].geometry.location;
          setCoords({lat, lng});
          console.log("Geocoding success");
        } else {
          console.error("Geocoding failed:", data.status);
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleMultipleFileChange = (event) => {
    setSelectedImages(event.target.files[0]);

    console.log("Test: " + event.target.files[0]);
    console.log("Profile picture: " + profilePicture);
    console.log(selectedImages.length);
    if (warning) setWarning("");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(name + " " + value + " " + type + " " + checked);
    setFilters({
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    });
    console.log("Parking: " + filters.parking);
  };

  const handleAddressChange = (e) => {
    setFilters({
      ...filters,
      address: debouncedValue,
    });
  };

  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value.split(",").map(Number),
    });

    console.log("Name: " + name + " Value: " + value);
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

  const handleLocationSelectMap = (lat, lng, addr, zipcode) => {
    setFilters({
      ...filters,
      latitude: lat,
      longitude: lng,
      address: addr,
      zip : zipcode,
    });
  };

  useEffect(() => {
    console.log(
      filters.latitude + " " + filters.longitude + " " + filters.address + " " + filters.zip
    );
  }, [filters.latitude, filters.longitude, filters.address, filters.zip]);

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

  useEffect(() => {
    if(filters.district && filters.area){
      getAreaCoordinates();
    }
  }, [filters.district, filters.area]);

  // useEffect(() => {
  //   if (filters.area) {
  //     handleZipAPICall();
  //   }
  // }, [filters.address]);

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

  const ImageUploader = () => {
    const onSelectFile = (event) => {
      const selectedFiles = event.target.files;

      const sentImages = event.target.files;
      let formData = new FormData();
      for (let i = 0; i < sentImages.length; i++) {
        formData.append("images", sentImages[i]);
      }

      //filters.images.append(selectedFiles);

      console.log(
        "Selected files: " + selectedFiles[0] + "Size: " + selectedFiles.length
      );

      //console.log("Images filters size: " + filters.images.length);
      const selectedFilesArray = Array.from(selectedFiles);
      const sentImagesArray = Array.from(sentImages);

      setSentImages((prevImages) => [...prevImages, ...sentImagesArray]);

      console.log("Selected files array: " + selectedFilesArray);

      //setSelectedImages(prevImages => [...prevImages, ...selectedFilesArray]);

      console.log("SentImages size: " + sentImages.length);

      //console.log("Images length" + filters.images.length);

      const imagesArray = selectedFilesArray.map((file) => {
        return URL.createObjectURL(file);
      });

      setSelectedImages((previousImages) => previousImages.concat(imagesArray));

      // FOR BUG IN CHROME
      event.target.value = "";
    };

    function deleteHandler(image) {
      setSelectedImages(selectedImages.filter((e) => e !== image));
      URL.revokeObjectURL(image);
    }

    return (
      <div className="py-8 px-8">
        <label
          className={`m-auto font-extrabold font-manrope flex flex-col items-center bg-white-A700 text-black justify-center border-dotted border-1 border-black rounded-2xl w-40 h-40 cursor-pointer text-lg ${
            selectedImages.length >= 5 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          + Add Images
          <br />
          <span className="font-light text-sm pt-2">up to 5 images</span>
          <input
            type="file"
            name="images"
            className="hidden"
            onChange={onSelectFile}
            multiple
            accept="image/png , image/jpeg, image/webp"
            disabled={selectedImages.length >= 5}
          />
        </label>
        <br />

        <input type="file" className="hidden" multiple />

        {selectedImages.length > 0 &&
          (selectedImages.length >= 6 ? (
            <p className="text-center"></p>
          ) : (
            <button
              className="cursor-pointer font-manrope font-extrabold block mx-auto border-none rounded-full w-40 h-12 bg-white-A700 text-black hover:bg-black hover:text-white-A700 hover:transition duration-200"
              onClick={() => {
                console.log("Images: " + selectedImages);
              }}
            >
              UPLOAD {selectedImages.length} IMAGE
              {selectedImages.length === 1 ? "" : "S"}
            </button>
          ))}

        <div className="flex flex-row gap-[15px] flex-wrap justify-center items-center">
          {selectedImages &&
            selectedImages.map((image, index) => (
              <div key={image} className="m-4 mx-2 relative shadow-md">
                <img src={image} alt="upload" className="w-auto h-48" />
                <button
                  onClick={() => deleteHandler(image)}
                  className="absolute bottom-0 right-0 p-2 opacity-0 hover:opacity-100 bg-deep_orange-400 text-white hover:bg-red-600 transition duration-200 font-extrabold font-manrope rounded-[20px]"
                >
                  Delete Image
                </button>
                <p className="p-2">{index + 1}</p>
              </div>
            ))}
        </div>
      </div>
    );
  };
  const navigate = useNavigate(); // Create an instance of useNavigate
  const handleSubmit_sell_rent = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    console.log(filters);
    console.log(sentImages);

    // Append filters data to formData
    for (const key in filters) {
      if (key !== "images") {
        if (Array.isArray(filters[key])) {
          filters[key].forEach((value, index) =>
            formData.append(`${key}[${index}]`, value)
          );
        } else {
          formData.append(key, filters[key]);
        }
      }
    }

    sentImages.forEach((file) => {
      formData.append("images", file); // Use 'images' as the field name for all files
    });

    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const response = await fetch("/api/users/addPropertyForSale", {
        method: "POST",
        body: formData, // send the FormData
        // Note: When using FormData with fetch, do NOT set Content-Type header
        // The browser will set it automatically including the boundary parameter
      });

      const data = await response.json(); // Parse JSON data from the response
      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      alert("Your property has been added successfully!");
      navigate("/"); // Ensure navigate is correctly defined
      console.log("Response:", data);
    } catch (error) {
      console.error("Error uploading property data and images:", error);
    }
  };

  const [isOpenAddressSelectionModal, setAddressSelectionModal] =
    React.useState(false);

  function handleOpenAddressSelectionModal() {
    setAddressSelectionModal(true);
  }
  function handleCloseAddressSelectionModal() {
    setAddressSelectionModal(false);
  }

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
          <form
            onSubmit={handleSubmit_sell_rent}
            className="space-y-4 pt-[50px]"
            method="POST"
            encType="multipart/form-data"
          >
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
                      Sell
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

                <div className="flex flex-col">
                  <div>
                    <label className="flex items-center space-x-3 pt-[50px] font-markoone">
                      <span className="bg-black text-white-A700 px-4 py-2 w-[150px] h-[50px] flex items-center justify-center rounded-[25px] font-extrabold font-manrope">
                        Address
                      </span>
                      <input
                        type="text"
                        name="address"
                        value={filters.address}
                        onChange={handleInputChange}
                        className="block w-full mt-1 rounded-[50px] font-extrabold font-manrope"
                        placeholder="Enter Address, Location or Neighbourhood"
                        required
                      />
                      <Button
                        type="submit"
                        className="bg-gray-51 cursor-pointer border-2 border-black border-opacity-30 flex items-center justify-center min-w-[50px] px-4 py-[8px] rounded-[10px]"
                        rightIcon={
                          <Img
                            className="h-5 mt-px mb-[3px] ml-2.5"
                            src="images/img_addLocation.svg"
                            alt="search"
                          />
                        }
                        onClick={handleOpenAddressSelectionModal}
                      ></Button>
                    </label>
                  </div>
                  <div className="flex flex-row space-y-[1px] gap-[40px] pt-[50px] font-markoone w-1/2">
                    <span className="bg-black text-white-A700 px-4 py-2 w-[150px] h-[50px] flex items-center justify-center rounded-[25px] font-extrabold font-manrope">
                      Zip
                    </span>
                    <input
                      type="text"
                      name="zip"
                      value={filters.zip}
                      onChange={handleInputChange}
                      className="block w-full h-[50px] mt-1 rounded-[50px] font-extrabold font-manrope"
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
                    <div className="flex-grow relative mb-6 pt-[20px]">
                      <input
                        type="range"
                        id="steps-range"
                        name="areaRange"
                        value={filters.areaRange}
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
              </div>

              <div className="flex flex-col space-y-[1px] pt-[50px] font-markoone">
                <span className="bg-black text-white-A700 px-4 py-2 w-[250px] h-[50px] flex items-center justify-center rounded-[25px] font-extrabold font-manrope">
                  Price
                </span>

                <div className="relative flex flex-col">
                  <div className="relative mb-6 flex flex-row gap-[30px] pr-[20px] items-center justify-center w-full">
                    <div className="flex-grow relative mb-6 pt-[20px]">
                      <input
                        type="range"
                        id="steps-range"
                        name="priceRange"
                        value={filters.priceRange}
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
                        value="house"
                        checked={filters.apartmentType === "house"}
                        onChange={handleInputChange}
                      />
                      <span
                        className={`rounded-full px-4 py-2 text-lg ${
                          filters.apartmentType === "house"
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
                        value="penthouse"
                        checked={filters.apartmentType === "penthouse"}
                        onChange={handleInputChange}
                      />
                      <span
                        className={`rounded-full px-4 py-2 text-lg ${
                          filters.apartmentType === "penthouse"
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
                        value="duplex"
                        checked={filters.apartmentType === "duplex"}
                        onChange={handleInputChange}
                      />
                      <span
                        className={`rounded-full px-4 py-2 text-lg ${
                          filters.apartmentType === "duplex"
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
                        value="studio"
                        checked={filters.apartmentType === "studio"}
                        onChange={handleInputChange}
                      />
                      <span
                        className={`rounded-full px-4 py-2 text-lg ${
                          filters.apartmentType === "studio"
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

              <div className="flex flex-row space-y-[1px] gap-[40px] pt-[10px] font-markoone w-1/2">
                <span className="bg-black text-white-A700 px-4 py-2 w-[150px] h-[50px] flex items-center justify-center rounded-[25px] font-extrabold font-manrope">
                  Email
                </span>
                <input
                  type="text"
                  name="email"
                  value={filters.email}
                  onChange={handleInputChange}
                  placeholder={currentUser.email}
                  className="block w-full mt-1 rounded-[50px] font-extrabold font-manrope"
                />
              </div>

              <div className="flex flex-row space-y-[1px] gap-[40px] pt-[10px] font-markoone w-1/2">
                <span className="bg-black text-white-A700 px-[40px] py-2 w-[150px] h-[50px] flex items-center justify-center rounded-[25px] font-extrabold font-manrope">
                  Contact Information
                </span>
                <input
                  type="text"
                  name="contactInfo"
                  value={filters.contactInfo}
                  onChange={handleInputChange}
                  className="block w-full mt-1 rounded-[50px] font-extrabold font-manrope"
                />
              </div>

              <div className="flex flex-row space-y-[1px] gap-[40px] pt-[10px] font-markoone w-full">
                <span className="bg-black text-white-A700 px-4 py-2 w-[150px] h-[50px] flex items-center justify-center rounded-[25px] font-extrabold font-manrope">
                  Title
                </span>
                <input
                  type="text"
                  name="title"
                  value={filters.title}
                  onChange={handleInputChange}
                  placeholder={"Enter your title here"}
                  className="block mt-1 rounded-[50px] font-extrabold font-manrope w-full"
                />
              </div>

              <div className="flex flex-row space-y-[1px] gap-[40px] pt-[10px] font-markoone w-full">
                <span className="bg-black text-white-A700 px-4 py-2 w-[150px] h-[50px] flex items-center justify-center rounded-[25px] font-extrabold font-manrope">
                  Description
                </span>
                <textarea
                  type="text"
                  name="description"
                  value={filters.description}
                  onChange={handleInputChange}
                  placeholder={"Enter your description here"}
                  rows={10}
                  className="block mt-1 rounded-[50px] font-extrabold font-manrope w-full h-[300px] text-center"
                />
              </div>

              <div className="flex flex-col space-y-[1px] gap-[40px] pt-[10px] font-markoone w-full">
                <span className="bg-black text-white-A700 px-4 py-2 w-[250px] h-[50px] flex items-center justify-center rounded-[25px] font-extrabold font-manrope">
                  Upload Pictures
                </span>
                <div className="flex flex-col bg-red-100 w-full h-auto rounded-[30px]">
                  <ImageUploader />
                </div>
              </div>

              <div className="flex flex-col space-y-[1px] gap-[20px] pt-[50px] font-markoone">
                <span className="bg-black text-white-A700 px-4 py-2 w-[250px] h-[50px] flex items-center justify-center rounded-[25px] font-extrabold font-manrope">
                  Select Perks
                </span>

                <div className="flex sm:flex-col flex-row gap-[135px] items-start justify-start w-full">
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="h-2 w-2 checked:bg-black p-3 my-4 checked:hover:bg-black checked:active:bg-black checked:focus:bg-black focus:bg-black focus-within:outline-none focus:ring-1 focus:ring-black"
                        name="parking"
                        value={!filters.parking}
                        checked={filters.parking === true}
                        onChange={handleInputChange}
                      />
                      <span
                        className={`rounded-full px-4 py-2 text-lg ${
                          filters.parking === true
                            ? "bg-black text-white-A700 px-[150px] rounded-[10px]"
                            : "bg-gray-200 text-black px-[150px] rounded-[10px]"
                        } hover:bg-black hover:text-white-A700 shadow-xl cursor-pointer transition duration-300 ease-in-out font-extrabold font-manrope`}
                      >
                        Parking
                      </span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="h-2 w-2 checked:bg-black p-3 my-4 checked:hover:bg-black checked:active:bg-black checked:focus:bg-black focus:bg-black focus-within:outline-none focus:ring-1 focus:ring-black"
                        name="pets"
                        value={!filters.pets}
                        checked={filters.parking === true}
                        onChange={handleInputChange}
                      />
                      <span
                        className={`rounded-full px-4 py-2 text-lg ${
                          filters.pets === true
                            ? "bg-black text-white-A700 px-[150px] rounded-[10px]"
                            : "bg-gray-200 text-black px-[150px] rounded-[10px]"
                        } hover:bg-black hover:text-white-A700 shadow-xl cursor-pointer transition duration-300 ease-in-out font-extrabold font-manrope`}
                      >
                        Pets
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex sm:flex-col flex-row gap-[135px] items-start justify-start w-full">
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="h-2 w-2 checked:bg-black p-3 my-4 checked:hover:bg-black checked:active:bg-black checked:focus:bg-black focus:bg-black focus-within:outline-none focus:ring-1 focus:ring-black"
                        name="gym"
                        value={filters.gym}
                        checked={filters.gym === true}
                        onChange={handleInputChange}
                      />
                      <span
                        className={`rounded-full px-4 py-2 text-lg ${
                          filters.gym === true
                            ? "bg-black text-white-A700 px-[150px] rounded-[10px]"
                            : "bg-gray-200 text-black px-[150px] rounded-[10px]"
                        } hover:bg-black hover:text-white-A700 shadow-xl cursor-pointer transition duration-300 ease-in-out font-extrabold font-manrope`}
                      >
                        Gym
                      </span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="h-2 w-2 checked:bg-black p-3 my-4 checked:hover:bg-black checked:active:bg-black checked:focus:bg-black focus:bg-black focus-within:outline-none focus:ring-1 focus:ring-black"
                        name="mosque"
                        value={filters.mosque}
                        checked={filters.mosque === true}
                        onChange={handleInputChange}
                      />
                      <span
                        className={`rounded-full px-4 py-2 text-lg ${
                          filters.mosque === true
                            ? "bg-black text-white-A700 px-[150px] rounded-[10px]"
                            : "bg-gray-200 text-black px-[150px] rounded-[10px]"
                        } hover:bg-black hover:text-white-A700 shadow-xl cursor-pointer transition duration-300 ease-in-out font-extrabold font-manrope`}
                      >
                        Mosque
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
        <LandingPageFooter className="bg-white-A700 flex gap-2 items-center justify-center md:px-5 px-[120px] py-20 w-full" />
      </div>
      {isOpenAddressSelectionModal ? (
        <AddressSelectionModal
          isOpen={isOpenAddressSelectionModal}
          onRequestClose={handleCloseAddressSelectionModal}
          onLocationSelect={handleLocationSelectMap}
          latitude={coords.lat}
          longitude={coords.lng}
        />
      ) : null}
    </div>
  );
}
