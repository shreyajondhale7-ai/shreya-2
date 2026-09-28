/**
 * AgroPulse AI — Smart Agriculture & AI Advisory Platform
 * Interactive Core Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initCropAdvisory();
  initFieldTelemetry();
  initDiseaseScanner();
  initAgroBotChat();
  initFaqAccordion();
  initNewsletter();
  initSmoothScroll();
});

/* ==========================================================================
   1. Interactive AI Crop Advisory & Soil Prescription Engine
   ========================================================================== */
const cropDatabase = {
  wheat: {
    name: 'Durum / Bread Wheat',
    idealPh: '6.0 - 7.5',
    baseN: 120, baseP: 60, baseK: 40,
    irrigationDays: 'Every 8-10 days',
    waterRequirement: 'Drip or Flood: 450 mm total',
    vulnerabilities: 'Yellow rust, Powdery mildew, Termites',
    stageAdvice: {
      seedling: 'Focus on root establishment. Apply starter DAP and zinc sulfate.',
      vegetative: 'Rapid tillering phase. Top-dress with Nitrogen (Urea) before 1st crown root irrigation.',
      flowering: 'Critical moisture window. Maintain optimal soil moisture to prevent sterile spikelets.',
      fruiting: 'Grain filling in progress. Avoid excess nitrogen to prevent lodging.'
    }
  },
  rice: {
    name: 'Paddy Rice',
    idealPh: '5.5 - 6.5',
    baseN: 140, baseP: 50, baseK: 60,
    irrigationDays: 'Continuous 3-5 cm standing water / Alternate wetting',
    waterRequirement: '1100 - 1250 mm total',
    vulnerabilities: 'Stem borer, Blast (Magnaporthe), Brown plant hopper',
    stageAdvice: {
      seedling: 'Maintain 2 cm water layer in nursery. Protect against leaf thrips.',
      vegetative: 'Active tillering. Split urea application into 2 doses with neem-coated urea.',
      flowering: 'Panicle initiation stage. Keep soil consistently saturated; spray potassium silicate.',
      fruiting: 'Milky to dough stage. Drain water 10-12 days prior to harvest.'
    }
  },
  cotton: {
    name: 'Bt / Hybrid Cotton',
    idealPh: '6.5 - 8.0',
    baseN: 150, baseP: 75, baseK: 75,
    irrigationDays: 'Every 12-14 days (drip preferred)',
    waterRequirement: '700 - 800 mm total',
    vulnerabilities: 'Pink bollworm, Whitefly, Bacterial blight',
    stageAdvice: {
      seedling: 'Thin seedlings to 1 healthy plant per hill. Watch for sucking pests.',
      vegetative: 'Square formation stage. Apply bio-stimulant and ensure magnesium & boron availability.',
      flowering: 'Peak flowering & boll development. High potassium demand to boost fiber quality.',
      fruiting: 'Boll bursting phase. Cease irrigation 2 weeks before first picking.'
    }
  },
  soybean: {
    name: 'Soybean',
    idealPh: '6.0 - 7.0',
    baseN: 30, baseP: 60, baseK: 40,
    irrigationDays: 'Every 10-12 days during dry spells',
    waterRequirement: '450 - 550 mm total',
    vulnerabilities: 'Girdle beetle, Yellow mosaic virus, Rust',
    stageAdvice: {
      seedling: 'Ensure Rhizobium inoculation on seeds to maximize biological nitrogen fixation.',
      vegetative: 'Foliar spray of 19-19-19 water soluble fertilizer for robust canopy.',
      flowering: 'Pod initiation stage. Avoid water logging and drought stress completely.',
      fruiting: 'Pod filling. Spray 0-0-50 (potassium sulphate) for seed weight density.'
    }
  },
  tomato: {
    name: 'High-Yield Tomato',
    idealPh: '6.0 - 6.8',
    baseN: 160, baseP: 90, baseK: 120,
    irrigationDays: 'Daily light drip / alternate days',
    waterRequirement: '600 mm total',
    vulnerabilities: 'Early Blight, Fruit Borer (Helicoverpa), Blossom End Rot',
    stageAdvice: {
      seedling: 'Transplant sturdy 25-day seedlings with Trichoderma viride root dip.',
      vegetative: 'Stake vines firmly. Prune suckers and provide calcium nitrate to avoid blossom rot.',
      flowering: 'Apply micronutrient boron spray to boost fruit set percentage.',
      fruiting: 'Uniform drip fertigation with high potassium to enhance lycopene and firmness.'
    }
  },
  maize: {
    name: 'Hybrid Grain Maize',
    idealPh: '5.8 - 7.2',
    baseN: 135, baseP: 60, baseK: 50,
    irrigationDays: 'Every 8-10 days',
    waterRequirement: '500 - 600 mm total',
    vulnerabilities: 'Fall Armyworm (Spodoptera frugiperda), Stem borer, Turcicum leaf blight',
    stageAdvice: {
      seedling: 'Scout whorls immediately for early Fall Armyworm egg masses and pinholes.',
      vegetative: 'Knee-high stage: apply 2nd dose of Nitrogen and inter-cultivate for aeration.',
      flowering: 'Tasseling and silking: most critical water phase. Any drought reduces yield by 40%.',
      fruiting: 'Cob filling: maintain soil moisture until black layer maturity forms at kernel base.'
    }
  }
};

