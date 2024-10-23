import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import {
  Box,
  Backdrop,
  Paper,
  Grid,
  Typography,
  Button,
  Select,
  InputLabel,
  Menu,
  Modal,
  IconButton,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { Images } from "@constants/imageConstants";
import {
  DataGrid,
  GridColDef,
  // GridRenderCellParams,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { downloadPhoto, viewInvoiceDate } from "@utils/utility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  createSupportTicket,
  deleteSupportTicket,
  fetchSupportTicketCategories,
  fetchSupportTickets,
  updateSupportStatus,
} from "../../slices/supportTicketSlice";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { DropDownIncoiveLimit } from "./billing-components";
import MenuItem from "@mui/material/MenuItem";
import CommonTextArea from "@components/app_textarea";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import axiosInstance from "../../api/axiosInstance";
import { URLS } from "@constants/urlConstants";
// import greenTick from "@assets/green-tick.svg";
import FilterListIcon from "@mui/icons-material/FilterList";

export default function MoreVertDropdown({ status, ticketId }: any) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [resolvedChecked, setResolvedChecked] = useState(status === "resolved");
  console.log(resolvedChecked);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleResolvedClick = async () => {
    setAnchorEl(null);
    try {
      await axiosInstance.patch(`${URLS.SUPPORT_TICKET}${ticketId}/`, {
        status: "resolved",
      });
      // Update the local state to reflect the change
      setResolvedChecked(true);
      toast.success("Support Ticket Resolved");
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  return (
    <>
      <MoreVertIcon onClick={handleClick} />
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleResolvedClick}>
          {status === "resolved" ? "Resolved" : "Resolve"}
          {/* <Checkbox
            checked={resolvedChecked}
            disabled={status === "resolved"}
            checkedIcon={
              <img src={greenTick} style={{ height: 14, width: 14 }} />
            }
          /> */}
        </MenuItem>
      </Menu>
    </>
  );
}
import {
  AttachmentFile,
  CrossButton,
  LoaderContainer,
  // MenuContainer,
  // StatusButton,
  ViewContainer,
  ViewDetails,
  ViewHead,
  // ViewMenu,
} from "./styles/helpCenterStyledComponents";

export function DropDownBox({ heading, content, isDropable }: any) {
  const [isDropDown, setIsDropDown] = useState(true);

  return (
    <>
      <Box
        component="div"
        onClick={() => {
          setIsDropDown((prev) => !prev);
        }}
        sx={{
          backgroundColor: "#F7F8FB",
          marginTop: 2,
          padding: "10px",
          cursor: "pointer",
        }}
      >
        <Box
          component="div"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            paddingRight: 3,
            alignItems: "center",
            marginBottom: "5px",
          }}
        >
          <Box
            component="div"
            sx={{
              fontFamily: "OpenSans",
              fontWeight: "600",
              fontSize: 16,
            }}
          >
            {heading}
          </Box>
          {isDropable && (
            <img
              src={isDropDown ? Images.DROP_DOWN : Images.DROP_UP}
              alt="Tutorials"
              style={{ width: 15, height: 15 }}
            />
          )}
        </Box>

        {!isDropable ? (
          <Box
            component="div"
            sx={{
              fontFamily: "OpenSans",
              color: "blue",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => {
              window.open(content, "_blank");
            }}
          >
            <a>{content}</a>
          </Box>
        ) : (
          <>
            {isDropDown && (
              <Box
                component="div"
                sx={{
                  fontFamily: "OpenSans",
                  color: "blue",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => {
                  window.open(content, "_blank");
                }}
              >
                <a>{content}</a>
              </Box>
            )}
          </>
        )}
      </Box>
    </>
  );
}

export function SupportTicketActions() {
  //@ts-ignore
  const [isActiveTable, setIsActiveTable] = useState(true);
  const [isRaiseTicket, setIsRaiseTicket] = useState(false);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [ticketDetails, setTicketDetails] = useState({});
  const dispatch = useDispatch();
  //@ts-ignore
  const { ticketCategories } = useSelector(
    (state: RootState) => state.supportTicket,
  );
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    dispatch(fetchSupportTicketCategories() as any);
  }, [dispatch]);

  useEffect(() => {
    if (ticketCategories) setCategories(ticketCategories);
  }, [ticketCategories]);

  return (
    <>
      <Box
        component="div"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: "10px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <Box
          component="div"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Box
            component="div"
            // onClick={() => {
            //   setIsActiveTable((prev) => !prev);
            // }}
            sx={{
              backgroundColor: isActiveTable ? "#EAEBF4" : "#FFFFFF",
              textAlign: "center",
              width: "75px",
              height: "30px",
              color: isActiveTable ? "#2E368E" : "#303030",
              fontFamily: "OpenSans",
              cursor: "pointer",
              borderRadius: "12px",
              paddingTop: "5px",
              fontWeight: "600",
            }}
          >
            All
          </Box>
          {/* <Box
            component="div"
            onClick={() => {
              setIsActiveTable((prev) => !prev);
            }}
            sx={{
              backgroundColor: !isActiveTable ? "#EAEBF4" : "#FFFFFF",
              textAlign: "center",
              width: "85px",
              paddingTop: "5px",
              height: "30px",
              color: !isActiveTable ? "#2E368E" : "#303030",
              fontFamily: "OpenSans",
              cursor: "pointer",
              borderRadius: "12px",
              fontWeight: "600",
            }}
          >
            Resolved
          </Box> */}
        </Box>
        <Box
          component="div"
          onClick={() => {
            setIsRaiseTicket(true);
          }}
          sx={{
            backgroundColor: "#2E368E",
            width: "200px",
            height: "50px",
            borderRadius: "12px",
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            alignItems: "center",
            fontFamily: "OpenSans",
            color: "#FFFFFF",
            cursor: "pointer",
          }}
        >
          Raise Ticket
          <img
            src={Images.RAISE_TICKET}
            alt="Tutorials"
            style={{ width: 20, height: 20 }}
          />
        </Box>
      </Box>
      <SupportTicketTable
        isActiveTable={isActiveTable}
        viewTicketDetails={(showTicketDetails: boolean, ticketDetails: any) => {
          setShowTicketDetails(showTicketDetails);
          setTicketDetails(ticketDetails);
        }}
        categories={categories}
      />
      {isRaiseTicket && (
        <RaiseTicket
          setIsRaiseTicket={setIsRaiseTicket}
          categories={categories}
        />
      )}
      {showTicketDetails && (
        <TicketDetails
          ticketDetails={ticketDetails}
          setShowTicketDetails={setShowTicketDetails}
        />
      )}
    </>
  );
}

