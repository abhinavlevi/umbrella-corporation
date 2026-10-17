import React from 'react';

/**
 * Prop-accurate 8-segment Umbrella Octagon Logo.
 * Oriented so top and bottom edges are horizontal (vertices at ±22.5°, ±67.5°, ±112.5°, ±157.5°),
 * with alternating crimson red (#c81d25) and white (#ffffff) triangular segments and black outlines.
 */
export const UmbrellaOctagonLogo: React.FC<{
  className?: string;
  variant?: 'classic' | 'crest' | 'watermark';
}> = ({ className = 'w-28 h-28', variant = 'classic' }) => {
  const cx = 100;
  const cy = 100;
  const r = 92;

  // 8 vertices starting at -112.5 deg so the top segment (-112.5 to -67.5) has a flat horizontal top edge
  const angles = [-112.5, -67.5, -22.5, 22.5, 67.5, 112.5, 157.5, 202.5];
  const points = angles.map((deg) => {
    const rad = (deg * Math.PI) / 180;
    return {
      x: Number((cx + r * Math.cos(rad)).toFixed(2)),
      y: Number((cy + r * Math.sin(rad)).toFixed(2)),
    };
  });

  if (variant === 'watermark') {
    return (
      <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
        <defs>
          <radialGradient id="wmRed" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#7f1d1d" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#450a0a" stopOpacity="0.25" />
          </radialGradient>
          <radialGradient id="wmGrey" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#52525b" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#18181b" stopOpacity="0.2" />
          </radialGradient>
        </defs>
        {points.map((pt, i) => {
          const next = points[(i + 1) % 8];
          const isRed = i % 2 === 0;
          // Slightly inset triangles to create the dark gap between segments seen on the Hive black card
          return (
            <polygon
              key={i}
              points={`${cx},${cy} ${pt.x},${pt.y} ${next.x},${next.y}`}
              fill={isRed ? 'url(#wmRed)' : 'url(#wmGrey)'}
              stroke="#090a0c"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
          );
        })}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="crestRed" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
        <linearGradient id="crestWhite" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d4d4d8" />
        </linearGradient>
      </defs>
      {points.map((pt, i) => {
        const next = points[(i + 1) % 8];
        const isRed = i % 2 === 0;
        const fill =
          variant === 'crest'
            ? isRed
              ? 'url(#crestRed)'
              : 'url(#crestWhite)'
            : isRed
              ? '#c41e24'
              : '#ffffff';
        return (
          <polygon
            key={i}
            points={`${cx},${cy} ${pt.x},${pt.y} ${next.x},${next.y}`}
            fill={fill}
            stroke={variant === 'crest' ? '#27272a' : '#111111'}
            strokeWidth={variant === 'crest' ? '3' : '2.8'}
            strokeLinejoin="round"
          />
        );
      })}
      <polygon
        points={points.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke={variant === 'crest' ? '#71717a' : '#111111'}
        strokeWidth={variant === 'crest' ? '3.2' : '3.5'}
        strokeLinejoin="round"
      />
    </svg>
  );
};

/**
 * High-detail Biometric Dermal Ridge Fingerprint graphic for Style C (Horizontal Classified Pass)
 */
export const BiometricFingerprint: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => {
  return (
    <svg viewBox="0 0 120 145" className={className} aria-hidden="true">
      <rect width="120" height="145" fill="#07080a" />
      <g
        fill="none"
        stroke="#e4e4e7"
        strokeLinecap="round"
        transform="rotate(-16 60 72)"
      >
        {/* Outer dermal arches */}
        <path d="M22 98 C16 54, 34 18, 60 18 C86 18, 104 54, 98 98" strokeWidth="1.7" opacity="0.75" />
        <path d="M26 105 C19 58, 37 23, 60 23 C83 23, 101 58, 94 105" strokeWidth="1.7" strokeDasharray="18 3 28 2" opacity="0.85" />
        <path d="M30 111 C23 62, 39 28, 60 28 C81 28, 97 62, 90 111" strokeWidth="1.8" opacity="0.9" />
        <path d="M34 116 C27 66, 42 33, 60 33 C78 33, 93 66, 86 116" strokeWidth="1.8" strokeDasharray="24 2 16 3" opacity="0.92" />
        <path d="M38 120 C31 70, 45 38, 60 38 C75 38, 89 70, 82 120" strokeWidth="1.9" opacity="0.95" />
        {/* Middle whorl ridges */}
        <path d="M42 122 C35 74, 47 43, 60 43 C73 43, 85 74, 78 122" strokeWidth="1.9" strokeDasharray="14 2 22 2" />
        <path d="M46 123 C40 78, 50 48, 60 48 C70 48, 80 78, 74 123" strokeWidth="2.0" />
        <path d="M50 122 C45 82, 52 53, 60 53 C68 53, 75 82, 70 122" strokeWidth="2.0" strokeDasharray="19 3 12 2" />
        <path d="M54 119 C50 85, 54 58, 60 58 C66 58, 70 85, 66 119" strokeWidth="2.0" />
        {/* Core loop */}
        <path d="M57 112 C55 88, 56 64, 60 64 C64 64, 65 88, 63 112" strokeWidth="2.1" />
        <line x1="60" y1="71" x2="60" y2="104" strokeWidth="2.1" />
        {/* Lower basal creases */}
        <path d="M32 118 Q60 108 88 118" strokeWidth="1.6" opacity="0.8" />
        <path d="M38 124 Q60 115 82 124" strokeWidth="1.6" opacity="0.75" />
        <path d="M45 129 Q60 122 75 129" strokeWidth="1.5" opacity="0.65" />
      </g>
    </svg>
  );
};

/**
 * Realistic Smart Card Gold EMV Contact Chip for Style C
 */
export const SmartCardGoldChip: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => {
  return (
    <svg viewBox="0 0 130 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="goldChipGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="35%" stopColor="#eab308" />
          <stop offset="70%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>
      {/* Outer metallic plate */}
      <rect
        x="3"
        y="3"
        width="124"
        height="94"
        rx="14"
        fill="url(#goldChipGrad)"
        stroke="#422006"
        strokeWidth="2.5"
      />
      {/* Internal EMV contact pad segmentation lines */}
      <g stroke="#3f2e05" strokeWidth="2" fill="none">
        {/* Center vertical column */}
        <rect x="44" y="18" width="42" height="64" rx="6" />
        {/* Left pad divisions */}
        <line x1="3" y1="30" x2="44" y2="30" />
        <line x1="3" y1="50" x2="44" y2="50" />
        <line x1="3" y1="70" x2="44" y2="70" />
        {/* Right pad divisions */}
        <line x1="86" y1="30" x2="127" y2="30" />
        <line x1="86" y1="50" x2="127" y2="50" />
        <line x1="86" y1="70" x2="127" y2="70" />
        {/* Top & bottom center notch lines */}
        <line x1="65" y1="3" x2="65" y2="18" />
        <line x1="65" y1="82" x2="65" y2="97" />
      </g>
    </svg>
  );
};

/**
 * Deterministic Code-128 Barcode Strip for Style C bottom edge
 */
export const Code128Barcode: React.FC<{ value: string; className?: string }> = ({
  value,
  className = 'w-full h-9',
}) => {
  // Generate deterministic bar widths (1 to 4 units) from the input string
  const seedText = (value || 'UMBRELLA-220-8543077-7060').toUpperCase();
  const bars: { width: number; black: boolean }[] = [
    // Start guard pattern
    { width: 2, black: true },
    { width: 1, black: false },
    { width: 1, black: true },
    { width: 2, black: false },
  ];

  for (let i = 0; i < 42; i++) {
    const code = seedText.charCodeAt(i % seedText.length) + i * 17;
    const b1 = (code % 3) + 1;
    const s1 = ((code >> 2) % 2) + 1;
    const b2 = ((code >> 3) % 3) + 1;
    const s2 = ((code >> 4) % 2) + 1;
    bars.push({ width: b1, black: true });
    bars.push({ width: s1, black: false });
    bars.push({ width: b2, black: true });
    bars.push({ width: s2, black: false });
  }

  // Stop guard pattern
  bars.push({ width: 2, black: true }, { width: 1, black: false }, { width: 2, black: true });

  const totalUnits = bars.reduce((acc, b) => acc + b.width, 0);
  let currentX = 0;

  return (
    <svg
      viewBox={`0 0 ${totalUnits} 40`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <rect width={totalUnits} height="40" fill="#e4e4e7" />
      {bars.map((bar, idx) => {
        const x = currentX;
        currentX += bar.width;
        if (!bar.black) return null;
        return <rect key={idx} x={x} y="1" width={bar.width} height="38" fill="#09090b" />;
      })}
    </svg>
  );
};