function initCropAdvisory() {
  const form = document.getElementById('advisoryForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    calculatePrescription();
  });

  // Calculate once on load with default values
  calculatePrescription();
}

function calculatePrescription() {
  const cropKey = document.getElementById('cropSelect')?.value || 'wheat';
  const stage = document.getElementById('stageSelect')?.value || 'vegetative';
  const soilType = document.getElementById('soilSelect')?.value || 'black';
  const condition = document.getElementById('conditionSelect')?.value || 'normal';

  const crop = cropDatabase[cropKey] || cropDatabase['wheat'];

  // Calculate dynamic modifiers
  let nFactor = 1.0;
  let pFactor = 1.0;
  let kFactor = 1.0;
  let waterSchedule = crop.irrigationDays;
  let alertNote = '';

  if (soilType === 'sandy') {
    nFactor *= 1.15; // Leaching in sand
    kFactor *= 1.1;
    waterSchedule += ' (Split into frequent short cycles due to low sand retention)';
  } else if (soilType === 'clay') {
    waterSchedule += ' (Allow 24h soil aeration to prevent root hypoxia)';
  }

  if (condition === 'deficiency') {
    nFactor *= 1.25;
    alertNote = '⚠️ Chlorosis/Deficiency detected: Add 5 kg/ha Chelated Zinc & 1% Urea foliar spray within 48h.';
  } else if (condition === 'drought') {
    nFactor *= 0.85; // Avoid salt burn
    kFactor *= 1.2; // Potassium boosts stomatal water retention
    alertNote = '💧 Drought protocol activated: Apply anti-transpirant / Kaolin clay spray and mulch roots.';
  } else if (condition === 'excess') {
    waterSchedule = 'Halt all irrigation for 5 days. Ensure open drainage channels.';
    alertNote = '🌧️ High soil saturation: Spray Copper Fungicide to prevent Pythium root rot.';
  }

  const finalN = Math.round(crop.baseN * nFactor);
  const finalP = Math.round(crop.baseP * pFactor);
  const finalK = Math.round(crop.baseK * kFactor);

  // Update UI Elements
  const titleElem = document.getElementById('resCropTitle');
  if (titleElem) titleElem.textContent = `${crop.name} — ${stage.toUpperCase()} PHASE`;

  const nVal = document.getElementById('resNVal');
  const pVal = document.getElementById('resPVal');
  const kVal = document.getElementById('resKVal');

  if (nVal) nVal.textContent = `${finalN} kg/ha`;
  if (pVal) pVal.textContent = `${finalP} kg/ha`;
  if (kVal) kVal.textContent = `${finalK} kg/ha`;

  // Update meter widths (capped to 100%)
  const nFill = document.getElementById('resNFill');
  const pFill = document.getElementById('resPFill');
  const kFill = document.getElementById('resKFill');

  if (nFill) nFill.style.width = `${Math.min(100, Math.round((finalN / 180) * 100))}%`;
  if (pFill) pFill.style.width = `${Math.min(100, Math.round((finalP / 120) * 100))}%`;
  if (kFill) kFill.style.width = `${Math.min(100, Math.round((finalK / 140) * 100))}%`;

  // Details
  const irriElem = document.getElementById('resIrrigation');
  if (irriElem) irriElem.textContent = waterSchedule;

  const yieldElem = document.getElementById('resYieldGain');
  if (yieldElem) yieldElem.textContent = '+18% to +26% Projected';

  const actionBox = document.getElementById('resActionPlan');
  if (actionBox) {
    actionBox.innerHTML = `
      <strong>AI Agronomy Protocol:</strong> ${crop.stageAdvice[stage] || crop.stageAdvice.vegetative}
      ${alertNote ? `<div style="margin-top: 8px; color: #00f59b;">${alertNote}</div>` : ''}
    `;
  }

  showToast(`Updated AI Prescription for ${crop.name}`);
}

