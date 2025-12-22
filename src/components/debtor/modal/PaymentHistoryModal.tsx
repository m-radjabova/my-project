import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Stack,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
} from "@mui/material";
import { green, blue, orange, grey } from "@mui/material/colors";

import {
  FaMoneyBillWave,
  FaCreditCard,
  FaCalendarAlt,
  FaReceipt,
  FaChartLine,
  FaWallet,
  FaTimes,
  FaHistory,
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";
import { formatCurrency, formatDateTime, getStatusIcon } from "../../../utils";
import type { DebtsHistory } from "../../../types/types";

interface Props {
  open: boolean;
  handleClose: () => void;
  debtsHistory: DebtsHistory[];
}

function PaymentHistoryModal({ open, handleClose, debtsHistory }: Props) {
  
  const calculateOverpaid = (debtAmount:  number, totalPaid: number) => {
    return totalPaid > debtAmount ? totalPaid - debtAmount : 0;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          pb: 3,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.25)',
                color: 'white',
                width: 56,
                height: 56,
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <FaHistory size={24} />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="700" sx={{ mb: 0.5 }}>
                Payment History
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.95 }}>
                Viewing {debtsHistory.length} debt record{debtsHistory.length !== 1 ? 's' :  ''}
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              color: 'white',
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.3)',
                transform: 'rotate(90deg)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <FaTimes size={18} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: '#f8f9fc', p: 3 }}>
        {debtsHistory.length === 0 ? (
          <Box
            sx={{
              py: 8,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                bgcolor: '#f5f5f5',
                borderRadius: '50%',
                width: 100,
                height: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <FaHistory size={48} color="#9e9e9e" />
            </Box>
            <Typography variant="h6" fontWeight="600" color="text.primary">
              No Payment History
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ maxWidth: 400 }}>
              There are no debt records with payment history available yet.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={3}>
            {debtsHistory.map((debt) => {
              // ✅ Backend'dan kelayotgan qiymatlarni ishlating
              const totalPaid = debt.total_paid; // ✅ Backenddan
              const remaining = debt.remaining;   // ✅ Backenddan
              const overpaid = calculateOverpaid(debt.amount, totalPaid);

              // Progress percentage
              const paidPercentage = (totalPaid / debt.amount) * 100;

              // Qarz to'langan yoki overpaid
              const isFullyPaid = remaining === 0;

              return (
                <Card
                  key={debt.debt_id}
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <CardHeader
                    sx={{
                      bgcolor: isFullyPaid ? green[50] : remaining > 0 ? orange[50] : blue[50],
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      pb: 2,
                    }}
                    avatar={
                      <Avatar
                        sx={{
                          bgcolor: isFullyPaid
                            ? green[100]
                            : remaining > 0
                            ? orange[100]
                            : blue[100],
                          color: isFullyPaid
                            ? green[700]
                            : remaining > 0
                            ? orange[700]
                            : blue[700],
                          width: 48,
                          height: 48,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}
                      >
                        {isFullyPaid ? (
                          <FaCheckCircle size={24} />
                        ) : (
                          <FaReceipt size={24} />
                        )}
                      </Avatar>
                    }
                    title={
                      <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                        <Typography variant="h6" fontWeight="700">
                          Debt #{debt.debt_id}
                        </Typography>
                        <Chip
                          icon={getStatusIcon(debt.status, remaining)}
                          label={
                            overpaid > 0
                              ? `Overpaid (Return ${formatCurrency(overpaid)})`
                              : remaining > 0
                              ? `Pending:  ${formatCurrency(remaining)}`
                              : 'Fully Paid'
                          }
                          size="small"
                          sx={{
                            bgcolor: overpaid > 0
                              ? blue[100]
                              : remaining > 0
                              ? orange[100]
                              : green[100],
                            color:  overpaid > 0
                              ? blue[700]
                              : remaining > 0
                              ? orange[700]
                              : green[700],
                            fontWeight: 600,
                            height: 28,
                          }}
                          variant="filled"
                        />
                      </Box>
                    }
                    subheader={
                      <Box display="flex" alignItems="center" gap={1.5} mt={1.5} flexWrap="wrap">
                        <Chip
                          icon={<FaCalendarAlt size={12} style={{ marginLeft: 4 }} />}
                          label={formatDateTime(debt.date_time)}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                        <Chip
                          icon={<FaFileInvoiceDollar size={12} style={{ marginLeft: 4 }} />}
                          label={`Debt: ${formatCurrency(debt.amount)} | Paid: ${formatCurrency(totalPaid)}`}
                          size="small"
                          color="primary"
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>
                    }
                  />

                  <CardContent sx={{ p: 3 }}>
                    {/* Payment Progress */}
                    <Box mb={3}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1.5}
                      >
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          color="text.primary"
                          display="flex"
                          alignItems="center"
                        >
                          <FaChartLine style={{ marginRight: 8, fontSize: 14 }} />
                          Payment Progress
                        </Typography>
                        <Chip
                          label={`${Math.min(paidPercentage, 100).toFixed(1)}%`}
                          size="small"
                          sx={{
                            bgcolor: overpaid > 0
                              ? blue[100]
                              : isFullyPaid
                              ?  green[100]
                              :  paidPercentage > 50
                              ? blue[100]
                              : orange[100],
                            color:  overpaid > 0
                              ? blue[800]
                              : isFullyPaid
                              ?  green[800]
                              :  paidPercentage > 50
                              ? blue[800]
                              : orange[800],
                            fontWeight: 700,
                          }}
                        />
                      </Box>

                      {/* Progress Bar */}
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(paidPercentage, 100)}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: grey[200],
                          '& .MuiLinearProgress-bar': {
                            background: overpaid > 0
                              ? `linear-gradient(90deg, ${blue[400]}, ${blue[600]})`
                              : isFullyPaid
                              ?  `linear-gradient(90deg, ${green[400]}, ${green[600]})`
                              : paidPercentage > 50
                              ? `linear-gradient(90deg, ${blue[400]}, ${blue[600]})`
                              : `linear-gradient(90deg, ${orange[400]}, ${orange[600]})`,
                            borderRadius: 5,
                          },
                        }}
                      />

                      {/* Amount Flow:  Debt → Paid → Overpaid/Remaining */}
                      <Box display="flex" justifyContent="space-between" mt={2} gap={2} flexWrap="wrap" alignItems="center">
                        {/* Original Debt */}
                        <Box flex={1} minWidth="100px">
                          <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 0.5 }}>
                            Original Debt
                          </Typography>
                          <Typography variant="body2" fontWeight="700" color="text.primary">
                            {formatCurrency(debt.amount)}
                          </Typography>
                        </Box>

                        <FaArrowRight size={14} style={{ color: grey[400] }} />

                        {/* Total Paid */}
                        <Box flex={1} minWidth="100px">
                          <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 0.5 }}>
                            Total Paid
                          </Typography>
                          <Typography variant="body2" fontWeight="700" color="success.main">
                            {formatCurrency(totalPaid)}
                          </Typography>
                        </Box>

                        <FaArrowRight size={14} style={{ color: grey[400] }} />

                        {/* Overpaid or Remaining */}
                        <Box flex={1} minWidth="100px">
                          {overpaid > 0 ?  (
                            <>
                              <Typography variant="caption" color="textSecondary" display="block" sx={{ mb:  0.5 }}>
                                To Be Returned
                              </Typography>
                              <Typography
                                variant="body2"
                                fontWeight="700"
                                sx={{
                                  background: `linear-gradient(135deg, ${blue[400]}, ${blue[600]})`,
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                }}
                              >
                                {formatCurrency(overpaid)}
                              </Typography>
                            </>
                          ) : remaining > 0 ? (
                            <>
                              <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 0.5 }}>
                                Remaining
                              </Typography>
                              <Typography variant="body2" fontWeight="700" color="error.main">
                                {formatCurrency(remaining)}
                              </Typography>
                            </>
                          ) : (
                            <>
                              <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 0.5 }}>
                                Status
                              </Typography>
                              <Typography variant="body2" fontWeight="700" color="success.main">
                                ✓ Fully Paid
                              </Typography>
                            </>
                          )}
                        </Box>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2.5 }}>
                      <Chip
                        icon={<FaCreditCard size={14} />}
                        label="Payments"
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Divider>

                    {/* Payments List */}
                    {debt.payments && debt.payments.length > 0 ? (
                      <>
                        <Box mb={2} display="flex" alignItems="center" justifyContent="space-between">
                          <Typography
                            variant="subtitle2"
                            fontWeight="700"
                            display="flex"
                            alignItems="center"
                            color="text.primary"
                          >
                            <Box
                              sx={{
                                bgcolor: green[100],
                                color:  green[700],
                                p: 0.75,
                                borderRadius: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                mr: 1,
                              }}
                            >
                              <FaCreditCard size={14} />
                            </Box>
                            Payment Records
                          </Typography>
                          <Chip
                            label={`${debt.payments.length} payment${debt.payments.length !== 1 ? 's' :  ''}`}
                            size="small"
                            color="primary"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>

                        <List dense disablePadding>
                          {debt.payments. map((payment, index) => (
                            <ListItem
                              key={payment.payment_history_id}
                              sx={{
                                bgcolor: index % 2 === 0 ? grey[50] : 'white',
                                borderRadius: 2,
                                mb: 1,
                                border: '1px solid',
                                borderColor: index % 2 === 0 ? grey[200] : 'transparent',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  bgcolor: grey[100],
                                  borderColor: grey[300],
                                },
                              }}
                            >
                              <ListItemIcon>
                                <Avatar
                                  sx={{
                                    bgcolor: green[50],
                                    width: 40,
                                    height: 40,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                                  }}
                                >
                                  <FaMoneyBillWave style={{ color: green[600], fontSize: 18 }} />
                                </Avatar>
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography variant="body2" fontWeight="700" color="text.primary">
                                    {formatCurrency(payment.amount)}
                                  </Typography>
                                }
                                secondary={
                                  <Typography
                                    variant="caption"
                                    color="textSecondary"
                                    display="flex"
                                    alignItems="center"
                                    sx={{ mt: 0.5 }}
                                  >
                                    <FaCalendarAlt style={{ marginRight: 4, fontSize: 10 }} />
                                    {formatDateTime(payment.date_time)}
                                  </Typography>
                                }
                              />
                              <Chip
                                label={`#${payment.payment_history_id}`}
                                size="small"
                                variant="outlined"
                                icon={<FaReceipt style={{ fontSize: 12, marginLeft: 4 }} />}
                                sx={{ fontWeight: 600 }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </>
                    ) : (
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 4,
                          textAlign: 'center',
                          bgcolor: grey[50],
                          borderRadius: 3,
                          borderColor: grey[300],
                        }}
                      >
                        <Box
                          sx={{
                            bgcolor: grey[200],
                            borderRadius: '50%',
                            width:  60,
                            height: 60,
                            display: 'flex',
                            alignItems:  'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            mb: 2,
                          }}
                        >
                          <FaWallet style={{ fontSize: 28, color: grey[500] }} />
                        </Box>
                        <Typography variant="body2" fontWeight="600" color="text.primary" gutterBottom>
                          No Payments Yet
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          This debt has not received any payments
                        </Typography>
                      </Paper>
                    )}

                    {/* Statistics */}
                    {debt.payments && debt.payments.length > 0 && (
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2.5,
                          mt: 3,
                          bgcolor: blue[50],
                          borderRadius: 3,
                          borderColor: blue[200],
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          fontWeight="700"
                          color="primary.main"
                          mb={2}
                          display="flex"
                          alignItems="center"
                        >
                          <FaChartLine style={{ marginRight: 8, fontSize: 14 }} />
                          Payment Statistics
                        </Typography>
                        <Stack direction="row" justifyContent="space-between" spacing={2} flexWrap="wrap">
                          <Box>
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              display="flex"
                              alignItems="center"
                              fontWeight="500"
                            >
                              <FaCalendarAlt style={{ marginRight:  4, fontSize: 10 }} />
                              Last Payment
                            </Typography>
                            <Typography variant="body2" fontWeight="700" color="text.primary">
                              {formatDateTime(
                                debt.payments[debt. payments.length - 1]. date_time
                              )}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              display="flex"
                              alignItems="center"
                              fontWeight="500"
                            >
                              <FaMoneyBillWave style={{ marginRight: 4, fontSize: 10 }} />
                              Average Payment
                            </Typography>
                            <Typography variant="body2" fontWeight="700" color="text.primary">
                              {formatCurrency(Math.round(totalPaid / debt.payments.length))}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              display="flex"
                              alignItems="center"
                              fontWeight="500"
                            >
                              <FaReceipt style={{ marginRight: 4, fontSize: 10 }} />
                              Payment Count
                            </Typography>
                            <Typography variant="body2" fontWeight="700" color="text.primary">
                              {debt.payments.length} time{debt.payments.length !== 1 ? 's' : ''}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2.5, bgcolor: '#fafafa' }}>
        <Button
          startIcon={<FaTimes />}
          onClick={handleClose}
          variant="contained"
          fullWidth
          size="large"
          sx={{
            py: 1.5,
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow:  '0 6px 16px rgba(0,0,0,0.2)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PaymentHistoryModal;