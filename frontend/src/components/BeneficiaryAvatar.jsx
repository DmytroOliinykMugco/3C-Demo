const BeneficiaryAvatar = ({
  initials,
  name,
  badge,
  variant = "table",
  className = "",
}) => {
  const isTable = variant === "table";
  const avatarSize = isTable ? "w-6 h-6" : "w-8 h-8";
  const textSize = isTable ? "text-xs" : "text-xs";
  const nameSize = isTable ? "text-sm" : "text-sm";
  const avatarBg = isTable ? "bg-gray-200" : "bg-purple-200";
  const avatarTextColor = isTable ? "text-gray-700" : "text-purple-700";
  const badgeBg = isTable ? "bg-blue-100 text-blue-900" : "bg-red-100 text-red-900";

  if (isTable) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div
          className={`${avatarSize} rounded-full ${avatarBg} flex items-center justify-center`}
        >
          <span className={`${textSize} font-semibold ${avatarTextColor}`}>
            {initials}
          </span>
        </div>
        <span className={`${nameSize} text-gray-900`}>{name}</span>
        <span
          className={`px-2 py-0.5 ${badgeBg} text-xs rounded font-medium`}
        >
          {badge}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`${avatarSize} rounded-full ${avatarBg} flex items-center justify-center`}
      >
        <span className={`${textSize} font-semibold ${avatarTextColor}`}>
          {initials}
        </span>
      </div>
      <div>
        <p className={`${nameSize} font-medium text-gray-900`}>{name}</p>
        <span
          className={`px-2 py-0.5 ${badgeBg} text-xs rounded font-medium`}
        >
          {badge}
        </span>
      </div>
    </div>
  );
};

export default BeneficiaryAvatar;