/* ==========================================================================
   2. Live Field Telemetry Matrix & Simulator
   ========================================================================== */
const sectorData = {
  sectorA: {
    name: 'Sector A: Highland Wheat Field',
    moisture: 72,
    temp: 24.6,
    humidity: 62,
    nitrogen: 148,
    phosphorus: 64,
    potassium: 92,
    valveState: 'Auto-Drip Active (Cycle 3)',
    healthIndex: '98.2% Optimal'
  },
  sectorB: {
    name: 'Sector B: Precision Drip Cotton',
    moisture: 56,
    temp: 29.8,
    humidity: 48,
    nitrogen: 122,
    phosphorus: 49,
    potassium: 115,
    valveState: 'Standby (Next run 16:30)',
    healthIndex: '94.5% Good'
  },
  sectorC: {
    name: 'Sector C: Hydroponic Super-Greens',
    moisture: 86,
    temp: 21.4,
    humidity: 71,
    nitrogen: 182,
    phosphorus: 78,
    potassium: 142,
    valveState: 'Nutrient Mist Continuous',
    healthIndex: '99.7% Peak'
  }
};

let currentSector = 'sectorA';

function initFieldTelemetry() {
  const tabs = document.querySelectorAll('.sector-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentSector = tab.dataset.sector || 'sectorA';
      renderSectorTelemetry(currentSector);
      showToast(`Switched telemetry stream to ${sectorData[currentSector].name}`);
    });
  });

  // Action buttons
  const droneBtn = document.getElementById('btnDroneSweep');
  if (droneBtn) {
    droneBtn.addEventListener('click', () => {
      showToast('🚁 Autonomous Drone Alpha-7 dispatched for multispectral NDVI sweep!');
    });
  }

  const valveBtn = document.getElementById('btnValveToggle');
  if (valveBtn) {
    valveBtn.addEventListener('click', () => {
      const data = sectorData[currentSector];
      if (data.valveState.includes('Active') || data.valveState.includes('Continuous')) {
        data.valveState = 'Manually Paused';
        showToast(`🛑 Drip solenoid valves paused for ${data.name}`);
      } else {
        data.valveState = 'Auto-Drip Active (Flushing)';
        showToast(`💧 Drip solenoid valves activated for ${data.name}`);
      }
      renderSectorTelemetry(currentSector);
    });
  }

  // Periodic micro-fluctuations every 4.5s
  setInterval(() => {
    simulateLiveFluctuation();
  }, 4500);

  renderSectorTelemetry(currentSector);
}

function renderSectorTelemetry(sectorKey) {
  const data = sectorData[sectorKey];
  if (!data) return;

  const moistureVal = document.getElementById('telMoistureVal');
  const moistureBar = document.getElementById('telMoistureBar');
  const tempVal = document.getElementById('telTempVal');
  const humidityVal = document.getElementById('telHumidityVal');
  const npkVal = document.getElementById('telNpkVal');
  const valveVal = document.getElementById('telValveState');

  if (moistureVal) moistureVal.innerHTML = `${data.moisture}<span>%</span>`;
  if (moistureBar) moistureBar.style.width = `${data.moisture}%`;
  if (tempVal) tempVal.innerHTML = `${data.temp.toFixed(1)}<span>°C</span>`;
  if (humidityVal) humidityVal.innerHTML = `${data.humidity}<span>%</span>`;
  if (npkVal) npkVal.innerHTML = `${data.nitrogen} <span>ppm</span>`;
  if (valveVal) valveVal.textContent = data.valveState;
}

function simulateLiveFluctuation() {
  const data = sectorData[currentSector];
  if (!data) return;

  // Add small natural jitter
  const dM = (Math.random() * 0.6 - 0.3);
  const dT = (Math.random() * 0.4 - 0.2);
  const dH = Math.round(Math.random() * 2 - 1);

  data.moisture = Math.max(30, Math.min(95, Math.round((data.moisture + dM) * 10) / 10));
  data.temp = Math.max(18, Math.min(38, Math.round((data.temp + dT) * 10) / 10));
  data.humidity = Math.max(30, Math.min(95, data.humidity + dH));

  renderSectorTelemetry(currentSector);
}

/* ==========================================================================
   3. AI Plant Health & Disease Diagnostics Scanner
   ========================================================================== */
