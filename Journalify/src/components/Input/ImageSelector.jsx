import React, { useRef, useState } from "react";
import { FaRegFileImage } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const ImageSelector = ({image, setImage, handleDeleteImage}) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(image || null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
    handleDeleteImage();
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />
      {!image ? (
        <button
          onClick={onChooseFile}
          className="w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border border-slate-200/50"
        >
          <div className="w-14 h-14 flex items-center justify-center bg-cyan-50 rounded-full border border-cyan-100">
            <FaRegFileImage className="text-xl text-cyan-500" />
          </div>
          <p className="text-sm text-slate-500">Choose Image</p>
        </button>
      ) : (
        <div className="w-full relative">
          <img src={previewUrl} alt="Selected" className="w-full h-[300px] object-cover rounded-lg" />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
          >
            <MdDeleteOutline />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageSelector;
