const EmptyState = ({ title, subtitle }) => {
  return (
    <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-8 text-center text-gray-500">
      <h2 className="text-lg font-semibold text-gray-700">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-2 text-sm">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default EmptyState;