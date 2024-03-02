import React, { useState } from "react";
import "./app.css";

const App = () => {
  const [selectedImages, setSelectedImages] = useState([]);

  const onSelectFile = (event) => {
    const selectedFiles = event.target.files;
    const selectedFilesArray = Array.from(selectedFiles);

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
    <section className="py-8 px-8">
      <label className="m-auto flex flex-col items-center justify-center border-dotted border-1 border-black rounded-2xl w-40 h-40 cursor-pointer text-lg">
        + Add Images
        <br />
        <span className="font-light text-sm pt-2">up to 10 images</span>
        <input
          type="file"
          name="images"
          className="hidden"
          onChange={onSelectFile}
          multiple
          accept="image/png , image/jpeg, image/webp"
        />
      </label>
      <br />

      <input type="file" className="hidden" multiple />

      {selectedImages.length > 0 &&
        (selectedImages.length > 10 ? (
          <p className="text-center">
            You can't upload more than 10 images! <br />
            <span className="text-red-500">
              please delete <b> {selectedImages.length - 10} </b> of them
            </span>
          </p>
        ) : (
          <button
            className="cursor-pointer block mx-auto border-none rounded-full w-40 h-12 bg-green-500 text-white hover:bg-green-600"
            onClick={() => {
              console.log(selectedImages);
            }}
          >
            UPLOAD {selectedImages.length} IMAGE{selectedImages.length === 1 ? "" : "S"}
          </button>
        ))}

      <div className="flex flex-row flex-wrap justify-center items-center">
        {selectedImages &&
          selectedImages.map((image, index) => (
            <div key={image} className="m-4 mx-2 relative shadow-md">
              <img src={image} alt="upload" className="w-auto h-48" />
              <button
                onClick={() => deleteHandler(image)}
                className="absolute bottom-0 right-0 p-2 bg-lightcoral text-white hover:bg-red-600"
              >
                Delete Image
              </button>
              <p className="p-2">{index + 1}</p>
            </div>
          ))}
      </div>
    </section>
  );
};

export default App;
