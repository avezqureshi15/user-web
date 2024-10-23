import {
  IconButton,
  Typography,
  Grid,
  Button,
  Backdrop,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { useAppDispatch } from "@hooks/redux-hooks";
import { useEffect, useState } from "react";
import { fetchCartDetails, removeFromCart } from "@slices/projectSlice";
import {
  fetchPriceDetailsWithReferralCode,
  fetchPriceDetailsWithReferralApplied,
  getOrderId,
} from "@slices/paymentSlice";
import { Images } from "@constants/imageConstants";
//import TextField from "@mui/material/TextField";
//import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchUserAddress } from "@slices/authSlice";
import Logo from "@assets/xen-capture-logo.svg";
import { toast } from "react-toastify";
import { fetchUserAddresses, fetchUserData } from "@slices/userSlice";
// import { CheckCircleOutline } from "@mui/icons-material";
import { Switch } from "@mui/material";

interface RootState {
  payment: {
    netAmount: number;
    taxAmount: number;
    discount: number;
    totalAmount: number;
  };
  auth: {
    id: string;
  };
  user: {
    addresses: any[];
    userData: any;
  };
  // Add other slices' state definitions here if needed
}

function Cart() {
  const [cart, setCart] = useState<
    { id: string; image: string; name: string; metadata: any }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [isbillingAddress, setIsBillingAddress] = useState(false);
  const { userData } = useSelector((state: RootState) => state.user);
  // const [promoCode, setPromoCode] = useState(() => {
  //   return localStorage.getItem("promoCode") || "";
  // });

  const [promoApplied, setPromoApplied] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { netAmount, totalAmount, discount } = useSelector(
    (state: RootState) => state.payment,
  );
  // const { id } = useSelector((state: RootState) => state.auth);
  const { addresses } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    const fetchData = async () => {
      // await dispatch(fetchPriceDetails());
      await dispatch(fetchPriceDetailsWithReferralCode());
      await dispatch(fetchUserAddress());
    };
    setPromoApplied(false);
    fetchData();
  }, [userData]);

  useEffect(() => {
    dispatch(fetchUserData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // const [razorpayOrderId, setRazorpayOrderId] = useState(null);

  // useEffect(() => {
  const fetchOrderId = async () => {
    // console.log("Fetching order ID", id);
    try {
      const response = await dispatch(
        getOrderId({
          referral_applied: promoApplied,
        }),
        // getOrderId({ id, referralCode: userData?.data?.referredby_code }),
      );
      return response;
    } catch (error) {
      console.error("Error fetching order ID:", error);
    }
  };

  // fetchOrderId();
  // }, [id, userData, promoApplied]);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const response = await dispatch(fetchCartDetails());
      // console.log("This is cart details:",response);
      setLoading(false);
      setCart(response.payload);
      console.log("Cart details:", response.payload);
    } catch (error) {
      console.log("Error fetching cart details:", error);
      setLoading(false);
    }
  };

  const [cartItemsDelete, setCartItemsDelete] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const handleDeleteCartItem = async (itemId: string) => {
    try {
      await dispatch(removeFromCart(itemId));
      const updatedCart = cart.filter((item) => item.id !== itemId);
      setCart(updatedCart);
      await dispatch(fetchPriceDetailsWithReferralCode());
      setCartItemsDelete(false);
      setOpen(false);
      // await dispatch(
      //   // getOrderId({ id, referralCode: userData?.data?.referredby_code }),
      //   getOrderId({
      //     id,
      //     referralCode: promoApplied ? userData?.data?.referredby_code : "",
      //   })
      // );
      // setRazorpayOrderId(response.payload.data.id);
    } catch (error) {
      console.log("Error deleting cart item:", error);
    }
  };

  const handleDeleteModal = (itemId: string) => {
    setCartItemsDelete(true);
    setDeleteId(itemId);
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const isSafariBrowser = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes("safari") && !userAgent.includes("chrome");
  };

  const handleBackButtonClick = () => {
    navigate("/");
  };
  useEffect(() => {
    async function fetchUserAddress() {
      await dispatch(fetchUserAddresses() as any);
    }
    fetchUserAddress();
  }, [dispatch]);
  useEffect(() => {
    if (addresses?.[0]?.data?.address !== null) {
      setIsBillingAddress(true);
    } else {
      setIsBillingAddress(false);
    }
  }, [addresses]);

  const openRazorpayCheckout = async () => {
    const response = await fetchOrderId();
    //  console.log(response?.payload.data.id);

    if (isbillingAddress === false) {
      toast.error("Please provide billing address before proceeding to pay.", {
        position: "bottom-center",
      });
      return;
    }
    //@ts-ignore
    if (response?.payload?.data?.id) {
      const options = {
        key: "rzp_test_Wf3AkBNvh3VgMB",
        currency: "INR",
        name: "XenCapture",
        description: "Test Transaction",
        image: Logo,
        //@ts-ignore
        order_id: response?.payload?.data?.id,
        notes: {
          address: "Razorpay Corporate Office",
        },
        handler: function () {
          fetchCartData();
          toast.success("Payment Successful!", {
            position: "bottom-center",
          });

          const searchParams = new URLSearchParams(location.search);
          const params = ["name", "date", "time", "id"].reduce(
            (acc, key) => {
              const value = searchParams.get(key);
              if (value) acc[key] = value;
              return acc;
            },
            {} as Record<string, string | null>,
          );
          const navigateParam = searchParams.get("navigate");
          if (navigateParam === "home") {
            navigate("/cart");
          } else if (Object.keys(params).length === 0) {
            navigate("/cart");
          } else {
            navigate("/view-model", { state: params });
          }
        },
        theme: {
          color: "#2E368E",
        },
      };
      // @ts-expect-error: Ignore the TypeScript error related to 'window.Razorpay'
      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function () {
        alert("Payment Failed!");
      });
      rzp.open();
    } else {
      toast.error("Failed to fetch order ID. Please try again later.", {
        position: "bottom-center",
      });
    }
  };

  // const handlePromoCodeChange = (event: any) => {
  //   const newPromoCode = event.target.value;
  //   setPromoCode(newPromoCode);
  //   localStorage.setItem("promoCode", newPromoCode);
  // };

  const handleSwitchChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = event.target.checked;
    setPromoApplied(newValue);
    await dispatch(fetchPriceDetailsWithReferralApplied(newValue));
    if (newValue)
      toast.success("Referral Code will be applied on current payment");
  };

  useEffect(() => {
    const savedPromoApplied = localStorage.getItem("promoApplied");
    if (savedPromoApplied !== null) {
      setPromoApplied(JSON.parse(savedPromoApplied));
    }
  }, []);

  const [open, setOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem("promoApplied", JSON.stringify(promoApplied));
  }, [promoApplied]);

  // useEffect(() => {
  //   if (promoCode !== userData?.data?.referredby_code) {
  //     console.log(promoCode);
  //     setPromoApplied(false);
  //     localStorage.setItem("promoApplied", JSON.stringify(false));
  //   }
  // }, [promoCode, userData]);

  return (
    <Grid sx={{ background: "#F7F7F7", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <img
            onClick={() => {
              navigate("/");
            }}
            src={Images.LOGO}
            alt="Logo"
            style={{ width: "150px", height: "auto", cursor: "pointer" }}
          />
        </Toolbar>
      </AppBar>

      {/* My Cart Header */}
      <Grid
        container
        mt={3}
        sx={{ width: "calc(100% - 60px)", marginLeft: "35px" }}
      >
        <Grid item>
          <IconButton onClick={handleBackButtonClick}>
            <img
              src={Images.LEFT_ARROW}
              alt="Arrow"
              style={{ width: 26, height: 26 }}
            />
          </IconButton>
        </Grid>
        <Grid item>
          <Typography
            gutterBottom
            sx={{ fontWeight: "700", fontSize: "24px", marginTop: "2px" }}
          >
            Cart
          </Typography>
        </Grid>
      </Grid>

      {/* Cart Items */}
      <Grid
        container
        mt={4}
        sx={{
          marginLeft: "35px",
          marginRight: "35px",
          maxWidth: "calc(100% - 60px)",
        }}
      >
        {cart.length === 0 ? ( // Check if the cart is empty
          <Box
            component="div"
            sx={{
              textAlign: "center",
              width: "100%",
              height: "80vh",
              marginTop: "-25px",
              backgroundColor: "#EAEBF4",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              borderRadius: "8px",
              flexDirection: "column",
            }}
          >
            <div style={{ width: "280px" }}>
              <img
                style={{ width: "100%", height: "100%" }}
                src={Images.EMPTY_CART}
                alt="Empty Cart"
              />
            </div>
            <Typography
              sx={{
                fontFamily: "OpenSans",
                fontWeight: 700,
                fontSize: "30px",
                margin: "1rem",
                color: "#303030",
              }}
            >
              No Items in Cart
            </Typography>
          </Box>
        ) : (
          <>
            {/* Cart Item Details */}

            <Grid item xs={12} md={7} sx={{ paddingRight: { xs: 0, md: 2 } }}>
              <Grid container direction="column" gap={3}>
                {loading && (
                  <Grid
                    item
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "6px",
                      padding: "15px",
                      minHeight: "435px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CircularProgress />
                  </Grid>
                )}
                {!loading && (
                  <Grid
                    item
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "6px",
                      padding: "15px",
                      minHeight: "435px",
                    }}
                  >
                    {cart.map((item) => (
                      <Grid
                        container
                        key={item.id}
                        alignItems="center"
                        padding="16px"
                      >
                        <Grid item sx={{ marginRight: "10px" }}>
                          <img
                            src={
                              item.metadata?.first_content_url
                                ? item.metadata.first_content_url.endsWith(
                                    ".glb",
                                  ) ||
                                  item.metadata.first_content_url.endsWith(
                                    ".mp4",
                                  ) ||
                                  item.metadata.first_content_url.endsWith(
                                    ".mov",
                                  )
                                  ? Images.XENCAP_MOBILE2 // Use logo for glb, mp4, and mov
                                  : isSafariBrowser() &&
                                      (item.metadata.first_content_url.endsWith(
                                        ".heic",
                                      ) ||
                                        item.metadata.first_content_url.endsWith(
                                          ".heif",
                                        ))
                                    ? item.metadata.first_content_url // Use actual URL for HEIC and HEIF in Safari
                                    : item.metadata.first_content_url // Use actual URL for other file types
                                : Images.XENCAP_MOBILE2 // Use default image if no first_content_url
                            }
                            alt="item"
                            style={{
                              borderRadius: "50%",
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={8}
                          container
                          direction="column"
                          justifyContent="center"
                          gap="6px"
                        >
                          <Typography
                            sx={{
                              fontFamily: "OpenSans",
                              fontWeight: "600",
                              fontSize: "14px",
                            }}
                            variant="h5"
                          >
                            {item.name}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: "OpenSans",
                              fontWeight: "400",
                              fontSize: "14px",
                            }}
                          >
                            Added by: You
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: "OpenSans",
                              fontWeight: "600",
                              fontSize: "12px",
                              color: "#9C9C9C",
                            }}
                          >
                            {new Date().toLocaleDateString()} |{" "}
                            {String(new Date().getHours()).padStart(2, "0")}:
                            {String(new Date().getMinutes()).padStart(2, "0")}{" "}
                            PM
                          </Typography>
                        </Grid>
                        <Grid item sx={{ marginLeft: "auto" }}>
                          <IconButton
                            sx={{ background: "#F7F7FB" }}
                            // @ts-expect-error
                            onClick={() => handleDeleteModal(item.model_id)}
                          >
                            <img
                              src={Images.DELETE_ICON}
                              alt="Delete"
                              style={{ width: "20px", height: "20px" }}
                            />
                          </IconButton>
                          {cartItemsDelete && (
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
                                      style={{
                                        width: 25,
                                        height: 25,
                                        color: "red",
                                      }}
                                    />
                                  </Box>
                                  <Typography
                                    sx={{ fontWeight: "700", fontSize: "20px" }}
                                    gutterBottom
                                  >
                                    Are you sure you want to delete this model
                                    from cart?
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="#484848"
                                    gutterBottom
                                  >
                                    By clicking Delete, the item will be removed
                                    from cart.
                                  </Typography>
                                  <Box
                                    component="div"
                                    sx={{ display: "flex", gap: "16px" }}
                                  >
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      fullWidth
                                      onClick={() => setCartItemsDelete(false)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      variant="contained"
                                      fullWidth
                                      onClick={() =>
                                        handleDeleteCartItem(deleteId)
                                      }
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
                    ))}
                  </Grid>
                )}
              </Grid>
            </Grid>

            {/* Promo code and Billing Details */}
            <Grid item xs={12} md={5} sx={{ paddingLeft: { xs: 0, md: 2 } }}>
              <Grid
                container
                direction="column"
                gap={3}
                sx={{ display: "block", height: "400px" }}
              >
                {userData?.data?.referredby_code ? (
                  <Grid
                    item
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "6px",
                      padding: "15px",
                      gap: "10px",
                      marginBottom: "1rem",
                    }}
                  >
                    <Box
                      component="div"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                          fontFamily: "OpenSans",
                          fontWeight: "600",
                          fontSize: "14px",
                          marginLeft: "5px",
                        }}
                      >
                        Apply Referral Code
                      </Typography>
                      <Switch
                        checked={promoApplied}
                        onChange={handleSwitchChange}
                        color="primary"
                        sx={{
                          marginTop: "-6px",
                        }}
                      />
                    </Box>
                    {/* <TextField
                      value={promoCode}
                      onChange={handlePromoCodeChange}
                      variant="outlined"
                      fullWidth
                      placeholder="Enter Referral Code"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {promoCode === userData?.data?.referredby_code && (
                              <CheckCircleOutline style={{ color: "green" }} />
                            )}
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          height: "45px",
                          backgroundColor: "transparent",
                          "&:hover": {
                            backgroundColor: "transparent",
                          },
                          "&.Mui-focused": {
                            backgroundColor: "transparent",
                          },
                        },
                      }}
                      style={{ marginBottom: "10px" }}
                    /> */}
                  </Grid>
                ) : (
                  ""
                )}

                <Grid
                  item
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "6px",
                    padding: "15px",
                    minHeight: "435px",
                  }}
                >
                  <Typography
                    gutterBottom
                    sx={{
                      borderBottom: "1px solid #F5F5F5",
                      fontFamily: "OpenSans",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    Pricing Details
                  </Typography>
                  <Grid
                    container
                    justifyContent="space-between"
                    sx={{ display: "flex" }}
                  >
                    <Grid
                      item
                      xs={6}
                      sx={{
                        padding: "10px",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          borderBottom: "1px solid #F5F5F5",
                          fontFamily: "OpenSans",
                          fontWeight: 400,
                          fontSize: "14px",
                        }}
                      >
                        Net Price
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      sx={{
                        padding: "10px",
                        textAlign: "right",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          borderBottom: "1px solid #F5F5F5",
                          fontFamily: "OpenSans",
                          fontWeight: 400,
                          fontSize: "14px",
                        }}
                      >
                        INR {netAmount}
                      </Typography>
                    </Grid>
                    {promoApplied ? (
                      <>
                        <Grid
                          item
                          xs={6}
                          sx={{
                            borderBottom: "1px solid #F5F5F5",
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              fontFamily: "OpenSans",
                              fontWeight: 400,
                              fontSize: "14px",
                            }}
                          >
                            Referral Code Discount
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          sx={{
                            borderBottom: "1px solid #F5F5F5",
                            padding: "10px",
                            textAlign: "right",
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              fontFamily: "OpenSans",
                              fontWeight: 400,
                              fontSize: "14px",
                            }}
                          >
                            INR {discount}
                          </Typography>
                        </Grid>
                      </>
                    ) : (
                      ""
                    )}

                    <Grid
                      item
                      xs={6}
                      sx={{
                        borderBottom: "1px solid #F5F5F5",
                        padding: "10px",
                        display: "flex",
                        alignItems: "flex-end",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          borderBottom: "1px solid #F5F5F5",
                          fontFamily: "OpenSans",
                          fontWeight: 600,
                          fontSize: "14px",
                        }}
                      >
                        Total Amount
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      sx={{
                        padding: "10px",
                        textAlign: "right",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: "OpenSans",
                          fontWeight: 600,
                          fontSize: "14px",
                        }}
                      >
                        INR {totalAmount}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    item
                    justifyContent="flex-end"
                    sx={{ marginTop: "auto", padding: "10px" }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      id="rzp-button1"
                      onClick={async () => {
                        await openRazorpayCheckout();
                      }}
                      style={{
                        fontFamily: "OpenSans",
                        fontWeight: 600,
                        fontSize: "14px",
                        textTransform: "none",
                        marginTop: "194px",
                      }}
                    >
                      Proceed to Pay
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </Grid>
  );
}

export default Cart;
