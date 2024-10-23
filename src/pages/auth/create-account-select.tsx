import { Images } from "@constants/imageConstants";
import {
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  ListItemIcon,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Radio from "@mui/material/Radio";

export interface AccountType {
  profileTitle: string;
  profileSubtitle: string;
}

interface AccountTypeCardProps extends AccountType {
  onSelect: () => void;
  selected: boolean;
}

function AccountTypeCard({
  profileTitle,
  profileSubtitle,
  onSelect,
  selected,
}: AccountTypeCardProps) {
  return (
    <div onClick={onSelect} style={{ cursor: "pointer" }}>
      <Card
        elevation={0}
        style={{
          borderRadius: 16,
          border: `1px solid #EAEAEA`,
          display: "flex",
          alignItems: "center",
          marginBottom: "10px",
          gap: "0",
        }}
      >
        <ListItemIcon sx={{ minWidth: "0" }}>
          <Radio color="primary" checked={selected} onChange={onSelect} />
        </ListItemIcon>
        <CardContent
          sx={{
            paddingRight: "16px",
            paddingTop: "16px",
            paddingBottom: "16px",
            paddingLeft: "0px",
          }}
        >
          <Typography
            variant="h6"
            align="left"
            gutterBottom
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#000",
              fontFamily: "OpenSans",
            }}
          >
            {profileTitle}
          </Typography>
          <Typography
            align="left"
            gutterBottom
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "#303030",
              fontFamily: "OpenSans",
            }}
          >
            {profileSubtitle}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

const accountTypes: AccountType[] = [
  {
    profileTitle: "Individual",
    profileSubtitle: "For single users to work on personal projects.",
  },
  /*{
    profileTitle: "Teams",
    profileSubtitle: "For multiple users to collaborate on projects.",
  },*/
];

function CreateAccountSelect({
  onNext,
  onSelect,
}: {
  onNext: () => void;
  onSelect: (accountType: AccountType) => void;
}) {
  const [selectedAccountType, setSelectedAccountType] =
    useState<AccountType | null>(null);

  const handleSelect = (accountType: AccountType) => {
    setSelectedAccountType(accountType);
  };

  const handleNext = () => {
    if (selectedAccountType) {
      console.log(selectedAccountType);
      onSelect(selectedAccountType);
      onNext();
    }
  };
  const navigate = useNavigate();
  const handleArrowClick = () => {
    navigate(-1);
  };

  return (
    <Grid item xs={12} sm={8} md={6} lg={3} sx={{ zIndex: 2 }}>
      <Paper
        elevation={3}
        style={{
          padding: 30,
          borderRadius: 16,
          width: "320px",
          position: "relative",
          right: "120px",
        }}
      >
        <Grid container item alignItems="center">
          <Grid item>
            <IconButton
              sx={{ alignItems: "center", display: "flex" }}
              onClick={handleArrowClick}
            >
              <img
                src={Images.LEFT_ARROW}
                alt="back"
                style={{ paddingBottom: "10px" }}
              />
            </IconButton>
          </Grid>
          <Grid item>
            <Typography
              variant="h5"
              align="left"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontColor: "#000",
                fontSize: "24px",
                alignItems: "center",
                display: "flex",
              }}
            >
              Select profile
            </Typography>
          </Grid>
        </Grid>

        <Typography
          align="left"
          gutterBottom
          style={{
            marginBottom: "20px",
            fontFamily: "OpenSans",
            fontWeight: 400,
            fontSize: "14px",
          }}
        >
          Choose one profile to create your account
        </Typography>
        {accountTypes.map((accountType, index) => (
          <AccountTypeCard
            key={index}
            {...accountType}
            onSelect={() => handleSelect(accountType)}
            selected={selectedAccountType === accountType}
          />
        ))}
        <Grid>
          <Button
            onClick={handleNext}
            fullWidth
            variant="contained"
            color="primary"
            style={{
              fontFamily: "OpenSans",
              fontWeight: 500,
              fontSize: "14px",
              textTransform: "none",
            }}
          >
            Next
          </Button>
        </Grid>
      </Paper>
    </Grid>
  );
}

export default CreateAccountSelect;
