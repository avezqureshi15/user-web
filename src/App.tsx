import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import DefaultLayout from "./layouts/DefaultLayout";
import ProtectedLayout from "./layouts/ProtetedLayout";
import DashboardPage from "./pages/account/dashboard-page";
import CreateAccount from "./pages/auth/create-account";
import CreateAccountTeam from "./pages/auth/create-account-team";
import ResetPassword from "./pages/auth/forgotPassword";
import Login from "./pages/auth/login";
import OTPVerification from "./pages/auth/otp-verification";
import { Home } from "./pages/home/Home";
// import Onboarding from "./pages/onboarding/onboarding";
import UploadFiles from "./pages/upload-files/UploadFiles";
import Cart from "./pages/home/Cart";
import Savemodel from "./pages/webview/Savemodel";
import ViewModelPage from "./pages/view-models/viewModelPage";
import { Toaster } from "sonner";
import AppleLogin from "./pages/auth/appleLogin";
import { GlobalStyles } from "./pages/account/styles/helpCenterStyledComponents";
import DummyPage from "./pages/webview/Dummypage";
import WebView from "./pages/webview/webview";
function App() {
  return (
    <>
      <GlobalStyles />
      <ToastContainer style={{ zIndex: 9999 }} />
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<CreateAccount />} />
          <Route path="/signup/team" element={<CreateAccountTeam />} />
          <Route path="/verify" element={<OTPVerification />} />
          {/* <Route path="/onboarding" element={<Onboarding />} /> */}
          <Route path="/forgotPassword" element={<ResetPassword />} />
          <Route path="/apple-login" element={<AppleLogin />} />
          <Route path="/preview-model" element={<WebView />} />
          <Route path="/success-page" element={<DummyPage />} />
          <Route path="/webview" element={<Savemodel />} />
        </Route>
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<DashboardPage />} />
          <Route path="/upload" element={<UploadFiles />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/view-model" element={<ViewModelPage />} />
        </Route>
      </Routes>
      <Toaster expand position="top-right" />
    </>
  );
}

export default App;
