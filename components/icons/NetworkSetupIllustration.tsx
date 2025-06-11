// components/icons/NetworkSetupIllustration.tsx
export function NetworkSetupIllustration() {
    return (
      <svg
        width="100"
        height="80"
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Network Setup Illustration"
        role="img"
      >
        <rect x="10" y="20" width="80" height="40" rx="5" fill="#c9a227" />
        <circle cx="50" cy="40" r="12" fill="#fff" />
        <path d="M42 40h16" stroke="#c9a227" strokeWidth="2" strokeLinecap="round" />
        <path d="M50 32v16" stroke="#c9a227" strokeWidth="2" strokeLinecap="round" />
        <text
          x="50"
          y="75"
          fill="#333"
          fontSize="10"
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
        >
          Network
        </text>
      </svg>
    );
  }
  