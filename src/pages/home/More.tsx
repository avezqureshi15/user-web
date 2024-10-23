import HomeCoursal from "@components/HomeCoursal";
import { Images } from "@constants/imageConstants";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import NavBar from "./navBar";

function More() {
  return (
    <NavBar selected="More">
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <img src={Images.CREATE_ICON} alt="Menu" />
            </IconButton>
            <Typography variant="h6" component="div">
              XenCapture
            </Typography>
          </Toolbar>
        </AppBar>
        <HomeCoursal />
      </div>
    </NavBar>
  );
}

export default More;
