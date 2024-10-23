import { Images } from "@constants/imageConstants";
import { Button, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { TryNowDialog } from "./UploadComponenetsPopup";
import { NavLink } from "react-router-dom";
// Reusable Card Component

function HomeCoursal() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Grid
      container
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      style={{
        background:
          "linear-gradient(89.82deg, #202342 71%, rgba(22, 25, 64, 0.1) 80.21%)",
        marginTop: "0px",
        width: "100vw",
        height: "55vh",
        padding: "00px",
      }}
    >
      <Grid item xs={5} paddingLeft={"10vw"} paddingRight={"5vw"}
        sx={{
          "@media (max-width: 425px)": {
            'box-sizing': 'unset',
          },
        }}
      >
        <Typography
          variant="h3"
          component="div"
          style={{
            color: "white",
            textAlign: "left",
            fontSize: "32px",
            fontWeight: "bold",
            width: "700px",
          }}
        >
          Create 3D models in minutes using AI.
        </Typography>

        <Grid
          container
          justifyContent="space-evenly"
          alignItems="left"
          spacing={2}
          style={{ marginTop: "20px" }}
          sx={{
            "@media (max-width: 425px)": {
              display: 'flex',
              flexWrap: 'nowrap'
            },
          }}
        >
          <Grid item xs={12} sm={6}
            sx={{
              "@media (max-width: 425px)": {
                marginLeft: "3rem",
              },
            }}
          >
            <Button
              variant="contained"
              style={{
                backgroundColor: "white",
                color: "#2E368E",
                padding: "10px 20px",
                fontWeight: 600,
                width: "90%",
                height: "48px",
                textTransform: "none",
                fontSize: "16px",
                fontFamily: "OpenSans",
              }}
              sx={{
                "@media (max-width: 425px)": {
                  width: "164% !important",
                },
              }}
              onClick={handleOpenDialog} // Open the dialog on button click
            >
              Try Now
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}
            sx={{
              "@media (max-width: 425px)": {
                marginLeft: "3rem",
              },
            }}
          >
            <NavLink
              to={{
                pathname: "/account",
                search: "?tab=help",
              }}
            >
              <Button
                variant="outlined"
                style={{
                  color: "white",
                  borderColor: "white",
                  background: "transparent",
                  padding: "10px 10px",
                  fontWeight: 600,
                  width: "100%",
                  height: "48px",
                  textTransform: "none",
                  fontSize: "14px",
                  fontFamily: "OpenSans",
                }}
                sx={{
                  "@media (max-width: 425px)": {
                    width: "190% !important",
                  },
                }}
              >
                View Tutorials
              </Button>
            </NavLink>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        xs={3}
        sm={5}
        md={6}
        lg={4}
        style={{
          height: "100%",
          zIndex: -1,
          textAlign: "right",
        }}
      >
        <img
          src={Images.HOME_BG}
          alt="Description of the image"
          style={{
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      </Grid>
      <TryNowDialog open={dialogOpen} onClose={handleCloseDialog} />
    </Grid>
  );
}

export default HomeCoursal;
