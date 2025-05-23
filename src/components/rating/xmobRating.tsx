import React, { useState, useEffect } from "react";
import { IconButton, Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

interface XmobRatingProps {
  totalStars?: number;  
  value?: number;       
  onChange?: (rating: number) => void; 
  color?: string;       
  size?: number;        
  readOnly?: boolean;   
}

const XmobRating: React.FC<XmobRatingProps> = ({
  totalStars = 5,
  value = 0,
  onChange,
  color = "#FFD700",
  size = 30,
  readOnly = false,
}) => {
  const [rating, setRating] = useState(value);

  useEffect(() => {
    setRating(value);
  }, [value]);

  const handleRating = (newRating: number) => {
    if (readOnly) return; 
    setRating(newRating);
    if (onChange) onChange(newRating);
  };

  return (
    <Box display="flex">
      {Array.from({ length: totalStars }, (_, i) => (
        <IconButton
          key={i}
          onClick={() => handleRating(i + 1)}
          sx={{ padding: 0, cursor: readOnly ? "default" : "pointer" }}
        >
          <StarIcon
            sx={{
              fontSize: size,
              color: i < rating ? color : "#ccc", 
            }}
          />
        </IconButton>
      ))}
    </Box>
  );
};

export default XmobRating;
