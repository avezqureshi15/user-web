import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/redux-hooks";

const DefaultLayout = () => {
  const access_token = useAppSelector((state) => state.auth.access_token);
  const local_access_token = localStorage.getItem("accessToken");
  if (access_token && local_access_token) {
    return <Navigate replace to={"/"} />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default DefaultLayout;
