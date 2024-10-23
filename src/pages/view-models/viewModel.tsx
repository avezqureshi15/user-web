/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  FC,
  useEffect,
  useState,
  useMemo,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
// import { CSG } from "three-csg-ts";
import {
  Typography,
  Card,
  TextField,
  IconButton,
  Grid,
  CircularProgress,
  BottomNavigation,
  BottomNavigationAction,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { fetchProjects, retrieveModel } from "@slices/projectSlice";
import { useAppDispatch } from "@hooks/redux-hooks";
import { Images } from "@constants/imageConstants";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateProjectDetails } from "@slices/projectSlice";
import DeleteModal from "./deleteModal";
import ExportModal from "./exportModal";
import LinkModal from "./linkModal";
import { Canvas, useThree } from "@react-three/fiber";
import { useControls, Leva } from "leva";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import "../../App.scss";
import * as THREE from "three";
import { Suspense } from "react";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { Html, useProgress } from "@react-three/drei";
import { update3DModel } from "@slices/imageUploadSlice";
import { SUBTRACTION, ADDITION, Brush, Evaluator } from "three-bvh-csg";
// import { USDZExporter } from "three/examples/jsm/exporters/USDZExporter.js";

interface ViewModelProps {
  name: string;
  date: string;
  time: string;
  id: string;
  imageUrl?: string;
  estimatedTime?: string;
}

const customTheme = {
  colors: {
    highlight1: "#FFFFFF",
    highlight2: "#FFFFFF",
  },
};

interface ThreeDModelProps {
  modelUrl: string;
  clippingPlanes?: any;
  scale?: any;
  rotation?: any;
  translate?: any;
  setModel?: any;
  navItem?: any;
  ref?: any;
  id?: any;
  setclipSize?: any;
  boxSizeVector?: any;
  setBoxSizeVector?: any;
  clipSize?: any;
  changeLoading?: (loading: boolean) => void;
  name?: string;
  setPositionControls?: any;
  setprevBoxSizeVector?: any;
  initialClipSize?: any;
}

