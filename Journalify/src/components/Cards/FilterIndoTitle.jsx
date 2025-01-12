import React from 'react';
import { MdOutlineClose } from 'react-icons/md';
import moment from 'moment';

const FilterInfoTitle = ({ filterType, filterDate, onClear }) => {

  const DateRangeChip = ({ date }) => {
    const startDate = date?.from ? moment(date.from).format("Do MMM YYYY") : "N/A";
    const endDate = date?.to ? moment(date.to).format("Do MMM YYYY") : "N/A";

    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded bg-slate-100">
        <p className="text-xs font-medium">{startDate} — {endDate}</p>
        <button onClick={onClear}>
          <MdOutlineClose />
        </button>
      </div>
    );
  };

  return (
    filterType && (
      <div className="mb-5">
        {filterType === "search" ? (
          <div className="text-lg font-medium">
            <h3>Search Results</h3>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Travel Stories from</h3>
            <DateRangeChip date={filterDate} />
          </div>
        )}
      </div>
    )
  );
};

export default FilterInfoTitle;
