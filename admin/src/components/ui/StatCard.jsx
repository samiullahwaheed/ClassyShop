const COLORS = {
  green: 'bg-stat-green',
  blue: 'bg-stat-blue',
  purple: 'bg-stat-purple',
  pink: 'bg-stat-pink',
};

export default function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className={`flex items-center justify-between rounded-xl p-5 text-white shadow-sm ${COLORS[color]}`}>
      <div>
        <p className="text-sm font-medium text-white/90">{label}</p>
        <p className="mt-1 text-3xl font-bold">{value}</p>
      </div>
      <Icon size={34} className="text-white/80" />
    </div>
  );
}
