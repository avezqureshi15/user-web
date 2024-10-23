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
// import { useAppDispatch } from "@hooks/redux-hooks";
import { Images } from "@constants/imageConstants";
// import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { updateProjectDetails } from "@slices/projectSlice";
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
import { SUBTRACTION, ADDITION, Brush, Evaluator } from "three-bvh-csg";
import { useSearchParams } from "react-router-dom";
import { URLS } from "@constants/urlConstants";
import axios from "axios";

const customTheme = {
  sizes: {
    controlWidth: "180px",
    rootWidth: "280px",
  },
  colors: {
    highlight1: "#FFFFFF",
    highlight2: "#FFFFFF",
  },
};

interface ThreeDModelProps {
  modelUrl: string;
  token?: string;
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
  setIsSaving?: any;
  setPositionControls?: any;
  setprevBoxSizeVector?: any;
  initialClipSize?: any;
}
// const modelurl = "https://xencapture-media-dev.s3-ap-south-1.amazonaws.com/d3132d0a-67a3-48b2-9a46-414b5e55141d/models/exported_model.gltf";

const Savemodel: FC = () => {
  const [sv] = useSearchParams();
  const urlData = sv.get("data") as string;
  const decData = JSON.parse(atob(urlData));
  console.log(decData);

  // const [open, setOpen] = useState(false);

  // const handleOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  const modelUrl = decData.modelurl;
  // const modelUrl = "https://xencapture-media.s3-ap-south-1.amazonaws.com/7bba8235-c7e5-4260-b3a4-4602c5c97b3c/models/output.glb";

  const [isSaving, setIsSaving] = useState(false);

  // const [error2, setError2] = useState("");
  const [modelName, setModelName] = useState(decData.name);
  const [navItem, setNavItem] = useState("");

  // Format date and time
  // const dispatch = useAppDispatch();
  // const navigate = useNavigate();
  // const location = useLocation();
  // const initialIsEditing = location.state && location.state.edit ? true : false;
  // const storedState = localStorage.getItem("IsEditing");
  // const parsedState = storedState && JSON.parse(storedState);
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
  useEffect(() => {
    window.scrollTo(0, 0);

    // const fetchModelUrl = async () => {
    //   try {
    //     const response = await dispatch(retrieveModel(id));

    //       setModelUrl(response.payload.model_url);

    //       // Filter the available formats and their URLs
    //       setIsLoading(false);

    //   } catch (error) {
    //     setIsLoading(false);
    //   }
    // };

    // fetchModelUrl();
  }, []);

  // useEffect(() => {
  //   const checkPurchased = async () => {
  //     try {
  //       const response = await dispatch(fetchProjects());
  //       const fetchedProjects = response.payload.data;
  //       // Check if project with matching id and is_paid === true exists
  //       const matchingProject = fetchedProjects.find(
  //         (project: { id: string; is_paid: boolean }) =>
  //           project.id === id && project.is_paid === true,
  //       );
  //       console.log(matchingProject);
  //       console.log(id);
  //       console.log(fetchedProjects);

  //       matchingProject !== undefined
  //         ? setIspurchased(true)
  //         : setIspurchased(false);
  //       console.log(matchingProject);

  //       console.log("Projects fetched successfully:", response.payload);
  //     } catch (error) {
  //       console.log("Error fetching projects:", error);
  //     }
  //   };

  //   checkPurchased();
  // }, [dispatch, id]);

  const handleBackClick = () => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("clickedback", "true");
    window.history.pushState({}, "", newUrl.toString());
    localStorage.removeItem("IsEditing");
  };

  // const handleEditClick = async () => {
  //   setIsEditing(true);
  // };

  const handleNameEditClick = async () => {
    setNameEdit(true);
  };

  const handleSaveClick = async () => {
    try {
      const modelId = decData.id;
      await axios.put(
        `${URLS.PROJECTS}${modelId}/`,
        {
          name: modelName,
        },
        {
          headers: {
            Authorization: `Bearer ${decData.token}`,
            "Content-Type": "application/json",
          },
        },
      );
      setModelName(modelName);
      setNavItem("");
      setNameEdit(false);
      toast.success("Model Name has been successfully saved.");
    } catch (error) {
      // not yet handled
    }
  };

  async function handleSave() {
    setIsSaving(true);
    // handleSaveClick();
    handleSaveModelControl();
    localStorage.setItem("IsEditing", "false");
  }

  // async function changeLoading(loading: boolean) {
  //   try {
  //     const response = await dispatch(retrieveModel(decData.id));
  //     setModelUrl(response.payload.model_url);
  //     toast.success("Model has been successfully saved.");
  //     setIsSaving(loading);
  //     window.location.reload();
  //   } catch (error) {
  //     // not handled yet
  //   }
  // }

  // const formattedDateTime = formatDateTime(`${decData.date} ${decData.time}`);
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        height: "100vh",
        overflowY: "hidden",
      }}
    >
      <>
        <Grid
          container
          alignItems="center"
          style={{
            paddingLeft: "20px",
            paddingTop: "15px",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Grid item>
            <IconButton
              aria-label="Go back"
              onClick={handleBackClick}
              style={{ marginRight: "10px" }}
            >
              <img src={Images.LEFT_ARROW} alt="back" />
            </IconButton>
          </Grid>
          <Grid item>
            {/* Conditional rendering of editable model name */}
            {nameEdit ? (
              <TextField
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                variant="standard"
                sx={{ margin: "0 10px", width: { xs: "100px", md: "200px" } }}
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
                {modelName.slice(0, 6) + "..."}
              </Typography>
            )}
            <Typography
              variant="body2"
              color="#303030"
              gutterBottom
              sx={{ fontFamily: "OpenSans", fontWeight: 400, fontSize: "12px" }}
            >
              {`${decData.date}|${decData.time}`}
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
                  marginLeft: "2rem",
                }}
                onClick={handleSaveClick}
                variant="contained"
              >
                Save Name
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
            {!nameEdit && (
              <Button
                sx={{
                  flex: 1,
                  padding: "8px",
                  fontSize: "14px",
                  minWidth: "80px",
                  minHeight: "40px",
                  position: "absolute",
                  right: { xs: 20, md: 40 },
                }}
                onClick={handleSave}
                variant="contained"
              >
                Save
              </Button>
            )}
          </Grid>
        </Grid>
        <Card
          elevation={0}
          style={{
            display: "flex",
            justifyContent: "space-between",
            // padding: "0rem 2rem 0rem 2rem",
            // marginRight: "20px",
            // marginLeft: "20px",
            // marginTop: "10px",
            // marginBottom: "10px",
            height: "100vh",
            flexDirection: "column",
            backgroundColor: "#FFFFFF",
          }}
        >
          {modelUrl && isSaving && (
            <Dialog open={true}>
              <DialogTitle
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                Saving Changes{" "}
                <CircularProgress style={{ width: "20px", height: "20px" }} />
              </DialogTitle>
              <DialogContent>
                <p>The process usually takes 30 seconds</p>
              </DialogContent>
            </Dialog>
          )}
          <ThreeDModelComponent
            modelUrl={modelUrl}
            navItem={navItem}
            ref={childRef}
            id={decData.id}
            token={decData.token}
            setIsSaving={setIsSaving}
          />
        </Card>
        <BottomNavigation
          sx={{
            width: "390px",
            height: "45px",
            backgroundColor: "#ffffff",
            padding: "0rem 3rem 0.5rem 3rem",
            borderTop: "1px solid #EFEFF0",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            borderRadius: "16px",
            position: "fixed",
            zIndex: 10,
          }}
        >
          <>
            <BottomNavigationAction
              style={{
                paddingLeft: "2rem",
                color: navItem === "Crop" ? "#2E368E" : " ",
              }}
              showLabel={true}
              label="Crop"
              icon={
                <img
                  style={{
                    height: "22px",
                    width: "22px",
                  }}
                  src={Images.CROP_MOBILE}
                />
              }
              onClick={() => {
                setNavItem("Crop");
              }}
            />
            <BottomNavigationAction
              showLabel={true}
              label="Resize"
              style={{
                color: navItem === "Resize" ? "#2E368E" : " ",
              }}
              icon={
                <img
                  style={{
                    height: "24px",
                    width: "24px",
                  }}
                  src={Images.SCALE_MOBILE}
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
                color: navItem === "Translation" ? "#2E368E" : " ",
              }}
              icon={
                <img
                  style={{
                    height: "24px",
                    width: "24px",
                  }}
                  src={Images.TRANSLATE_MOBILE}
                />
              }
              onClick={() => {
                setNavItem("Translation");
              }}
            />
            <BottomNavigationAction
              showLabel={true}
              label="Rotate"
              style={{
                color: navItem === "Rotate" ? "#2E368E" : " ",
              }}
              icon={
                <img
                  style={{
                    height: "24px",
                    width: "24px",
                  }}
                  src={Images.ROTATE_MOBILE}
                />
              }
              onClick={() => {
                setNavItem("Rotate");
              }}
            />
            <BottomNavigationAction
              style={{
                paddingRight: "2rem",
              }}
              showLabel={true}
              label="Reset"
              icon={
                <img
                  style={{
                    height: "24px",
                    width: "24px",
                  }}
                  src={Images.RESET_MOBILE}
                />
              }
              onClick={handleResetChildControls}
            />
          </>
        </BottomNavigation>
      </>
    </div>
  );
};

