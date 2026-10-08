/**
 * TerraVision VNQFF-09 — Quantum-Enhanced Earth Observation Intelligence Platform
 * Complete Application Logic, Realistic 3D Earth, Multi-Domain Telemetry,
 * Full Interactive Tabs Functionality & Terra Tutor AI Copilot
 */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* ==========================================================================
       1. GLOBAL STATE & DOMAIN KNOWLEDGE BASE
       ========================================================================== */

    const $ = id => document.getElementById(id);

    const state = {
        view: "explorer",
        lat: 36.7783,
        lng: -119.4179,
        locationName: "Central Valley, CA",
        subRegion: "California, United States",
        biome: "Intensive Farmland (Crop Circles)",
        domain: "agriculture",
        confidence: 96.4,
        dataSource: "Sentinel-2 MSI / Landsat-9",
        datasetName: "VNQFF Earth Intel 2026",
        analysisStatus: "Hybrid PQC Ready",

        // Selected Year in Anomaly
        selectedYear: 2026,
        timelinePlaying: false,
        timelineInterval: null,

        // Land Cover state
        activeLandcoverSample: "agriculture",
        maskOpacity: 0.65,
        selectedClassFilter: null,

        // Change Detection state
        activeChangeScenario: "lakemead",
        wipeMode: "split", // split | diff | blink
        wipePercent: 50,
        blinkInterval: null,
        baselineImg: null,
        currentImg: null,

        // Quantum Circuit state (8 parameters θ₀..θ₇)
        angles: [0.38, 0.72, 1.15, 0.49, 1.84, 0.95, 1.42, 0.61],
        latentVector: [0.45, 0.82, -0.63, 0.91, -0.28, 0.74, 0.15, -0.52],
        quantumState: "|0011⟩",
        quantumProbabilities: new Array(16).fill(0.0625),
        entropy: 2.18,
        quantumScore: 94.8,

        // Applicability Studio
        activeAppDomain: "agriculture",
        activeSpectralLayer: "rgb",
        domainThreshold: 0.65,

        // Terra Tutor
        tutorOpen: false,
        tutorHistory: []
    };

    // Location Presets Database
    const PRESETS = {
        california: {
            name: "Central Valley, CA",
            sub: "California, United States",
            lat: 36.7783,
            lng: -119.4179,
            biome: "Intensive Farmland",
            domain: "agriculture",
            sample: "agriculture",
            changeScenario: "wildfire",
            metrics: {
                agriculture: { score: 94, label: "NDVI Index: 0.78 (Lush)", status: "Optimal Yield" },
                water: { score: 48, label: "Aquifer Reserve: 48%", status: "Moderate Drawdown" },
                urban: { score: 26, label: "Built-up Ratio: 26%", status: "Rural Low-Density" },
                disaster: { score: 32, label: "Fire Weather Index: 32", status: "Seasonal Nominal" },
                space: { score: 99, label: "Sentinel-2 Coverage: 100%", status: "Clear Downlink" }
            },
            angles: [0.42, 0.85, 1.2, 0.55, 1.9, 0.9, 1.45, 0.65],
            vector: [0.55, 0.88, -0.42, 0.94, -0.18, 0.82, 0.22, -0.61]
        },
        punjab: {
            name: "Punjab Basin",
            sub: "Northern Region, India",
            lat: 30.7333,
            lng: 76.7794,
            biome: "Intensive Cropland & Canals",
            domain: "agriculture",
            sample: "agriculture",
            changeScenario: "wildfire",
            metrics: {
                agriculture: { score: 96, label: "NDVI Index: 0.84 (Peak)", status: "High Biomass" },
                water: { score: 62, label: "Canal Inflow: 8.2 km³", status: "Controlled Flow" },
                urban: { score: 35, label: "Settlement Density: 35%", status: "Semi-Urban" },
                disaster: { score: 22, label: "Flood Runoff Risk: 22%", status: "Nominal" },
                space: { score: 98, label: "Orbital Pass in 4.5h", status: "Optimal Angle" }
            },
            angles: [0.35, 0.92, 1.05, 0.62, 1.75, 0.88, 1.52, 0.58],
            vector: [0.62, 0.91, -0.35, 0.88, -0.22, 0.79, 0.31, -0.55]
        },
        cerrado: {
            name: "Cerrado Farmland",
            sub: "Mato Grosso, Brazil",
            lat: -14.235,
            lng: -51.9253,
            biome: "Soybean Grid & Savannah",
            domain: "agriculture",
            sample: "forest",
            changeScenario: "amazon",
            metrics: {
                agriculture: { score: 91, label: "NDVI Index: 0.72", status: "Expansive Crop" },
                water: { score: 55, label: "Soil Moisture: 55%", status: "Stable Basin" },
                urban: { score: 14, label: "Built-up Footprint: 14%", status: "Agricultural" },
                disaster: { score: 45, label: "Deforestation Risk: 45%", status: "Border Watch" },
                space: { score: 96, label: "Landsat-9 30m MSI", status: "Verified Stream" }
            },
            angles: [0.48, 0.76, 1.25, 0.48, 1.82, 0.94, 1.38, 0.72],
            vector: [0.48, 0.76, -0.58, 0.92, -0.32, 0.71, 0.19, -0.48]
        },
        lakemead: {
            name: "Lake Mead Reservoir",
            sub: "Nevada / Arizona, USA",
            lat: 36.015,
            lng: -114.737,
            biome: "Arid Inland Waterbody",
            domain: "water",
            sample: "water",
            changeScenario: "lakemead",
            metrics: {
                agriculture: { score: 18, label: "Downstream Alluvial: 18%", status: "Low Direct" },
                water: { score: 98, label: "Storage Level: 34.2%", status: "Critical Depletion" },
                urban: { score: 42, label: "Las Vegas Metro Draw: 42%", status: "Monitored" },
                disaster: { score: 78, label: "Drought Severity: Tier 2", status: "High Urgency" },
                space: { score: 99, label: "SuperDove 3m Cadence", status: "Daily Downlink" }
            },
            angles: [0.22, 0.48, 0.88, 0.32, 1.25, 0.65, 1.12, 0.42],
            vector: [0.15, 0.32, 0.88, -0.74, 0.62, -0.45, 0.81, -0.22]
        },
        nile: {
            name: "Nile Delta",
            sub: "Lower Egypt",
            lat: 30.836,
            lng: 31.078,
            biome: "River Delta Alluvium",
            domain: "water",
            sample: "water",
            changeScenario: "lakemead",
            metrics: {
                agriculture: { score: 88, label: "Fertile Delta NDVI: 0.74", status: "Dense Cropland" },
                water: { score: 95, label: "Flow Volume: 42.1 km³", status: "Seasonal High" },
                urban: { score: 68, label: "Delta Settlement: 68%", status: "High Density" },
                disaster: { score: 41, label: "Soil Salinization Risk", status: "Moderate" },
                space: { score: 97, label: "Copernicus Polar Pass", status: "Active Orbit" }
            },
            angles: [0.52, 0.68, 1.34, 0.58, 1.62, 0.82, 1.45, 0.54],
            vector: [0.52, 0.68, 0.74, 0.62, 0.41, 0.85, 0.38, -0.42]
        },
        aral: {
            name: "Aral Sea Basin",
            sub: "Kazakhstan / Uzbekistan",
            lat: 45.0,
            lng: 60.0,
            biome: "Salt Flat & Desiccated Basin",
            domain: "water",
            sample: "water",
            changeScenario: "lakemead",
            metrics: {
                agriculture: { score: 12, label: "Aralkum Shrub: 12%", status: "Degraded" },
                water: { score: 99, label: "Surface Loss: 89%", status: "Extreme Desiccation" },
                urban: { score: 8, label: "Remote Settlements: 8%", status: "Sparse" },
                disaster: { score: 86, label: "Toxic Dust Storm Risk", status: "Severe Alert" },
                space: { score: 95, label: "Landsat Historical 40yr", status: "Archived" }
            },
            angles: [0.18, 0.38, 0.72, 0.28, 1.15, 0.52, 0.95, 0.38],
            vector: [0.12, 0.25, 0.65, -0.85, 0.78, -0.62, 0.91, -0.15]
        },
        tokyo: {
            name: "Tokyo Bay Metro",
            sub: "Kantō Region, Japan",
            lat: 35.6762,
            lng: 139.6503,
            biome: "Ultra-High Density Megacity",
            domain: "urban",
            sample: "urban",
            changeScenario: "urban",
            metrics: {
                agriculture: { score: 8, label: "Urban Rooftop / Green: 8%", status: "Micro Canopy" },
                water: { score: 65, label: "Tokyo Bay Coastal Port", status: "Commercial Port" },
                urban: { score: 99, label: "Built-up NDBI: 0.91", status: "Megacity Core" },
                disaster: { score: 52, label: "Typhoon Storm Surge Watch", status: "Coastal Buffer" },
                space: { score: 99, label: "QZSS / Sentinel-2 Link", status: "Direct Ground Link" }
            },
            angles: [0.82, 1.15, 1.74, 0.88, 2.25, 1.45, 1.88, 0.92],
            vector: [-0.62, 0.42, 0.35, -0.28, 0.88, 0.95, -0.74, 0.82]
        },
        shenzhen: {
            name: "Shenzhen Bay",
            sub: "Guangdong, China",
            lat: 22.5431,
            lng: 114.0579,
            biome: "High-Tech Coastal Metropolis",
            domain: "urban",
            sample: "urban",
            changeScenario: "urban",
            metrics: {
                agriculture: { score: 11, label: "Peripheral Green: 11%", status: "Parks & Greenways" },
                water: { score: 58, label: "Pearl River Estuary", status: "Turbid Coastal" },
                urban: { score: 97, label: "Expansion Index: +8.4%/yr", status: "Rapid Sprawl" },
                disaster: { score: 44, label: "Monsoon Inundation Buffer", status: "Nominal" },
                space: { score: 98, label: "Gaofen Constellation", status: "0.8m Sub-meter" }
            },
            angles: [0.78, 1.08, 1.68, 0.82, 2.18, 1.38, 1.82, 0.88],
            vector: [-0.55, 0.38, 0.42, -0.32, 0.82, 0.91, -0.68, 0.78]
        },
        paris: {
            name: "Paris Metro",
            sub: "Île-de-France, France",
            lat: 48.8566,
            lng: 2.3522,
            biome: "Historic Urban & Seine Valley",
            domain: "urban",
            sample: "urban",
            changeScenario: "urban",
            metrics: {
                agriculture: { score: 24, label: "Seine Basin Farmland: 24%", status: "Regional Outer" },
                water: { score: 48, label: "Seine River Corridor", status: "Regulated Basin" },
                urban: { score: 92, label: "Urban Heat Island: +3.2°C", status: "Dense Core" },
                disaster: { score: 28, label: "River Flood Crest Watch", status: "Low Risk" },
                space: { score: 99, label: "ESA Headquarters Node", status: "Primary Link" }
            },
            angles: [0.68, 0.98, 1.52, 0.74, 2.05, 1.25, 1.72, 0.82],
            vector: [-0.48, 0.45, 0.38, -0.22, 0.78, 0.88, -0.62, 0.74]
        },
        pantanal: {
            name: "Pantanal Wetlands",
            sub: "Mato Grosso do Sul, Brazil",
            lat: -17.842,
            lng: -56.321,
            biome: "Tropical Wetland & Marsh",
            domain: "disaster",
            sample: "disaster",
            changeScenario: "wildfire",
            metrics: {
                agriculture: { score: 32, label: "Cattle Ranching Fringe: 32%", status: "Encroaching" },
                water: { score: 74, label: "Seasonal Flood Basin: 74%", status: "Wetland Flood" },
                urban: { score: 5, label: "Human Settlements: <5%", status: "Pristine Marsh" },
                disaster: { score: 92, label: "Thermal Hotspots: 14 Active", status: "Wildfire Burn Scar" },
                space: { score: 96, label: "MODIS / VIIRS Downlink", status: "Active Alert" }
            },
            angles: [0.88, 1.35, 1.92, 0.95, 2.45, 1.62, 2.12, 1.15],
            vector: [0.35, -0.68, 0.28, -0.85, 0.94, -0.42, 0.78, 0.88]
        },
        amazon: {
            name: "Amazon Basin",
            sub: "Amazonas, Brazil",
            lat: -3.4653,
            lng: -62.2159,
            biome: "Dense Tropical Rainforest",
            domain: "disaster",
            sample: "forest",
            changeScenario: "amazon",
            metrics: {
                agriculture: { score: 28, label: "Deforestation Clearing: 28%", status: "Logging Buffer" },
                water: { score: 92, label: "Amazon River Discharge", status: "Massive Basin" },
                urban: { score: 4, label: "Built-up Area: <4%", status: "River Settlements" },
                disaster: { score: 88, label: "Canopy Fragmentation Alert", status: "Urgent Watch" },
                space: { score: 94, label: "Sentinel-1 SAR (Cloud-Penetrating)", status: "Radar Active" }
            },
            angles: [0.45, 0.88, 1.42, 0.65, 1.88, 0.98, 1.55, 0.72],
            vector: [0.88, 0.95, 0.62, 0.82, -0.55, 0.42, -0.32, -0.68]
        },
        kerala: {
            name: "Kerala Coastline",
            sub: "Southwest India",
            lat: 9.9312,
            lng: 76.2673,
            biome: "Coastal Wetland & Backwaters",
            domain: "disaster",
            sample: "disaster",
            changeScenario: "wildfire",
            metrics: {
                agriculture: { score: 76, label: "Paddy & Plantation: 76%", status: "Lush Coastal" },
                water: { score: 88, label: "Vembanad Backwaters", status: "Estuarine High" },
                urban: { score: 55, label: "Kochi Port Urban Strip: 55%", status: "Coastal Town" },
                disaster: { score: 82, label: "Monsoon Inundation Risk: 82%", status: "Flood Alert" },
                space: { score: 98, label: "ISRO EOS-04 C-band SAR", status: "Synchronized" }
            },
            angles: [0.72, 1.12, 1.65, 0.84, 2.15, 1.35, 1.78, 0.92],
            vector: [0.65, 0.82, 0.88, -0.42, 0.72, 0.35, 0.58, 0.82]
        },
        svalbard: {
            name: "Svalbard Polar Station",
            sub: "Spitsbergen, Norway",
            lat: 78.2232,
            lng: 15.6267,
            biome: "High Arctic Tundra & Permafrost",
            domain: "space",
            sample: "water",
            changeScenario: "lakemead",
            metrics: {
                agriculture: { score: 2, label: "Global Seed Vault Node: 2%", status: "Sub-Zero Storage" },
                water: { score: 82, label: "Glacial Fjord Melt: 82%", status: "Cryosphere Shift" },
                urban: { score: 6, label: "Longyearbyen Outpost: 6%", status: "Scientific Base" },
                disaster: { score: 64, label: "Permafrost Thaw Subsidence", status: "Climate Anomaly" },
                space: { score: 99, label: "SvalSat 14-Orbit Polar Downlink", status: "Primary Polar Gateway" }
            },
            angles: [0.28, 0.45, 0.92, 0.38, 1.32, 0.68, 1.18, 0.45],
            vector: [-0.78, -0.45, 0.65, -0.88, 0.92, -0.55, 0.84, -0.32]
        },
        guiana: {
            name: "Guiana Space Centre",
            sub: "Kourou, French Guiana",
            lat: 5.1611,
            lng: -52.6497,
            biome: "Equatorial Rainforest Coast",
            domain: "space",
            sample: "forest",
            changeScenario: "amazon",
            metrics: {
                agriculture: { score: 35, label: "Coastal Palm Canopy: 35%", status: "Tropical Buffer" },
                water: { score: 72, label: "Atlantic Equatorial Shelf", status: "Marine Corridor" },
                urban: { score: 22, label: "Spaceport Infrastructure: 22%", status: "Restricted Zone" },
                disaster: { score: 25, label: "Lightning Hazard Screening", status: "Nominal" },
                space: { score: 99, label: "Ariane 6 Launch Corridor", status: "Equatorial Orbit Boost" }
            },
            angles: [0.42, 0.78, 1.32, 0.58, 1.82, 0.92, 1.48, 0.68],
            vector: [0.72, 0.85, 0.48, 0.78, -0.42, 0.68, 0.25, 0.92]
        },
        kennedy: {
            name: "Kennedy Space Center",
            sub: "Cape Canaveral, FL, USA",
            lat: 28.5729,
            lng: -80.649,
            biome: "Barrier Island & Wildlife Refuge",
            domain: "space",
            sample: "urban",
            changeScenario: "urban",
            metrics: {
                agriculture: { score: 22, label: "Merritt Island Refuge: 22%", status: "Protected Citrus" },
                water: { score: 85, label: "Banana River Lagoon", status: "Brackish Estuary" },
                urban: { score: 48, label: "Launch Pad Complex: 48%", status: "Aerospace Grid" },
                disaster: { score: 38, label: "Hurricane Surge Exposure", status: "Hardened Pad" },
                space: { score: 99, label: "Constellation Downlink Hub", status: "Starlink / Artemis Base" }
            },
            angles: [0.58, 0.88, 1.45, 0.68, 1.95, 1.12, 1.62, 0.78],
            vector: [0.42, 0.68, 0.75, 0.45, 0.82, 0.92, -0.38, 0.95]
        }
    };

    /* ==========================================================================
       2. TAB NAVIGATION & SWITCHING
       ========================================================================== */

    const views = {
        explorer: $("explorerView"),
        pipeline: $("pipelineView"),
        landcover: $("landcoverView"),
        change: $("changeView"),
        anomaly: $("anomalyView"),
        quantum: $("quantumView"),
        applicability: $("applicabilityView")
    };

    const titles = {
        explorer: [
            "Earth Explorer",
            "Explore and inspect satellite-style Earth observations with 3D geospatial targeting."
        ],
        pipeline: [
            "Hybrid Quantum Satellite-Image Analysis (VNQFF-09)",
            "Classical CNN vision → 8-D latent representation → 4-qubit PQC variational inference."
        ],
        landcover: [
            "Land Cover Classification",
            "Classify agriculture, vegetation, water, urban and disturbed surfaces with live bio-metrics."
        ],
        change: [
            "Hybrid Change Detection",
            "Compare baseline vs current observations using interactive wipe slider and quantum fidelity F."
        ],
        anomaly: [
            "Anomaly Monitor",
            "Screen environmental disturbance footprints and thermal anomalies across 2015–2026 epochs."
        ],
        quantum: [
            "Quantum Analysis (4-Qubit PQC Simulator)",
            "Inspect 16 computational basis state amplitudes, Bloch sphere phase wheels, and variational angles."
        ],
        applicability: [
            "VNQFF-09 Executive Applicability Studio",
            "Demonstrations across Agriculture, Water, Urban, Disaster, and Space programmes."
        ]
    };

    function openMobileSidebar() {
        $("sidebar")?.classList.add("open");
        $("sidebarBackdrop")?.classList.add("active");
    }

    function closeMobileSidebar() {
        $("sidebar")?.classList.remove("open");
        $("sidebarBackdrop")?.classList.remove("active");
    }

    $("mobileMenuBtn")?.addEventListener("click", () => {
        if ($("sidebar")?.classList.contains("open")) {
            closeMobileSidebar();
        } else {
            openMobileSidebar();
        }
    });

    $("sidebarCloseBtn")?.addEventListener("click", closeMobileSidebar);
    $("sidebarBackdrop")?.addEventListener("click", closeMobileSidebar);

    function switchView(viewName) {
        if (!views[viewName]) return;
        state.view = viewName;

        // Toggle view containers
        Object.entries(views).forEach(([name, el]) => {
            if (el) el.classList.toggle("active", name === viewName);
        });

        // Toggle sidebar nav items
        document.querySelectorAll(".nav-item").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.view === viewName);
        });

        // Toggle desktop top tab ribbon items
        document.querySelectorAll(".top-tab-btn").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.view === viewName);
        });

        // Sync Mobile Bottom Nav Buttons and glide active tab into center view
        document.querySelectorAll(".mobile-nav-btn").forEach(btn => {
            const isActive = btn.dataset.view === viewName;
            btn.classList.toggle("active", isActive);
            if (isActive) {
                btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
            }
        });

        // Smooth scroll container to top on mobile/tablet view switch
        const mainContainer = $("mainContainer");
        if (mainContainer) {
            mainContainer.scrollTo({ top: 0, behavior: "smooth" });
        }
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Update titles
        const t = titles[viewName] || titles.explorer;
        if ($("pageTitle")) $("pageTitle").textContent = t[0];
        if ($("pageSubtitle")) $("pageSubtitle").textContent = t[1];

        // Trigger resize / render on view activation
        if (viewName === "pipeline") renderVectorBars();
        if (viewName === "landcover") renderLandcoverCanvas();
        if (viewName === "change") renderChangeViewer();
        if (viewName === "anomaly") renderAnomalyRadar();
        if (viewName === "quantum") renderQuantumView();
        if (viewName === "applicability") renderApplicabilityDemo();

        // Update Terra Tutor context
        updateTutorContext();

        // Auto close drawer on mobile/tablet
        if (window.innerWidth <= 1024) {
            closeMobileSidebar();
        }
    }

    // Attach click listeners to all desktop nav items
    document.querySelectorAll(".nav-item").forEach(btn => {
        btn.addEventListener("click", () => {
            switchView(btn.dataset.view);
        });
    });

    // Attach click listeners to desktop top tab ribbon items
    document.querySelectorAll(".top-tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            switchView(btn.dataset.view);
        });
    });

    // Attach click listeners to all mobile bottom nav buttons
    document.querySelectorAll(".mobile-nav-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            switchView(btn.dataset.view);
        });
    });

    // Sidebar domain quick-jump pills
    document.querySelectorAll(".app-pill").forEach(pill => {
        pill.addEventListener("click", () => {
            const domain = pill.dataset.domain;
            switchView("applicability");
            selectAppDomain(domain);
            if (window.innerWidth <= 1024) {
                closeMobileSidebar();
            }
        });
    });

    // VNQFF-09 Mission badge & quick spec button
    $("openMissionModalBtn")?.addEventListener("click", openVnqffModal);
    $("quickVnqffBtn")?.addEventListener("click", openVnqffModal);
    $("closeVnqff")?.addEventListener("click", closeVnqffModal);

    function openVnqffModal() {
        $("vnqffModal")?.classList.remove("hidden");
    }
    function closeVnqffModal() {
        $("vnqffModal")?.classList.add("hidden");
    }

    // Modal jump buttons
    document.querySelectorAll("[data-jump]").forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.dataset.jump;
            closeVnqffModal();
            if (target === "pipeline") {
                switchView("pipeline");
            } else {
                switchView("applicability");
                selectAppDomain(target);
            }
        });
    });

    // Satellite Downlink Modal
    $("connectSatellite")?.addEventListener("click", () => {
        $("satelliteModal")?.classList.remove("hidden");
    });
    $("closeSatelliteModal")?.addEventListener("click", () => {
        $("satelliteModal")?.classList.add("hidden");
    });
    $("cancelSatModal")?.addEventListener("click", () => {
        $("satelliteModal")?.classList.add("hidden");
    });

    document.querySelectorAll(".constellation-option").forEach(opt => {
        opt.addEventListener("click", () => {
            document.querySelectorAll(".constellation-option").forEach(o => o.classList.remove("active"));
            opt.classList.add("active");
        });
    });

    $("confirmSatConnect")?.addEventListener("click", () => {
        const activeOpt = document.querySelector(".constellation-option.active");
        const source = activeOpt ? activeOpt.dataset.source : "Sentinel-2 MSI";
        state.dataSource = source;
        $("dataSource").textContent = source;
        state.analysisStatus = "Live Stream Linked";
        $("analysisStatus").textContent = "Live Stream Linked";
        $("satelliteModal")?.classList.add("hidden");
        showToast(`Connected downlink stream: ${source}`);
        addTutorBotMessage(`🛰️ **Satellite Downlink Connected:** Connected to **${source}**. Telemetry streaming at 10m spatial resolution directly into the 4-qubit PQC pipeline.`);
    });

    // Help Modal
    $("helpBtn")?.addEventListener("click", () => $("helpModal")?.classList.remove("hidden"));
    $("closeHelp")?.addEventListener("click", () => $("helpModal")?.classList.add("hidden"));

    // Toast notification
    let toastTimer = null;
    function showToast(msg) {
        const toast = $("toast");
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
    }

    /* ==========================================================================
       2B. DYNAMIC COSMIC STARFIELD & MOVING STARS (APP BACKGROUND)
       ========================================================================== */

    function initCosmicStarfield() {
        const canvas = $("cosmicStarfield");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = 0;
        let height = 0;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
        }
        resize();
        window.addEventListener("resize", resize);

        // Radiant Vibrant Multi-Spectral Palette
        const starColors = [
            { r: 255, g: 255, b: 255, glow: "#ffffff" }, // Diamond Pure White
            { r: 56, g: 229, b: 255, glow: "#38e5ff" }, // Electric Quantum Cyan
            { r: 192, g: 132, b: 252, glow: "#c084fc" }, // Radiant Lavender / Violet
            { r: 253, g: 224, b: 71, glow: "#fde047" }, // Supernova Gold
            { r: 52, g: 211, b: 153, glow: "#34d399" }, // Emerald Auroral Green
            { r: 251, g: 113, b: 133, glow: "#fb7185" }, // Stellar Rose Pink
            { r: 96, g: 165, b: 250, glow: "#60a5fa" }  // Deep Sapphire Blue
        ];

        // 1. BEACON CROSS SPARKLE STARS (Brilliant 4-Point & 8-Point Diffraction Flares)
        const beaconStars = [];
        for (let i = 0; i < 48; i++) {
            beaconStars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: 1.8 + Math.random() * 1.8,
                spikeLength: 12 + Math.random() * 16,
                color: starColors[Math.floor(Math.random() * starColors.length)],
                baseAlpha: 0.60 + Math.random() * 0.35,
                twinkleSpeed1: 0.02 + Math.random() * 0.038,
                twinkleSpeed2: 0.03 + Math.random() * 0.048,
                phase1: Math.random() * Math.PI * 2,
                phase2: Math.random() * Math.PI * 2,
                rotAngle: Math.random() * Math.PI,
                rotSpeed: (Math.random() - 0.5) * 0.006,
                vx: 0.14 + Math.random() * 0.20,
                vy: -0.04 - Math.random() * 0.09,
                waveAmp: 0.09 + Math.random() * 0.14,
                waveFreq: 0.012 + Math.random() * 0.022
            });
        }

        // 2. DIAMOND GLITTER STARS (Moving 4-Point Radiant Diamond Polygons)
        const diamondStars = [];
        for (let i = 0; i < 110; i++) {
            diamondStars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: 2.8 + Math.random() * 3.4,
                color: starColors[Math.floor(Math.random() * starColors.length)],
                baseAlpha: 0.55 + Math.random() * 0.38,
                twinkleSpeed: 0.024 + Math.random() * 0.05,
                phase: Math.random() * Math.PI * 2,
                rotAngle: Math.random() * Math.PI,
                rotSpeed: (Math.random() - 0.5) * 0.01,
                vx: 0.16 + Math.random() * 0.22,
                vy: -0.05 - Math.random() * 0.10,
                waveAmp: 0.08 + Math.random() * 0.12,
                waveFreq: 0.015 + Math.random() * 0.024
            });
        }

        // 3. CELESTIAL PINPOINT TWINKLE STARS (Gently Drifting & Twinkling with Corona Halo)
        const pinpointStars = [];
        for (let i = 0; i < 420; i++) {
            pinpointStars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: 0.9 + Math.random() * 1.8,
                color: starColors[Math.floor(Math.random() * starColors.length)],
                baseAlpha: 0.48 + Math.random() * 0.42,
                twinkleSpeed: 0.020 + Math.random() * 0.045,
                phase: Math.random() * Math.PI * 2,
                phase2: Math.random() * Math.PI * 2,
                vx: 0.15 + Math.random() * 0.24,
                vy: -0.05 - Math.random() * 0.11,
                waveAmp: 0.07 + Math.random() * 0.12,
                waveFreq: 0.014 + Math.random() * 0.026
            });
        }

        // 4. MICRO STARDUST GLITTER PARTICLES (Fast Shimmering Stardust Diamonds)
        const stardust = [];
        for (let i = 0; i < 220; i++) {
            stardust.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: 0.6 + Math.random() * 0.9,
                color: starColors[Math.floor(Math.random() * starColors.length)],
                baseAlpha: 0.38 + Math.random() * 0.45,
                shimmerSpeed: 0.04 + Math.random() * 0.08,
                phase: Math.random() * Math.PI * 2,
                vx: 0.20 + Math.random() * 0.28,
                vy: -0.06 - Math.random() * 0.13
            });
        }

        // 5. SHOOTING STARS (Cosmic Meteors with Particle Sparks)
        const meteors = [];
        const meteorSparks = [];
        let lastMeteorTime = performance.now();

        function spawnMeteor() {
            const angle = (26 + Math.random() * 20) * (Math.PI / 180);
            const speed = 12 + Math.random() * 8;
            const meteorCol = starColors[Math.floor(Math.random() * starColors.length)];
            meteors.push({
                x: Math.random() * (width * 0.85),
                y: Math.random() * (height * 0.4),
                length: 95 + Math.random() * 150,
                speed: speed,
                angle: angle,
                color: meteorCol,
                opacity: 0.85,
                life: 0,
                maxLife: 42 + Math.random() * 24
            });
        }

        // Helper: Draw 4-Point Radiant Shining Cross Flare (Astrophysical Corona Bloom)
        function drawDiffractionFlare(x, y, spikeLen, coreRadius, rot, alpha, col) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rot);

            const effAlpha = Math.min(1.0, alpha * 0.95);

            // 1. Soft glowing corona / radiant aura
            const haloGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, spikeLen * 0.85);
            haloGrad.addColorStop(0, `rgba(${col.r}, ${col.g}, ${col.b}, ${0.85 * effAlpha})`);
            haloGrad.addColorStop(0.28, `rgba(${col.r}, ${col.g}, ${col.b}, ${0.38 * effAlpha})`);
            haloGrad.addColorStop(0.70, `rgba(${col.r}, ${col.g}, ${col.b}, ${0.08 * effAlpha})`);
            haloGrad.addColorStop(1, `rgba(${col.r}, ${col.g}, ${col.b}, 0)`);
            ctx.fillStyle = haloGrad;
            ctx.beginPath();
            ctx.arc(0, 0, spikeLen * 0.85, 0, Math.PI * 2);
            ctx.fill();

            // 2. Horizontal & Vertical Primary Diffraction Cross Spikes
            const primaryGradH = ctx.createLinearGradient(-spikeLen, 0, spikeLen, 0);
            primaryGradH.addColorStop(0, `rgba(${col.r}, ${col.g}, ${col.b}, 0)`);
            primaryGradH.addColorStop(0.35, `rgba(${col.r}, ${col.g}, ${col.b}, ${0.65 * effAlpha})`);
            primaryGradH.addColorStop(0.5, `rgba(255, 255, 255, ${0.98 * effAlpha})`);
            primaryGradH.addColorStop(0.65, `rgba(${col.r}, ${col.g}, ${col.b}, ${0.65 * effAlpha})`);
            primaryGradH.addColorStop(1, `rgba(${col.r}, ${col.g}, ${col.b}, 0)`);

            ctx.fillStyle = primaryGradH;
            ctx.beginPath();
            ctx.moveTo(-spikeLen, 0);
            ctx.lineTo(0, coreRadius * 0.45);
            ctx.lineTo(spikeLen, 0);
            ctx.lineTo(0, -coreRadius * 0.45);
            ctx.closePath();
            ctx.fill();

            const primaryGradV = ctx.createLinearGradient(0, -spikeLen, 0, spikeLen);
            primaryGradV.addColorStop(0, `rgba(${col.r}, ${col.g}, ${col.b}, 0)`);
            primaryGradV.addColorStop(0.35, `rgba(${col.r}, ${col.g}, ${col.b}, ${0.65 * effAlpha})`);
            primaryGradV.addColorStop(0.5, `rgba(255, 255, 255, ${0.98 * effAlpha})`);
            primaryGradV.addColorStop(0.65, `rgba(${col.r}, ${col.g}, ${col.b}, ${0.65 * effAlpha})`);
            primaryGradV.addColorStop(1, `rgba(${col.r}, ${col.g}, ${col.b}, 0)`);

            ctx.fillStyle = primaryGradV;
            ctx.beginPath();
            ctx.moveTo(0, -spikeLen);
            ctx.lineTo(coreRadius * 0.45, 0);
            ctx.lineTo(0, spikeLen);
            ctx.lineTo(-coreRadius * 0.45, 0);
            ctx.closePath();
            ctx.fill();

            // 3. Secondary 45° Diagonal Subtle Rays (Scintillation)
            const diagLen = spikeLen * 0.48;
            ctx.rotate(Math.PI / 4);
            const diagGrad = ctx.createLinearGradient(-diagLen, 0, diagLen, 0);
            diagGrad.addColorStop(0, `rgba(${col.r}, ${col.g}, ${col.b}, 0)`);
            diagGrad.addColorStop(0.5, `rgba(${col.r}, ${col.g}, ${col.b}, ${0.65 * effAlpha})`);
            diagGrad.addColorStop(1, `rgba(${col.r}, ${col.g}, ${col.b}, 0)`);

            ctx.fillStyle = diagGrad;
            ctx.beginPath();
            ctx.moveTo(-diagLen, 0);
            ctx.lineTo(0, coreRadius * 0.3);
            ctx.lineTo(diagLen, 0);
            ctx.lineTo(0, -coreRadius * 0.3);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(0, -diagLen);
            ctx.lineTo(coreRadius * 0.3, 0);
            ctx.lineTo(0, diagLen);
            ctx.lineTo(-coreRadius * 0.3, 0);
            ctx.closePath();
            ctx.fill();

            // 4. Pure Brilliant White Diamond Core Spark with High Glow
            ctx.beginPath();
            ctx.arc(0, 0, coreRadius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1.0, effAlpha * 1.3)})`;
            ctx.shadowColor = col.glow;
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.restore();
        }

        // Helper: Draw 4-Point Sparkling Diamond Star Polygon
        function drawDiamondStar(x, y, size, rot, alpha, col) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rot);

            const effAlpha = Math.min(1.0, alpha * 0.92);
            const half = size * 0.24;

            // Halo Aura
            const g = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.5);
            g.addColorStop(0, `rgba(${col.r}, ${col.g}, ${col.b}, ${0.72 * effAlpha})`);
            g.addColorStop(0.4, `rgba(${col.r}, ${col.g}, ${col.b}, ${0.22 * effAlpha})`);
            g.addColorStop(1, `rgba(${col.r}, ${col.g}, ${col.b}, 0)`);
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(0, 0, size * 1.5, 0, Math.PI * 2);
            ctx.fill();

            // 4-point diamond crystal polygon
            ctx.beginPath();
            ctx.moveTo(0, -size);
            ctx.quadraticCurveTo(0, -half, half, 0);
            ctx.quadraticCurveTo(0, half, 0, size);
            ctx.quadraticCurveTo(0, half, -half, 0);
            ctx.quadraticCurveTo(0, -half, 0, -size);
            ctx.closePath();

            ctx.fillStyle = `rgba(255, 255, 255, ${0.95 * effAlpha})`;
            ctx.shadowColor = col.glow;
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.restore();
        }

        let time = 0;
        function render() {
            time += 0.02;
            ctx.clearRect(0, 0, width, height);

            // ======================================================================
            // 1. LUMINOUS DEEP-SPACE NEBULAE
            // ======================================================================
            const nGrad1 = ctx.createRadialGradient(width * 0.2, height * 0.18, 10, width * 0.2, height * 0.18, width * 0.5);
            nGrad1.addColorStop(0, "rgba(56, 229, 255, 0.095)");
            nGrad1.addColorStop(0.4, "rgba(14, 116, 144, 0.045)");
            nGrad1.addColorStop(1, "rgba(2, 6, 23, 0)");
            ctx.fillStyle = nGrad1;
            ctx.fillRect(0, 0, width, height);

            const nGrad2 = ctx.createRadialGradient(width * 0.85, height * 0.82, 20, width * 0.85, height * 0.82, width * 0.55);
            nGrad2.addColorStop(0, "rgba(168, 85, 247, 0.09)");
            nGrad2.addColorStop(0.45, "rgba(88, 28, 135, 0.04)");
            nGrad2.addColorStop(1, "rgba(2, 6, 23, 0)");
            ctx.fillStyle = nGrad2;
            ctx.fillRect(0, 0, width, height);

            const nGrad3 = ctx.createRadialGradient(width * 0.5, height * 0.5, 30, width * 0.5, height * 0.5, width * 0.6);
            nGrad3.addColorStop(0, "rgba(52, 211, 153, 0.04)");
            nGrad3.addColorStop(0.5, "rgba(30, 58, 138, 0.025)");
            nGrad3.addColorStop(1, "rgba(2, 6, 23, 0)");
            ctx.fillStyle = nGrad3;
            ctx.fillRect(0, 0, width, height);

            // ======================================================================
            // 2. CONSTELLATION LINK THREADS
            // ======================================================================
            ctx.lineWidth = 0.75;
            for (let i = 0; i < beaconStars.length; i++) {
                for (let j = i + 1; j < beaconStars.length; j++) {
                    const b1 = beaconStars[i];
                    const b2 = beaconStars[j];
                    const dx = b1.x - b2.x;
                    const dy = b1.y - b2.y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < 170) {
                        const lineAlpha = (1 - (dist / 170)) * 0.22 * (0.6 + Math.sin(time * 1.5 + i) * 0.4);
                        ctx.strokeStyle = `rgba(56, 229, 255, ${lineAlpha})`;
                        ctx.beginPath();
                        ctx.moveTo(b1.x, b1.y);
                        ctx.lineTo(b2.x, b2.y);
                        ctx.stroke();
                    }
                }
            }

            // ======================================================================
            // 3. PINPOINT TWINKLE STARS (Gently Drifting & Twinkling with Shining Halos)
            // ======================================================================
            for (let i = 0; i < pinpointStars.length; i++) {
                const s = pinpointStars[i];
                s.x += s.vx;
                s.y += s.vy + Math.sin(time * s.waveFreq * 60 + s.phase) * s.waveAmp;
                if (s.x > width + 10) s.x = -10;
                if (s.x < -10) s.x = width + 10;
                if (s.y > height + 10) s.y = -10;
                if (s.y < -10) s.y = height + 10;

                const alpha = Math.max(0.25, Math.min(1.0,
                    s.baseAlpha +
                    Math.sin(time * s.twinkleSpeed * 60 + s.phase) * 0.48 +
                    Math.cos(time * s.twinkleSpeed * 32 + s.phase2) * 0.28
                ));
                const currentRadius = Math.max(0.5, s.radius * (0.85 + 0.35 * Math.sin(time * s.twinkleSpeed * 60 + s.phase)));

                // Soft glowing radiant aura for larger pinpoint stars
                if (currentRadius > 1.2) {
                    const halo = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, currentRadius * 3.2);
                    halo.addColorStop(0, `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${0.55 * alpha})`);
                    halo.addColorStop(0.5, `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${0.15 * alpha})`);
                    halo.addColorStop(1, `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, 0)`);
                    ctx.fillStyle = halo;
                    ctx.beginPath();
                    ctx.arc(s.x, s.y, currentRadius * 3.2, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.beginPath();
                ctx.arc(s.x, s.y, currentRadius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${alpha})`;
                ctx.shadowColor = s.color.glow;
                ctx.shadowBlur = currentRadius > 1.2 ? 8 : 3;
                ctx.fill();
            }
            ctx.shadowBlur = 0;

            // ======================================================================
            // 4. MICRO STARDUST GLITTER PARTICLES (Shimmering & Drifting)
            // ======================================================================
            for (let i = 0; i < stardust.length; i++) {
                const p = stardust[i];
                p.x += p.vx;
                p.y += p.vy;
                if (p.x > width + 6) p.x = -6;
                if (p.x < -6) p.x = width + 6;
                if (p.y > height + 6) p.y = -6;
                if (p.y < -6) p.y = height + 6;

                const shimmer = Math.max(0.12, Math.min(0.85, p.baseAlpha + Math.sin(time * p.shimmerSpeed * 60 + p.phase) * 0.45));
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${shimmer})`;
                ctx.fill();
            }

            // ======================================================================
            // 5. DIAMOND GLITTER STARS (Rotating & Drifting with Breathing Size)
            // ======================================================================
            for (let i = 0; i < diamondStars.length; i++) {
                const d = diamondStars[i];
                d.x += d.vx;
                d.y += d.vy + Math.sin(time * d.waveFreq * 60 + d.phase) * d.waveAmp;
                d.rotAngle += d.rotSpeed;
                if (d.x > width + 15) d.x = -15;
                if (d.x < -15) d.x = width + 15;
                if (d.y > height + 15) d.y = -15;
                if (d.y < -15) d.y = height + 15;

                const dAlpha = Math.max(0.2, Math.min(0.95, d.baseAlpha + Math.sin(time * d.twinkleSpeed * 60 + d.phase) * 0.48));
                const currentSize = d.size * (0.85 + 0.3 * Math.sin(time * d.twinkleSpeed * 60 + d.phase));
                drawDiamondStar(d.x, d.y, currentSize, d.rotAngle, dAlpha, d.color);
            }

            // ======================================================================
            // 6. BEACON CROSS SPARKLE STARS (Rotating Lens Flares Drifting Smoothly)
            // ======================================================================
            for (let i = 0; i < beaconStars.length; i++) {
                const b = beaconStars[i];
                b.x += b.vx;
                b.y += b.vy + Math.sin(time * b.waveFreq * 60 + b.phase1) * b.waveAmp;
                b.rotAngle += b.rotSpeed;
                if (b.x > width + 30) b.x = -30;
                if (b.x < -30) b.x = width + 30;
                if (b.y > height + 30) b.y = -30;
                if (b.y < -30) b.y = height + 30;

                const harmonicAlpha = Math.max(0.25, Math.min(0.95,
                    b.baseAlpha +
                    Math.sin(time * b.twinkleSpeed1 * 60 + b.phase1) * 0.38 +
                    Math.cos(time * b.twinkleSpeed2 * 60 + b.phase2) * 0.25
                ));
                const currentSpike = b.spikeLength * (0.85 + 0.35 * Math.sin(time * b.twinkleSpeed1 * 60 + b.phase1));
                drawDiffractionFlare(b.x, b.y, currentSpike, b.radius, b.rotAngle, harmonicAlpha, b.color);
            }

            // ======================================================================
            // 7. SHOOTING STARS / METEORS & TRAILING SPARKS
            // ======================================================================
            const now = performance.now();
            if (now - lastMeteorTime > 3200 + Math.random() * 3200) {
                spawnMeteor();
                lastMeteorTime = now;
            }

            // Update & Render Meteor Sparks
            for (let i = meteorSparks.length - 1; i >= 0; i--) {
                const sp = meteorSparks[i];
                sp.life++;
                sp.x += sp.vx;
                sp.y += sp.vy;
                const spAlpha = Math.max(0, 1 - (sp.life / sp.maxLife));
                ctx.beginPath();
                ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${sp.color.r}, ${sp.color.g}, ${sp.color.b}, ${spAlpha * 0.75})`;
                ctx.shadowColor = sp.color.glow;
                ctx.shadowBlur = 4;
                ctx.fill();
                ctx.shadowBlur = 0;

                if (sp.life >= sp.maxLife) {
                    meteorSparks.splice(i, 1);
                }
            }

            // Render Meteors
            for (let i = meteors.length - 1; i >= 0; i--) {
                const m = meteors[i];
                m.life++;
                m.x += Math.cos(m.angle) * m.speed;
                m.y += Math.sin(m.angle) * m.speed;
                m.opacity = Math.max(0, 1 - (m.life / m.maxLife));

                // Spawn shedding trailing sparks behind head
                if (Math.random() < 0.6) {
                    meteorSparks.push({
                        x: m.x - Math.cos(m.angle) * 8 + (Math.random() - 0.5) * 4,
                        y: m.y - Math.sin(m.angle) * 8 + (Math.random() - 0.5) * 4,
                        vx: (Math.random() - 0.5) * 0.8,
                        vy: (Math.random() - 0.5) * 0.8,
                        radius: 0.8 + Math.random() * 1.4,
                        color: m.color,
                        life: 0,
                        maxLife: 20 + Math.random() * 15
                    });
                }

                const tailX = m.x - Math.cos(m.angle) * m.length;
                const tailY = m.y - Math.sin(m.angle) * m.length;

                const meteorGrad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
                meteorGrad.addColorStop(0, `rgba(${m.color.r}, ${m.color.g}, ${m.color.b}, 0)`);
                meteorGrad.addColorStop(0.65, `rgba(${m.color.r}, ${m.color.g}, ${m.color.b}, ${0.55 * m.opacity})`);
                meteorGrad.addColorStop(1, `rgba(255, 255, 255, ${0.98 * m.opacity})`);

                ctx.strokeStyle = meteorGrad;
                ctx.lineWidth = 2.0;
                ctx.beginPath();
                ctx.moveTo(tailX, tailY);
                ctx.lineTo(m.x, m.y);
                ctx.stroke();

                // Radiant Meteor Head Lens Flare
                drawDiffractionFlare(m.x, m.y, 14, 2.4, m.angle, m.opacity, m.color);

                if (m.life >= m.maxLife) {
                    meteors.splice(i, 1);
                }
            }

            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    }

    /* ==========================================================================
       3. REALISTIC THREE.JS 3D EARTH GLOBE
       ========================================================================== */

    let globeInstance = null;

    function init3DEarth() {
        const container = $("earthGlobe");
        if (!container) return;

        // Ensure THREE and OrbitControls are available (resilient retry)
        const THREE = window.THREE;
        if (!THREE || !THREE.OrbitControls) {
            setTimeout(init3DEarth, 120);
            return;
        }

        const width = container.clientWidth || 600;
        const height = container.clientHeight || 460;

        // Scene with transparent background so cosmic stars shine through
        const scene = new THREE.Scene();
        scene.background = null;

        // Camera
        const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
        camera.position.set(0, 0, 3.25);

        // WebGL Renderer
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(width, height);
        if (THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.18;

        container.innerHTML = "";
        container.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x8ab4f8, 0.45);
        scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, 2.6);
        sunLight.position.set(5, 2.5, 4.5);
        scene.add(sunLight);

        const earthSystem = new THREE.Group();
        scene.add(earthSystem);

        // Texture Loader
        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin("anonymous");

        // High quality textures with safe fallback
        const earthMap = loader.load(
            "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
            () => renderer.render(scene, camera),
            undefined,
            () => console.log("Using procedural Earth fallback")
        );
        if (THREE.SRGBColorSpace) earthMap.colorSpace = THREE.SRGBColorSpace;

        const normalMap = loader.load("https://threejs.org/examples/textures/planets/earth_normal_2048.jpg");
        const specularMap = loader.load("https://threejs.org/examples/textures/planets/earth_specular_2048.jpg");
        const cloudsMap = loader.load("https://threejs.org/examples/textures/planets/earth_clouds_1024.png");
        if (THREE.SRGBColorSpace) cloudsMap.colorSpace = THREE.SRGBColorSpace;

        // Earth Mesh
        const earthGeometry = new THREE.SphereGeometry(1, 96, 96);
        const earthMaterial = new THREE.MeshPhongMaterial({
            map: earthMap,
            normalMap: normalMap,
            normalScale: new THREE.Vector2(0.65, 0.65),
            specularMap: specularMap,
            specular: new THREE.Color(0x224466),
            shininess: 28
        });

        const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
        earthSystem.add(earthMesh);

        // Cloud Layer
        const cloudGeometry = new THREE.SphereGeometry(1.014, 96, 96);
        const cloudMaterial = new THREE.MeshPhongMaterial({
            map: cloudsMap,
            transparent: true,
            opacity: 0.38,
            depthWrite: false
        });
        const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
        earthSystem.add(cloudMesh);

        // Atmosphere Glow Shell
        const atmoGeometry = new THREE.SphereGeometry(1.055, 96, 96);
        const atmoMaterial = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.12,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
        });
        const atmoMesh = new THREE.Mesh(atmoGeometry, atmoMaterial);
        earthSystem.add(atmoMesh);

        // Coordinates Grid (Lat/Lon)
        const gridGroup = new THREE.Group();
        earthSystem.add(gridGroup);
        gridGroup.visible = false;

        const gridMat = new THREE.LineBasicMaterial({
            color: 0x38e5ff,
            transparent: true,
            opacity: 0.22
        });

        // Longitudes
        for (let lng = -180; lng <= 180; lng += 20) {
            const pts = [];
            for (let lat = -90; lat <= 90; lat += 2) {
                const phi = (90 - lat) * (Math.PI / 180);
                const theta = (lng + 180) * (Math.PI / 180);
                const r = 1.008;
                pts.push(new THREE.Vector3(
                    -r * Math.sin(phi) * Math.cos(theta),
                    r * Math.cos(phi),
                    r * Math.sin(phi) * Math.sin(theta)
                ));
            }
            const g = new THREE.BufferGeometry().setFromPoints(pts);
            gridGroup.add(new THREE.Line(g, gridMat));
        }

        // Latitudes
        for (let lat = -80; lat <= 80; lat += 20) {
            const pts = [];
            const phi = (90 - lat) * (Math.PI / 180);
            for (let lng = -180; lng <= 180; lng += 2) {
                const theta = (lng + 180) * (Math.PI / 180);
                const r = 1.008;
                pts.push(new THREE.Vector3(
                    -r * Math.sin(phi) * Math.cos(theta),
                    r * Math.cos(phi),
                    r * Math.sin(phi) * Math.sin(theta)
                ));
            }
            const g = new THREE.BufferGeometry().setFromPoints(pts);
            gridGroup.add(new THREE.Line(g, gridMat));
        }

        // Helper: Generate procedural glowing radiant sparkle star texture with 4-point diffraction flares
        function createStarSpriteTexture() {
            const starCanvas = document.createElement("canvas");
            starCanvas.width = 64;
            starCanvas.height = 64;
            const sCtx = starCanvas.getContext("2d");

            // 1. Soft glowing aura
            const g = sCtx.createRadialGradient(32, 32, 0, 32, 32, 30);
            g.addColorStop(0, "rgba(255, 255, 255, 1)");
            g.addColorStop(0.18, "rgba(224, 242, 254, 0.85)");
            g.addColorStop(0.42, "rgba(56, 229, 255, 0.35)");
            g.addColorStop(0.75, "rgba(192, 132, 252, 0.08)");
            g.addColorStop(1, "rgba(0, 0, 0, 0)");
            sCtx.fillStyle = g;
            sCtx.beginPath();
            sCtx.arc(32, 32, 30, 0, Math.PI * 2);
            sCtx.fill();

            // 2. Horizontal & Vertical 4-Point Sharp Diffraction Flares
            const flareGradH = sCtx.createLinearGradient(4, 32, 60, 32);
            flareGradH.addColorStop(0, "rgba(56, 229, 255, 0)");
            flareGradH.addColorStop(0.5, "rgba(255, 255, 255, 1)");
            flareGradH.addColorStop(1, "rgba(56, 229, 255, 0)");
            sCtx.fillStyle = flareGradH;
            sCtx.beginPath();
            sCtx.moveTo(4, 32);
            sCtx.lineTo(32, 30);
            sCtx.lineTo(60, 32);
            sCtx.lineTo(32, 34);
            sCtx.closePath();
            sCtx.fill();

            const flareGradV = sCtx.createLinearGradient(32, 4, 32, 60);
            flareGradV.addColorStop(0, "rgba(56, 229, 255, 0)");
            flareGradV.addColorStop(0.5, "rgba(255, 255, 255, 1)");
            flareGradV.addColorStop(1, "rgba(56, 229, 255, 0)");
            sCtx.fillStyle = flareGradV;
            sCtx.beginPath();
            sCtx.moveTo(32, 4);
            sCtx.lineTo(34, 32);
            sCtx.lineTo(32, 60);
            sCtx.lineTo(30, 32);
            sCtx.closePath();
            sCtx.fill();

            // 3. Bright Diamond Core
            sCtx.beginPath();
            sCtx.arc(32, 32, 3.5, 0, Math.PI * 2);
            sCtx.fillStyle = "#ffffff";
            sCtx.shadowColor = "#38e5ff";
            sCtx.shadowBlur = 8;
            sCtx.fill();

            const tex = new THREE.CanvasTexture(starCanvas);
            tex.needsUpdate = true;
            return tex;
        }

        const starTexture = createStarSpriteTexture();

        // 1. Primary Vibrant Multi-Colored Celestial Starfield (Small, sharp pinpoint stars)
        const starGeo = new THREE.BufferGeometry();
        const starCount = 6000;
        const starPositions = new Float32Array(starCount * 3);
        const starColors = new Float32Array(starCount * 3);

        const vibrantPalette = [
            [1.0, 1.0, 1.0],       // Diamond White
            [0.22, 0.90, 1.0],     // Electric Neon Cyan
            [0.85, 0.35, 1.0],     // Quantum Violet / Magenta
            [1.0, 0.84, 0.25],     // Cosmic Gold / Amber
            [0.25, 0.95, 0.65],    // Emerald Auroral Green
            [0.40, 0.65, 1.0],     // Deep Sapphire Blue
            [1.0, 0.45, 0.70]      // Nebula Rose Pink
        ];

        for (let i = 0; i < starCount; i++) {
            const r = 2.2 + Math.pow(Math.random(), 0.6) * 19.0;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            starPositions[i * 3 + 1] = r * Math.cos(phi);
            starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

            const col = vibrantPalette[Math.floor(Math.random() * vibrantPalette.length)];
            starColors[i * 3] = col[0];
            starColors[i * 3 + 1] = col[1];
            starColors[i * 3 + 2] = col[2];
        }
        starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
        starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

        const starMat = new THREE.PointsMaterial({
            size: 0.055,
            map: starTexture,
            vertexColors: true,
            transparent: true,
            opacity: 0.82,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const stars = new THREE.Points(starGeo, starMat);
        scene.add(stars);

        // 2. Foreground Multi-Colored Orbiting Quantum Stardust Particles (Small, delicate nodes)
        const qStarGeo = new THREE.BufferGeometry();
        const qStarCount = 1200;
        const qStarPositions = new Float32Array(qStarCount * 3);
        const qStarColors = new Float32Array(qStarCount * 3);

        for (let i = 0; i < qStarCount; i++) {
            const r = 1.5 + Math.random() * 4.5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            qStarPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            qStarPositions[i * 3 + 1] = r * Math.cos(phi);
            qStarPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

            const col = vibrantPalette[i % vibrantPalette.length];
            qStarColors[i * 3] = col[0];
            qStarColors[i * 3 + 1] = col[1];
            qStarColors[i * 3 + 2] = col[2];
        }
        qStarGeo.setAttribute("position", new THREE.BufferAttribute(qStarPositions, 3));
        qStarGeo.setAttribute("color", new THREE.BufferAttribute(qStarColors, 3));

        const qStarMat = new THREE.PointsMaterial({
            size: 0.075,
            map: starTexture,
            vertexColors: true,
            transparent: true,
            opacity: 0.88,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const qStars = new THREE.Points(qStarGeo, qStarMat);
        scene.add(qStars);

        // 3. Delicate Little Falling / Shooting Stars (Meteor Streaks)
        const shootingStarGroup = new THREE.Group();
        scene.add(shootingStarGroup);

        const shootingStarCount = 8;
        const shootingStars = [];
        const shootingColors = [0xffffff, 0x38e5ff, 0xfacc15, 0xc084fc, 0x34d399, 0xf472b6];

        for (let i = 0; i < shootingStarCount; i++) {
            const pts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)];
            const geo = new THREE.BufferGeometry().setFromPoints(pts);
            const col = shootingColors[i % shootingColors.length];

            const mat = new THREE.LineBasicMaterial({
                color: col,
                transparent: true,
                opacity: 0,
                blending: THREE.AdditiveBlending
            });

            const line = new THREE.Line(geo, mat);
            shootingStarGroup.add(line);

            const headMat = new THREE.SpriteMaterial({
                map: starTexture,
                color: col,
                transparent: true,
                opacity: 0,
                blending: THREE.AdditiveBlending
            });
            const headSprite = new THREE.Sprite(headMat);
            headSprite.scale.set(0.065, 0.065, 0.065);
            shootingStarGroup.add(headSprite);

            shootingStars.push({
                line,
                geo,
                mat,
                headSprite,
                headMat,
                active: false,
                timer: 0.5 + Math.random() * 3.0,
                speed: 4.2 + Math.random() * 3.5,
                length: 0.4 + Math.random() * 0.45,
                progress: 0,
                startPos: new THREE.Vector3(),
                dir: new THREE.Vector3()
            });
        }

        function resetShootingStar(s) {
            const r = 4.2 + Math.random() * 7.5;
            const theta = Math.random() * Math.PI * 2;
            const y = 1.8 + Math.random() * 5.5;
            s.startPos.set(Math.cos(theta) * r, y, Math.sin(theta) * r);

            const dirTheta = theta + (Math.random() - 0.5) * 0.7;
            s.dir.set(
                -Math.cos(dirTheta) * (0.8 + Math.random() * 0.4),
                -(0.85 + Math.random() * 0.5),
                -Math.sin(dirTheta) * (0.8 + Math.random() * 0.4)
            ).normalize();

            s.speed = 3.6 + Math.random() * 3.2;
            s.length = 0.35 + Math.random() * 0.4;
            s.progress = 0;
            s.active = true;
            s.timer = 0;
        }

        // Orbiting Satellite VNQFF-09
        const satOrbitGroup = new THREE.Group();
        earthSystem.add(satOrbitGroup);

        const satOrbitRadius = 1.36;
        const orbitPts = [];
        for (let i = 0; i <= 64; i++) {
            const angle = (i / 64) * Math.PI * 2;
            orbitPts.push(new THREE.Vector3(Math.cos(angle) * satOrbitRadius, 0, Math.sin(angle) * satOrbitRadius));
        }
        const orbitLineGeo = new THREE.BufferGeometry().setFromPoints(orbitPts);
        const orbitLineMat = new THREE.LineBasicMaterial({
            color: 0x38e5ff,
            transparent: true,
            opacity: 0.25
        });
        const orbitLine = new THREE.Line(orbitLineGeo, orbitLineMat);
        satOrbitGroup.add(orbitLine);
        satOrbitGroup.rotation.x = 0.52;
        satOrbitGroup.rotation.z = 0.35;

        const satMesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.028, 0.014, 0.02),
            new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.85 })
        );
        const satSolar = new THREE.Mesh(
            new THREE.PlaneGeometry(0.075, 0.02),
            new THREE.MeshBasicMaterial({ color: 0x38e5ff, side: THREE.DoubleSide })
        );
        satMesh.add(satSolar);
        satOrbitGroup.add(satMesh);
        let satAngle = 0;

        // Target Marker (Beacon + Radar Ring)
        const markerGroup = new THREE.Group();
        earthSystem.add(markerGroup);

        const markerSphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.022, 24, 24),
            new THREE.MeshBasicMaterial({ color: 0x38e5ff })
        );
        markerGroup.add(markerSphere);

        const ringMesh = new THREE.Mesh(
            new THREE.RingGeometry(0.028, 0.05, 32),
            new THREE.MeshBasicMaterial({
                color: 0x38e5ff,
                transparent: true,
                opacity: 0.85,
                side: THREE.DoubleSide
            })
        );
        markerGroup.add(ringMesh);

        // ==========================================================================
        // REALISTIC NEIGHBORING CELESTIAL PLANETS (Photorealistic Venus & Mars)
        // ==========================================================================

        // Ultra-realistic procedural Venus Atmosphere Texture (Pale cream, sulfuric acid UV chevron waves)
        function createRealisticVenusTexture() {
            const vCanvas = document.createElement("canvas");
            vCanvas.width = 1024;
            vCanvas.height = 512;
            const vCtx = vCanvas.getContext("2d");

            // Base pale golden-cream cloud deck (true natural Venusian color)
            const baseGrad = vCtx.createLinearGradient(0, 0, 0, 512);
            baseGrad.addColorStop(0, "#d4b07b");     // North polar hood
            baseGrad.addColorStop(0.18, "#e8cca0");
            baseGrad.addColorStop(0.48, "#fdedc9");  // Equatorial bright zone
            baseGrad.addColorStop(0.52, "#fdedc9");
            baseGrad.addColorStop(0.82, "#e8cca0");
            baseGrad.addColorStop(1, "#d4b07b");     // South polar hood
            vCtx.fillStyle = baseGrad;
            vCtx.fillRect(0, 0, 1024, 512);

            // Ultraviolet chevron / Y-feature planetary cloud waves (Mariner 10 / Akatsuki signature)
            vCtx.fillStyle = "rgba(180, 140, 85, 0.14)";
            for (let i = 0; i < 32; i++) {
                const y = 80 + i * 11;
                vCtx.beginPath();
                vCtx.moveTo(0, y);
                for (let x = 0; x < 1024; x += 40) {
                    const wave = Math.sin((x / 1024) * Math.PI * 4) * 14 + Math.cos((x / 1024) * Math.PI * 8) * 6;
                    vCtx.quadraticCurveTo(x + 20, y + wave, x + 40, y);
                }
                vCtx.lineTo(1024, 512);
                vCtx.lineTo(0, 512);
                vCtx.fill();
            }

            // Equatorial dark cloud striations
            vCtx.fillStyle = "rgba(160, 115, 65, 0.08)";
            for (let y = 180; y < 330; y += 14) {
                vCtx.fillRect(0, y, 1024, 6);
            }

            // Soft polar hood gradients
            const polarGradN = vCtx.createRadialGradient(512, 0, 10, 512, 0, 160);
            polarGradN.addColorStop(0, "rgba(255, 245, 220, 0.35)");
            polarGradN.addColorStop(1, "transparent");
            vCtx.fillStyle = polarGradN;
            vCtx.fillRect(0, 0, 1024, 180);

            const polarGradS = vCtx.createRadialGradient(512, 512, 10, 512, 512, 160);
            polarGradS.addColorStop(0, "rgba(255, 245, 220, 0.35)");
            polarGradS.addColorStop(1, "transparent");
            vCtx.fillStyle = polarGradS;
            vCtx.fillRect(0, 332, 1024, 180);

            const tex = new THREE.CanvasTexture(vCanvas);
            tex.needsUpdate = true;
            return tex;
        }

        // Ultra-realistic procedural Mars Surface Texture (Rust ochre, Syrtis Major, Valles Marineris, Polar Caps)
        function createRealisticMarsTexture() {
            const mCanvas = document.createElement("canvas");
            mCanvas.width = 1024;
            mCanvas.height = 512;
            const mCtx = mCanvas.getContext("2d");

            // Base Martian iron oxide rust & desert plains
            const baseGrad = mCtx.createLinearGradient(0, 0, 0, 512);
            baseGrad.addColorStop(0, "#8a3319");
            baseGrad.addColorStop(0.2, "#b84a27");
            baseGrad.addColorStop(0.5, "#cf5c32");
            baseGrad.addColorStop(0.8, "#b84a27");
            baseGrad.addColorStop(1, "#8a3319");
            mCtx.fillStyle = baseGrad;
            mCtx.fillRect(0, 0, 1024, 512);

            // Dark volcanic basaltic maria regions (Syrtis Major, Mare Erythraeum, Acidalia)
            mCtx.fillStyle = "#4a1c10";
            const mariaFeatures = [
                { x: 280, y: 240, rx: 75, ry: 45 },  // Syrtis Major
                { x: 580, y: 310, rx: 110, ry: 55 }, // Mare Erythraeum / Acidalia
                { x: 800, y: 220, rx: 85, ry: 40 },  // Sinus Sabaeus
                { x: 120, y: 290, rx: 60, ry: 35 },  // Mare Cimmerium
                { x: 440, y: 160, rx: 90, ry: 30 }   // Acidalia Planitia
            ];
            mariaFeatures.forEach(f => {
                mCtx.beginPath();
                mCtx.ellipse(f.x, f.y, f.rx, f.ry, 0.2, 0, Math.PI * 2);
                mCtx.fill();
            });

            // Valles Marineris Canyon System (Equatorial chasm)
            mCtx.strokeStyle = "#38130a";
            mCtx.lineWidth = 7;
            mCtx.beginPath();
            mCtx.moveTo(420, 260);
            mCtx.quadraticCurveTo(530, 275, 680, 265);
            mCtx.stroke();

            // Olympus Mons Volcanic Caldera & Tharsis Montes
            mCtx.fillStyle = "#8a381e";
            mCtx.beginPath();
            mCtx.arc(360, 210, 24, 0, Math.PI * 2); // Olympus Mons
            mCtx.fill();
            mCtx.fillStyle = "#38130a";
            mCtx.beginPath();
            mCtx.arc(360, 210, 8, 0, Math.PI * 2);  // Caldera crater
            mCtx.fill();

            // Cratered Highland Noise Stippling
            mCtx.fillStyle = "rgba(74, 28, 16, 0.22)";
            for (let i = 0; i < 90; i++) {
                const cx = (i * 37) % 1024;
                const cy = 80 + (i * 17) % 360;
                mCtx.beginPath();
                mCtx.arc(cx, cy, 3 + (i % 6) * 3, 0, Math.PI * 2);
                mCtx.fill();
            }

            // Brilliant Icy Polar Caps with spiral boundaries
            mCtx.fillStyle = "#ffffff";
            // North Polar Cap (Planum Boreum)
            mCtx.beginPath();
            mCtx.ellipse(512, 16, 220, 22, 0, 0, Math.PI * 2);
            mCtx.fill();
            mCtx.fillStyle = "rgba(224, 242, 254, 0.9)";
            mCtx.beginPath();
            mCtx.ellipse(512, 22, 170, 16, 0, 0, Math.PI * 2);
            mCtx.fill();

            // South Polar Cap (Planum Australe)
            mCtx.fillStyle = "#ffffff";
            mCtx.beginPath();
            mCtx.ellipse(512, 496, 180, 18, 0, 0, Math.PI * 2);
            mCtx.fill();
            mCtx.fillStyle = "rgba(224, 242, 254, 0.9)";
            mCtx.beginPath();
            mCtx.ellipse(512, 490, 140, 14, 0, 0, Math.PI * 2);
            mCtx.fill();

            const tex = new THREE.CanvasTexture(mCanvas);
            tex.needsUpdate = true;
            return tex;
        }

        // Helper: Generate Holographic Sci-Fi Planet Identification Marker
        // ==========================================================================
        // REALISTIC SOLAR SYSTEM PLANETS (Mercury, Venus on Right; Mars, Jupiter, Saturn, Uranus, Neptune on Left)
        // ==========================================================================

        // --- 1. Procedural Mercury Texture (Cratered grey silicate / Caloris basin) ---
        function createRealisticMercuryTexture() {
            const canvas = document.createElement("canvas");
            canvas.width = 512;
            canvas.height = 256;
            const ctx = canvas.getContext("2d");

            // Slate grey basaltic base
            ctx.fillStyle = "#6b7280";
            ctx.fillRect(0, 0, 512, 256);

            // Caloris Basin & volcanic impact plains
            ctx.fillStyle = "#4b5563";
            for (let i = 0; i < 40; i++) {
                const cx = (i * 29) % 512;
                const cy = 30 + (i * 19) % 190;
                ctx.beginPath();
                ctx.arc(cx, cy, 6 + (i % 5) * 4, 0, Math.PI * 2);
                ctx.fill();
            }

            // Bright crater ray systems
            ctx.fillStyle = "rgba(229, 231, 235, 0.85)";
            for (let i = 0; i < 16; i++) {
                const rx = (i * 61) % 512;
                const ry = 40 + (i * 23) % 180;
                ctx.beginPath();
                ctx.arc(rx, ry, 3, 0, Math.PI * 2);
                ctx.fill();
            }

            const tex = new THREE.CanvasTexture(canvas);
            tex.needsUpdate = true;
            return tex;
        }

        // --- 2. Procedural Jupiter Texture (Equatorial belts, Great Red Spot, zonal turbulence) ---
        function createRealisticJupiterTexture() {
            const canvas = document.createElement("canvas");
            canvas.width = 1024;
            canvas.height = 512;
            const ctx = canvas.getContext("2d");

            // Cream/amber base
            const grad = ctx.createLinearGradient(0, 0, 0, 512);
            grad.addColorStop(0, "#78350f");
            grad.addColorStop(0.12, "#b45309");
            grad.addColorStop(0.24, "#d97706");
            grad.addColorStop(0.36, "#fed7aa"); // North Tropical Zone
            grad.addColorStop(0.44, "#9a3412"); // North Equatorial Belt
            grad.addColorStop(0.50, "#ffedd5"); // Equatorial Zone
            grad.addColorStop(0.56, "#9a3412"); // South Equatorial Belt
            grad.addColorStop(0.68, "#fed7aa"); // South Tropical Zone
            grad.addColorStop(0.80, "#d97706");
            grad.addColorStop(1, "#78350f");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 1024, 512);

            // Zonal turbulent wave bands
            ctx.fillStyle = "rgba(154, 52, 18, 0.35)";
            for (let y = 140; y < 380; y += 18) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                for (let x = 0; x < 1024; x += 32) {
                    ctx.quadraticCurveTo(x + 16, y + Math.sin(x * 0.05) * 8, x + 32, y);
                }
                ctx.lineTo(1024, 512);
                ctx.lineTo(0, 512);
                ctx.fill();
            }

            // Great Red Spot (Anticyclonic storm)
            ctx.fillStyle = "#dc2626";
            ctx.beginPath();
            ctx.ellipse(620, 290, 55, 34, -0.08, 0, Math.PI * 2);
            ctx.fill();

            // Great Red Spot inner eye
            ctx.fillStyle = "#b91c1c";
            ctx.beginPath();
            ctx.ellipse(620, 290, 32, 18, -0.08, 0, Math.PI * 2);
            ctx.fill();

            // White oval storms
            ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
            for (let i = 0; i < 8; i++) {
                ctx.beginPath();
                ctx.ellipse(150 + i * 110, 340 + (i % 2) * 12, 16, 9, 0, 0, Math.PI * 2);
                ctx.fill();
            }

            const tex = new THREE.CanvasTexture(canvas);
            tex.needsUpdate = true;
            return tex;
        }

        // Helper: Generate Holographic Sci-Fi Planet Identification Marker
        function createPlanetLabelSprite(name, dist, colorHex) {
            const lCanvas = document.createElement("canvas");
            lCanvas.width = 256;
            lCanvas.height = 70;
            const lCtx = lCanvas.getContext("2d");

            lCtx.fillStyle = "rgba(6, 12, 26, 0.85)";
            lCtx.strokeStyle = colorHex;
            lCtx.lineWidth = 1.8;
            lCtx.fillRect(8, 8, 240, 54);
            lCtx.strokeRect(8, 8, 240, 54);

            lCtx.fillStyle = colorHex;
            lCtx.font = "bold 17px 'JetBrains Mono', monospace";
            lCtx.fillText(name, 20, 32);

            lCtx.fillStyle = "#94a3b8";
            lCtx.font = "11.5px 'JetBrains Mono', monospace";
            lCtx.fillText(dist, 20, 50);

            const tex = new THREE.CanvasTexture(lCanvas);
            tex.needsUpdate = true;
            const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.88 });
            const sprite = new THREE.Sprite(spriteMat);
            sprite.scale.set(0.72, 0.20, 1);
            return sprite;
        }

        // ==========================================================================
        // RIGHT SIDE OF EARTH: INNER PLANETS (Venus & Mercury)
        // ==========================================================================

        // 1. VENUS (Right Side #1 • 0.72 AU)
        const venusGroup = new THREE.Group();
        venusGroup.position.set(3.2, 0.32, -1.2);
        venusGroup.rotation.z = THREE.MathUtils.degToRad(177.3);
        scene.add(venusGroup);

        const venusMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.32, 64, 64),
            new THREE.MeshStandardMaterial({ map: createRealisticVenusTexture(), roughness: 0.82, metalness: 0.05 })
        );
        venusGroup.add(venusMesh);

        const venusAtmo = new THREE.Mesh(
            new THREE.SphereGeometry(0.336, 64, 64),
            new THREE.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0.15, side: THREE.BackSide, blending: THREE.AdditiveBlending })
        );
        venusGroup.add(venusAtmo);

        const venusLabel = createPlanetLabelSprite("♀ VENUS", "0.72 AU • 108.2M KM", "#facc15");
        venusLabel.position.set(0, 0.52, 0);
        venusGroup.add(venusLabel);

        // 2. MERCURY (Right Side #2 • 0.39 AU)
        const mercuryGroup = new THREE.Group();
        mercuryGroup.position.set(5.2, 0.16, -2.0);
        mercuryGroup.rotation.z = THREE.MathUtils.degToRad(2.04);
        scene.add(mercuryGroup);

        const mercuryMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.18, 48, 48),
            new THREE.MeshStandardMaterial({ map: createRealisticMercuryTexture(), roughness: 0.95, metalness: 0.1 })
        );
        mercuryGroup.add(mercuryMesh);

        const mercuryLabel = createPlanetLabelSprite("☿ MERCURY", "0.39 AU • 57.9M KM", "#94a3b8");
        mercuryLabel.position.set(0, 0.36, 0);
        mercuryGroup.add(mercuryLabel);

        // ==========================================================================
        // LEFT SIDE OF EARTH: OUTER PLANETS (Mars & Jupiter)
        // ==========================================================================

        // 3. MARS (Left Side #1 • 1.52 AU)
        const marsGroup = new THREE.Group();
        marsGroup.position.set(-3.8, -0.25, -1.5);
        marsGroup.rotation.z = THREE.MathUtils.degToRad(25.19);
        scene.add(marsGroup);

        const marsMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.26, 64, 64),
            new THREE.MeshStandardMaterial({ map: createRealisticMarsTexture(), roughness: 0.88, metalness: 0.08 })
        );
        marsGroup.add(marsMesh);

        const marsAtmo = new THREE.Mesh(
            new THREE.SphereGeometry(0.274, 64, 64),
            new THREE.MeshBasicMaterial({ color: 0xf87171, transparent: true, opacity: 0.14, side: THREE.BackSide, blending: THREE.AdditiveBlending })
        );
        marsGroup.add(marsAtmo);

        const marsLabel = createPlanetLabelSprite("♂ MARS", "1.52 AU • 227.9M KM", "#f87171");
        marsLabel.position.set(0, 0.46, 0);
        marsGroup.add(marsLabel);

        // 4. JUPITER (Left Side #2 • 5.20 AU - King of Planets)
        const jupiterGroup = new THREE.Group();
        jupiterGroup.position.set(-8.0, 0.55, -3.4);
        jupiterGroup.rotation.z = THREE.MathUtils.degToRad(3.13);
        scene.add(jupiterGroup);

        const jupiterMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.68, 64, 64),
            new THREE.MeshStandardMaterial({ map: createRealisticJupiterTexture(), roughness: 0.75, metalness: 0.05 })
        );
        jupiterGroup.add(jupiterMesh);

        const jupiterAtmo = new THREE.Mesh(
            new THREE.SphereGeometry(0.71, 64, 64),
            new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.12, side: THREE.BackSide, blending: THREE.AdditiveBlending })
        );
        jupiterGroup.add(jupiterAtmo);

        const jupiterLabel = createPlanetLabelSprite("♃ JUPITER", "5.20 AU • 778.5M KM", "#f59e0b");
        jupiterLabel.position.set(0, 0.94, 0);
        jupiterGroup.add(jupiterLabel);

        // OrbitControls
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.enablePan = false;
        controls.minDistance = 1.35;
        controls.maxDistance = 14.0;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.35;

        // Raycasting for picking location on globe
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        let pointerDownTime = 0;
        let pointerDownPos = { x: 0, y: 0 };

        function latLngToVector3(lat, lng, radius = 1.0) {
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lng + 180) * (Math.PI / 180);
            return new THREE.Vector3(
                -radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.cos(phi),
                radius * Math.sin(phi) * Math.sin(theta)
            );
        }

        function vector3ToLatLng(v) {
            const norm = v.clone().normalize();
            const lat = 90 - Math.acos(norm.y) * (180 / Math.PI);
            let lng = ((Math.atan2(norm.z, -norm.x) * (180 / Math.PI)) - 180);
            while (lng < -180) lng += 360;
            while (lng > 180) lng -= 360;
            return { lat, lng };
        }

        // Set Marker at Lat/Lng
        function placeMarker(lat, lng) {
            const localPos = latLngToVector3(lat, lng, 1.008);
            markerGroup.position.copy(localPos);
            markerGroup.visible = true;
            ringMesh.lookAt(localPos.clone().multiplyScalar(2));
        }

        // Initial default marker at California
        placeMarker(state.lat, state.lng);

        // Pointer Events on 3D Earth
        renderer.domElement.addEventListener("pointermove", (e) => {
            const rect = renderer.domElement.getBoundingClientRect();
            pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(pointer, camera);
            const intersects = raycaster.intersectObject(earthMesh, false);

            if (intersects.length > 0) {
                // Transform hit point into local coords of earthMesh
                const localHit = earthMesh.worldToLocal(intersects[0].point.clone());
                const coords = vector3ToLatLng(localHit);
                const latStr = `${Math.abs(coords.lat).toFixed(3)}° ${coords.lat >= 0 ? "N" : "S"}`;
                const lngStr = `${Math.abs(coords.lng).toFixed(3)}° ${coords.lng >= 0 ? "E" : "W"}`;
                if ($("globeCursorCoords")) {
                    $("globeCursorCoords").textContent = `${latStr}, ${lngStr}`;
                }
            }
        });

        renderer.domElement.addEventListener("pointerdown", (e) => {
            pointerDownTime = performance.now();
            pointerDownPos = { x: e.clientX, y: e.clientY };
        });

        renderer.domElement.addEventListener("pointerup", (e) => {
            const elapsed = performance.now() - pointerDownTime;
            const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);

            // True click without heavy drag
            if (elapsed < 350 && dist < 6) {
                const rect = renderer.domElement.getBoundingClientRect();
                pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

                raycaster.setFromCamera(pointer, camera);
                const intersects = raycaster.intersectObject(earthMesh, false);

                if (intersects.length > 0) {
                    const localHit = earthMesh.worldToLocal(intersects[0].point.clone());
                    const coords = vector3ToLatLng(localHit);
                    handleLocationPicked(coords.lat, coords.lng);
                }
            }
        });

        // Resize
        function onResize() {
            const w = container.clientWidth || 600;
            const h = container.clientHeight || 460;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        }
        window.addEventListener("resize", onResize);

        // Animation Loop
        let lastTime = performance.now();
        let last3DMeteorTime = performance.now();

        function animate() {
            requestAnimationFrame(animate);
            const now = performance.now();
            const delta = (now - lastTime) / 1000;
            lastTime = now;

            controls.update();

            // Rotate clouds independently
            cloudMesh.rotation.y += 0.00015;

            // Rotate celestial stars continuously for a moving cosmos!
            stars.rotation.y += 0.00028;
            stars.rotation.x += 0.00009;
            if (qStars) {
                qStars.rotation.y -= 0.00022;
                qStars.rotation.z += 0.00012;
            }

            // Rotate neighboring planets (Venus, Mercury, Mars, Jupiter)
            mercuryMesh.rotation.y += 0.00010;
            venusMesh.rotation.y += 0.00014;
            marsMesh.rotation.y += 0.00022;
            jupiterMesh.rotation.y += 0.00045;

            // Animate Little Falling / Shooting Stars (Meteor Streaks)
            const dt = Math.min(delta, 0.05);
            shootingStars.forEach(s => {
                if (!s.active) {
                    s.timer -= dt;
                    if (s.timer <= 0) {
                        resetShootingStar(s);
                    }
                } else {
                    s.progress += dt * s.speed;

                    const headPos = s.startPos.clone().addScaledVector(s.dir, s.progress);
                    const tailPos = headPos.clone().addScaledVector(s.dir, -s.length);

                    const posAttr = s.geo.attributes.position;
                    posAttr.setXYZ(0, headPos.x, headPos.y, headPos.z);
                    posAttr.setXYZ(1, tailPos.x, tailPos.y, tailPos.z);
                    posAttr.needsUpdate = true;

                    s.headSprite.position.copy(headPos);

                    // Smooth fade in and out curve
                    let alpha = 1.0;
                    if (s.progress < 0.5) {
                        alpha = s.progress / 0.5;
                    } else if (s.progress > 3.8) {
                        alpha = Math.max(0, 1 - (s.progress - 3.8) / 1.4);
                    }

                    s.mat.opacity = alpha * 0.85;
                    s.headMat.opacity = alpha * 0.95;

                    if (s.progress > 5.2 || headPos.y < -3.5) {
                        s.active = false;
                        s.mat.opacity = 0;
                        s.headMat.opacity = 0;
                        s.timer = 1.2 + Math.random() * 4.0;
                    }
                }
            });

            // Orbit VNQFF-09 Quantum Satellite
            satAngle += 0.008;
            satMesh.position.set(
                Math.cos(satAngle) * satOrbitRadius,
                0,
                Math.sin(satAngle) * satOrbitRadius
            );
            satMesh.lookAt(0, 0, 0);

            // Pulse beacon ring
            const pulse = 1 + Math.sin(now * 0.005) * 0.22;
            ringMesh.scale.set(pulse, pulse, 1);

            renderer.render(scene, camera);
        }
        animate();

        // Store globe app in closure
        globeInstance = {
            scene,
            camera,
            renderer,
            controls,
            earthMesh,
            earthMaterial,
            cloudMesh,
            gridGroup,
            sunLight,
            ambientLight,
            earthSystem,
            placeMarker,
            latLngToVector3,
            focusLocation: (lat, lng) => {
                placeMarker(lat, lng);
                const targetVec = latLngToVector3(lat, lng, 3.1);
                // Smooth camera move
                const startPos = camera.position.clone();
                let progress = 0;
                const animDuration = 600; // ms
                const startTime = performance.now();

                function stepCam() {
                    const elapsed = performance.now() - startTime;
                    progress = Math.min(elapsed / animDuration, 1);
                    const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
                    camera.position.lerpVectors(startPos, targetVec, ease);
                    controls.target.set(0, 0, 0);
                    if (progress < 1) {
                        requestAnimationFrame(stepCam);
                    }
                }
                stepCam();
            }
        };

        // Setup Virtual Globe Toolbar Buttons
        $("globeCompass")?.addEventListener("click", () => {
            camera.position.set(0, 0, 3.25);
            controls.target.set(0, 0, 0);
            controls.update();
            showToast("Compass: Re-oriented to North");
        });

        $("globeZoomIn")?.addEventListener("click", () => {
            camera.position.multiplyScalar(0.82);
            camera.position.clampLength(controls.minDistance, controls.maxDistance);
        });

        $("globeZoomOut")?.addEventListener("click", () => {
            camera.position.multiplyScalar(1.22);
            camera.position.clampLength(controls.minDistance, controls.maxDistance);
        });

        $("earthAutoRotate")?.addEventListener("click", (e) => {
            controls.autoRotate = !controls.autoRotate;
            e.currentTarget.textContent = controls.autoRotate ? "⏸" : "▶";
            e.currentTarget.title = controls.autoRotate ? "Pause Auto-Rotation" : "Resume Auto-Rotation";
        });

        let nightMode = false;
        $("globeDayNight")?.addEventListener("click", (e) => {
            nightMode = !nightMode;
            if (nightMode) {
                sunLight.intensity = 0.55;
                ambientLight.intensity = 0.18;
                earthMaterial.shininess = 6;
                e.currentTarget.textContent = "🌙";
                showToast("Day/Night: Night Observation Mode");
            } else {
                sunLight.intensity = 2.6;
                ambientLight.intensity = 0.45;
                earthMaterial.shininess = 28;
                e.currentTarget.textContent = "☀";
                showToast("Day/Night: Solar Illumination Mode");
            }
        });

        $("globeGrid")?.addEventListener("click", (e) => {
            gridGroup.visible = !gridGroup.visible;
            e.currentTarget.classList.toggle("active", gridGroup.visible);
            showToast(gridGroup.visible ? "Coordinates Grid: Enabled" : "Coordinates Grid: Disabled");
        });

        $("globeReset")?.addEventListener("click", () => {
            camera.position.set(0, 0, 3.25);
            controls.target.set(0, 0, 0);
            earthSystem.rotation.set(0, 0, 0);
            controls.autoRotate = true;
            $("earthAutoRotate").textContent = "⏸";
            placeMarker(state.lat, state.lng);
            showToast("3D Globe view reset to default");
        });

        $("globeFullscreen")?.addEventListener("click", () => {
            if (!document.fullscreenElement) {
                container.closest(".card")?.requestFullscreen?.();
            } else {
                document.exitFullscreen?.();
            }
            setTimeout(onResize, 150);
        });

        // Location Presets Select Dropdown
        $("locationPresetsSelect")?.addEventListener("change", (e) => {
            const val = e.target.value;
            if (PRESETS[val]) {
                applyPreset(val);
            }
        });

        // Setup Quick Exploration Preset Chips
        document.querySelectorAll(".quick-preset-chip").forEach(chip => {
            chip.addEventListener("click", () => {
                const presetKey = chip.getAttribute("data-preset");
                if (presetKey && PRESETS[presetKey]) {
                    applyPreset(presetKey);
                }
            });
        });
    }

    /* ==========================================================================
       4. DYNAMIC LOCATION SELECTION & ALL DOMAINS TELEMETRY
       ========================================================================== */

    function handleLocationPicked(lat, lng) {
        state.lat = Number(lat.toFixed(4));
        state.lng = Number(lng.toFixed(4));

        if (globeInstance) {
            globeInstance.placeMarker(state.lat, state.lng);
        }

        // Check if close to any preset
        let matchedPresetKey = null;
        for (const [key, p] of Object.entries(PRESETS)) {
            const d = Math.hypot(p.lat - state.lat, p.lng - state.lng);
            if (d < 3.5) {
                matchedPresetKey = key;
                break;
            }
        }

        if (matchedPresetKey) {
            applyPreset(matchedPresetKey);
            return;
        }

        // Procedural estimation for arbitrary location on Earth
        const customProfile = estimateLocationProfile(state.lat, state.lng);
        state.locationName = customProfile.name;
        state.subRegion = customProfile.sub;
        state.biome = customProfile.biome;
        state.domain = customProfile.domain;
        state.angles = customProfile.angles;
        state.latentVector = customProfile.vector;

        updateInspectorWithProfile(customProfile);
        showToast(`Target acquired: ${state.locationName}`);
        addTutorBotMessage(`📍 **Location Selected:** ${state.locationName} (${state.biome}). Primary Domain: **${getDomainTitle(state.domain)}**. Telemetry across all 5 domains synchronized.`);
    }

    function applyPreset(key) {
        const p = PRESETS[key];
        if (!p) return;

        state.lat = p.lat;
        state.lng = p.lng;
        state.locationName = p.name;
        state.subRegion = p.sub;
        state.biome = p.biome;
        state.domain = p.domain;
        state.angles = [...p.angles];
        state.latentVector = [...p.vector];
        state.activeLandcoverSample = p.sample;
        state.activeChangeScenario = p.changeScenario;

        if ($("locationPresetsSelect")) {
            $("locationPresetsSelect").value = key;
        }

        // Synchronize Quick Preset Chips active state
        document.querySelectorAll(".quick-preset-chip").forEach(chip => {
            if (chip.getAttribute("data-preset") === key) {
                chip.classList.add("active");
            } else {
                chip.classList.remove("active");
            }
        });

        if (globeInstance) {
            globeInstance.focusLocation(p.lat, p.lng);
        }

        updateInspectorWithProfile(p);
        showToast(`Target Preset: ${p.name}`);
        addTutorBotMessage(`📍 **Target Preset Loaded:** **${p.name}** (${p.biome}). Loaded 8-D latent vector and updated all 5 applicability models.`);
    }

    function estimateLocationProfile(lat, lng) {
        let biome = "Temperate Mixed Surface";
        let domain = "agriculture";
        let regionName = "Coordinates Observation Point";
        let sub = `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lng).toFixed(2)}° ${lng >= 0 ? "E" : "W"}`;

        // Latitude/Longitude heuristics
        if (Math.abs(lat) > 65) {
            biome = "Polar Cryosphere / Ice Shelf";
            domain = "space";
            regionName = lat > 0 ? "Arctic Circumpolar Station" : "Antarctic Ice Plateau";
        } else if (Math.abs(lat) < 15 && lng > -75 && lng < -50) {
            biome = "Equatorial Rain Basin";
            domain = "disaster";
            regionName = "Amazon Basin Tributary";
        } else if (lat > 18 && lat < 34 && lng > -15 && lng < 45) {
            biome = "Arid Desert / Basin";
            domain = "water";
            regionName = "Sahara-Sahel Transition";
        } else if (lat > 25 && lat < 55 && lng > -125 && lng < -70) {
            biome = "North American Continental Grid";
            domain = "agriculture";
            regionName = "Midwest Plains Sector";
        } else if (lat > 35 && lat < 60 && lng > -10 && lng < 35) {
            biome = "European Built-up & River Valley";
            domain = "urban";
            regionName = "Western European Corridor";
        } else if (lat > 10 && lat < 45 && lng > 95 && lng < 145) {
            biome = "East Asian Urban Coastal Rim";
            domain = "urban";
            regionName = "East Asian Maritime Basin";
        }

        // Deterministic synthetic metrics based on lat/lng
        const seed = Math.sin(lat * 12.9898 + lng * 78.233);
        const agScore = Math.floor(40 + Math.abs(seed) * 55);
        const waterScore = Math.floor(35 + Math.abs(Math.cos(lat)) * 60);
        const urbanScore = Math.floor(20 + Math.abs(Math.sin(lng)) * 75);
        const disasterScore = Math.floor(15 + Math.abs(seed * Math.sin(lat)) * 70);
        const spaceScore = Math.floor(88 + Math.abs(seed) * 11);

        const angles = [
            Math.abs(seed * 2),
            Math.abs(Math.cos(lat * 0.1) * 2),
            Math.abs(Math.sin(lng * 0.1) * 2),
            Math.abs(seed * 1.5),
            Math.abs(Math.cos(lng * 0.05) * 2.5),
            Math.abs(Math.sin(lat * 0.05) * 2),
            Math.abs(seed * 2.2),
            Math.abs(Math.cos(lat * lng * 0.001) * 2)
        ];

        const vector = angles.map(a => Number((Math.sin(a * 3)).toFixed(2)));

        return {
            name: regionName,
            sub: sub,
            biome: biome,
            domain: domain,
            metrics: {
                agriculture: { score: agScore, label: `NDVI Index: ${(agScore / 100).toFixed(2)}`, status: agScore > 70 ? "High Biomass" : "Moderate Crop" },
                water: { score: waterScore, label: `Surface Water Index: ${(waterScore / 100).toFixed(2)}`, status: waterScore > 75 ? "Abundant Water" : "Seasonal Inflow" },
                urban: { score: urbanScore, label: `Built-up Density: ${urbanScore}%`, status: urbanScore > 65 ? "Dense Infrastructure" : "Open Canopy" },
                disaster: { score: disasterScore, label: `Disturbance Index: ${disasterScore}/100`, status: disasterScore > 60 ? "Hotspot Watch" : "Nominal Stability" },
                space: { score: spaceScore, label: "Orbital Revisit: 5-Day Sentinel", status: "Active Tracking" }
            },
            angles: angles,
            vector: vector
        };
    }

    function getDomainTitle(domain) {
        switch (domain) {
            case "agriculture": return "🌾 Agriculture & Crop Health";
            case "water": return "💧 Water Management";
            case "urban": return "🏙️ Urban Planning";
            case "disaster": return "🚨 Disaster Screening";
            case "space": return "🛰️ Space Operations";
            default: return "Earth Observation";
        }
    }

    function getDomainIcon(domain) {
        switch (domain) {
            case "agriculture": return "🌾";
            case "water": return "💧";
            case "urban": return "🏙️";
            case "disaster": return "🚨";
            case "space": return "🛰️";
            default: return "🌍";
        }
    }

    function updateInspectorWithProfile(profile) {
        // Show details container, hide empty inspector
        const emptyEl = $("emptyInspector");
        const detailsEl = $("locationDetails");
        if (emptyEl) {
            emptyEl.classList.add("hidden");
            emptyEl.style.display = "none";
        }
        if (detailsEl) {
            detailsEl.classList.remove("hidden");
            detailsEl.style.display = "flex";
        }

        // Coordinates & Location details
        if ($("selectedLocation")) $("selectedLocation").textContent = profile.name;
        if ($("selectedSub")) $("selectedSub").textContent = profile.sub;
        if ($("selectedLat")) $("selectedLat").textContent = `${Math.abs(state.lat).toFixed(4)}° ${state.lat >= 0 ? "N" : "S"}`;
        if ($("selectedLng")) $("selectedLng").textContent = `${Math.abs(state.lng).toFixed(4)}° ${state.lng >= 0 ? "E" : "W"}`;
        if ($("selectedBiome")) $("selectedBiome").textContent = profile.biome;
        if ($("selectedDomain")) $("selectedDomain").textContent = getDomainTitle(profile.domain);

        // Classification state card
        if ($("classificationResult")) {
            $("classificationResult").textContent = `${getDomainIcon(profile.domain)} ${profile.biome}`;
        }
        if ($("classificationDescription")) {
            $("classificationDescription").textContent = `Hybrid 4-qubit PQC inferred ${profile.biome.toLowerCase()} with quadratic feature separation.`;
        }
        if ($("classificationScore")) {
            const score = (92 + (Math.abs(Math.sin(state.lat)) * 7)).toFixed(1);
            $("classificationScore").textContent = `${score}%`;
        }

        // Anomaly / Environmental Disturbance
        const risk = profile.metrics.disaster.score;
        if ($("riskValue")) $("riskValue").textContent = risk;
        if ($("riskProgress")) $("riskProgress").style.width = `${risk}%`;
        if ($("riskCaption")) {
            $("riskCaption").textContent = risk > 65
                ? "Elevated disturbance detected. Prioritize multi-spectral SAR verification."
                : "Nominal: Surface variations remain within seasonal statistical bounds.";
        }

        // Top Metadata Cards
        if ($("dataSource")) $("dataSource").textContent = state.dataSource;
        if ($("datasetName")) $("datasetName").textContent = state.datasetName;
        if ($("analysisStatus")) $("analysisStatus").textContent = `Target: ${profile.name}`;
        if ($("confidence")) $("confidence").textContent = `${(94 + Math.random() * 4).toFixed(1)}%`;

        // Render ALL 5 Domains Telemetry breakdown in Inspector
        renderTargetDomainsGrid(profile.metrics, profile.domain);

        // Sync with other views
        syncLocationAcrossViews(profile);
    }

    function renderTargetDomainsGrid(metrics, primaryDomain) {
        const grid = $("targetDomainsGrid");
        if (!grid) return;
        grid.innerHTML = "";

        const domainKeys = [
            { key: "agriculture", name: "Agriculture", icon: "🌾", desc: "Crop Health & NDVI" },
            { key: "water", name: "Water Mgmt", icon: "💧", desc: "Reservoir & Runoff" },
            { key: "urban", name: "Urban Planning", icon: "🏙️", desc: "Built-up & Heat Island" },
            { key: "disaster", name: "Disaster Monitor", icon: "🚨", desc: "Fire & Flood Risk" },
            { key: "space", name: "Space Ops", icon: "🛰️", desc: "Constellation Downlink" }
        ];

        domainKeys.forEach(d => {
            const data = metrics[d.key] || { score: 75, label: "Active Inference", status: "Verified" };
            const isPrimary = d.key === primaryDomain;

            const card = document.createElement("div");
            card.className = `target-domain-card ${isPrimary ? "is-primary" : ""}`;
            card.title = `Click to inspect ${d.name} in Applicability Studio`;

            card.innerHTML = `
                <div class="target-domain-left">
                    <span class="target-domain-icon">${d.icon}</span>
                    <div>
                        <span class="target-domain-name">${d.name} ${isPrimary ? "★" : ""}</span>
                        <span class="target-domain-sub">${data.status}</span>
                    </div>
                </div>
                <div class="target-domain-metrics">
                    <span class="target-domain-metric-val">${data.label}</span>
                    <span class="target-domain-metric-label">Score: ${data.score}%</span>
                </div>
            `;

            card.addEventListener("click", () => {
                switchView("applicability");
                selectAppDomain(d.key);
                showToast(`Opened Applicability Domain: ${d.name}`);
            });

            grid.appendChild(card);
        });
    }

    function syncLocationAcrossViews(profile) {
        // Pipeline: update latent vector & circuit
        renderVectorBars();

        // Anomaly Monitor: update disturbance risk & year
        if ($("anomalyRisk")) $("anomalyRisk").textContent = profile.metrics.disaster.score;
        if ($("patternProbability")) $("patternProbability").textContent = (profile.metrics.disaster.score * 0.76).toFixed(1);

        // Land Cover: sync sample
        state.activeLandcoverSample = profile.domain;
        document.querySelectorAll(".sample-btn").forEach(b => {
            b.classList.toggle("active", b.dataset.sample === profile.domain);
        });

        // Change Detection: sync scenario
        if ($("changePresetSelect")) {
            if (profile.domain === "water") $("changePresetSelect").value = "lakemead";
            else if (profile.domain === "disaster") $("changePresetSelect").value = "wildfire";
            else if (profile.domain === "urban") $("changePresetSelect").value = "urban";
            else $("changePresetSelect").value = "amazon";
            state.activeChangeScenario = $("changePresetSelect").value;
        }

        // Applicability Studio
        state.activeAppDomain = profile.domain;
    }

    // "Run Hybrid Quantum Pipeline" CTA Button in Inspector
    $("analyzeSelectedRegionBtn")?.addEventListener("click", () => {
        switchView("pipeline");
        executePipelineSequence();
    });

    /* ==========================================================================
       5. TAB 2: HYBRID PIPELINE (CNN -> 8-D -> PQC)
       ========================================================================== */

    function renderVectorBars() {
        const container = $("vectorBarsContainer");
        if (!container) return;
        container.innerHTML = "";

        state.latentVector.forEach((val, idx) => {
            const barBox = document.createElement("div");
            const isPos = val >= 0;
            barBox.className = `vector-bar-box ${isPos ? "is-pos" : "is-neg"}`;

            const normHeight = Math.min(100, Math.max(14, Math.round(Math.abs(val) * 100)));
            const sign = isPos ? "+" : "−";
            const absVal = Math.abs(val).toFixed(2);

            barBox.innerHTML = `
                <div class="vector-bar-header">
                    <span class="vector-bar-label">z<sub>${idx}</sub></span>
                    <span class="vector-sign-badge ${isPos ? "pos" : "neg"}">${sign}</span>
                </div>
                <div class="vector-bar-track">
                    <div class="vector-bar-grid-ticks"></div>
                    <div class="vector-bar-fill ${isPos ? "pos" : "neg"}" style="height: ${normHeight}%;">
                        <div class="vector-bar-shimmer"></div>
                    </div>
                </div>
                <div class="vector-bar-val ${isPos ? "pos" : "neg"}">${sign}${absVal}</div>
            `;
            container.appendChild(barBox);
        });

        // Update circuit gate labels
        for (let i = 0; i < 4; i++) {
            const ryGate = $(`gate-ry-${i}`);
            if (ryGate) ryGate.innerHTML = `<span class="gate-fn">Ry</span><span class="gate-arg">(z<sub>${i}</sub>)</span>`;
            const rzGate = $(`gate-rz-${i}`);
            if (rzGate) rzGate.innerHTML = `<span class="gate-fn">Rz</span><span class="gate-arg">(z<sub>${i + 4}</sub>)</span>`;
        }
    }

    $("randomizeVectorBtn")?.addEventListener("click", () => {
        state.latentVector = state.latentVector.map(() => Number(((Math.random() * 2 - 1).toFixed(2))));
        state.angles = state.angles.map(() => Number((Math.random() * Math.PI).toFixed(2)));
        renderVectorBars();
        simulateQuantumState();
        showToast("Randomized 8-D Latent Vector & Circuit Gates");
    });

    $("runPipelineDemoBtn")?.addEventListener("click", executePipelineSequence);

    function executePipelineSequence() {
        const steps = [
            $("pipeStep1"),
            $("pipeStep2"),
            $("pipeStep3"),
            $("pipeStep4"),
            $("pipeStep5")
        ];

        // Animate progression through the 5 steps
        steps.forEach(s => s?.classList.remove("active"));
        showToast("Executing Classical CNN -> 8-D Latent -> 4-Qubit PQC pipeline...");

        let currentStep = 0;
        const stepInterval = setInterval(() => {
            if (currentStep < steps.length) {
                steps[currentStep]?.classList.add("active");
                currentStep++;
            } else {
                clearInterval(stepInterval);
                simulateQuantumState();
                showToast("Quantum Pipeline Execution Completed: High Confidence");
                addTutorBotMessage("⚛️ **Pipeline Complete:** Classical CNN features compressed to 8-D vector z ∈ ℝ⁸, parameterizing Ry and Rz gates. Measured concurrence = 0.88 with 8.9x classical speedup.");
            }
        }, 320);
    }

    /* ==========================================================================
       6. TAB 3: LAND COVER CLASSIFICATION (Canvas + Masks + Bio-Metrics)
       ========================================================================== */

    function renderLandcoverCanvas() {
        const canvas = $("landcoverCanvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        // Generate synthetic satellite scene based on active sample
        const sample = state.activeLandcoverSample;
        drawSyntheticSatelliteImage(ctx, w, h, sample);

        // Draw segmented classification overlay
        const opacity = state.maskOpacity;
        drawSegmentationMask(ctx, w, h, sample, opacity, state.selectedClassFilter);

        // Update class distribution bars
        updateClassDistributions(sample);
    }

    function drawSyntheticSatelliteImage(ctx, w, h, sample) {
        ctx.save();

        if (sample === "water") {
            // Lake Mead Reservoir / Arid Topography
            const terrGrad = ctx.createLinearGradient(0, 0, w, h);
            terrGrad.addColorStop(0, "#a45a2a");
            terrGrad.addColorStop(0.3, "#78350f");
            terrGrad.addColorStop(0.6, "#b45309");
            terrGrad.addColorStop(1, "#854d0e");
            ctx.fillStyle = terrGrad;
            ctx.fillRect(0, 0, w, h);

            // Canyon Ridge contours & dry washes
            ctx.strokeStyle = "rgba(69, 26, 3, 0.4)";
            ctx.lineWidth = 1.8;
            for (let i = 0; i < 9; i++) {
                ctx.beginPath();
                ctx.moveTo(0, i * 45 + 15);
                ctx.bezierCurveTo(w * 0.3, i * 45 + 35, w * 0.7, i * 45 - 20, w, i * 45 + 25);
                ctx.stroke();
            }

            // White limestone "Bathtub ring" mineral deposit along shore
            ctx.fillStyle = "#f8fafc";
            ctx.beginPath();
            ctx.moveTo(w * 0.1, h * 0.05);
            ctx.bezierCurveTo(w * 0.48, h * 0.15, w * 0.32, h * 0.85, w * 0.8, h * 0.95);
            ctx.lineTo(w * 0.9, h * 0.88);
            ctx.bezierCurveTo(w * 0.6, h * 0.55, w * 0.62, h * 0.25, w * 0.35, h * 0.02);
            ctx.closePath();
            ctx.fill();

            // Reservoir Water Body (Deep cobalt to turquoise shallows)
            const waterGrad = ctx.createLinearGradient(w * 0.2, 0, w * 0.7, h);
            waterGrad.addColorStop(0, "#082f49");
            waterGrad.addColorStop(0.4, "#0284c7");
            waterGrad.addColorStop(0.8, "#0ea5e9");
            waterGrad.addColorStop(1, "#06b6d4");
            ctx.fillStyle = waterGrad;
            ctx.beginPath();
            ctx.moveTo(w * 0.14, h * 0.08);
            ctx.bezierCurveTo(w * 0.45, h * 0.18, w * 0.36, h * 0.82, w * 0.78, h * 0.92);
            ctx.lineTo(w * 0.86, h * 0.86);
            ctx.bezierCurveTo(w * 0.58, h * 0.52, w * 0.58, h * 0.28, w * 0.33, h * 0.05);
            ctx.closePath();
            ctx.fill();

            // Water surface glitter ripples
            ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
            ctx.lineWidth = 1;
            for (let r = 0; r < 6; r++) {
                ctx.beginPath();
                ctx.moveTo(w * (0.3 + r * 0.08), h * (0.2 + r * 0.1));
                ctx.lineTo(w * (0.35 + r * 0.08), h * (0.2 + r * 0.1));
                ctx.stroke();
            }

        } else if (sample === "urban") {
            // Coastal Metropolis (High-density city fabric & ocean port)
            const seaGrad = ctx.createLinearGradient(w * 0.65, 0, w, h);
            seaGrad.addColorStop(0, "#082f49");
            seaGrad.addColorStop(0.6, "#0c4a6e");
            seaGrad.addColorStop(1, "#075985");
            ctx.fillStyle = seaGrad;
            ctx.fillRect(0, 0, w, h);

            // Coastal Landmass & Port Peninsula
            ctx.fillStyle = "#1e293b";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(w * 0.68, 0);
            ctx.bezierCurveTo(w * 0.62, h * 0.35, w * 0.74, h * 0.68, w * 0.55, h);
            ctx.lineTo(0, h);
            ctx.closePath();
            ctx.fill();

            // Breakwaters & Container Port Berths
            ctx.strokeStyle = "#94a3b8";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(w * 0.65, h * 0.25);
            ctx.lineTo(w * 0.82, h * 0.35);
            ctx.moveTo(w * 0.69, h * 0.55);
            ctx.lineTo(w * 0.85, h * 0.58);
            ctx.stroke();

            // Cargo ships & wake
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(w * 0.76, h * 0.33, 16, 5);
            ctx.fillRect(w * 0.8, h * 0.56, 20, 6);
            ctx.strokeStyle = "rgba(255,255,255,0.35)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(w * 0.76, h * 0.35);
            ctx.lineTo(w * 0.71, h * 0.34);
            ctx.stroke();

            // Urban street grid blocks with rooftop variety
            const colors = ["#334155", "#475569", "#64748b", "#1e293b", "#0f172a", "#cbd5e1"];
            for (let x = 15; x < w * 0.6; x += 18) {
                for (let y = 15; y < h - 15; y += 18) {
                    ctx.fillStyle = colors[(x * 7 + y * 13) % colors.length];
                    ctx.fillRect(x, y, 14, 14);
                }
            }

            // Main arterial highway (amber lighted corridor)
            ctx.strokeStyle = "#f59e0b";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(w * 0.1, 0);
            ctx.bezierCurveTo(w * 0.25, h * 0.45, w * 0.35, h * 0.6, w * 0.52, h);
            ctx.stroke();

            // Urban Green Park
            ctx.fillStyle = "#15803d";
            ctx.fillRect(w * 0.18, h * 0.32, 60, 45);

        } else if (sample === "disaster") {
            // Wildfire Burn Scar & Thermal Front
            const baseGrad = ctx.createLinearGradient(0, 0, w, h);
            baseGrad.addColorStop(0, "#166534");
            baseGrad.addColorStop(0.5, "#14532d");
            baseGrad.addColorStop(1, "#365314");
            ctx.fillStyle = baseGrad;
            ctx.fillRect(0, 0, w, h);

            // River Firebreak
            ctx.strokeStyle = "#0284c7";
            ctx.lineWidth = 12;
            ctx.beginPath();
            ctx.moveTo(0, h * 0.2);
            ctx.bezierCurveTo(w * 0.3, h * 0.35, w * 0.5, h * 0.15, w, h * 0.25);
            ctx.stroke();

            // Charred Carbon Burn Scar
            const burnGrad = ctx.createRadialGradient(w * 0.52, h * 0.58, 20, w * 0.52, h * 0.58, w * 0.4);
            burnGrad.addColorStop(0, "#09090b");
            burnGrad.addColorStop(0.65, "#27272a");
            burnGrad.addColorStop(0.9, "#451a03");
            burnGrad.addColorStop(1, "transparent");
            ctx.fillStyle = burnGrad;
            ctx.beginPath();
            ctx.ellipse(w * 0.52, h * 0.58, w * 0.34, h * 0.32, -0.2, 0, Math.PI * 2);
            ctx.fill();

            // Glowing Active Flame Front
            ctx.strokeStyle = "#ef4444";
            ctx.lineWidth = 4;
            ctx.shadowColor = "#f97316";
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.ellipse(w * 0.52, h * 0.58, w * 0.32, h * 0.3, -0.2, Math.PI * 0.7, Math.PI * 1.9);
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Smoke Haze Plumes drifting northeast
            const smokeGrad = ctx.createLinearGradient(w * 0.4, h * 0.6, w * 0.85, h * 0.2);
            smokeGrad.addColorStop(0, "rgba(249, 115, 22, 0.4)");
            smokeGrad.addColorStop(0.4, "rgba(148, 163, 184, 0.35)");
            smokeGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
            ctx.fillStyle = smokeGrad;
            ctx.beginPath();
            ctx.moveTo(w * 0.45, h * 0.6);
            ctx.bezierCurveTo(w * 0.6, h * 0.3, w * 0.8, h * 0.1, w, h * 0.05);
            ctx.lineTo(w, h * 0.4);
            ctx.closePath();
            ctx.fill();

        } else if (sample === "forest") {
            // Amazon Rainforest & Meandering River Basin
            const forGrad = ctx.createLinearGradient(0, 0, w, h);
            forGrad.addColorStop(0, "#064e3b");
            forGrad.addColorStop(0.5, "#047857");
            forGrad.addColorStop(1, "#065f46");
            ctx.fillStyle = forGrad;
            ctx.fillRect(0, 0, w, h);

            // Canopy texture variation
            for (let i = 0; i < 120; i++) {
                const cx = (i * 47) % w;
                const cy = (i * 73) % h;
                ctx.fillStyle = i % 2 === 0 ? "#022c22" : "#059669";
                ctx.beginPath();
                ctx.arc(cx, cy, 6 + (i % 8), 0, Math.PI * 2);
                ctx.fill();
            }

            // Wide Meandering River with sandbars
            ctx.strokeStyle = "#0e7490";
            ctx.lineWidth = 22;
            ctx.beginPath();
            ctx.moveTo(0, h * 0.45);
            ctx.bezierCurveTo(w * 0.25, h * 0.15, w * 0.55, h * 0.85, w, h * 0.5);
            ctx.stroke();

            // Sandbars inside river curves
            ctx.fillStyle = "#d97706";
            ctx.beginPath();
            ctx.ellipse(w * 0.35, h * 0.32, 18, 5, 0.4, 0, Math.PI * 2);
            ctx.ellipse(w * 0.65, h * 0.68, 22, 6, -0.3, 0, Math.PI * 2);
            ctx.fill();

            // Oxbow lagoon
            ctx.strokeStyle = "#0891b2";
            ctx.lineWidth = 9;
            ctx.beginPath();
            ctx.arc(w * 0.72, h * 0.32, 26, 0.4, Math.PI * 1.6);
            ctx.stroke();

        } else if (sample === "space") {
            // Space Operations: Orbital Ground Track Map & Polar Downlink Cones
            ctx.fillStyle = "#030712";
            ctx.fillRect(0, 0, w, h);

            // World Continent Outlines (Stylized Vector Map)
            ctx.fillStyle = "#0f172a";
            ctx.strokeStyle = "rgba(56, 229, 255, 0.25)";
            ctx.lineWidth = 1;

            // Americas
            ctx.beginPath();
            ctx.moveTo(w * 0.15, h * 0.15);
            ctx.lineTo(w * 0.35, h * 0.18);
            ctx.lineTo(w * 0.32, h * 0.45);
            ctx.lineTo(w * 0.22, h * 0.48);
            ctx.lineTo(w * 0.26, h * 0.85);
            ctx.lineTo(w * 0.2, h * 0.88);
            ctx.lineTo(w * 0.14, h * 0.48);
            ctx.closePath();
            ctx.fill(); ctx.stroke();

            // Eurasia & Africa
            ctx.beginPath();
            ctx.moveTo(w * 0.45, h * 0.12);
            ctx.lineTo(w * 0.88, h * 0.16);
            ctx.lineTo(w * 0.85, h * 0.48);
            ctx.lineTo(w * 0.65, h * 0.5);
            ctx.lineTo(w * 0.58, h * 0.88);
            ctx.lineTo(w * 0.48, h * 0.82);
            ctx.lineTo(w * 0.45, h * 0.48);
            ctx.closePath();
            ctx.fill(); ctx.stroke();

            // Coordinate Grid Lines
            ctx.strokeStyle = "rgba(56, 229, 255, 0.08)";
            ctx.lineWidth = 1;
            for (let x = 0; x < w; x += 50) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
            }
            for (let y = 0; y < h; y += 40) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
            }

            // Sine Wave Orbital Ground Tracks (Sentinel & Landsat passes)
            const orbits = [
                { color: "#38e5ff", offset: 0, satX: w * 0.42 },
                { color: "#a855f7", offset: Math.PI * 0.5, satX: w * 0.72 },
                { color: "#10b981", offset: Math.PI, satX: w * 0.22 }
            ];

            orbits.forEach(orb => {
                ctx.strokeStyle = orb.color;
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                for (let x = 0; x <= w; x += 4) {
                    const y = h * 0.5 + Math.sin((x / w) * Math.PI * 2 + orb.offset) * (h * 0.38);
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();

                // Active Satellite Node on Track
                const satY = h * 0.5 + Math.sin((orb.satX / w) * Math.PI * 2 + orb.offset) * (h * 0.38);

                // Downlink Footprint Cone
                ctx.fillStyle = `${orb.color}22`;
                ctx.strokeStyle = `${orb.color}88`;
                ctx.beginPath();
                ctx.ellipse(orb.satX, satY, 45, 25, 0, 0, Math.PI * 2);
                ctx.fill(); ctx.stroke();

                // Sat Icon
                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                ctx.arc(orb.satX, satY, 4, 0, Math.PI * 2);
                ctx.fill();
            });

            // Svalbard & Ground Station Polar Nodes
            const stations = [
                { x: w * 0.52, y: h * 0.14, name: "SvalSat (Polar Gateway)" },
                { x: w * 0.28, y: h * 0.38, name: "White Sands Gateway" },
                { x: w * 0.78, y: h * 0.72, name: "Perth Station" }
            ];

            stations.forEach(st => {
                ctx.fillStyle = "#facc15";
                ctx.beginPath();
                ctx.arc(st.x, st.y, 3.5, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = "rgba(250, 204, 21, 0.4)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(st.x, st.y, 14, 0, Math.PI * 2);
                ctx.stroke();

                ctx.fillStyle = "#ffffff";
                ctx.font = "8px JetBrains Mono, monospace";
                ctx.fillText(st.name, st.x + 8, st.y + 3);
            });

        } else {
            // Farmland (Central Pivot Crop Circles & Modular Parcels)
            ctx.fillStyle = "#78350f";
            ctx.fillRect(0, 0, w, h);

            // Rectangular crop plots with varying maturation
            const cropColors = ["#15803d", "#166534", "#65a30d", "#84cc16", "#a16207", "#ca8a04", "#451a03", "#14532d"];
            for (let gx = 0; gx < w; gx += 55) {
                for (let gy = 0; gy < h; gy += 45) {
                    ctx.fillStyle = cropColors[(gx * 3 + gy * 7) % cropColors.length];
                    ctx.fillRect(gx + 2, gy + 2, 51, 41);
                }
            }

            // Road & canal grid
            ctx.strokeStyle = "rgba(226, 232, 240, 0.4)";
            ctx.lineWidth = 2;
            for (let x = 0; x <= w; x += 110) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }
            for (let y = 0; y <= h; y += 90) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }

            // Center Pivot Crop Circles
            const pivots = [
                { x: w * 0.28, y: h * 0.35, r: 68, c1: "#4d7c0f", c2: "#84cc16" },
                { x: w * 0.72, y: h * 0.32, r: 76, c1: "#15803d", c2: "#a3e635" },
                { x: w * 0.36, y: h * 0.74, r: 72, c1: "#65a30d", c2: "#ca8a04" },
                { x: w * 0.82, y: h * 0.72, r: 62, c1: "#166534", c2: "#4ade80" }
            ];

            pivots.forEach(p => {
                ctx.fillStyle = p.c1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = p.c2;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.arc(p.x, p.y, p.r, -0.4, Math.PI * 0.65);
                ctx.closePath();
                ctx.fill();

                ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 0.4, 0, Math.PI * 2);
                ctx.arc(p.x, p.y, p.r * 0.75, 0, Math.PI * 2);
                ctx.stroke();

                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        ctx.restore();
    }

    function drawSegmentationMask(ctx, w, h, sample, opacity, filter) {
        if (opacity <= 0) return;
        ctx.save();
        ctx.globalAlpha = opacity;

        // Overlay colors for the 5 classes:
        // Agriculture: #eab308, Vegetation: #10b981, Water: #06b6d4, Urban: #a855f7, Disturbed: #ef4444
        if (sample === "water") {
            if (!filter || filter === "water") {
                ctx.fillStyle = "rgba(6, 182, 212, 0.65)";
                ctx.beginPath();
                ctx.moveTo(w * 0.14, h * 0.08);
                ctx.bezierCurveTo(w * 0.45, h * 0.18, w * 0.36, h * 0.82, w * 0.78, h * 0.92);
                ctx.lineTo(w * 0.86, h * 0.86);
                ctx.bezierCurveTo(w * 0.58, h * 0.52, w * 0.58, h * 0.28, w * 0.33, h * 0.05);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = "#38e5ff";
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            if (!filter || filter === "disturbed") {
                ctx.fillStyle = "rgba(239, 68, 68, 0.55)";
                ctx.fillRect(w * 0.05, h * 0.85, w * 0.25, h * 0.12);
            }
        } else if (sample === "urban") {
            if (!filter || filter === "urban") {
                ctx.fillStyle = "rgba(168, 85, 247, 0.65)";
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(w * 0.65, 0);
                ctx.bezierCurveTo(w * 0.6, h * 0.35, w * 0.72, h * 0.68, w * 0.55, h);
                ctx.lineTo(0, h);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = "#c084fc";
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            if (!filter || filter === "water") {
                ctx.fillStyle = "rgba(6, 182, 212, 0.65)";
                ctx.fillRect(w * 0.72, 0, w * 0.28, h);
            }
        } else if (sample === "disaster") {
            if (!filter || filter === "disturbed") {
                ctx.fillStyle = "rgba(239, 68, 68, 0.75)";
                ctx.beginPath();
                ctx.ellipse(w * 0.52, h * 0.58, w * 0.32, h * 0.3, -0.2, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#ef4444";
                ctx.lineWidth = 2.5;
                ctx.stroke();
            }
            if (!filter || filter === "vegetation") {
                ctx.fillStyle = "rgba(16, 185, 129, 0.45)";
                ctx.fillRect(0, 0, w * 0.22, h);
                ctx.fillRect(w * 0.8, 0, w * 0.2, h);
            }
        } else if (sample === "forest") {
            if (!filter || filter === "vegetation") {
                ctx.fillStyle = "rgba(16, 185, 129, 0.68)";
                ctx.fillRect(0, 0, w, h);
            }
            if (!filter || filter === "water") {
                ctx.fillStyle = "rgba(6, 182, 212, 0.85)";
                ctx.beginPath();
                ctx.moveTo(0, h * 0.45);
                ctx.bezierCurveTo(w * 0.25, h * 0.15, w * 0.55, h * 0.85, w, h * 0.5);
                ctx.lineTo(w, h * 0.58);
                ctx.bezierCurveTo(w * 0.55, h * 0.93, w * 0.25, h * 0.23, 0, h * 0.53);
                ctx.closePath();
                ctx.fill();
            }
        } else {
            // Farmland
            if (!filter || filter === "agriculture") {
                ctx.fillStyle = "rgba(234, 179, 8, 0.65)";
                const pivots = [
                    { x: w * 0.28, y: h * 0.35, r: 68 },
                    { x: w * 0.72, y: h * 0.32, r: 76 },
                    { x: w * 0.36, y: h * 0.74, r: 72 },
                    { x: w * 0.82, y: h * 0.72, r: 62 }
                ];
                pivots.forEach(p => {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = "#facc15";
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                });
            }
            if (!filter || filter === "vegetation") {
                ctx.fillStyle = "rgba(16, 185, 129, 0.45)";
                ctx.fillRect(0, 0, w * 0.15, h);
            }
        }

        // High-Tech Satellite HUD Overlay
        ctx.globalAlpha = 0.85;
        ctx.strokeStyle = "rgba(56, 229, 255, 0.45)";
        ctx.lineWidth = 1;
        const bSize = 14;
        ctx.beginPath();
        ctx.moveTo(12, 12 + bSize); ctx.lineTo(12, 12); ctx.lineTo(12 + bSize, 12);
        ctx.moveTo(w - 12 - bSize, 12); ctx.lineTo(w - 12, 12); ctx.lineTo(w - 12, 12 + bSize);
        ctx.moveTo(12, h - 12 - bSize); ctx.lineTo(12, h - 12); ctx.lineTo(12 + bSize, h - 12);
        ctx.moveTo(w - 12 - bSize, h - 12); ctx.lineTo(w - 12, h - 12); ctx.lineTo(w - 12, h - 12 - bSize);
        ctx.stroke();

        ctx.fillStyle = "rgba(56, 229, 255, 0.85)";
        ctx.font = "9px JetBrains Mono, monospace";
        ctx.fillText("SENTINEL-2 L2A • BOA REFLECTANCE • GSD 10M", 20, 24);
        ctx.fillText("QML 4-QUBIT PARTITION MASK", w - 170, 24);

        ctx.restore();
    }

    function updateClassDistributions(sample) {
        let dist = { ag: 42.8, veg: 28.4, water: 12.6, urban: 11.2, dist: 5.0 };
        let ndvi = "0.74 (Lush)";
        let canopy = "91.4%";
        let shannon = "1.48 bits";
        let irrigation = "Optimal";

        if (sample === "water") {
            dist = { ag: 8.2, veg: 14.5, water: 58.6, urban: 6.4, dist: 12.3 };
            ndvi = "0.22 (Arid Fringe)";
            canopy = "18.2%";
            shannon = "0.85 bits";
            irrigation = "Severely Depleted";
        } else if (sample === "urban") {
            dist = { ag: 4.5, veg: 11.2, water: 18.5, urban: 61.4, dist: 4.4 };
            ndvi = "0.18 (Built-up Core)";
            canopy = "14.8%";
            shannon = "0.72 bits";
            irrigation = "Stormwater Runoff";
        } else if (sample === "disaster") {
            dist = { ag: 12.4, veg: 18.2, water: 6.8, urban: 4.2, dist: 58.4 };
            ndvi = "0.12 (Charred)";
            canopy = "22.5%";
            shannon = "0.45 bits";
            irrigation = "Moisture Deficit";
        } else if (sample === "forest") {
            dist = { ag: 6.2, veg: 74.8, water: 14.2, urban: 1.8, dist: 3.0 };
            ndvi = "0.89 (Dense Canopy)";
            canopy = "96.8%";
            shannon = "2.42 bits";
            irrigation = "Rain-Fed Natural";
        }

        // Update distribution bars in list
        const distContainer = $("classDistList");
        if (distContainer) {
            distContainer.innerHTML = `
                <div class="dist-item">
                    <div class="dist-header">
                        <span>🌾 Agriculture (Cropland)</span>
                        <strong>${dist.ag}%</strong>
                    </div>
                    <div class="dist-track"><div class="dist-fill" style="width: ${dist.ag}%; background: #eab308;"></div></div>
                </div>
                <div class="dist-item">
                    <div class="dist-header">
                        <span>🌳 Vegetation (Canopy)</span>
                        <strong>${dist.veg}%</strong>
                    </div>
                    <div class="dist-track"><div class="dist-fill" style="width: ${dist.veg}%; background: #10b981;"></div></div>
                </div>
                <div class="dist-item">
                    <div class="dist-header">
                        <span>💧 Water (Reservoir/Inflow)</span>
                        <strong>${dist.water}%</strong>
                    </div>
                    <div class="dist-track"><div class="dist-fill" style="width: ${dist.water}%; background: #06b6d4;"></div></div>
                </div>
                <div class="dist-item">
                    <div class="dist-header">
                        <span>🏙️ Urban (Built-up)</span>
                        <strong>${dist.urban}%</strong>
                    </div>
                    <div class="dist-track"><div class="dist-fill" style="width: ${dist.urban}%; background: #a855f7;"></div></div>
                </div>
                <div class="dist-item">
                    <div class="dist-header">
                        <span>🔥 Disturbed (Burn/Scar)</span>
                        <strong>${dist.dist}%</strong>
                    </div>
                    <div class="dist-track"><div class="dist-fill" style="width: ${dist.dist}%; background: #ef4444;"></div></div>
                </div>
            `;
        }

        // Bio-metrics
        if ($("ndviValue")) $("ndviValue").textContent = ndvi;
        if ($("canopyValue")) $("canopyValue").textContent = canopy;
        if ($("shannonValue")) $("shannonValue").textContent = shannon;
        if ($("irrigationValue")) $("irrigationValue").textContent = irrigation;

        // 5 Class Cards
        if ($("cov-ag")) $("cov-ag").textContent = `${dist.ag}%`;
        if ($("cov-veg")) $("cov-veg").textContent = `${dist.veg}%`;
        if ($("cov-water")) $("cov-water").textContent = `${dist.water}%`;
        if ($("cov-urban")) $("cov-urban").textContent = `${dist.urban}%`;
        if ($("cov-dist")) $("cov-dist").textContent = `${dist.dist}%`;
    }

    // Mask Opacity Slider
    $("maskOpacitySlider")?.addEventListener("input", (e) => {
        state.maskOpacity = Number(e.target.value) / 100;
        if ($("opacityVal")) $("opacityVal").textContent = `${e.target.value}%`;
        renderLandcoverCanvas();
    });

    // Sample Preset Buttons
    document.querySelectorAll(".sample-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".sample-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            state.activeLandcoverSample = btn.dataset.sample;
            state.selectedClassFilter = null;
            document.querySelectorAll(".class-card").forEach(c => c.classList.remove("active"));
            renderLandcoverCanvas();
            showToast(`Loaded Land Cover Sample: ${btn.textContent.trim()}`);
        });
    });

    // Class Card click to highlight specific class
    document.querySelectorAll(".class-card").forEach(card => {
        card.addEventListener("click", () => {
            const cls = card.dataset.class;
            if (state.selectedClassFilter === cls) {
                state.selectedClassFilter = null;
                card.classList.remove("active");
            } else {
                state.selectedClassFilter = cls;
                document.querySelectorAll(".class-card").forEach(c => c.classList.remove("active"));
                card.classList.add("active");
            }
            renderLandcoverCanvas();
        });
    });

    // Custom image upload for landcover
    $("landcoverUpload")?.addEventListener("change", (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = $("landcoverCanvas");
                if (!canvas) return;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                drawSegmentationMask(ctx, canvas.width, canvas.height, "agriculture", state.maskOpacity, null);
                showToast("Custom satellite image uploaded & segmented");
                addTutorBotMessage("🖼️ **Custom Satellite Image Analyzed:** Extracted multi-spectral spatial layers from user upload. PQC inferred land cover partition.");
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    /* ==========================================================================
       7. TAB 4: CHANGE DETECTION (Split Wipe Slider + Difference Heatmap)
       ========================================================================== */

    function renderChangeViewer() {
        const baseCanvas = $("baselineCanvas");
        const currCanvas = $("currentCanvas");
        const diffCanvas = $("diffCanvas");
        if (!baseCanvas || !currCanvas) return;

        const w = baseCanvas.width;
        const h = baseCanvas.height;
        const bCtx = baseCanvas.getContext("2d");
        const cCtx = currCanvas.getContext("2d");
        const dCtx = diffCanvas?.getContext("2d");

        const scenario = state.activeChangeScenario;

        // Baseline (Historical pass)
        bCtx.clearRect(0, 0, w, h);
        drawChangeScene(bCtx, w, h, scenario, true);

        // Current (Recent pass)
        cCtx.clearRect(0, 0, w, h);
        drawChangeScene(cCtx, w, h, scenario, false);

        // Difference Heatmap
        if (dCtx) {
            dCtx.clearRect(0, 0, w, h);
            drawDifferenceHeatmap(dCtx, w, h, scenario);
        }

        // Update split wipe clip-path
        updateWipePosition(state.wipePercent);

        // Update quantum metrics
        updateChangeMetrics(scenario);
    }

    function drawChangeScene(ctx, w, h, scenario, isBaseline) {
        ctx.save();

        if (scenario === "lakemead") {
            // Terraced canyon topography
            const canyonGrad = ctx.createLinearGradient(0, 0, w, h);
            canyonGrad.addColorStop(0, "#9a3412");
            canyonGrad.addColorStop(0.4, "#78350f");
            canyonGrad.addColorStop(0.8, "#b45309");
            canyonGrad.addColorStop(1, "#451a03");
            ctx.fillStyle = canyonGrad;
            ctx.fillRect(0, 0, w, h);

            // Canyon Ridge contours
            ctx.strokeStyle = "rgba(69, 26, 3, 0.5)";
            ctx.lineWidth = 2;
            for (let i = 0; i < 7; i++) {
                ctx.beginPath();
                ctx.moveTo(0, i * 50 + 20);
                ctx.bezierCurveTo(w * 0.3, i * 50 + 40, w * 0.7, i * 50 - 25, w, i * 50 + 30);
                ctx.stroke();
            }

            if (isBaseline) {
                // 2015 Baseline: Full High Lake Level (Wide curving reservoir)
                const lakeGrad = ctx.createLinearGradient(w * 0.2, 0, w * 0.7, h);
                lakeGrad.addColorStop(0, "#082f49");
                lakeGrad.addColorStop(0.5, "#0284c7");
                lakeGrad.addColorStop(1, "#0369a1");
                ctx.fillStyle = lakeGrad;
                ctx.beginPath();
                ctx.moveTo(w * 0.08, h * 0.05);
                ctx.bezierCurveTo(w * 0.45, h * 0.1, w * 0.3, h * 0.88, w * 0.82, h * 0.95);
                ctx.lineTo(w * 0.92, h * 0.82);
                ctx.bezierCurveTo(w * 0.65, h * 0.5, w * 0.65, h * 0.2, w * 0.38, h * 0.02);
                ctx.closePath();
                ctx.fill();

                // Marina docks active
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(w * 0.35, h * 0.25, 24, 6);
                ctx.fillRect(w * 0.38, h * 0.28, 6, 20);
            } else {
                // 2026 Current: Shrunken reservoir with stark white calcium mineral bathtub ring
                ctx.fillStyle = "#f8fafc";
                ctx.beginPath();
                ctx.moveTo(w * 0.08, h * 0.05);
                ctx.bezierCurveTo(w * 0.45, h * 0.1, w * 0.3, h * 0.88, w * 0.82, h * 0.95);
                ctx.lineTo(w * 0.92, h * 0.82);
                ctx.bezierCurveTo(w * 0.65, h * 0.5, w * 0.65, h * 0.2, w * 0.38, h * 0.02);
                ctx.closePath();
                ctx.fill();

                // Dried cracked mud flats
                ctx.fillStyle = "#b45309";
                ctx.beginPath();
                ctx.moveTo(w * 0.12, h * 0.08);
                ctx.bezierCurveTo(w * 0.43, h * 0.12, w * 0.33, h * 0.82, w * 0.78, h * 0.9);
                ctx.lineTo(w * 0.86, h * 0.8);
                ctx.bezierCurveTo(w * 0.62, h * 0.48, w * 0.62, h * 0.22, w * 0.36, h * 0.04);
                ctx.closePath();
                ctx.fill();

                // Reduced Low Water Channel (40% remaining volume)
                const lowWaterGrad = ctx.createLinearGradient(w * 0.2, 0, w * 0.7, h);
                lowWaterGrad.addColorStop(0, "#0c4a6e");
                lowWaterGrad.addColorStop(1, "#0284c7");
                ctx.fillStyle = lowWaterGrad;
                ctx.beginPath();
                ctx.moveTo(w * 0.22, h * 0.12);
                ctx.bezierCurveTo(w * 0.42, h * 0.2, w * 0.38, h * 0.75, w * 0.72, h * 0.82);
                ctx.lineTo(w * 0.78, h * 0.74);
                ctx.bezierCurveTo(w * 0.56, h * 0.45, w * 0.56, h * 0.25, w * 0.36, h * 0.08);
                ctx.closePath();
                ctx.fill();
            }

        } else if (scenario === "amazon") {
            // Amazon Rainforest
            ctx.fillStyle = "#064e3b";
            ctx.fillRect(0, 0, w, h);

            // Winding river
            ctx.strokeStyle = "#0e7490";
            ctx.lineWidth = 14;
            ctx.beginPath();
            ctx.moveTo(0, h * 0.3);
            ctx.bezierCurveTo(w * 0.3, h * 0.1, w * 0.6, h * 0.8, w, h * 0.4);
            ctx.stroke();

            if (!isBaseline) {
                // 2026: Fishbone logging roads & cleared cattle pastures
                ctx.strokeStyle = "#d97706";
                ctx.lineWidth = 3.5;
                ctx.beginPath();
                ctx.moveTo(w * 0.1, h * 0.85);
                ctx.lineTo(w * 0.85, h * 0.15);
                ctx.stroke();

                // Lateral fishbone logging spurs
                for (let step = 0.2; step <= 0.8; step += 0.1) {
                    const px = w * (0.1 + step * 0.75);
                    const py = h * (0.85 - step * 0.7);
                    ctx.beginPath();
                    ctx.moveTo(px, py);
                    ctx.lineTo(px + 45, py + 35);
                    ctx.moveTo(px, py);
                    ctx.lineTo(px - 45, py - 35);
                    ctx.stroke();

                    // Cleared pasture blocks
                    ctx.fillStyle = "#78350f";
                    ctx.fillRect(px + 10, py + 8, 30, 22);
                    ctx.fillRect(px - 40, py - 28, 28, 20);
                }
            }

        } else if (scenario === "urban") {
            // Coastal Urban Sprawl
            ctx.fillStyle = isBaseline ? "#166534" : "#1e293b";
            ctx.fillRect(0, 0, w, h);

            if (isBaseline) {
                // 2016 Baseline: Rural agricultural plots & few highways
                ctx.strokeStyle = "#cbd5e1";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, h * 0.5);
                ctx.lineTo(w, h * 0.5);
                ctx.stroke();

                ctx.fillStyle = "#65a30d";
                for (let i = 0; i < 8; i++) {
                    ctx.fillRect(40 + i * 75, 30, 50, 45);
                    ctx.fillRect(40 + i * 75, h - 85, 50, 45);
                }
            } else {
                // 2026 Current: Dense expressway interchange and concrete sprawl
                ctx.strokeStyle = "#f59e0b";
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(0, h * 0.5);
                ctx.lineTo(w, h * 0.5);
                ctx.moveTo(w * 0.5, 0);
                ctx.lineTo(w * 0.5, h);
                ctx.stroke();

                // Cloverleaf loops
                ctx.beginPath();
                ctx.arc(w * 0.45, h * 0.42, 22, 0, Math.PI * 2);
                ctx.arc(w * 0.55, h * 0.58, 22, 0, Math.PI * 2);
                ctx.stroke();

                // High density buildings
                const bColors = ["#334155", "#475569", "#64748b", "#0f172a"];
                for (let bx = 20; bx < w - 20; bx += 22) {
                    for (let by = 20; by < h - 20; by += 22) {
                        ctx.fillStyle = bColors[(bx + by) % bColors.length];
                        ctx.fillRect(bx, by, 18, 18);
                    }
                }
            }

        } else {
            // Wildfire Burn Scar Emergence
            ctx.fillStyle = "#15803d";
            ctx.fillRect(0, 0, w, h);

            if (!isBaseline) {
                // Post-fire scorched landscape
                const burnGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, 10, w * 0.5, h * 0.5, 130);
                burnGrad.addColorStop(0, "#09090b");
                burnGrad.addColorStop(0.7, "#27272a");
                burnGrad.addColorStop(0.9, "#78350f");
                burnGrad.addColorStop(1, "transparent");
                ctx.fillStyle = burnGrad;
                ctx.beginPath();
                ctx.ellipse(w * 0.5, h * 0.5, 140, 110, 0.3, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.restore();
    }

    function drawDifferenceHeatmap(ctx, w, h, scenario) {
        ctx.save();
        ctx.fillStyle = "#020617";
        ctx.fillRect(0, 0, w, h);

        // Grid lines
        ctx.strokeStyle = "rgba(56, 229, 255, 0.1)";
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 40) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = 0; y < h; y += 40) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }

        // True spatial difference hotspots with glowing quantum divergence contours
        if (scenario === "lakemead") {
            // Exposed lakebed divergence zone
            const heatGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, 30, w * 0.5, h * 0.5, 160);
            heatGrad.addColorStop(0, "rgba(239, 68, 68, 0.95)");
            heatGrad.addColorStop(0.5, "rgba(245, 158, 11, 0.75)");
            heatGrad.addColorStop(0.85, "rgba(56, 229, 255, 0.35)");
            heatGrad.addColorStop(1, "transparent");
            ctx.fillStyle = heatGrad;
            ctx.beginPath();
            ctx.ellipse(w * 0.48, h * 0.5, 160, 110, -0.25, 0, Math.PI * 2);
            ctx.fill();
        } else if (scenario === "amazon") {
            // Fishbone logging divergence
            ctx.strokeStyle = "rgba(239, 68, 68, 0.9)";
            ctx.lineWidth = 16;
            ctx.beginPath();
            ctx.moveTo(w * 0.15, h * 0.85);
            ctx.lineTo(w * 0.85, h * 0.15);
            ctx.stroke();

            for (let step = 0.2; step <= 0.8; step += 0.12) {
                const px = w * (0.15 + step * 0.7);
                const py = h * (0.85 - step * 0.7);
                ctx.fillStyle = "rgba(245, 158, 11, 0.85)";
                ctx.fillRect(px - 25, py - 20, 50, 40);
            }
        } else {
            const radGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, 20, w * 0.5, h * 0.5, 140);
            radGrad.addColorStop(0, "rgba(239, 68, 68, 0.95)");
            radGrad.addColorStop(0.6, "rgba(245, 158, 11, 0.7)");
            radGrad.addColorStop(1, "transparent");
            ctx.fillStyle = radGrad;
            ctx.beginPath();
            ctx.arc(w * 0.5, h * 0.5, 130, 0, Math.PI * 2);
            ctx.fill();
        }

        // Tactical HUD Annotation Overlays
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px JetBrains Mono, monospace";
        ctx.fillText("QUANTUM FIDELITY F: 0.714 • DIVERGENCE D_Q: 28.6%", 16, 26);
        ctx.fillStyle = "rgba(56, 229, 255, 0.85)";
        ctx.font = "9px JetBrains Mono, monospace";
        ctx.fillText("SURFACE ALTERATION: 48.2 KM² • ANOMALY CLASSIFICATION: HIGH DIVERGENCE", 16, 42);

        ctx.restore();
    }

    function updateWipePosition(percent) {
        state.wipePercent = Math.max(0, Math.min(100, percent));
        const curr = $("currentCanvas");
        const handle = $("wipeHandle");

        if (curr) {
            curr.style.clipPath = `inset(0 0 0 ${state.wipePercent}%)`;
        }
        if (handle) {
            handle.style.left = `${state.wipePercent}%`;
        }
    }

    function updateChangeMetrics(scenario) {
        let fid = "0.714";
        let div = "28.6%";
        let area = "48.2 km²";
        let classification = "Water Body Contraction";

        if (scenario === "amazon") {
            fid = "0.642";
            div = "35.8%";
            area = "84.5 km²";
            classification = "Deforestation Frontier";
        } else if (scenario === "urban") {
            fid = "0.785";
            div = "21.5%";
            area = "32.1 km²";
            classification = "Impervious Urban Sprawl";
        } else if (scenario === "wildfire") {
            fid = "0.528";
            div = "47.2%";
            area = "112.4 km²";
            classification = "Wildfire Burn Scar";
        }

        if ($("quantumFidelityVal")) $("quantumFidelityVal").textContent = fid;
        if ($("changeDivergenceVal")) $("changeDivergenceVal").textContent = div;
        if ($("surfaceAlterationVal")) $("surfaceAlterationVal").textContent = area;
        if ($("changeClassificationVal")) $("changeClassificationVal").textContent = classification;
    }

    // Wipe dragging listeners (Mouse & Touch)
    const wipeWrapper = $("wipeWrapper");
    let isDraggingWipe = false;

    if (wipeWrapper) {
        const onDragMove = (e) => {
            if (!isDraggingWipe) return;
            const rect = wipeWrapper.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const pct = ((clientX - rect.left) / rect.width) * 100;
            updateWipePosition(pct);
        };

        wipeWrapper.addEventListener("mousedown", (e) => {
            isDraggingWipe = true;
            onDragMove(e);
        });

        window.addEventListener("mousemove", onDragMove);
        window.addEventListener("mouseup", () => { isDraggingWipe = false; });

        wipeWrapper.addEventListener("touchstart", (e) => {
            isDraggingWipe = true;
            onDragMove(e);
        }, { passive: true });

        window.addEventListener("touchmove", onDragMove, { passive: true });
        window.addEventListener("touchend", () => { isDraggingWipe = false; });
    }

    // Change Preset Dropdown
    $("changePresetSelect")?.addEventListener("change", (e) => {
        state.activeChangeScenario = e.target.value;
        const labels = {
            lakemead: ["Lake Mead (Historical 2015)", "Lake Mead (Current 2026)"],
            amazon: ["Amazon Forest (Baseline 2018)", "Amazon Deforestation (Current)"],
            urban: ["Coastal Basin (Baseline 2016)", "Urban Metropolis (Current 2026)"],
            wildfire: ["Pre-Fire Vegetative State", "Post-Fire Burn Scar Emergence"]
        };
        const pair = labels[e.target.value] || ["Baseline Observation", "Current Observation"];
        if ($("baselineName")) $("baselineName").textContent = pair[0];
        if ($("currentName")) $("currentName").textContent = pair[1];
        renderChangeViewer();
        showToast(`Change Scenario: ${e.target.options[e.target.selectedIndex].text}`);
    });

    // Wipe Mode Toggles: Split, Heatmap, Blink
    $("wipeSplitBtn")?.addEventListener("click", () => {
        clearInterval(state.blinkInterval);
        $("wipeSplitBtn").classList.add("active");
        $("wipeDiffBtn").classList.remove("active");
        $("wipeBlinkBtn").classList.remove("active");
        $("diffCanvas")?.classList.add("hidden");
        $("currentCanvas")?.classList.remove("hidden");
        updateWipePosition(50);
    });

    $("wipeDiffBtn")?.addEventListener("click", () => {
        clearInterval(state.blinkInterval);
        $("wipeDiffBtn").classList.add("active");
        $("wipeSplitBtn").classList.remove("active");
        $("wipeBlinkBtn").classList.remove("active");
        $("diffCanvas")?.classList.remove("hidden");
    });

    $("wipeBlinkBtn")?.addEventListener("click", () => {
        $("wipeBlinkBtn").classList.add("active");
        $("wipeSplitBtn").classList.remove("active");
        $("wipeDiffBtn").classList.remove("active");
        $("diffCanvas")?.classList.add("hidden");

        let blinkShow = false;
        clearInterval(state.blinkInterval);
        state.blinkInterval = setInterval(() => {
            blinkShow = !blinkShow;
            updateWipePosition(blinkShow ? 100 : 0);
        }, 500);
    });

    /* ==========================================================================
       8. TAB 5: ANOMALY MONITOR (Radar Heatmap + Year Slider Timeline)
       ========================================================================== */

    let radarSweepAngle = 0;
    let radarAnimActive = false;

    function renderAnomalyRadar() {
        const canvas = $("anomalyCanvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        // Dynamically match internal canvas resolution to true display pixels for retina clarity
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const targetW = Math.round(rect.width * dpr);
        const targetH = Math.round(rect.height * dpr);

        if (canvas.width !== targetW || canvas.height !== targetH) {
            canvas.width = targetW;
            canvas.height = targetH;
        }

        ctx.save();
        ctx.scale(dpr, dpr);

        const cssW = rect.width;
        const cssH = rect.height;
        const cx = cssW * 0.5;
        const cy = cssH * 0.5;
        const maxR = Math.min(cssH * 0.42, 65);

        radarSweepAngle += 0.022;

        ctx.clearRect(0, 0, cssW, cssH);

        // Tactical aerospace radar background
        const bgGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, maxR * 1.5);
        bgGrad.addColorStop(0, "#081d3d");
        bgGrad.addColorStop(0.55, "#030c1e");
        bgGrad.addColorStop(1, "#01040d");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, cssW, cssH);

        // Grid scanlines
        ctx.fillStyle = "rgba(56, 229, 255, 0.02)";
        for (let y = 0; y < cssH; y += 4) {
            ctx.fillRect(0, y, cssW, 1);
        }

        // Concentric range rings with exact 1:1 aspect ratio
        const ringFractions = [0.28, 0.52, 0.76, 1.0];
        const ringLabels = ["50 KM", "100 KM", "150 KM", "200 KM"];

        ringFractions.forEach((frac, idx) => {
            const r = maxR * frac;
            ctx.strokeStyle = idx === ringFractions.length - 1 ? "rgba(56, 229, 255, 0.35)" : "rgba(56, 229, 255, 0.16)";
            ctx.lineWidth = idx === ringFractions.length - 1 ? 1.5 : 1;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.stroke();

            // Range label
            ctx.fillStyle = "rgba(56, 229, 255, 0.55)";
            ctx.font = "8px 'JetBrains Mono', monospace";
            ctx.fillText(ringLabels[idx], cx + 4, cy - r + 8);
        });

        // Degree tick marks on outer ring
        for (let deg = 0; deg < 360; deg += 15) {
            const rad = deg * (Math.PI / 180);
            const isMajor = deg % 45 === 0;
            const r1 = maxR;
            const r2 = maxR + (isMajor ? 5 : 3);
            ctx.strokeStyle = isMajor ? "rgba(56, 229, 255, 0.55)" : "rgba(56, 229, 255, 0.22)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(rad) * r1, cy + Math.sin(rad) * r1);
            ctx.lineTo(cx + Math.cos(rad) * r2, cy + Math.sin(rad) * r2);
            ctx.stroke();
        }

        // Azimuth bearing lines
        ctx.strokeStyle = "rgba(56, 229, 255, 0.14)";
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(a) * (maxR + 4), cy + Math.sin(a) * (maxR + 4));
            ctx.stroke();
        }

        // Rotating Phosphor sweep beam sector with gradient trail
        ctx.save();
        const beamAngle = radarSweepAngle;
        const beamArc = 0.55;

        for (let i = 0; i < 20; i++) {
            const frac = i / 20;
            const a = beamAngle - (beamArc * frac);
            ctx.fillStyle = `rgba(56, 229, 255, ${(1 - frac) * 0.16})`;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, maxR, a, a + (beamArc / 20));
            ctx.closePath();
            ctx.fill();
        }

        // Leading edge of sweep beam
        ctx.strokeStyle = "rgba(56, 229, 255, 0.9)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(beamAngle) * maxR, cy + Math.sin(beamAngle) * maxR);
        ctx.stroke();
        ctx.restore();

        // Anomaly blips positioned relative to center with tactical HUD brackets
        const anomalies = [
            {
                bx: cx + maxR * 0.12,
                by: cy - maxR * 0.38,
                r: 10,
                color: "#ef4444",
                tag: "CRITICAL 91.2%",
                label: "Pantanal Wildfire Margin",
                coords: "-17.842°, -56.321°",
                offsetX: -195,
                offsetY: -22
            },
            {
                bx: cx + maxR * 0.58,
                by: cy + maxR * 0.15,
                r: 9,
                color: "#f59e0b",
                tag: "MEDIUM 84.6%",
                label: "Lake Mead Drawdown",
                coords: "36.015°, -114.737°",
                offsetX: 45,
                offsetY: -12
            },
            {
                bx: cx - maxR * 0.18,
                by: cy + maxR * 0.54,
                r: 8,
                color: "#38e5ff",
                tag: "ACTIVE 68.5%",
                label: "Amazon Canopy Loss",
                coords: "-3.465°, -62.215°",
                offsetX: 35,
                offsetY: 18
            }
        ];

        const now = performance.now();

        anomalies.forEach(a => {
            const pulse = 1 + Math.sin(now * 0.007 + a.r) * 0.25;

            // Target circle glow
            ctx.strokeStyle = a.color;
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.arc(a.bx, a.by, a.r * pulse, 0, Math.PI * 2);
            ctx.stroke();

            // Center target pip
            ctx.fillStyle = a.color;
            ctx.beginPath();
            ctx.arc(a.bx, a.by, 3.5, 0, Math.PI * 2);
            ctx.fill();

            // Tactical Corner Brackets
            const s = 7;
            ctx.strokeStyle = a.color;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(a.bx - s, a.by - s + 3); ctx.lineTo(a.bx - s, a.by - s); ctx.lineTo(a.bx - s + 3, a.by - s);
            ctx.moveTo(a.bx + s - 3, a.by - s); ctx.lineTo(a.bx + s, a.by - s); ctx.lineTo(a.bx + s, a.by - s + 3);
            ctx.moveTo(a.bx - s, a.by + s - 3); ctx.lineTo(a.bx - s, a.by + s); ctx.lineTo(a.bx - s + 3, a.by + s);
            ctx.moveTo(a.bx + s - 3, a.by + s); ctx.lineTo(a.bx + s, a.by + s); ctx.lineTo(a.bx + s, a.by + s - 3);
            ctx.stroke();

            // Callout text card
            const cardW = 150;
            const cardH = 28;
            const cardX = a.offsetX < 0 ? a.bx + a.offsetX : a.bx + a.offsetX;
            const cardY = a.by + a.offsetY;

            // Leader line to callout
            ctx.strokeStyle = "rgba(56, 229, 255, 0.4)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            if (a.offsetX < 0) {
                ctx.moveTo(a.bx - s, a.by);
                ctx.lineTo(cardX + cardW, cardY + cardH * 0.5);
            } else {
                ctx.moveTo(a.bx + s, a.by);
                ctx.lineTo(cardX, cardY + cardH * 0.5);
            }
            ctx.stroke();

            // Glassmorphic background
            ctx.fillStyle = "rgba(5, 12, 28, 0.9)";
            ctx.fillRect(cardX, cardY, cardW, cardH);

            // Glowing border & left accent
            ctx.strokeStyle = "rgba(56, 229, 255, 0.25)";
            ctx.strokeRect(cardX, cardY, cardW, cardH);
            ctx.fillStyle = a.color;
            ctx.fillRect(cardX, cardY, 3, cardH);

            // Title
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 9px 'JetBrains Mono', monospace";
            ctx.fillText(a.label, cardX + 7, cardY + 11);

            // Tag & Coordinates
            ctx.fillStyle = a.color;
            ctx.font = "8px 'JetBrains Mono', monospace";
            ctx.fillText(`[${a.tag}]`, cardX + 7, cardY + 22);

            ctx.fillStyle = "rgba(226, 232, 240, 0.7)";
            ctx.fillText(a.coords, cardX + 78, cardY + 22);
        });

        // Compass Cardinal Points
        ctx.fillStyle = "rgba(56, 229, 255, 0.85)";
        ctx.font = "bold 9px 'JetBrains Mono', monospace";
        ctx.fillText("N 000°", cx - 16, cy - maxR - 8);
        ctx.fillText("S 180°", cx - 16, cy + maxR + 15);
        ctx.fillText("E 090°", cx + maxR + 8, cy + 3);
        ctx.fillText("W 270°", cx - maxR - 44, cy + 3);

        // Corner HUD telemetry chips
        ctx.fillStyle = "rgba(56, 229, 255, 0.6)";
        ctx.font = "8px 'JetBrains Mono', monospace";
        ctx.fillText("📡 RADAR: MULTI-SPECTRAL PQC SYNTHESIS", 10, 14);
        ctx.fillText("TARGET ACQ: 3 ACTIVE ANOMALIES", 10, cssH - 6);
        ctx.fillText("RANGE: 200 KM • X-BAND 12.4 GHz", cssW - 170, 14);
        ctx.fillText("SWEEP: 360° CONTINUOUS", cssW - 130, cssH - 6);

        ctx.restore();

        if (!radarAnimActive) {
            radarAnimActive = true;
            function radarLoop() {
                renderAnomalyRadar();
                requestAnimationFrame(radarLoop);
            }
            requestAnimationFrame(radarLoop);
        }
    }

    // Year slider
    $("yearSlider")?.addEventListener("input", (e) => {
        const year = Number(e.target.value);
        state.selectedYear = year;
        if ($("yearBadge")) $("yearBadge").textContent = year;
        if ($("selectedYear")) $("selectedYear").textContent = year;

        // Interpolate disturbance risk based on year
        const baseRisk = 16 + (year - 2015) * 2.8;
        if ($("anomalyRisk")) $("anomalyRisk").textContent = Math.round(baseRisk);
        if ($("patternProbability")) $("patternProbability").textContent = (baseRisk * 0.76).toFixed(1);
    });

    // Play Timeline
    $("playTimelineBtn")?.addEventListener("click", (e) => {
        state.timelinePlaying = !state.timelinePlaying;
        e.currentTarget.textContent = state.timelinePlaying ? "⏸ Pause Timeline" : "▶ Play Timeline";

        if (state.timelinePlaying) {
            state.timelineInterval = setInterval(() => {
                let yr = Number($("yearSlider").value);
                yr = yr >= 2026 ? 2015 : yr + 1;
                $("yearSlider").value = yr;
                $("yearSlider").dispatchEvent(new Event("input"));
            }, 800);
        } else {
            clearInterval(state.timelineInterval);
        }
    });

    // Run Screening Sweep button
    $("scanAnomaliesBtn")?.addEventListener("click", () => {
        showToast("Scanning radar sweep across multi-spectral observation bands...");
        renderAnomalyRadar();
        setTimeout(() => {
            showToast("Screening sweep complete: 3 Environmental Disturbance Footprints Verified");
            addTutorBotMessage("🚨 **Screening Sweep Complete:** 3 anomalies detected with highest confidence in the Pantanal margin (91.2% thermal risk). Emergency response vector dispatched.");
        }, 600);
    });

    /* ==========================================================================
       9. TAB 6: QUANTUM ANALYSIS (4-Qubit PQC Simulator + Bloch Sphere Wheels)
       ========================================================================== */

    function simulateQuantumState() {
        // 4 qubits -> 16 computational basis states (|0000⟩ to |1111⟩)
        const dim = 16;
        const angles = state.angles;

        // Fast statevector simulation with variational gate angles
        let probs = new Array(dim).fill(0);
        let sum = 0;

        for (let i = 0; i < dim; i++) {
            // Quantum amplitude computation from Ry/Rz gate rotations
            let amp = 1.0;
            for (let q = 0; q < 4; q++) {
                const bit = (i >> q) & 1;
                const theta = angles[q];
                const phi = angles[q + 4];
                const r = bit ? Math.sin(theta / 2) : Math.cos(theta / 2);
                amp *= (r * Math.cos(phi * 0.5));
            }
            const p = Math.abs(amp * amp) + 0.005;
            probs[i] = p;
            sum += p;
        }

        // Normalize
        probs = probs.map(p => p / sum);
        state.quantumProbabilities = probs;

        // Find dominant state
        let maxIdx = 0;
        let maxP = 0;
        probs.forEach((p, idx) => {
            if (p > maxP) {
                maxP = p;
                maxIdx = idx;
            }
        });

        const dominantBinary = maxIdx.toString(2).padStart(4, "0");
        state.quantumState = `|${dominantBinary}⟩`;

        // Shannon / von Neumann Entropy: S = -sum p_i log2(p_i)
        let ent = 0;
        probs.forEach(p => {
            if (p > 1e-9) ent -= p * Math.log2(p);
        });
        state.entropy = Number(ent.toFixed(2));
        state.quantumScore = Math.round(maxP * 100);

        renderQuantumView();
    }

    function renderQuantumView() {
        // Top Cards
        if ($("quantumState")) $("quantumState").textContent = state.quantumState;
        if ($("entropyValue")) $("entropyValue").textContent = state.entropy;
        if ($("patternProbabilityQuantum")) $("patternProbabilityQuantum").textContent = `${state.quantumScore}%`;
        if ($("quantumScore")) $("quantumScore").textContent = `${Math.min(99.4, (90 + state.quantumScore * 0.1)).toFixed(1)}%`;

        // Render 16 histogram bars
        const barsContainer = $("quantumBarsContainer");
        if (barsContainer) {
            barsContainer.innerHTML = "";
            state.quantumProbabilities.forEach((p, idx) => {
                const binStr = idx.toString(2).padStart(4, "0");
                const isDominant = `|${binStr}⟩` === state.quantumState;
                const pct = Math.round(p * 100);

                const bar = document.createElement("div");
                bar.className = `quantum-state-bar ${isDominant ? "dominant" : ""}`;
                bar.title = `Basis |${binStr}⟩: ${(p * 100).toFixed(2)}% probability`;

                bar.innerHTML = `
                    <div class="q-bar-track">
                        <div class="q-bar-fill ${isDominant ? "dominant" : ""}" style="height: ${Math.min(100, Math.max(8, Math.round(p * 240)))}%;">
                            <div class="q-bar-cap"></div>
                        </div>
                    </div>
                    <span class="q-bar-label">${binStr}</span>
                    <span class="q-bar-pct ${isDominant ? "dominant" : ""}">${pct}%</span>
                `;
                barsContainer.appendChild(bar);
            });
        }

        // Render 4 Bloch Sphere Wheels (Q₀ to Q₃)
        for (let q = 0; q < 4; q++) {
            renderBlochWheel(`wheelQ${q}`, q, state.angles[q]);
        }

        // Render 8 Interactive Variational Angle Sliders
        renderAngleSliders();
    }

    function renderBlochWheel(canvasId, qubitIdx, theta) {
        const canvas = $(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        // High-DPR rendering for razor-sharp circles and ticks
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const targetW = Math.round(rect.width * dpr);
        const targetH = Math.round(rect.height * dpr);

        if (canvas.width !== targetW || canvas.height !== targetH) {
            canvas.width = targetW;
            canvas.height = targetH;
        }

        ctx.save();
        ctx.scale(dpr, dpr);

        const cssW = rect.width;
        const cssH = rect.height;
        const cx = cssW * 0.5;
        const cy = cssH * 0.5;
        const r = cssW * 0.38;

        ctx.clearRect(0, 0, cssW, cssH);

        // Holographic Radial Background Glow
        const radGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
        radGrad.addColorStop(0, "rgba(56, 229, 255, 0.18)");
        radGrad.addColorStop(0.7, "rgba(168, 85, 247, 0.08)");
        radGrad.addColorStop(1, "transparent");
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();

        // Phase Angle Sector Arc
        ctx.fillStyle = "rgba(56, 229, 255, 0.22)";
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r * 0.88, -Math.PI * 0.5, -Math.PI * 0.5 + theta, false);
        ctx.closePath();
        ctx.fill();

        // Outer Unit Circle with Glow
        ctx.strokeStyle = "rgba(56, 229, 255, 0.45)";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        // Graduation Ticks every 30 degrees
        for (let deg = 0; deg < 360; deg += 30) {
            const rad = deg * (Math.PI / 180);
            const isCardinal = deg % 90 === 0;
            const r1 = r - (isCardinal ? 4 : 2);
            const r2 = r + 1;
            ctx.strokeStyle = isCardinal ? "rgba(56, 229, 255, 0.7)" : "rgba(255, 255, 255, 0.25)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(rad) * r1, cy + Math.sin(rad) * r1);
            ctx.lineTo(cx + Math.cos(rad) * r2, cy + Math.sin(rad) * r2);
            ctx.stroke();
        }

        // Crosshair Reticles
        ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(cx - r - 2, cy); ctx.lineTo(cx + r + 2, cy);
        ctx.moveTo(cx, cy - r - 2); ctx.lineTo(cx, cy + r + 2);
        ctx.stroke();

        // State Vector Pointer with Glowing Shadow
        const pointerX = cx + Math.sin(theta) * (r - 2);
        const pointerY = cy - Math.cos(theta) * (r - 2);

        ctx.strokeStyle = "#38e5ff";
        ctx.lineWidth = 2.2;
        ctx.shadowColor = "rgba(56, 229, 255, 0.9)";
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(pointerX, pointerY);
        ctx.stroke();

        // Tip Arrow Dot
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(pointerX, pointerY, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();

        // Value text
        const expZ = Math.cos(theta).toFixed(2);
        const valEl = $(`q${qubitIdx}-val`);
        if (valEl) {
            valEl.textContent = `⟨Z⟩ = ${expZ >= 0 ? "+" : ""}${expZ}`;
            valEl.style.color = expZ >= 0 ? "var(--cyan)" : "#c084fc";
        }
    }

    function renderAngleSliders() {
        const container = $("anglesSliderGrid");
        if (!container || container.children.length > 0) return; // Render once, update via events

        container.innerHTML = "";
        state.angles.forEach((angle, idx) => {
            const sliderItem = document.createElement("div");
            sliderItem.className = "angle-slider-item";
            const gateName = idx < 4 ? `Ry(q${idx})` : `Rz(q${idx - 4})`;
            sliderItem.innerHTML = `
                <div class="angle-header">
                    <span>θ${idx} • ${gateName}</span>
                    <strong id="angleVal-${idx}">${angle.toFixed(2)} rad</strong>
                </div>
                <input type="range" class="small-slider full-width" id="angleSlider-${idx}" min="0" max="314" value="${Math.round(angle * 100)}">
            `;
            container.appendChild(sliderItem);

            const input = sliderItem.querySelector("input");
            input?.addEventListener("input", (e) => {
                const val = Number(e.target.value) / 100;
                state.angles[idx] = val;
                const display = $(`angleVal-${idx}`);
                if (display) display.textContent = `${val.toFixed(2)} rad`;
                simulateQuantumState();
            });
        });
    }

    $("resetAnglesBtn")?.addEventListener("click", () => {
        state.angles = [0.38, 0.72, 1.15, 0.49, 1.84, 0.95, 1.42, 0.61];
        state.angles.forEach((angle, idx) => {
            const input = $(`angleSlider-${idx}`);
            if (input) input.value = Math.round(angle * 100);
            const display = $(`angleVal-${idx}`);
            if (display) display.textContent = `${angle.toFixed(2)} rad`;
        });
        simulateQuantumState();
        showToast("Reset 8 Variational Gate Angles to optimal defaults");
    });

    $("recomputeQuantumBtn")?.addEventListener("click", () => {
        simulateQuantumState();
        showToast("Recomputed 4-qubit statevector & Bloch expectation values");
    });

    /* ==========================================================================
       10. TAB 7: APPLICABILITY DEMONSTRATIONS STUDIO (VNQFF-09 Executive Suite)
       ========================================================================== */

    const APP_DOMAINS = {
        agriculture: {
            title: "🌾 Agriculture: Crop Health & Precision Yield",
            challenge: "Large-scale crop monitoring across multi-spectral bands requires processing gigabytes of raw satellite data daily with extreme spatial variability.",
            advantage: "4-Qubit PQC variational state mapping projects 8-D spatial embeddings into 16-D Hilbert space, detecting sub-visual chlorophyll stress 6 days earlier.",
            directive: "Dynamic irrigation schedules for Zone 4-B deployed. Nitrogen fertilizer application adjusted to reduce agricultural runoff by 14 kg/ha.",
            solution: "Hybrid Classical CNN + 4-Qubit PQC maps 8-D spatial embeddings into a 16-D Hilbert state space, detecting sub-visual chlorophyll degradation 6 days before classical multi-spectral indices.",
            speedup: "9.2x Faster",
            speedupPct: "88%",
            speedupNote: "Classical Dense Matrix: 46ms → 4-Qubit PQC: 5.0ms",
            hud: ["PARCEL COVERAGE: 8,420 ha", "RESOLUTION: 10m Multi-spectral"],
            sliderLabel: "NDVI Health Threshold:",
            sliderVal: "0.65",
            metrics: [
                { label: "CHLOROPHYLL INDEX", val: "0.82 (High)", sub: "Optimal Photosynthesis" },
                { label: "SOIL MOISTURE", val: "38.4%", sub: "Volumetric Content" },
                { label: "NITROGEN DEMAND", val: "-14 kg/ha", sub: "Reduced Runoff" },
                { label: "ESTIMATED YIELD", val: "7.8 t/ha", sub: "+9.4% Projection" }
            ]
        },
        water: {
            title: "💧 Water Management: Reservoir Reserves & Desiccation",
            challenge: "Tracking freshwater depletion across transboundary basins demands continuous observation through cloud obscuration and fluctuating water margins.",
            advantage: "Variational Ry-CNOT ansatz isolates low-reflectance water body contours with sub-pixel shoreline delineation, distinguishing shallow water from sediment plumes.",
            directive: "Lake Mead southern intake quota modified. Agricultural transfer volume stabilized based on seasonal desiccation projection.",
            solution: "Variational Ry-CNOT ansatz isolates low-reflectance water body contours with sub-pixel shoreline delineation, distinguishing shallow water from sediment runoffs.",
            speedup: "8.4x Faster",
            speedupPct: "84%",
            speedupNote: "Classical Contour Search: 62ms → 4-Qubit PQC: 7.4ms",
            hud: ["SURFACE AREA: 412 km²", "STORAGE CAP: 34.2%"],
            sliderLabel: "NDWI Water Threshold:",
            sliderVal: "0.45",
            metrics: [
                { label: "WATER DEPTH INDEX", val: "18.4 m", sub: "Mean Active Pool" },
                { label: "DESICCATION RATE", val: "-2.1 cm/mo", sub: "Stabilizing Trend" },
                { label: "SEDIMENT PLUME", val: "Low (12 NTU)", sub: "Clear Runoff" },
                { label: "WATERSHED INFLOW", val: "4.8 km³/yr", sub: "Colorado River" }
            ]
        },
        urban: {
            title: "🏙️ Urban Planning: Built-up Density & Heat Islands",
            challenge: "Rapid urbanization requires automated parcel classification to monitor infrastructure sprawl, urban heat island intensity, and permeable ground ratios.",
            advantage: "Classical CNN extracts street layout grids while the quantum variational kernel computes rooftop solar potential and impervious surface thermal emissivity.",
            directive: "Urban green canopy corridor designated along Eastern commercial highway. High-albedo rooftop mandate verified for Sector 7.",
            solution: "Classical CNN extracts street layout grids while the quantum variational kernel computes rooftop solar potential and impervious surface thermal emissivity.",
            speedup: "7.9x Faster",
            speedupPct: "79%",
            speedupNote: "Classical Spatial Density: 58ms → 4-Qubit PQC: 7.3ms",
            hud: ["BUILT-UP DENSITY: 78.4%", "CANOPY COVER: 14.2%"],
            sliderLabel: "NDBI Impervious Threshold:",
            sliderVal: "0.70",
            metrics: [
                { label: "HEAT ISLAND DELTA", val: "+3.4°C", sub: "Summer Daytime Peak" },
                { label: "IMPERVIOUS RATIO", val: "82.6%", sub: "High Runoff Risk" },
                { label: "GREENWAYS ACCESS", val: "410 m", sub: "Urban Density Zone" },
                { label: "POPULATION DENSITY", val: "6,240 /km²", sub: "High-Rise Sector" }
            ]
        },
        disaster: {
            title: "🚨 Disaster Screening: Wildfires & Flood Mitigation",
            challenge: "During active wildfire eruptions and flash flooding, rapid telemetry is vital to dispatch emergency response assets before containment lines fail.",
            advantage: "Quantum feature maps detect non-linear correlations between thermal infrared emissions and canopy dryness, penetrating dense smoke plumes in real time.",
            directive: "Evacuation corridor 3 cleared. Emergency fire retardant airdrop dispatched to Pantanal front 14-B.",
            solution: "Quantum feature maps detect non-linear correlations between thermal infrared emissions and canopy dryness, isolating active fire fronts through heavy smoke plumes.",
            speedup: "11.4x Faster",
            speedupPct: "94%",
            speedupNote: "Classical Thermal Search: 72ms → 4-Qubit PQC: 6.3ms",
            hud: ["HOTSPOTS ACTIVE: 14", "BURN PERIMETER: 86 km"],
            sliderLabel: "Thermal Anomaly Sensitivity:",
            sliderVal: "0.85",
            metrics: [
                { label: "MAX TEMPERATURE", val: "680°C", sub: "Active Flame Front" },
                { label: "WIND SPEED VECTOR", val: "28 km/h NW", sub: "Rapid Spread Risk" },
                { label: "SMOKE PLUME OPACITY", val: "94.2%", sub: "Optical Occlusion" },
                { label: "CONTAINMENT RATIO", val: "18%", sub: "High Urgency Priority" }
            ]
        },
        space: {
            title: "🛰️ Space Operations: Constellation Orbit & Downlinks",
            challenge: "Earth observation constellations downlink petabytes of multi-spectral data to distributed polar and equatorial ground stations under tight orbital passes.",
            advantage: "Variational quantum kernel calculates dynamic orbit coverage overlap, maximizing multi-satellite imaging revisit intervals while avoiding cloud cover windows.",
            directive: "Svalbard Ground Station polar downlink synchronized for Sentinel-2 Pass #14809. Orbital antenna slew confirmed.",
            solution: "Variational quantum kernel calculates dynamic orbit coverage overlap, maximizing multi-satellite imaging revisit intervals while avoiding cloud cover windows.",
            speedup: "12.8x Faster",
            speedupPct: "96%",
            speedupNote: "Classical Constellation Graph: 88ms → 4-Qubit PQC: 6.9ms",
            hud: ["ORBIT ALTITUDE: 786 km", "INCLINATION: 98.6° SSO"],
            sliderLabel: "Downlink Elevation Mask:",
            sliderVal: "10.0°",
            metrics: [
                { label: "DOWNLINK DATA RATE", val: "560 Mbps", sub: "X-band Direct" },
                { label: "GROUND TRACK PASS", val: "14 min 20 sec", sub: "Optimal Elevation" },
                { label: "CLOUD OCCLUSION", val: "8.4%", sub: "Clear Optical Path" },
                { label: "CONSTELLATION NODES", val: "12 Satellites", sub: "PlanetScope / Sentinel" }
            ]
        }
    };

    function selectAppDomain(domainKey) {
        state.activeAppDomain = domainKey;

        // Toggle domain switcher buttons
        document.querySelectorAll(".app-tab-btn").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.app === domainKey);
        });

        renderApplicabilityDemo();
    }

    function renderApplicabilityDemo() {
        const d = APP_DOMAINS[state.activeAppDomain] || APP_DOMAINS.agriculture;

        if ($("appDemoTitle")) $("appDemoTitle").textContent = d.title;
        if ($("appChallengeText")) $("appChallengeText").textContent = d.challenge;
        if ($("appQuantumAdvText")) $("appQuantumAdvText").textContent = d.advantage;
        if ($("appDirectiveText")) $("appDirectiveText").textContent = d.directive;
        if ($("appQuantumSolutionText")) {
            $("appQuantumSolutionText").innerHTML = `<p>${d.solution}</p>`;
        }
        if ($("appSpeedupValue")) $("appSpeedupValue").textContent = d.speedup;
        if ($("appSpeedupBar")) $("appSpeedupBar").style.width = d.speedupPct;
        if ($("appSpeedupNote")) $("appSpeedupNote").textContent = d.speedupNote;
        if ($("appActionDirectiveText")) $("appActionDirectiveText").textContent = d.directive;
        if ($("appHudMetric1")) $("appHudMetric1").textContent = d.hud[0];
        if ($("appHudMetric2")) $("appHudMetric2").textContent = d.hud[1];
        if ($("appSliderLabel")) $("appSliderLabel").textContent = d.sliderLabel;

        // Telemetry list
        const metricsContainer = $("appDomainMetricsList");
        if (metricsContainer) {
            metricsContainer.innerHTML = "";
            d.metrics.forEach(m => {
                const item = document.createElement("div");
                item.className = "domain-metric-item";
                item.innerHTML = `
                    <span>${m.label}</span>
                    <strong>${m.val}</strong>
                    <small>${m.sub}</small>
                `;
                metricsContainer.appendChild(item);
            });
        }

        renderApplicabilityCanvas();
    }

    function renderApplicabilityCanvas() {
        const canvas = $("applicabilityCanvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const w = canvas.width;
        const h = canvas.height;
        const domain = state.activeAppDomain;
        const layer = state.activeSpectralLayer;

        ctx.clearRect(0, 0, w, h);

        if (layer === "nir") {
            // False-color Near Infrared: Healthy vegetation shines bright red/magenta
            ctx.fillStyle = "#831843";
            ctx.fillRect(0, 0, w, h);

            ctx.fillStyle = "#be185d";
            ctx.beginPath();
            ctx.arc(w * 0.4, h * 0.45, 90, 0, Math.PI * 2);
            ctx.fill();

            // Water reflects low NIR -> dark cyan/black
            ctx.fillStyle = "#0f172a";
            ctx.fillRect(w * 0.6, 0, w * 0.4, h);
        } else if (layer === "index") {
            // Vegetative / Spectral Index (NDVI) heatmap
            const grad = ctx.createLinearGradient(0, 0, w, h);
            grad.addColorStop(0, "#ca8a04");
            grad.addColorStop(0.5, "#84cc16");
            grad.addColorStop(1, "#15803d");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
        } else if (layer === "quantum") {
            // Quantum PQC Probability Mask overlay
            ctx.fillStyle = "#090d16";
            ctx.fillRect(0, 0, w, h);

            // Glowing quantum kernel probability contours
            ctx.strokeStyle = "rgba(56, 229, 255, 0.7)";
            ctx.lineWidth = 2;
            for (let r = 30; r < w * 0.5; r += 35) {
                ctx.beginPath();
                ctx.arc(w * 0.5, h * 0.5, r, 0, Math.PI * 2);
                ctx.stroke();
            }

            ctx.fillStyle = "rgba(168, 85, 247, 0.35)";
            ctx.beginPath();
            ctx.ellipse(w * 0.48, h * 0.52, 140, 95, 0.3, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Default: RGB True Color
            drawSyntheticSatelliteImage(ctx, w, h, domain);
        }
    }

    // Domain switcher tab buttons
    document.querySelectorAll(".app-tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            selectAppDomain(btn.dataset.app);
        });
    });

    // Spectral Layer Buttons
    document.querySelectorAll(".layer-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".layer-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            state.activeSpectralLayer = btn.dataset.layer;
            renderApplicabilityCanvas();
        });
    });

    // Domain slider
    $("appDomainSlider")?.addEventListener("input", (e) => {
        const val = (Number(e.target.value) / 100).toFixed(2);
        state.domainThreshold = Number(val);
        if ($("appSliderVal")) $("appSliderVal").textContent = val;
    });

    // Re-run Quantum Inference button
    $("runDomainInferenceBtn")?.addEventListener("click", () => {
        showToast("Re-running 4-qubit PQC kernel inference for active domain...");
        setTimeout(() => {
            showToast("Quantum Inference Complete: Model optimized with 9.2x speedup");
            renderApplicabilityDemo();
        }, 400);
    });

    // Dispatch Directive CTA
    $("dispatchDirectiveBtn")?.addEventListener("click", () => {
        showToast("🚀 Operational Directive Dispatched to Field Operations & Constellation Nodes");
        if ($("appStatusBadge")) {
            $("appStatusBadge").textContent = "DISPATCHED";
            $("appStatusBadge").style.color = "var(--green)";
        }
    });

    /* ==========================================================================
       11. TERRA TUTOR AI COPILOT (Bottom Right Floating Assistant)
       ========================================================================== */

    const TUTOR_ANSWERS = {
        explain_vnqff: `🛰️ **VNQFF-09 Mission Architecture:**
High-volume multi-spectral Earth observation satellite imagery makes large-scale monitoring computationally demanding. 
VNQFF-09 deploys a **hybrid quantum-classical pipeline**:
1. **Classical CNN Vision Layers** (MobileNet/Conv) extract complex spatial visual features.
2. Features are compressed into an **8-D Latent Vector** $z \\in \\mathbb{R}^8$.
3. A **4-Qubit PQC (Parameterized Quantum Circuit)** performs classification and change detection with Ry-CNOT-Rz variational entanglement.
4. **Impact:** Faster, quadratic extraction of actionable intelligence across all 5 applicability domains!`,

        domains: `🌾 **All 5 VNQFF-09 Applicability Domains:**
1. **Agriculture:** Real-time NDVI chlorophyll classification, pivot irrigation efficiency, and nitrogen yield forecasting.
2. **Water Management:** Reservoir volume depletion (Lake Mead / Aral Sea), desiccation tracking, and flood runoff.
3. **Urban Planning:** Built-up density index (NDBI), urban heat island (+3.4°C) mitigation, and impervious surface mapping.
4. **Disaster Screening:** Wildfire thermal anomaly detection, burn scar perimeter mapping, and monsoon inundation risk.
5. **Space Programmes:** Orbital constellation pass optimization, polar downlink scheduling, and cloud occlusion filtering.`,

        pqc_ansatz: `⚛️ **4-Qubit PQC Ansatz (Ry-CNOT-Rz):**
- **Qubits:** 4 physical/simulated qubits representing a 16-dimensional Hilbert space ($2^4 = 16$).
- **Ansatz:** $Ry(z_0..z_3)$ parameter gates encode the first 4 features, followed by a **CNOT entanglement ladder** ($0\\to 1, 1\\to 2, 2\\to 3$) to generate multi-qubit superposition, followed by $Rz(z_4..z_7)$ rotation gates.
- **Speedup:** Reduces classical dense matrix operations from 46ms down to 5.0ms (approx. 9.2x speedup).`,

        change_detection: `🔄 **Hybrid Change Detection & Quantum Fidelity:**
TerraVision compares baseline and current satellite observation passes using quantum state fidelity:
$$F = |\\langle \\psi_{\\text{base}} | \\psi_{\\text{curr}} \\rangle|^2$$
- **Divergence:** $D_Q = 1 - F$. When $D_Q$ spikes, it indicates surface disruption (such as water body contraction at Lake Mead or deforestation in the Amazon).
- Use the **interactive Split Wipe Slider** on the Change Detection tab to visually inspect historical differences!`,

        tour: `🧭 **TerraVision Quick Tour:**
- **🌍 Earth Explorer:** Spin the realistic 3D globe, pick any coordinate or preset, and view telemetry across all 5 domains.
- **⚛️ Hybrid Pipeline:** Watch the 5-step CNN-to-PQC dataflow and randomize the 8-D vector.
- **🌱 Land Cover:** Inspect segmentation masks for crop circles, water bodies, and forests.
- **🔄 Change Detection:** Slide the wipe handle between baseline and current satellite passes.
- **🚨 Anomaly Monitor:** Screen environmental disturbance footprints across the 2015–2026 timeline.
- **🔬 Quantum Analysis:** Drag variational gate sliders $\\theta_0..\\theta_7$ and watch Bloch spheres rotate in real-time!`
    };

    function initTerraTutor() {
        const launcher = $("terraTutorLauncher");
        const panel = $("terraTutorPanel");
        const closeBtn = $("tutorCloseBtn");
        const minBtn = $("tutorMinimizeBtn");
        const form = $("tutorForm");
        const input = $("tutorInput");

        // Welcome callout: highlight on initial load for 7.5 seconds
        if (launcher) {
            launcher.classList.add("welcome-show");
            setTimeout(() => {
                launcher.classList.remove("welcome-show");
            }, 7500);
        }

        launcher?.addEventListener("click", () => {
            state.tutorOpen = !state.tutorOpen;
            panel?.classList.toggle("hidden", !state.tutorOpen);
            if (state.tutorOpen) {
                updateTutorContext();
                input?.focus();
            }
        });

        closeBtn?.addEventListener("click", () => {
            state.tutorOpen = false;
            panel?.classList.add("hidden");
        });

        minBtn?.addEventListener("click", () => {
            state.tutorOpen = false;
            panel?.classList.add("hidden");
        });

        // Quick suggestion chips
        document.querySelectorAll(".tutor-chip").forEach(chip => {
            chip.addEventListener("click", () => {
                const q = chip.dataset.query;
                handleTutorQuery(q, chip.textContent.trim());
            });
        });

        // Form submission
        form?.addEventListener("submit", (e) => {
            e.preventDefault();
            const text = input?.value.trim();
            if (!text) return;
            input.value = "";
            addUserMessage(text);
            processCustomUserQuery(text);
        });
    }

    function updateTutorContext() {
        const ctxEl = $("tutorContextDetail");
        if (ctxEl) {
            const vTitle = titles[state.view] ? titles[state.view][0] : "Earth Explorer";
            ctxEl.textContent = `${vTitle} • Target: ${state.locationName}`;
        }
    }

    function addUserMessage(text) {
        const msgContainer = $("tutorMessages");
        if (!msgContainer) return;

        const div = document.createElement("div");
        div.className = "tutor-msg user";
        div.innerHTML = `<div class="tutor-bubble">${escapeHtml(text)}</div>`;
        msgContainer.appendChild(div);
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }

    function addTutorBotMessage(html) {
        const msgContainer = $("tutorMessages");
        if (!msgContainer) return;

        const div = document.createElement("div");
        div.className = "tutor-msg bot";
        div.innerHTML = `<div class="tutor-bubble">${formatMarkdown(html)}</div>`;
        msgContainer.appendChild(div);
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }

    function handleTutorQuery(queryKey, userTitle) {
        addUserMessage(userTitle);
        const reply = TUTOR_ANSWERS[queryKey] || TUTOR_ANSWERS.explain_vnqff;
        setTimeout(() => {
            addTutorBotMessage(reply);
        }, 300);
    }

    function processCustomUserQuery(query) {
        const q = query.toLowerCase();
        let reply = "";

        if (q.includes("vnqff") || q.includes("mission") || q.includes("architecture")) {
            reply = TUTOR_ANSWERS.explain_vnqff;
        } else if (q.includes("domain") || q.includes("agriculture") || q.includes("water") || q.includes("urban") || q.includes("disaster") || q.includes("space")) {
            reply = `🌾 **Selected Domains at ${state.locationName}:**\n- **Agriculture:** NDVI health, chlorophyll status\n- **Water:** Reservoir capacity, runoff index\n- **Urban:** Built-up density index (NDBI)\n- **Disaster:** Active thermal anomaly risk: ${$("riskValue") ? $("riskValue").textContent : "24"}%\n- **Space:** Downlink fidelity with Sentinel-2 MSI`;
        } else if (q.includes("quantum") || q.includes("qubit") || q.includes("pqc") || q.includes("circuit")) {
            reply = TUTOR_ANSWERS.pqc_ansatz;
        } else if (q.includes("fidelity") || q.includes("change") || q.includes("difference")) {
            reply = TUTOR_ANSWERS.change_detection;
        } else if (q.includes("lake mead") || q.includes("reservoir")) {
            reply = `💧 **Lake Mead Observation:** Monitored via Landsat-9 and Sentinel-2. Historical water depletion is tracking at -2.1 cm/month, with current storage at 34.2%. Quantum fidelity diverged to 0.714.`;
        } else if (q.includes("california") || q.includes("crop") || q.includes("farmland")) {
            reply = `🌾 **California Central Valley Telemetry:** Characterized by intensive pivot irrigation crops. 4-qubit PQC classification score: 94.8% with NDVI = 0.78 (Lush canopy).`;
        } else if (q.includes("speedup") || q.includes("performance") || q.includes("faster")) {
            reply = `⚡ **Quantum Computational Advantage:** Classical dense matrix spatial decomposition takes ~46ms, whereas the 4-qubit PQC variational kernel completes in 5.0ms (approx. **9.2x speedup**).`;
        } else {
            reply = `🌍 **Terra Tutor Insight on "${escapeHtml(query)}":**\nFor our target **${state.locationName}** (${state.biome}), multi-spectral satellite sensors are actively feeding into the hybrid CNN + 4-qubit PQC engine. You can switch to any tab to inspect real-time changes!`;
        }

        setTimeout(() => {
            addTutorBotMessage(reply);
        }, 350);
    }

    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function formatMarkdown(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>")
            .replace(/\n/g, "<br>");
    }

    /* ==========================================================================
       12. REPORT EXPORT & INITIALIZATION
       ========================================================================== */

    $("reportBtn")?.addEventListener("click", () => {
        const report = {
            platform: "TerraVision VNQFF-09",
            title: "Quantum-Enhanced Earth Observation Analysis Report",
            timestamp: new Date().toISOString(),
            targetLocation: {
                name: state.locationName,
                subRegion: state.subRegion,
                latitude: state.lat,
                longitude: state.lng,
                biome: state.biome,
                primaryDomain: state.domain
            },
            telemetry: {
                dataSource: state.dataSource,
                confidence: state.confidence,
                disturbanceRisk: $("riskValue") ? $("riskValue").textContent : 24
            },
            quantumArchitecture: {
                qubits: 4,
                hilbertDimension: 16,
                dominantState: state.quantumState,
                vonNeumannEntropy: state.entropy,
                latentEmbeddingVector: state.latentVector,
                variationalGateAngles: state.angles
            },
            allApplicabilityDomains: PRESETS[state.locationName.toLowerCase()]?.metrics || "Multi-spectral QML verified across Agriculture, Water, Urban, Disaster, and Space."
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `TerraVision-VNQFF09-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        showToast("Intelligence Report Exported Successfully");
    });

    $("newAnalysisBtn")?.addEventListener("click", () => {
        switchView("explorer");
        applyPreset("california");
        showToast("Started New Quantum Analysis Mission");
    });

    // Initialize application components
    initCosmicStarfield();
    init3DEarth();
    initTerraTutor();
    applyPreset("california");
    renderVectorBars();
    simulateQuantumState();
    renderLandcoverCanvas();
    renderChangeViewer();
    renderAnomalyRadar();
    renderApplicabilityDemo();

    // Debounced global window resize listener for flawless responsive rendering
    let resizeTimer = null;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (state.view === "pipeline") renderVectorBars();
            if (state.view === "landcover") renderLandcoverCanvas();
            if (state.view === "change") renderChangeViewer();
            if (state.view === "anomaly") renderAnomalyRadar();
            if (state.view === "quantum") renderQuantumView();
            if (state.view === "applicability") renderApplicabilityDemo();
        }, 150);
    });

    console.log("TerraVision VNQFF-09 Quantum Earth Observation Platform initialized.");
});
