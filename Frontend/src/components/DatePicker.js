import React, { useState } from "react";
import { Box } from "@mui/material";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import { addDays, isWithinInterval } from "date-fns";

function DatePicker({ bookedRanges = [], updateDates }) {
    const [selection, setSelection] = useState({
        startDate: null,
        endDate: null,
        key: "selection",
    });

    const isDateAvailable = (date) => {
        const isPast = new Date(date) < new Date();

        const isOverlap = (Array.isArray(bookedRanges) ? bookedRanges : []).some((range) =>
            isWithinInterval(new Date(date), {
                start: new Date(range.startDate),
                end: new Date(range.endDate),
            })
        );

        return !isPast && !isOverlap;
    };

    const handleDateChange = ({ selection }) => {
        const { startDate, endDate } = selection;

        if (isDateAvailable(startDate) && isDateAvailable(endDate) && startDate <= endDate) {
            setSelection(selection);
            updateDates(startDate, endDate);
        }
    };

    const ranges = (Array.isArray(bookedRanges) ? bookedRanges : []).map((range) => ({
        startDate: new Date(range.startDate),
        endDate: new Date(range.endDate),
        key: `bookedRange-${range.startDate}-${range.endDate}`,
    }));

    return (
        <Box sx={{ position: "relative", justifySelf: "center" }}>
            <style>
                {`
                    .rdrDefinedRangesWrapper {
                        display: none;
                    }
                    .rdrDateDisplayWrapper {
                        display: none;
                    }
                    .rdrMonth {
                        pointer-events: none;
                    }
                `}
            </style>
            <DateRangePicker
                ranges={ranges}
                onChange={handleDateChange}
                minDate={addDays(new Date(), 1)}
                rangeColors={["#5c5b5b", ""]}
                dayContentRenderer={(date) => {
                    const isDisabled = !isDateAvailable(date);
                    return (
                        <div
                            style={{
                                color: isDisabled ? "#d3d3d3" : undefined,
                                pointerEvents: isDisabled ? "none" : undefined,
                            }}
                        >
                            {date.getDate()}
                        </div>
                    );
                }}
            />
        </Box>
    );
}

export default DatePicker;
