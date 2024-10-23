import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Typography,
  Checkbox,
  Menu,
  MenuItem,
  Grid,
} from "@mui/material";
import DeleteIcon from "@assets/list-delete.svg";
import EditIcon from "@assets/list-edit.svg";
import ShareIcon from "@assets/share.svg";
// import { useAppDispatch } from "@hooks/redux-hooks";
// import { deleteProjects, fetchProjects } from "@slices/projectSlice";
import { useNavigate } from "react-router-dom";
import hourGlass from "../../assets/hourglass.gif";
import axiosInstance from "../../api/axiosInstance";
import { URLS } from "@constants/urlConstants";
import { toast } from "react-toastify";
import DeleteModal from "../view-models/deleteModal";
import { Images } from "@constants/imageConstants";
// import heic2any from "heic2any";

interface ProjectCardProps {
  id: number;
  name: string;
  date: string;
  time: string;
  imageUrl: string;
  status: string;
  selectPermitted: boolean;
  onSelect: () => void;
  clearSelection: boolean;
  type: string;
  imgCount: number;
  estimatedTime: string;
  fetchProjectsData: any;
}

function formatDateTime(dateTimeString: string): string {
  const dateTime = new Date(dateTimeString);

  const formattedDate = `${dateTime.getDate().toString().padStart(2, "0")}-${(
    dateTime.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${dateTime.getFullYear()}`;

  let hours = dateTime.getHours();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedTime = `${hours.toString().padStart(2, "0")}:${dateTime
    .getMinutes()
    .toString()
    .padStart(2, "0")}${ampm}`;

  return `${formattedDate} | ${formattedTime}`;
}

function formatEstimatedTime(timeString: string): string {
  if (timeString != undefined) {
    var timeParts = timeString?.split(":").map(Number);
    const hours = timeParts[0];
    const minutes = timeParts[1];
    var totalMinutes = hours * 60 + minutes;
    console.log(timeString);
  }
  //@ts-expect-error
  return `${totalMinutes}m`;
}

function truncateString(input: string): string {
  if (input.length > 12) {
    return input.slice(0, 13) + "...";
  }
  return input;
}

