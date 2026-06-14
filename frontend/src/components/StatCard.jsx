const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
      <p className="text-gray-500 text-xs sm:text-sm">
        {title}
      </p>

      <h2 className="text-2xl sm:text-3xl font-bold mt-2 break-words">
        {value}
      </h2>
    </div>
  );
};

export default StatCard;