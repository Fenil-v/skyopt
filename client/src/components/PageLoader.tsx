import React, { useEffect } from "react";

interface LoaderProps {
  isLoading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isLoading }) => {  
  useEffect(() => {
    const rootElement = document.getElementById("root");
    const splashScreenElement = document.getElementById("splash-screen");

    if (isLoading) {
      rootElement?.classList.add("gray-body");
      splashScreenElement!.style.display = "flex";
    } else {
      rootElement?.classList.remove("gray-body");
      splashScreenElement!.style.display = "none";
    }

    return () => {
      rootElement?.classList.remove("gray-body");
      splashScreenElement!.style.display = "none";
    };
  }, [isLoading]);

  return (
    <div id="splash-screen" style={{ display: "none" }}>
      <div className="flight-loader">
        <div className="plane"></div>
        <p>Loading your flight experience...</p>
      </div>
    </div>
  );
};

export default Loader;