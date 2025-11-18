import {
  FaCheckCircle,
  FaCircle,
  FaPlayCircle,
  FaRegClock,
} from "react-icons/fa";
import { IoMdFlag } from "react-icons/io";
import type { PriorityType, StatusType } from "./types/types";

export const colors: Record<string, string> = {
  TODO: "#7f8c8d",
  INPROGRESS: "#3498db",
  VERIFIED: "#9b59b6",
  DONE: "#2ecc71",
};

export const statusLabels: Record<string, string> = {
  TODO: "To Do",
  INPROGRESS: "In Progress",
  VERIFIED: "Verified",
  DONE: "Done",
};

export const getStatusIcon = (status: StatusType) => {
  const icons = {
    TODO: <FaRegClock className="text-gray-400" />,
    INPROGRESS: <FaPlayCircle className="text-blue-400" />,
    VERIFIED: <FaCircle className="text-purple-400" />,
    DONE: <FaCheckCircle className="text-green-400" />,
  };
  return icons[status] || <FaRegClock className="text-gray-400" />;
};

export const getPriorityIcon = (priority: PriorityType) => {
  const icons = {
    HIGH: <IoMdFlag className="text-red-400" />,
    MEDIUM: <IoMdFlag className="text-yellow-400" />,
    LOW: <IoMdFlag className="text-green-400" />,
  };
  return icons[priority] || <IoMdFlag className="text-gray-400" />;
};

export const getPriorityColor = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case "high":
      return "priority-high";
    case "medium":
      return "priority-medium";
    case "low":
      return "priority-low";
    default:
      return "priority-default";
  }
};

export const formatDate = (dateString: string) => {
  if (!dateString) return "No date set";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};


// utils.ts fayliga qo'shing
export const getDisplayName = (name: string): string => {
  if (!name) return '';
  
  // Faqat bosh harfni olish
  if (name.length <= 2) {
    return name.toUpperCase();
  }
  
  // Ism va familiya bo'lsa, ikkalasining bosh harfini olish
  const nameParts = name.trim().split(' ');
  
  if (nameParts.length >= 2) {
    return `${nameParts[0].charAt(0).toUpperCase()}. ${nameParts[1].charAt(0).toUpperCase()}${nameParts[1].slice(1).toLowerCase()}`;
  }
  
  // Faqat bitta so'z bo'lsa, bosh harfini katta qilish
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

// Yoki qisqaroq versiya
export const getShortName = (name: string): string => {
  if (!name) return '';
  
  const nameParts = name.trim().split(' ');
  
  if (nameParts.length >= 2) {
    // Ism familiya bo'lsa: "John Doe" -> "J. Doe"
    return `${nameParts[0].charAt(0).toUpperCase()}. ${nameParts[1]}`;
  }
  
  // Faqat bitta so'z bo'lsa, 10 ta harfdan oshmasa
  if (name.length > 10) {
    return name.substring(0, 8) + '...';
  }
  
  return name;
};