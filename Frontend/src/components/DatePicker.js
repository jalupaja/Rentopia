import {Box} from "@mui/material";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import {DateRangePicker} from "react-date-range";
import { addDays, isWithinInterval, parseISO } from "date-fns";
import {useState} from "react";

function DatePicker({ bookedRanges, setNewFinance, newFinance }) {
    const [state, setState] = useState({
        selection1: [{
            startDate: addDays(new Date(), 1),
            endDate: addDays(new Date(), 3),
            key: 'selection1'
        }, {
            startDate: addDays(new Date(), 4),
            endDate: addDays(new Date(), 8),
            key: 'selection1'
        },{
            startDate: addDays(new Date(), 9),
            endDate: addDays(new Date(), 10),
            key: 'selection1'
        }]
    });

    const handleDateChange = (e) => {
        setNewFinance({newFinance: e.target.value});
    }

    return (
        <Box sx={{position: "relative", justifySelf: 'center'}}>
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
                ranges={[...state.selection1]}
                showSelectionPreview={false} // Disable selection preview
                showPreview={false} // Disable hover preview
                moveRangeOnFirstSelection={false} // Disable changing range
                editableDateInputs={false} // Disable manual date inputs
                staticRanges={[]} // Remove default static ranges
                inputRanges={[]} // Remove quick input ranges
                onChange={() => {handleDateChange()}} // Ignore any changes
            />
        </Box>
    )
}

export default DatePicker;