const sampleScans = {
  sample1: {
    title: 'Early Blight Infection',
    target: 'Solanum lycopersicum (Tomato)',
    pathogen: 'Alternaria solani (Early Blight)',
    confidence: '97.4%',
    severity: 'Moderate (Stage 2 concentric ring lesions)',
    recommendation: 'Spray Azoxystrobin (23% SC) @ 1 ml/L or Chlorothalonil 75% WP. Avoid overhead wetting.',
    organicAlternative: 'Apply Trichoderma harzianum soil drench and Neem oil 1500ppm foliar coat.',
    imageSrc: 'assets/images/leaf_scan.jpg'
  },
  sample2: {
    title: 'Yellow Rust Stripe',
    target: 'Triticum aestivum (Wheat)',
    pathogen: 'Puccinia striiformis (Yellow Rust)',
    confidence: '98.8%',
    severity: 'High (Active linear pustules spreading)',
    recommendation: 'Immediate foliar spray of Propiconazole 25% EC (Tilt) @ 1 ml/L water.',
    organicAlternative: 'Sulfur dust 25 kg/ha at morning dew to suppress spore dispersal.',
    imageSrc: 'assets/images/leaf_scan.jpg'
  },
  sample3: {
    title: 'Bacterial Leaf Blight',
    target: 'Gossypium hirsutum (Cotton)',
    pathogen: 'Xanthomonas citri pv. malvacearum',
    confidence: '95.6%',
    severity: 'Moderate (Angular water-soaked spots on foliage)',
    recommendation: 'Spray Copper Oxychloride 50 WP (2.5 g/L) + Streptocycline (1 g/10 L).',
    organicAlternative: 'Pseudomonas fluorescens 10 g/L foliar spray every 7 days.',
    imageSrc: 'assets/images/leaf_scan.jpg'
  },
  sample4: {
    title: 'Pristine Foliage (Clean)',
    target: 'Zea mays (Maize)',
    pathogen: 'Pathogens Negated — 100% Healthy',
    confidence: '99.4%',
    severity: 'Zero (Optimal Chlorophyll Index 48.2 SPAD)',
    recommendation: 'No chemical intervention required. Continue routine micronutrient schedule.',
    organicAlternative: 'Maintain beneficial mycorrhizal fungi root innoculation.',
    imageSrc: 'assets/images/leaf_scan.jpg'
  }
};

function initDiseaseScanner() {
  const chips = document.querySelectorAll('.sample-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const sampleKey = chip.dataset.sample || 'sample1';
      triggerScanAnimation(sampleScans[sampleKey]);
    });
  });

  // Custom File Upload / Dropzone
  const dropzone = document.getElementById('dropzoneTrigger');
  const fileInput = document.getElementById('leafFileInput');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const customSample = {
          title: `Scanned Upload: ${file.name.substring(0, 18)}...`,
          target: 'Custom Plant Specimen',
          pathogen: 'AI Neural Detection: Cercospora Leaf Spot',
          confidence: '96.2%',
          severity: 'Early Warning (Isolated spotting)',
          recommendation: 'Apply systemic Mancozeb 75 WP (2g/L) to prevent spore spread across field boundary.',
          organicAlternative: 'Garlic extract + fermented butter-milk (1:10) spray for broad bio-fungal resistance.',
          imageSrc: event.target.result
        };
        triggerScanAnimation(customSample);
      };
      reader.readAsDataURL(file);
    });
  }
}

function triggerScanAnimation(scanData) {
  const scannerImg = document.getElementById('scannerImg');
  const laser = document.querySelector('.scanner-laser');

  if (scannerImg) {
    scannerImg.style.opacity = '0.3';
  }

  showToast('🔍 Analyzing leaf cellular matrix and spectral signatures...');

  setTimeout(() => {
    if (scannerImg) {
      scannerImg.src = scanData.imageSrc;
      scannerImg.style.opacity = '1';
    }

    // Populate Report Panel
    const confElem = document.getElementById('diagConfidence');
    const pathElem = document.getElementById('diagPathogen');
    const sciElem = document.getElementById('diagTargetCrop');
    const sevElem = document.getElementById('diagSeverity');
    const recElem = document.getElementById('diagRecommendation');
    const orgElem = document.getElementById('diagOrganic');

    if (confElem) confElem.textContent = scanData.confidence;
    if (pathElem) pathElem.textContent = scanData.pathogen;
    if (sciElem) sciElem.textContent = scanData.target;
    if (sevElem) sevElem.textContent = scanData.severity;
    if (recElem) recElem.textContent = scanData.recommendation;
    if (orgElem) orgElem.textContent = scanData.organicAlternative;

    showToast(`Diagnosis Complete: ${scanData.pathogen}`);
  }, 600);
}

/* ==========================================================================
   4. Interactive AgroBot AI Assistant Floating Chat
   ========================================================================== */
