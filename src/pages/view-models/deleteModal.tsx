import { Button, Backdrop, Box, Paper, Typography } from "@mui/material";
import { Images } from "@constants/imageConstants";
import { useAppDispatch } from "@hooks/redux-hooks";
import { deleteProjects } from "@slices/projectSlice";
import { useNavigate } from "react-router-dom";
import { FC } from "react";

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  id: any;
  fetchProjectsData?: any;
}

const DeleteModal: FC<DeleteModalProps> = ({
  open,
  onClose,
  id,
  fetchProjectsData,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleDeleteModel = async () => {
    try {
      const modelId = [id];
      await dispatch(deleteProjects(modelId));
      navigate("/");
      onClose();
      fetchProjectsData();
      // window.location.reload();
    } catch (error) {
      console.error("Failed to delete model:", error);
    }
  };
  return (
    <Backdrop open={open} style={{ zIndex: 999 }}>
      <Box
        component="div"
        sx={{
          width: "310px",
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
            padding: "14px",
            backgroundColor: "#FFF",
            color: "#000",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <Box
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={Images.DELETE_ICON_RED}
              alt="Logout"
              style={{ width: 25, height: 25, color: "red" }}
            />
          </Box>
          <Typography sx={{ fontWeight: "700", fontSize: "20px" }} gutterBottom>
            Are you sure you want to delete this model?
          </Typography>
          <Typography variant="body2" color="#484848" gutterBottom>
            By clicking Delete, the model will be deleted permanently.
          </Typography>
          <Box component="div" sx={{ display: "flex", gap: "16px" }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={handleDeleteModel}
              sx={{
                backgroundColor: "#FFF",
                color: "red",
                border: "1px solid red",
                "&:hover": {
                  backgroundColor: "#FFF",
                  color: "red",
                  border: "1px solid red",
                },
              }}
            >
              Delete
            </Button>
          </Box>
        </Paper>
      </Box>
    </Backdrop>
  );
};

export default DeleteModal;
