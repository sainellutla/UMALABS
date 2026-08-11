import { Link } from "react-router-dom";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 ease-out";

const variants = {
  primary: "bg-white text-charcoal-950 hover:bg-white/85 hover:-translate-y-0.5",
  secondary:
    "border border-white/20 text-white hover:border-white/50 hover:bg-white/5 hover:-translate-y-0.5",
  ghost: "text-white/70 hover:text-white",
};

export default function Button({
  children,
  to,
  href,
  variant = "primary",
  className = "",
  ...props
}) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
