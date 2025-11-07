import React from "react";
import { MutatingDots } from "react-loader-spinner";

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <MutatingDots
        visible={true}
        height="100"
        width="100"
        color="#004CFF"
        secondaryColor="#004CF"
        radius="12.5"
        ariaLabel="mutating-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default Spinner;
