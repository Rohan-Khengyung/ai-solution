const StatsCard = ({ number, label }) => {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-blue-600">{number}</div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
    </div>
  )
}

export default StatsCard