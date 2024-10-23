import { Images } from "@constants/imageConstants";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";

interface ImageCardProps {
  imageUrl: string;
  title: string;
  subTitle2: string | any;
  subTitle3?: string;
  subTitle4?: string;
  subTitle5?: string;
  subTitle6?: string;
  color: string;
}

function ImageCard({
  imageUrl,
  title,
  subTitle2,
  subTitle3,
  subTitle4,
  subTitle5,
  subTitle6,
  color,
}: ImageCardProps) {
  return (
    <Card
      style={{
        marginBottom: "16px",
        margin: "8px",
        backgroundColor: color,
        boxShadow: "none",
        borderRadius: "16px",
        padding: "8px",
      }}
    >
      <Grid container alignItems="center">
        <Grid item xs={9}>
          <CardContent>
            <Typography gutterBottom component="div">
              {title}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                fontFamily: "OpenSans",
                fontSize: "0.8rem",
                color: "#303030",
              }}
            >
              {subTitle2}
            </Typography>
            {subTitle4 && (
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  fontFamily: "OpenSans",
                  fontSize: "14px",
                  color: "#303030",
                  fontWeight: 600,
                }}
              >
                {subTitle4}
              </Typography>
            )}
            {subTitle5 && (
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  fontFamily: "OpenSans",
                  fontSize: "14px",
                  color: "#303030",
                  fontWeight: 600,
                }}
              >
                {subTitle5}
              </Typography>
            )}
            {subTitle6 && (
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  fontFamily: "OpenSans",
                  fontSize: "14px",
                  color: "#303030",
                  fontWeight: 600,
                }}
              >
                {subTitle6}
              </Typography>
            )}
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                fontFamily: "OpenSans",
                fontWeight: "bold",
                fontSize: "1.2rem",
                color: "#303030",
              }}
            >
              {subTitle3}
            </Typography>
          </CardContent>
        </Grid>
        <Grid
          item
          xs={3}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <CardMedia
            component="img"
            style={{
              height: "auto",
              width: "70px",
              objectFit: "contain",
              padding: "8px",
            }}
            image={imageUrl}
            alt="Image"
          />
        </Grid>
      </Grid>
    </Card>
  );
}

interface TryNowDialogProps {
  open: boolean;
  onClose: () => void;
}

export function TryNowDialog({ open, onClose }: TryNowDialogProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleTabChange = (
    _event: React.ChangeEvent<object>,
    newValue: number,
  ) => {
    setActiveTab(newValue);
  };

  const handleClick = () => {
    // navigate to upload screen with index
    navigate(`/upload?tab=${activeTab}`);
  };

  const getButtonLabel = () => {
    switch (activeTab) {
      case 0:
        return "Upload Images";
      case 1:
        return "Upload Video";
      case 2:
        return "Upload 3D model";
      default:
        return "Upload Files";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ padding: "0px" }}
      PaperProps={{ sx: { borderRadius: "16px" } }}
    >
      <Box
        component="div"
        sx={{ borderRadius: "16px", width: "450px", height: "662px" }}
      >
        {/* Wrap Dialog in Box and apply border radius */}
        <DialogTitle
          style={{
            fontWeight: 700,
            color: "#000",
            fontSize: "20px",
            fontFamily: "OpenSans",
          }}
        >
          Upload Files
          <Button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "inherit",
            }}
          >
            <CloseIcon />
          </Button>
        </DialogTitle>
        <DialogContent sx={{ height: "auto", minHeight: "470px" }}>
          {/* Add Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
            style={{ flex: 1 }}
          >
            <Tab
              label="Images"
              style={{
                flex: 1,
                fontFamily: "OpenSans",
                fontWeight: 600,
                color: activeTab === 0 ? "#2E368E" : "#000",
                fontSize: "14px",
                borderBottom: "1px solid #D0D0D0",
              }}
            />
            <Tab
              label="Videos"
              style={{
                flex: 1,
                fontFamily: "OpenSans",
                fontWeight: 600,
                color: activeTab === 1 ? "#2E368E" : "#000",
                fontSize: "14px",
                borderBottom: "1px solid #D0D0D0",
              }}
            />
            <Tab
              label="3D Models"
              style={{
                flex: 1,
                fontFamily: "OpenSans",
                fontWeight: 600,
                color: activeTab === 2 ? "#2E368E" : "#000",
                fontSize: "14px",
                borderBottom: "1px solid #D0D0D0",
              }}
            />
          </Tabs>
          {/* Add content for each tab */}
          {activeTab === 0 && (
            <>
              <ImageCard
                imageUrl={Images.MUG}
                title="Small Size Object"
                subTitle2="Recommended number of images"
                subTitle3="24 - 50 images"
                color="#F9F5F2"
              />
              <ImageCard
                imageUrl={Images.CHAIR}
                title="Medium Size Object"
                subTitle2="Recommended number of images"
                subTitle3="50 - 80 images"
                color="#EDF2F6"
              />
              <ImageCard
                imageUrl={Images.CAR}
                title="Large Size Object"
                subTitle2="Recommended number of images"
                subTitle3="80 - 120 images"
                color="#EDF6F5"
              />
            </>
          )}
          {/* Add content for other tabs */}
          {/* Content for Videos tab */}
          {activeTab === 1 && (
            <ImageCard
              imageUrl={Images.VIDEOCAMERA}
              title="Video"
              subTitle2="Recommended settings:"
              subTitle4="FPS: 60"
              subTitle5="HDR mode: On"
              subTitle6="Resolution: 1920 x 1080 (1080p)"
              color="#F9F5F2"
            />
          )}
          {/* Content for 3D Model tab */}
          {activeTab === 2 && (
            <ImageCard
              imageUrl={Images.MODEL}
              title="3D model"
              subTitle2={
                <>
                  Upload any <strong>GLB or USDZ</strong> file to view in your
                  projects.
                </>
              }
              subTitle3=""
              color="#EDF2F6"
            />
          )}
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "8px",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Typography
            style={{
              fontFamily: "OpenSans",
              fontWeight: 400,
              textAlign: "left",
              fontSize: "14px",
            }}
          >
            {" "}
            Ensure to capture all sides of the object!{" "}
          </Typography>
          <Button
            onClick={handleClick}
            variant="contained"
            color="primary"
            style={{
              fontFamily: "OpenSans",
              fontWeight: 400,
              textTransform: "none",
              width: "96%",
            }}
          >
            {getButtonLabel()}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
