import { useState } from "react";
import AuthBackground from "./auth-bg";
import CreateAccountIndividual from "./create-account-induvidual";
import { AccountType } from "./create-account-select";
//@ts-expect-error
import CreateAccountTeam from "./create-account-team";
import OTPVerification from "./otp-verification";
import { useNavigate } from "react-router-dom";
enum ProfileTitle {
  Individual = "Individual",
  Team = "Team",
}
function CreateAccount() {
  const [activeStep, setActiveStep] = useState(0);
  //@ts-expect-error
  const [selectedAccountType, setSelectedAccountType] =
    useState<AccountType | null>(null);
  const navigate = useNavigate();
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  // const handleSelect = (selectedAccountType: AccountType) => {
  //   setSelectedAccountType(selectedAccountType);
  // };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => {
      if (prevActiveStep != 0) {
        prevActiveStep - 1;
      } else {
        navigate("/login");
      }
      return prevActiveStep;
    });
  };

  const handleEditClick = () => {
    setSelectedAccountType({
      profileTitle: ProfileTitle.Individual,
      profileSubtitle: "",
    });
    setActiveStep(0);
  };

  let content;
  switch (activeStep) {
    // case 1:
    //   content = (
    //     <CreateAccountSelect onNext={handleNext} onSelect={handleSelect} />
    //   );
    //   break;
    case 0:
      // if (selectedAccountType?.profileTitle === "Individual") {
      content = (
        <CreateAccountIndividual onNext={handleNext} onBack={handleBack} />
      );
      // } else {
      // Render a different component for other account types
      // content = <CreateAccountTeam />;
      // }
      break;
    case 1:
      content = <OTPVerification onEditClick={handleEditClick} />;
      break;

    default:
      content = null;
  }

  return <AuthBackground>{content}</AuthBackground>;
}

export default CreateAccount;
