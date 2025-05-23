"use client";
import React from "react";
import { Select, MenuItem, FormControl, InputLabel, FormHelperText } from "@mui/material";
import xmobcolors from "@/app/styles/xmobcolors"; 
import { ArrowDropDown } from "@mui/icons-material";

interface XmobDropdownProps {
  options: { label: string; value: string }[]; 
  selectedValue: string;  
  onChange: (value: string) => void;  
  label: string;  
  helperText?: string; 
  disabled?: boolean;  
  className?: string;  
}

const XmobDropdown: React.FC<XmobDropdownProps> = ({
  options,
  selectedValue,
  onChange,
  label,
  helperText,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={`w-full ${className}`}>
      <FormControl fullWidth variant="outlined" disabled={disabled}>
        {/* Label */}
        <InputLabel id="xmob-dropdown-label">{label}</InputLabel>
        
        <Select
          labelId="xmob-dropdown-label"
          value={selectedValue}
          onChange={(e) => onChange(e.target.value)}
          label={label}
          className="text-lg"
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>

        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </div>
  );
};

export default XmobDropdown;
