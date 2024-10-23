interface StepIndicatorProps {
  totalSteps: number;
  activeStep: number;
  onClickStep: (stepIndex: number) => void; // Define onClickStep callback function
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  totalSteps,
  activeStep,
  onClickStep,
}: StepIndicatorProps) => {
  const handleStepClick = (stepIndex: number) => {
    onClickStep(stepIndex); // Call the onClickStep callback with the clicked step index
  };
  return (
    <div className="stepIndicator">
      {[...Array(totalSteps)].map((_, index) => (
        <div
          key={index}
          className={index === activeStep ? "activeStep" : "inactiveStep"}
          onClick={() => handleStepClick(index)}
        ></div>
      ))}
      <style>{`
        /* Step indicator styles */
        .stepIndicator {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: flex-start;
          padding: 0px;
          gap: 8px;
          width: 62px;
          height: 8px;
        }

        .stepIndicator > div {
          flex: none;
          flex-grow: 0;
        }

        .activeStep {
          width: 30px;
          height: 8px;
          background: #2e368e;
          border-radius: 10px;
        }

        .inactiveStep {
          width: 8px;
          height: 8px;
          background: #2e368e;
          opacity: 0.4;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default StepIndicator;