const botKnowledge = [
  {
    triggers: ['urea', 'nitrogen', 'fertilizer', 'npk', 'dose'],
    response: 'For cereal crops (Wheat/Rice), split nitrogen into 3 equal splits: 1/3 at basal, 1/3 at active tillering, and 1/3 at panicle/flowering. Always top-dress before light irrigation to reduce volatilization losses.'
  },
  {
    triggers: ['blight', 'yellow', 'spots', 'leaf', 'disease', 'fungus'],
    response: 'Yellow spots with dark concentric rings usually indicate early fungal blight (Alternaria). Treat with Chlorothalonil 75% WP or Azoxystrobin, and ensure you do not water from overhead nozzles during humid evenings.'
  },
  {
    triggers: ['spray', 'weather', 'wind', 'rain', 'pesticide', 'time'],
    response: 'The optimal pesticide spray window is early morning (06:00 - 09:30 AM) when wind speed is under 6 km/h and relative humidity allows droplets to adhere without rapid evaporation or drift.'
  },
  {
    triggers: ['drip', 'irrigation', 'water', 'frequency'],
    response: 'Drip irrigation should supply between 4 to 6 liters per plant per day in peak vegetative and fruiting phases. For clay soils, apply pulses of 45 minutes to prevent saturated waterlogging.'
  },
  {
    triggers: ['organic', 'bio', 'natural', 'neem'],
    response: 'For organic pest and disease defense, use cold-pressed Neem Oil (10,000 ppm) with liquid soap surfactant (5 ml/L), combined with bi-weekly Trichoderma soil inoculations.'
  },
  {
    triggers: ['price', 'market', 'sell', 'harvest'],
    response: 'Current commodity indicators show Wheat and Soybean trading with a +4.2% upward momentum due to regional supply shortages. Recommended: hold grain stored in dry silos for another 10 to 14 days.'
  }
];

function initAgroBotChat() {
  const bubble = document.getElementById('chatBubble');
  const drawer = document.getElementById('chatDrawer');
  const closeBtn = document.getElementById('chatCloseBtn');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSendBtn');
  const messagesBox = document.getElementById('chatMessages');
  const quickChips = document.querySelectorAll('.quick-chip');

  if (!bubble || !drawer) return;

  bubble.addEventListener('click', () => {
    drawer.classList.toggle('open');
    if (drawer.classList.contains('open')) {
      input?.focus();
    }
  });

  closeBtn?.addEventListener('click', () => {
    drawer.classList.remove('open');
  });

  const handleSend = () => {
    const text = input?.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    input.value = '';

    // Simulated Bot Reply
    setTimeout(() => {
      const reply = generateBotReply(text);
      appendMessage(reply, 'bot');
    }, 700);
  };

  sendBtn?.addEventListener('click', handleSend);
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const qText = chip.textContent;
      if (input) input.value = qText;
      handleSend();
    });
  });
}

function appendMessage(text, sender) {
  const box = document.getElementById('chatMessages');
  if (!box) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg ${sender}`;
  msgDiv.textContent = text;
  box.appendChild(msgDiv);
  box.scrollTop = box.scrollHeight;
}

function generateBotReply(query) {
  const lower = query.toLowerCase();
  for (const item of botKnowledge) {
    if (item.triggers.some(t => lower.includes(t))) {
      return item.response;
    }
  }
  return "That is an excellent agronomy question. AgroPulse AI models suggest maintaining soil organic carbon above 0.75%, ensuring balanced NPK ratios, and monitoring microclimate humidity daily. Ask me about fertilizers, disease diagnosis, or spray windows!";
}

/* ==========================================================================
   5. Interactive FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqCards = document.querySelectorAll('.faq-card');
  faqCards.forEach(card => {
    const trigger = card.querySelector('.faq-trigger');
    const content = card.querySelector('.faq-content');

    trigger?.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');

      // Close others
      faqCards.forEach(c => {
        c.classList.remove('open');
        const cnt = c.querySelector('.faq-content');
        if (cnt) cnt.style.maxHeight = null;
      });

      if (!isOpen && content) {
        card.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 30 + 'px';
      }
    });
  });
}

/* ==========================================================================
   6. Newsletter & Export Handlers
   ========================================================================== */
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (input && input.value) {
      showToast(`🌾 Subscribed ${input.value} to AgroPulse Weekly Field Intel!`);
      input.value = '';
    }
  });

  const exportBtn = document.getElementById('btnExportPrescription');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      showToast('📄 Generated AgroPulse Agronomy Prescription PDF Report! Download starting...');
    });
  }
}

/* ==========================================================================
   7. Smooth Nav Scrolling & Active Link Highlighting
   ========================================================================== */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   8. Modern Toast Notification System
   ========================================================================== */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00f59b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 400);
  }, 3600);
}
