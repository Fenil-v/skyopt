import { useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css"; // Import the desired theme

const DatePicker = ({ label, onDateChange, options, currDate }: any) => {
  const [date, setDate]:any = useState(null); 

  const handleDateChange = (selectedDates: any) => {
    const selectedDate = selectedDates[0] || null;
    setDate(selectedDate);
    if (onDateChange) {
      onDateChange(selectedDate);
    }
  };
console.log("currDate", currDate);

  return (
    <div style={{ marginBottom: "20px" }}>
      {label && <label style={{ display: "block", marginBottom: "5px" }}>{label}</label>}
      <Flatpickr
        value={date} 
        onChange={handleDateChange}
        options={{
          enableTime: false, 
          dateFormat: "Y-m-d", 
          maxDate: currDate, 
          ...options,
        }}
        className="date-picker-input"
        placeholder="Date of Birth" // Custom placeholder
      />
    </div>
  );
};

export default DatePicker;