import React from 'react';
import { FaRegNoteSticky } from "react-icons/fa6";

const EmptyCard = ({ imgSrc, message}) => {
  return (
    <div className="flex flex-col items-center justify-center mt-20 bg-cyan-100 p-8 rounded-lg shadow-md">
      
      {imgSrc ? (
        <img src={imgSrc} alt="No Journal" className="w-24 mb-5" />
      ) : (
        <FaRegNoteSticky className="text-cyan-500 w-24 h-24 mb-5" />
      )}

      <p className="w-3/4 text-sm font-medium text-slate-700 text-center leading-7">
        {message}
      </p>
    </div>
  );
};

export default EmptyCard;
