import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  BadgeData,
  CLEARANCE_LEVELS,
  UMBRELLA_DIVISIONS,
} from '../types/badge';
import {
  BiometricFingerprint,
  Code128Barcode,
  SmartCardGoldChip,
  UmbrellaOctagonLogo,
} from './UmbrellaGraphics';

interface BadgePreviewProps {
  data: BadgeData;
  badgeRef?: React.RefObject<HTMLDivElement | null>;
  side?: 'front' | 'back';
}

export const BadgePreview: React.FC<BadgePreviewProps> = ({
  data,
  badgeRef,
  side = 'front',
}) => {
  if (side === 'back') {
    if (data.style === 'classified') {
      return (
        <div
          id="umbrella-id-card"
          ref={badgeRef}
          className="relative w-[540px] h-[342px] rounded-[14px] bg-[#08090c] text-white overflow-hidden border-0 ring-0 outline-none flex items-center justify-center select-none"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 3px)',
            }}
          />
          <UmbrellaOctagonLogo className="w-[190px] h-[190px] relative z-10" variant="classic" />
        </div>
      );
    }

    // Vertical cards (Personnel and Facility)
    return (
      <div
        id="umbrella-id-card"
        ref={badgeRef}
        className="relative w-[340px] h-[538px] rounded-[18px] bg-white text-[#111111] overflow-hidden border-0 ring-0 outline-none flex items-center justify-center select-none"
      >
        <UmbrellaOctagonLogo className="w-[190px] h-[190px]" variant="classic" />
      </div>
    );
  }
  const divisionMeta =
    UMBRELLA_DIVISIONS.find((d) => d.value === data.division) ||
    UMBRELLA_DIVISIONS[0];
  const clearanceMeta =
    CLEARANCE_LEVELS.find((c) => c.value === data.clearance) ||
    CLEARANCE_LEVELS[4];

  const qrValue =
    data.qrContent.trim() ||
    `UMBRELLA-HIVE://CREDENTIAL/${encodeURIComponent(data.fullName || 'OPERATIVE')}/${encodeURIComponent(data.clearance)}`;

  // STYLE A: Vertical Personnel Badge (White card with Photo)
  if (data.style === 'personnel') {
    return (
      <div
        id="umbrella-id-card"
        ref={badgeRef}
        className="relative w-[340px] h-[538px] rounded-[18px] bg-white text-[#111111] overflow-hidden border-0 ring-0 outline-none flex flex-col justify-between select-none"
      >
        {/* Top Header */}
        <div className="pt-7 px-5 text-center">
          <div
            className="font-umbrella-header font-black text-[29px] leading-none tracking-[0.14em] text-[#111111] uppercase"
            style={{ transform: 'scaleX(1.08)' }}
          >
            UMBRELLA
          </div>
          <div
            className="font-umbrella-header font-medium text-[15.5px] leading-tight tracking-[0.26em] text-[#18181b] uppercase mt-1"
            style={{ transform: 'scaleX(1.06)' }}
          >
            CORPORATION
          </div>
        </div>

        {/* Upper Middle: Left Octagon Logo + Right Red-Bordered Photo */}
        <div className="px-5 pt-3 pb-2 flex items-center justify-between gap-3">
          <div className="flex-shrink-0 flex items-center justify-center">
            <UmbrellaOctagonLogo className="w-[134px] h-[134px]" variant="classic" />
          </div>

          <div className="w-[134px] h-[134px] border-[3px] border-[#b91c1c] bg-zinc-200 overflow-hidden relative flex-shrink-0">
            <img
              src={data.photoUrl}
              alt={data.fullName || 'Operative Portrait'}
              crossOrigin="anonymous"
              className="w-full h-full object-cover"
              style={{
                transform: `scale(${data.photoZoom || 1}) translate(${data.photoOffsetX || 0}%, ${data.photoOffsetY || 0}%)`,
                transformOrigin: 'center center',
              }}
            />
          </div>
        </div>

        {/* Center Name Bar (Full-Width Charcoal Band) */}
        <div className="w-full">
          <div className="w-full bg-[#48484a] text-white py-2 px-3 text-center shadow-inner">
            <div className="font-extrabold text-[23px] leading-tight tracking-[0.01em] truncate">
              {data.fullName || 'Unassigned Operative'}
            </div>
          </div>

          {/* Sub-bar: Red Uppercase Monospaced Clearance */}
          <div className="w-full pt-2 pb-1 text-center">
            <div className="font-tech-mono font-bold text-[19px] leading-none tracking-[0.17em] text-[#c41e24] uppercase">
              {clearanceMeta.verticalText}
            </div>
          </div>
        </div>

        {/* Lower Grid: Left Biometric Typewriter Specs + Right High-Density QR */}
        <div className="px-5 pt-1 pb-2 flex items-start justify-between gap-2">
          <div className="font-typewriter text-[12.5px] leading-[1.35] text-[#18181b] tracking-tight pt-1 space-y-0.5 text-left">
            <div className="truncate max-w-[175px]">
              <span className="font-normal">Division: </span>
              <span>{divisionMeta.shortBadgeLabel}</span>
            </div>
            <div>
              <span>HEIGHT: </span>
              <span>{data.height || "5'10"}</span>
            </div>
            <div>
              <span>WEIGHT: </span>
              <span>{data.weight || '165lbs'}</span>
            </div>
            <div>
              <span>EYES: </span>
              <span>{data.eyes || 'Brown'}</span>
            </div>
            <div>
              <span>HAIR: </span>
              <span>{data.hair || 'Brown'}</span>
            </div>
          </div>

          <div className="bg-white p-1 flex-shrink-0">
            <QRCodeSVG
              value={qrValue}
              size={104}
              bgColor="#ffffff"
              fgColor="#09090b"
              level="M"
            />
          </div>
        </div>

        {/* Footer Micro-text */}
        <div className="pb-4 px-6 text-center">
          <p className="font-typewriter text-[9.5px] leading-[1.25] text-[#27272a] tracking-[0.02em]">
            This Identification is Property
            <br />
            of the Umbrella Corporation
          </p>
        </div>
      </div>
    );
  }

  // STYLE B: Vertical Facility Keycard (Access Only, No Photo)
  if (data.style === 'facility') {
    return (
      <div
        id="umbrella-id-card"
        ref={badgeRef}
        className="relative w-[340px] h-[538px] rounded-[18px] bg-white text-[#111111] overflow-hidden border-0 ring-0 outline-none flex flex-col justify-between select-none"
      >
        {/* Top Header */}
        <div className="pt-8 px-5 text-center">
          <div
            className="font-umbrella-header font-black text-[29px] leading-none tracking-[0.14em] text-[#111111] uppercase"
            style={{ transform: 'scaleX(1.08)' }}
          >
            UMBRELLA
          </div>
          <div
            className="font-umbrella-header font-medium text-[15.5px] leading-tight tracking-[0.26em] text-[#18181b] uppercase mt-1"
            style={{ transform: 'scaleX(1.06)' }}
          >
            CORPORATION
          </div>
        </div>

        {/* Center Large Octagon Logo */}
        <div className="flex items-center justify-center py-1">
          <UmbrellaOctagonLogo className="w-[168px] h-[168px]" variant="classic" />
        </div>

        {/* Center Bar: Dark Gray Band with Role / Division */}
        <div className="w-full">
          <div className="w-full bg-[#48484a] text-white py-2.5 px-4 text-center shadow-inner">
            <div className="font-extrabold text-[26px] leading-tight tracking-[0.02em] truncate">
              {divisionMeta.facilityBarLabel}
            </div>
          </div>

          {/* Sub-bar: Red Uppercase Monospaced Clearance */}
          <div className="w-full pt-2.5 pb-1 text-center">
            <div className="font-tech-mono font-bold text-[19px] leading-none tracking-[0.17em] text-[#c41e24] uppercase">
              {clearanceMeta.verticalText}
            </div>
          </div>
        </div>

        {/* Bottom Centered Scannable QR Code */}
        <div className="flex items-center justify-center py-1">
          <div className="bg-white p-1">
            <QRCodeSVG
              value={qrValue}
              size={112}
              bgColor="#ffffff"
              fgColor="#09090b"
              level="M"
            />
          </div>
        </div>

        {/* Footer Micro-text */}
        <div className="pb-4 px-6 text-center">
          <p className="font-typewriter text-[9.5px] leading-[1.25] text-[#27272a] tracking-[0.02em]">
            This Identification is Property
            <br />
            of the Umbrella Corporation
          </p>
        </div>
      </div>
    );
  }

  // STYLE C: Horizontal Security Clearance Pass (Black / Hive Edition)
  return (
    <div
      id="umbrella-id-card"
      ref={badgeRef}
      className="relative w-[540px] h-[342px] rounded-[14px] bg-[#08090c] text-white overflow-hidden border-0 ring-0 outline-none flex flex-col justify-between select-none"
    >
      {/* Subtle Brushed Carbon Texture + Centered Watermark Octagon */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 3px)',
        }}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center pt-6 pl-6">
        <UmbrellaOctagonLogo className="w-[215px] h-[215px] opacity-85" variant="watermark" />
      </div>

      {/* Top Header Bar with Right-Side Umbrella Crest */}
      <div className="relative z-10 pt-3.5 px-6 flex items-start justify-between">
        <div className="flex-1 flex flex-col items-center pl-14">
          <div
            className="font-umbrella-header font-black text-[28px] leading-none tracking-[0.16em] text-white uppercase drop-shadow"
            style={{ transform: 'scaleX(1.12)' }}
          >
            UMBRELLA
          </div>
          <div
            className="font-umbrella-header font-bold text-[13px] leading-none tracking-[0.22em] text-zinc-200 uppercase mt-1"
            style={{ transform: 'scaleX(1.1)' }}
          >
            CORPORATION
          </div>
          <div className="font-tech-mono text-[12px] tracking-[0.24em] text-zinc-200 uppercase mt-1.5">
            PERSONAL INFORMATION
          </div>
        </div>

        <div className="flex-shrink-0 -mt-0.5">
          <UmbrellaOctagonLogo className="w-[54px] h-[54px]" variant="crest" />
        </div>
      </div>

      {/* Main 3-Column Body */}
      <div className="relative z-10 px-5 pt-1 flex items-start justify-between gap-3.5 flex-1">
        {/* Left Column: Portrait Photo + Red-Boxed Security Clearance Badge */}
        <div className="w-[122px] flex-shrink-0 flex flex-col gap-1.5">
          <div className="w-[122px] h-[132px] bg-zinc-900 border border-red-900/80 overflow-hidden relative shadow-md">
            <img
              src={data.photoUrl}
              alt={data.fullName || 'Operative Portrait'}
              crossOrigin="anonymous"
              className="w-full h-full object-cover"
              style={{
                transform: `scale(${data.photoZoom || 1}) translate(${data.photoOffsetX || 0}%, ${data.photoOffsetY || 0}%)`,
                transformOrigin: 'center center',
              }}
            />
          </div>

          <div className="w-full bg-[#050608] border border-[#991b1b] py-1 px-1.5 text-center">
            <div className="font-wesker-condensed font-semibold text-[13px] leading-none tracking-[0.14em] text-[#dc2626] uppercase">
              SECURITY LEVEL
            </div>
            <div className="font-wesker-condensed font-bold text-[19px] leading-none tracking-[0.11em] text-white uppercase mt-0.5">
              {clearanceMeta.horizontalText}
            </div>
          </div>
        </div>

        {/* Center Column: Personal Information Fields + Serial Number */}
        <div className="flex-1 pt-0.5 flex flex-col justify-between h-[176px]">
          <div className="font-wesker-condensed font-medium text-[18.5px] leading-[1.06] tracking-[0.06em] text-zinc-100 uppercase space-y-[1px]">
            <div className="truncate">
              <span className="text-zinc-300">NAME: </span>
              <span className="text-white font-semibold">{data.fullName || 'ALBERT WESKER'}</span>
            </div>
            <div>
              <span className="text-zinc-300">YEAR OF BIRTH: </span>
              <span className="text-white">{data.birthYear || '1960'}</span>
            </div>
            <div>
              <span className="text-zinc-300">SEX: </span>
              <span className="text-white">{data.sex || 'MALE'}</span>
            </div>
            <div>
              <span className="text-zinc-300">BLOODTYPE: </span>
              <span className="text-white">{data.bloodType || 'O'}</span>
            </div>
            <div className="truncate">
              <span className="text-zinc-300">ACCESS: </span>
              <span className="text-white">{data.accessZone || 'ALL AREAS'}</span>
            </div>
            <div className="truncate">
              <span className="text-zinc-300">POSITION A: </span>
              <span className="text-white">{data.positionA || 'RESEARCHER'}</span>
            </div>
            <div className="truncate">
              <span className="text-zinc-300">POSITION B: </span>
              <span className="text-white">{data.positionB || 'SECURITY OFFICER'}</span>
            </div>
          </div>

          <div className="font-tech-mono text-[13.5px] leading-none tracking-[0.25em] text-zinc-200 pt-1">
            {data.serialCode || '220-8543077-7060'}
          </div>
        </div>

        {/* Right Column: Biometric Fingerprint Box + Gold Smart Chip */}
        <div className="w-[88px] flex-shrink-0 flex flex-col items-end justify-between h-[176px]">
          <div className="w-[84px] h-[102px] border border-[#991b1b] bg-black overflow-hidden p-0.5">
            <BiometricFingerprint className="w-full h-full" />
          </div>

          <div className="w-[80px] h-[62px] mr-0.5">
            <SmartCardGoldChip className="w-full h-full drop-shadow" />
          </div>
        </div>
      </div>

      {/* Bottom Section: Edge-to-Edge Code-128 Barcode + Motto */}
      <div className="relative z-10 w-full pt-1">
        <div className="w-full bg-zinc-200 border-y border-zinc-400">
          <Code128Barcode
            value={`${data.serialCode}-${data.fullName}-${data.clearance}`}
            className="w-full h-[30px]"
          />
        </div>
        <div className="py-1.5 text-center bg-[#060709]">
          <div className="font-umbrella-header font-semibold text-[10.5px] leading-none tracking-[0.34em] text-zinc-200 uppercase">
            OUR BUSINESS IS LIFE ITSELF
          </div>
        </div>
      </div>
    </div>
  );
};
