export default function IronLogLogo({ size = 64, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left plate */}
      <rect x="2" y="17" width="11" height="30" rx="3.5" fill="#00E5A0"/>
      {/* Left collar */}
      <rect x="13" y="24" width="6" height="16" rx="2" fill="#00E5A0" opacity="0.75"/>
      {/* Bar */}
      <rect x="19" y="29" width="26" height="6" rx="3" fill="#00E5A0" opacity="0.55"/>
      {/* Right collar */}
      <rect x="45" y="24" width="6" height="16" rx="2" fill="#00E5A0" opacity="0.75"/>
      {/* Right plate */}
      <rect x="51" y="17" width="11" height="30" rx="3.5" fill="#00E5A0"/>
    </svg>
  )
}
