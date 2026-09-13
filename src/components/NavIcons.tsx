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

export function ScoreIcon({ className }: IconProps) {
  return (
    <svg className={className} {...common}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.3l2.3 2.3 4.7-5.1" />
    </svg>
  );
}

export function LockIcon({ className }: IconProps) {
  return (
    <svg className={className} {...common}>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
      <path d="M12 14.5v2.5" />
    </svg>
  );
}

export function LightbulbIcon({ className }: IconProps) {
  return (
    <svg className={className} {...common}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6.5 6.5 0 0 0-3.8 11.8c.5.4.8 1 .8 1.7v.5h6v-.5c0-.7.3-1.3.8-1.7A6.5 6.5 0 0 0 12 3z" />
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
