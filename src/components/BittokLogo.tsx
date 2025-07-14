interface BittokLogoProps {
  className?: string;
  size?: number;
}

export const BittokLogo = ({ className = "", size = 32 }: BittokLogoProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="50%" stopColor="hsl(var(--accent))" />
          <stop offset="100%" stopColor="hsl(var(--secondary))" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Background circle */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="url(#logoGradient)"
        opacity="0.1"
        stroke="url(#logoGradient)"
        strokeWidth="2"
      />
      
      {/* B shape - Left side */}
      <path
        d="M20 25 L20 75 L45 75 Q55 75 55 65 Q55 55 50 50 Q55 45 55 35 Q55 25 45 25 L20 25 Z
           M28 33 L42 33 Q47 33 47 37.5 Q47 42 42 42 L28 42 Z
           M28 50 L42 50 Q47 50 47 54.5 Q47 59 42 59 L28 59 Z"
        fill="url(#logoGradient)"
        filter="url(#glow)"
      />
      
      {/* T shape - Right side, interlocked with B */}
      <path
        d="M35 25 L75 25 L75 33 L59 33 L59 75 L51 75 L51 33 L35 33 Z"
        fill="url(#logoGradient)"
        filter="url(#glow)"
      />
      
      {/* Connecting element - creates the interlocked effect */}
      <rect
        x="47"
        y="45"
        width="8"
        height="10"
        fill="url(#logoGradient)"
        opacity="0.8"
      />
      
      {/* Inner glow effect */}
      <circle
        cx="50"
        cy="50"
        r="35"
        fill="none"
        stroke="url(#logoGradient)"
        strokeWidth="1"
        opacity="0.3"
      />
    </svg>
  );
};