const ViewModel: FC<ViewModelProps> = ({
  name,
  date,
  time,
  id,
  imageUrl,
  estimatedTime,
}) => {
  const [modelUrl, setModelUrl] = useState("");
  const [formatUrls, setFormatUrls] = useState({
    GLB: "",
    OBJ: "",
    GLTF: "",
    DAE: "",
    FBX: "",
    USDZ: "",
    STL: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error2, setError2] = useState("");
  const [modelName, setModelName] = useState(name);
  const [navItem, setNavItem] = useState("");
  const [isPurchased, setIspurchased] = useState(false);
  const [isLinkClicked, setisLinkClicked] = useState(false);
  const [isExportClicked, setisExportClicked] = useState(false);
  const [isDeleteClicked, setisDeleteClicked] = useState(false);
  const shareDivRef = useRef<HTMLDivElement | null>(null);

  // Format date and time
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isShare, setIsShare] = useState(false);
  const initialIsEditing = location.state && location.state.edit ? true : false;
  const storedState = localStorage.getItem("IsEditing");
  const parsedState = storedState && JSON.parse(storedState);
  const [isEditing, setIsEditing] = useState<boolean>(
    initialIsEditing || parsedState,
  );
  const [nameEdit, setNameEdit] = useState(false);
  const childRef = useRef<{ reset: () => void; save: () => void }>(null);

  const handleResetChildControls = () => {
    if (childRef.current) {
      childRef.current.reset();
    }
  };

  const handleSaveModelControl = async () => {
    if (childRef.current) {
      childRef.current.save();
    }
  };
  console.log(formatUrls);
  const [filteredFormatUrls, setFilteredFormatUrls] = useState<{
    [key: string]: string;
  }>({});
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchModelUrl = async () => {
      try {
        const response = await dispatch(retrieveModel(id));
        if (
          response.payload.status === "error" ||
          response.payload.status === "failed"
        ) {
          setError2("Model could not be generated. Please try again.");
          setIsLoading(false);
        } else if (response.payload.status === "in-progress") {
          setError2(
            `Please wait while we create a 3D model for you. ETA: ${estimatedTime?.substring(3)} mins`,
          );
          setIsLoading(false);
        } else {
          if (response?.payload?.model_url?.endsWith(".usdz")) {
            setModelUrl(response.payload.glb);
          } else {
            setModelUrl(response.payload.model_url);
          }

          // Filter the available formats and their URLs
          const availableFormats = [
            "glb",
            "obj",
            "gltf",
            "dae",
            "fbx",
            "usdz",
            "stl",
          ];
          const filteredFormatUrls = availableFormats.reduce<{
            [key: string]: string;
          }>((acc, curr) => {
            if (response.payload[curr]) {
              acc[curr] = response.payload[curr];
            }
            return acc;
          }, {});

          setFilteredFormatUrls(filteredFormatUrls);
          setIsLoading(false);
        }
      } catch (error) {
        setError2(
          "Please wait while we create a 3D model for you. ETA: 4:00 mins",
        );
        setIsLoading(false);
      }
    };

    fetchModelUrl();
  }, []);

  useEffect(() => {
    const checkPurchased = async () => {
      try {
        const response = await dispatch(fetchProjects());
        const fetchedProjects = response.payload.data;
        // Check if project with matching id and is_paid === true exists
        const matchingProject = fetchedProjects.find(
          (project: { id: string; is_paid: boolean }) =>
            project.id === id && project.is_paid === true,
        );
        console.log(matchingProject);
        console.log(id);
        console.log(fetchedProjects);

        matchingProject !== undefined
          ? setIspurchased(true)
          : setIspurchased(false);
        console.log(matchingProject);
        // setModelName(response?.payload?.data[0]?.name);
        console.log("Projects fetched successfully:", response.payload);
      } catch (error) {
        console.log("Error fetching projects:", error);
      }
    };

    checkPurchased();
  }, [dispatch, id]);

  const handleBackClick = () => {
    navigate(-1);
    localStorage.removeItem("IsEditing");
  };
  const handleBackEditClick = () => {
    setIsEditing(false);
    localStorage.removeItem("IsEditing");
  };

  // const handleEditClick = async () => {
  //   setIsEditing(true);
  // };

  const handleNameEditClick = async () => {
    setNameEdit(true);
  };

  const handleLinkClick = () => {
    setisLinkClicked(true);
  };

  const handleDeleteClick = () => {
    setisDeleteClicked(true);
  };

  const handleExportClick = () => {
    setisExportClicked(true);
  };

  const handleClickOutside = (event: any) => {
    if (shareDivRef.current && !shareDivRef.current.contains(event.target)) {
      setIsShare(false);
    }
  };

  useEffect(() => {
    if (isShare) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    // else {
    //   document.removeEventListener('mousedown', handleClickOutside);
    // }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isShare]);

  const handleSaveClick = async () => {
    try {
      const modelId = id;
      await dispatch(
        updateProjectDetails({ modelId: modelId || "", modelName }),
      );
      setModelName(modelName);
      setNavItem("");
      setNameEdit(false);
      toast.success("Model Name has been successfully saved.");
    } catch (error) {
      // not yet handled
    }
  };

  const handleCopyLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.append("name", name);
    url.searchParams.append("date", date);
    url.searchParams.append("time", time);
    url.searchParams.append("id", id);
    navigator.clipboard.writeText(url.toString());
    toast.success("Link copied to clipboard", { position: "bottom-center" });
    setIsShare(false);
  };

  const handleShareEmail = () => {
    try {
      console.log("Preparing for Mail Release");

      const url = new URL(window.location.href);
      console.log("Current URL: ", url);

      const full_name: string = localStorage.getItem("full_name") || "";

      const userName = full_name || "A user"; // Default to "A user" if name is not available
      console.log("User name: ", userName);

      const modelLink = `${url}?name=${encodeURIComponent(name)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&id=${encodeURIComponent(id)}`;
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

      window.open(mailtoLink);
      console.log("Email Released...");

      setIsShare(false);
    } catch (error) {
      console.error("Error occurred in handleShareEmail:", error);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error2) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
        }}
      >
        <img
          src={imageUrl}
          alt="Error"
          style={{
            width: "10%",
            marginBottom: "20px",
            height: "200px",
            borderRadius: "10px",
            objectFit: "cover",
          }}
        />
        <Typography
          sx={{ fontFamily: "OpenSans", fontWeight: 600, marginBottom: "1rem" }}
        >
          {error2}
        </Typography>
        <Button
          sx={{
            width: { xs: "100px", md: "100px" },
            height: { xs: "40px", md: "48px" },
            padding: "14px, 16px, 14px, 16px",
            borderRadius: "12px",
            background: "#2E368E",
            marginLeft: "1rem",
            fontSize: "1rem",
          }}
          variant="contained"
          onClick={() => {
            navigate("/");
          }}
        >
          Go Back
        </Button>
      </div>
    );
  }

  async function handleSave() {
    setIsSaving(true);
    // handleSaveClick();
    handleSaveModelControl();
    localStorage.setItem("IsEditing", "false");
  }

  async function changeLoading(loading: boolean) {
    try {
      const response = await dispatch(retrieveModel(id));
      setModelUrl(response.payload.model_url);
      const { usdz, glb } = response.payload;
      setFormatUrls((prevUrls) => ({
        ...prevUrls,
        USDZ: usdz,
        GLB: glb,
      }));
      toast.success("Model has been successfully saved.");
      setIsSaving(loading);
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      // not handled yet
    }
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

  const formattedDateTime = formatDateTime(`${date} ${time}`);
  return (
    <>
      <Grid
        container
        alignItems="center"
        style={{ paddingLeft: "20px", paddingTop: "15px" }}
      >
        {!isEditing ? (
          <Grid item>
            <IconButton
              aria-label="Go back"
              onClick={handleBackClick}
              style={{ marginRight: "10px" }}
            >
              <img src={Images.LEFT_ARROW} alt="back" />
            </IconButton>
          </Grid>
        ) : (
          <Grid item>
            <IconButton
              aria-label="Go back"
              onClick={handleBackEditClick}
              style={{ marginRight: "10px" }}
            >
              <img src={Images.LEFT_ARROW} alt="back" />
            </IconButton>
          </Grid>
        )}
        <Grid item>
          {/* Conditional rendering of editable model name */}
          {nameEdit ? (
            <TextField
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              variant="standard"
              sx={{ width: { xs: "100px", md: "200px" } }}
              inputProps={{
                sx: {
                  padding: "2px",
                },
              }}
            />
          ) : (
            <Typography
              sx={{
                fontFamily: "Roboto",
                fontWeight: 400,
                fontSize: { xs: "1rem", md: "1.5rem" },
              }}
              component="div"
              gutterBottom
            >
              {modelName}
            </Typography>
          )}
          <Typography
            variant="body2"
            color="#303030"
            gutterBottom
            sx={{
              fontFamily: "OpenSans",
              fontWeight: 400,
              fontSize: "12px",
              marginBlock: "4px",
            }}
          >
            {formattedDateTime}
          </Typography>
        </Grid>
        <Grid
          item
          sx={{
            display: {
              xs: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            },
          }}
        >
          {nameEdit ? (
            <Button
              sx={{
                width: { xs: "100px", md: "100px" },
                height: { xs: "40px", md: "48px" },
                padding: "14px, 16px, 14px, 16px",
                borderRadius: "12px",
                background: "#2E368E",
                marginLeft: "1rem",
              }}
              onClick={handleSaveClick}
              variant="contained"
            >
              Save
            </Button>
          ) : (
            <IconButton
              aria-label="Edit Name"
              onClick={handleNameEditClick} // Change the handler based on editing mode
              sx={{
                marginRight: { xs: "15px", md: "10px" },
                position: { md: "relative" },
                top: { xs: "-13px", ms: "-18px" },
              }}
            >
              <img
                src={Images.EDIT_BLACK}
                alt="edit"
                style={{ width: "20px", height: "20px" }}
              />
            </IconButton>
          )}
          {isEditing && !nameEdit && (
            <Button
              sx={{
                flex: 1,
                padding: "8px",
                fontSize: "14px",
                minWidth: "100px",
                minHeight: "40px",
                position: "absolute",
                right: { xs: 20, md: 40 },
              }}
              onClick={handleSave}
              variant="contained"
            >
              Save Model
            </Button>
          )}
        </Grid>
        {!isEditing && !nameEdit && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setIsShare((prev) => !prev);
            }}
            style={{
              flex: 1,
              padding: "8px",
              textTransform: "none",
              fontFamily: "OpenSans",
              fontWeight: 600,
              minWidth: "80px",
              maxWidth: "80px",
              minHeight: "40px",
              position: "absolute",
              right: 40,
            }}
          >
            Share
          </Button>
        )}
      </Grid>
      {isShare && (
        <div
          style={{ position: "absolute", right: 20, top: 160, zIndex: 9 }}
          ref={shareDivRef}
        >
          <div
            style={{
              maxWidth: "80px",
              height: "60px",
              padding: "10px",
              borderRadius: "10px",
              boxShadow: "2px 2px 12px gray",
              marginRight: 10,
              marginTop: -10,
            }}
          >
            <div
              onClick={handleCopyLink}
              style={{
                cursor: "pointer",
                fontStyle: "Open sans",
                fontWeight: "600",
              }}
            >
              Copy Link
            </div>
            <hr />
            <div
              onClick={handleShareEmail}
              style={{
                cursor: "pointer",
                fontStyle: "Open sans",
                fontWeight: "600",
              }}
            >
              Email
            </div>
          </div>
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          height: "700px",
          padding: "10px 9rem",
          boxSizing: "border-box",
        }}
      >
        <Card
          elevation={0}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          {modelUrl &&
            (isEditing ? (
              <>
                {isSaving && (
                  <Dialog open={true}>
                    <DialogTitle
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      Saving Changes{" "}
                      <CircularProgress
                        style={{ width: "20px", height: "20px" }}
                      />
                    </DialogTitle>
                    <DialogContent>
                      <p>The process usually takes 30 seconds</p>
                    </DialogContent>
                  </Dialog>
                )}
                <ThreeDModelComponent
                  changeLoading={changeLoading}
                  modelUrl={modelUrl}
                  navItem={navItem}
                  ref={childRef}
                  id={id}
                />
              </>
            ) : (
              <>
                {/* @ts-expect-error:'' */}
                <model-viewer
                  id="transform"
                  disable-tap
                  src={modelUrl}
                  poster={Images.DownloadLight}
                  alt="Model Image"
                  touch-action="pan-y"
                  style={{
                    width: "100%",
                    height: "700px",
                    borderRadius: "8px",
                  }}
                  autoplay
                  camera-controls
                  ar
                  ar-modes="webxr scene-viewer quick-look"
                  quick-look-browsers="safari chrome"
                  field-of-view="5deg"
                >
                  {/*@ts-expect-error: ''*/}
                </model-viewer>
              </>
            ))}
        </Card>
      </div>
      <BottomNavigation
        sx={{
          width: "390px",
          height: "45px",
          backgroundColor: "#ffffff",
          padding: "16px",
          borderTop: "1px solid #EFEFF0",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          borderRadius: "16px",
          position: "fixed",
          zIndex: 10,
        }}
      >
        {!isEditing ? (
          [
            <BottomNavigationAction
              showLabel={true}
              label="Edit"
              onClick={() => {
                setIsEditing(true);
                localStorage.setItem("IsEditing", "true");
              }}
              icon={<img src={Images.EDIT_NAVBAR} />}
            />,
            isPurchased ? (
              <BottomNavigationAction
                key="export"
                showLabel={true}
                label="Export"
                icon={<img src={Images.EXPORT} />}
                onClick={handleExportClick}
              />
            ) : (
              <BottomNavigationAction
                key="export"
                showLabel={true}
                label="Export"
                icon={
                  <BadgeIconWithImage
                    icon={<img src={Images.EXPORT} />}
                    badgeImage={Images.BADGE_LOCK}
                  />
                }
                onClick={handleExportClick}
              />
            ),
            <BottomNavigationAction
              showLabel={true}
              label="Link"
              icon={
                <BadgeIconWithImage
                  icon={<img src={Images.LINK} />}
                  badgeImage={isPurchased ? "" : Images.BADGE_LOCK}
                />
              }
              onClick={handleLinkClick}
            />,
            <BottomNavigationAction
              showLabel={true}
              label="Delete"
              icon={<img src={Images.DELETE_ICON} />}
              onClick={handleDeleteClick}
            />,
          ]
        ) : (
          <>
            <BottomNavigationAction
              showLabel={true}
              label="Crop"
              icon={<img src={Images.CROP} />}
              style={{
                color: navItem === "Crop" ? "blue" : "",
              }}
              onClick={() => {
                setNavItem("Crop");
              }}
            />
            <BottomNavigationAction
              showLabel={true}
              label="Resize"
              style={{
                color: navItem === "Resize" ? "blue" : "",
              }}
              icon={
                <img
                  style={{
                    width: "20px",
                    height: "26px",
                  }}
                  src={Images.SCALE_ICON}
                />
              }
              onClick={() => {
                setNavItem("Resize");
              }}
            />
            <BottomNavigationAction
              showLabel={true}
              label="Translation"
              style={{
                color: navItem === "Translation" ? "blue" : "",
              }}
              icon={<img src={Images.TRANSLATE_ICON} />}
              onClick={() => {
                setNavItem("Translation");
              }}
            />
            <BottomNavigationAction
              showLabel={true}
              label="Rotate"
              style={{
                color: navItem === "Rotate" ? "blue" : "",
              }}
              icon={<img src={Images.CUBE_ICON} />}
              onClick={() => {
                setNavItem("Rotate");
              }}
            />
            <BottomNavigationAction
              showLabel={true}
              label="Reset"
              style={{
                color: navItem === "Reset" ? "blue" : "",
              }}
              icon={
                <img style={{ marginTop: "5px" }} src={Images.RESET_ICON} />
              }
              onClick={handleResetChildControls}
            />
          </>
        )}
      </BottomNavigation>
      {isDeleteClicked && (
        <DeleteModal
          open={isDeleteClicked}
          onClose={() => setisDeleteClicked(false)}
          id={id}
        />
      )}
      {isExportClicked && (
        <ExportModal
          open={isExportClicked}
          onClose={() => setisExportClicked(false)}
          name={name}
          date={date}
          time={time}
          isPurchased={isPurchased}
          id={id}
          formatUrls={filteredFormatUrls}
        />
      )}
      {isLinkClicked && (
        <LinkModal
          open={isLinkClicked}
          onClose={() => setisLinkClicked(false)}
          name={name}
          formattedDateTime={formattedDateTime}
        />
      )}
    </>
  );
};

