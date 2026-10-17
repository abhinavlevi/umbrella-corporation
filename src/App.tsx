import React, { useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import {
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  HelpCircle,
  Image as ImageIcon,
  Loader2,
  RotateCcw,
  Share2,
  Shield,
  SlidersHorizontal,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  BadgeData,
  BadgeStyle,
  CLEARANCE_LEVELS,
  ClearanceLevel,
  OPERATIVE_PORTRAITS,
  OPERATIVE_PRESETS,
  UMBRELLA_DIVISIONS,
  UmbrellaDivision,
} from './types/badge';
import { BadgePreview } from './components/BadgePreview';
import { UmbrellaOctagonLogo } from './components/UmbrellaGraphics';
import { hiveAudio } from './utils/soundFx';
import { getBadgeOpenGraphImage, syncBadgeSeo } from './utils/seoManager';
import { hostImageForSharing } from './utils/imageHost';

function safeEncodePayload(obj: unknown): string {
  const jsonStr = JSON.stringify(obj);
  return btoa(
    encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
}

function safeDecodePayload<T>(encoded: string): T | null {
  try {
    const jsonStr = decodeURIComponent(
      Array.prototype.map
        .call(atob(encoded), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonStr) as T;
  } catch {
    try {
      return JSON.parse(atob(encoded)) as T;
    } catch {
      return null;
    }
  }
}

const DEFAULT_BADGE: BadgeData = {
  ...OPERATIVE_PRESETS[0].data,
  photoZoom: 1,
  photoOffsetX: 0,
  photoOffsetY: 0,
};

export function App() {
  const [badgeData, setBadgeData] = useState<BadgeData>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const presetParam = params.get('preset');
      if (presetParam) {
        const found = OPERATIVE_PRESETS.find((p) => p.id === presetParam);
        if (found) {
          return {
            ...found.data,
            photoZoom: 1,
            photoOffsetX: 0,
            photoOffsetY: 0,
          };
        }
      }
      const encoded = params.get('dossier');
      if (encoded) {
        try {
          const decoded = safeDecodePayload<Record<string, any>>(encoded);
          if (decoded) {
            const presetKey = (decoded.presetId as string) || 'alice';
            return {
              ...DEFAULT_BADGE,
              ...decoded,
              photoUrl:
                decoded.photoUrl && !decoded.photoUrl.startsWith('blob:')
                  ? decoded.photoUrl
                  : OPERATIVE_PORTRAITS[presetKey] || OPERATIVE_PORTRAITS.alice,
            };
          }
        } catch {
          // Fall back to default
        }
      }
    }
    return DEFAULT_BADGE;
  });

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);
  const [showBiometrics, setShowBiometrics] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showFramingControls, setShowFramingControls] = useState<boolean>(false);
  const [showSocialCard, setShowSocialCard] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    syncBadgeSeo(badgeData, window.location.href);
  }, [badgeData]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    hiveAudio.enabled = next;
    if (next) {
      hiveAudio.playSelectChirp();
    }
  };

  const showTemporaryStatus = (message: string) => {
    setStatusBanner(message);
    window.setTimeout(() => {
      setStatusBanner((prev) => (prev === message ? null : prev));
    }, 3500);
  };

  const updateField = <K extends keyof BadgeData>(key: K, value: BadgeData[K]) => {
    setBadgeData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleStyleChange = (newStyle: BadgeStyle) => {
    hiveAudio.playSelectChirp();
    setBadgeData((prev) => ({
      ...prev,
      style: newStyle,
    }));
  };

  const handlePresetSelect = (presetId: string) => {
    hiveAudio.playSelectChirp();
    if (presetId === 'custom') {
      setBadgeData((prev) => ({
        ...prev,
        presetId: 'custom',
      }));
      return;
    }
    const found = OPERATIVE_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    setBadgeData({
      ...found.data,
      photoZoom: 1,
      photoOffsetX: 0,
      photoOffsetY: 0,
    });
    showTemporaryStatus(`Loaded ${found.label} Record`);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    const localUrl = URL.createObjectURL(file);
    objectUrlRef.current = localUrl;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setBadgeData((prev) => ({
          ...prev,
          photoUrl: reader.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);

    setBadgeData((prev) => ({
      ...prev,
      photoUrl: localUrl,
    }));
    hiveAudio.playSelectChirp();
    showTemporaryStatus('Photo Updated');
  };

  const handleResetPhoto = () => {
    hiveAudio.playSelectChirp();
    const fallbackPortrait =
      OPERATIVE_PORTRAITS[badgeData.presetId] || OPERATIVE_PORTRAITS.alice;
    setBadgeData((prev) => ({
      ...prev,
      photoUrl: fallbackPortrait,
      photoZoom: 1,
      photoOffsetX: 0,
      photoOffsetY: 0,
    }));
    showTemporaryStatus('Photo Reset to Default');
  };

  const handleResetFraming = () => {
    hiveAudio.playSelectChirp();
    setBadgeData((prev) => ({
      ...prev,
      photoZoom: 1,
      photoOffsetX: 0,
      photoOffsetY: 0,
    }));
  };

  const triggerDownload = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cardElement = document.getElementById('umbrella-id-card');
    if (!cardElement || isExporting) return;

    setIsExporting(true);
    hiveAudio.playAuthorizationScan();

    try {
      const dataUrl = await toPng(cardElement, {
        pixelRatio: 3,
        cacheBust: true,
        style: {
          boxShadow: 'none',
          border: 'none',
          outline: 'none',
        },
      });

      const sanitizedName = (badgeData.fullName || 'operative')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const link = document.createElement('a');
      link.download = `umbrella-id-${sanitizedName || 'badge'}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showTemporaryStatus('Badge Download Complete');
    } catch {
      showTemporaryStatus('Export Interrupted - Please Retry');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);
    hiveAudio.playSelectChirp();
    showTemporaryStatus('Securing Operative Record & Preparing Public Link...');

    try {
      // If operative has a photo and style is not facility pass, upload an optimized copy for remote viewing
      let publicPhotoUrl: string | undefined = undefined;
      if (badgeData.style !== 'facility' && badgeData.photoUrl) {
        publicPhotoUrl = await hostImageForSharing(badgeData.photoUrl);
      }

      const sharePayload = {
        style: badgeData.style,
        fullName: badgeData.fullName,
        division: badgeData.division,
        clearance: badgeData.clearance,
        height: badgeData.height,
        weight: badgeData.weight,
        eyes: badgeData.eyes,
        hair: badgeData.hair,
        birthYear: badgeData.birthYear,
        sex: badgeData.sex,
        bloodType: badgeData.bloodType,
        accessZone: badgeData.accessZone,
        positionA: badgeData.positionA,
        positionB: badgeData.positionB,
        serialCode: badgeData.serialCode,
        qrContent: badgeData.qrContent,
        presetId: badgeData.presetId,
        photoUrl: publicPhotoUrl,
      };

      const encoded = safeEncodePayload(sharePayload);
      const shareUrl = `${window.location.origin}${window.location.pathname}?dossier=${encodeURIComponent(encoded)}`;
      window.history.replaceState({}, '', shareUrl);

      if (navigator.share) {
        try {
          await navigator.share({
            title: `Umbrella Corporation Access Badge - ${badgeData.fullName}`,
            text: `Umbrella Corporation Access Credential for ${badgeData.fullName} (${badgeData.clearance}).`,
            url: shareUrl,
          });
          showTemporaryStatus('Credential Link Shared Successfully');
          return;
        } catch {
          // User canceled share sheet; fallback to clipboard
        }
      }

      try {
        await navigator.clipboard.writeText(shareUrl);
        showTemporaryStatus('Credential Link Copied to Clipboard');
      } catch {
        showTemporaryStatus('Credential Link Updated in Browser');
      }
    } catch {
      showTemporaryStatus('Sharing Interrupted - Please Retry');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1014] text-slate-200 flex flex-col font-sans">
      {/* Sleek Minimal Header */}
      <header className="border-b border-zinc-800 bg-[#0c0e12] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UmbrellaOctagonLogo className="w-8 h-8 flex-shrink-0" variant="crest" />
            <div>
              <h1 className="font-umbrella-header font-bold text-base tracking-[0.14em] text-white uppercase">
                UMBRELLA CORPORATION
              </h1>
              <p className="text-xs text-zinc-400 tracking-wider">
                The Hive Access Badge Creator
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleSound}
              title={soundEnabled ? 'Mute Terminal Audio' : 'Enable Terminal Audio'}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/80 text-xs text-zinc-300 transition cursor-pointer"
              aria-pressed={soundEnabled}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-red-500" />
                  <span className="hidden sm:inline">Audio On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-zinc-500" />
                  <span className="hidden sm:inline">Muted</span>
                </>
              )}
            </button>
            <span className="text-xs text-zinc-400 uppercase tracking-widest hidden md:inline">
              Official Access System
            </span>
          </div>
        </div>
      </header>

      {/* Main Studio Two-Column Layout */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: CLEAN MINIMAL FORM */}
          <div className="lg:col-span-5 bg-[#14171d] border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl">
            <form
              id="badge-form"
              action="#download"
              method="POST"
              onSubmit={triggerDownload}
              className="space-y-5"
            >
              {/* Card Style Selector (3-Tab Toggle) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  Card Style
                </label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-[#0b0d10] border border-zinc-800 rounded-xl">
                  {[
                    { value: 'personnel' as BadgeStyle, label: 'Personnel' },
                    { value: 'facility' as BadgeStyle, label: 'Facility Keycard' },
                    { value: 'classified' as BadgeStyle, label: 'Classified Black' },
                  ].map((tab) => {
                    const active = badgeData.style === tab.value;
                    return (
                      <button
                        key={tab.value}
                        type="button"
                        onClick={() => handleStyleChange(tab.value)}
                        className={`py-2 px-1 text-xs font-medium rounded-lg transition text-center cursor-pointer ${
                          active
                            ? 'bg-zinc-800 text-white shadow-sm font-semibold'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Preset Selector */}
              <div>
                <label
                  htmlFor="quick-fill-select"
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5"
                >
                  Quick Fill Record
                </label>
                <div className="relative">
                  <select
                    id="quick-fill-select"
                    value={badgeData.presetId}
                    onChange={(e) => handlePresetSelect(e.target.value)}
                    className="hive-select w-full rounded-lg bg-[#0b0d10] border border-zinc-700 px-3.5 pr-10 text-sm text-zinc-200 focus:border-red-600 focus:outline-none"
                  >
                    <option value="alice">Alice Abernathy (Security Officer)</option>
                    <option value="carlos">Carlos Olivera (U.B.C.S. Corporal)</option>
                    <option value="wesker">Albert Wesker (Directorate / Clearance A)</option>
                    <option value="hunk">HUNK (Alpha Team Leader)</option>
                    <option value="birkin">Dr. William Birkin (Virology Director)</option>
                    <option value="custom">Custom Operative</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                </div>
              </div>

              {/* Primary Identity Fields */}
              <div className="space-y-3.5 pt-2 border-t border-zinc-800/80">
                <div>
                  <label
                    htmlFor="full-name"
                    className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5"
                  >
                    Full Name
                  </label>
                  <input
                    id="full-name"
                    type="text"
                    autoComplete="name"
                    value={badgeData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    className="hive-input w-full rounded-lg bg-[#0b0d10] border border-zinc-700 px-3.5 text-sm text-white focus:border-red-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      htmlFor="division-select"
                      className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5"
                    >
                      Division
                    </label>
                    <div className="relative">
                      <select
                        id="division-select"
                        value={badgeData.division}
                        onChange={(e) => {
                          hiveAudio.playSelectChirp();
                          updateField('division', e.target.value as UmbrellaDivision);
                        }}
                        className="hive-select w-full rounded-lg bg-[#0b0d10] border border-zinc-700 px-3.5 pr-9 text-sm text-zinc-200 focus:border-red-600 focus:outline-none"
                      >
                        {UMBRELLA_DIVISIONS.map((div) => (
                          <option key={div.value} value={div.value}>
                            {div.shortBadgeLabel} - {div.value}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="clearance-select"
                      className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5"
                    >
                      Clearance Level
                    </label>
                    <div className="relative">
                      <select
                        id="clearance-select"
                        value={badgeData.clearance}
                        onChange={(e) => {
                          hiveAudio.playSelectChirp();
                          updateField('clearance', e.target.value as ClearanceLevel);
                        }}
                        className="hive-select w-full rounded-lg bg-[#0b0d10] border border-zinc-700 px-3.5 pr-9 text-sm text-zinc-200 focus:border-red-600 focus:outline-none"
                      >
                        {CLEARANCE_LEVELS.map((clr) => (
                          <option key={clr.value} value={clr.value}>
                            {clr.value}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo Upload & Framing (When Style has photo) */}
              {badgeData.style !== 'facility' && (
                <div className="pt-2 border-t border-zinc-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                      Operative Photo
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        hiveAudio.playSelectChirp();
                        setShowFramingControls((prev) => !prev);
                      }}
                      className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 cursor-pointer transition"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-red-500" />
                      <span>{showFramingControls ? 'Close Controls' : 'Zoom & Align'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={badgeData.photoUrl}
                      alt="Thumbnail"
                      className="w-12 h-12 rounded-lg object-cover object-center border border-zinc-700 bg-zinc-900 flex-shrink-0"
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="photo-file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="visually-hidden"
                    />
                    <label
                      htmlFor="photo-file"
                      className="hive-input flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white cursor-pointer transition"
                    >
                      <Camera className="w-4 h-4 text-zinc-300" />
                      <span>Choose Image</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleResetPhoto}
                      title="Reset to default operative photo"
                      className="hive-input px-3 py-2 rounded-lg bg-[#0b0d10] hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-medium cursor-pointer transition flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  {/* Terminal Privacy & Public Sharing Disclosure */}
                  <div className="p-2.5 rounded-lg bg-[#0b0d10] border border-zinc-800 text-[11px] text-zinc-400 leading-relaxed">
                    <span className="font-semibold text-zinc-300 block mb-0.5">
                      Terminal Privacy &amp; Sharing Notice:
                    </span>
                    Uploaded photographs remain strictly local on your workstation for badge customization and high-resolution printing. Your image is never transmitted externally when designing or downloading badges. Only if you generate a public share link will an optimized version be securely hosted so recipients can view your credential.
                  </div>

                  {/* Image Zoom & Alignment Controls */}
                  {showFramingControls && (
                    <div className="p-3.5 bg-[#0b0d10] border border-zinc-800 rounded-xl space-y-3">
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
                        <span className="uppercase tracking-wider">Framing &amp; Alignment</span>
                        <button
                          type="button"
                          onClick={handleResetFraming}
                          className="text-red-400 hover:text-red-300 cursor-pointer"
                        >
                          Center Frame
                        </button>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                          <span>Magnification</span>
                          <span>{Math.round((badgeData.photoZoom || 1) * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="2.5"
                          step="0.05"
                          value={badgeData.photoZoom || 1}
                          onChange={(e) => updateField('photoZoom', parseFloat(e.target.value))}
                          className="w-full accent-red-600 cursor-pointer"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                            <span>Horizontal Shift</span>
                            <span>{badgeData.photoOffsetX || 0}%</span>
                          </div>
                          <input
                            type="range"
                            min="-40"
                            max="40"
                            step="1"
                            value={badgeData.photoOffsetX || 0}
                            onChange={(e) =>
                              updateField('photoOffsetX', parseInt(e.target.value, 10))
                            }
                            className="w-full accent-red-600 cursor-pointer"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                            <span>Vertical Shift</span>
                            <span>{badgeData.photoOffsetY || 0}%</span>
                          </div>
                          <input
                            type="range"
                            min="-40"
                            max="40"
                            step="1"
                            value={badgeData.photoOffsetY || 0}
                            onChange={(e) =>
                              updateField('photoOffsetY', parseInt(e.target.value, 10))
                            }
                            className="w-full accent-red-600 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Optional Collapsible Biometrics & Assignment Details */}
              <div className="pt-2 border-t border-zinc-800/80">
                <button
                  type="button"
                  onClick={() => {
                    hiveAudio.playSelectChirp();
                    setShowBiometrics((prev) => !prev);
                  }}
                  className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-white py-1 cursor-pointer transition"
                >
                  <span>Biometrics &amp; Details</span>
                  {showBiometrics ? (
                    <ChevronUp className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                  )}
                </button>

                {showBiometrics && (
                  <div className="mt-3 space-y-3 pt-1">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div>
                        <label
                          htmlFor="bio-height"
                          className="block text-[11px] text-zinc-400 uppercase mb-1"
                        >
                          Height
                        </label>
                        <input
                          id="bio-height"
                          type="text"
                          value={badgeData.height}
                          onChange={(e) => updateField('height', e.target.value)}
                          className="w-full h-10 rounded-lg bg-[#0b0d10] border border-zinc-700 px-2.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="bio-weight"
                          className="block text-[11px] text-zinc-400 uppercase mb-1"
                        >
                          Weight
                        </label>
                        <input
                          id="bio-weight"
                          type="text"
                          value={badgeData.weight}
                          onChange={(e) => updateField('weight', e.target.value)}
                          className="w-full h-10 rounded-lg bg-[#0b0d10] border border-zinc-700 px-2.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="bio-eyes"
                          className="block text-[11px] text-zinc-400 uppercase mb-1"
                        >
                          Eyes
                        </label>
                        <input
                          id="bio-eyes"
                          type="text"
                          value={badgeData.eyes}
                          onChange={(e) => updateField('eyes', e.target.value)}
                          className="w-full h-10 rounded-lg bg-[#0b0d10] border border-zinc-700 px-2.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="bio-hair"
                          className="block text-[11px] text-zinc-400 uppercase mb-1"
                        >
                          Hair
                        </label>
                        <input
                          id="bio-hair"
                          type="text"
                          value={badgeData.hair}
                          onChange={(e) => updateField('hair', e.target.value)}
                          className="w-full h-10 rounded-lg bg-[#0b0d10] border border-zinc-700 px-2.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label
                          htmlFor="bio-birth"
                          className="block text-[11px] text-zinc-400 uppercase mb-1"
                        >
                          Birth Year
                        </label>
                        <input
                          id="bio-birth"
                          type="text"
                          value={badgeData.birthYear}
                          onChange={(e) => updateField('birthYear', e.target.value)}
                          className="w-full h-10 rounded-lg bg-[#0b0d10] border border-zinc-700 px-2.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="bio-sex"
                          className="block text-[11px] text-zinc-400 uppercase mb-1"
                        >
                          Sex
                        </label>
                        <input
                          id="bio-sex"
                          type="text"
                          value={badgeData.sex}
                          onChange={(e) => updateField('sex', e.target.value)}
                          className="w-full h-10 rounded-lg bg-[#0b0d10] border border-zinc-700 px-2.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="bio-blood"
                          className="block text-[11px] text-zinc-400 uppercase mb-1"
                        >
                          Blood Type
                        </label>
                        <input
                          id="bio-blood"
                          type="text"
                          value={badgeData.bloodType}
                          onChange={(e) => updateField('bloodType', e.target.value)}
                          className="w-full h-10 rounded-lg bg-[#0b0d10] border border-zinc-700 px-2.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label
                          htmlFor="bio-access"
                          className="block text-[11px] text-zinc-400 uppercase mb-1"
                        >
                          Access Sector
                        </label>
                        <input
                          id="bio-access"
                          type="text"
                          value={badgeData.accessZone}
                          onChange={(e) => updateField('accessZone', e.target.value)}
                          className="w-full h-10 rounded-lg bg-[#0b0d10] border border-zinc-700 px-2.5 text-xs text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label
                            htmlFor="bio-pos-a"
                            className="block text-[11px] text-zinc-400 uppercase mb-1"
                          >
                            Position A
                          </label>
                          <input
                            id="bio-pos-a"
                            type="text"
                            value={badgeData.positionA}
                            onChange={(e) => updateField('positionA', e.target.value)}
                            className="w-full h-10 rounded-lg bg-[#0b0d10] border border-zinc-700 px-2.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="bio-pos-b"
                            className="block text-[11px] text-zinc-400 uppercase mb-1"
                          >
                            Position B
                          </label>
                          <input
                            id="bio-pos-b"
                            type="text"
                            value={badgeData.positionB}
                            onChange={(e) => updateField('positionB', e.target.value)}
                            className="w-full h-10 rounded-lg bg-[#0b0d10] border border-zinc-700 px-2.5 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="bio-serial"
                          className="block text-[11px] text-zinc-400 uppercase mb-1"
                        >
                          Serial Code
                        </label>
                        <input
                          id="bio-serial"
                          type="text"
                          autoCorrect="off"
                          autoCapitalize="off"
                          spellCheck={false}
                          value={badgeData.serialCode}
                          onChange={(e) => updateField('serialCode', e.target.value)}
                          className="w-full h-10 rounded-lg bg-[#0b0d10] border border-zinc-700 px-2.5 font-tech-mono text-xs text-zinc-300"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="bio-verification"
                          className="block text-[11px] text-zinc-400 uppercase mb-1"
                        >
                          Optical Verification Payload
                        </label>
                        <input
                          id="bio-verification"
                          type="text"
                          autoCorrect="off"
                          autoCapitalize="off"
                          spellCheck={false}
                          value={badgeData.qrContent}
                          onChange={(e) => updateField('qrContent', e.target.value)}
                          className="w-full h-10 rounded-lg bg-[#0b0d10] border border-zinc-700 px-2.5 font-tech-mono text-xs text-zinc-300"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: PROMINENT CARD PREVIEW ON NEUTRAL MATTE DARK BACKGROUND */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Status Toast / Alert */}
            {statusBanner && (
              <div
                role="status"
                aria-live="polite"
                className="w-full mb-4 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs flex items-center gap-2 shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{statusBanner}</span>
              </div>
            )}

            {/* Neutral, well-lit matte dark stage (#16191f) */}
            <div className="w-full bg-[#16191f] border border-zinc-800 rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center min-h-[560px] overflow-x-auto shadow-inner">
              {/* Soft Drop Shadow Wrapper around the Badge (separated from inner export node) */}
              <div className="shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-[18px]">
                <BadgePreview data={badgeData} />
              </div>
            </div>

            {/* Action Buttons directly beneath preview */}
            <div className="w-full mt-5 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                form="badge-form"
                disabled={isExporting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-red-900/60 text-white font-semibold text-sm shadow-md shadow-red-950/40 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Generating Badge...' : 'Download ID Card'}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                disabled={isSharing}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-transparent hover:bg-zinc-800/80 border border-zinc-700 text-zinc-200 font-medium text-sm transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSharing ? (
                  <>
                    <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                    <span>Securing Link...</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-zinc-400" />
                    <span>Share Credential</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Semantic Corporate Reference & AEO/GEO Knowledge Base */}
        <section aria-labelledby="corporate-reference-heading" className="mt-14 border-t border-zinc-800/80 pt-10 pb-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 border border-red-800/60 text-xs font-semibold text-red-300 tracking-wider uppercase">
                <Shield className="w-3.5 h-3.5 text-red-400" />
                <span>Facility Credential Specifications</span>
              </div>
              <h2 id="corporate-reference-heading" className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                Umbrella Corporation Credential Architecture
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Standard technical operating parameters, physical CR80 dimensions, and clearance tier protocols for the Raccoon City underground research complex.
              </p>
            </div>

            {/* 3 Supported Specifications Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#14171d] border border-zinc-800 rounded-xl p-4 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-red-400">
                  Format A: Personnel Pass
                </div>
                <div className="text-xs text-zinc-300 font-medium">Standard Vertical ID Card</div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Vertical white laminate with 8-segment Umbrella octagon, red-bordered portrait frame, full-width charcoal name band, physical typewriter specs, and high-density checkpoint QR.
                </p>
              </div>

              <div className="bg-[#14171d] border border-zinc-800 rounded-xl p-4 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-red-400">
                  Format B: Facility Keycard
                </div>
                <div className="text-xs text-zinc-300 font-medium">Departmental Bulkhead Pass</div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Non-portrait vertical keycard centered around the crimson Umbrella octagon with wide division banner (Security, U.B.C.S., Lab Staff, Executive) and optical access code.
                </p>
              </div>

              <div className="bg-[#14171d] border border-zinc-800 rounded-xl p-4 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-red-400">
                  Format C: Classified Black
                </div>
                <div className="text-xs text-zinc-300 font-medium">Directorate High-Security Pass</div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Horizontal CR80 matte card with 3D watermark, metallic crest, red-bordered Security Level block, personal dossier, biometric fingerprint, gold EMV chip, and Code-128 barcode.
                </p>
              </div>
            </div>

            {/* Accordion FAQ using native HTML <details> and <summary> per modern guidance */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3">
                <HelpCircle className="w-4 h-4 text-red-500" />
                <span>Frequently Answered Operational Queries (AEO/GEO Index)</span>
              </div>

              <details className="group bg-[#14171d] border border-zinc-800 rounded-xl p-4 transition">
                <summary className="text-xs sm:text-sm font-semibold text-zinc-200 cursor-pointer list-none flex items-center justify-between">
                  <span>How are physical cards scaled for 300 DPI PVC badge printing?</span>
                  <span className="text-red-500 group-open:rotate-180 transition-transform text-xs">▼</span>
                </summary>
                <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
                  The Hive ID Generator exports DOM elements at a 3x retina pixel ratio directly through html-to-image. Vertical passes output at 1020×1614 px and horizontal passes output at 1620×1020 px, aligning with CR80 standard dimensions (85.60 × 53.98 mm) at 300 DPI print fidelity.
                </p>
              </details>

              <details className="group bg-[#14171d] border border-zinc-800 rounded-xl p-4 transition">
                <summary className="text-xs sm:text-sm font-semibold text-zinc-200 cursor-pointer list-none flex items-center justify-between">
                  <span>What security clearance designations are authorized within The Hive?</span>
                  <span className="text-red-500 group-open:rotate-180 transition-transform text-xs">▼</span>
                </summary>
                <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
                  The facility operates on a 6-tier authorization structure: Level 1 (Surface Reception &amp; Transit), Level 2 (Logistics Sub-Level), Level 3 (Bio-Containment Diagnostics), Level 4 (Restricted Sector B Viral Labs), Level 5 (Deep Hive &amp; Red Queen Chamber), and Clearance A (Directorate Command with unrestricted facility access).
                </p>
              </details>

              <details className="group bg-[#14171d] border border-zinc-800 rounded-xl p-4 transition">
                <summary className="text-xs sm:text-sm font-semibold text-zinc-200 cursor-pointer list-none flex items-center justify-between">
                  <span>How do shareable permalinks and OpenGraph preview cards function?</span>
                  <span className="text-red-500 group-open:rotate-180 transition-transform text-xs">▼</span>
                </summary>
                <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
                  Clicking "Share &amp; Social Link" generates an in-memory encoded URL parameter and dynamically synchronizes OpenGraph &amp; Twitter Card meta tags. When posted to Twitter/X, LinkedIn, Discord, or Slack, the link automatically renders an operative-specific 1200×630 preview card.
                </p>
              </details>
            </div>
          </div>
        </section>
      </main>

      {/* Corporate Minimal Footer */}
      <footer className="border-t border-zinc-900 bg-[#0a0c0f] py-4 px-4 sm:px-6 text-center text-xs text-zinc-400 tracking-wider">
        UMBRELLA CORPORATION - OUR BUSINESS IS LIFE ITSELF
      </footer>
    </div>
  );
}

export default App;
