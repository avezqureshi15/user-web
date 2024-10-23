import { Images } from "@constants/imageConstants";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { styled } from "@mui/material/styles";
interface SearchBarProps {
  onSearch: (query: string) => void;
}

const CustomTextField = styled(TextField)(() => ({
  "& .MuiInputBase-root": {
    height: "52px",
    borderRadius: "8px",
    border: "1px solid #D9D9D9",
    Padding: "14px",
    width: "250px",
  },
}));

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    // Trigger search callback on input change
    onSearch(query);
  };

  return (
    <CustomTextField
      placeholder="Search Models"
      value={searchQuery}
      onChange={handleInputChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" style={{ minHeight: "47px" }}>
            <IconButton>
              <img src={Images.SEARCH} alt="Search Icon" />
            </IconButton>
          </InputAdornment>
        ),
        style: {
          height: "47px",
          fontFamily: "OpenSans",
          fontSize: "14px",
          fontWeight: 400,
          width: "316px",
        },
      }}
      // style={{
      //   borderRadius: "10px",
      //   height: "52px",
      //   background: "#F9FAFB"
      // }}
    />
  );
};

export default SearchBar;
