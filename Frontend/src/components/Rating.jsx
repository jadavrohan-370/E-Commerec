import React from "react";
import { Star, StarHalf } from "lucide-react";

const Rating = ({ value, text, color = "#f8e825" }) => {
  return (
    <div className="flex items-center space-x-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((index) => (
          <span key={index}>
            {value >= index ? (
              <Star className="w-4 h-4 fill-current" style={{ color }} />
            ) : value >= index - 0.5 ? (
              <StarHalf className="w-4 h-4 fill-current" style={{ color }} />
            ) : (
              <Star className="w-4 h-4 text-gray-300" />
            )}
          </span>
        ))}
      </div>
      {text && <span className="text-sm text-gray-600 ml-2">{text}</span>}
    </div>
  );
};

export default Rating;
