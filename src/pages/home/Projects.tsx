import SearchBar from "@components/SearchBar";
import TabBar from "@components/TabBar";
import {
  Grid,
  Button,
  Backdrop,
  Box,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import ProjectCard from "./ProjectCard";
import { Images } from "@constants/imageConstants";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@hooks/redux-hooks";
import {
  fetchProjects,
  addToCart,
  deleteProjects,
  fetchCartDetails,
} from "@slices/projectSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dispatch, SetStateAction } from "react";

// Define the prop types
interface ProjectsProps {
  setCartCount: Dispatch<SetStateAction<number>>;
}

function Projects({ setCartCount }: ProjectsProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [projects, setProjects] = useState<any[]>([]); // Updated type to any[]
  const tabs = ["ALL", "PAID", "UNPAID", "DRAFTS"];
  const [selectedTab, setSelectedTab] = useState<string>("ALL");
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [clearSelection, setClearSelection] = useState<boolean>(false);
  const [deletedProjects, setDeletedProjects] = useState<boolean>(false);
  const [loading, setloading] = useState(true);
  const childRef = useRef<any>(null);
  const fetchProjectsData = async () => {
    try {
      const response = await dispatch(fetchProjects());
      setProjects(response.payload.data);
      setloading(false);
      console.log("Projects fetched successfully:", response.payload);
    } catch (error) {
      console.log("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjectsData();
    const interval = setInterval(() => {
      fetchProjectsData();
    }, 60000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  {
    /*/ Sample data for demonstration
  const projects = [
    {
      id: 1,
      name: "Project 1",
      date: "January 1, 2024",
      time: "10:00 AM",
      imageUrl: "https://picsum.photos/200/300",
      status: "Paid",
    },
    {
      id: 2,
      name: "Project 2",
      date: "January 2, 2024",
      time: "11:00 AM",
      imageUrl: "https://picsum.photos/200/300",
      status: "Unpaid",
    },
    {
      id: 3,
      name: "Project 3",
      date: "January 3, 2024",
      time: "12:00 PM",
      imageUrl: "https://picsum.photos/200/300",
      status: "Draft",
    },
    // Add more project data as needed
    {
      id: 4,
      name: "Project 4",
      date: "January 4, 2024",
      time: "1:00 PM",
      imageUrl: "https://picsum.photos/200/300",
      status: "Paid",
    },
    {
      id: 5,
      name: "Project 5",
      date: "January 5, 2024",
      time: "2:00 PM",
      imageUrl: "https://picsum.photos/200/300",
      status: "Draft",
    },
    {
      id: 6,
      name: "Project 6",
      date: "January 6, 2024",
      time: "3:00 PM",
      imageUrl: "https://picsum.photos/200/300",
      status: "Unpaid",
    },
    {
      id: 7,
      name: "Project 7",
      date: "January 7, 2024",
      time: "4:00 PM",
      imageUrl: "https://picsum.photos/200/300",
      status: "Unpaid",
    },
    {
      id: 8,
      name: "Project 8",
      date: "January 8, 2024",
      time: "5:00 PM",
      imageUrl: "https://picsum.photos/200/300",
      status: "Unpaid",
    },
    // Add more project data as needed
  ];*/
  }

  const filteredProjects = projects?.filter((project) => {
    // Check if the project's status matches the selected tab
    let tabFilter = true;
    switch (selectedTab) {
      case "PAID":
        tabFilter = project.is_paid === true && !project.is_draft;
        break;
      case "UNPAID":
        tabFilter = project.is_paid === false && !project.is_draft;
        break;
      case "DRAFTS":
        tabFilter = project.is_draft === true && !project.is_paid;
        break;
      default:
        tabFilter = true;
    }

    // Check if the project's name includes the search query (case-insensitive)
    const searchFilter = searchQuery
      ? project.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true; // If no search query, return true

    // Return true only if both tabFilter and searchFilter are true
    return tabFilter && searchFilter;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTabChange = (tab: string) => {
    setIsSelecting(false);
    setSelectedProjects([]);
    setClearSelection(true);
    setSelectedTab(tab);
  };

  const handleSelect = () => {
    setIsSelecting(true);
  };

  const handleCancel = () => {
    setIsSelecting(false);
    setSelectedProjects([]);
    setClearSelection(true);
  };

  const isSafariBrowser = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes("safari") && !userAgent.includes("chrome");
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteProjects(selectedProjects));
      fetchProjectsData();
      setDeletedProjects(false);
      setSelectedProjects([]);
      setIsSelecting(false);
    } catch (error) {
      console.log("Error Deleting Projects: ", error);
    }
  };

  const handleCardClick = (projectId: number) => {
    setSelectedProjects((prevSelectedProjects) => {
      if (!prevSelectedProjects.includes(projectId)) {
        return [...prevSelectedProjects, projectId];
      } else {
        return prevSelectedProjects.filter((id) => id !== projectId);
      }
    });
  };

  const handleAddToCart = async () => {
    try {
      const selectedProjectIds = selectedProjects.map(
        (projectId) => projects.find((project) => project.id === projectId)?.id,
      );

      // Check if any selected project is a draft or already paid
      const isDraftOrPaid = selectedProjects.some((projectId) => {
        const project = projects.find((project) => project.id === projectId);
        return (
          project?.is_draft ||
          project?.is_paid ||
          project.status === "in-progress"
        );
      });

      if (isDraftOrPaid) {
        toast.error("Cannot add paid, inprogress or draft models to the cart.");
        return;
      }

      await dispatch(addToCart(selectedProjectIds)).then((response) => {
        // console.log("this is response: ",response?.payload?.data?.added);
        if (response?.payload?.data?.added?.length == 0) {
          toast.success("Selected model(s) already added to the cart");
        } else {
          toast.success(
            `${response?.payload?.data?.added?.length} ${response?.payload?.data?.added?.length > 1 ? "Models " : "Model "} added to cart successfully`,
          );
        }
      });

      const response = await dispatch(fetchCartDetails());
      setCartCount(response.payload.length);
      console.log(selectedProjectIds);

      // Clear selected projects and set isSelecting to false
      setSelectedProjects([]);
      setIsSelecting(false);
    } catch (error) {
      console.log("Error Adding to Cart: ", error);
    }
  };

  const handleBuyNow = async () => {
    try {
      const selectedProjectIds = selectedProjects.map(
        (projectId) => projects.find((project) => project.id === projectId)?.id,
      );

      // Check if any selected project is a draft or already paid
      const isDraftOrPaid = selectedProjects.some((projectId) => {
        const project = projects.find((project) => project.id === projectId);
        return (
          project?.is_draft ||
          project?.is_paid ||
          project?.status === "in-progress"
        );
      });

      if (isDraftOrPaid) {
        toast.error("Cannot buy paid, inprogress or draft models.");
        return;
      }

      const response = await dispatch(addToCart(selectedProjectIds));
      console.log(response);
      navigate(`cart/?navigate=home`);
    } catch (error) {
      console.log("Error Adding to Cart: ", error);
    }
  };

  function handleOutsideClick(e: React.MouseEvent<HTMLElement>) {
    if (childRef.current && e.currentTarget.id === "projectsContainer") {
      childRef.current.toggleChildState();
    }
  }

  return (
    <Grid
      container
      width={"100%"}
      justifyContent="center"
      sx={{
        marginBottom: "80px",
        "@media (max-width: 425px)": {
          width: "100vh",
        },
      }}
      id={"projectsContainer"}
      onClick={handleOutsideClick}
    >
      <Grid width={"80%"} style={{ padding: "10px" }}>
        <Typography
          style={{
            fontFamily: "sans-serif",
            fontWeight: 400,
            fontSize: "23px",
            marginTop: "20px",
            marginBottom: "20px",
            color: "#111111",
          }}
        >
          Projects
        </Typography>
        <Grid
          container
          direction="row"
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Grid
            sx={{
              marginBottom: "40px",
              "@media (max-width: 425px)": {
                width: "100%",
              },
            }}
            width="45%">
            <TabBar
              tabs={tabs}
              selectedTab={selectedTab}
              onChange={handleTabChange}
            />
          </Grid>
          <Grid>
            <SearchBar onSearch={handleSearch} />
          </Grid>
          <Grid>
            {isSelecting ? (
              <Grid
                container
                direction="row"
                alignItems="center"
                gap="20px"
                sx={{
                  fontFamily: "OpenSans",
                  fontWeight: 400,
                  textTransform: "none",
                  fontSize: "14px",
                }}
              >
                <Grid
                  item
                >{`Selected ${selectedProjects.length} ${"   "} ${selectedProjects.length > 1 ? "Models " : "Model"}`}</Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: "white",
                      color: "black",
                      padding: "8px, 16px, 8px, 16px",
                      width: "71px",
                      height: "32px",
                      boxShadow: "none",
                      fontFamily: "OpenSans",
                      fontWeight: 400,
                      textTransform: "none",
                    }}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid item>
                  {selectedProjects.length > 0 && (
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "white",
                        color: "black",
                        padding: "5px",
                        width: "90%",
                        minWidth: "auto",
                        boxShadow: "none",
                      }}
                      onClick={() => setDeletedProjects(true)}
                    >
                      <img
                        src={Images.DELETE_ICON}
                        style={{ fill: "#2E368E" }}
                      />
                    </Button>
                  )}
                  {deletedProjects && (
                    <Backdrop open={deletedProjects} style={{ zIndex: 999 }}>
                      <Box
                        component="div"
                        sx={{
                          width: "300px",
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
                          <Typography
                            sx={{ fontWeight: "700", fontSize: "20px" }}
                            gutterBottom
                          >
                            Are you sure you want to delete these{" "}
                            {selectedProjects.length > 1 ? "models " : "model "}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="#484848"
                            gutterBottom
                          >
                            By clicking Delete, the{" "}
                            {selectedProjects.length > 1 ? "models " : "model "}{" "}
                            will be deleted permanantly.
                          </Typography>
                          <Box
                            component="div"
                            sx={{ display: "flex", gap: "16px" }}
                          >
                            <Button
                              variant="contained"
                              color="primary"
                              fullWidth
                              onClick={() => setDeletedProjects(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="contained"
                              fullWidth
                              onClick={handleDelete}
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
                  )}
                </Grid>
              </Grid>
            ) : (
              <Grid
                container
                direction="row"
                alignItems="center"
                gap="40px"
                sx={{
                  fontFamily: "OpenSans",
                  fontWeight: 400,
                  textTransform: "none",
                  fontSize: "14px",
                }}
              >
                <Grid
                  item
                >{`${filteredProjects?.length} ${filteredProjects?.length > 1 ? "Models " : "Model "}`}</Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: "white",
                      color: "black",
                      padding: "8px, 16px, 8px, 16px",
                      width: "71px",
                      height: "32px",
                      boxShadow: "none",
                      fontFamily: "OpenSans",
                      fontWeight: 400,
                      textTransform: "none",
                    }}
                    onClick={handleSelect}
                  >
                    Select
                  </Button>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
        {filteredProjects?.length === 0 && !loading && (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            mt="15px"
            style={{
              minHeight: "50vh",
              backgroundColor: "#EAEBF4",
              borderRadius: "10px",
            }}
          >
            {/* Add your background image here */}
            <img src={Images.NO_PROJECTS} alt="No projects found" />
          </Grid>
        )}

        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              zIndex: 10,
            }}
          >
            <CircularProgress />
          </div>
        )}
        {filteredProjects?.length > 0 && (
          <Grid container spacing={3} padding={"16px"}
            sx={{
              "@media (max-width: 425px)": {
                width: 'calc(100% + 160px)'
              },
            }}
          >
            {filteredProjects.map((project, index) => (
              <Grid key={index} item xs={12} sm={6} md={5} lg={2}
                sx={{
                  "@media (max-width: 425px)": {
                    '-webkit-flex-basis': '0%',
                    'flex-basis': '0%',
                  },
                }}
              >
                <ProjectCard
                  ref={childRef}
                  id={project.id}
                  name={project.name}
                  date={
                    new Date(project.created_at).toISOString().split("T")[0]
                  }

                  time={
                    new Date(
                      new Date(project.created_at).setHours(
                        new Date(project.created_at).getHours() + 5,
                        new Date(project.created_at).getMinutes() + 30,
                      ),
                    )
                      .toISOString()
                      .split("T")[1]
                      .split(".")[0]
                  }
                  imageUrl={
                    project?.metadata?.first_content_url &&
                      (project.metadata.first_content_url.endsWith(".glb") ||
                        // project.metadata.first_content_url.endsWith(".mp4") ||
                        // project.metadata.first_content_url.endsWith(".mov") ||
                        project.metadata.first_content_url
                          .toLowerCase()
                          .endsWith(".heic") ||
                        project.metadata.first_content_url.endsWith(".heif"))
                      ? !isSafariBrowser()
                        ? Images.XENCAP_MOBILE2
                        : project.metadata.first_content_url
                      : project.metadata.first_content_url ||
                      Images.XENCAP_MOBILE2
                  }
                  status={
                    project.status === "in-progress"
                      ? "In-progress"
                      : project.is_paid
                        ? "Paid"
                        : project.is_draft
                          ? "Draft"
                          : "Unpaid"
                  }
                  selectPermitted={isSelecting}
                  clearSelection={clearSelection}
                  onSelect={() => handleCardClick(project.id)}
                  type={project.metadata.content_type}
                  imgCount={project.metadata.content_count}
                  estimatedTime={project.metadata.estimated_time}
                  fetchProjectsData={fetchProjectsData}


                />
                {(project.is_draft || !project.is_paid) &&
                  selectedProjects.includes(project.id) && (
                    <Grid
                      style={{
                        position: "fixed",
                        bottom: "1%",
                        right: "0%",
                        margin: "10px",
                        backgroundColor: "white",
                        borderRadius: "16px",
                        padding: "12px",
                        gap: "12px",
                        display: "flex",
                        zIndex: 999,
                        width: "430px",
                      }}
                    >
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: "white",
                          color: "#2E368E",
                          padding: "12px",
                          boxShadow: "none",
                          border: "1pt solid #2E368E",
                          width: "200px",
                          fontFamily: "OpenSans",
                          fontWeight: 600,
                          textTransform: "none",
                          fontSize: "16px",
                        }}
                        onClick={handleAddToCart}
                      >
                        Add to Cart
                      </Button>
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: "#2E368E",
                          color: "white",
                          padding: "12px",
                          boxShadow: "none",
                          width: "200px",
                          fontFamily: "OpenSans",
                          fontWeight: 600,
                          textTransform: "none",
                          fontSize: "16px",
                        }}
                        onClick={handleBuyNow}
                      >
                        Buy Now
                      </Button>
                    </Grid>
                  )}
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default Projects;
