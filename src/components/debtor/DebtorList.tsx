import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Avatar,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";
import useDebtor from "../../hooks/useDebtor";
import { useState } from "react";
import DebtorForm from "./DebtorForm";
import type { ReqDebtor, Debtor } from "../../types/types";
import {
  FaUserPlus,
  FaUser,
  FaPhone,
  FaMoneyBillWave,
  FaIdCard,
  FaSortAmountDown,
} from "react-icons/fa";
import { formatCurrency, formatPhoneNumber, getAvatarColor, getDebtColor, getInitials } from "../../utils";
import { useNavigate } from "react-router-dom";

function DebtorList() {
  const [open, setOpen] = useState(false);
  const { debtors, addDebtor } = useDebtor();
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (data: ReqDebtor) => {
    addDebtor(data);
    handleClose();
  };

  const totalDebtors = debtors.length;
  const totalDebt = debtors.reduce((sum, debtor) => sum + (debtor.total_debt || 0), 0);
  const highDebtCount = debtors.filter(d => (d.total_debt || 0) > 5000).length;

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Section */}
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          mb: 4,
        }}
      >
        <Box
          sx={{
            p: 4,
            bgcolor: 'primary.main',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 3,
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <FaIdCard size={32} />
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                Debt Management
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Track and manage all debtor accounts
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            size="large"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'grey.100',
              },
              px: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 'bold',
              textTransform: 'none',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
            startIcon={<FaUserPlus />}
          >
            Add New Debtor
          </Button>
        </Box>

        {/* Statistics Cards - Gridsiz versiya */}
        <Box sx={{ p: 3, bgcolor: 'background.default' }}>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 3,
            justifyContent: 'center'
          }}>
            {/* Total Debtors Card */}
            <Card
              sx={{
                borderRadius: 2,
                bgcolor: 'white',
                boxShadow: 2,
                flex: '1 1 300px',
                maxWidth: '400px',
                minWidth: '280px',
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h6" color="textSecondary">
                      Total Debtors
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="primary">
                      {totalDebtors}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.light',
                      width: 56,
                      height: 56,
                    }}
                  >
                    <FaUser size={24} />
                  </Avatar>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={100}
                  sx={{
                    mt: 2,
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'primary.main',
                    },
                  }}
                />
              </CardContent>
            </Card>

            {/* Total Debt Card */}
            <Card
              sx={{
                borderRadius: 2,
                bgcolor: 'white',
                boxShadow: 2,
                flex: '1 1 300px',
                maxWidth: '400px',
                minWidth: '280px',
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h6" color="textSecondary">
                      Total Debt
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="error.main">
                      {formatCurrency(totalDebt)}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: 'error.light',
                      width: 56,
                      height: 56,
                    }}
                  >
                    <FaMoneyBillWave size={24} />
                  </Avatar>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min((totalDebt / 100000) * 100, 100)}
                  sx={{
                    mt: 2,
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'error.main',
                    },
                  }}
                />
              </CardContent>
            </Card>

            {/* High Debt Accounts Card */}
            <Card
              sx={{
                borderRadius: 2,
                bgcolor: 'white',
                boxShadow: 2,
                flex: '1 1 300px',
                maxWidth: '400px',
                minWidth: '280px',
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h6" color="textSecondary">
                      High Debt Accounts
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="warning.main">
                      {highDebtCount}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: 'warning.light',
                      width: 56,
                      height: 56,
                    }}
                  >
                    <FaSortAmountDown size={24} />
                  </Avatar>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={totalDebtors > 0 ? (highDebtCount / totalDebtors) * 100 : 0}
                  sx={{
                    mt: 2,
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'warning.main',
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Paper>

      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 3 }}>
          {debtors.length === 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              py={8}
              gap={2}
            >
              <FaUser size={64} color="#9e9e9e" />
              <Typography variant="h6" color="textSecondary">
                No debtors found
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Add your first debtor to start tracking debts
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setOpen(true)}
                startIcon={<FaUserPlus />}
                sx={{ mt: 2 }}
              >
                Add First Debtor
              </Button>
            </Box>
          ) : (
            <>
              <Table sx={{ 
                minWidth: 650,
                '& .MuiTableCell-root': {
                  py: 2,
                }
              }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                      Debtor
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                      Contact
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                      Total Debt
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {debtors.map((debtor: Debtor) => (
                    <TableRow
                      onClick={() => navigate(`/debtor/${debtor.debtor_id}`)}
                      key={debtor.debtor_id}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'grey.50',
                          transition: 'background-color 0.2s',
                        },
                        '&:last-child td, &:last-child th': { border: 0 }
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            sx={{
                              bgcolor: getAvatarColor(debtor.full_name),
                              width: 40,
                              height: 40,
                              fontWeight: 'bold',
                            }}
                          >
                            {getInitials(debtor.full_name)}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {debtor.full_name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              ID: #{debtor.debtor_id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <FaPhone size={14} color="#666" />
                          <Typography variant="body1">
                            {formatPhoneNumber(debtor.phone_number)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={formatCurrency(debtor.total_debt || 0)}
                          color={getDebtColor(debtor.total_debt || 0)}
                          size="medium"
                          sx={{
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            minWidth: '100px',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: 'grey.50',
                  borderRadius: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  Showing <strong>{debtors.length}</strong> debtor{debtors.length !== 1 ? 's' : ''}
                </Typography>
                <Box display="flex" gap={2} alignItems="center">
                  <Chip
                    label="Total Debt"
                    color="primary"
                    variant="outlined"
                  />
                  <Typography variant="h6" color="error" fontWeight="bold">
                    {formatCurrency(totalDebt)}
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Paper>

      {/* Debtor Form Modal */}
      <DebtorForm 
        open={open} 
        handleClose={handleClose} 
        onSubmit={handleSubmit} 
      />
    </Container>
  );
}

export default DebtorList;