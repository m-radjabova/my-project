import { Navigate } from "react-router-dom";
import useContextPro from "../hooks/useContextPro";
import { Box, Container, LinearProgress, Typography } from "@mui/material";

interface Props {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: Props) {
  const { state: { shop, isLoading } } = useContextPro();

  if (isLoading) {
    return <Container sx={{ py: 4 }}>
            <Box sx={{ width: "100%" }}>
              <LinearProgress sx={{ height: 3, borderRadius: 2 }} />
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h6" color="textSecondary">
                  Loading...
                </Typography>
              </Box>
            </Box>
          </Container>
  }

  if (!shop) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;