import MenuIcon from "@mui/icons-material/Menu";
import { Grid, IconButton } from "@mui/material";
import { SetStateAction, useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import NavBar from "../home/navBar";
import AccountDetails from "./account-details-main";

import BillingDetails from "./biling-details";
import HelpCenter from "./help-center";

//import ComingSoon from "./comingSoon";
import RefferalProgram from "./RefferalProgram";
import NotificationSettings from "./notification-settings";

function DashboardPage() {
  const [selectedItem, setSelectedItem] = useState("account");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 850);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [referralKey, setReferralKey] = useState(0);

  const handleResize = () => {
    setIsMobileView(window.innerWidth < 850);
  };

  const handleItemClick = (item: SetStateAction<string>) => {
    setSelectedItem(item);
    if (item === "referral") {
      setReferralKey((prevKey) => prevKey + 1); // Update key to remount RefferalProgram
    }
    if (isMobileView) {
      setIsSidebarOpen(false); // Close sidebar on item click in mobile view
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar in mobile view
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <NavBar selected="More">
      <Grid container style={{ backgroundColor: "#F7F8FB", maxHeight: "80vh" }}>
        {/* Desktop View */}
        {!isMobileView && (
          <>
            {/* Left Sidebar */}
            <Grid
              item
              xs={12}
              md={3}
              style={{ padding: "10px", minHeight: "90%" }}
            >
              <Sidebar onItemClick={handleItemClick} />
            </Grid>

            {/* Main Content */}
            <Grid
              item
              xs={12}
              md={9}
              style={{ padding: "10px", minHeight: "90%" }}
            >
              {/* Account details */}
              {selectedItem === "account" && <AccountDetails />}

              {selectedItem === "billing" && <BillingDetails />}
              {selectedItem === "notifications" && <NotificationSettings />}

              {selectedItem === "help" && <HelpCenter />}

              {selectedItem === "referral" && (
                <RefferalProgram key={referralKey} />
              )}
            </Grid>
          </>
        )}

        {/* Mobile View */}
        {isMobileView && (
          <>
            {/* Account details takes up full screen */}
            <Grid item xs={12} style={{ minHeight: "100vh" }}>
              {/* Account details */}
              {selectedItem === "account" && <AccountDetails />}
            </Grid>

            {/* Sidebar opens over the account details page */}
            {isSidebarOpen && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: 999,
                }}
              >
                <Sidebar onItemClick={handleItemClick} />
              </div>
            )}

            {/* Hamburger menu */}
            {!isSidebarOpen && (
              <IconButton
                onClick={toggleSidebar}
                style={{
                  position: "fixed",
                  top: "10px",
                  left: "10px",
                  zIndex: 1000,
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </>
        )}
      </Grid>
    </NavBar>
  );
}

export default DashboardPage;
