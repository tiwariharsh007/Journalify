import React, { useState } from "react";
import { GrMapLocation } from "react-icons/gr";
import { MdAdd, MdClose } from "react-icons/md";

const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");

  const addNewTag = () => {
    if (inputValue.trim() !== "" && !tags.includes(inputValue.trim())) {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      addNewTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      {JSON.stringify(tags)}

      {tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-2 text-sm text-cyan-600 bg-cyan-200/40 px-3 py-1 rounded"
            >
              <GrMapLocation className="text-sm" /> {tag}
              <button onClick={() => handleRemoveTag(tag)} className="">
                <MdClose />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mt-3">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="text-sm bg-transparent border px-3 py-2 rounded outline-none"
          placeholder="Enter Location"
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={addNewTag}
          className="w-8 h-8 flex items-center justify-center rounded border text-cyan-500 hover:bg-cyan-500"
        >
          <MdAdd className="text-2xl text-cyan-500 hover:text-white" />
        </button>
      </div>
    </div>
  );
};

export default TagInput;
