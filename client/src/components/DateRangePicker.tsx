import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import moment from 'moment';
import { useState, useEffect } from 'react';

const DateRangePickerField = ({
  selectionRange,
  handleOnSelect,
  hadlePopupClosed,
  className,
  minDate,
  maxDate,
  dmonths = 2,
}: any) => {

  const [selectedRange, setSelectedRange] = useState(selectionRange);

  let min;
  let max;

  if (minDate) {
    min = new Date(minDate);
  } else {
    min = new Date(2003, 1, 1);
  }
  if (maxDate) {
    max = new Date(maxDate);
  } else {
    max = moment().add(10, 'years').toDate();
  }

  const onChange = (ranges: any) => {
    setSelectedRange(ranges.selection);
  };

  const handleSelectDate = () => {
    const newSelectedRange = {
      startDate: selectedRange?.startDate,
      endDate:
        new Date(selectedRange?.endDate) >= new Date(maxDate)
          ? new Date()
          : new Date(selectedRange?.endDate),
      key: 'selection',
    };

    handleOnSelect(newSelectedRange);
  };

  // Show only loader initial level
  useEffect(() => {
    autoSetPosition();
    window.addEventListener('resize', autoSetPosition);
    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', autoSetPosition);
    };
  }, []);

  const autoSetPosition = () => {
    if (document.body.offsetWidth > 767) {
      const datePickerParent = document.querySelector(
        '.date-range-picker-parent',
      );
      const element = datePickerParent?.querySelector(
        '.form-control',
      ) as HTMLElement | null;
      const container = document.querySelector(
        '.date-range-picker-container',
      ) as HTMLElement | null;

      const ktAppContainer = document.getElementById(
        'kt_app_content_container',
      );
      const ktAppContainerWidth = ktAppContainer?.offsetWidth || 0;

      const elementOffsetTop = element?.offsetTop || 0;
      const elementOuterHeight = element?.offsetHeight || 0;
      const containerTop = elementOffsetTop + elementOuterHeight;
      const containerWidth = container?.offsetWidth || 0;

      const offsetTopAdjustment = 5;

      if (container && containerWidth > ktAppContainerWidth) {
        const reductionPercentage = 0.2;
        const newContainerWidth =
          ktAppContainerWidth * (1 - reductionPercentage);
        container.style.width = `${newContainerWidth}px`;
      }

      const elementBounding = element?.getBoundingClientRect();
      if (document.body.offsetWidth > 1000) {
        if (elementBounding && element && container) {
          const elementOffsetRight =
            window.innerWidth - elementBounding.right - element.offsetWidth;
          const spaceRight = ktAppContainerWidth - elementBounding.right;
          const spaceLeft = elementBounding.left;

          if (spaceRight > spaceLeft) {
            container.style.top = `${containerTop + offsetTopAdjustment}px`;
            container.style.left = `0px`;
            container.style.right = 'auto';
          } else {
            container.style.top = `${containerTop + offsetTopAdjustment}px`;
            container.style.right = `${-elementOffsetRight}px`;
            container.style.left = 'auto';
          }
        }
      } else {
        if (elementBounding && element && container) {
          const elementOffsetRight =
            window.innerWidth - elementBounding.right - element.offsetWidth;
          const spaceRight = ktAppContainerWidth - elementBounding.right;
          const spaceLeft = elementBounding.left;

          if (spaceRight > spaceLeft) {
            container.style.top = `${containerTop + offsetTopAdjustment}px`;
            container.style.left = `-20px`;
            container.style.right = 'auto';
          } else {
            container.style.top = `${containerTop + offsetTopAdjustment}px`;
            container.style.right = `${spaceLeft - ktAppContainerWidth - elementOffsetRight}px`;
            container.style.left = 'auto';
          }
        }
      }
    }
  };

  return (
    <div className='date-range-picker-container'>
      <DateRangePicker
        className={className}
        minDate={min}
        maxDate={max}
        onChange={onChange}
        months={dmonths}
        ranges={[selectedRange]}
        direction='horizontal'
        //inputRanges={new Date(max) <= new Date() ? [] : undefined}
        // preventSnapRefocus={true}
        rangeColors={['#173748']}
      />
      <div className='action-button'>
        <button
          type='button'
          onClick={hadlePopupClosed}
          className='btn btn-light me-2 btn-sm'
        >
          Cancel
        </button>
        <button
          type='button'
          onClick={handleSelectDate}
          className='btn btn-primary btn-sm'
        >
          Ok
        </button>
      </div>
    </div>
  );
};

export default DateRangePickerField;