const PaginationBar = ({ limit, invoice_count, setPageNo }: any) => {
  const handlePagination = async (_event: any, page: number) => {
    setPageNo(page);
  };

  return (
    <Stack spacing={3}>
      <Pagination
        size="large"
        count={Math.ceil(Number(invoice_count) / limit)}
        shape="rounded"
        sx={{
          color: "black",
          "& .MuiPaginationItem-root.Mui-selected": {
            backgroundColor: "#2E368E",
            color: "white",
          },
          "& .MuiPaginationItem-root": {
            backgroundColor: "#EAEBF4", // Color for unselected items
          },
        }}
        onChange={handlePagination}
      />
    </Stack>
  );
};

export function SupportTicketTable({
  isActiveTable,
  viewTicketDetails,
  categories,
}: any) {
  const dispatch = useDispatch();
  const { supportTickets }: any = useSelector(
    (state: RootState) => state.supportTicket,
  );
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    [],
  );
  const [rows, setRows] = useState([]);
  const [deleteTicketState, setDeleteTicketState] = useState(false);
  ///@ts-ignore
  const [selectedTicketDetails, setSelectedTicketDetails] = useState<any>({});
  const [limit, setLimit] = useState(5);
  const [pageNo, setPageNo] = useState(1);
  const { userData } = useSelector((state: RootState) => state.user);
  console.log(userData);
  //@ts-expect-error
  const [selectedCategory, setSelectedCategory] = useState("");
  const [openFilterModal, setOpenFilterModal] = useState(false);
  //@ts-expect-error
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchSupportTickets() as any);
  }, [dispatch, isActiveTable]);

  useEffect(() => {
    if (supportTickets) {
      var filteredSupportTickets;
      // console.log(supportTickets)
      if (isActiveTable) {
        filteredSupportTickets = supportTickets.filter(
          (item: any) => item.status === "open" || item.status === "resolved",
        );
      }
      // else {
      //   filteredSupportTickets = supportTickets.filter(
      //     (item: any) => item.status === "resolved",
      //   );
      // }
      const finalArr = filteredSupportTickets?.map((item: any) => {
        const match = categories.find(
          (element: any) => element.id === item.category_id,
        );
        return match ? { ...item, category: match.category } : item;
      });
      setRows(finalArr);
    }
  }, [supportTickets]);

  const handleSelectionModelChange: any = (
    rowSelectionModel: GridRowSelectionModel,
  ) => {
    setSelectionModel(rowSelectionModel);
  };
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const category = event.target.value;
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.includes(category)
        ? prevSelectedCategories.filter((c) => c !== category)
        : [...prevSelectedCategories, category],
    );
    setPageNo(1);
    console.log(pageNo);
    // dispatch(fetchSupportTickets(selectedCategories) as any);
  };

  const filteredRows = selectedCategories.length
    ? //@ts-expect-error
      rows.filter((row) => selectedCategories.includes(row.category))
    : rows;

  const columns: GridColDef[] = [
    {
      field: "_id",
      headerName: "ID",
      width: 250,
      headerClassName: "header",
      renderCell: (params) => (
        <div
          onClick={() => {
            viewTicketDetails(true, params.row);
          }}
          style={{
            cursor: "pointer",
          }}
        >
          <span
            className="invoice_id__text"
            style={{
              fontFamily: "OpenSans",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            #{params.row.id.slice(0, 8)}
          </span>
        </div>
      ),
    },
    {
      field: "category",
      headerName: "Category",
      width: 250,
      headerClassName: "header",
      renderHeader: () => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>
            <h5
              style={{
                // fontFamily: "OpenSans",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "rgba(0, 0, 0, 0.87);",
              }}
            >
              Category
            </h5>
          </div>
          <IconButton
            size="small"
            onClick={() => setOpenFilterModal(true)}
            style={{ marginLeft: 8 }}
          >
            <FilterListIcon />
          </IconButton>
        </div>
      ),
      renderCell: (params) => (
        <div
          style={{
            fontFamily: "OpenSans",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          {params?.row?.category}
        </div>
      ),
    },
    {
      field: "created_at",
      headerName: "Created on",
      width: 250,
      headerClassName: "header",
      renderCell: (params) => (
        <div
          style={{
            fontFamily: "OpenSans",
            fontWeight: 400,
            fontSize: 14,
          }}
        >
          {viewInvoiceDate(params.row.created_at)}
        </div>
      ),
    },
    {
      field: "created_by",
      headerName: "Raised by",
      width: 250,
      headerClassName: "header",
      renderCell: () => (
        <div
          style={{
            fontFamily: "OpenSans",
            fontWeight: 400,
            fontSize: 14,
          }}
        >
          {userData?.data?.full_name}
        </div>
      ),
    },
    // {
    //   field: "action",
    //   headerName: "Actions",
    //   sortable: false,
    //   width: 180,
    //   headerClassName: "header",
    //   renderCell: (params) => (
    //     <div
    //       style={{
    //         cursor: "pointer",
    //       }}
    //     >
    //       {isActiveTable ? (
    //         <MoreVertDropdown
    //           status={params.row.status}
    //           ticketId={params.row.id}
    //         />
    //       ) : (
    //         // <div>
    //         //   <IconButton onClick={() => handleShowTableMenu(params)}>
    //         //     <MoreVertIcon />
    //         //   </IconButton>
    //         //   {isMenuOpen && selectedTicketDetails.id === params.row.id ? (
    //         //     <ResolveButton onClick={() => handleOnResolve(params)}>
    //         //       Resolve
    //         //     </ResolveButton>
    //         //   ) : (
    //         //     <></>
    //         //   )}
    //         // </div>
    //         <IconButton onClick={() => handleOnDelete(params)}>
    //           <img
    //             src={Images.DELETE_ICON_BLUE}
    //             style={{ height: 20, width: 20 }}
    //           />
    //         </IconButton>
    //       )}
    //     </div>
    //   ),
    // },
  ];

  // function handleOnDelete(params: GridRenderCellParams) {
  //   if (!isActiveTable) {
  // setSelectedTicketDetails(params.row);
  //     setDeleteTicketState(true);
  //   }
  // }

  const deleteTicket = async () => {
    try {
      await dispatch(deleteSupportTicket(selectedTicketDetails.id) as any);
      setDeleteTicketState(false);
      dispatch(fetchSupportTickets() as any);
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  const closeFilterModal = () => {
    setOpenFilterModal(false);
  };

  const currentRows = useMemo(
    () => filteredRows?.slice((pageNo - 1) * limit, pageNo * limit),
    [limit, pageNo, filteredRows],
  );
  return (
    <>
      <div
        style={{
          border: "solid #D9D9D9 1px",
          borderRadius: "10px",
          marginTop: -10,
        }}
      >
        <DataGrid
          sx={{
            "& .MuiDataGrid-row:nth-of-type(even)": {
              backgroundColor: "#FFFFFF",
            },
            "& .MuiDataGrid-row:nth-of-type(odd)": {
              backgroundColor: "#F7F8FB",
            },
            "&, [class^=MuiDataGrid]": { border: "none" },
          }}
          style={{
            height: "48vh",
            marginTop: "1rem",
            paddingLeft: "1rem",
          }}
          rows={currentRows}
          columns={columns}
          disableRowSelectionOnClick
          hideFooter
          disableColumnMenu
          onRowSelectionModelChange={handleSelectionModelChange}
          rowSelectionModel={selectionModel}
        />
      </div>
      <div
        style={{
          marginTop: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: "20px",
          paddingLeft: "20px",
        }}
      >
        <DropDownIncoiveLimit
          limit={limit}
          setLimit={setLimit}
          setPageNo={setPageNo}
        />
        <PaginationBar
          limit={limit}
          invoice_count={rows?.length}
          setPageNo={setPageNo}
        />
      </div>
      <Modal open={openFilterModal} onClose={closeFilterModal}>
        <Box
          component="div"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 250,
            bgcolor: "background.paper",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            sx={{ justifyContent: "center", display: "flex" }}
          >
            Sort by Category
          </Typography>
          <Box
            component="div"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
            }}
          >
            {categories.map((category: any) => (
              <Box
                component="div"
                key={category.id}
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <input
                  type="checkbox"
                  id={`checkbox-${category.id}`}
                  value={category.category}
                  checked={selectedCategories.includes(category.category)}
                  onChange={handleCategoryChange}
                />
                <label
                  htmlFor={`checkbox-${category.id}`}
                  style={{
                    marginLeft: "8px",
                    fontFamily: "OpenSans",
                    fontWeight: "600",
                  }}
                >
                  {category.category}
                </label>
              </Box>
            ))}
          </Box>
          <Box
            component="div"
            sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
          >
            <Button
              variant="outlined"
              onClick={closeFilterModal}
              sx={{ mt: 2, backgroundColor: "#FFF", minWidth: "94px" }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={closeFilterModal}
              sx={{ mt: 2, minWidth: "94px" }}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Modal>

      {deleteTicketState && (
        <Backdrop open={deleteTicketState} style={{ zIndex: 999 }}>
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
                gap: "16px",
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
                sx={{
                  fontWeight: "700",
                  fontSize: "20px",
                  lineHeight: "none",
                  marginBottom: "0",
                }}
                gutterBottom
              >
                Are you sure you want to delete this ticket?
              </Typography>
              <Typography variant="body2" color="#484848" gutterBottom>
                By clicking Delete, your ticket will be deleted permanently.
              </Typography>
              <Box component="div" sx={{ display: "flex", gap: "16px" }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => setDeleteTicketState(false)}
                  style={{ fontWeight: 500, textTransform: "none" }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={deleteTicket}
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
                  style={{ fontWeight: 500, textTransform: "none" }}
                >
                  Delete
                </Button>
              </Box>
            </Paper>
          </Box>
        </Backdrop>
      )}
    </>
  );
}

export const RaiseTicket = ({ setIsRaiseTicket, categories }: any) => {
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();
  // const { ticketCategories } = useSelector(
  //   (state: RootState) => state.supportTicket,
  // );
  // const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // const location = useLocation();
  // const images = location.state?.selectedImages || [];
  // const [imageFiles, setImageFiles] = useState<File[]>(images);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  // useEffect(() => {
  //   dispatch(fetchSupportTicketCategories() as any);
  // }, [dispatch]);

  // useEffect(() => {
  //   if (ticketCategories) setCategories(ticketCategories);
  // }, [ticketCategories]);

  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event.target.value);
  };

  const handleDeleteAttachment = (index: number) => {
    let newArr = [...selectedImages];
    newArr.splice(index, 1);
    setSelectedImages(newArr);
  };

  const [isRaising, setIsRaising] = useState<boolean>(false);

  const raiseTicket = async () => {
    if (!description) {
      toast.error("Please provide a description.");
      return;
    }
    if (!selectedCategory) {
      toast.error("Please select a category.");
      return;
    }
    setIsRaising(true);
    const payload = new FormData();
    payload.append("category_id", selectedCategory);
    payload.append("description", description);
    selectedImages.forEach((file: File) => {
      payload.append("files", file);
    });
    try {
      await dispatch(createSupportTicket(payload) as any);
      setIsRaiseTicket(false);
      toast.success(
        "Your ticket has been received. We will respond to you via email shortly",
      );
      setIsRaising(false);
      dispatch(fetchSupportTickets() as any);
    } catch (error) {
      setIsRaising(false);
      setIsRaiseTicket(false);
      toast.error("Something went wrong, Please try again");
    }
  };

  return (
    <>
      <Backdrop open={true} style={{ zIndex: 999 }}>
        <Box
          component="div"
          sx={{
            width: "430px",
            position: "absolute",
            top: "50%",
            left: "calc(100% - 217px)",
            height: "100%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              borderRadius: "12px",
              padding: "24px",
              backgroundColor: "#FFF",
              color: "#000",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              height: "100%",
            }}
          >
            <Box
              component="div"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ marginBottom: "12px" }}
            >
              <Typography
                variant="h6"
                color="#000"
                sx={{ padding: "15px 0 0 10px" }}
              >
                Raise a Ticket
              </Typography>
              <img
                onClick={() => {
                  setIsRaiseTicket(false);
                }}
                src={Images.CROSS_ICON}
                alt="Close"
                style={{
                  width: 20,
                  height: 20,
                  position: "absolute",
                  right: 35,
                  top: 35,
                  cursor: "pointer",
                }}
              />
            </Box>
            <form
              style={{
                fontSize: "12px",
                padding: "8px 8px 30px 8px",
                height: "100%",
              }}
            >
              <Box
                component="div"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                sx={{ height: "100%" }}
              >
                <Grid container spacing={1} justifyContent="left">
                  <Grid item xs={12}>
                    <div style={{ marginBottom: "5px", textAlign: "left" }}>
                      <InputLabel
                        style={{
                          color: "#000",
                          fontWeight: 400,
                          fontSize: "14px",
                          fontFamily: "OpenSans",
                          lineHeight: "20px",
                        }}
                      >
                        Select Category
                      </InputLabel>
                    </div>
                    <Select
                      labelId="demo-controlled-open-select-label"
                      id="demo-controlled-open-select"
                      value={selectedCategory}
                      fullWidth
                      displayEmpty
                      variant="outlined"
                      onChange={handleCategoryChange}
                      IconComponent={() => (
                        <KeyboardArrowDownRoundedIcon
                          style={{ marginRight: "10px" }}
                        />
                      )}
                      sx={{
                        textAlign: "left",
                        border: "1px solid #2E368E",
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "1px",
                          borderColor: "transparent",
                        },
                        "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                          {
                            border: "1px",
                            borderColor: "#2E368E",
                          },
                      }}
                    >
                      <MenuItem value="">Select</MenuItem>
                      {categories.map((category: any, index: number) => {
                        return (
                          <MenuItem key={index} value={category.id}>
                            {category.category}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </Grid>
                  <Grid item xs={12}>
                    <CommonTextArea
                      label="Description"
                      value={description}
                      hintText="Write Description"
                      onChange={(e) => setDescription(e.target.value)}
                      multiline
                      rows={4}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <label htmlFor="file-upload">
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        component="span"
                        style={{
                          fontFamily: "OpenSans",
                          fontWeight: 600,
                          fontSize: "14px",
                          textTransform: "none",
                        }}
                      >
                        Add attachments
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        style={{ display: "none" }}
                        multiple
                        accept="image/*,.heic,.heif,.mov,.mp4"
                        onChange={(event) => {
                          const files = event.target.files;
                          if (files) {
                            const fileList = Array.from(files);
                            setSelectedImages((prevFiles) => [
                              ...prevFiles,
                              ...fileList,
                            ]);
                          }
                        }}
                      />
                    </label>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction="row" flexWrap="wrap">
                      {selectedImages.map((image, index) => {
                        return (
                          <Chip
                            style={{ margin: "0 5px 5px 0" }}
                            label={image.name}
                            key={index}
                            variant="outlined"
                            onDelete={() => handleDeleteAttachment(index)}
                          />
                        );
                      })}
                    </Stack>
                  </Grid>
                </Grid>

                <Box component="div">
                  <Button
                    onClick={() => {
                      raiseTicket();
                    }}
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{
                      fontFamily: "OpenSans",
                      fontWeight: 600,
                      fontSize: "14px",
                      textTransform: "none",
                      marginBottom: "1rem",
                    }}
                  >
                    {isRaising ? (
                      <CircularProgress style={{ color: "white" }} />
                    ) : (
                      "Raise a Ticket"
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setIsRaiseTicket(false);
                    }}
                    variant="outlined"
                    color="primary"
                    fullWidth
                    style={{
                      fontFamily: "OpenSans",
                      fontWeight: 600,
                      fontSize: "14px",
                      textTransform: "none",
                      marginBottom: "1rem",
                      background: "transparent",
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </form>
          </Paper>
        </Box>
      </Backdrop>
    </>
  );
};

export const TicketDetails = ({ ticketDetails, setShowTicketDetails }: any) => {
  //@ts-ignore
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString); // Parse the date string
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const hour = String(date.getHours() % 12).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const meridian = date.getHours() >= 12 ? "PM" : "AM";

    return `${day} ${month} ${year}, ${hour}:${minutes} ${meridian}`;
  };

  async function handleDownloadFile(url: string) {
    setIsDownloading(true);

    try {
      const response = await downloadPhoto(url);
      if (response) {
        setIsDownloading(false);
      }
    } catch (error) {
      setIsDownloading(false);
    }
  }
  //@ts-ignore
  async function handleChangeStatus() {
    const payload = {
      id: ticketDetails.id,
      data: { status: "resolved" },
    };
    try {
      const resp = await updateSupportStatus(payload);
      if (resp) {
        setIsMenuOpen(false);
        toast.success("Status has been updated");
        setShowTicketDetails(false);
        dispatch(fetchSupportTickets() as any);
      }
    } catch (error) {
      //not handled
    }
  }
  //@ts-ignore
  function handleOpenMenu() {
    setIsMenuOpen((prev) => !prev);
  }

  return (
    <>
      <Backdrop open={true} style={{ zIndex: 999 }}>
        <ViewContainer>
          <ViewHead>
            <div>
              <h3>ID: #{ticketDetails.id.slice(0, 8)}</h3>
              {/* <MenuContainer>
                <StatusButton
                  isResolved={ticketDetails.status !== "open"}
                  onClick={handleOpenMenu}
                >
                  <span>{ticketDetails.status}</span>
                  <KeyboardArrowDownRoundedIcon />
                </StatusButton>
                {isMenuOpen && (
                  <ViewMenu>
                    <button onClick={handleChangeStatus}>Resolve</button>
                  </ViewMenu>
                )}
              </MenuContainer> */}
            </div>
            <CrossButton
              onClick={() => {
                setShowTicketDetails(false);
              }}
            >
              <img src={Images.CROSS_ICON} alt="Close" />
            </CrossButton>
          </ViewHead>
          <ViewDetails>
            <p>
              ID: <span>#{ticketDetails.id.slice(0, 8)}</span>
            </p>
            <p>
              Category: <span>{ticketDetails.category_name}</span>
            </p>
            <p>
              Description: <span>{ticketDetails.description}</span>
            </p>
            <p>{formatDate(ticketDetails.created_at)}</p>
            {ticketDetails?.attachments?.length > 0 && <p>Attachments:</p>}
            <div>
              {!!ticketDetails?.attachments?.length &&
                ticketDetails?.attachments?.map(
                  (file: { id: string; file_url: string }) => (
                    <AttachmentFile
                      key={file.id}
                      onClick={() => handleDownloadFile(file.file_url)}
                    >
                      <ImageOutlinedIcon />
                      <span>{file.file_url.split("/").reverse()[0]}</span>
                    </AttachmentFile>
                  ),
                )}
            </div>
          </ViewDetails>
          {isDownloading && (
            <LoaderContainer>
              <p>Downloading..</p>
              <CircularProgress />
            </LoaderContainer>
          )}
        </ViewContainer>
      </Backdrop>
    </>
  );
};
