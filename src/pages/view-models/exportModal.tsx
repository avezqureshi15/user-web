import {
  Button,
  Backdrop,
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
} from "@mui/material";
import { FC, useState } from "react";
import { useAppDispatch } from "@hooks/redux-hooks";
import { useNavigate } from "react-router-dom";
import { addToCart } from "@slices/projectSlice";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  name: string;
  date: string;
  time: string;
  isPurchased: boolean;
  id: string;
  formatUrls: { [key: string]: string };
}

const ExportModal: FC<ExportModalProps> = ({
  open,
  onClose,
  name,
  date,
  time,
  isPurchased,
  id,
  formatUrls,
}) => {
  const formats = Object.keys(formatUrls); // Use the keys of formatUrls
  const [selectedFormat, setSelectedFormat] = useState<string>(formats[0]); // Set initial selected format to the first one
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleBuyNow = async () => {
    try {
      const projectIds = [id];
      const response = await dispatch(addToCart(projectIds));
      console.log(response);
      const queryParams = new URLSearchParams({
        name,
        date,
        time,
        id,
      }).toString();
      navigate(`/cart?${queryParams}`);
    } catch (error) {
      console.log("Error Adding to Cart: ", error);
    }
  };

  const handleDownload = async () => {
    try {
      const downloadUrl = formatUrls[selectedFormat];
      console.log(formatUrls);
      if (!downloadUrl) {
        console.error("Selected format URL not found");
        toast.error("Selected format URL not found.");
        return;
      }
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        console.error("Failed to download file");
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${name}.${selectedFormat.toLowerCase()}`; // Set the file name and extension based on format
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("File downloaded successfully");
      onClose();
    } catch (error) {
      toast.error("Error during file download");
      console.error("Error during file download", error);
    }
  };

  return (
    <Backdrop open={open} style={{ zIndex: 999 }}>
      <Box
        component="div"
        sx={{
          width: "430px",
          height: "260px",
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
          textAlign: "center",
          padding: "24px",
          borderRadius: "12px",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            borderRadius: "12px",
            padding: "10px",
            backgroundColor: "#FFF",
            color: "#000",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <Box
            component="div"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "382px",
              height: "24px",
              gap: "8px",
              padding: "12px",
            }}
          >
            <Typography variant="h6" color="#000">
              Select Format
            </Typography>
            <IconButton onClick={onClose} sx={{ marginRight: "-14px" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: "12px",
              flexWrap: "wrap",
            }}
          >
            {formats?.map((item, index) => {
              return (
                <Chip
                  label={item.toUpperCase()}
                  variant="outlined"
                  key={index}
                  onClick={() => setSelectedFormat(item)}
                  sx={{
                    margin: 1,
                    padding: "8px, 16px, 8px, 16px",
                    width: "55px",
                    height: "40px",
                    gap: "4px",
                    fontSize: "12px",
                    lineHeight: "16px",
                    borderRadius: "6px",
                    borderColor:
                      selectedFormat === item ? "primary.main" : "default",
                    backgroundColor:
                      selectedFormat === item ? "#44476333" : "transparent",
                  }}
                />
              );
            })}
          </Box>
          {isPurchased ? (
            <Button
              variant="contained"
              fullWidth
              color="primary"
              style={{
                fontWeight: 600,
                textTransform: "none",
                fontFamily: "OpenSans",
              }}
              onClick={handleDownload}
            >
              Download
            </Button>
          ) : (
            <Button
              variant="contained"
              fullWidth
              color="primary"
              style={{
                fontWeight: 600,
                textTransform: "none",
                fontFamily: "OpenSans",
              }}
              onClick={handleBuyNow}
            >
              Pay to Download
            </Button>
          )}
        </Paper>
      </Box>
    </Backdrop>
  );
};

export default ExportModal;
