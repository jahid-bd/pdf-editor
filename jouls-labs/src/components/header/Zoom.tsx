import { debounce } from 'lodash';
import React, { ChangeEvent } from 'react';
import ZoomInIcon from '../../assets/svg-icons/zoom-in-icon';
import ZoomOutIcon from '../../assets/svg-icons/zoom-out-icon';

type Props = {
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
};

const Zoom = ({ zoom, setZoom }: Props) => {
  const handleSlider = (e: ChangeEvent<HTMLInputElement>) => {
    setZoom(Number(e.target.value));
  };

  // Debounce delay time in milliseconds
  const DEBOUNCE_DELAY = 300;

  // Debounced zoom change functions
  const debouncedIncreaseZoom = debounce(
    () => handleZoomChange(15),
    DEBOUNCE_DELAY
  );
  const debouncedDecreaseZoom = debounce(
    () => handleZoomChange(-15),
    DEBOUNCE_DELAY
  );

  // Zoom change function
  const handleZoomChange = (amount: number) => {
    setZoom((prev) => {
      const newZoom = prev + amount;
      return Math.max(25, Math.min(185, newZoom)); // Ensure zoom is within the desired range
    });
  };

  // Zoom increase function with debounce
  const handleIncreaseZoom = () => {
    debouncedIncreaseZoom();
  };

  // Zoom decrease function with debounce
  const handleDecreaseZoom = () => {
    debouncedDecreaseZoom();
  };

  return (
    <div className="flex item-center w-full">
      <div className="flex items-center justify-center w-full">
        <button onClick={handleDecreaseZoom}>
          <ZoomOutIcon />
        </button>

        <input
          type="range"
          min={25}
          max={200}
          name="slider"
          value={zoom}
          onChange={handleSlider}
          className="range-slider "
        />

        <button className="ml-1" onClick={handleIncreaseZoom}>
          <ZoomInIcon />
        </button>
      </div>
      <div className="flex items-center justify-center w-[50px] mb-1">
        <span>{zoom}%</span>
      </div>
    </div>
  );
};

export default Zoom;
