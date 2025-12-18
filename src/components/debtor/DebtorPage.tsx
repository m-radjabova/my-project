import { useParams } from "react-router-dom";
import useDebtor from "../../hooks/useDebtor";
import {
  Container,
  Paper,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Button,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaReceipt,
  FaUser,
  FaPlus,
  FaPhone,
  FaExclamationTriangle,
  FaHistory,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { formatDateTime, getInitials, getStatusInfo } from "../../utils";
import StatisticsCards from "./StatisticsCards";
import { useState } from "react";
import DebtForm from "./DebtForm";
import RepaymentForm from "./RepaymentForm";

function DebtorPage() {
  const { id } = useParams();
  const { debtor, debts, debtorLoading, debtsLoading, addDebtToDebtor, debtRepayment } = useDebtor(Number(id));
  const [open, setOpen] = useState(false);
  const [openRepayment, setOpenRepayment] = useState(false);
  

  if (debtorLoading || debtsLoading) {
    return (
      <Container sx={{ py: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseRepayment = () => {
    setOpenRepayment(false);
  };

  if (!debtor) {
    return (
      <Container sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <FaExclamationTriangle size={48} color="error" />
          <Typography variant="h5" color="error" gutterBottom>
            Debtor not found
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            The debtor you are looking for does not exist or has been removed.
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            startIcon={<FaArrowLeft />}
          >
            Back to Debtors
          </Button>
        </Paper>
      </Container>
    );
  }


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalDebt = debtor.total_debt || 0;
  const pendingDebt = debts
    .filter((d) => !d.status)
    .reduce((sum, debt) => sum + (debt.amount || 0), 0);
  const paidDebt = debts
    .filter((d) => d.status)
    .reduce((sum, debt) => sum + (debt.amount || 0), 0);

  const handleAddDebt = (amount: number) => {
    addDebtToDebtor({ amount });
  };

  const handleRepayment = (amount: number) => {
    debtRepayment({ amount });
  };


  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          component={Link}
          to="/"
          variant="outlined"
          startIcon={<FaArrowLeft />}
          sx={{ mb: 2 }}
        >
          Back to Debtors
        </Button>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            bgcolor: "primary.main",
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "white",
                  color: "primary.main",
                  fontSize: "2rem",
                  fontWeight: "bold",
                }}
              >
                {getInitials(debtor.full_name)}
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {debtor.full_name}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Chip
                    icon={<FaUser />}
                    label={`ID: #${debtor.debtor_id}`}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: "medium",
                    }}
                  />
                  <Chip
                    icon={<FaPhone />}
                    label={debtor.phone_number}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: "medium",
                    }}
                  />
                  <Chip
                    icon={<FaMoneyBillWave />}
                    label={`Total: ${formatCurrency(debtor.total_debt || 0)}`}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Tooltip title="Debt Repayment">
                <Button
                  variant="contained"
                  startIcon={<FaPlus />}
                  onClick={() => setOpenRepayment(true)}
                  sx={{
                    bgcolor: "white",
                    color: "primary.main",
                    "&:hover": { bgcolor: "grey.100" },
                    fontWeight: "bold",
                  }}
                >
                  Debt Repayment
                </Button>
              </Tooltip>
              <Tooltip title="Add New Debt">
                <Button
                  variant="contained"
                  startIcon={<FaPlus />}
                  onClick={() => setOpen(true)}
                  sx={{
                    bgcolor: "white",
                    color: "primary.main",
                    "&:hover": { bgcolor: "grey.100" },
                    fontWeight: "bold",
                  }}
                >
                  Add Debt
                </Button>
              </Tooltip>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Statistics Cards */}
      <StatisticsCards formatCurrency={formatCurrency} totalDebt={totalDebt} pendingDebt={pendingDebt} paidDebt={paidDebt} debts={debts}  />

      <Paper elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
          <Box >
            <Typography
              variant="h5"
              fontWeight="bold"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <FaReceipt />
              Debt Records
            </Typography>
            <Typography variant="body2" color="textSecondary">
              All debt transactions for {debtor.full_name}
            </Typography>
          </Box>
          <Tooltip title="Payment History">
            <Button
              variant="contained"
              startIcon={<FaHistory />}
              sx={{
                bgcolor: "white",
                color: "primary.main",
                "&:hover": { bgcolor: "grey.100" },
                fontWeight: "bold",
              }}
            >
              Payment History
            </Button>
          </Tooltip>
        </Box>

        {debts.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "grey.50" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", width: "80px" }}>
                    #
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <FaCalendarAlt />
                      Date & Time
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <FaMoneyBillWave />
                      Amount
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Case quantity
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {debts.map((debt, index) => {
                  const statusInfo = getStatusInfo(debt.status);

                  return (
                    <TableRow
                      key={debt.debt_id}
                      sx={{
                        "&:hover": { bgcolor: "grey.50" },
                        "&:last-child td": { border: 0 },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          {formatDateTime(debt.date_time)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={formatCurrency(debt.amount || 0)}
                          color="primary"
                          variant="outlined"
                          sx={{ fontWeight: "bold", fontSize: "0.9rem" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={statusInfo.icon}
                          label={statusInfo.text}
                          color={statusInfo.color}
                          variant="filled"
                          sx={{ fontWeight: "medium", minWidth: "100px" }}
                        />
                      </TableCell>
                      <TableCell align="center"></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ p: 8, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <FaReceipt  size={64} color="#9e9e9e" />
            <Typography
              variant="h6"
              color="textSecondary"
              sx={{ mt: 2, mb: 1 }}
            >
              No debt records found
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              This debtor has no debt records yet.
            </Typography>
            <Button variant="contained" startIcon={<FaPlus />}>
              Add First Debt Record
            </Button>
          </Box>
        )}

        {debts.length > 0 && (
          <Box
            sx={{
              p: 2,
              bgcolor: "grey.50",
              borderTop: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="body2" color="textSecondary">
              Showing <strong>{debts.length}</strong> debt record
              {debts.length !== 1 ? "s" : ""}
            </Typography>
          </Box>
        )}
      </Paper>
      <DebtForm open={open} handleClose={handleClose} onSubmit={handleAddDebt} />
      <RepaymentForm open={openRepayment} handleClose={handleCloseRepayment} onSubmit={handleRepayment} />
    </Container>
  );
}

export default DebtorPage;