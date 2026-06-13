const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>
    </div>
  );
};

export default StatCard;