export type BadgeStyle = 'personnel' | 'facility' | 'classified';

export type UmbrellaDivision =
  | 'Security Personnel'
  | 'U.B.C.S. (Umbrella Biohazard Countermeasure Service)'
  | 'U.S.S. (Umbrella Security Service)'
  | 'Virology & Research Division'
  | 'The Hive Facility Operations'
  | 'Executive Management';

export type ClearanceLevel =
  | 'Level 1'
  | 'Level 2'
  | 'Level 3'
  | 'Level 4'
  | 'Level 5'
  | 'Clearance A';

export interface BadgeData {
  style: BadgeStyle;
  fullName: string;
  division: UmbrellaDivision;
  clearance: ClearanceLevel;
  height: string;
  weight: string;
  eyes: string;
  hair: string;
  birthYear: string;
  sex: string;
  bloodType: string;
  accessZone: string;
  positionA: string;
  positionB: string;
  serialCode: string;
  qrContent: string;
  photoUrl: string;
  photoZoom: number;
  photoOffsetX: number;
  photoOffsetY: number;
  presetId: string;
}

export const UMBRELLA_DIVISIONS: { value: UmbrellaDivision; shortBadgeLabel: string; facilityBarLabel: string }[] = [
  {
    value: 'Security Personnel',
    shortBadgeLabel: 'Security',
    facilityBarLabel: 'Security',
  },
  {
    value: 'U.B.C.S. (Umbrella Biohazard Countermeasure Service)',
    shortBadgeLabel: 'U.B.C.S',
    facilityBarLabel: 'U.B.C.S.',
  },
  {
    value: 'U.S.S. (Umbrella Security Service)',
    shortBadgeLabel: 'U.S.S.',
    facilityBarLabel: 'Special Security',
  },
  {
    value: 'Virology & Research Division',
    shortBadgeLabel: 'Research',
    facilityBarLabel: 'Lab Staff',
  },
  {
    value: 'The Hive Facility Operations',
    shortBadgeLabel: 'Hive Ops',
    facilityBarLabel: 'Facility Ops',
  },
  {
    value: 'Executive Management',
    shortBadgeLabel: 'Executive',
    facilityBarLabel: 'Executive',
  },
];

export const CLEARANCE_LEVELS: {
  value: ClearanceLevel;
  verticalText: string;
  horizontalText: string;
  description: string;
}[] = [
  {
    value: 'Level 1',
    verticalText: 'CLEARANCE LEVEL 1',
    horizontalText: 'CLEARANCE 1',
    description: 'Surface Reception & Perimeter Transit',
  },
  {
    value: 'Level 2',
    verticalText: 'CLEARANCE LEVEL 2',
    horizontalText: 'CLEARANCE 2',
    description: 'General Administration & Logistics Sub-Level',
  },
  {
    value: 'Level 3',
    verticalText: 'CLEARANCE LEVEL 3',
    horizontalText: 'CLEARANCE 3',
    description: 'Bio-Containment Support & Diagnostics',
  },
  {
    value: 'Level 4',
    verticalText: 'CLEARANCE LEVEL 4',
    horizontalText: 'CLEARANCE 4',
    description: 'Restricted Viral Testing & Sector B Labs',
  },
  {
    value: 'Level 5',
    verticalText: 'CLEARANCE LEVEL 5',
    horizontalText: 'CLEARANCE 5',
    description: 'Deep Hive Operations & Red Queen Chamber',
  },
  {
    value: 'Clearance A',
    verticalText: 'CLEARANCE LEVEL A',
    horizontalText: 'CLEARANCE A',
    description: 'Directorate Command — Unrestricted All Areas',
  },
];