export default Savemodel;

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
      if (boxSize > 50) camera.position.z = boxSize * 3;
      else if (boxSize > 20 && boxSize < 50) {
        camera.position.z = boxSize * 1.5;
      } else {
        camera.position.z = boxSize;
      }
      camera.position.y = boxSize / 5;
      // console.log(boxSize,"separaj ",boxSize*1.5);
    }, [boxSize]);

    useEffect(() => {
      const brushArr: Array<any> = [];
      if (model) {
        const boundingBox = new THREE.Box3();
        boundingBox.setFromObject(model);
        // new bouding box calculations
        const box = new THREE.Box3().setFromObject(model);
        const boxSize = box.getSize(new THREE.Vector3()).length() as number;
        if (boxSizeVector) {
          setprevBoxSizeVector(boxSizeVector);
        }
        setBoxSizeVector(box.getSize(new THREE.Vector3()));
        console.log(box.getSize(new THREE.Vector3()));
        // camera.position.z = boxSize;
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
  ({ modelUrl, navItem, id, token, setIsSaving }, ref) => {
    // const [model, setModel] = useState<THREE.Group>();
    // const navigate = useNavigate();
    const [prevBoxSizeVector, setprevBoxSizeVector] = useState();
    console.log(prevBoxSizeVector, setprevBoxSizeVector);
    const initialClipSize = useRef<any>(null);
    console.log(initialClipSize);
    console.log(initialClipSize);
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

    const [clippingPlanesControls, settest] = useControls(
      () => option,
      [navItem, clipSize],
    );

    useEffect(() => {
      if (clipSize) {
        const scale = 3.5;
        settest({
          Left: clipSize * scale,
          Right: clipSize * scale,

          Bottom: clipSize * scale,
          Top: clipSize * scale,

          Back: clipSize * scale,
          Front: clipSize * scale,
        });
      }
    }, [clipSize]);

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
          value: -Math.PI,
          min: -Math.PI,
          max: Math.PI,
          step: 0.01,
          render: () => navItem === "Rotate",
        },
        Pitch: {
          value: -Math.PI,
          min: -Math.PI,
          max: Math.PI,
          step: 0.01,
          render: () => navItem === "Rotate",
        },
        Yaw: {
          value: -Math.PI,
          min: -Math.PI,
          max: Math.PI,
          step: 0.01,
          render: () => navItem === "Rotate",
        },
      },
      [navItem],
    );
    const [positionControls, setPositionControls] = useControls(() => {
      return {
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
    }, [navItem, clipSize, boxSizeVector]);

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
      const size = Number((clipSize * 2).toFixed(2));
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
            // create glb
            if (gltf instanceof ArrayBuffer) {
              testBlob = new Blob([gltf], {
                type: "application/octet-stream",
              });
              fileName = "exported_model.glb";
            } else {
              // create gltf
              const output = JSON.stringify(gltf, null, 2);
              testBlob = new Blob([output], {
                type: "application/octet-stream",
              });
              fileName = "exported_model.glb";
            }

            const formData = new FormData();
            formData.append("model_url", modelUrl);
            formData.append("model", testBlob, fileName);

            try {
              await axios
                .put(`${URLS.GLD_UPLOAD}${id}/`, formData, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multiparts/form-data",
                  },
                })
                .then(() => {
                  const newUrl = new URL(window.location.href);
                  newUrl.searchParams.set("status", "true");
                  window.history.pushState({}, "", newUrl.toString());
                  setIsSaving(false);
                });

              // changeLoading?.(false);
            } catch (error) {
              // error handling
              // changeLoading?.(false);
              const newUrl = new URL(window.location.href);
              newUrl.searchParams.set("status", "false");
              window.history.pushState({}, "", newUrl.toString());
              setIsSaving(false);
            }
          },
          () => {
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set("status", "false");
            window.history.pushState({}, "", newUrl.toString());
            setIsSaving(false);
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
      return <Html center>{Math.floor(progress)} % loaded</Html>;
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
          camera={{ position: [0, 0, 0] }}
        >
          <PerspectiveCamera
            makeDefault
            position={[0, 2, 5]}
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
            {/* <mesh position={[-left - (clipSize * 2) / 2, 0, 0]}>
            <boxGeometry
              args={[clipSize * 2, clipSize * 2, clipSize * 2]}
            />
            <meshStandardMaterial />
          </mesh>
          <mesh position={[right + (clipSize * 2) / 2, 0, 0]}>
            <boxGeometry
              args={[clipSize * 2, clipSize * 2, clipSize * 2]}
            />
            <meshStandardMaterial />
          </mesh>
          <mesh position={[0, -bottom - (clipSize * 2) / 2, 0]}>
            <boxGeometry
              args={[clipSize * 2, clipSize * 2, clipSize * 2]}
            />
            <meshStandardMaterial />
          </mesh>
          <mesh position={[0, top + (clipSize * 2) / 2, 0]}>
            <boxGeometry
              args={[clipSize * 2, clipSize * 2, clipSize * 2]}
            />
            <meshStandardMaterial />
          </mesh>
          <mesh position={[0, 0, -back - (clipSize * 2) / 2]}>
            <boxGeometry
              args={[clipSize * 2, clipSize * 2, clipSize * 2]}
            />
            <meshStandardMaterial />
          </mesh>
          <mesh position={[0, 0, front + (clipSize * 2) / 2]}>
            <boxGeometry
              args={[clipSize * 2, clipSize * 2, clipSize * 2]}
            />
            <meshStandardMaterial />
          </mesh> */}
            <Model
              ref={modelRef}
              modelUrl={modelUrl}
              clippingPlanes={clippingPlanes}
              scale={scaleVector}
              rotation={rotationVector}
              translate={translationVector}
              setclipSize={setclipSize}
              setBoxSizeVector={setBoxSizeVector}
              clipSize={clipSize}
              navItem={navItem}
            />
            <OrbitControls
              enableZoom={true}
              enablePan={true}
              enableRotate={true}
              zoomSpeed={0.6}
              minDistance={0.8}
              maxDistance={10}
              position={[1, 1, 1]}
            />

            {navItem !== "Crop" && navItem !== "" && (
              <ArrowHelpers clipSize={clipSize} />
            )}

            {navItem === "Crop" &&
              clippingPlanes.map((plane, index) => (
                <planeHelper
                  key={index}
                  args={[plane, clipSize * 2, colors[index % colors.length]]}
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
