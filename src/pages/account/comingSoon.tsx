import { Grid, Paper } from "@mui/material";

function ComingSoonView() {
  return (
    <Grid container sx={{ padding: "10px", height: "100%", widht: "100%" }}>
      <Paper
        style={{
          padding: 30,
          borderRadius: 16,
          height: "94%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "OpenSans",
          fontSize: "24px",
          fontWeight: 600,
        }}
      >
        Coming soon...
      </Paper>
    </Grid>
  );
}

export default ComingSoonView;
