// Pre-designed SVG illustration templates for each repair step category
// Clean infographic style with blue/white palette

const BASE_STYLE = `
  <rect width="400" height="300" rx="12" fill="#eef2f7"/>
  <rect x="8" y="8" width="384" height="284" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
`;

const templates: Record<string, string> = {
  measure: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    ${BASE_STYLE}
    <!-- Tape measure body -->
    <rect x="130" y="70" width="140" height="100" rx="12" fill="#2563eb" stroke="#1e3a5f" stroke-width="2"/>
    <rect x="140" y="80" width="120" height="80" rx="8" fill="#3b82f6"/>
    <circle cx="200" cy="120" r="30" fill="#1e3a5f" stroke="#ffffff" stroke-width="2"/>
    <circle cx="200" cy="120" r="18" fill="#2563eb"/>
    <circle cx="200" cy="120" r="6" fill="#ffffff"/>
    <!-- Tape extending -->
    <rect x="270" y="110" width="100" height="20" rx="2" fill="#fbbf24" stroke="#f59e0b" stroke-width="1.5"/>
    <line x1="280" y1="110" x2="280" y2="130" stroke="#d97706" stroke-width="0.75"/>
    <line x1="290" y1="115" x2="290" y2="130" stroke="#d97706" stroke-width="0.75"/>
    <line x1="300" y1="110" x2="300" y2="130" stroke="#d97706" stroke-width="0.75"/>
    <line x1="310" y1="115" x2="310" y2="130" stroke="#d97706" stroke-width="0.75"/>
    <line x1="320" y1="110" x2="320" y2="130" stroke="#d97706" stroke-width="0.75"/>
    <line x1="330" y1="115" x2="330" y2="130" stroke="#d97706" stroke-width="0.75"/>
    <line x1="340" y1="110" x2="340" y2="130" stroke="#d97706" stroke-width="0.75"/>
    <line x1="350" y1="115" x2="350" y2="130" stroke="#d97706" stroke-width="0.75"/>
    <line x1="360" y1="110" x2="360" y2="130" stroke="#d97706" stroke-width="0.75"/>
    <!-- Hand holding tape -->
    <path d="M100 90 Q90 95 85 110 Q80 130 90 150 Q100 160 120 155 L140 140 L140 100 Z" fill="#d4a574" stroke="#1e3a5f" stroke-width="1.5"/>
    <path d="M95 105 Q92 115 95 125" stroke="#c4956a" stroke-width="1" fill="none"/>
    <!-- Surface being measured -->
    <rect x="40" y="200" width="320" height="60" rx="4" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <line x1="60" y1="200" x2="60" y2="260" stroke="#cbd5e1" stroke-width="0.75"/>
    <line x1="120" y1="200" x2="120" y2="260" stroke="#cbd5e1" stroke-width="0.75"/>
    <line x1="180" y1="200" x2="180" y2="260" stroke="#cbd5e1" stroke-width="0.75"/>
    <line x1="240" y1="200" x2="240" y2="260" stroke="#cbd5e1" stroke-width="0.75"/>
    <line x1="300" y1="200" x2="300" y2="260" stroke="#cbd5e1" stroke-width="0.75"/>
    <!-- Measurement arrow -->
    <line x1="100" y1="185" x2="300" y2="185" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrow)" marker-start="url(#arrow-rev)"/>
    <defs>
      <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#3b82f6"/></marker>
      <marker id="arrow-rev" markerWidth="8" markerHeight="8" refX="2" refY="4" orient="auto"><path d="M8,0 L0,4 L8,8" fill="#3b82f6"/></marker>
    </defs>
  </svg>`,

  cut: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    ${BASE_STYLE}
    <!-- Saw blade -->
    <rect x="80" y="100" width="240" height="8" rx="2" fill="#94a3b8" stroke="#1e3a5f" stroke-width="1.5"/>
    <path d="M80 100 L90 92 L100 100 L110 92 L120 100 L130 92 L140 100 L150 92 L160 100 L170 92 L180 100 L190 92 L200 100 L210 92 L220 100 L230 92 L240 100 L250 92 L260 100 L270 92 L280 100 L290 92 L300 100 L310 92 L320 100" fill="none" stroke="#1e3a5f" stroke-width="1.5"/>
    <!-- Saw handle -->
    <path d="M310 85 Q340 80 350 95 Q360 110 350 125 Q340 135 320 130 L310 115 Z" fill="#2563eb" stroke="#1e3a5f" stroke-width="2"/>
    <ellipse cx="335" cy="108" rx="8" ry="6" fill="#1e3a5f"/>
    <!-- Hand on handle -->
    <path d="M325 75 Q320 85 315 95 L310 115 Q305 125 310 135 Q320 145 335 140 Q350 135 355 120 Q358 105 350 90 Q345 80 335 75 Z" fill="#d4a574" stroke="#1e3a5f" stroke-width="1.5"/>
    <!-- Wood piece -->
    <rect x="60" y="160" width="280" height="80" rx="4" fill="#d4a574" stroke="#1e3a5f" stroke-width="2"/>
    <!-- Wood grain -->
    <path d="M70 180 Q150 175 230 182 Q300 188 340 180" fill="none" stroke="#c4956a" stroke-width="0.75"/>
    <path d="M70 200 Q140 195 220 202 Q290 208 340 198" fill="none" stroke="#c4956a" stroke-width="0.75"/>
    <path d="M70 220 Q160 215 240 222 Q310 228 340 218" fill="none" stroke="#c4956a" stroke-width="0.75"/>
    <!-- Cut line -->
    <line x1="200" y1="108" x2="200" y2="240" stroke="#f97316" stroke-width="2" stroke-dasharray="6,3"/>
    <!-- Motion arrow -->
    <path d="M250 70 L200 70" stroke="#3b82f6" stroke-width="2" fill="none" marker-end="url(#arrowC)"/>
    <path d="M150 70 L200 70" stroke="#3b82f6" stroke-width="2" fill="none" marker-end="url(#arrowC2)"/>
    <defs>
      <marker id="arrowC" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#3b82f6"/></marker>
      <marker id="arrowC2" markerWidth="8" markerHeight="8" refX="2" refY="4" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8" fill="#3b82f6"/></marker>
    </defs>
  </svg>`,

  drill: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    ${BASE_STYLE}
    <!-- Drill body -->
    <rect x="140" y="90" width="130" height="55" rx="8" fill="#2563eb" stroke="#1e3a5f" stroke-width="2"/>
    <rect x="120" y="95" width="30" height="45" rx="6" fill="#3b82f6" stroke="#1e3a5f" stroke-width="1.5"/>
    <!-- Drill bit -->
    <rect x="270" y="108" width="60" height="12" rx="2" fill="#94a3b8" stroke="#1e3a5f" stroke-width="1.5"/>
    <polygon points="330,108 345,114 330,120" fill="#6b7280" stroke="#1e3a5f" stroke-width="1"/>
    <!-- Drill handle/grip -->
    <rect x="170" y="145" width="35" height="70" rx="6" fill="#1e3a5f" stroke="#0f172a" stroke-width="1.5"/>
    <rect x="175" y="150" width="25" height="55" rx="4" fill="#2563eb"/>
    <!-- Trigger -->
    <path d="M185 215 Q188 230 195 225 L200 215" fill="#1e3a5f" stroke="#0f172a" stroke-width="1"/>
    <!-- Hand gripping -->
    <path d="M155 145 Q145 155 148 180 Q150 200 160 215 L205 215 Q215 200 212 180 Q210 160 205 145 Z" fill="#d4a574" stroke="#1e3a5f" stroke-width="1.5" opacity="0.7"/>
    <!-- Surface with hole -->
    <rect x="60" y="70" width="40" height="190" rx="4" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
    <!-- Rotation arrows around bit -->
    <path d="M310 95 A20 20 0 0 1 310 133" fill="none" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrowD)"/>
    <path d="M325 133 A20 20 0 0 1 325 95" fill="none" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrowD)"/>
    <!-- Impact point -->
    <circle cx="80" cy="114" r="6" fill="#f97316" opacity="0.4"/>
    <circle cx="80" cy="114" r="3" fill="#f97316"/>
    <defs>
      <marker id="arrowD" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#3b82f6"/></marker>
    </defs>
  </svg>`,

  apply: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    ${BASE_STYLE}
    <!-- Wall surface -->
    <rect x="30" y="30" width="340" height="240" rx="6" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <!-- Applied coating area -->
    <rect x="30" y="30" width="180" height="240" rx="6" fill="#bfdbfe" stroke="none"/>
    <!-- Roller -->
    <rect x="190" y="80" width="50" height="140" rx="25" fill="#2563eb" stroke="#1e3a5f" stroke-width="2"/>
    <rect x="195" y="85" width="40" height="130" rx="20" fill="#3b82f6"/>
    <!-- Roller texture lines -->
    <line x1="200" y1="100" x2="230" y2="100" stroke="#2563eb" stroke-width="0.75"/>
    <line x1="200" y1="115" x2="230" y2="115" stroke="#2563eb" stroke-width="0.75"/>
    <line x1="200" y1="130" x2="230" y2="130" stroke="#2563eb" stroke-width="0.75"/>
    <line x1="200" y1="145" x2="230" y2="145" stroke="#2563eb" stroke-width="0.75"/>
    <line x1="200" y1="160" x2="230" y2="160" stroke="#2563eb" stroke-width="0.75"/>
    <line x1="200" y1="175" x2="230" y2="175" stroke="#2563eb" stroke-width="0.75"/>
    <line x1="200" y1="190" x2="230" y2="190" stroke="#2563eb" stroke-width="0.75"/>
    <!-- Roller handle -->
    <rect x="210" y="55" width="10" height="30" rx="3" fill="#94a3b8" stroke="#1e3a5f" stroke-width="1.5"/>
    <path d="M215 55 L215 30 Q215 20 230 20 L260 20" fill="none" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
    <!-- Hand on handle -->
    <path d="M248 10 Q240 12 238 20 Q236 28 240 35 Q245 40 255 38 Q265 35 268 25 Q270 15 262 10 Z" fill="#d4a574" stroke="#1e3a5f" stroke-width="1.5"/>
    <!-- Direction arrow -->
    <path d="M215 240 L215 260" stroke="#3b82f6" stroke-width="2.5" marker-end="url(#arrowA)"/>
    <path d="M215 80 L215 60" stroke="#3b82f6" stroke-width="2.5" marker-end="url(#arrowA)"/>
    <!-- Paint bucket -->
    <rect x="300" y="210" width="60" height="50" rx="4" fill="#2563eb" stroke="#1e3a5f" stroke-width="2"/>
    <rect x="295" y="205" width="70" height="10" rx="3" fill="#1e3a5f"/>
    <path d="M330 205 Q330 195 330 190" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <defs>
      <marker id="arrowA" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#3b82f6"/></marker>
    </defs>
  </svg>`,

  connect: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    ${BASE_STYLE}
    <!-- Pipe left -->
    <rect x="30" y="120" width="140" height="40" rx="6" fill="#94a3b8" stroke="#1e3a5f" stroke-width="2"/>
    <rect x="155" y="112" width="20" height="56" rx="3" fill="#6b7280" stroke="#1e3a5f" stroke-width="1.5"/>
    <!-- Pipe right -->
    <rect x="230" y="120" width="140" height="40" rx="6" fill="#94a3b8" stroke="#1e3a5f" stroke-width="2"/>
    <rect x="225" y="112" width="20" height="56" rx="3" fill="#6b7280" stroke="#1e3a5f" stroke-width="1.5"/>
    <!-- Connector fitting -->
    <rect x="170" y="105" width="60" height="70" rx="8" fill="#2563eb" stroke="#1e3a5f" stroke-width="2"/>
    <rect x="178" y="115" width="44" height="50" rx="4" fill="#3b82f6"/>
    <line x1="185" y1="120" x2="185" y2="160" stroke="#2563eb" stroke-width="1"/>
    <line x1="195" y1="120" x2="195" y2="160" stroke="#2563eb" stroke-width="1"/>
    <line x1="205" y1="120" x2="205" y2="160" stroke="#2563eb" stroke-width="1"/>
    <line x1="215" y1="120" x2="215" y2="160" stroke="#2563eb" stroke-width="1"/>
    <!-- Wrench -->
    <path d="M170 60 L200 105" stroke="#6b7280" stroke-width="8" stroke-linecap="round"/>
    <path d="M160 50 L180 70 L170 80 L150 60 Z" fill="#6b7280" stroke="#1e3a5f" stroke-width="1.5"/>
    <!-- Hand -->
    <path d="M190 45 Q180 40 170 45 Q155 50 150 60 Q145 70 155 75 Q165 80 175 72 L195 55 Z" fill="#d4a574" stroke="#1e3a5f" stroke-width="1.5"/>
    <!-- Rotation arrow -->
    <path d="M145 85 A35 35 0 0 0 120 55" fill="none" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrowCo)"/>
    <!-- Flow arrows inside pipes -->
    <path d="M50 140 L130 140" stroke="#60a5fa" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrowCo)"/>
    <path d="M270 140 L350 140" stroke="#60a5fa" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrowCo)"/>
    <!-- Water drops -->
    <ellipse cx="200" cy="200" rx="4" ry="6" fill="#3b82f6" opacity="0.5"/>
    <ellipse cx="210" cy="215" rx="3" ry="5" fill="#3b82f6" opacity="0.3"/>
    <defs>
      <marker id="arrowCo" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#3b82f6"/></marker>
    </defs>
  </svg>`,

  remove: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    ${BASE_STYLE}
    <!-- Surface/wall -->
    <rect x="30" y="80" width="340" height="190" rx="4" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
    <!-- Item being removed -->
    <rect x="140" y="120" width="120" height="80" rx="6" fill="#94a3b8" stroke="#1e3a5f" stroke-width="2" transform="rotate(-8 200 160)"/>
    <rect x="150" y="130" width="100" height="60" rx="4" fill="#cbd5e1" transform="rotate(-8 200 160)"/>
    <!-- Pry bar -->
    <path d="M120 200 L100 140 L95 120 Q93 110 100 108 L108 110 L115 130 L135 190 Z" fill="#6b7280" stroke="#1e3a5f" stroke-width="2"/>
    <path d="M95 120 Q90 115 85 118 L80 125 Q82 130 90 128 Z" fill="#94a3b8" stroke="#1e3a5f" stroke-width="1.5"/>
    <!-- Hand on pry bar -->
    <path d="M115 195 Q105 200 108 215 Q112 230 125 228 Q138 225 140 210 Q140 198 130 193 Z" fill="#d4a574" stroke="#1e3a5f" stroke-width="1.5"/>
    <!-- Upward motion arrow -->
    <path d="M200 100 L200 60" stroke="#3b82f6" stroke-width="2.5" marker-end="url(#arrowR)"/>
    <path d="M240 105 L260 65" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrowR)"/>
    <!-- Debris particles -->
    <circle cx="170" cy="100" r="3" fill="#94a3b8" opacity="0.6"/>
    <circle cx="230" cy="90" r="2" fill="#94a3b8" opacity="0.4"/>
    <circle cx="190" cy="85" r="2.5" fill="#94a3b8" opacity="0.5"/>
    <rect x="250" y="95" width="4" height="4" rx="1" fill="#94a3b8" opacity="0.4" transform="rotate(30 252 97)"/>
    <!-- Leverage point -->
    <circle cx="100" cy="130" r="5" fill="#f97316" opacity="0.4"/>
    <defs>
      <marker id="arrowR" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#3b82f6"/></marker>
    </defs>
  </svg>`,

  clean: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    ${BASE_STYLE}
    <!-- Surface -->
    <rect x="30" y="170" width="340" height="100" rx="4" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
    <!-- Dirty area -->
    <ellipse cx="250" cy="200" rx="60" ry="25" fill="#94a3b8" opacity="0.4"/>
    <ellipse cx="300" cy="220" rx="30" ry="15" fill="#94a3b8" opacity="0.3"/>
    <!-- Clean area -->
    <rect x="30" y="170" width="160" height="100" rx="4" fill="#dbeafe" opacity="0.5"/>
    <!-- Sponge/cloth -->
    <rect x="160" y="180" width="60" height="30" rx="6" fill="#fbbf24" stroke="#f59e0b" stroke-width="1.5"/>
    <line x1="170" y1="186" x2="170" y2="204" stroke="#f59e0b" stroke-width="0.75"/>
    <line x1="180" y1="186" x2="180" y2="204" stroke="#f59e0b" stroke-width="0.75"/>
    <line x1="190" y1="186" x2="190" y2="204" stroke="#f59e0b" stroke-width="0.75"/>
    <line x1="200" y1="186" x2="200" y2="204" stroke="#f59e0b" stroke-width="0.75"/>
    <line x1="210" y1="186" x2="210" y2="204" stroke="#f59e0b" stroke-width="0.75"/>
    <!-- Hand -->
    <path d="M155 165 Q148 172 150 185 L165 210 L225 210 L220 185 Q218 172 210 165 Z" fill="#d4a574" stroke="#1e3a5f" stroke-width="1.5"/>
    <!-- Spray bottle -->
    <rect x="60" y="60" width="40" height="70" rx="4" fill="#3b82f6" stroke="#1e3a5f" stroke-width="2"/>
    <rect x="65" y="45" width="30" height="20" rx="3" fill="#2563eb" stroke="#1e3a5f" stroke-width="1.5"/>
    <path d="M95 55 L110 50 L108 58 L95 60 Z" fill="#94a3b8" stroke="#1e3a5f" stroke-width="1"/>
    <!-- Spray particles -->
    <circle cx="125" cy="60" r="2" fill="#93c5fd" opacity="0.6"/>
    <circle cx="135" cy="55" r="1.5" fill="#93c5fd" opacity="0.4"/>
    <circle cx="130" cy="68" r="2" fill="#93c5fd" opacity="0.5"/>
    <circle cx="140" cy="62" r="1" fill="#93c5fd" opacity="0.3"/>
    <circle cx="128" cy="50" r="1.5" fill="#93c5fd" opacity="0.4"/>
    <!-- Motion arrow -->
    <path d="M170 175 L210 175" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrowCl)"/>
    <!-- Sparkle marks for clean area -->
    <path d="M80 190 L85 185 L90 190 L85 195 Z" fill="#60a5fa" opacity="0.5"/>
    <path d="M120 200 L123 197 L126 200 L123 203 Z" fill="#60a5fa" opacity="0.4"/>
    <defs>
      <marker id="arrowCl" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#3b82f6"/></marker>
    </defs>
  </svg>`,

  inspect: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    ${BASE_STYLE}
    <!-- Surface/wall with details -->
    <rect x="30" y="30" width="340" height="240" rx="6" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <line x1="100" y1="30" x2="100" y2="270" stroke="#cbd5e1" stroke-width="0.75"/>
    <line x1="200" y1="30" x2="200" y2="270" stroke="#cbd5e1" stroke-width="0.75"/>
    <line x1="300" y1="30" x2="300" y2="270" stroke="#cbd5e1" stroke-width="0.75"/>
    <!-- Problem area highlighted -->
    <circle cx="200" cy="150" r="45" fill="#f97316" opacity="0.15" stroke="#f97316" stroke-width="2" stroke-dasharray="6,3"/>
    <path d="M180 140 Q190 130 200 135 Q210 140 220 130" stroke="#94a3b8" stroke-width="2" fill="none"/>
    <path d="M185 150 Q195 145 210 155" stroke="#94a3b8" stroke-width="1.5" fill="none"/>
    <!-- Magnifying glass -->
    <circle cx="200" cy="150" r="55" fill="none" stroke="#2563eb" stroke-width="3"/>
    <circle cx="200" cy="150" r="52" fill="none" stroke="#3b82f6" stroke-width="1" opacity="0.5"/>
    <line x1="240" y1="190" x2="290" y2="240" stroke="#1e3a5f" stroke-width="8" stroke-linecap="round"/>
    <line x1="240" y1="190" x2="290" y2="240" stroke="#2563eb" stroke-width="5" stroke-linecap="round"/>
    <!-- Magnified detail inside -->
    <path d="M175 140 Q185 128 200 133 Q215 138 225 125" stroke="#1e3a5f" stroke-width="2.5" fill="none"/>
    <path d="M180 152 Q192 145 215 158" stroke="#1e3a5f" stroke-width="2" fill="none"/>
    <!-- Attention indicators -->
    <circle cx="195" cy="135" r="3" fill="#f97316"/>
    <circle cx="210" cy="148" r="2.5" fill="#f97316"/>
    <!-- Checkmark areas -->
    <path d="M60 60 L70 70 L85 50" stroke="#22c55e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M60 90 L70 100 L85 80" stroke="#22c55e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="340" cy="60" r="8" fill="#f97316" opacity="0.2" stroke="#f97316" stroke-width="1.5"/>
  </svg>`,

  install: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    ${BASE_STYLE}
    <!-- Wall/frame -->
    <rect x="130" y="40" width="140" height="220" rx="4" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
    <!-- Item being installed -->
    <rect x="155" y="90" width="90" height="120" rx="6" fill="#ffffff" stroke="#2563eb" stroke-width="2"/>
    <rect x="165" y="100" width="70" height="100" rx="4" fill="#dbeafe"/>
    <circle cx="200" cy="150" r="15" fill="#3b82f6" opacity="0.3"/>
    <circle cx="200" cy="150" r="6" fill="#2563eb"/>
    <!-- Screwdriver -->
    <rect x="270" y="80" width="8" height="60" rx="2" fill="#fbbf24" stroke="#1e3a5f" stroke-width="1.5"/>
    <rect x="272" y="140" width="4" height="35" rx="1" fill="#94a3b8" stroke="#1e3a5f" stroke-width="1"/>
    <!-- Screw going in -->
    <circle cx="245" cy="105" r="4" fill="#94a3b8" stroke="#1e3a5f" stroke-width="1"/>
    <line x1="243" y1="105" x2="247" y2="105" stroke="#1e3a5f" stroke-width="1"/>
    <circle cx="245" cy="195" r="4" fill="#94a3b8" stroke="#1e3a5f" stroke-width="1"/>
    <line x1="243" y1="195" x2="247" y2="195" stroke="#1e3a5f" stroke-width="1"/>
    <!-- Hand -->
    <path d="M280 60 Q270 65 268 78 L268 95 Q270 105 278 108 Q290 110 298 105 Q305 98 303 85 L300 70 Q295 60 285 58 Z" fill="#d4a574" stroke="#1e3a5f" stroke-width="1.5"/>
    <!-- Alignment guides -->
    <line x1="155" y1="80" x2="245" y2="80" stroke="#3b82f6" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="155" y1="220" x2="245" y2="220" stroke="#3b82f6" stroke-width="1" stroke-dasharray="4,3"/>
    <!-- Downward arrow showing installation -->
    <path d="M200 30 L200 55" stroke="#3b82f6" stroke-width="2.5" marker-end="url(#arrowI)"/>
    <!-- Level indicator -->
    <rect x="60" y="140" width="50" height="20" rx="4" fill="#22c55e" opacity="0.2" stroke="#22c55e" stroke-width="1.5"/>
    <circle cx="85" cy="150" r="5" fill="none" stroke="#22c55e" stroke-width="1.5"/>
    <circle cx="85" cy="150" r="2" fill="#22c55e"/>
    <defs>
      <marker id="arrowI" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#3b82f6"/></marker>
    </defs>
  </svg>`,

  sand: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    ${BASE_STYLE}
    <!-- Surface -->
    <rect x="30" y="160" width="340" height="110" rx="4" fill="#d4a574" stroke="#1e3a5f" stroke-width="2"/>
    <!-- Wood grain -->
    <path d="M40 190 Q120 185 200 192 Q280 198 360 188" fill="none" stroke="#c4956a" stroke-width="0.75"/>
    <path d="M40 210 Q130 205 220 212 Q300 218 360 208" fill="none" stroke="#c4956a" stroke-width="0.75"/>
    <path d="M40 230 Q110 225 190 232 Q270 238 360 228" fill="none" stroke="#c4956a" stroke-width="0.75"/>
    <path d="M40 250 Q140 245 230 252 Q310 258 360 248" fill="none" stroke="#c4956a" stroke-width="0.75"/>
    <!-- Smooth area -->
    <rect x="30" y="160" width="160" height="110" rx="4" fill="#e8c9a0" opacity="0.6"/>
    <!-- Sanding block -->
    <rect x="150" y="130" width="80" height="35" rx="4" fill="#2563eb" stroke="#1e3a5f" stroke-width="2"/>
    <rect x="155" y="160" width="70" height="6" rx="1" fill="#fbbf24"/>
    <!-- Sandpaper texture -->
    <line x1="158" y1="163" x2="222" y2="163" stroke="#f59e0b" stroke-width="0.5" stroke-dasharray="1,2"/>
    <!-- Hand on block -->
    <path d="M140 110 Q135 118 138 130 L148 135 L232 135 L238 125 Q240 115 235 108 Q225 100 200 98 Q170 96 150 100 Z" fill="#d4a574" stroke="#1e3a5f" stroke-width="1.5"/>
    <!-- Motion arrows -->
    <path d="M160 120 L220 120" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrowS)"/>
    <path d="M220 125 L160 125" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrowS)"/>
    <!-- Dust particles -->
    <circle cx="240" cy="155" r="1.5" fill="#d4a574" opacity="0.5"/>
    <circle cx="248" cy="148" r="1" fill="#d4a574" opacity="0.4"/>
    <circle cx="235" cy="145" r="1.5" fill="#d4a574" opacity="0.3"/>
    <circle cx="252" cy="152" r="1" fill="#d4a574" opacity="0.4"/>
    <circle cx="260" cy="145" r="1.5" fill="#d4a574" opacity="0.3"/>
    <defs>
      <marker id="arrowS" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#3b82f6"/></marker>
    </defs>
  </svg>`,

  paint: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    ${BASE_STYLE}
    <!-- Wall -->
    <rect x="30" y="30" width="340" height="240" rx="6" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <!-- Painted area -->
    <path d="M30 30 L200 30 L200 270 L30 270 Z" fill="#bfdbfe" rx="6"/>
    <!-- Paint edge drips -->
    <path d="M200 30 L200 270" stroke="#93c5fd" stroke-width="3"/>
    <path d="M200 80 Q205 95 203 110" stroke="#93c5fd" stroke-width="2" fill="none"/>
    <path d="M200 150 Q207 165 204 175" stroke="#93c5fd" stroke-width="1.5" fill="none"/>
    <!-- Paintbrush -->
    <rect x="195" y="60" width="30" height="12" rx="2" fill="#1e3a5f"/>
    <rect x="185" y="55" width="50" height="5" rx="1" fill="#94a3b8" stroke="#1e3a5f" stroke-width="1"/>
    <!-- Brush bristles -->
    <rect x="198" y="72" width="24" height="30" rx="2" fill="#fbbf24" stroke="#f59e0b" stroke-width="1"/>
    <line x1="202" y1="75" x2="202" y2="100" stroke="#f59e0b" stroke-width="0.5"/>
    <line x1="206" y1="75" x2="206" y2="100" stroke="#f59e0b" stroke-width="0.5"/>
    <line x1="210" y1="75" x2="210" y2="100" stroke="#f59e0b" stroke-width="0.5"/>
    <line x1="214" y1="75" x2="214" y2="100" stroke="#f59e0b" stroke-width="0.5"/>
    <line x1="218" y1="75" x2="218" y2="100" stroke="#f59e0b" stroke-width="0.5"/>
    <!-- Brush handle extending up -->
    <rect x="205" y="20" width="10" height="40" rx="3" fill="#d4a574" stroke="#1e3a5f" stroke-width="1.5"/>
    <!-- Hand gripping handle (at top) -->
    <path d="M198 15 Q195 8 200 5 Q210 0 220 5 Q225 10 222 18 L222 30 L198 30 Z" fill="#d4a574" stroke="#1e3a5f" stroke-width="1.5"/>
    <!-- Paint can -->
    <rect x="290" y="200" width="60" height="55" rx="4" fill="#2563eb" stroke="#1e3a5f" stroke-width="2"/>
    <rect x="285" y="195" width="70" height="10" rx="3" fill="#1e3a5f"/>
    <path d="M355 220 Q365 218 368 225 Q370 232 365 234" fill="#93c5fd" stroke="none"/>
    <!-- Masking tape line -->
    <rect x="195" y="30" width="10" height="240" fill="#fbbf24" opacity="0.4"/>
    <!-- Down stroke arrow -->
    <path d="M175 50 L175 100" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrowP)"/>
    <defs>
      <marker id="arrowP" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#3b82f6"/></marker>
    </defs>
  </svg>`,

  seal: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    ${BASE_STYLE}
    <!-- Two surfaces meeting (corner/joint) -->
    <rect x="30" y="150" width="340" height="120" rx="4" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
    <rect x="30" y="30" width="340" height="125" rx="4" fill="#cbd5e1" stroke="#94a3b8" stroke-width="2"/>
    <!-- Gap between surfaces -->
    <rect x="30" y="150" width="340" height="6" fill="#1e3a5f" opacity="0.2"/>
    <!-- Sealant line -->
    <path d="M30 153 Q100 150 200 153 Q300 156 370 153" stroke="#ffffff" stroke-width="6" fill="none" stroke-linecap="round"/>
    <!-- Caulk gun -->
    <rect x="200" y="70" width="120" height="25" rx="4" fill="#94a3b8" stroke="#1e3a5f" stroke-width="2"/>
    <rect x="190" y="60" width="20" height="45" rx="3" fill="#2563eb" stroke="#1e3a5f" stroke-width="1.5"/>
    <!-- Nozzle -->
    <polygon points="190,75 160,80 160,84 190,85" fill="#1e3a5f"/>
    <circle cx="160" cy="82" r="3" fill="#ffffff" opacity="0.7"/>
    <!-- Trigger -->
    <path d="M260 95 L255 115 L248 115 L250 95" fill="#6b7280" stroke="#1e3a5f" stroke-width="1"/>
    <!-- Handle -->
    <rect x="290 " y="60" width="15" height="50" rx="4" fill="#2563eb" stroke="#1e3a5f" stroke-width="1.5"/>
    <!-- Hand -->
    <path d="M240 50 Q230 55 228 70 L230 100 Q232 115 245 118 Q260 120 268 112 Q275 105 273 90 L270 60 Q265 50 250 48 Z" fill="#d4a574" stroke="#1e3a5f" stroke-width="1.5"/>
    <!-- Sealant coming out -->
    <path d="M160 82 Q155 120 155 153" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.7"/>
    <!-- Direction arrow -->
    <path d="M100 140 L60 140" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrowSe)"/>
    <defs>
      <marker id="arrowSe" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#3b82f6"/></marker>
    </defs>
  </svg>`,

  tighten: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    ${BASE_STYLE}
    <!-- Fixture/pipe -->
    <rect x="160" y="80" width="80" height="140" rx="6" fill="#94a3b8" stroke="#1e3a5f" stroke-width="2"/>
    <rect x="155" y="130" width="90" height="30" rx="4" fill="#6b7280" stroke="#1e3a5f" stroke-width="1.5"/>
    <!-- Hex nut -->
    <polygon points="200,125 220,135 220,155 200,165 180,155 180,135" fill="#94a3b8" stroke="#1e3a5f" stroke-width="2"/>
    <polygon points="200,130 215,138 215,152 200,160 185,152 185,138" fill="#cbd5e1"/>
    <!-- Wrench -->
    <path d="M220 145 L300 100" stroke="#6b7280" stroke-width="10" stroke-linecap="round"/>
    <path d="M220 135 L228 135 L228 155 L220 155" fill="#6b7280" stroke="#1e3a5f" stroke-width="1"/>
    <!-- Wrench jaw -->
    <path d="M215 130 L230 130 L230 160 L215 160" fill="#94a3b8" stroke="#1e3a5f" stroke-width="1.5"/>
    <!-- Hand -->
    <path d="M285 85 Q275 80 270 88 L265 98 Q263 108 270 112 Q280 118 290 115 Q305 110 310 98 Q312 88 305 82 Z" fill="#d4a574" stroke="#1e3a5f" stroke-width="1.5"/>
    <!-- Rotation arrow -->
    <path d="M240 110 A40 40 0 0 1 200 80" fill="none" stroke="#3b82f6" stroke-width="2.5" marker-end="url(#arrowT)"/>
    <!-- Surface/wall -->
    <rect x="170" y="220" width="60" height="50" rx="4" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <!-- Connection to surface -->
    <rect x="190" y="215" width="20" height="15" fill="#94a3b8" stroke="#1e3a5f" stroke-width="1"/>
    <defs>
      <marker id="arrowT" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#3b82f6"/></marker>
    </defs>
  </svg>`,

  test: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    ${BASE_STYLE}
    <!-- Clipboard -->
    <rect x="120" y="40" width="160" height="220" rx="8" fill="#ffffff" stroke="#1e3a5f" stroke-width="2"/>
    <rect x="170" y="30" width="60" height="20" rx="4" fill="#2563eb" stroke="#1e3a5f" stroke-width="1.5"/>
    <circle cx="200" cy="40" r="5" fill="#ffffff"/>
    <!-- Checklist items -->
    <rect x="140" y="70" width="18" height="18" rx="3" fill="#22c55e" stroke="#16a34a" stroke-width="1.5"/>
    <path d="M145 80 L149 84 L155 74" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round"/>
    <rect x="168" y="73" width="90" height="10" rx="2" fill="#e2e8f0"/>
    <rect x="140" y="100" width="18" height="18" rx="3" fill="#22c55e" stroke="#16a34a" stroke-width="1.5"/>
    <path d="M145 110 L149 114 L155 104" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round"/>
    <rect x="168" y="103" width="80" height="10" rx="2" fill="#e2e8f0"/>
    <rect x="140" y="130" width="18" height="18" rx="3" fill="#22c55e" stroke="#16a34a" stroke-width="1.5"/>
    <path d="M145 140 L149 144 L155 134" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round"/>
    <rect x="168" y="133" width="95" height="10" rx="2" fill="#e2e8f0"/>
    <rect x="140" y="160" width="18" height="18" rx="3" fill="#22c55e" stroke="#16a34a" stroke-width="1.5"/>
    <path d="M145 170 L149 174 L155 164" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round"/>
    <rect x="168" y="163" width="70" height="10" rx="2" fill="#e2e8f0"/>
    <rect x="140" y="190" width="18" height="18" rx="3" fill="#fbbf24" stroke="#f59e0b" stroke-width="1.5"/>
    <rect x="168" y="193" width="85" height="10" rx="2" fill="#e2e8f0"/>
    <!-- Big checkmark overlay -->
    <path d="M300 80 L330 110 L370 50" stroke="#22c55e" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.3"/>
    <!-- Thumbs up -->
    <circle cx="80" cy="200" r="30" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
    <path d="M70 210 L70 195 Q70 185 80 185 L85 185 L88 175 Q90 170 95 172 Q98 174 96 180 L93 188 L100 188 Q105 188 105 193 Q106 198 102 200 Q106 202 105 207 Q104 212 100 213 Q103 215 102 220 Q100 224 95 224 L78 224 Q70 224 70 216 Z" fill="#d4a574" stroke="#1e3a5f" stroke-width="1.5"/>
  </svg>`,
};

// Fallback for any unmapped icon
const fallbackTemplate = templates.install;

export function getStepIllustration(icon: string): string {
  return templates[icon] || fallbackTemplate;
}

export const AVAILABLE_ICONS = Object.keys(templates);
