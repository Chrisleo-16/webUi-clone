import React, { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface XmobInputProps {
  type?: "text" | "email" | "password" | "number";
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
  className?: string;
  startIconSrc?: string;
  endIconSrc?: string;
  iconAlt?: string;
  name?: string;
  iconSize?: number;
  onEndIconClick?: () => void;
  readonly?: boolean;
  required?: boolean;
  height?: string;
  id?: string;
  multiline?: boolean;
  rows?: number;
  removeonMobile?: boolean;
}

const XmobInput: React.FC<XmobInputProps> = ({
  type = "text",
  label = "",
  placeholder = "",
  value = "",
  onChange,
  fullWidth = true,
  className = "",
  startIconSrc,
  endIconSrc,
  iconAlt = "icon",
  required = false,
  name,
  iconSize = 24,
  onEndIconClick,
  height,
  readonly = false,
  id,
  multiline = false,
  rows = 1,
  removeonMobile = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div
    className={`${removeonMobile ? 'hidden':'' }`}
    >
    <TextField
      label={label}
      placeholder={placeholder}
      type={type === "password" && !showPassword ? "password" : "text"}
      value={value}
      onChange={onChange}
      name={name}
      fullWidth={fullWidth}
      required={required}
      disabled={readonly}
      id={id}
      className={`${className} ${removeonMobile ? 'hidden':'' }`}
      variant="outlined"
      multiline={multiline}
      rows={rows}
      sx={{
        "&": className,
        "& .MuiOutlinedInput-root": {
          height: multiline ? "auto" : height + "rem",
        },
      }}
      InputProps={{
        startAdornment: startIconSrc ? (
          <InputAdornment position="start">
            <img
              src={startIconSrc}
              alt={iconAlt}
              width={iconSize}
              height={iconSize}
            />
          </InputAdornment>
        ) : null,
        endAdornment: (
          <InputAdornment position="end">
            {type === "password" ? (
              <IconButton onClick={handleTogglePassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ) : endIconSrc ? (
              <IconButton onClick={onEndIconClick} edge="end">
                <img
                  src={endIconSrc}
                  alt={iconAlt}
                  width={iconSize}
                  height={iconSize}
                />
              </IconButton>
            ) : null}
          </InputAdornment>
        ),
      }}
    />
    </div>

  );
};

export default XmobInput;
