import { Grid, Paper } from "@mui/material";
import { useState } from "react";
import AccountDetailsEdit from "./account-detail-edit";
import AccountDetailsView from "./account-details";
import PasswordForm from "./change-password-form";

enum AccountDetailsType {
  DETAILS = "details",
  EDIT = "edit",
  PASSWORD = "password",
}

function AccountDetails() {
  const [currentForm, setCurrentForm] = useState<AccountDetailsType>(
    AccountDetailsType.DETAILS,
  );

  const handleShowEditFormClick = () => {
    setCurrentForm(AccountDetailsType.EDIT);
  };

  const handleShowPasswordFormClick = () => {
    setCurrentForm(AccountDetailsType.PASSWORD);
  };

  const handleShowAccountDetail = () => {
    setCurrentForm(AccountDetailsType.DETAILS);
  };

  const renderForm = () => {
    switch (currentForm) {
      case AccountDetailsType.DETAILS:
        return (
          <AccountDetailsView
            handleShowEditFormClick={handleShowEditFormClick}
            handleShowPasswordFormClick={handleShowPasswordFormClick}
          />
        );
      case AccountDetailsType.EDIT:
        return (
          <AccountDetailsEdit
            handleShowAccountDetail={handleShowAccountDetail}
          />
        );
      case AccountDetailsType.PASSWORD:
        return (
          <PasswordForm handleShowAccountDetail={handleShowAccountDetail} />
        );
      default:
        return null;
    }
  };

  return (
    <Grid container sx={{ height: "100%", widht: "100%" }}>
      <Paper
        style={{
          padding: 16,
          borderRadius: 16,
          height: "95%",
          width: "94%",
          marginTop: "4px",
        }}
      >
        {renderForm()}
      </Paper>
    </Grid>
  );
}

export default AccountDetails;
