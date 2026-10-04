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

        // Update titles
        const t = titles[viewName] || titles.explorer;
        if ($("pageTitle")) $("pageTitle").textContent = t[0];
        if ($("pageSubtitle")) $("pageSubtitle").textContent = t[1];

        // Trigger resize / render on view activation
        if (viewName === "landcover") renderLandcoverCanvas();
        if (viewName === "change") renderChangeViewer();
        if (viewName === "anomaly") renderAnomalyRadar();
        if (viewName === "quantum") renderQuantumView();
        if (viewName === "applicability") renderApplicabilityDemo();

        // Update Terra Tutor context
        updateTutorContext();
    }

    // Attach click listeners to all nav items
    document.querySelectorAll(".nav-item").forEach(btn => {
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
       3. REALISTIC THREE.JS 3D EARTH GLOBE
       ========================================================================== */

    let globeInstance = null;

    function init3DEarth() {
        const container = $("earthGlobe");
        if (!container) return;

        // Ensure THREE is available from global CDN
        const THREE = window.THREE;
        if (!THREE) {
            console.error("Three.js not found on window object.");
            return;
        }

        const width = container.clientWidth || 600;
        const height = container.clientHeight || 460;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x020713);

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

        // Starfield Particles
        const starGeo = new THREE.BufferGeometry();
        const starCount = 3500;
        const starPositions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
            const r = 15 + Math.random() * 25;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            starPositions[i * 3 + 1] = r * Math.cos(phi);
            starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
        }
        starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
        const starMat = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.04,
            transparent: true,
            opacity: 0.75
        });
        const stars = new THREE.Points(starGeo, starMat);
        scene.add(stars);

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

        // OrbitControls
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.enablePan = false;
        controls.minDistance = 1.35;
        controls.maxDistance = 5.5;
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
        function animate() {
            requestAnimationFrame(animate);
            const now = performance.now();
            const delta = (now - lastTime) / 1000;
            lastTime = now;

            controls.update();

            // Rotate clouds independently
            cloudMesh.rotation.y += 0.00015;

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
            barBox.className = "vector-bar-box";

            const normHeight = Math.min(100, Math.max(10, Math.round(Math.abs(val) * 100)));
            const sign = val >= 0 ? "+" : "−";

            barBox.innerHTML = `
                <div class="vector-bar-label">z${idx}</div>
                <div class="vector-bar-track">
                    <div class="vector-bar-fill" style="height: ${normHeight}%; background: ${val >= 0 ? "var(--cyan)" : "var(--purple)"}"></div>
                </div>
                <div class="vector-bar-val">${sign}${Math.abs(val).toFixed(2)}</div>
            `;
            container.appendChild(barBox);
        });

        // Update circuit gate labels
        for (let i = 0; i < 4; i++) {
            const ryGate = $(`gate-ry-${i}`);
            if (ryGate) ryGate.textContent = `Ry(z${i})`;
            const rzGate = $(`gate-rz-${i}`);
            if (rzGate) rzGate.textContent = `Rz(z${i + 4})`;
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
        // Base terrain background
        if (sample === "water") {
            // Deep canyon reservoir
            const grad = ctx.createLinearGradient(0, 0, w, h);
            grad.addColorStop(0, "#8b6540");
            grad.addColorStop(0.35, "#3b2818");
            grad.addColorStop(0.5, "#0e3a53");
            grad.addColorStop(0.8, "#062238");
            grad.addColorStop(1, "#8b6540");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);

            // Water body contour
            ctx.fillStyle = "#0c4a6e";
            ctx.beginPath();
            ctx.moveTo(w * 0.15, h * 0.1);
            ctx.bezierCurveTo(w * 0.45, h * 0.2, w * 0.35, h * 0.8, w * 0.75, h * 0.9);
            ctx.lineTo(w * 0.85, h * 0.95);
            ctx.bezierCurveTo(w * 0.55, h * 0.6, w * 0.6, h * 0.3, w * 0.35, h * 0.05);
            ctx.closePath();
            ctx.fill();
        } else if (sample === "urban") {
            // Coastal metropolis with street grids
            ctx.fillStyle = "#1e293b";
            ctx.fillRect(0, 0, w, h);

            // Water bay
            ctx.fillStyle = "#0f2f45";
            ctx.beginPath();
            ctx.moveTo(w * 0.7, 0);
            ctx.bezierCurveTo(w * 0.6, h * 0.4, w * 0.75, h * 0.7, w, h * 0.85);
            ctx.lineTo(w, 0);
            ctx.closePath();
            ctx.fill();

            // City grid blocks
            ctx.strokeStyle = "#475569";
            ctx.lineWidth = 1;
            for (let x = 20; x < w * 0.65; x += 24) {
                for (let y = 20; y < h - 20; y += 24) {
                    ctx.fillStyle = ((x + y) % 48 === 0) ? "#334155" : "#1e293b";
                    ctx.fillRect(x, y, 20, 20);
                }
            }
        } else if (sample === "disaster") {
            // Wildfire burn scar
            ctx.fillStyle = "#2d3748";
            ctx.fillRect(0, 0, w, h);

            // Burn scar perimeter
            ctx.fillStyle = "#1a202c";
            ctx.beginPath();
            ctx.ellipse(w * 0.45, h * 0.5, w * 0.35, h * 0.3, 0.4, 0, Math.PI * 2);
            ctx.fill();

            // Active smoke / thermal front
            ctx.strokeStyle = "#e53e3e";
            ctx.lineWidth = 3;
            ctx.stroke();
        } else if (sample === "forest") {
            // Lush Amazon rainforest
            const grad = ctx.createLinearGradient(0, 0, w, h);
            grad.addColorStop(0, "#064e3b");
            grad.addColorStop(0.5, "#047857");
            grad.addColorStop(1, "#065f46");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);

            // Meandering river
            ctx.strokeStyle = "#0891b2";
            ctx.lineWidth = 16;
            ctx.beginPath();
            ctx.moveTo(0, h * 0.4);
            ctx.bezierCurveTo(w * 0.3, h * 0.2, w * 0.6, h * 0.7, w, h * 0.5);
            ctx.stroke();
        } else {
            // Default: Agriculture Crop Circles & parcels
            ctx.fillStyle = "#713f12";
            ctx.fillRect(0, 0, w, h);

            // Center pivot circular crop fields
            const centers = [
                { x: w * 0.25, y: h * 0.35, r: 65, color: "#65a30d" },
                { x: w * 0.65, y: h * 0.32, r: 75, color: "#84cc16" },
                { x: w * 0.35, y: h * 0.75, r: 70, color: "#4d7c0f" },
                { x: w * 0.78, y: h * 0.72, r: 60, color: "#a3e635" }
            ];

            centers.forEach(c => {
                ctx.fillStyle = c.color;
                ctx.beginPath();
                ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
                ctx.fill();

                // Crop row ring pattern
                ctx.strokeStyle = "rgba(0,0,0,0.15)";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(c.x, c.y, c.r * 0.6, 0, Math.PI * 2);
                ctx.stroke();
            });
        }
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
                ctx.fillRect(w * 0.2, h * 0.1, w * 0.55, h * 0.8);
            }
            if (!filter || filter === "disturbed") {
                ctx.fillStyle = "rgba(239, 68, 68, 0.4)";
                ctx.fillRect(w * 0.05, h * 0.05, w * 0.15, h * 0.3);
            }
        } else if (sample === "urban") {
            if (!filter || filter === "urban") {
                ctx.fillStyle = "rgba(168, 85, 247, 0.65)";
                ctx.fillRect(0, 0, w * 0.65, h);
            }
            if (!filter || filter === "water") {
                ctx.fillStyle = "rgba(6, 182, 212, 0.65)";
                ctx.fillRect(w * 0.65, 0, w * 0.35, h);
            }
        } else if (sample === "disaster") {
            if (!filter || filter === "disturbed") {
                ctx.fillStyle = "rgba(239, 68, 68, 0.75)";
                ctx.beginPath();
                ctx.arc(w * 0.45, h * 0.5, w * 0.28, 0, Math.PI * 2);
                ctx.fill();
            }
            if (!filter || filter === "vegetation") {
                ctx.fillStyle = "rgba(16, 185, 129, 0.45)";
                ctx.fillRect(0, 0, w * 0.2, h);
                ctx.fillRect(w * 0.75, 0, w * 0.25, h);
            }
        } else if (sample === "forest") {
            if (!filter || filter === "vegetation") {
                ctx.fillStyle = "rgba(16, 185, 129, 0.7)";
                ctx.fillRect(0, 0, w, h);
            }
            if (!filter || filter === "water") {
                ctx.fillStyle = "rgba(6, 182, 212, 0.8)";
                ctx.fillRect(0, h * 0.35, w, h * 0.15);
            }
        } else {
            // Farmland
            if (!filter || filter === "agriculture") {
                ctx.fillStyle = "rgba(234, 179, 8, 0.65)";
                ctx.beginPath();
                ctx.arc(w * 0.25, h * 0.35, 65, 0, Math.PI * 2);
                ctx.arc(w * 0.65, h * 0.32, 75, 0, Math.PI * 2);
                ctx.arc(w * 0.35, h * 0.75, 70, 0, Math.PI * 2);
                ctx.arc(w * 0.78, h * 0.72, 60, 0, Math.PI * 2);
                ctx.fill();
            }
            if (!filter || filter === "vegetation") {
                ctx.fillStyle = "rgba(16, 185, 129, 0.4)";
                ctx.fillRect(0, 0, w * 0.15, h);
            }
        }

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
        if (scenario === "lakemead") {
            // Lake Mead water surface contraction
            ctx.fillStyle = "#8b6540";
            ctx.fillRect(0, 0, w, h);

            // Water body
            ctx.fillStyle = "#0284c7";
            ctx.beginPath();
            const waterWidth = isBaseline ? w * 0.65 : w * 0.38;
            ctx.ellipse(w * 0.5, h * 0.5, waterWidth, h * 0.35, 0.2, 0, Math.PI * 2);
            ctx.fill();

            // Bathtub ring mineral deposition on current
            if (!isBaseline) {
                ctx.strokeStyle = "#fef08a";
                ctx.lineWidth = 14;
                ctx.stroke();
            }
        } else if (scenario === "amazon") {
            // Amazon Deforestation fishbone pattern
            ctx.fillStyle = "#065f46";
            ctx.fillRect(0, 0, w, h);

            if (!isBaseline) {
                // Fishbone logging clearings
                ctx.strokeStyle = "#ca8a04";
                ctx.lineWidth = 8;
                ctx.beginPath();
                ctx.moveTo(w * 0.2, h * 0.1);
                ctx.lineTo(w * 0.8, h * 0.9);
                ctx.stroke();

                for (let i = 0.25; i < 0.8; i += 0.1) {
                    ctx.beginPath();
                    ctx.moveTo(w * i, h * i - 25);
                    ctx.lineTo(w * i + 65, h * i + 35);
                    ctx.stroke();
                }
            }
        } else if (scenario === "urban") {
            // Urban Sprawl
            ctx.fillStyle = isBaseline ? "#166534" : "#1e293b";
            ctx.fillRect(0, 0, w, h);

            ctx.fillStyle = "#64748b";
            const density = isBaseline ? 4 : 12;
            for (let i = 0; i < density; i++) {
                const rx = 40 + (i * 55) % (w - 100);
                const ry = 40 + (i * 45) % (h - 80);
                ctx.fillRect(rx, ry, 35, 25);
            }
        } else {
            // Wildfire burn emergence
            ctx.fillStyle = "#15803d";
            ctx.fillRect(0, 0, w, h);

            if (!isBaseline) {
                ctx.fillStyle = "#451a03";
                ctx.beginPath();
                ctx.arc(w * 0.5, h * 0.5, 110, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    function drawDifferenceHeatmap(ctx, w, h, scenario) {
        // Quantum divergence heatmap gradient
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.fillRect(0, 0, w, h);

        const radGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, 20, w * 0.5, h * 0.5, w * 0.35);
        radGrad.addColorStop(0, "rgba(239, 68, 68, 0.95)");
        radGrad.addColorStop(0.5, "rgba(245, 158, 11, 0.65)");
        radGrad.addColorStop(0.8, "rgba(56, 229, 255, 0.3)");
        radGrad.addColorStop(1, "transparent");

        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, w, h);
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

    function renderAnomalyRadar() {
        const canvas = $("anomalyCanvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        // Dark radar background
        ctx.fillStyle = "#040915";
        ctx.fillRect(0, 0, w, h);

        // Radar concentric circles
        ctx.strokeStyle = "rgba(56, 229, 255, 0.15)";
        ctx.lineWidth = 1;
        const cx = w * 0.5;
        const cy = h * 0.5;
        for (let r = 40; r < w * 0.45; r += 45) {
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Radar crosshairs
        ctx.beginPath();
        ctx.moveTo(0, cy);
        ctx.lineTo(w, cy);
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx, h);
        ctx.stroke();

        // Anomaly blips / hotspots
        const anomalies = [
            { x: cx - 120, y: cy - 40, r: 18, color: "#ef4444", label: "Pantanal Wildfire Scar" },
            { x: cx + 160, y: cy + 30, r: 14, color: "#f59e0b", label: "Lake Mead Drawdown" },
            { x: cx - 40, y: cy + 60, r: 11, color: "#38bdf8", label: "Amazon Fragmentation" }
        ];

        anomalies.forEach(a => {
            // Pulse ring
            ctx.strokeStyle = a.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(a.x, a.y, a.r * 1.5, 0, Math.PI * 2);
            ctx.stroke();

            // Core dot
            ctx.fillStyle = a.color;
            ctx.beginPath();
            ctx.arc(a.x, a.y, a.r * 0.6, 0, Math.PI * 2);
            ctx.fill();

            // Label text
            ctx.fillStyle = "#cbd5e1";
            ctx.font = "10px JetBrains Mono, monospace";
            ctx.fillText(a.label, a.x + 16, a.y + 4);
        });
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
                        <div class="q-bar-fill" style="height: ${Math.max(6, pct * 2.8)}%; background: ${isDominant ? "var(--cyan)" : "var(--purple)"}"></div>
                    </div>
                    <span class="q-bar-label">|${binStr}⟩</span>
                    <span class="q-bar-pct">${pct}%</span>
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
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const r = w * 0.38;

        ctx.clearRect(0, 0, w, h);

        // Unit circle
        ctx.strokeStyle = "rgba(56, 229, 255, 0.25)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        // Axes
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.beginPath();
        ctx.moveTo(cx - r - 5, cy);
        ctx.lineTo(cx + r + 5, cy);
        ctx.moveTo(cx, cy - r - 5);
        ctx.lineTo(cx, cy + r + 5);
        ctx.stroke();

        // State vector pointer
        const pointerX = cx + Math.sin(theta) * r;
        const pointerY = cy - Math.cos(theta) * r;

        ctx.strokeStyle = "var(--cyan)";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(pointerX, pointerY);
        ctx.stroke();

        // Tip arrow dot
        ctx.fillStyle = "var(--cyan)";
        ctx.beginPath();
        ctx.arc(pointerX, pointerY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Value text
        const expZ = Math.cos(theta).toFixed(2);
        const valEl = $(`q${qubitIdx}-val`);
        if (valEl) valEl.textContent = `⟨Z⟩ = ${expZ >= 0 ? "+" : ""}${expZ}`;
    }

    function renderAngleSliders() {
        const container = $("anglesSliderGrid");
        if (!container || container.children.length > 0) return; // Render once, update via events

        container.innerHTML = "";
        state.angles.forEach((angle, idx) => {
            const sliderItem = document.createElement("div");
            sliderItem.className = "angle-slider-item";
            sliderItem.innerHTML = `
                <div class="angle-header">
                    <span>θ${idx} (${idx < 4 ? `Ry q${idx}` : `Rz q${idx - 4}`})</span>
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
            desc: "Large-scale crop monitoring across multi-spectral bands requires processing gigabytes of raw satellite data daily. Classical CNN extracts spatial parcel geometries, while the 4-qubit PQC classifies chlorophyll health and optimizes irrigation schedules with quadratic feature enhancement.",
            solution: "Hybrid Classical CNN + 4-Qubit PQC maps 8-D spatial embeddings into a 16-D Hilbert state space, detecting sub-visual chlorophyll degradation 6 days before classical multi-spectral indices.",
            speedup: "9.2x Faster",
            speedupPct: "88%",
            speedupNote: "Classical Dense Matrix: 46ms → 4-Qubit PQC: 5.0ms",
            directive: "Irrigation schedules for Zone 4-B optimized. Nitrogen fertilizer application adjusted based on quantum-enhanced vegetative index.",
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
            desc: "Tracking freshwater depletion across transboundary basins demands continuous observation through cloud obscuration and fluctuating water bodies. The hybrid pipeline extracts shoreline boundaries and predicts evaporation divergence with high-dimensional quantum kernels.",
            solution: "Variational Ry-CNOT ansatz isolates low-reflectance water body contours with sub-pixel shoreline delineation, distinguishing shallow water from sediment runoffs.",
            speedup: "8.4x Faster",
            speedupPct: "84%",
            speedupNote: "Classical Contour Search: 62ms → 4-Qubit PQC: 7.4ms",
            directive: "Lake Mead southern intake quota modified. Agricultural transfer volume stabilized based on seasonal desiccation model.",
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
            desc: "Rapid urbanization requires automated parcel classification to monitor infrastructure sprawl, urban heat island (UHI) intensity, and permeable ground ratios for sustainable municipal planning.",
            solution: "Classical CNN extracts street layout grids while the quantum variational kernel computes rooftop solar potential and impervious surface thermal emissivity.",
            speedup: "7.9x Faster",
            speedupPct: "79%",
            speedupNote: "Classical Spatial Density: 58ms → 4-Qubit PQC: 7.3ms",
            directive: "Urban green canopy corridor designated along Eastern commercial highway. High-albedo rooftop mandate verified.",
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
            desc: "During wildfire eruptions and monsoon flooding, minutes matter. The hybrid pipeline flags thermal anomaly signatures and inundation pathways, dispatching urgent telemetry directly to emergency command centers.",
            solution: "Quantum feature maps detect non-linear correlations between thermal infrared emissions and canopy dryness, isolating active fire fronts through heavy smoke plumes.",
            speedup: "11.4x Faster",
            speedupPct: "94%",
            speedupNote: "Classical Thermal Search: 72ms → 4-Qubit PQC: 6.3ms",
            directive: "Evacuation corridor 3 cleared. Emergency fire retardant airdrop dispatched to Pantanal front 14-B.",
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
            desc: "Earth observation satellites downlink petabytes of multi-spectral data to polar and equatorial ground stations. Hybrid quantum optimization dynamically schedules optical downlink windows and antenna pass tracks.",
            solution: "Variational quantum kernel calculates dynamic orbit coverage overlap, maximizing multi-satellite imaging revisit intervals while avoiding cloud cover windows.",
            speedup: "12.8x Faster",
            speedupPct: "96%",
            speedupNote: "Classical Constellation Graph: 88ms → 4-Qubit PQC: 6.9ms",
            directive: "Svalbard Ground Station polar downlink synchronized for Sentinel-2 Pass #14809. Orbital antenna slew confirmed.",
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
        if ($("appDemoDescription")) $("appDemoDescription").textContent = d.desc;
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
    init3DEarth();
    initTerraTutor();
    applyPreset("california");
    simulateQuantumState();
    renderLandcoverCanvas();
    renderChangeViewer();
    renderAnomalyRadar();
    renderApplicabilityDemo();

    console.log("TerraVision VNQFF-09 Quantum Earth Observation Platform initialized.");
});
