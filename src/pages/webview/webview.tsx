import { useSearchParams } from "react-router-dom";

const WebView = () => {
  const [sv] = useSearchParams();
  const urlData = sv.get("data") as string;
  const decData = atob(urlData);
  console.log(decData);
  const modelUrl = decData;

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        margin: "auto",
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* @ts-ignore */}
      <model-viewer
        src={modelUrl}
        alt="A 3D model"
        // ar
        // ar-modes="scene-viewer quick-look"
        auto-rotate
        camera-controls
        style={{ width: "100%", height: "100%" }}
      >
        {/* @ts-ignore */}
      </model-viewer>
    </div>
  );
};

export default WebView;
