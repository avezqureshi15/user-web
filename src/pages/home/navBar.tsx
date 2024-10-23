import { FC, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, useTheme } from "@mui/material";
import { Images } from "@constants/imageConstants";
import { TryNowDialog } from "@components/UploadComponenetsPopup";
import { useState } from "react";
interface NavItemProps {
  name: string;
  activeIcon: keyof typeof Images;
  inactiveIcon: keyof typeof Images;
  onClick: () => void;
  selected: boolean;
}

const NavItem: FC<NavItemProps> = ({
  name,
  activeIcon,
  inactiveIcon,
  onClick,
  selected,
}: NavItemProps) => {
  const theme = useTheme();
  const isCreateItem = activeIcon === "CREATE_ICON";
  return (
    <Grid
      item
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: isCreateItem
          ? theme.palette.primary.main
          : "transparent",
        marginLeft: isCreateItem ? "15px" : "0px",
        padding: "8px",
        paddingLeft: "16px",
        paddingRight: "16px",
        borderRadius: "8px",
        cursor: "pointer",
        minWidth: "80px",
        justifyContent: "center",
        color: isCreateItem ? "white" : selected ? "#2E368E" : "inherit", // Change text color based on selected state
      }}
    >
      <img
        src={selected ? Images[inactiveIcon] : Images[activeIcon]}
        alt={name}
        style={{
          marginRight: 8,
          width: 24,
          height: 24,
        }}
      />
      <Typography
        style={{
          fontWeight: 500,
          fontSize: "14px",
        }}
      >
        {name}
      </Typography>
    </Grid>
  );
};

interface Props {
  children?: ReactNode;
  selected: string;
}

const NavBar: FC<Props> = ({ children, selected }) => {
  const items = [
    {
      name: "Projects",
      activeIcon: "PROJECTS_ICON",
      inactiveIcon: "PROJECT_BLUE",
      path: "/",
    },
    {
      name: "More",
      activeIcon: "MORE_ICON",
      inactiveIcon: "MORE_BLUE",
      path: "/account",
    },
    {
      name: "Create",
      activeIcon: "CREATE_ICON",
      inactiveIcon: "CREATE_ICON",
      path: "/upload",
    },
  ];

  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleItemClick = (path: string) => {
    if (path === "/upload") {
      // Open dialog instead of navigating to the route
      setIsDialogOpen(true);
    } else {
      navigate(path);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <Grid
      container
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "transparent",
        zIndex: 999,
      }}
    >
      {children}
      <Grid
        item
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          zIndex: 2,
        }}
      >
        <Grid
          container
          style={{
            maxWidth: "500px",
            height: "60px",
            backgroundColor: "#FFFFFF",
            margin: "20px",
            borderRadius: "16px",
            padding: "8px 20px 8px 8px",
            justifyContent: "space-evenly",
            alignContent: "center",
          }}
        >
          {items.map((item, index) => (
            <NavItem
              key={index}
              name={item.name}
              //@ts-expect-error
              activeIcon={item.activeIcon}
              //@ts-expect-error
              inactiveIcon={item.inactiveIcon}
              onClick={() => handleItemClick(item.path)}
              selected={selected === item.name} // Compare selected with item name directly
            />
          ))}
        </Grid>
      </Grid>
      <TryNowDialog open={isDialogOpen} onClose={handleCloseDialog} />
    </Grid>
  );
};

export default NavBar;
