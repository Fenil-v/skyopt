import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.min.css';
import '../../public/assets/scss/DatePicker.scss';

const DatePickerField = ({
  selectedDate,
  handleOnChange,
  name,
  placeholderText,
  customInput,
  dateFormat = 'dd-MMM-yyyy',
  minDate = undefined,
  maxDate = undefined,
  filterDate = undefined,
  customStyle,
  includeDateIntervals = undefined,
  openToDate = undefined,
  open = undefined,
  disabled = false,
  showYearDropdown = false,
  showMonthYearPicker = false,
  readOnly = false,
  showTimeInput = false,
}: any) => {
  if (minDate === undefined || minDate === '') {
    minDate = null;
  }

  if (maxDate === undefined || maxDate === '') {
    maxDate = null;
  }

  return (
    <DatePicker
      showMonthYearPicker={showMonthYearPicker}
      showYearDropdown={showYearDropdown}
      dateFormatCalendar='MMMM'
      yearDropdownItemNumber={15}
      scrollableYearDropdown
      selected={selectedDate}
      onChange={(date: Date | null) => handleOnChange(date)}
      dateFormat={dateFormat}
      placeholderText={placeholderText}
      minDate={minDate}
      maxDate={maxDate}
      filterDate={filterDate}
      name={name}
      includeDateIntervals={includeDateIntervals && [...includeDateIntervals]}
      open={open}
      openToDate={openToDate}
      customInput={customInput}
      disabled={disabled}
      className={customStyle}
      readOnly={readOnly}
      showTimeInput={showTimeInput}
    />
  );
};

export default DatePickerField;