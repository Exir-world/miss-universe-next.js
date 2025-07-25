import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent border-white"></div>
    </div>
  );
};

export default Spinner;
