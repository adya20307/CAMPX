export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  type = ""
}) {
  return (
    <div className="stat-card">

      <div className="stat-card-top">

        <div className={`stat-icon ${type}`}>
          {icon}
        </div>

        <span className="stat-title">
          {title}
        </span>

      </div>

      <div className="stat-value">
        {value}
      </div>

      <div className="stat-subtitle">
        {subtitle}
      </div>

    </div>
  );
}