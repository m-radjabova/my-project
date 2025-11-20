import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface FormFieldProps {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  error?: string;
}

function FormField({ icon, label, children, error }: FormFieldProps) {
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5, mt: 2 }}>
        {icon}
        <Typography sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>
          {label}
        </Typography>
      </Box>
      {children}
      {error && (
        <Typography sx={{ color: "#ef4444", fontSize: "0.8rem", mt: 1, ml: 0.5 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default FormField;