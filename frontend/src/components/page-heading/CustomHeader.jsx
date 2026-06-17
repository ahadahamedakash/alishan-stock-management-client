import { useThemeContext } from "../theme/ThemeProvider";

const CustomHeader = ({ title, subtitle, actions }) => {
  const { primaryColor } = useThemeContext();

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: primaryColor }}>
          {title}
        </h1>
        <p className="text-muted-foreground mt-1 ps-1">{subtitle}</p>
      </div>
      {actions && <div className="w-full md:w-auto">{actions}</div>}
    </div>
  );
};

export default CustomHeader;
