import { useAppDispatch } from "@hooks/redux-hooks";
import CircularProgress from "@mui/material/CircularProgress";
import { appleLogin } from "@slices/authSlice";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RootState } from "src/store";

const AppleLogin = () => {
  const [params] = useSearchParams();
  const [code] = useState(params.get("code"));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { status } = useSelector((state: RootState) => state.auth);

  const handleAppleLogin = async () => {
    await dispatch(appleLogin(code as string)).catch(() => {});
    navigate("/");
  };

  useEffect(() => {
    handleAppleLogin();
  }, []);

  return (
    <div>{status === "loading" ? <CircularProgress size={24} /> : ""} </div>
  );
};

export default AppleLogin;
