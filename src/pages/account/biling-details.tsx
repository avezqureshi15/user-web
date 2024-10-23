import * as React from "react";
import {
  Box,
  Tab,
  Tabs,
  Grid,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import AccountHeader from "@components/accountHeader";
import { viewInvoiceDate } from "@utils/utility";
import { GridColDef } from "@mui/x-data-grid";
import TransactionTable from "./payment-history-table";
import { Images } from "@constants/imageConstants";
import {
  DropDownFilter,
  ViewInvoiceDetails,
  BillingFrom,
  PaginationBar,
  DropDownIncoiveLimit,
} from "./billing-components";
import AppButton from "@components/app_button";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "src/store";
import { getInvoiceDetails, downloadInvoice } from "@slices/paymentSlice";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import JSZip from "jszip";

export default function BillingDetails() {
  const [tabValue, setTabValue] = React.useState(0);
  const [limit, setLimit] = React.useState(5);
  const [viewInvoice, setViewInvoice] = React.useState(false);
  const [invoiceDetails, setInvoiceDetails] = React.useState(null);
  const [isBillingAddressEditable, setIsBillingAddressEditable] =
    React.useState(false);
  const dispatch = useDispatch();
  const { invoice } = useSelector((state: RootState) => state.payment);
  const ref = React.useRef<HTMLInputElement>(null) as any;
  const [selectedDateRange, setSelectedDateRange] = useState<string>("");
  const [downloadingAll, setDownloadingAll] = useState(false);

  useEffect(() => {
    dispatch(getInvoiceDetails() as any);
  }, [dispatch]);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);
    setTabValue(newValue);
  };

  useEffect(() => {
    setPageNo(0);
  }, [selectedDateRange, limit]);

  const handleDateRangeChange = (selectedDate: string) => {
    setSelectedDateRange(selectedDate);
  };

  const handleDownloadAll = async () => {
    toast.info("Your download will start in a few seconds.");

    try {
      setDownloadingAll(true);
      const zip = new JSZip();

      // Iterate over each invoice and download it
      for (const invoice of filteredInvoices) {
        const s3Url = await downloadInvoice(invoice.id);
        const response = await fetch(s3Url);
        if (!response.ok) {
          throw new Error("Failed to download all invoices.");
        }

        // Convert the response to an ArrayBuffer
        const content = await response.arrayBuffer();

        // Add the invoice file to the zip file
        zip.file(`invoice_${invoice.id}.pdf`, content);
      }

      // Generate the zip file asynchronously
      const zipBlob = await zip.generateAsync({ type: "blob" });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(zipBlob);

      // Create a link element and simulate a click to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = "all_invoices.zip";
      document.body.appendChild(link);
      link.click();

      // Clean up resources
      window.URL.revokeObjectURL(url);

      toast.success("All invoices are being downloaded.");
    } catch (error) {
      toast.error("Failed to download all invoices.");
    } finally {
      setDownloadingAll(false);
    }
  };

  // Filter invoices based on the selected date range
  const filteredInvoices = useMemo(() => {
    const today = new Date();

    if (selectedDateRange === "This Week") {
      // Filter invoices for this week
      const startOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay()),
      );
      return invoice.filter(
        (invoice: { created_at: string | number | Date }) => {
          const billingDate = new Date(invoice.created_at);
          return billingDate >= startOfWeek;
        },
      );
    } else if (selectedDateRange === "Last Week") {
      // Filter invoices for last week
      const startOfThisWeek = new Date(
        today.setDate(today.getDate() - today.getDay()),
      );
      const startOfLastWeek = new Date(today.setDate(today.getDate() - 7));
      const endOfLastWeek = new Date(
        startOfThisWeek.setDate(startOfThisWeek.getDate() - 1),
      );
      return invoice.filter(
        (invoice: { created_at: string | number | Date }) => {
          const billingDate = new Date(invoice.created_at);
          return billingDate >= startOfLastWeek && billingDate < endOfLastWeek;
        },
      );
    } else if (selectedDateRange === "Last 3 Months") {
      // Filter invoices for last 3 months
      const startOfThreeMonthsAgo = new Date(
        today.setMonth(today.getMonth() - 3),
      );
      return invoice.filter(
        (invoice: { created_at: string | number | Date }) => {
          const billingDate = new Date(invoice.created_at);
          return billingDate >= startOfThreeMonthsAgo;
        },
      );
    } else {
      // Filter invoices for all
      return invoice;
    }
  }, [invoice, selectedDateRange]);

  const columns: GridColDef[] = [
    {
      field: "_id",
      headerName: "ID",
      width: 300,
      headerClassName: "header",
      renderCell: (params) => (
        <div
          className="invoice_id"
          style={{
            cursor: "pointer",
            display: "flex",
            gap: 10,
            alignItems: "center",
            marginTop: "5px",
          }}
          onClick={() => {
            setInvoiceDetails(params.row);
            setViewInvoice(true);
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#EAEBF4",
              borderRadius: 50,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={Images.Invoice_Icon}
              alt="Invoice"
              style={{ width: 20, height: 20 }}
            />
          </div>
          <span
            className="invoice_id__text"
            style={{
              fontFamily: "OpenSans",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            #{params.row.invoice_no}
          </span>
        </div>
      ),
    },
    {
      field: "models",
      headerName: "Models",
      description: "This column has a value getter and is not sortable.",
      sortable: true,
      width: 200,
      headerClassName: "header",
      renderCell: (params) => {
        return (
          <span
            className="models"
            style={{
              fontFamily: "OpenSans",
              fontWeight: "400",
              fontSize: 14,
              // lineHeight: "21px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {params?.row?.cart?.length}
          </span>
        );
      },
    },
    {
      field: "billing_date",
      headerName: "Payment on",
      width: 300,
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
      field: "action",
      headerName: "Actions",
      sortable: false,
      width: 100,
      headerClassName: "header",
      renderCell: (params) => (
        <div
          onClick={async () => {
            const s3Url: any = await downloadInvoice(params?.row?.id);
            const response = await fetch(s3Url);
            const blob = await response.blob();
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = s3Url.split("invoices/")[1];
            link.click();
          }}
          className="pointer"
        >
          <img
            src={Images.DOWNLOAD_ICON}
            style={{ height: 15, width: 15, marginLeft: 8 }}
          />
        </div>
      ),
    },
  ];

  const handleEditClick = () => {
    setIsBillingAddressEditable((prev) => !prev);
    if (isBillingAddressEditable) ref.current.handleSave();
  };

  const [pageNo, setPageNo] = React.useState(0);
  // const totalPages = Math.ceil(filteredInvoices?.length / limit);
  return (
    <>
      {" "}
      <Paper
        style={{
          padding: 16,
          borderRadius: 16,
          width: "94%",
          marginTop: "4px",
          height: "95%",
        }}
      >
        <AccountHeader
          heading="Billing Details"
          isEditable={!tabValue}
          onEditClick={handleEditClick}
          editState={isBillingAddressEditable}
        />
        <Box component="div" sx={{ width: "100%" }}>
          <Box component="div" sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={handleChange}>
              <Tab
                label="Billing"
                sx={{
                  textTransform: "capitalize",
                }}
              />
              <Tab
                label="Payment History"
                sx={{
                  textTransform: "capitalize",
                }}
              />
            </Tabs>
          </Box>
        </Box>
        {!tabValue ? (
          <BillingFrom
            isBillingAddressEditable={isBillingAddressEditable}
            setIsBillingAddressEditable={setIsBillingAddressEditable}
            ref={ref}
          />
        ) : (
          <>
            <div
              style={{
                padding: "10px",
              }}
            >
              {invoiceDetails && (
                <ViewInvoiceDetails
                  selected_invoice={invoiceDetails}
                  setViewInvoice={setViewInvoice}
                  viewInvoice={viewInvoice}
                />
              )}
              <Box
                component="div"
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <DropDownFilter onDateRangeChange={handleDateRangeChange} />
                <Grid item xs={12} textAlign="right">
                  {filteredInvoices?.length > 1 ? (
                    <AppButton
                      variant="contained"
                      type="submit"
                      sx={{
                        width: "180px",
                        height: "52px",
                      }}
                      onClick={() => handleDownloadAll()}
                    >
                      <Typography
                        sx={{
                          fontWeight: 300,
                          textTransform: "none",
                          fontSize: "16px",
                          fontFamily: "OpenSans",
                          lineHeight: "20px",
                        }}
                      >
                        {downloadingAll ? "Processing..." : "Download All"}
                      </Typography>
                      {downloadingAll ? (
                        <div style={{ display: "flex" }}>
                          <CircularProgress
                            size={15}
                            sx={{
                              height: "15",
                              width: "15",
                              marginLeft: 2,
                              color: "#fff",
                            }}
                          />
                        </div>
                      ) : (
                        <img
                          src={Images.DownloadLight}
                          style={{ height: 15, width: 15, marginLeft: 8 }}
                        />
                      )}
                    </AppButton>
                  ) : (
                    ""
                  )}
                </Grid>
              </Box>
              {filteredInvoices?.length ? (
                <>
                  <TransactionTable
                    rows={filteredInvoices.slice(pageNo, pageNo + limit)}
                    columns={columns}
                  />
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
                    {filteredInvoices.length > limit && (
                      <>
                        <DropDownIncoiveLimit
                          limit={limit}
                          setLimit={setLimit}
                        />
                        <PaginationBar
                          limit={limit}
                          invoice_count={filteredInvoices.length}
                          setPageNo={setPageNo}
                        />
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div
                  className="billing_date"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      lineHeight: "21px",
                      fontFamily: "OpenSans",
                      fontWeight: 700,
                      fontSize: "14px",
                      margin: "1rem",
                      color: "#303030",
                      marginTop: "10rem",
                    }}
                  >
                    No Payments
                  </Typography>
                </div>
              )}
            </div>
          </>
        )}
      </Paper>
    </>
  );
}
