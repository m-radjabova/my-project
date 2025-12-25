import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Container,
  Paper,
  Button,
  Chip,
  IconButton,
  Stack,
  alpha,
  useTheme,
  Tooltip,
  Badge
} from "@mui/material";

import useContextPro from "../../hooks/useContextPro";
import useShop from "../../hooks/useShop";
import { 
  FaCheck, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaSignOutAlt, 
  FaStore,
  FaUser, 
  FaUsers,
  FaPlus,
  FaCog,
  FaShieldAlt,
  FaSignal,
  FaBell,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaWallet
} from "react-icons/fa";
import UpdateShopModal from "../../components/shop/UpdateShopModal";
import type { ReqShop } from "../../types/types";

interface StatCardProps {
  title: string;
  value: string;
  color: string;
  icon: React.ReactNode;
  bgColor: string;
  trend?: number;
  subtitle?: string;
}

function Home() {
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const { state: { shop }, dispatch } = useContextPro();
  const navigate = useNavigate();
  
  const shopId = shop?.shop_id;
  const { statistics, updateShop } = useShop(shopId);
  
  const [statsData, setStatsData] = useState<StatCardProps[]>([]);

  useEffect(() => {
    if (statistics?.statistics) {
      const stats = statistics.statistics;
      const totalDebt = stats.total_debts || 0;
      const paidDebt = stats.total_paid_debt || 0;
      const unpaidDebt = stats.total_unpaid_debt || 0;
      
      setStatsData([
        { 
          title: "Active Debtors", 
          value: stats.total_debtors?.toString() || "0", 
          color: "#6366f1",
          icon: <FaUsers />,
          bgColor: alpha("#6366f1", 0.1),
          trend: 12,
          subtitle: "Total customers"
        },
        { 
          title: "Total Debt", 
          value: `${totalDebt.toLocaleString()}`,
          color: "#10b981",
          icon: <FaWallet />,
          bgColor: alpha("#10b981", 0.1),
          trend: 8,
          subtitle: "All transactions"
        },
        { 
          title: "Outstanding", 
          value: `$${unpaidDebt.toLocaleString()}`,
          color: "#f59e0b",
          icon: <FaClock />,
          bgColor: alpha("#f59e0b", 0.1),
          trend: -5,
          subtitle: "Pending payment"
        },
        { 
          title: "Collected", 
          value: `$${paidDebt.toLocaleString()}`,
          color: "#06b6d4",
          icon: <FaCheck />,
          bgColor: alpha("#06b6d4", 0.1),
          trend: 15,
          subtitle: "Successfully paid"
        }
      ]);
    }
  }, [statistics, theme]);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate('/');
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleUpdate = (data?: ReqShop) => {
    if (data) {
      updateShop(data);
      setOpenModal(false);
    }
  };


  if (!shop) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        sx={{
          background: `radial-gradient(circle at 20% 20%, ${alpha("#6366f1", 0.15)} 0%, transparent 50%),
                       radial-gradient(circle at 80% 80%, ${alpha("#06b6d4", 0.15)} 0%, transparent 50%),
                       ${theme.palette.background.default}`
        }}
      >
        <Stack alignItems="center" spacing={4}>
          <Box
            sx={{
              position: "relative",
              width: 100,
              height: 100
            }}
          >
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                border: `4px solid ${alpha("#6366f1", 0.2)}`,
                borderTopColor: "#6366f1",
                animation: "spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite",
                "@keyframes spin": {
                  "0%": { transform: "rotate(0deg)" },
                  "100%": { transform: "rotate(360deg)" }
                }
              }}
            />
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                border: `4px solid ${alpha("#06b6d4", 0.2)}`,
                borderBottomColor: "#06b6d4",
                animation: "spin-reverse 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite",
                "@keyframes spin-reverse": {
                  "0%": { transform: "rotate(0deg)" },
                  "100%": { transform: "rotate(-360deg)" }
                }
              }}
            />
          </Box>
          <Box textAlign="center">
            <Typography 
              variant="h5" 
              sx={{
                background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 700,
                mb: 1
              }}
            >
              Loading Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Preparing your workspace...
            </Typography>
          </Box>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: theme.palette.mode === 'dark' 
          ? `radial-gradient(circle at 20% 20%, ${alpha("#6366f1", 0.08)} 0%, transparent 50%),
             radial-gradient(circle at 80% 80%, ${alpha("#06b6d4", 0.08)} 0%, transparent 50%),
             ${theme.palette.background.default}`
          : `radial-gradient(circle at 20% 20%, ${alpha("#6366f1", 0.04)} 0%, transparent 50%),
             radial-gradient(circle at 80% 80%, ${alpha("#06b6d4", 0.04)} 0%, transparent 50%),
             linear-gradient(180deg, #fafafa 0%, #ffffff 100%)`,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "400px",
          background: `linear-gradient(135deg, ${alpha("#6366f1", 0.05)} 0%, ${alpha("#06b6d4", 0.05)} 100%)`,
          clipPath: "polygon(0 0, 100% 0, 100% 70%, 0 100%)",
          zIndex: 0
        }
      }}
    >
      {/* Glassmorphic Header */}
      <Paper
        elevation={0}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1100,
          background: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: `0 8px 32px ${alpha("#000", 0.04)}`
        }}
      >
        <Container maxWidth="xl">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            py={2}
          >
            <Stack direction="row" alignItems="center" spacing={3}>
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 8px 24px ${alpha("#6366f1", 0.4)}`,
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: -2,
                    borderRadius: 3,
                    padding: 2,
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "exclude",
                    opacity: 0.5
                  }
                }}
              >
                <FaStore style={{ color: "white", fontSize: 24 }} />
              </Box>
              <Box>
                <Typography 
                  variant="h5" 
                  sx={{
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  Debt Manager
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  Professional Management System
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
              <Tooltip title="Notifications" arrow>
                <IconButton
                  sx={{
                    width: 44,
                    height: 44,
                    background: alpha("#6366f1", 0.1),
                    "&:hover": {
                      background: alpha("#6366f1", 0.2)
                    }
                  }}
                >
                  <Badge badgeContent={3} color="error">
                    <FaBell style={{ color: "#6366f1", fontSize: 18 }} />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  background: alpha("#6366f1", 0.05),
                  border: `1px solid ${alpha("#6366f1", 0.1)}`,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: alpha("#6366f1", 0.1),
                    transform: "translateY(-2px)"
                  }
                }}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    boxShadow: `0 4px 12px ${alpha("#6366f1", 0.3)}`
                  }}
                >
                  {shop.shop_name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {shop.shop_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    {shop.owner_name || "Store Owner"}
                  </Typography>
                </Box>
              </Box>
              
              <Tooltip title="Logout" arrow>
                <IconButton
                  onClick={handleLogout}
                  sx={{
                    width: 44,
                    height: 44,
                    background: alpha("#ef4444", 0.1),
                    "&:hover": {
                      background: alpha("#ef4444", 0.2),
                      transform: "rotate(180deg)"
                    },
                    transition: "all 0.4s ease"
                  }}
                >
                  <FaSignOutAlt style={{ color: "#ef4444", fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Container>
      </Paper>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 5, position: "relative", zIndex: 1 }}>
        {/* Welcome Section with Animation */}
        <Box sx={{ mb: 6 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Box
              sx={{
                width: 6,
                height: 40,
                borderRadius: 3,
                background: "linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%)",
                boxShadow: `0 4px 12px ${alpha("#6366f1", 0.4)}`
              }}
            />
            <Typography 
              variant="h3" 
              sx={{
                fontWeight: 800,
                background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "flex",
                alignItems: "center",
                gap: 2
              }}
            >
              Welcome back, 
              <Box 
                component="span" 
                sx={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                {shop.owner_name || "Store Owner"}
              </Box>
              <span style={{ fontSize: "2.5rem" }}>👋</span>
            </Typography>
          </Stack>
          
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3, fontWeight: 400 }}>
            Here's your financial overview for today
          </Typography>
          
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Chip
              icon={<FaShieldAlt style={{ fontSize: 14 }} />}
              label={`ID: ${shop.shop_id}`}
              sx={{ 
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
                fontWeight: 600,
                px: 1,
                boxShadow: `0 4px 12px ${alpha("#10b981", 0.3)}`,
                '& .MuiChip-icon': {
                  color: "white"
                }
              }}
            />
            <Chip
              icon={<FaSignal style={{ fontSize: 14 }} />}
              label="System Online"
              sx={{ 
                background: alpha("#6366f1", 0.1),
                color: "#6366f1",
                fontWeight: 600,
                border: `1px solid ${alpha("#6366f1", 0.2)}`
              }}
            />
            <Chip
              label={new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
              sx={{ 
                background: alpha("#06b6d4", 0.1),
                color: "#06b6d4",
                fontWeight: 600,
                border: `1px solid ${alpha("#06b6d4", 0.2)}`
              }}
            />
          </Stack>
        </Box>

        {/* Modern Stats Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)'
            },
            gap: 3,
            mb: 5
          }}
        >
          {statsData.map((stat, index) => (
            <Card
              key={index}
              sx={{
                position: "relative",
                overflow: "hidden",
                background: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: "blur(20px)",
                border: `1px solid ${alpha(stat.color, 0.1)}`,
                borderRadius: 4,
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-12px)",
                  boxShadow: `0 24px 48px ${alpha(stat.color, 0.2)}`,
                  border: `1px solid ${alpha(stat.color, 0.3)}`,
                  "& .stat-icon": {
                    transform: "scale(1.1) rotate(5deg)"
                  },
                  "& .hover-glow": {
                    opacity: 1
                  }
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 5,
                  background: `linear-gradient(90deg, ${stat.color} 0%, ${alpha(stat.color, 0.6)} 100%)`,
                  boxShadow: `0 4px 12px ${alpha(stat.color, 0.4)}`
                }
              }}
            >
              <Box
                className="hover-glow"
                sx={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${alpha(stat.color, 0.15)} 0%, transparent 70%)`,
                  opacity: 0,
                  transition: "opacity 0.4s ease"
                }}
              />
              
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={3}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box
                      className="stat-icon"
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: `linear-gradient(135deg, ${alpha(stat.color, 0.15)} 0%, ${alpha(stat.color, 0.05)} 100%)`,
                        border: `2px solid ${alpha(stat.color, 0.2)}`,
                        transition: "all 0.4s ease",
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          inset: 0,
                          background: `linear-gradient(135deg, ${alpha(stat.color, 0.3)} 0%, transparent 100%)`,
                          opacity: 0,
                          transition: "opacity 0.3s ease"
                        },
                        "&:hover::before": {
                          opacity: 1
                        }
                      }}
                    >
                      <Box sx={{ 
                        color: stat.color, 
                        fontSize: 32,
                        display: "flex",
                        position: "relative",
                        zIndex: 1
                      }}>
                        {stat.icon}
                      </Box>
                    </Box>
                    
                    {stat.trend && (
                      <Chip
                        icon={stat.trend > 0 ? <FaArrowUp /> : <FaArrowDown />}
                        label={`${stat.trend > 0 ? '+' : ''}${stat.trend}%`}
                        size="small"
                        sx={{
                          height: 32,
                          fontWeight: 700,
                          background: stat.trend > 0 
                            ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                            : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                          color: "white",
                          boxShadow: stat.trend > 0
                            ? `0 4px 12px ${alpha("#10b981", 0.3)}`
                            : `0 4px 12px ${alpha("#ef4444", 0.3)}`,
                          '& .MuiChip-icon': {
                            color: "white"
                          }
                        }}
                      />
                    )}
                  </Stack>
                  
                  <Box>
                    <Typography
                      variant="h3"
                      sx={{ 
                        fontWeight: 800,
                        fontSize: { xs: '2rem', md: '2.75rem' },
                        mb: 1,
                        background: `linear-gradient(135deg, ${stat.color} 0%, ${alpha(stat.color, 0.7)} 100%)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ 
                        textTransform: "uppercase",
                        letterSpacing: 1.5,
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        color: "text.primary",
                        mb: 0.5
                      }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ 
                        color: "text.secondary",
                        fontWeight: 500
                      }}
                    >
                      {stat.subtitle}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Collection Progress */}
        <Card
          sx={{
            mb: 5,
            background: `linear-gradient(135deg, ${alpha("#6366f1", 0.05)} 0%, ${alpha("#8b5cf6", 0.05)} 100%)`,
            border: `1px solid ${alpha("#6366f1", 0.1)}`,
            borderRadius: 4,
            overflow: "hidden"
          }}
        >
        </Card>

        {/* Store Info & Quick Actions */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              lg: '1.5fr 1fr'
            },
            gap: 4,
            mb: 5
          }}
        >
          {/* Store Information */}
          <Card
            sx={{
              background: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: "blur(20px)",
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              borderRadius: 4,
              overflow: "hidden"
            }}
          >
            <Box
              sx={{
                p: 4,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: alpha("#fff", 0.1),
                  animation: "float 6s ease-in-out infinite",
                  "@keyframes float": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-20px)" }
                  }
                }
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    background: alpha("#fff", 0.2),
                    backdropFilter: "blur(10px)",
                    border: `3px solid ${alpha("#fff", 0.3)}`,
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "white"
                  }}
                >
                  <FaStore />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={800} color="white" mb={0.5}>
                    Store Information
                  </Typography>
                  <Typography variant="body2" sx={{ color: alpha("#fff", 0.9) }}>
                    Your business details and contact information
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Stack spacing={3}>
                {[
                  {
                    icon: <FaStore />,
                    label: "Store Name",
                    value: shop.shop_name,
                    color: "#6366f1"
                  },
                  {
                    icon: <FaUser />,
                    label: "Owner Name",
                    value: shop.owner_name || "Not specified",
                    color: "#8b5cf6"
                  },
                  {
                    icon: <FaPhone />,
                    label: "Contact",
                    value: shop.phone_number || "Not provided",
                    color: "#10b981"
                  },
                  {
                    icon: <FaMapMarkerAlt />,
                    label: "Address",
                    value: shop.address || "Not provided",
                    color: "#f59e0b"
                  }
                ].map((item, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: alpha(item.color, 0.04),
                      border: `1px solid ${alpha(item.color, 0.1)}`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: alpha(item.color, 0.08),
                        borderColor: alpha(item.color, 0.2),
                        transform: "translateX(8px)"
                      }
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={3}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(item.color, 0.15),
                          color: item.color,
                          width: 56,
                          height: 56,
                          fontSize: "1.5rem"
                        }}
                      >
                        {item.icon}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: "text.secondary",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: 1
                          }}
                        >
                          {item.label}
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {item.value}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card
            sx={{
              background: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: "blur(20px)",
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              borderRadius: 4,
              overflow: "hidden"
            }}
          >
            <Box
              sx={{
                p: 4,
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    background: alpha("#fff", 0.2),
                    backdropFilter: "blur(10px)",
                    border: `3px solid ${alpha("#fff", 0.3)}`,
                    fontSize: "2rem",
                    color: "white"
                  }}
                >
                  ⚡
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={800} color="white" mb={0.5}>
                    Quick Actions
                  </Typography>
                  <Typography variant="body2" sx={{ color: alpha("#fff", 0.9) }}>
                    Perform common tasks instantly
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Stack spacing={2.5}>
                {[
                  {
                    icon: <FaPlus />,
                    label: "Add New Debtor",
                    description: "Register a new customer",
                    color: "#6366f1",
                    onClick: () => navigate('/home/debtor')
                  },
                  {
                    icon: <FaCog />,
                    label: "Settings",
                    description: "Manage your account",
                    color: "#8b5cf6",
                    onClick: () => setOpenModal(true)
                  }
                ].map((action, index) => (
                  <Button
                    key={index}
                    fullWidth
                    onClick={action.onClick}
                    sx={{
                      py: 2.5,
                      px: 3,
                      borderRadius: 3,
                      justifyContent: "flex-start",
                      background: alpha(action.color, 0.08),
                      border: `2px solid ${alpha(action.color, 0.15)}`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: `linear-gradient(135deg, ${action.color} 0%, ${alpha(action.color, 0.8)} 100%)`,
                        border: `2px solid ${action.color}`,
                        transform: "translateX(8px)",
                        boxShadow: `0 8px 24px ${alpha(action.color, 0.3)}`,
                        "& .action-icon": {
                          transform: "scale(1.2) rotate(5deg)",
                          color: "white"
                        },
                        "& .action-text": {
                          color: "white"
                        },
                        "& .action-desc": {
                          color: alpha("#fff", 0.9)
                        }
                      }
                    }}
                  >
                    <Stack direction="row" spacing={3} alignItems="center" width="100%">
                      <Avatar
                        className="action-icon"
                        sx={{
                          bgcolor: alpha(action.color, 0.15),
                          color: action.color,
                          width: 50,
                          height: 50,
                          transition: "all 0.3s ease"
                        }}
                      >
                        {action.icon}
                      </Avatar>
                      <Box textAlign="left">
                        <Typography 
                          className="action-text"
                          variant="subtitle1" 
                          fontWeight={700}
                          sx={{ 
                            color: "text.primary",
                            transition: "color 0.3s ease"
                          }}
                        >
                          {action.label}
                        </Typography>
                        <Typography 
                          className="action-desc"
                          variant="caption"
                          sx={{ 
                            color: "text.secondary",
                            transition: "color 0.3s ease"
                          }}
                        >
                          {action.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </Button>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Footer */}
        <Paper
          elevation={0}
          sx={{
            mt: 6,
            p: 4,
            borderRadius: 4,
            background: alpha(theme.palette.background.paper, 0.6),
            backdropFilter: "blur(20px)",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={3}
          >
            <Box>
              <Typography 
                variant="h6" 
                fontWeight={700}
                sx={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 0.5
                }}
              >
                Debt Manager
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Version 2.0 • © {new Date().getFullYear()} All Rights Reserved
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={2}>
              <Chip
                icon={<FaShieldAlt />}
                label="Secure & Encrypted"
                sx={{
                  height: 36,
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  '& .MuiChip-icon': {
                    color: "white"
                  }
                }}
              />
              <Chip
                icon={<FaSignal />}
                label="Live Status"
                sx={{
                  height: 36,
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "white",
                  '& .MuiChip-icon': {
                    color: "white"
                  }
                }}
              />
            </Stack>
          </Stack>
        </Paper>
      </Container>

      <UpdateShopModal open={openModal} onClose={handleClose} onUpdate={handleUpdate} shop={shop} />
    </Box>
  );
}

export default Home;