export default ViewModel;

interface BadgeIconWithImageProps {
  icon: JSX.Element;
  badgeImage: string;
}

const BadgeIconWithImage: FC<BadgeIconWithImageProps> = ({
  icon,
  badgeImage,
}) => (
  <div style={{ position: "relative", display: "inline-block" }}>
    {icon}
    {badgeImage && (
      <img
        src={badgeImage}
        alt="Badge"
        style={{
          position: "absolute",
          top: "-14px",
          right: "-22px",
          width: "24px",
          height: "24px",
        }}
      />
    )}
  </div>
);

// const applyClippingPlanesToGeometry = (
//   scene: THREE.Group,
//   clippingPlanes: THREE.Plane[]
// ) => {
//   scene.traverse((child) => {
//     if ((child as THREE.Mesh).isMesh) {
//       const mesh = child as THREE.Mesh;
//       const bsp = CSG.fromMesh(mesh);

//       clippingPlanes.forEach((plane) => {
//         const planeGeometry = new THREE.PlaneGeometry(10, 10);
//         const planeMesh = new THREE.Mesh(
//           planeGeometry,
//           new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
//         );
//       //   // Align planeMesh to the plane
//         const normal = plane.normal.clone();
//         const constant = plane.constant;
//       //   // Calculate rotation from the normal
//         const quaternion = new THREE.Quaternion();
//         quaternion.setFromUnitVectors(new THREE.Vector3(1, 1, 1), normal);
//         planeMesh.setRotationFromQuaternion(quaternion);

