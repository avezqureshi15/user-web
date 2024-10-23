import { Grid, Typography } from "@mui/material";
import { FC, ReactNode, useEffect, useState } from "react";

import box1 from "../../assets/box1.png";
import box2 from "../../assets/box2.png";
import box3 from "../../assets/box3.png";
import styled from "styled-components";
interface Props {
  children?: ReactNode; // Define children prop
}

const StyledGridMain = styled(Grid)`
  @media (max-width: 770px) {
     display: 'flex',
     justifyContent: 'center !important',
     alignItems:'center'
  }
`;

const StyledGrid = styled(Grid)`
  @media (max-width: 770px) {
    display: none;
  }
`;

function useScreenWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

const AuthBackground: FC<Props> = ({ children }) => {
  const screenWidth = useScreenWidth();
  return (
    <StyledGridMain
      container
      sx={{
        minHeight: "100vh",
        backgroundColor: "#101332",
        margin: 0,
        padding: "5vw",
        width: "100%",
        alignItems: "center",
        marginTop: screenWidth <= 450 ? "-5rem" : "0rem",
        paddingBottom: '10rem'
      }}
    >
      <StyledGrid item xs={12} sm={6} md={4} lg={5} style={{ zIndex: 2 }}>
        <div style={{ padding: "20px", color: "#ffffff" }}>
          <Typography
            variant="h4"
            gutterBottom
            style={{
              fontSize: "2rem",
              marginBottom: "50px",
              fontFamily: "Comfortaa",
            }}
          >
            XenCapture
          </Typography>
          <Typography
            variant="h4"
            gutterBottom
            style={{
              fontSize: "44px",
              fontWeight: 600,
              fontFamily: "OpenSans",
            }}
          >
            Digitize your reality
          </Typography>

          <Typography
            variant="subtitle1"
            gutterBottom
            style={{
              fontSize: "24px",
              fontWeight: 400,
              fontFamily: "OpenSans",
            }}
          >
            Create 3D models of real-world objects in minutes using AI.
          </Typography>
        </div>
      </StyledGrid>

      {/* Render children component */}
      {children}

      {/* <svg
        viewBox="0 0 50 50"
        style={{
          position: "fixed",
          bottom: "-10%",
          left: "50%",
          transform: "translate(-50%, 50%)",
          zIndex: 1,
        }}
      > */}
      {/* <image href={Images.BOX1_SVG} width="20" height="20" /> */}

      {screenWidth <= 450 ? (
        ""
      ) : (
        <img src={box1} style={{ position: "fixed", top: "5%", left: "35%" }} />
      )}

      <img src={box3} className='bottom-none' style={{ position: "fixed", bottom: "0" }} />
      <img src={box2} style={{ position: "fixed", top: "48%", left: "51%" }} />
    </StyledGridMain>
  );
};

export default AuthBackground;
