import {
  Button,
  Backdrop,
  Box,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import { Images } from "@constants/imageConstants";
import CloseIcon from "@mui/icons-material/Close";
import { CheckCircle } from "@mui/icons-material";
import { FC } from "react";

interface LinkModalProps {
  open: boolean;
  onClose: () => void;
  name: string;
  formattedDateTime: string;
}

const LinkModal: FC<LinkModalProps> = ({
  open,
  onClose,
  name,
  formattedDateTime,
}) => {
  return (
    <Backdrop open={open} style={{ zIndex: 999 }}>
      <Box
        component="div"
        sx={{
          width: "600px",
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
          textAlign: "center",
          padding: "24px, 24px, 12px, 24px",
          borderRadius: "12px",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            borderRadius: "12px",
            padding: "10px",
            backgroundColor: "#F5F5F5",
            color: "#000",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <Typography
              sx={{ fontWeight: "700", fontSize: "20px", marginLeft: "14px" }}
              gutterBottom
            >
              Select Platform
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            component="div"
            sx={{
              display: "flex",
              flexDirection: "row",
              borderRadius: "12px",
              backgroundColor: "white",
              justifyContent: "space-between",
              padding: "15px",
              alignItems: "center",
            }}
          >
            <Box
              component="div"
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontFamily: "OpenSans",
                  fontWeight: 600,
                  color: "black",
                  textAlign: "left",
                }}
              >
                {name}
              </Typography>
              <Typography
                variant="body2"
                color="#484848"
                gutterBottom
                sx={{ fontFamily: "OpenSans", fontWeight: 400 }}
              >
                {formattedDateTime}
              </Typography>
            </Box>
            <CheckCircle color="success" sx={{ fontSize: "25px" }} />
          </Box>
          <Box
            component="div"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              marginTop: "10px",
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "15px",
              alignItems: "center",
            }}
          >
            <img
              src={Images.LINK_MODAL}
              style={{ width: "100px", height: "100px" }}
            />
            <Typography
              variant="body2"
              color="#303030"
              gutterBottom
              sx={{
                fontFamily: "OpenSans",
                fontWeight: 600,
                marginTop: "15px",
              }}
            >
              Link feature is coming soon!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={onClose}
              style={{ marginTop: "20px" }}
              sx={{
                backgroundColor: "#FFF",
                color: "#2E368E",
                border: "1px solid #2E368E",
                "&:hover": {
                  backgroundColor: "#FFF",
                  color: "#2E368E",
                  border: "1px solid #2E368E",
                },
                fontFamily: "OpenSans",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Go Back
            </Button>
          </Box>
        </Paper>
      </Box>
    </Backdrop>
  );
};

export default LinkModal;
