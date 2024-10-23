// import {
//   AppBar,
//   Badge,
//   Button,
//   Checkbox,
//   Tab,
//   Tabs,
//   Toolbar,
//   Typography,
// } from "@mui/material";
// import { useState } from "react";

// function UploadFiles() {
//   const [value, setValue] = useState(0);
//   const [imageFiles, setImageFiles] = useState([]);
//   const [dragOver, setDragOver] = useState(false); // State to track if drag over

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const handleDrop = (event) => {
//     event.preventDefault();
//     setDragOver(false); // Reset drag over state
//     const files = Array.from(event.dataTransfer.files);
//     const imageFilesArray = files
//       .filter((file) => file.type.startsWith("image/"))
//       .map((file) => ({ file, selected: false }));
//     setImageFiles((prevFiles) => [...prevFiles, ...imageFilesArray]);
//   };

//   const handleFileUpload = (event) => {
//     const files = Array.from(event.target.files);
//     const imageFilesArray = files
//       .filter((file) => file.type.startsWith("image/"))
//       .map((file) => ({ file, selected: false }));
//     setImageFiles((prevFiles) => [...prevFiles, ...imageFilesArray]);
//   };

//   const handleDragOver = (event) => {
//     event.preventDefault();
//     setDragOver(true); // Set drag over state
//   };

//   const handleImageClick = (index) => {
//     setImageFiles((prevFiles) =>
//       prevFiles.map((file, i) =>
//         i === index ? { ...file, selected: !file.selected } : file
//       )
//     );
//   };

//   const handleCheckboxChange = (index) => {
//     setImageFiles((prevFiles) =>
//       prevFiles.map((file, i) =>
//         i === index ? { ...file, selected: !file.selected } : file
//       )
//     );
//   };

//   // Calculate the count of selected images
//   const selectedCount = imageFiles.filter((file) => file.selected).length;

//   return (
//     <div
//       style={{ display: "flex", flexDirection: "column", height: "100vh" }}
//       onDrop={handleDrop}
//       onDragOver={handleDragOver}
//     >
//       <AppBar position="static">
//         <Toolbar>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//             XenCapture
//           </Typography>
//           <Badge badgeContent={selectedCount} color="error">
//             <Typography variant="body2">Selected</Typography>
//           </Badge>
//         </Toolbar>
//       </AppBar>
//       <Tabs value={value} onChange={handleChange}>
//         <Tab label="IMAGES" />
//         <Tab label="VIDEOS" />
//         <Tab label="3D MODEL" />
//       </Tabs>
//       <div
//         style={{
//           flex: 1,
//           overflowY: "auto",
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
//           gap: "10px",
//           padding: "10px",
//           alignItems: "start",
//           justifyContent: "start",
//         }}
//       >
//         {dragOver && (
//           <Typography variant="h6" style={{ color: "#999" }}>
//             Drop files here
//           </Typography>
//         )}
//         {imageFiles.map((file, index) => (
//           <div
//             key={index}
//             style={{ position: "relative", width: "100%", height: "150px" }}
//             onClick={() => handleImageClick(index)}
//           >
//             <div
//               style={{
//                 position: "absolute",
//                 top: "10px",
//                 right: "10px",
//                 zIndex: "1",
//                 backgroundColor: "white",
//                 borderRadius: "4px",
//                 padding: "0px",
//               }}
//             >
//               <Checkbox
//                 checked={file.selected}
//                 onChange={() => handleCheckboxChange(index)}
//                 onClick={(event) => event.stopPropagation()}
//                 style={{ color: "black", margin: "0px",padding:"2px",zIndex:'2' }}
//               />
//             </div>
//             <img
//               src={URL.createObjectURL(file.file)}
//               alt={`Uploaded ${file.file.name}`}
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 objectFit: "cover",
//                 borderRadius: "8px",
//               }}
//             />
//           </div>
//         ))}
//       </div>
//       <div
//         style={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}
//       >
//         <Button
//           variant="contained"
//           color="primary"
//           style={{ marginRight: "10px" }}
//         >
//           Button 1
//         </Button>
//         <Button variant="contained" color="secondary">
//           Button 2
//         </Button>
//       </div>
//     </div>
//   );
// }

// export default UploadFiles;