const ProjectCard = forwardRef(
  (
    {
      id,
      name,
      date,
      time,
      imageUrl,
      status,
      selectPermitted,
      onSelect,
      clearSelection,
      type,
      imgCount,
      estimatedTime,
      fetchProjectsData,
    }: ProjectCardProps,
    ref,
  ) => {
    const [isSelected, setIsSelected] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [shareAnchorEl, setShareAnchorEl] = useState<null | HTMLElement>(
      null,
    );
    // const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const inputRef = useRef<HTMLDivElement>(null);
    const [isDeleteClicked, setisDeleteClicked] = useState(false);

    useImperativeHandle(ref, () => ({
      toggleChildState() {
        if (isEditing && !anchorEl) {
          setIsEditing(false);
        }
      },
    }));

    useEffect(() => {
      if (clearSelection) {
        setIsSelected(false);
      }
    }, [clearSelection]);

    useEffect(() => {
      if (selectPermitted) {
        setIsSelected(false);
      }
    }, [selectPermitted]);

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };
    const handleDeleteClick = () => {
      fetchProjectsData();
      setisDeleteClicked(true);
      handleClose();
    };

    const handleCardClick = () => {
      setIsSelected(!isSelected);
      onSelect();
    };

    // const handleEditClick = () => {
    //   setIsEditing(true);
    // };

    // const handleSaveClick = async () => {
    //   try {
    //     //@ts-expect-error
    //     await dispatch(updateProjectDetails({ modelId: id, modelName }));
    //     toast.success("Model name has been successfully saved.");
    //     setModelName(modelName);
    //     setIsEditing(false);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    // const handleCancelClick = () => {
    //   setIsEditing(false);
    //   setModelName(name); // Reset to original name if canceled
    // };

    // const handleKeyDown = (event: React.KeyboardEvent) => {
    //   if (event.key === "Enter") {
    //     handleSaveClick();
    //   } else if (event.key === "Escape") {
    //     handleCancelClick();
    //   }
    // };

    // const handleHeicConversion = async(image:any)=>{
    //   var imageBlob;
    //   if (typeof image === "string") {
    //     const response = await fetch(image);
    //     imageBlob = await response.blob();
    //   } else {
    //     imageBlob = image;
    //   }
    //   const convertedBlob:any = await heic2any({
    //     blob: imageBlob,
    //     toType: "image/jpeg",
    //     quality: 0.01,
    //   });
    //   const convertedUrl = URL.createObjectURL(convertedBlob);
    //   return convertedUrl;
    // }

    const formattedDateTime = formatDateTime(`${date} ${time}`);

    const fetchDraftImages = async (draftModelId: any) => {
      try {
        const response = await axiosInstance.get(
          `${URLS.GET_IMAGES}?model_id=${draftModelId}`,
        );
        return response.data.urls;
      } catch (error) {
        console.error("Error fetching draft images:", error);
        return [];
      }
    };

    const handleImageClick = async () => {
      if (status === "Draft") {
        if (type === "image") {
          try {
            const draftModelId = id;
            const images = await fetchDraftImages(draftModelId);
            navigate("/upload?tab=0", { state: { images, id } });
          } catch (error) {
            console.error("Error handling image click:", error);
          }
        } else if (type === "video") {
          try {
            const draftModelId = id;
            const video = await fetchDraftImages(draftModelId);
            const draft = true;
            navigate("/upload?tab=1", { state: { video, id, draft } });
          } catch (error) {
            console.error("Error handling video click:", error);
          }
        }
      } else {
        navigate("/view-model", {
          state: { name, date, time, id, imageUrl, estimatedTime },
        });
      }
    };

    const handleEditImageClick = async () => {
      navigate("/view-model", {
        state: { name, date, time, id, edit: true },
      });
    };

    const handleShareClick = (event: React.MouseEvent<HTMLElement>) => {
      setShareAnchorEl(event.currentTarget);
    };

    const handleShareClose = () => {
      setShareAnchorEl(null);
    };

    const handleCopyLink = () => {
      const url = new URL(`${window.location.href}view-model/`);
      url.searchParams.append("name", name);
      url.searchParams.append("date", date);
      url.searchParams.append("time", time);
      url.searchParams.append("id", id.toString());
      navigator.clipboard.writeText(url.toString());
      toast.success("Link copied to clipboard", { position: "bottom-center" });
      handleShareClose();
      handleClose();
    };
    const handleShareEmail = () => {
      try {
        console.log("Preparing for Mail Release");

        const currentUrl = window.location.origin + window.location.pathname;
        console.log("Current URL: ", currentUrl);
        const full_name: string = localStorage.getItem("full_name") || "";

        const userName = full_name;
        console.log("User name: ", userName);

        const modelLink = `${currentUrl}view-model?name=${encodeURIComponent(name)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&id=${encodeURIComponent(id)}`;
        console.log("Model Link Generated: ", modelLink);

        const emailSubject = `${userName} has shared a 3D model with you!`;
        console.log("Email Subject: ", emailSubject);

        const emailBody = `Hi there!
    
    ${userName} has shared a 3D model for you to check out. Please click on the link below to open the 3D model on our website.
    
    ${modelLink}
    
    Please create an account to access the 3D model. If you already have an account, please login.
    
    Best Regards,
    XenCapture`;

        console.log("Email Body: ", emailBody);

        const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        console.log("Final Link: ", mailtoLink);

        // Create a new anchor element
        const anchor = document.createElement("a");
        anchor.href = mailtoLink;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";

        anchor.click();
        console.log("Email Released...");

        handleShareClose();
        console.log("Closing Modals...");

        handleClose();
      } catch (error) {
        console.error("Error occurred in handleShareEmail:", error);
      }
    };

    return (
      <>
        <Card
          elevation={0}
          style={{ margin: "8px", position: "relative", cursor: "pointer" }}
          onClick={(event: any) => event.stopPropagation()}
          sx={{
            "@media (max-width: 425px)": {
              width: "155px",
              '-webkit-flex-basis': '0%',
              'flex-basis': '0%',
            },
          }}
        >
          <Chip
            label={status}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
              backgroundColor: "inherit",
              marginLeft: "4px",
              marginTop: "8px",
            }}
            icon={
              status === "Paid" ? (
                <CheckCircleOutlineIcon style={{ color: "green" }} />
              ) : undefined
            }
          />
          {status === "In-progress" && (
            <div
              style={{
                position: "absolute",
                height: "20px",
                width: "35px",
                backgroundColor: "white",
                right: "10px",
                borderRadius: "20px",
                top: "60%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p style={{ fontSize: "10px" }}>
                {formatEstimatedTime(estimatedTime)}
              </p>
              <img
                style={{ width: "15px", height: "15px" }}
                src={hourGlass}
                alt="hour-glass"
              />
            </div>
          )}
          {status !== "In-progress" &&
            (type === "image" || type === "video") && (
              <div
                style={{
                  position: "absolute",
                  height: `${type === "video" ? "15px" : "20px"}`,
                  width: `${type === "video" ? "12px" : "35px"}`,
                  backgroundColor: "white",
                  right: "10px",
                  borderRadius: "20px",
                  top: "60%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "6px 9px 6px 9px",
                }}
              >
                {type === "image" ? (
                  <p style={{ fontSize: "12px", fontWeight: 700 }}>
                    {imgCount}
                  </p>
                ) : (
                  ""
                )}
                <img
                  style={{
                    width: `${type === "video" ? "17px" : "15px"}`,
                    height: `${type === "video" ? "17px" : "15px"}`,
                    marginLeft: `${type === "video" ? "0px" : "5px"}`,
                  }}
                  src={
                    type === "video"
                      ? Images.VIDEO_PLACEHOLDER
                      : Images.IMAGE_PLACEHOLDER
                  }
                  alt="hour-glass"
                />
              </div>
            )}
          {selectPermitted ? (
            <Checkbox
              checked={isSelected}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                zIndex: 2,
                color: "#2E368E",
                borderRadius: "4px",
              }}
              sx={{
                "& .MuiSvgIcon-root": {
                  backgroundColor: "white",
                  borderRadius: "4px",
                },
              }}
              onClick={handleCardClick}
            />
          ) : (
            <>
              <IconButton
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  zIndex: 2,
                  color: "#242424",
                  background: "#eeeeee4d",
                  borderRadius: "50%",
                  padding: "3px 4px",
                  marginTop: "7px",
                  marginRight: "5px",
                  border: "1px solid #0000001c",
                  "&:hover": {
                    background: "#ffffff",
                  },
                }}
                onClick={handleMenuClick}
                aria-label="menu"
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                //@ts-expect-error
                getContentAnchorEl={null}
              >
                {(status === "Paid" || status === "Unpaid") && (
                  <MenuItem
                    sx={{
                      width: "96px",
                    }}
                    onClick={handleShareClick}
                  >
                    <Grid
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <span>Share</span>
                      <img
                        src={ShareIcon}
                        style={{
                          position: "absolute",
                          right: "6px",
                        }}
                        alt="Share"
                      />
                    </Grid>
                  </MenuItem>
                )}

                {(status === "Paid" || status === "Unpaid") && (
                  <MenuItem
                    sx={{
                      width: "96px",
                    }}
                    onClick={handleEditImageClick}
                  >
                    <Grid
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <span>Edit</span>
                      <img
                        style={{
                          width: "20px",
                          position: "absolute",
                          right: "6px",
                        }}
                        src={EditIcon}
                        alt="Edit"
                      />
                    </Grid>
                  </MenuItem>
                )}

                <MenuItem
                  sx={{
                    width: "96px",
                  }}
                  onClick={handleDeleteClick}
                >
                  <Grid
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <span>Delete</span>
                    <img
                      style={{
                        width: "20px",
                        position: "absolute",
                        right: "6px",
                      }}
                      src={DeleteIcon}
                      alt="Delete"
                    />
                  </Grid>
                </MenuItem>
              </Menu>
              <Menu
                anchorEl={shareAnchorEl}
                open={Boolean(shareAnchorEl)}
                onClose={handleShareClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                style={{ left: "105px" }}
                //@ts-expect-error
                getContentAnchorEl={null}
              >
                <MenuItem onClick={handleCopyLink}>Copy Link</MenuItem>
                <MenuItem onClick={handleShareEmail}>Email</MenuItem>
              </Menu>
            </>
          )}

          {!(imageUrl?.endsWith("mp4") || imageUrl?.endsWith("mov")) ? (
            <CardMedia
              component="img"
              height={type == null ? "84px" : "180px"}
              sx={{
                width: type == null ? "118px" : "100%",
                borderRadius: "8px",
                padding: type == null ? "3rem 22px" : "",
              }}
              image={imageUrl}
              alt="Project Image"
              onClick={handleImageClick}
            />
          ) : (
            <video
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                objectFit: "cover",
                minWidth: "100%",
              }}
              onClick={handleImageClick}
              height="180"
              src={imageUrl}
            ></video>
          )}
          <CardContent
            ref={inputRef}
            style={{ padding: 4, background: "#F7F7F7", paddingTop: "8px" }}
          >
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              style={{
                fontFamily: "OpenSans",
                fontSize: "16px",
                fontWeight: 600,
              }}
              title={name}
            >
              {truncateString(name)}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              style={{
                fontFamily: "OpenSans",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              {formattedDateTime}
            </Typography>
          </CardContent>
        </Card>
        {isDeleteClicked && (
          <DeleteModal
            fetchProjectsData={fetchProjectsData}
            open={isDeleteClicked}
            onClose={() => setisDeleteClicked(false)}
            id={id}
          />
        )}
      </>
    );
  },
);

export default ProjectCard;
