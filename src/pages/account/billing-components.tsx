import {
  SelectChangeEvent,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Images } from "@constants/imageConstants";
import { Box, Typography, Paper, Button, Backdrop, Grid } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { viewInvoiceDate } from "@utils/utility";
import { downloadInvoice } from "@slices/paymentSlice";
import CommonTextField from "@components/app_textfield";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { fetchUserAddresses, saveUserAddress } from "@slices/userSlice";
import { useAppDispatch } from "@hooks/redux-hooks";
import { toast } from "react-toastify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

export const DropDownFilter = ({ onDateRangeChange }: any) => {
  const [date, setDate] = useState<string>("All");
  const [open, setOpen] = useState(false);

  const handleChange = (event: SelectChangeEvent<typeof date>) => {
    const selectedDate = event.target.value;
    setDate(selectedDate);
    onDateRangeChange(selectedDate);
    setDate(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true); // Call the callback function with the selected date range
  };

  return (
    <>
      <FormControl
        className="dropdown"
        sx={{
          backgroundColor: "#F7F8FB",
          borderRadius: "8px",
        }}
      >
        <div style={{ width: 150 }}></div>
        <Select
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              border: "1px",
              borderColor: "transparent",
            },
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              border: "1px",
              borderColor: "#2E368E",
            },
            paddingRight: "0.8rem",
          }}
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={date}
          onChange={handleChange}
          IconComponent={() => (
            <KeyboardArrowDownRoundedIcon
              style={{ color: "#2E368E", width: "25px" }}
            />
          )}
        >
          <MenuItem value={"All"}>All</MenuItem>
          <MenuItem value={"This Week"}>This Week</MenuItem>
          <MenuItem value={"Last Week"}>Last Week</MenuItem>
          <MenuItem value={"Last 3 Months"}>Last 3 Months</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export const ViewInvoiceDetails = ({
  selected_invoice,
  setViewInvoice,
  viewInvoice,
}: any) => {
  // console.log("This is selected invoice:", selected_invoice);
  const handleCopyTransactionId = async () => {
    try {
      await navigator.clipboard.writeText(selected_invoice?.razorpay_order_id);
      toast.success("Transaction ID copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy Transaction ID.");
    }
  };

  function truncateString(input: string): string {
    if (input.length > 5) {
      return input.slice(0, 5) + "...";
    }
    return input;
  }
  const handleDownload = async (invoiceId: string) => {
    try {
      const s3Url = await downloadInvoice(invoiceId);
      const link = document.createElement("a");
      link.href = s3Url;
      link.download = `Invoice_${invoiceId}.pdf`; // specify a file name if needed
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download invoice.");
    }
  };
  return (
    <Backdrop open={viewInvoice} style={{ zIndex: 999 }}>
      <Box
        component="div"
        sx={{
          width: "600px",
          position: "fixed",
          top: "50vh",
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
            padding: "2rem 2rem",
            backgroundColor: "#FFF",
            color: "#000",
            display: "flex",
            flexDirection: "column",
            gap: "25px",
          }}
        >
          <img
            onClick={() => {
              setViewInvoice(false);
            }}
            src={Images.CROSS_ICON}
            alt="Close"
            style={{
              width: 16,
              height: 16,
              position: "absolute",
              right: 44,
              top: 44,
              cursor: "pointer",
            }}
          />
          <Box
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "60px",
                backgroundColor: "#F5F5F5",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={Images.Invoice_Icon}
                alt="Invoice"
                style={{ width: 30, height: 30 }}
              />
            </div>
            <Box component="div">
              <Typography
                sx={{ fontWeight: "600", fontSize: "14px", textAlign: "left" }}
              >
                #{selected_invoice?.invoice_no}
              </Typography>
              <Typography
                sx={{ fontWeight: "400", fontSize: "14px", textAlign: "left" }}
              >
                {selected_invoice?.cart?.length}{" "}
                {selected_invoice?.cart?.length > 1 ? "Models " : "Model "}
              </Typography>
              <Typography
                sx={{
                  fontWeight: "100",
                  fontSize: "12px",
                  color: "#9C9C9C",
                  textAlign: "left",
                  fontFamily: "OpenSans",
                }}
              >
                {viewInvoiceDate(selected_invoice?.created_at)}
              </Typography>
            </Box>
          </Box>
          <Box component="div" sx={{ display: "flex", gap: "10px" }}>
            <Box
              component="div"
              sx={{
                backgroundColor: "#F5F5F5",
                width: "18vw",
                height: "50px",
                padding: "10px",
                borderRadius: "12px",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "100",
                  fontSize: "12px",
                  textAlign: "left",
                  fontFamily: "OpenSans",
                }}
              >
                Billed to
              </Typography>
              <Typography
                sx={{ fontWeight: "200", fontSize: "14px", textAlign: "left" }}
              >
                {selected_invoice?.billing_address?.full_name}
              </Typography>
            </Box>
            <Box
              component="div"
              sx={{
                backgroundColor: "#F5F5F5",
                width: "18vw",
                height: "50px",
                padding: "10px",
                borderRadius: "12px",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "100",
                  fontSize: "12px",
                  textAlign: "left",
                  fontFamily: "OpenSans",
                }}
              >
                Billing Address
              </Typography>
              <Typography
                sx={{ fontWeight: "200", fontSize: "14px", textAlign: "left" }}
              >
                {selected_invoice?.billing_address?.address}
              </Typography>
            </Box>
          </Box>
          <Box component="div" sx={{ display: "flex", gap: "10px" }}>
            <Box
              component="div"
              sx={{
                backgroundColor: "#F5F5F5",
                width: "18vw",
                height: "50px",
                padding: "10px",
                borderRadius: "12px",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <div>
                <Typography
                  sx={{
                    fontWeight: "100",
                    fontSize: "12px",
                    textAlign: "left",
                    fontFamily: "OpenSans",
                  }}
                >
                  Transaction ID
                </Typography>
                <Typography
                  sx={{
                    fontWeight: "200",
                    fontSize: "14px",
                    textAlign: "left",
                  }}
                >
                  {selected_invoice?.razorpay_order_id}
                </Typography>
              </div>
              <Button
                onClick={handleCopyTransactionId}
                sx={{ background: "transparent" }}
              >
                <ContentCopyIcon sx={{ fontSize: 15, cursor: "pointer" }} />
              </Button>
            </Box>
            <Box
              component="div"
              sx={{
                backgroundColor: "#F5F5F5",
                width: "18vw",
                height: "50px",
                padding: "10px",
                borderRadius: "12px",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "100",
                  fontSize: "12px",
                  textAlign: "left",
                  fontFamily: "OpenSans",
                }}
              >
                Debited From
              </Typography>
              <Typography
                sx={{ fontWeight: "200", fontSize: "14px", textAlign: "left" }}
              >
                xxxxxxxx8789
              </Typography>
            </Box>
          </Box>
          <Box
            component="div"
            sx={{
              backgroundColor: "#F5F5F5",
              width: "518px",
              height: "auto",
              borderRadius: "12px",
              display: "flex",
              padding: "10px",
              flexDirection: "column",
            }}
          >
            <Box component="div">
              <Typography
                sx={{
                  fontWeight: "100",
                  fontSize: "12px",
                  padding: "5px",
                  textAlign: "left",
                  fontFamily: "OpenSans",
                  paddingBottom: "3px",
                }}
              >
                Items ({selected_invoice?.cart?.length})
              </Typography>
            </Box>
            <div style={{ overflowY: "scroll", height: "132px" }}>
              <Grid
                container
                spacing={2}
                sx={{
                  padding: "1.5rem",
                }}
              >
                {selected_invoice?.cart?.map((item: any) => (
                  <Grid xs={3}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                        margin: "0rem 0rem 1rem 0.3rem",
                        width: "100px",
                      }}
                    >
                      <img
                        src={item?.metadata?.first_content_url}
                        alt="Model"
                        style={{ width: 32, height: 32, borderRadius: "50%" }}
                      />
                      <Typography
                        sx={{
                          fontWeight: "200",
                          fontSize: "14px",
                          textAlign: "left",
                          marginLeft: "0.3rem",
                        }}
                      >
                        {truncateString(item?.name)}
                      </Typography>
                    </div>
                  </Grid>
                ))}
              </Grid>
            </div>
          </Box>
          <Typography
            sx={{
              fontWeight: "600",
              fontSize: "16px",
              textAlign: "left",
              lineHeight: "25px",
              fontFamily: "OpenSans",
            }}
          >
            Pricing Details({selected_invoice?.cart?.length}{" "}
            {selected_invoice?.cart?.length > 1 ? "items" : "item"})
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              lineHeight: "25px",
            }}
            component="div"
          >
            <Typography
              sx={{
                fontWeight: "200",
                fontSize: "14px",
                textAlign: "left",
                fontFamily: "OpenSans",
              }}
            >
              Net Price
            </Typography>
            <Typography
              sx={{
                fontWeight: "100",
                fontSize: "14px",
                textAlign: "right",
                fontFamily: "OpenSans",
              }}
            >
              {"INR " + selected_invoice?.net_price}
            </Typography>
          </Box>
          <Box
            component="div"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/*
            <Typography
              sx={{ fontWeight: "200", fontSize: "14px", textAlign: "left" }}
            >
              Tax
            </Typography>
            <Typography
              sx={{ fontWeight: "100", fontSize: "10px", textAlign: "right" }}
            >

              {`INR (${selected_invoice?.tax_applied[0]?.percentage ?? "0"}%) `}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            */}
            <Typography
              sx={{
                fontWeight: "200",
                fontSize: "14px",
                textAlign: "left",
                fontFamily: "OpenSans",
              }}
            >
              Referral Discount
            </Typography>
            <Typography
              sx={{
                fontWeight: "100",
                fontSize: "14px",
                textAlign: "right",
                fontFamily: "OpenSans",
              }}
            >
              INR {selected_invoice?.discount}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            component="div"
          >
            <Typography
              sx={{ fontWeight: "200", fontSize: "14px", textAlign: "left" }}
            >
              Total amount
            </Typography>
            <Typography
              sx={{ fontWeight: "200", fontSize: "14px", textAlign: "right" }}
            >
              INR {selected_invoice?.total_amount}
            </Typography>
          </Box>
          <Box component="div" sx={{ display: "flex", gap: "16px" }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => handleDownload(selected_invoice?.id)}
              style={{ fontWeight: 500, textTransform: "none" }}
            >
              Download Invoice
            </Button>
          </Box>
        </Paper>
      </Box>
    </Backdrop>
  );
};