// High-detail SVG portraits encoded as data URIs for crisp, zero-CORS 300 DPI export
const createSvgDataUri = (svgString: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;

export const OPERATIVE_PORTRAITS: Record<string, string> = {
  alice: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 320">
      <defs>
        <linearGradient id="bgA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#e5e7eb"/>
          <stop offset="100%" stop-color="#cbd5e1"/>
        </linearGradient>
        <linearGradient id="skinA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f5d5c6"/>
          <stop offset="100%" stop-color="#dfb19b"/>
        </linearGradient>
        <linearGradient id="hairA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#453227"/>
          <stop offset="50%" stop-color="#291c14"/>
          <stop offset="100%" stop-color="#1a110b"/>
        </linearGradient>
      </defs>
      <rect width="300" height="320" fill="url(#bgA)"/>
      <!-- Subtle Hive lab background panels -->
      <rect x="14" y="20" width="55" height="260" fill="#94a3b8" opacity="0.25"/>
      <line x1="14" y1="70" x2="69" y2="70" stroke="#64748b" stroke-width="2" opacity="0.4"/>
      <line x1="14" y1="120" x2="69" y2="120" stroke="#64748b" stroke-width="2" opacity="0.4"/>
      <line x1="14" y1="170" x2="69" y2="170" stroke="#64748b" stroke-width="2" opacity="0.4"/>
      <rect x="235" y="20" width="50" height="260" fill="#94a3b8" opacity="0.25"/>
      <line x1="235" y1="90" x2="285" y2="90" stroke="#64748b" stroke-width="3" opacity="0.45"/>
      <line x1="235" y1="140" x2="285" y2="140" stroke="#64748b" stroke-width="3" opacity="0.45"/>
      <!-- Shoulders / Dark Tactical Vest -->
      <path d="M55 320 C65 268, 105 252, 150 252 C195 252, 235 268, 245 320 Z" fill="#1e2024"/>
      <path d="M108 255 L135 320 L165 320 L192 255 Z" fill="#2e3239"/>
      <!-- Neck -->
      <rect x="126" y="202" width="48" height="68" rx="16" fill="url(#skinA)"/>
      <path d="M126 225 Q150 245 174 225 L174 252 L126 252 Z" fill="#c99780" opacity="0.45"/>
      <!-- Back Wavy Bob Hair -->
      <path d="M74 140 C62 185, 76 226, 98 232 C108 205, 200 205, 204 232 C226 224, 238 182, 226 135 C218 75, 188 46, 150 46 C112 46, 82 75, 74 140 Z" fill="url(#hairA)"/>
      <!-- Head / Face -->
      <path d="M98 118 C98 78, 120 62, 150 62 C180 62, 202 78, 202 118 C202 166, 182 212, 150 218 C118 212, 98 166, 98 118 Z" fill="url(#skinA)"/>
      <!-- Cheekbone shading -->
      <path d="M102 145 Q116 175 132 195" stroke="#cf9e87" stroke-width="6" fill="none" opacity="0.35" stroke-linecap="round"/>
      <path d="M198 145 Q184 175 168 195" stroke="#cf9e87" stroke-width="6" fill="none" opacity="0.35" stroke-linecap="round"/>
      <!-- Eyebrows -->
      <path d="M112 122 Q126 116 139 121" stroke="#3b281e" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M161 121 Q174 116 188 122" stroke="#3b281e" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <!-- Eyes (Piercing Grey-Blue) -->
      <ellipse cx="126" cy="133" rx="11" ry="6.5" fill="#ffffff"/>
      <circle cx="126" cy="133" r="5" fill="#64748b"/>
      <circle cx="126" cy="133" r="2.3" fill="#0f172a"/>
      <circle cx="124.5" cy="131.5" r="1.2" fill="#ffffff"/>
      <path d="M113 132 Q126 124 138 132" stroke="#1e1510" stroke-width="2.5" fill="none"/>
      <ellipse cx="174" cy="133" rx="11" ry="6.5" fill="#ffffff"/>
      <circle cx="174" cy="133" r="5" fill="#64748b"/>
      <circle cx="174" cy="133" r="2.3" fill="#0f172a"/>
      <circle cx="172.5" cy="131.5" r="1.2" fill="#ffffff"/>
      <path d="M162 132 Q174 124 187 132" stroke="#1e1510" stroke-width="2.5" fill="none"/>
      <!-- Nose -->
      <path d="M150 132 L147 162 Q150 167 155 163" stroke="#bf8c75" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M142 164 Q150 169 158 164" stroke="#b07d66" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- Lips -->
      <path d="M133 184 Q142 179 150 182 Q158 179 167 184 Q150 187 133 184 Z" fill="#b86b64"/>
      <path d="M134 184 Q150 195 166 184 Q150 186 134 184 Z" fill="#c97d75"/>
      <!-- Front Layered Hair Strands -->
      <path d="M95 105 C105 68, 145 58, 175 72 C152 72, 118 85, 102 132 C94 155, 96 185, 106 205 C85 190, 82 142, 95 105 Z" fill="url(#hairA)"/>
      <path d="M162 64 C192 68, 215 98, 212 148 C210 180, 200 202, 190 212 C202 184, 202 145, 192 115 C184 92, 172 78, 162 64 Z" fill="url(#hairA)"/>
    </svg>
  `),
  carlos: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 320">
      <defs>
        <linearGradient id="bgC" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f1f5f9"/>
          <stop offset="100%" stop-color="#cbd5e1"/>
        </linearGradient>
        <linearGradient id="skinC" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#dfb499"/>
          <stop offset="100%" stop-color="#c29073"/>
        </linearGradient>
      </defs>
      <rect width="300" height="320" fill="url(#bgC)"/>
      <!-- Tactical UBCS Collar & Shoulders -->
      <path d="M35 320 C48 255, 95 242, 150 242 C205 242, 252 255, 265 320 Z" fill="#181a1d"/>
      <path d="M92 242 L112 320 L188 320 L208 242 L185 225 L115 225 Z" fill="#23272c"/>
      <!-- Neck -->
      <rect x="118" y="195" width="64" height="68" rx="14" fill="url(#skinC)"/>
      <path d="M118 220 Q150 242 182 220 L182 248 L118 248 Z" fill="#9c6f56" opacity="0.45"/>
      <!-- Ears -->
      <ellipse cx="92" cy="142" rx="9" ry="18" fill="#c9987c"/>
      <ellipse cx="208" cy="142" rx="9" ry="18" fill="#c9987c"/>
      <!-- Head / Jawline -->
      <path d="M94 108 C94 68, 118 54, 150 54 C182 54, 206 68, 206 108 C206 155, 195 198, 168 216 C156 223, 144 223, 132 216 C105 198, 94 155, 94 108 Z" fill="url(#skinC)"/>
      <!-- Rugged Stubble Shading -->
      <path d="M98 152 C102 188, 122 215, 150 220 C178 215, 198 188, 202 152 C194 176, 178 190, 150 190 C122 190, 106 176, 98 152 Z" fill="#3d2e26" opacity="0.22"/>
      <path d="M128 175 Q150 168 172 175 Q168 184 150 183 Q132 184 128 175 Z" fill="#3d2e26" opacity="0.26"/>
      <!-- Thick Dark Brows -->
      <path d="M108 118 Q125 113 141 119" stroke="#1c1410" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M159 119 Q175 113 192 118" stroke="#1c1410" stroke-width="5" fill="none" stroke-linecap="round"/>
      <!-- Brown Eyes -->
      <ellipse cx="125" cy="129" rx="10.5" ry="5.5" fill="#ffffff"/>
      <circle cx="125" cy="129" r="4.8" fill="#452719"/>
      <circle cx="125" cy="129" r="2.2" fill="#0f0a07"/>
      <circle cx="123.5" cy="127.5" r="1.1" fill="#ffffff"/>
      <ellipse cx="175" cy="129" rx="10.5" ry="5.5" fill="#ffffff"/>
      <circle cx="175" cy="129" r="4.8" fill="#452719"/>
      <circle cx="175" cy="129" r="2.2" fill="#0f0a07"/>
      <circle cx="173.5" cy="127.5" r="1.1" fill="#ffffff"/>
      <!-- Nose -->
      <path d="M150 124 L148 158 Q150 164 156 159" stroke="#9e6f56" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M140 161 Q150 167 160 161" stroke="#9e6f56" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <!-- Mouth -->
      <path d="M132 184 Q150 181 168 184" stroke="#7c4d3a" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M138 190 Q150 194 162 190" stroke="#9e6f56" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- Spiky Dark Brown/Black Hair -->
      <path d="M92 118 C88 85, 98 58, 115 46 L112 36 L126 42 L134 30 L146 40 L156 28 L166 40 L178 32 L184 44 L196 39 L192 52 C206 66, 212 90, 208 118 C202 92, 190 78, 150 76 C110 78, 98 92, 92 118 Z" fill="#18120e"/>
    </svg>
  `),
  wesker: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 320">
      <defs>
        <linearGradient id="bgW" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f8fafc"/>
          <stop offset="100%" stop-color="#cbd5e1"/>
        </linearGradient>
        <linearGradient id="skinW" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f8e2d4"/>
          <stop offset="100%" stop-color="#dfc1af"/>
        </linearGradient>
        <linearGradient id="lensW" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#020617"/>
          <stop offset="45%" stop-color="#0f172a"/>
          <stop offset="55%" stop-color="#1e3a8a"/>
          <stop offset="100%" stop-color="#020617"/>
        </linearGradient>
        <linearGradient id="hairW" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#d4b475"/>
          <stop offset="65%" stop-color="#9a7b42"/>
          <stop offset="100%" stop-color="#5c4722"/>
        </linearGradient>
      </defs>
      <rect width="300" height="320" fill="url(#bgW)"/>
      <!-- High-Collar Black Coat / Tactical Suit -->
      <path d="M30 320 C45 256, 95 242, 150 242 C205 242, 255 256, 270 320 Z" fill="#090b0e"/>
      <path d="M88 228 L115 320 L185 320 L212 228 L192 212 L108 212 Z" fill="#12161c"/>
      <!-- Neck -->
      <rect x="118" y="196" width="64" height="65" rx="12" fill="url(#skinW)"/>
      <!-- Ears -->
      <ellipse cx="92" cy="142" rx="8" ry="17" fill="#dec0ae"/>
      <ellipse cx="208" cy="142" rx="8" ry="17" fill="#dec0ae"/>
      <!-- Chiseled Head -->
      <path d="M94 102 C94 64, 118 52, 150 52 C182 52, 206 64, 206 102 C206 152, 196 196, 170 215 C158 222, 142 222, 130 215 C104 196, 94 152, 94 102 Z" fill="url(#skinW)"/>
      <!-- Slicked-back Blonde/Gold Hair -->
      <path d="M92 114 C88 76, 106 44, 150 44 C194 44, 212 76, 208 114 C202 86, 186 72, 150 72 C114 72, 98 86, 92 114 Z" fill="url(#hairW)"/>
      <!-- Hair Comb Striations -->
      <path d="M112 68 L118 46 M128 65 L132 43 M145 64 L147 42 M162 65 L164 43 M178 68 L182 46" stroke="#785c28" stroke-width="2" opacity="0.6"/>
      <!-- Signature Wrap-Around Dark Sunglasses -->
      <path d="M93 122 Q122 116 146 123 L154 123 Q178 116 207 122 L203 139 Q178 148 156 135 L144 135 Q122 148 97 139 Z" fill="url(#lensW)" stroke="#0f172a" stroke-width="2.5"/>
      <!-- Subtle Specular Glint on Lenses -->
      <path d="M104 124 L134 124 L126 136 L100 132 Z" fill="#60a5fa" opacity="0.28"/>
      <path d="M164 124 L194 124 L186 136 L160 132 Z" fill="#60a5fa" opacity="0.28"/>
      <!-- Sharp Nose -->
      <path d="M150 128 L148 162 Q150 167 156 162" stroke="#b8947f" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <!-- Stern Composed Mouth -->
      <path d="M131 186 Q150 182 169 186" stroke="#9c6e5b" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M140 192 Q150 195 160 192" stroke="#bfa08e" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>
  `),
  birkin: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 320">
      <rect width="300" height="320" fill="#e2e8f0"/>
      <!-- White Lab Coat & Dark Tie -->
      <path d="M35 320 C48 258, 95 244, 150 244 C205 244, 252 258, 265 320 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
      <path d="M118 244 L150 315 L182 244 Z" fill="#1e293b"/>
      <path d="M144 252 L156 252 L159 315 L141 315 Z" fill="#991b1b"/>
      <!-- Neck & Face -->
      <rect x="122" y="198" width="56" height="58" rx="12" fill="#f1d2c2"/>
      <path d="M96 108 C96 68, 120 56, 150 56 C180 56, 204 68, 204 108 C204 156, 190 202, 150 218 C110 202, 96 156, 96 108 Z" fill="#f5d8c8"/>
      <!-- Side-parted Blonde/Light Brown Hair -->
      <path d="M92 120 C86 72, 112 46, 154 46 C192 46, 212 74, 206 118 C198 86, 178 74, 138 78 C118 80, 102 98, 92 120 Z" fill="#b5945b"/>
      <path d="M132 58 C122 82, 114 106, 112 126" stroke="#8c6d3b" stroke-width="3" fill="none"/>
      <!-- Eyes & Lab Glasses -->
      <rect x="106" y="120" width="36" height="22" rx="4" fill="none" stroke="#475569" stroke-width="2.5"/>
      <rect x="158" y="120" width="36" height="22" rx="4" fill="none" stroke="#475569" stroke-width="2.5"/>
      <line x1="142" y1="129" x2="158" y2="129" stroke="#475569" stroke-width="2.5"/>
      <circle cx="124" cy="131" r="4.5" fill="#2563eb"/>
      <circle cx="124" cy="131" r="2" fill="#0f172a"/>
      <circle cx="176" cy="131" r="4.5" fill="#2563eb"/>
      <circle cx="176" cy="131" r="2" fill="#0f172a"/>
      <!-- Nose & Mouth -->
      <path d="M150 130 L147 162 Q150 166 155 162" stroke="#c29985" stroke-width="2.5" fill="none"/>
      <path d="M134 186 Q150 183 166 186" stroke="#9f6e5c" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    </svg>
  `),
  hunk: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 320">
      <rect width="300" height="320" fill="#cbd5e1"/>
      <!-- USS Tactical Armor & Shoulders -->
      <path d="M25 320 C40 250, 90 236, 150 236 C210 236, 260 250, 275 320 Z" fill="#111317"/>
      <!-- Helmet Shell -->
      <path d="M78 135 C76 70, 108 42, 150 42 C192 42, 224 70, 222 135 L228 158 L72 158 Z" fill="#1e2229" stroke="#0f1115" stroke-width="3"/>
      <!-- Gas Mask Faceplate -->
      <path d="M90 132 L210 132 L198 224 L150 246 L102 224 Z" fill="#181b20" stroke="#2e3440" stroke-width="2"/>
      <!-- Signature Red Glowing Lenses -->
      <circle cx="122" cy="152" r="22" fill="#090a0d" stroke="#374151" stroke-width="4"/>
      <circle cx="122" cy="152" r="16" fill="#dc2626"/>
      <circle cx="117" cy="147" r="6" fill="#fca5a5" opacity="0.65"/>
      <circle cx="178" cy="152" r="22" fill="#090a0d" stroke="#374151" stroke-width="4"/>
      <circle cx="178" cy="152" r="16" fill="#dc2626"/>
      <circle cx="173" cy="147" r="6" fill="#fca5a5" opacity="0.65"/>
      <!-- Respirator Snout & Side Filter Canister -->
      <circle cx="150" cy="204" r="24" fill="#262a33" stroke="#111317" stroke-width="3"/>
      <circle cx="150" cy="204" r="16" fill="#111317"/>
      <circle cx="102" cy="208" r="20" fill="#2e3440" stroke="#111317" stroke-width="3"/>
    </svg>
  `),
};

export interface OperativePreset {
  id: string;
  label: string;
  subtitle: string;
  data: Omit<BadgeData, 'photoZoom' | 'photoOffsetX' | 'photoOffsetY'>;
}

export const OPERATIVE_PRESETS: OperativePreset[] = [
  {
    id: 'alice',
    label: 'Alice Abernathy',
    subtitle: 'Hive Entrance Security Officer',
    data: {
      style: 'personnel',
      fullName: 'Alice Abernathy',
      division: 'Security Personnel',
      clearance: 'Level 5',
      height: "5'9",
      weight: '130lbs',
      eyes: 'Grey',
      hair: 'Blonde',
      birthYear: '1979',
      sex: 'FEMALE',
      bloodType: 'O',
      accessZone: 'HIVE PERIMETER & LABS',
      positionA: 'SECURITY OFFICER',
      positionB: 'INTERNAL OPERATIVE',
      serialCode: '220-4190823-5019',
      qrContent: 'UMBRELLA-HIVE://AUTH/ALICE-ABERNATHY/CLR-5/SEC-01',
      photoUrl: OPERATIVE_PORTRAITS.alice,
      presetId: 'alice',
    },
  },
  {
    id: 'carlos',
    label: 'Carlos Olivera',
    subtitle: 'U.B.C.S. Delta Platoon',
    data: {
      style: 'personnel',
      fullName: 'Carlos Olivera',
      division: 'U.B.C.S. (Umbrella Biohazard Countermeasure Service)',
      clearance: 'Level 5',
      height: "6'2",
      weight: '190lbs',
      eyes: 'Brown',
      hair: 'Brown',
      birthYear: '1977',
      sex: 'MALE',
      bloodType: 'A',
      accessZone: 'CONTAINMENT ZONES',
      positionA: 'TACTICAL SPECIALIST',
      positionB: 'U.B.C.S. CORPORAL',
      serialCode: '220-7931104-8821',
      qrContent: 'UMBRELLA-HIVE://AUTH/CARLOS-OLIVERA/CLR-5/UBCS-DELTA',
      photoUrl: OPERATIVE_PORTRAITS.carlos,
      presetId: 'carlos',
    },
  },
  {
    id: 'wesker',
    label: 'Albert Wesker',
    subtitle: 'Executive & Chief Researcher',
    data: {
      style: 'classified',
      fullName: 'ALBERT WESKER',
      division: 'Executive Management',
      clearance: 'Clearance A',
      height: "6'0",
      weight: '198lbs',
      eyes: 'Amber',
      hair: 'Blonde',
      birthYear: '1960',
      sex: 'MALE',
      bloodType: 'O',
      accessZone: 'ALL AREAS',
      positionA: 'RESEARCHER',
      positionB: 'SECURITY OFFICER',
      serialCode: '220-8543077-7060',
      qrContent: 'UMBRELLA-HIVE://COMMAND/ALBERT-WESKER/CLEARANCE-A/ALL-AREAS',
      photoUrl: OPERATIVE_PORTRAITS.wesker,
      presetId: 'wesker',
    },
  },
  {
    id: 'birkin',
    label: 'Dr. William Birkin',
    subtitle: 'Virology & Research Director',
    data: {
      style: 'personnel',
      fullName: 'William Birkin',
      division: 'Virology & Research Division',
      clearance: 'Clearance A',
      height: "5'10",
      weight: '165lbs',
      eyes: 'Blue',
      hair: 'Blonde',
      birthYear: '1962',
      sex: 'MALE',
      bloodType: 'O',
      accessZone: 'NEST & HIVE SECTOR 4',
      positionA: 'CHIEF RESEARCHER',
      positionB: 'VIROLOGY DIRECTOR',
      serialCode: '220-1094482-0012',
      qrContent: 'UMBRELLA-HIVE://LAB/WILLIAM-BIRKIN/CLEARANCE-A/VIROLOGY',
      photoUrl: OPERATIVE_PORTRAITS.birkin,
      presetId: 'birkin',
    },
  },
  {
    id: 'hunk',
    label: 'HUNK (Alpha Team)',
    subtitle: 'U.S.S. Special Security Unit',
    data: {
      style: 'classified',
      fullName: 'H.U.N.K. — ALPHA',
      division: 'U.S.S. (Umbrella Security Service)',
      clearance: 'Level 5',
      height: "5'11",
      weight: '185lbs',
      eyes: 'Brown',
      hair: 'Brown',
      birthYear: '1970',
      sex: 'MALE',
      bloodType: 'AB',
      accessZone: 'ALL RESTRICTED SECTORS',
      positionA: 'UNIT COMMANDER',
      positionB: 'SPECIAL AGENT',
      serialCode: '220-9900412-6604',
      qrContent: 'UMBRELLA-HIVE://USS/ALPHA-LEADER/CLR-5/EXTRACTION',
      photoUrl: OPERATIVE_PORTRAITS.hunk,
      presetId: 'hunk',
    },
  },
];
