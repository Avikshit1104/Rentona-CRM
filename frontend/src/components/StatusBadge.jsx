const StatusBadge = ({ status }) => {
  const styles = {
    PENDING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    ASSIGNED: "bg-blue-100 text-blue-700",
    ACCEPTED: "bg-green-100 text-green-700",
    DONE: "bg-gray-200 text-gray-700",
    COMPLETED: "bg-purple-100 text-purple-700",
    OPEN: "bg-orange-100 text-orange-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;