export const BillingFrom = forwardRef(
  (
    { isBillingAddressEditable, setIsBillingAddressEditable }: any,
    ref: any,
  ) => {
    const [billingAddress, setBillingAddress] = useState("");
    const [fullName, setFullName] = useState("");
    const [initialFullName, setInitialFullName] = useState("");
    const [initialBillingAddress, setInitialBillingAddress] = useState("");
    const { addresses } = useSelector((state: RootState) => state.user);
    const [fullNameError, setFullNameError] = useState("");
    const [billingAddressError, setBillingAddressError] = useState("");
    const dispatch = useAppDispatch();
    useEffect(() => {
      async function fetchUserAddress() {
        await dispatch(fetchUserAddresses() as any);
      }
      fetchUserAddress();
    }, [dispatch]);

    useEffect(() => {
      if (addresses?.length) {
        const fetchedFullName = addresses[0]?.data?.full_name;
        const fetchedBillingAddress = addresses[0]?.data?.address;

        setFullName(fetchedFullName === "Full Name" ? " " : fetchedFullName);
        setBillingAddress(
          fetchedBillingAddress === "Billing Address"
            ? " "
            : fetchedBillingAddress,
        );

        // Set initial values
        setInitialFullName(fetchedFullName);
        setInitialBillingAddress(fetchedBillingAddress);
      }
    }, [addresses]);

    useImperativeHandle(ref, () => ({
      async handleSave() {
        if (!fullName.trim()) {
          setFullNameError("Full Name is required");
        } else {
          setFullNameError("");
        }

        if (!billingAddress.trim()) {
          setBillingAddressError("Billing Address is required");
        } else {
          setBillingAddressError("");
        }

        if (!fullName.trim() || !billingAddress.trim()) {
          setIsBillingAddressEditable(true);
          toast.error("Billing details required");
          return;
        } else if (
          fullName === initialFullName &&
          billingAddress === initialBillingAddress
        ) {
          toast.error("No fields have been changed.");
          return;
        } else {
          try {
            const userDetails = {
              full_name: fullName,
              address: billingAddress,
              user_id: addresses[0]?.data?.user_id,
              id: addresses[0]?.data?.id,
            };
            await saveUserAddress(userDetails);
          } catch (error) {
            console.error("Error saving account details:", error);
          }
        }
      },
    }));

    return (
      <>
        <div>
          {/* <Typography
            variant="h6"
            component="div"
            style={{ padding: "8px", fontWeight: "bold", color: "#000" }}
          >
            Card Details
          </Typography>
          <div style={{ padding: "8px" }}>
            <Box
              sx={{
                width: "390px",
                height: "80px",
                backgroundColor: "black",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                padding: "10px",
                color: "#FFFFFF",
                marginBottom: "20px",
              }}
            >
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  backgroundColor: "#FFFFFF",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: "20px",
                }}
              >
                <img
                  src={Images.CREDIT_CARD_LOGO}
                  alt="Credit Card Logo"
                  style={{ width: 30, height: 30 }}
                />
              </Box>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body1" style={{ fontSize: "20px" }}>
                  Visa **** **** **** 1234
                </Typography>
                <Typography variant="body1" style={{ fontSize: "12px" }}>
                  Expires March 2026
                </Typography>
              </div>
            </Box>
          </div> */}
          <Typography
            variant="h6"
            component="div"
            style={{ padding: "8px", fontWeight: "bold", color: "#000" }}
          >
            User Details
          </Typography>
          <form
            style={{
              width: 390,
              fontSize: "12px",
              padding: "8px",
            }}
          >
            <Grid container spacing={1} justifyContent="center">
              <Grid item xs={12}>
                <CommonTextField
                  label="Full Name"
                  value={fullName}
                  hintText="Full Name"
                  required
                  disabled={!isBillingAddressEditable}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setFullNameError("");
                  }}
                />
                {fullNameError && (
                  <Typography
                    color="error"
                    variant="body2"
                    style={{ marginTop: 5 }}
                  >
                    {fullNameError}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <CommonTextField
                  label="Billing Address"
                  value={billingAddress}
                  hintText="Billing Address"
                  required
                  disabled={!isBillingAddressEditable}
                  onChange={(e) => {
                    setBillingAddress(e.target.value);
                    setBillingAddressError("");
                  }}
                />
                {billingAddressError && (
                  <Typography
                    color="error"
                    variant="body2"
                    style={{ marginTop: 5 }}
                  >
                    {billingAddressError}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </form>
        </div>
      </>
    );
  },
);

export const PaginationBar = ({ limit, invoice_count, setPageNo }: any) => {
  const handlePagination = async (event: any, page: any) => {
    console.log(event);
    const offset = Number(page) === 1 ? 0 : Number(page) * limit - (limit - 1);
    setPageNo(offset);
  };

  return (
    <Stack spacing={3}>
      <Pagination
        size="large"
        count={(Math.ceil(Number(invoice_count) / limit) * limit) / limit}
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

export const DropDownIncoiveLimit = ({ limit, setLimit, setPageNo }: any) => {
  const [open, setOpen] = useState(false);

  const handleChange = (event: any) => {
    setLimit(event.target.value);
    setPageNo(1);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <FormControl
        className="dropdown"
        sx={{
          backgroundColor: "#F7F8FB",
        }}
      >
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={limit}
          onChange={handleChange}
          sx={{
            height: "40px",
          }}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={15}>15</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};
