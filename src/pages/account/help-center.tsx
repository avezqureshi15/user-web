import { useState } from "react";
import AccountHeader from "@components/accountHeader";
import { Box, Paper, Tab, Tabs } from "@mui/material";
import { Images } from "@constants/imageConstants";
import { DropDownBox, SupportTicketActions } from "./help-center-components";
import { Tutorials } from "@constants/helpCenter";

export default function HelpCenter() {
  const [tabValue, setTabValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);
    setTabValue(newValue);
  };

  return (
    <Paper
      style={{
        padding: 16,
        borderRadius: 16,
        height: "95%",
        width: "94%",
        marginTop: "4px",
      }}
    >
      <AccountHeader heading="Help Center" isEditable={false} />

      <Box component="div" sx={{ width: "100%" }}>
        <Box component="div" sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleChange}>
            <Tab
              label="Tutorials"
              icon={
                <img
                  src={
                    tabValue === 0
                      ? Images.HELP_TUTORIALS_COLOR
                      : Images.HELP_TUTORIALS
                  }
                  alt="Tutorials"
                  style={{ width: 20, height: 20 }}
                />
              }
              iconPosition="start"
              sx={{
                textTransform: "capitalize",
              }}
            />
            <Tab
              label="FAQ's"
              icon={
                <img
                  src={tabValue === 1 ? Images.HELP_FAQ_COLOR : Images.HELP_FAQ}
                  alt="Tutorials"
                  style={{ width: 20, height: 20 }}
                />
              }
              iconPosition="start"
              sx={{
                textTransform: "capitalize",
              }}
            />
            <Tab
              label="Support Tickets"
              icon={
                <img
                  src={
                    tabValue === 2
                      ? Images.HELP_SUPPORT_COLOR
                      : Images.HELP_SUPPORT
                  }
                  alt="Tutorials"
                  style={{ width: 20, height: 20 }}
                />
              }
              iconPosition="start"
              sx={{
                textTransform: "capitalize",
              }}
            />
            <Tab
              label="Terms and Conditions"
              icon={
                <img
                  src={
                    tabValue === 3 ? Images.HELP_TERM_COLOR : Images.HELP_TERM
                  }
                  alt="Tutorials"
                  style={{ width: 20, height: 20 }}
                />
              }
              iconPosition="start"
              sx={{
                textTransform: "capitalize",
              }}
            />
            <Tab
              label="Documents"
              icon={
                <img
                  src={
                    tabValue === 4
                      ? Images.HELP_DOCUMENTS_COLOR
                      : Images.HELP_DOCUMENTS
                  }
                  alt="Tutorials"
                  style={{ width: 20, height: 20 }}
                />
              }
              iconPosition="start"
              sx={{
                textTransform: "capitalize",
              }}
            />
          </Tabs>
        </Box>
        {tabValue === 0 &&
          Tutorials.map(({ heading, url, isLink }, index) => (
            <DropDownBox
              key={index}
              heading={heading}
              content={url}
              isDropable={true}
              isLink={isLink}
            />
          ))}
        {tabValue === 1 && (
          <DropDownBox
            heading="FAQ's"
            content={"https://xencapture.com/faq/"}
            isDropable={true}
          />
        )}

        {tabValue === 2 && (
          <>
            <SupportTicketActions />
          </>
        )}
        {tabValue === 3 && (
          <>
            <DropDownBox
              heading={"Terms and Conditions"}
              content={"https://xencapture.com/termsofservice/"}
              isDropable={true}
              isLink={true}
            />
            <DropDownBox
              heading={"Privacy and Policy"}
              content={"https://xencapture.com/privacy/"}
              isDropable={true}
              isLink={true}
            />
          </>
        )}
        {tabValue === 4 && (
          <DropDownBox
            heading={"XenCapture Guideline Document"}
            content={
              "https://xencapture-media-prod.s3.ap-south-1.amazonaws.com/onboarding/XenCapture+Guideline+Document+-+1.0.pdf"
            }
            isDropable={true}
            isLink={true}
          />
        )}
      </Box>
    </Paper>
  );
}
