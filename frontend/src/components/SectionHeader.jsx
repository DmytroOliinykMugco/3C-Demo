const SectionHeader = ({
  title,
  description,
  rightContent,
  level = "section",
  className = "",
}) => {
  const HeadingTag = level === "page" ? "h1" : "h2";
  const headingSize = level === "page" ? "text-3xl" : "text-2xl";

  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div>
        <HeadingTag className={`${headingSize} font-semibold text-gray-900`}>
          {title}
        </HeadingTag>
        {description && <p className="text-gray-600 mt-1">{description}</p>}
      </div>
      {rightContent && <div className="flex items-center gap-2">{rightContent}</div>}
    </div>
  );
};

export default SectionHeader;