//       //   // Position the plane mesh according to the plane constant
//         planeMesh.position.copy(normal.multiplyScalar(constant));

//         const planeBsp = CSG.fromMesh(planeMesh);
//         const subtractedBsp = bsp.subtract(planeBsp);
//         const resultMesh = CSG.toMesh(subtractedBsp, mesh.matrix);
//         resultMesh.material = mesh.material;
//         scene.remove(mesh);
//         console.log("This is result mesh:",resultMesh);
//         scene.add(resultMesh);
//       });
//     }
//   });
// };

const Model: FC<ThreeDModelProps> = forwardRef(
  (
    {
      modelUrl,
      clippingPlanes,
      scale,
      rotation,
      translate,
      setclipSize,
      boxSizeVector,
      setBoxSizeVector,
      clipSize,
      navItem,
      setPositionControls,
      setprevBoxSizeVector,
      initialClipSize,
    },
    ref,
  ) => {
    const gltf = useLoader(GLTFLoader, modelUrl) as GLTF;
    console.log(setPositionControls);
    const model = useMemo(() => {
      // applyClippingPlanesToGeometry(gltf.scene, clippingPlanes);
      return gltf.scene;
    }, [gltf]);

    // useEffect(() => {
    //   setModel(gltf.scene);
    // }, [gltf, setModel]);

    const [brushArray, setbrushArray] = useState<any>();
    const [boudingBox, setboudingBox] = useState<any>();
    const [boxSize, setboxSize] = useState<any>();
    const [boxCenter, setboxCenter] = useState<any>();

    useImperativeHandle(ref, () => ({
      brushArray,
      boudingBox,
      boxSize,
      boxCenter,
    }));

    // useFrame(({ camera }) => {
    //   const distance = boxSize ? boxSize : 5;
    //   camera.position.z = distance;
    // });

    const camera = useThree((state) => state.camera);
    const gl = useThree((state) => state.gl);

    useEffect(() => {
      if (!boxSize) return;
      camera.position.z = boxSize;
      camera.position.y = boxSize / 5;
    }, [boxSize]);

    useEffect(() => {
      const brushArr: Array<any> = [];
      if (model) {
        const boundingBox = new THREE.Box3();
        boundingBox.setFromObject(model);

        // new bouding box calculations
        const box = new THREE.Box3().setFromObject(model);
        const helper = new THREE.BoxHelper(model, 0xff0000);
        console.log(helper);
        // model.add(helper);
        const boxSize = box.getSize(new THREE.Vector3()).length() as number;
        const boxVector = box.getSize(new THREE.Vector3());
        if (boxSizeVector) {
          setprevBoxSizeVector(boxSizeVector);
        }
        console.log(boxVector);
        console.log(Math.max(boxVector.x, boxVector.y, boxVector.z));
        setBoxSizeVector(Math.max(boxVector.x, boxVector.y, boxVector.z));
        console.log(box.getSize(new THREE.Vector3()));
        if (navItem === "Crop") {
          gl.localClippingEnabled = true;
        } else {
          gl.localClippingEnabled = false;
        }
        const boxCenter = box.getCenter(new THREE.Vector3());
        if (!initialClipSize.current) {
          initialClipSize.current = boxSize;
        }
        setclipSize(boxSize);
        setboudingBox(box);
        setboxSize(boxSize);
        setboxCenter(boxCenter);

        // setting initials
        model.rotation.set(rotation[0], rotation[1], rotation[2]);
        model.position.set(translate[0], translate[1], translate[2]);
        model.scale.set(scale[0], scale[1], scale[2]);

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;

            // compute bouding sphere(for size of brushes)
            // if (child.geometry !== undefined) {
            //   object.geometry.computeBoundingSphere(tempSphere);
            //   boundingSphere.union(tempSphere);
            // }
            // original transformation related to world
            const pos = new THREE.Vector3();
            const rot = new THREE.Quaternion();
            const scale = new THREE.Vector3();
            mesh.getWorldPosition(pos);
            mesh.getWorldQuaternion(rot);
            mesh.getWorldScale(scale);
            // @ts-ignore
            mesh.material.normalMap = null;
            // @ts-ignore
            mesh.material.needsUpdate = true;

            const brush = new Brush(mesh.geometry, mesh.material);
            brush.position.copy(pos);
            brush.quaternion.copy(rot);
            brush.scale.copy(scale);

            brush.updateMatrixWorld();
            brushArr.push(brush);
            // group test
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(
                (mat) => (mat.clippingPlanes = clippingPlanes),
              );
            } else {
              mesh.material.clippingPlanes = clippingPlanes;
            }
          }
        });
      }
      setbrushArray(brushArr);
    }, [
      model,
      rotation,
      translate,
      clippingPlanes,
      camera.position,
      gl,
      setclipSize,
      clipSize,
      scale,
    ]);

    return (
      <>
        <primitive object={model} />
      </>
    );
  },
);

