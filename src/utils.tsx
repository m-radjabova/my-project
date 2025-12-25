import { FaCheckCircle, FaClock, FaChartLine } from "react-icons/fa";
import { green,orange, red } from "@mui/material/colors";

export const getAvatarColor2 = (name: string) => {
  const colors = [
    "#FF6B6B", "#4ECDC4", "#FFD166", "#06D6A0", "#118AB2",
    "#EF476F", "#7209B7", "#F3722C", "#277DA1", "#90BE6D",
    "#FF9A76", "#9B5DE5", "#00BBF9", "#00F5D4", "#FF97B7",
    "#FF9E00", "#00C49A", "#D62828", "#003049", "#F77F00"
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const getDebtColor = (amount: number) => {
  if (amount === 0) return "success";
  if (amount < 1000) return "warning";
  if (amount < 5000) return "info";
  return "error";
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatPhoneNumber = (phone: string) => {
  if (!phone) return "N/A";

  return phone.replace(
    /(\+998)(\d{2})(\d{3})(\d{2})(\d{2})/,
    "$1 $2 $3 $4 $5"
  );
};


export const getStatusInfo = (status: boolean) => {
  if (status) {
    return {
      text: "Paid",
      color: "success" as const,
      icon: <FaCheckCircle />,
    };
  } else {
    return {
      text: "Unpaid",
      color: "warning" as const,
      icon: <FaClock />,
    };
  }
};

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};



export const getStatusColor = (status: boolean, remaining: number) => {
    if (remaining <= 0) return green[500];
    if (status) return orange[500];
    return red[500];
  };

export const getStatusIcon = (status: boolean, remaining: number) => {
    const iconStyle = { fontSize: 16, marginRight: 4 };
    if (remaining <= 0) return <FaCheckCircle style={iconStyle} />;
    if (status) return <FaClock style={iconStyle} />;
    return <FaChartLine style={iconStyle} />;
  };

export const getStatusText = (status: boolean, remaining: number) => {
    if (remaining <= 0) return "Fully Paid";
    if (status) return "In Progress";
    return "Unpaid";
  };

