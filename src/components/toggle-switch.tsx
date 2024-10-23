import { Switch } from "@mui/material";
import { styled } from "@mui/system";

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  overflow: "visible",
  "& .MuiSwitch-switchBase": {
    padding: 0,
    marginLeft: 2,
    marginTop: 3,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#00A652", // On state background color
        opacity: 1,
        border: 0,
      },
      "& .MuiSwitch-thumb": {
        backgroundColor: "#fff", // On state thumb color
      },
      "& .MuiSwitch-thumb:before": {
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#1B1464", // On state checkmark color
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[100],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.7,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
    backgroundColor: "#79747E",
    "&:before": {
      position: "absolute",
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#E6E0E9",
    },
  },
  "& .MuiSwitch-track": {
    borderRadius: 13, // 26 / 2
    backgroundColor: "#E6E0E9",
    border: "2px solid #79747E",
    opacity: 1,
    //@ts-expect-error
    transition: theme.transitions.create(["background-color", "border"], {
      duration: 500,
    }),
  },
}));

interface CustomToggleSwitchProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomToggleSwitch: React.FC<CustomToggleSwitchProps> = ({
  checked,
  onChange,
}) => {
  return (
    //@ts-expect-error
    <IOSSwitch checked={checked} onChange={onChange} />
  );
};

export default CustomToggleSwitch;
