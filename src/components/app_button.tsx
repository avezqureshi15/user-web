import { Button, ButtonProps, CircularProgress } from "@mui/material";

interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
}

const AppButton: React.FC<CustomButtonProps> = ({
  loading,
  children,
  ...props
}: CustomButtonProps) => {
  return (
    <Button {...props} disabled={loading || props.disabled}>
      {loading ? <CircularProgress size={24} /> : children}
    </Button>
  );
};

export default AppButton;
