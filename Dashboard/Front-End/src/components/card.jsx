import React from "react";
import RandomTemperature from "../items/randomMath";

const Card = (props) => {
  const { params, value, gambar, cap } = props; //tambah value
  return (
    <div className="shadow-md rounded-xl ">
      <div className="px-5 pt-5">
        <div className="flex justify-start gap-3 items-start mb-2">
          <div>
            <h1 className="text-lg font-semibold text-black dark:text-gray-100 mb-2">
              {params}
            </h1>
            <div className="flex justify-start gap-3 items-start">
              <div>
                {value} {/* ganti props value*/}
              </div>
              <div>
                {cap}
              </div>
            </div>
          </div>
          <div>
            <img style={{ width: "80px" }} src={gambar} alt="logo react" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
