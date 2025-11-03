const STATUS_COLOR_MAP = {
  // Cemetery/Funeral statuses
  "In Trust": "bg-blue-100 text-blue-800",
  "Not Purchased": "bg-red-100 text-red-800",
  "Used": "bg-yellow-100 text-yellow-800",
  "Paid": "bg-green-100 text-green-800",

  // Designation statuses
  "Available": "bg-blue-100 text-blue-800",
  "Assigned": "bg-yellow-100 text-yellow-800",

  // Document statuses
  "Signed": "bg-green-100 text-green-800",
  "On review": "bg-yellow-100 text-yellow-800",

  // Contract badges
  "AN": "bg-purple-100 text-purple-800",
  "PN": "bg-blue-100 text-blue-800",
  "CN": "bg-green-100 text-green-800",
};

const StatusBadge = ({
  status,
  variant = "default",
  className = ""
}) => {
  const colorClass = STATUS_COLOR_MAP[status] || "bg-gray-100 text-gray-800";
  const sizeClass = variant === "sm" ? "text-xs" : "text-sm";

  return (
    <span
      className={`inline-block px-3 py-1 ${sizeClass} rounded font-medium ${colorClass} ${className}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
