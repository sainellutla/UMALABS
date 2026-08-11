import { Link } from "react-router-dom";

export default function Logo({ className = "" }) {
  return (
    <Link
      to="/"
      className={`font-sans text-lg font-semibold tracking-tightest text-white ${className}`}
      aria-label="Uma Labs home"
    >
      UMA LABS
    </Link>
  );
}
