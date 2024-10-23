import { InputLabel } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { Images } from "@constants/imageConstants";

interface CommonTextAreaProps {
  label: string;
  value: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  variant?: "standard" | "outlined" | "filled" | undefined;
  fullWidth?: boolean;
  required?: boolean;
  type?: "text" | "password" | "number" | "email" | "search" | "tel" | "url";
  hintText?: string;
  validator?: (value: string) => boolean;
  validationErrorMessage?: string;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
}

const CommonTextArea: React.FC<CommonTextAreaProps> = ({
  label,
  value,
  onChange,
  variant = "outlined",
  fullWidth = true,
  required = false,
  type = "text",
  hintText = "",
  validator,
  validationErrorMessage = "Invalid input",
  disabled,
  rows,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleValidation = (inputValue: string) => {
    if (validator) {
      setError(!validator(inputValue));
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange && !disabled) {
      onChange(event);
      handleValidation(event.target.value);
    }
  };

  return (
    <>
      <div style={{ marginBottom: "5px" }}>
        <InputLabel
          style={{
            color: "#000",
            fontWeight: 600,
            fontSize: "14px",
            fontFamily: "OpenSans",
            lineHeight: "20px",
            textAlign: "left",
          }}
        >
          {label}
        </InputLabel>
      </div>
      <TextField
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        variant={variant}
        fullWidth={fullWidth}
        value={value}
        onChange={handleChange}
        required={required}
        placeholder={hintText}
        error={error}
        helperText={error ? validationErrorMessage : ""}
        disabled={disabled}
        InputProps={{
          endAdornment: type === "password" && (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={togglePasswordVisibility}
                edge="end"
              >
                {showPassword ? (
                  <img src={Images.EYE_OFF} alt="Hide Password" />
                ) : (
                  <img src={Images.EYE} alt="Show Password" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            fontWeight: 400,
            fontSize: "14px",
            fontFamily: "OpenSans",
            backgroundColor: value ? "transparent" : "#F9FAFB",
            "&:hover": {
              backgroundColor: value ? "transparent" : "#F9FAFB",
            },
            "&.Mui-focused": {
              backgroundColor: "transparent",
            },
          },
        }}
        style={{ marginBottom: "10px" }}
        multiline
        rows={rows}
      />
    </>
  );
};

export default CommonTextArea;
