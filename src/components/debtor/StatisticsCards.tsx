import { Avatar, Box, Card, CardContent, LinearProgress, Typography } from "@mui/material";
import { FaCheckCircle, FaClock, FaMoneyBillWave, FaReceipt, } from "react-icons/fa";
import type { Debt } from "../../types/types";

interface Props {
    formatCurrency: (amount: number) => string;
    totalDebt: number;
    pendingDebt: number;
    paidDebt: number;
    debts : Debt[]
}
function StatisticsCards( { formatCurrency, totalDebt, pendingDebt, paidDebt, debts }: Props ) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
            <Card sx={{ flex: "1 1 250px", minWidth: "250px", borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: "primary.light" }}>
                    <FaMoneyBillWave />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" color="textSecondary">
                      Total Debt
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      {formatCurrency(totalDebt)}
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={100}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </CardContent>
            </Card>
    
            <Card sx={{ flex: "1 1 250px", minWidth: "250px", borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: "warning.light" }}>
                    <FaClock />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" color="textSecondary">
                      Pending
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="warning.main">
                      {formatCurrency(pendingDebt)}
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={totalDebt > 0 ? (pendingDebt / totalDebt) * 100 : 0}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "warning.main",
                    },
                  }}
                />
              </CardContent>
            </Card>
    
            {/* Paid Debt Card */}
            <Card sx={{ flex: "1 1 250px", minWidth: "250px", borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: "success.light" }}>
                    <FaCheckCircle />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" color="textSecondary">
                      Paid
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      {formatCurrency(paidDebt)}
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={totalDebt > 0 ? (paidDebt / totalDebt) * 100 : 0}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "success.main",
                    },
                  }}
                />
              </CardContent>
            </Card>
    
            {/* Debts Count Card */}
            <Card sx={{ flex: "1 1 250px", minWidth: "250px", borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: "info.light" }}>
                    <FaReceipt />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" color="textSecondary">
                      Total Records
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="info.main">
                      {debts.length}
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "info.main",
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Box>
  )
}

export default StatisticsCards