import { FaCheckCircle, FaClock } from "react-icons/fa";

export const getColorName = (colorInput: string): string => {
  if (!colorInput) return "Unknown";

  const color = colorInput.trim().toLowerCase();

  const colorNames: Record<string, string> = {
    "#ff0000": "Red",
    "#00ff00": "Green",
    "#0000ff": "Blue",
    "#ffff00": "Yellow",
    "#ffa500": "Orange",
    "#800080": "Purple",
    "#000000": "Black",
    "#ffffff": "White",
    "#808080": "Gray",
    "#a52a2a": "Brown",
    "#ff4500": "Orange Red",
    "#008000": "Green",
    "#000080": "Navy Blue",
    "#ff69b4": "Hot Pink",
    "#008080": "Teal",
    "#ffd700": "Gold",
    "#c0c0c0": "Silver",

    red: "Red",
    green: "Green",
    blue: "Blue",
    yellow: "Yellow",
    orange: "Orange",
    purple: "Purple",
    black: "Black",
    white: "White",
    gray: "Gray",
    grey: "Gray",
    brown: "Brown",
    pink: "Pink",
    cyan: "Cyan",
    magenta: "Magenta",
    teal: "Teal",
    navy: "Navy Blue",
    maroon: "Maroon",
    olive: "Olive",
    lime: "Lime",
    aqua: "Aqua",
    silver: "Silver",
    gold: "Gold",
  };

  if (color.startsWith("#")) {
    return colorNames[color] || colorInput;
  }

  if (/^[0-9a-f]{3}$|^[0-9a-f]{6}$/i.test(color)) {
    const hexColor = `#${color}`;
    return colorNames[hexColor] || hexColor;
  }

  return colorNames[color] || colorInput;
};

export const formatColorHex = (colorInput: string): string => {
  if (!colorInput) return "#000000";

  const color = colorInput.trim().toLowerCase();

  if (color.startsWith("#")) {
    return color;
  }

  if (/^[0-9a-f]{3}$|^[0-9a-f]{6}$/i.test(color)) {
    return `#${color}`;
  }
  const cssToHex: Record<string, string> = {
    red: "#FF0000",
    green: "#00FF00",
    blue: "#0000FF",
    yellow: "#FFFF00",
    orange: "#FFA500",
    purple: "#800080",
    black: "#000000",
    white: "#FFFFFF",
    gray: "#808080",
    grey: "#808080",
    brown: "#A52A2A",
    pink: "#FFC0CB",
    cyan: "#00FFFF",
    magenta: "#FF00FF",
    teal: "#008080",
    navy: "#000080",
    maroon: "#800000",
    olive: "#808000",
    lime: "#00FF00",
    aqua: "#00FFFF",
    silver: "#C0C0C0",
    gold: "#FFD700",
  };

  return cssToHex[color] || "#000000";
};

export const getAvatarColor = (name: string) => {
  const colors = [
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#FFD166", // Yellow
    "#06D6A0", // Green
    "#118AB2", // Blue
    "#EF476F", // Pink
    "#7209B7", // Purple
    "#F3722C", // Orange
    "#277DA1", // Dark Blue
    "#90BE6D", // Light Green
  ];
  const index = name.length % colors.length;
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
  return phone.replace(/(\+998)(\d{2})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5");
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
      text: "Pending",
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


