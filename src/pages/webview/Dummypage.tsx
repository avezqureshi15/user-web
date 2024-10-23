import React from "react";
import { useLocation } from "react-router-dom";

const DummyPage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const status = params.get("status");

  return (
    <div>
      <h1>Success Page</h1>
      <p>Status: {status}</p>
    </div>
  );
};

export default DummyPage;