const ThreeDModelComponent: FC<ThreeDModelProps> = forwardRef(
  ({ modelUrl, navItem, id, changeLoading }, ref) => {
    // const [model, setModel] = useState<THREE.Group>();
    const [prevBoxSizeVector, setprevBoxSizeVector] = useState();
    const initialClipSize = useRef<any>(null);

    const modelRef = useRef<any>();
    const [clipSize, setclipSize] = useState<number>(1);
    const [boxSizeVector, setBoxSizeVector] = useState<any>();

    const option = {
      Left: {
        value: clipSize,
        min: -clipSize * 3.5 - 1,
        max: clipSize * 3.5 + 1,
        step: 0.001,
        render: () => navItem === "Crop",
      },
      Right: {
        value: clipSize,
        min: -clipSize * 3.5 - 1,
        max: clipSize * 3.5 + 1,
        step: 0.001,
        render: () => navItem === "Crop",
      },
      Bottom: {
        value: clipSize,
        min: -clipSize * 3.5 - 1,
        max: clipSize * 3.5 + 1,
        step: 0.001,
        render: () => navItem === "Crop",
      },
      Top: {
        value: clipSize,
        min: -clipSize * 3.5 - 1,
        max: clipSize * 3.5 + 1,
        step: 0.001,
        render: () => navItem === "Crop",
      },
      Back: {
        value: clipSize,
        min: -clipSize * 3.5 - 1,
        max: clipSize * 3.5 + 1,
        step: 0.001,
        render: () => navItem === "Crop",
      },
      Front: {
        value: clipSize,
        min: -clipSize * 3.5 - 1,
        max: clipSize * 3.5 + 1,
        step: 0.001,
        render: () => navItem === "Crop",
      },
    };

    const [clippingPlanesControls, setClippingPlanesControls] = useControls(
      () => option,
      [navItem, initialClipSize.current],
    );

    useEffect(() => {
      console.log(clipSize);
      if (clipSize) {
        const scale = 3.5;
        setClippingPlanesControls({
          Left: clipSize * scale,
          Right: clipSize * scale,

          Bottom: clipSize * scale,
          Top: clipSize * scale,

          Back: clipSize * scale,
          Front: clipSize * scale,
        });
      }
    }, [
      initialClipSize.current,
      initialClipSize,
      clipSize,
      setClippingPlanesControls,
    ]);

    const scaleControls = useControls(
      {
        Resize: {
          value: 1,
          min: 0.1,
          max: 3,
          step: 0.1,
          render: () => navItem === "Resize",
        },
      },
      [navItem],
    );
    const rotationControls = useControls(
      {
        Roll: {
          value: 0,
          min: 0,
          max: 2 * Math.PI,
          step: 0.01,
          render: () => navItem === "Rotate",
        },
        Pitch: {
          value: 0,
          min: 0,
          max: 2 * Math.PI,
          step: 0.01,
          render: () => navItem === "Rotate",
        },
        Yaw: {
          value: 0,
          min: 0,
          max: 2 * Math.PI,
          step: 0.01,
          render: () => navItem === "Rotate",
        },
      },
      [navItem],
    );
    const positionOptions = {
      X: {
        value: 0,
        min: -clipSize * 3,
        max: clipSize * 3,
        step: 0.01,
        render: () => navItem === "Translation",
      },
      Y: {
        value: 0,
        min: -clipSize * 3,
        max: clipSize * 3,
        step: 0.01,
        render: () => navItem === "Translation",
      },
      Z: {
        value: 0,
        min: -clipSize * 3,
        max: clipSize * 3,
        step: 0.01,
        render: () => navItem === "Translation",
      },
    };

    const [positionControls, setPositionControls] = useControls(
      () => positionOptions,
      [navItem, clipSize, boxSizeVector],
    );

    const { Left, Right, Bottom, Top, Back, Front } = clippingPlanesControls;
    console.log(clippingPlanesControls, clipSize);
    const { Resize } = scaleControls;
    const { Roll, Pitch, Yaw } = rotationControls;
    const { X, Y, Z } = positionControls;

    useEffect(() => {
      // whenever the scale changes get percentage of the position of total

      const maxDimension = boxSizeVector;

      if (prevBoxSizeVector) {
        const px = (X / maxDimension) * 100;
        const py = (Y / maxDimension) * 100;
        const pz = (Z / maxDimension) * 100;
        const newX = (px * maxDimension) / 100;
        const newY = (py * maxDimension) / 100;
        const newZ = (pz * maxDimension) / 100;
        setPositionControls({
          X: newX,
          Y: newY,
          Z: newZ,
        });
      }
    }, [Resize]);

    const HandleSaveModel = async () => {
      const size = clipSize * 1.5;
      const b1 = new Brush(new THREE.BoxGeometry(size, size, size));
      b1.position.set(-Left - size / 2, 0, 0);
      b1.updateMatrixWorld();
      const b2 = new Brush(new THREE.BoxGeometry(size, size, size));
      b2.position.set(Right + size / 2, 0, 0);
      b2.updateMatrixWorld();
      const b3 = new Brush(new THREE.BoxGeometry(size, size, size));
      b3.position.set(0, -Bottom - size / 2, 0);
      b3.updateMatrixWorld();
      const b4 = new Brush(new THREE.BoxGeometry(size, size, size));
      b4.position.set(0, Top + size / 2, 0);
      b4.updateMatrixWorld();
      //
      const b5 = new Brush(new THREE.BoxGeometry(size, size, size));
      b5.position.set(0, 0, -Back - size / 2);
      b5.updateMatrixWorld();
      const b6 = new Brush(new THREE.BoxGeometry(size, size, size));
      b6.position.set(0, 0, Front + size / 2);
      b6.updateMatrixWorld();

      const evaluator = new Evaluator();

      // combining all the boxes into one so that only one subtraction is needed
      let brush1;
      brush1 = evaluator.evaluate(b1, b2, ADDITION);
      brush1 = evaluator.evaluate(brush1, b3, ADDITION);
      brush1 = evaluator.evaluate(brush1, b4, ADDITION);
      brush1 = evaluator.evaluate(brush1, b5, ADDITION);
      brush1 = evaluator.evaluate(brush1, b6, ADDITION);

      //
      evaluator.useGroups = false;
      const brushArray = modelRef?.current?.brushArray;
      const resultArr = [];
      const resultGroupTest = new THREE.Group();
      for (let i = 0; i < brushArray.length; i++) {
        console.log(i);
        const r = evaluator.evaluate(brushArray[i], brush1, SUBTRACTION);
        resultArr.push(r);
      }

      // just adding everything to a group
      for (let i = 0; i < resultArr.length; i++) {
        resultGroupTest.add(resultArr[i]);
      }

      const options = {
        binary: true,
        trs: true,
      };

      const exporter = new GLTFExporter();

      if (resultGroupTest) {
        exporter.parse(
          resultGroupTest,
          async (gltf) => {
            let testBlob;
            let fileName;
            // create g

            // const exporter1 = new USDZExporter();

            // const arraybuffer = await exporter1.parse(resultGroupTest);
            // const blob = new Blob([arraybuffer], {
            //   type: "application/octet-stream",
            // });

            if (gltf instanceof ArrayBuffer) {
              testBlob = new Blob([gltf], {
                type: "application/octet-stream",
              });
              fileName = "exported_model.glb";
            } else {
              // create glb
              const output = JSON.stringify(gltf, null, 2);
              testBlob = new Blob([output], {
                type: "application/octet-stream",
              });
              fileName = "exported_model.glb";
            }

            // const link = document.createElement("a");
            // link.href = URL.createObjectURL(testBlob);
            // link.download = "download.glb";
            // link.click();

            const formData = new FormData();

            formData.append("model_url", modelUrl);
            formData.append("model", testBlob, fileName);

            try {
              await update3DModel({ id, formData });
              changeLoading?.(false);
            } catch (error) {
              // error handling
              changeLoading?.(false);
            }
          },
          () => {
            changeLoading?.(false);
          },
          options,
        );
      }
    };

    const handleReset = () => {
      window.location.reload();
    };

    useImperativeHandle(ref, () => ({
      reset: handleReset,
      save: HandleSaveModel,
    }));

    const clippingPlanes = useMemo(
      () => [
        new THREE.Plane(new THREE.Vector3(1, 0, 0), Left),
        new THREE.Plane(new THREE.Vector3(-1, 0, 0), Right),
        new THREE.Plane(new THREE.Vector3(0, 1, 0), Bottom),
        new THREE.Plane(new THREE.Vector3(0, -1, 0), Top),
        new THREE.Plane(new THREE.Vector3(0, 0, 1), Back),
        new THREE.Plane(new THREE.Vector3(0, 0, -1), Front),
      ],
      [Left, Right, Bottom, Top, Back, Front],
    );

    const scaleVector = useMemo(() => [Resize, Resize, Resize], [Resize]);
    const translationVector = useMemo(() => [X, Y, Z], [X, Y, Z]);

    const rotationVector = useMemo(
      () => [Roll, Pitch, Yaw],
      [Roll, Pitch, Yaw],
    );

    function Loader() {
      const { progress } = useProgress();
      return (
        <Html>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "80vh",
              width: "80vw",
              position: "fixed",
            }}
          >
            {Math.floor(progress)} % loaded
          </div>
        </Html>
      );
    }
    const colors = [0xff0000, 0xff0000, 0x00ff00, 0x00ff00, 0x0000ff, 0x0000ff];

    // useEffect(() => {
    //   setclipSize(2);
    // }, []);

    return (
      <>
        <Canvas
          className="model-canvas"
          gl={{ logarithmicDepthBuffer: true }}
        // camera={{ position: [0, 0, 0] }}
        >
          <PerspectiveCamera
            makeDefault
            position={[0, 0, 5]}
            near={0.1}
            far={1000}
          />
          <Suspense fallback={<Loader />}>
            <ambientLight />
            <directionalLight position={[10, 10, 0]} intensity={1.5} />
            <directionalLight position={[-10, 10, 5]} intensity={1} />
            <directionalLight position={[-10, 20, 0]} intensity={1.5} />
            <directionalLight position={[0, -10, 0]} intensity={0.25} />
            {/* <pointLight  /> */}
            <Model
              ref={modelRef}
              modelUrl={modelUrl}
              clippingPlanes={clippingPlanes}
              scale={scaleVector}
              rotation={rotationVector}
              translate={translationVector}
              setclipSize={setclipSize}
              boxSizeVector={boxSizeVector}
              setBoxSizeVector={setBoxSizeVector}
              clipSize={clipSize}
              navItem={navItem}
              setPositionControls={setPositionControls}
              setprevBoxSizeVector={setprevBoxSizeVector}
              initialClipSize={initialClipSize}
            />
            <OrbitControls
              enableZoom={true}
              enablePan={true}
              enableRotate={true}
              zoomSpeed={0.6}
              minDistance={0.8}
              maxDistance={10}
              target={[0, 0, 0]}
              position={[1, 1, 1]}
            />

            {navItem !== "Crop" && navItem !== "" && (
              <ArrowHelpers clipSize={clipSize} />
            )}

            {navItem === "Crop" &&
              clippingPlanes.map((plane, index) => (
                <planeHelper
                  key={index}
                  args={[
                    plane,
                    initialClipSize.current * 1.5,
                    colors[index % colors.length],
                  ]}
                />
              ))}
          </Suspense>
          {/* <button onClick={HandleSaveModel}>save</button> */}
        </Canvas>
        <div id="leva__root">
          <Leva
            theme={customTheme}
            titleBar={{ filter: false, title: navItem }}
          />
        </div>
      </>
    );
  },
);

function ArrowHelpers(clipSize: any) {
  const { scene } = useThree();
  const arrowRefs = useRef<any>([]);
  // console.log("this is clipsize:",clipSize.clipSize)
  useEffect(() => {
    const arrowDirections = [
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 1),
    ];
    const colors = [0xff0000, 0x00ff00, 0x0000ff];

    {
      clipSize &&
        arrowDirections.forEach((dir, index) => {
          const length = 0.5; // Length of the arrow
          // console.log("this is length",length);
          const arrowHelper = new THREE.ArrowHelper(
            dir,
            new THREE.Vector3(0, 0, 0),
            length,
            colors[index],
          );
          arrowRefs.current.push(arrowHelper);
          scene.add(arrowHelper);
        });
    }
    return () => {
      arrowRefs.current.forEach((arrow: any) => scene.remove(arrow));
    };
  }, [scene]);

  return null;
}
