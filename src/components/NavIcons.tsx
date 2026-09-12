type IconProps = { className?: string };

const common = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function DiagnosisIcon({ className }: IconProps) {
  return (
    <svg className={className} {...common}>
      <path d="M3 17l4-6 4 3 6-9 4 5" />
    </svg>
  );
}

export function ScenariosIcon({ className }: IconProps) {
  return (
    <svg className={className} {...common}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" />
    </svg>
  );
}

export function DrillIcon({ className }: IconProps) {
  return (
    <svg className={className} {...common}>
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" />
      <path d="M12 18v3.5M9 21.5h6" />
    </svg>
  );
}

export function ManagerIcon({ className }: IconProps) {
  return (
    <svg className={className} {...common}>
      <circle cx="8.5" cy="7.5" r="3" />
      <path d="M2.5 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17" cy="8.5" r="2.4" />
      <path d="M15 14.2c2.6.2 4.7 2.4 4.9 5.3" />
    </svg>
  );
}
