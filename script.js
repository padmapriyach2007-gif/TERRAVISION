document.addEventListener("DOMContentLoaded", () => {

"use strict";


/* ============================================================
   TERRAVISION
   QUANTUM-ENHANCED EARTH OBSERVATION
   ============================================================ */


const state = {

    view: "explorer",

    zoom: 100,

    lat: null,

    lng: null,

    feature: null,

    confidence: 0,

    selectedYear: 2026,

    risk: null,

    quantumScore: null,

    quantum: null,

    images: [],

    baseline: null,

    current: null,

    lastEmbedding: null,

    lastResult: null,

    model: null,

    modelReady: false,

    modelLoading: false,

    busy: false

};


const $ = id =>
    document.getElementById(id);


/* ============================================================
   VIEW CONFIGURATION
   ============================================================ */

const views = {

    explorer: $("explorerView"),

    pipeline: $("pipelineView"),

    landcover: $("landcoverView"),

    change: $("changeView"),

    anomaly: $("anomalyView"),

    quantum: $("quantumView")

};


const titles = {

    explorer: [

        "Earth Explorer",

        "Explore and inspect satellite-style Earth observations."

    ],

    pipeline: [

        "Hybrid Quantum Satellite-Image Analysis",

        "Classical CNN vision → compressed representation → PQC/QML inference → actionable intelligence."

    ],

    landcover: [

        "Land Cover Classification",

        "Classify agriculture, vegetation, water, urban and disturbed surfaces."

    ],

    change: [

        "Hybrid Change Detection",

        "Compare baseline and current observations using CNN embeddings and quantum inference."

    ],

    anomaly: [

        "Anomaly Monitor",

        "Screen selected observations for environmental disturbance patterns."

    ],

    quantum: [

        "Quantum Analysis",

        "Inspect the 4-qubit simulated PQC state and inference result."

    ]

};


/* ============================================================
   TOAST
   ============================================================ */

let toastTimer = null;


function showToast(message) {

    const toast = $("toast");

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2600);

}


/* ============================================================
   NAVIGATION
   ============================================================ */

document
    .querySelectorAll(".nav-item")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const view =
                    button.dataset.view;

                switchView(view);

            }
        );

    });


function switchView(view) {

    if (!views[view]) return;

    state.view = view;


    Object.entries(views)
        .forEach(([name, element]) => {

            element.classList.toggle(
                "active",
                name === view
            );

        });


    document
        .querySelectorAll(".nav-item")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.view === view
            );

        });


    const title =
        titles[view] || titles.explorer;


    $("pageTitle").textContent =
        title[0];

    $("pageSubtitle").textContent =
        title[1];

}


/* ============================================================
   REAL 3D EARTH
   ============================================================ */
async function initRealEarth(){

  const container = $("earthGlobe");

  if (!container || earthReady) return;

  try {

    const THREE =
      await import("https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js");

    const { OrbitControls } =
      await import(
        "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js"
      );

    /* =====================================================
       SCENE
       ===================================================== */

    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x01050c);

    /* =====================================================
       CAMERA
       ===================================================== */

    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth /
      Math.max(container.clientHeight, 1),
      0.01,
      100
    );

    camera.position.set(0, 0, 3.25);

    /* =====================================================
       RENDERER
       ===================================================== */

    const renderer =
      new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        logarithmicDepthBuffer: true
      });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 2)
    );

    renderer.setSize(
      container.clientWidth,
      container.clientHeight
    );

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.toneMapping =
      THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure = 1.15;

    renderer.shadowMap.enabled = true;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    /* =====================================================
       LIGHTING
       ===================================================== */

    const ambient =
      new THREE.AmbientLight(
        0x7195b7,
        0.42
      );

    scene.add(ambient);

    const sun =
      new THREE.DirectionalLight(
        0xffffff,
        2.8
      );

    sun.position.set(
      5,
      2.8,
      5
    );

    sun.castShadow = true;

    scene.add(sun);

    /* =====================================================
       EARTH SYSTEM
       ===================================================== */

    const earthSystem =
      new THREE.Group();

    scene.add(earthSystem);

    /* =====================================================
       TEXTURES
       ===================================================== */

    const loader =
      new THREE.TextureLoader();

    const earthTexture =
      loader.load(
        "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"
      );

    earthTexture.colorSpace =
      THREE.SRGBColorSpace;

    const normalTexture =
      loader.load(
        "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg"
      );

    const specularTexture =
      loader.load(
        "https://threejs.org/examples/textures/planets/earth_specular_2048.jpg"
      );

    const cloudTexture =
      loader.load(
        "https://threejs.org/examples/textures/planets/earth_clouds_1024.png"
      );

    cloudTexture.colorSpace =
      THREE.SRGBColorSpace;

    /* =====================================================
       EARTH
       ===================================================== */

    const earthGeometry =
      new THREE.SphereGeometry(
        1,
        128,
        128
      );

    const earthMaterial =
      new THREE.MeshPhongMaterial({

        map: earthTexture,

        normalMap: normalTexture,

        normalScale:
          new THREE.Vector2(
            0.55,
            0.55
          ),

        specularMap:
          specularTexture,

        specular:
          new THREE.Color(
            0x1f4f6c
          ),

        shininess: 24
      });

    const earth =
      new THREE.Mesh(
        earthGeometry,
        earthMaterial
      );

    earth.castShadow = true;
    earth.receiveShadow = true;

    earthSystem.add(earth);

    /* =====================================================
       CLOUD LAYER
       ===================================================== */

    const cloudGeometry =
      new THREE.SphereGeometry(
        1.012,
        128,
        128
      );

    const cloudMaterial =
      new THREE.MeshPhongMaterial({

        map: cloudTexture,

        transparent: true,

        opacity: 0.34,

        depthWrite: false
      });

    const clouds =
      new THREE.Mesh(
        cloudGeometry,
        cloudMaterial
      );

    earthSystem.add(clouds);

    /* =====================================================
       ATMOSPHERE
       ===================================================== */

    const atmosphereGeometry =
      new THREE.SphereGeometry(
        1.065,
        128,
        128
      );

    const atmosphereMaterial =
      new THREE.MeshBasicMaterial({

        color: 0x38bfff,

        transparent: true,

        opacity: 0.10,

        side: THREE.BackSide,

        blending:
          THREE.AdditiveBlending
      });

    const atmosphere =
      new THREE.Mesh(
        atmosphereGeometry,
        atmosphereMaterial
      );

    earthSystem.add(atmosphere);

    /* =====================================================
       INNER ATMOSPHERE
       ===================================================== */

    const glowGeometry =
      new THREE.SphereGeometry(
        1.035,
        96,
        96
      );

    const glowMaterial =
      new THREE.MeshBasicMaterial({

        color: 0x168dff,

        transparent: true,

        opacity: 0.035,

        side: THREE.BackSide,

        blending:
          THREE.AdditiveBlending
      });

    const glow =
      new THREE.Mesh(
        glowGeometry,
        glowMaterial
      );

    earthSystem.add(glow);

    /* =====================================================
       STAR FIELD
       ===================================================== */

    const starGeometry =
      new THREE.BufferGeometry();

    const starCount = 4500;

    const starPositions =
      new Float32Array(
        starCount * 3
      );

    for (
      let i = 0;
      i < starCount;
      i++
    ) {

      const radius =
        15 + Math.random() * 30;

      const theta =
        Math.random() *
        Math.PI * 2;

      const phi =
        Math.acos(
          2 * Math.random() - 1
        );

      starPositions[i * 3] =
        radius *
        Math.sin(phi) *
        Math.cos(theta);

      starPositions[i * 3 + 1] =
        radius *
        Math.cos(phi);

      starPositions[i * 3 + 2] =
        radius *
        Math.sin(phi) *
        Math.sin(theta);
    }

    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        starPositions,
        3
      )
    );

    const starMaterial =
      new THREE.PointsMaterial({

        color: 0xffffff,

        size: 0.035,

        transparent: true,

        opacity: 0.75
      });

    const stars =
      new THREE.Points(
        starGeometry,
        starMaterial
      );

    scene.add(stars);

    /* =====================================================
       LATITUDE / LONGITUDE GRID
       ===================================================== */

    const gridGroup =
      new THREE.Group();

    earthSystem.add(gridGroup);

    function createGridLine(
      points
    ){

      const geometry =
        new THREE.BufferGeometry()
          .setFromPoints(points);

      const material =
        new THREE.LineBasicMaterial({

          color: 0x65dfff,

          transparent: true,

          opacity: 0.22
        });

      return new THREE.Line(
        geometry,
        material
      );
    }

    /* Longitude */

    for (
      let longitude = -180;
      longitude <= 180;
      longitude += 15
    ){

      const points = [];

      for (
        let latitude = -90;
        latitude <= 90;
        latitude += 2
      ){

        const lat =
          latitude *
          Math.PI / 180;

        const lon =
          longitude *
          Math.PI / 180;

        const r = 1.006;

        points.push(
          new THREE.Vector3(
            r *
            Math.cos(lat) *
            Math.sin(lon),

            r *
            Math.sin(lat),

            r *
            Math.cos(lat) *
            Math.cos(lon)
          )
        );
      }

      gridGroup.add(
        createGridLine(points)
      );
    }

    /* Latitude */

    for (
      let latitude = -75;
      latitude <= 75;
      latitude += 15
    ){

      const points = [];

      const lat =
        latitude *
        Math.PI / 180;

      for (
        let longitude = -180;
        longitude <= 180;
        longitude += 2
      ){

        const lon =
          longitude *
          Math.PI / 180;

        const r = 1.006;

        points.push(
          new THREE.Vector3(
            r *
            Math.cos(lat) *
            Math.sin(lon),

            r *
            Math.sin(lat),

            r *
            Math.cos(lat) *
            Math.cos(lon)
          )
        );
      }

      gridGroup.add(
        createGridLine(points)
      );
    }

    /* Grid starts hidden */

    gridGroup.visible = false;

    /* =====================================================
       LOCATION MARKER
       ===================================================== */

    const markerGroup =
      new THREE.Group();

    earthSystem.add(markerGroup);

    const markerGeometry =
      new THREE.SphereGeometry(
        0.018,
        24,
        24
      );

    const markerMaterial =
      new THREE.MeshBasicMaterial({
        color: 0xff4fd8
      });

    const marker =
      new THREE.Mesh(
        markerGeometry,
        markerMaterial
      );

    marker.visible = false;

    markerGroup.add(marker);

    /* Outer ring */

    const ringGeometry =
      new THREE.RingGeometry(
        0.025,
        0.045,
        32
      );

    const ringMaterial =
      new THREE.MeshBasicMaterial({

        color: 0x4de3ff,

        transparent: true,

        opacity: 0.85,

        side: THREE.DoubleSide
      });

    const markerRing =
      new THREE.Mesh(
        ringGeometry,
        ringMaterial
      );

    markerRing.visible = false;

    markerGroup.add(
      markerRing
    );

    /* =====================================================
       ORBIT CONTROLS
       ===================================================== */

    const controls =
      new OrbitControls(
        camera,
        renderer.domElement
      );

    controls.enableDamping = true;

    controls.dampingFactor = 0.055;

    controls.enablePan = false;

    controls.enableZoom = true;

    controls.zoomToCursor = true;

    controls.minDistance = 1.45;

    controls.maxDistance = 6;

    controls.rotateSpeed = 0.65;

    controls.zoomSpeed = 0.8;

    controls.autoRotate = true;

    controls.autoRotateSpeed = 0.35;

    controls.target.set(
      0,
      0,
      0
    );

    /* =====================================================
       RAYCASTING
       ===================================================== */

    const raycaster =
      new THREE.Raycaster();

    const pointer =
      new THREE.Vector2();

    let pointerDown = null;

    let pointerMoved = false;

    /* =====================================================
       LOCATION CONVERSION
       ===================================================== */

    function worldToLatLng(
      worldPoint
    ){

      const local =
        earth.worldToLocal(
          worldPoint.clone()
        );

      const radius =
        local.length();

      const latitude =
        Math.asin(
          THREE.MathUtils.clamp(
            local.y / radius,
            -1,
            1
          )
        ) *
        180 /
        Math.PI;

      const longitude =
        Math.atan2(
          local.x,
          local.z
        ) *
        180 /
        Math.PI;

      return {
        latitude,
        longitude
      };
    }

    /* =====================================================
       HOVER COORDINATES
       ===================================================== */

    renderer.domElement.addEventListener(
      "pointermove",
      event => {

        const rect =
          renderer.domElement
            .getBoundingClientRect();

        pointer.x =
          ((event.clientX -
            rect.left) /
            rect.width) *
            2 - 1;

        pointer.y =
          -(
            (event.clientY -
              rect.top) /
            rect.height
          ) *
            2 + 1;

        raycaster.setFromCamera(
          pointer,
          camera
        );

        const hits =
          raycaster.intersectObject(
            earth,
            false
          );

        if (hits.length){

          const coords =
            worldToLatLng(
              hits[0].point
            );

          const lat =
            coords.latitude.toFixed(4);

          const lon =
            coords.longitude.toFixed(4);

          const coordElement =
            $("globeCursorCoords");

          if (coordElement){

            coordElement.textContent =
              `${lat}° ${lat >= 0 ? "N" : "S"}  |  ` +
              `${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? "E" : "W"}`;
          }
        }

        if (
          pointerDown &&
          Math.hypot(
            event.clientX -
              pointerDown.x,

            event.clientY -
              pointerDown.y
          ) > 6
        ){

          pointerMoved = true;
        }
      }
    );

    /* =====================================================
       CLICK / LOCATION SELECTION
       ===================================================== */

    renderer.domElement.addEventListener(
      "pointerdown",
      event => {

        pointerDown = {
          x: event.clientX,
          y: event.clientY
        };

        pointerMoved = false;
      }
    );

    renderer.domElement.addEventListener(
      "pointerup",
      event => {

        if (
          !pointerDown ||
          pointerMoved
        ){

          pointerDown = null;

          return;
        }

        const rect =
          renderer.domElement
            .getBoundingClientRect();

        pointer.x =
          ((event.clientX -
            rect.left) /
            rect.width) *
            2 - 1;

        pointer.y =
          -(
            (event.clientY -
              rect.top) /
            rect.height
          ) *
            2 + 1;

        raycaster.setFromCamera(
          pointer,
          camera
        );

        const hit =
          raycaster.intersectObject(
            earth,
            false
          )[0];

        if (hit){

          const coords =
            worldToLatLng(
              hit.point
            );

          /* Save coordinates */

          state.lat =
            coords.latitude.toFixed(5);

          state.lng =
            coords.longitude.toFixed(5);

          state.confidence =
            state.lastResult?.confidence || 0;

          /* Move marker */

          marker.position.copy(
            earth.worldToLocal(
              hit.point.clone()
            )
          );

          markerRing.position.copy(
            marker.position
          );

          marker.visible = true;

          markerRing.visible = true;

          /* Make ring face camera */

          markerRing.lookAt(
            camera.position
          );

          /* Existing inspector */

          updateInspector();

          reverseGeocode(
            coords.latitude,
            coords.longitude
          );

          if (
            typeof placeMapPinFromScreen ===
            "function"
          ){

            placeMapPinFromScreen(
              event.clientX,
              event.clientY
            );
          }

          showToast(
            `Location selected: ` +
            `${coords.latitude.toFixed(4)}°, ` +
            `${coords.longitude.toFixed(4)}°`
          );
        }

        pointerDown = null;
      }
    );

    /* =====================================================
       RESIZE
       ===================================================== */

    function resize(){

      const width =
        container.clientWidth;

      const height =
        Math.max(
          container.clientHeight,
          1
        );

      camera.aspect =
        width / height;

      camera.updateProjectionMatrix();

      renderer.setSize(
        width,
        height
      );

      renderer.setPixelRatio(
        Math.min(
          window.devicePixelRatio || 1,
          2
        )
      );
    }

    window.addEventListener(
      "resize",
      resize
    );

    resize();

    /* =====================================================
       STORE GLOBE INSTANCE
       ===================================================== */

    earthApp = {

      THREE,

      scene,

      camera,

      renderer,

      earth,

      clouds,

      atmosphere,

      glow,

      controls,

      gridGroup,

      marker,

      markerRing,

      sun,

      stars,

      raycaster,

      pointer,

      earthSystem
    };

    earthReady = true;

    /* =====================================================
       BUTTONS
       ===================================================== */

    $("globeZoomIn")
      ?.addEventListener(
        "click",
        () => {

          camera.position.multiplyScalar(
            0.82
          );

          camera.position.clampLength(
            controls.minDistance,
            controls.maxDistance
          );
        }
      );

    $("globeZoomOut")
      ?.addEventListener(
        "click",
        () => {

          camera.position.multiplyScalar(
            1.22
          );

          camera.position.clampLength(
            controls.minDistance,
            controls.maxDistance
          );
        }
      );

    $("earthAutoRotate")
      ?.addEventListener(
        "click",
        event => {

          controls.autoRotate =
            !controls.autoRotate;

          event.currentTarget.textContent =
            controls.autoRotate
              ? "⏸"
              : "▶";
        }
      );

    $("globeCompass")
      ?.addEventListener(
        "click",
        () => {

          camera.position.set(
            0,
            0,
            3.25
          );

          controls.target.set(
            0,
            0,
            0
          );

          controls.update();
        }
      );

    $("globeReset")
      ?.addEventListener(
        "click",
        () => {

          camera.position.set(
            0,
            0,
            3.25
          );

          controls.target.set(
            0,
            0,
            0
          );

          earthSystem.rotation.set(
            0,
            0,
            0
          );

          controls.autoRotate = true;

          const button =
            $("earthAutoRotate");

          if (button)
            button.textContent = "⏸";

          controls.update();
        }
      );

    $("globeGrid")
      ?.addEventListener(
        "click",
        event => {

          gridGroup.visible =
            !gridGroup.visible;

          event.currentTarget.classList.toggle(
            "active",
            gridGroup.visible
          );
        }
      );

    let nightMode = false;

    $("globeDayNight")
      ?.addEventListener(
        "click",
        event => {

          nightMode =
            !nightMode;

          if (nightMode){

            sun.intensity = 0.65;

            ambient.intensity = 0.18;

            earthMaterial.shininess = 8;

            event.currentTarget.textContent =
              "🌙";

          } else {

            sun.intensity = 2.8;

            ambient.intensity = 0.42;

            earthMaterial.shininess = 24;

            event.currentTarget.textContent =
              "☀";
          }
        }
      );

    $("globeFullscreen")
      ?.addEventListener(
        "click",
        async () => {

          if (
            !document.fullscreenElement
          ){

            await container.requestFullscreen?.();

          } else {

            await document.exitFullscreen?.();
          }

          setTimeout(
            resize,
            150
          );
        }
      );

    /* =====================================================
       ANIMATION
       ===================================================== */

    function animate(){

      requestAnimationFrame(
        animate
      );

      controls.update();

      /* Clouds move independently */

      clouds.rotation.y +=
        0.00018;

      /* Very subtle star movement */

      stars.rotation.y +=
        0.000015;

      /* Marker pulse */

      if (
        marker.visible
      ){

        const pulse =
          1 +
          Math.sin(
            performance.now() *
            0.004
          ) *
          0.18;

        marker.scale.setScalar(
          pulse
        );

        markerRing.scale.setScalar(
          pulse
        );

        markerRing.lookAt(
          camera.position
        );
      }

      renderer.render(
        scene,
        camera
      );
    }

    animate();

  } catch (error) {

    console.error(
      "Virtual Earth initialization failed:",
      error
    );

    $("mapModeLabel").textContent =
      "EARTH VIEW FALLBACK";

    showToast(
      "3D Earth could not load; existing map remains available"
    );
  }
}

initRealEarth();
async function initializeEarth() {

    const container =
        $("earthGlobe");

    if (!container) return;


    try {

        const THREE =
            await import(
                "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js"
            );


        const {
            OrbitControls
        } =
            await import(
                "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js"
            );


        /* ====================================================
           SCENE
           ==================================================== */

        const scene =
            new THREE.Scene();


        /* ====================================================
           CAMERA
           ==================================================== */

        const camera =
            new THREE.PerspectiveCamera(
                35,
                container.clientWidth /
                container.clientHeight,
                0.1,
                1000
            );


        camera.position.set(
            0,
            0,
            3.2
        );


        /* ====================================================
           RENDERER
           ==================================================== */

        const renderer =
            new THREE.WebGLRenderer({

                antialias: true,

                alpha: true

            });


        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio || 1,
                2
            )
        );


        renderer.setSize(
            container.clientWidth,
            container.clientHeight
        );


        renderer.outputColorSpace =
            THREE.SRGBColorSpace;


        renderer.toneMapping =
            THREE.ACESFilmicToneMapping;


        renderer.toneMappingExposure =
            1.15;


        container.appendChild(
            renderer.domElement
        );


        /* ====================================================
           LIGHTING
           ==================================================== */

        const ambientLight =
            new THREE.AmbientLight(
                0x6da9d8,
                .55
            );


        scene.add(
            ambientLight
        );


        const sun =
            new THREE.DirectionalLight(
                0xffffff,
                2.2
            );


        sun.position.set(
            5,
            3,
            5
        );


        scene.add(
            sun
        );


        /* ====================================================
           EARTH GROUP
           ==================================================== */

        const earthGroup =
            new THREE.Group();


        scene.add(
            earthGroup
        );


        /* ====================================================
           TEXTURES
           ==================================================== */

        const loader =
            new THREE.TextureLoader();


        const earthTexture =
            loader.load(
                "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"
            );


        const earthNormal =
            loader.load(
                "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg"
            );


        const earthSpecular =
            loader.load(
                "https://threejs.org/examples/textures/planets/earth_specular_2048.jpg"
            );


        const cloudsTexture =
            loader.load(
                "https://threejs.org/examples/textures/planets/earth_clouds_1024.png"
            );


        earthTexture.colorSpace =
            THREE.SRGBColorSpace;


        cloudsTexture.colorSpace =
            THREE.SRGBColorSpace;


        /* ====================================================
           EARTH
           ==================================================== */

        const earthGeometry =
            new THREE.SphereGeometry(
                1,
                96,
                96
            );


        const earthMaterial =
            new THREE.MeshPhongMaterial({

                map: earthTexture,

                normalMap: earthNormal,

                specularMap:
                    earthSpecular,

                specular:
                    new THREE.Color(
                        0x1e3d55
                    ),

                shininess: 18

            });


        const earth =
            new THREE.Mesh(
                earthGeometry,
                earthMaterial
            );


        earthGroup.add(
            earth
        );


        /* ====================================================
           CLOUDS
           ==================================================== */

        const cloudGeometry =
            new THREE.SphereGeometry(
                1.012,
                96,
                96
            );


        const cloudMaterial =
            new THREE.MeshPhongMaterial({

                map: cloudsTexture,

                transparent: true,

                opacity: .32,

                depthWrite: false

            });


        const clouds =
            new THREE.Mesh(
                cloudGeometry,
                cloudMaterial
            );


        earthGroup.add(
            clouds
        );


        /* ====================================================
           ATMOSPHERE
           ==================================================== */

        const atmosphereGeometry =
            new THREE.SphereGeometry(
                1.06,
                96,
                96
            );


        const atmosphereMaterial =
            new THREE.MeshBasicMaterial({

                color: 0x38bfff,

                transparent: true,

                opacity: .10,

                side:
                    THREE.BackSide

            });


        const atmosphere =
            new THREE.Mesh(
                atmosphereGeometry,
                atmosphereMaterial
            );


        earthGroup.add(
            atmosphere
        );


        /* ====================================================
           ORBIT CONTROLS
           ==================================================== */

        const controls =
            new OrbitControls(
                camera,
                renderer.domElement
            );


        controls.enableDamping =
            true;


        controls.dampingFactor =
            .055;


        controls.enablePan =
            false;


        controls.enableZoom =
            true;


        controls.minDistance =
            1.65;


        controls.maxDistance =
            5;


        controls.rotateSpeed =
            .65;


        controls.zoomSpeed =
            .8;


        controls.target.set(
            0,
            0,
            0
        );


        controls.autoRotate =
            true;


        controls.autoRotateSpeed =
            .55;


        /* ====================================================
           RAYCASTING
           ==================================================== */

        const raycaster =
            new THREE.Raycaster();


        const pointer =
            new THREE.Vector2();


        /* ====================================================
           3D POINT → LATITUDE/LONGITUDE
           ==================================================== */

        function pointToLatLng(
            worldPoint
        ) {

            const localPoint =
                earth.worldToLocal(
                    worldPoint.clone()
                );


            const radius =
                localPoint.length();


            const latitude =
                Math.asin(
                    localPoint.y /
                    radius
                ) *
                180 /
                Math.PI;


            const longitude =
                Math.atan2(
                    localPoint.x,
                    localPoint.z
                ) *
                180 /
                Math.PI;


            return {

                lat: latitude,

                lng: longitude

            };

        }


        /* ====================================================
           CLICK EARTH
           ==================================================== */

        renderer.domElement.addEventListener(
            "pointerdown",
            event => {

                if (event.button !== 0)
                    return;


                const rect =
                    renderer.domElement
                        .getBoundingClientRect();


                pointer.x =
                    (
                        (event.clientX -
                            rect.left) /
                        rect.width
                    ) *
                    2 - 1;


                pointer.y =
                    -(
                        (event.clientY -
                            rect.top) /
                        rect.height
                    ) *
                    2 + 1;


                raycaster.setFromCamera(
                    pointer,
                    camera
                );


                const hits =
                    raycaster.intersectObject(
                        earth,
                        false
                    );


                if (!hits.length)
                    return;


                const point =
                    hits[0].point;


                const location =
                    pointToLatLng(
                        point
                    );


                showEarthMarker(
                    point
                );


                inspectLocation(
                    location.lat,
                    location.lng
                );

            }
        );


        /* ====================================================
           EARTH MARKER
           ==================================================== */

        function showEarthMarker(
            worldPoint
        ) {

            const marker =
                $("earthMarker");


            const vector =
                worldPoint.clone();


            vector.project(
                camera
            );


            const rect =
                container.getBoundingClientRect();


            const x =
                (
                    vector.x *
                    .5 +
                    .5
                ) *
                rect.width;


            const y =
                (
                    -vector.y *
                    .5 +
                    .5
                ) *
                rect.height;


            marker.style.left =
                `${x}px`;


            marker.style.top =
                `${y}px`;


            marker.classList.remove(
                "hidden"
            );

        }


        /* ====================================================
           LOCATION INSPECTOR
           ==================================================== */

        async function inspectLocation(
            latitude,
            longitude
        ) {

            latitude =
                Math.max(
                    -90,
                    Math.min(
                        90,
                        latitude
                    )
                );


            longitude =
                (
                    (
                        longitude +
                        180
                    ) %
                    360
                ) - 180;


            state.lat =
                latitude;


            state.lng =
                longitude;


            const latText =
                `${latitude.toFixed(5)}°`;


            const lngText =
                `${longitude.toFixed(5)}°`;


            $("mapLat").textContent =
                latText;


            $("mapLng").textContent =
                lngText;


            $("inspectorLat").textContent =
                latText;


            $("inspectorLng").textContent =
                lngText;


            $("selectedLat").textContent =
                latText;


            $("selectedLng").textContent =
                lngText;


            $("locationInspector")
                .classList
                .add("active");


            $("emptyInspector")
                ?.classList
                .add("hidden");


            $("locationDetails")
                ?.classList
                .remove("hidden");


            $("inspectorTitle")
                .textContent =
                "Resolving location...";


            $("inspectorPlace")
                .textContent =
                "Identifying geographic location";


            $("inspectorAddress")
                .textContent =
                `${latText}, ${lngText}`;


            try {

                const url =
                    "https://nominatim.openstreetmap.org/reverse" +
                    `?format=jsonv2` +
                    `&lat=${encodeURIComponent(latitude)}` +
                    `&lon=${encodeURIComponent(longitude)}` +
                    `&zoom=18` +
                    `&addressdetails=1`;


                const response =
                    await fetch(url);


                if (!response.ok) {

                    throw new Error(
                        "Reverse geocoding failed"
                    );

                }


                const data =
                    await response.json();


                const address =
                    data.address || {};


                const country =
                    address.country ||
                    "Unknown";


                const region =
                    address.state ||
                    address.region ||
                    address.province ||
                    "Unknown";


                const city =
                    address.city ||
                    address.town ||
                    address.village ||
                    address.municipality ||
                    address.county ||
                    "Unknown";


                const continent =
                    detectContinent(
                        country
                    );


                $("inspectorTitle")
                    .textContent =
                    city !== "Unknown"
                        ? city
                        : country;


                $("inspectorPlace")
                    .textContent =
                    city !== "Unknown"
                        ? city
                        : country;


                $("selectedLocation")
                    .textContent =
                    city !== "Unknown"
                        ? city
                        : country;


                $("inspectorAddress")
                    .textContent =
                    data.display_name ||
                    `${latText}, ${lngText}`;


                $("inspectorCountry")
                    .textContent =
                    country;


                $("inspectorState")
                    .textContent =
                    region;


                $("inspectorCity")
                    .textContent =
                    city;


                $("inspectorContinent")
                    .textContent =
                    continent;


                $("inspectorAnalysis")
                    .textContent =
                    `Selected point located at ` +
                    `${latitude.toFixed(4)}°, ` +
                    `${longitude.toFixed(4)}°. ` +
                    `The location can now be used as ` +
                    `a geographic reference for ` +
                    `satellite-image inspection and ` +
                    `change analysis.`;


                showToast(
                    `Location identified: ${
                        city !== "Unknown"
                            ? city
                            : country
                    }`
                );


            } catch (error) {

                console.warn(
                    "Location lookup failed:",
                    error
                );


                $("inspectorTitle")
                    .textContent =
                    "Coordinates selected";


                $("inspectorPlace")
                    .textContent =
                    "Geographic point";


                $("selectedLocation")
                    .textContent =
                    "Selected point";


                $("inspectorCountry")
                    .textContent =
                    "Unavailable";


                $("inspectorState")
                    .textContent =
                    "Unavailable";


                $("inspectorCity")
                    .textContent =
                    "Unavailable";


                $("inspectorContinent")
                    .textContent =
                    detectContinentByCoordinates(
                        latitude,
                        longitude
                    );


                $("inspectorAnalysis")
                    .textContent =
                    `Coordinates successfully identified: ` +
                    `${latitude.toFixed(4)}°, ` +
                    `${longitude.toFixed(4)}°. ` +
                    `Detailed place-name lookup is currently unavailable.`;

            }

        }


        /* ====================================================
           CONTINENT DETECTION
           ==================================================== */

        function detectContinent(
            country
        ) {

            const c =
                country.toLowerCase();


            const asia = [

                "india",
                "china",
                "japan",
                "nepal",
                "pakistan",
                "bangladesh",
                "sri lanka",
                "indonesia",
                "malaysia",
                "thailand",
                "vietnam",
                "singapore",
                "south korea",
                "mongolia"

            ];


            const europe = [

                "united kingdom",
                "france",
                "germany",
                "italy",
                "spain",
                "portugal",
                "netherlands",
                "belgium",
                "switzerland",
                "sweden",
                "norway",
                "denmark"

            ];


            const africa = [

                "south africa",
                "egypt",
                "nigeria",
                "kenya",
                "ethiopia",
                "ghana",
                "morocco",
                "algeria"

            ];


            const northAmerica = [

                "united states",
                "canada",
                "mexico",
                "cuba"

            ];


            const southAmerica = [

                "brazil",
                "argentina",
                "chile",
                "peru",
                "colombia",
                "bolivia",
                "ecuador"

            ];


            if (
                asia.some(
                    x => c.includes(x)
                )
            )
                return "Asia";


            if (
                europe.some(
                    x => c.includes(x)
                )
            )
                return "Europe";


            if (
                africa.some(
                    x => c.includes(x)
                )
            )
                return "Africa";


            if (
                northAmerica.some(
                    x => c.includes(x)
                )
            )
                return "North America";


            if (
                southAmerica.some(
                    x => c.includes(x)
                )
            )
                return "South America";


            if (
                c.includes("australia") ||
                c.includes("new zealand")
            )
                return "Oceania";


            return "Unknown";

        }


        function detectContinentByCoordinates(
            lat,
            lng
        ) {

            if (lat < -60)
                return "Antarctica";


            if (
                lng >= -170 &&
                lng <= -30 &&
                lat > 5
            )
                return "North America";


            if (
                lng >= -90 &&
                lng <= -30 &&
                lat <= 15
            )
                return "South America";


            if (
                lng >= -20 &&
                lng <= 55 &&
                lat >= -35
            )
                return "Africa / Europe";


            if (
                lng >= 55 &&
                lng <= 180
            )
                return "Asia / Oceania";


            return "Unknown";

        }


        /* ====================================================
           RESET EARTH
           ==================================================== */

        $("earthReset")
            ?.addEventListener(
                "click",
                () => {

                    camera.position.set(
                        0,
                        0,
                        3.2
                    );


                    controls.target.set(
                        0,
                        0,
                        0
                    );


                    controls.update();


                    earthGroup.rotation.set(
                        0,
                        0,
                        0
                    );


                    $("earthMarker")
                        .classList
                        .add("hidden");


                    $("locationInspector")
                        .classList
                        .remove("active");


                    showToast(
                        "Earth view reset"
                    );

                }
            );


        /* ====================================================
           AUTO ROTATION
           ==================================================== */

        const rotateButton =
            $("earthAutoRotate");


        rotateButton
            ?.addEventListener(
                "click",
                () => {

                    controls.autoRotate =
                        !controls.autoRotate;


                    rotateButton.textContent =
                        controls.autoRotate
                            ? "⏸"
                            : "▶";


                    rotateButton.title =
                        controls.autoRotate
                            ? "Pause rotation"
                            : "Resume rotation";

                }
            );


        /* ====================================================
           EARTH ZOOM
           ==================================================== */

        function updateEarthZoom() {

            const distance =
                camera.position.distanceTo(
                    controls.target
                );


            const zoom =
                Math.round(
                    320 / distance
                );


            const value =
                Math.max(
                    65,
                    Math.min(
                        190,
                        zoom
                    )
                );


            $("earthZoomValue")
                .textContent =
                `${value}%`;


            $("zoomValue")
                .textContent =
                `${value}%`;

        }


        $("earthZoomIn")
            ?.addEventListener(
                "click",
                () => {

                    camera.position
                        .multiplyScalar(.82);


                    camera.position
                        .clampLength(
                            controls.minDistance,
                            controls.maxDistance
                        );


                    updateEarthZoom();

                }
            );


        $("earthZoomOut")
            ?.addEventListener(
                "click",
                () => {

                    camera.position
                        .multiplyScalar(1.22);


                    camera.position
                        .clampLength(
                            controls.minDistance,
                            controls.maxDistance
                        );


                    updateEarthZoom();

                }
            );


        $("zoomIn")
            ?.addEventListener(
                "click",
                () => {

                    camera.position
                        .multiplyScalar(.88);


                    camera.position
                        .clampLength(
                            controls.minDistance,
                            controls.maxDistance
                        );


                    updateEarthZoom();

                }
            );


        $("zoomOut")
            ?.addEventListener(
                "click",
                () => {

                    camera.position
                        .multiplyScalar(1.12);


                    camera.position
                        .clampLength(
                            controls.minDistance,
                            controls.maxDistance
                        );


                    updateEarthZoom();

                }
            );


        /* ====================================================
           CLOSE INSPECTOR
           ==================================================== */

        $("closeInspector")
            ?.addEventListener(
                "click",
                () => {

                    $("locationInspector")
                        .classList
                        .remove("active");


                    $("earthMarker")
                        .classList
                        .add("hidden");

                }
            );


        /* ====================================================
           RESIZE
           ==================================================== */

        window.addEventListener(
            "resize",
            () => {

                const width =
                    container.clientWidth;


                const height =
                    container.clientHeight;


                camera.aspect =
                    width / height;


                camera.updateProjectionMatrix();


                renderer.setSize(
                    width,
                    height
                );


                renderer.setPixelRatio(
                    Math.min(
                        window.devicePixelRatio || 1,
                        2
                    )
                );

            }
        );


        /* ====================================================
           ANIMATION
           ==================================================== */

        function animate() {

            requestAnimationFrame(
                animate
            );


            controls.update();


            clouds.rotation.y +=
                .00018;


            updateEarthZoom();


            renderer.render(
                scene,
                camera
            );

        }


        animate();


        console.log(
            "TerraVision realistic Earth initialized."
        );


    } catch (error) {

        console.error(
            "Unable to initialize 3D Earth:",
            error
        );


        container.innerHTML = `

            <div style="
                display:grid;
                place-items:center;
                height:100%;
                color:#9ab;
                font-size:11px;
                text-align:center;
                padding:30px;
            ">

                <div>

                    <div style="
                        font-size:35px;
                        margin-bottom:10px;
                    ">
                        🌍
                    </div>

                    <strong>
                        3D Earth could not be loaded
                    </strong>

                    <p>
                        Please check your internet connection
                        and reload the application.
                    </p>

                </div>

            </div>

        `;

    }

}


/* ============================================================
   NEW ANALYSIS
   ============================================================ */

$("newAnalysisBtn")
    ?.addEventListener(
        "click",
        () => {

            state.lat = null;

            state.lng = null;

            state.feature = null;

            state.confidence = 0;

            state.risk = null;

            state.quantumScore = null;

            $("earthMarker")
                ?.classList
                .add("hidden");


            $("locationInspector")
                ?.classList
                .remove("active");


            $("emptyInspector")
                ?.classList
                .remove("hidden");


            $("locationDetails")
                ?.classList
                .add("hidden");


            $("analysisStatus")
                .textContent =
                "Ready";


            $("dataSource")
                .textContent =
                "Local Earth Dataset";


            $("datasetName")
                .textContent =
                "TerraVision Demo 2026";


            $("confidence")
                .textContent =
                "96.4%";


            $("classificationResult")
                .textContent =
                "Awaiting Analysis";


            $("classificationDescription")
                .textContent =
                "Select a location from Earth Explorer and run classification.";


            $("classificationScore")
                .textContent =
                "--";


            $("selectedYear")
                .textContent =
                "2026";


            $("riskValue")
                .textContent =
                "24";


            $("riskProgress")
                .style.width =
                "24%";


            $("quantumState")
                .textContent =
                "|000⟩";


            $("entropyValue")
                .textContent =
                "0.00";


            $("patternProbability")
                .textContent =
                "0%";


            $("quantumScore")
                .textContent =
                "--";


            $("quantumResult")
                .textContent =
                "Quantum analysis has not been executed yet.";


            switchView(
                "explorer"
            );


            showToast(
                "New analysis started"
            );

        }
    );


/* ============================================================
   HELP
   ============================================================ */

const helpModal =
    $("helpModal");


$("helpBtn")
    ?.addEventListener(
        "click",
        () => {

            helpModal
                ?.classList
                .remove("hidden");

        }
    );


$("closeHelp")
    ?.addEventListener(
        "click",
        () => {

            helpModal
                ?.classList
                .add("hidden");

        }
    );


helpModal
    ?.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                helpModal
            ) {

                helpModal
                    .classList
                    .add("hidden");

            }

        }
    );


/* ============================================================
   REPORT EXPORT
   ============================================================ */

$("reportBtn")
    ?.addEventListener(
        "click",
        () => {

            const report = {

                application:
                    "TerraVision Earth Observation Intelligence",

                generatedAt:
                    new Date().toISOString(),

                mode:
                    "Frontend Local Simulation",

                selectedLocation: {

                    latitude:
                        state.lat,

                    longitude:
                        state.lng

                },

                feature:
                    state.feature,

                classificationConfidence:
                    state.confidence,

                selectedYear:
                    state.selectedYear,

                anomalyRisk:
                    state.risk,

                quantumScore:
                    state.quantumScore,

                note:
                    "Results are generated locally for demonstration and do not represent live satellite observations."

            };


            const blob =
                new Blob(
                    [
                        JSON.stringify(
                            report,
                            null,
                            2
                        )
                    ],
                    {
                        type:
                            "application/json"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;


            link.download =
                `terrivision-analysis-${Date.now()}.json`;


            document.body.appendChild(
                link
            );


            link.click();


            link.remove();


            URL.revokeObjectURL(
                url
            );


            showToast(
                "Analysis report exported"
            );

        }
    );


/* ============================================================
   YEAR SLIDER
   ============================================================ */

$("yearSlider")
    ?.addEventListener(
        "input",
        event => {

            state.selectedYear =
                Number(
                    event.target.value
                );


            $("selectedYear")
                .textContent =
                state.selectedYear;

        }
    );


/* ============================================================
   CONNECT SATELLITE
   ============================================================ */

$("connectSatellite")
    ?.addEventListener(
        "click",
        () => {

            $("analysisStatus")
                .textContent =
                "Demo Connected";


            $("dataSource")
                .textContent =
                "Local Earth Dataset";


            showToast(
                "Satellite analysis workspace connected"
            );

        }
    );


/* ============================================================
   MOBILE-NET MODEL LOADING
   ============================================================ */

async function loadCNNModel() {

    if (
        state.modelReady ||
        state.modelLoading
    )
        return;


    if (
        typeof mobilenet ===
        "undefined"
    ) {

        console.warn(
            "MobileNet library not loaded."
        );

        return;

    }


    try {

        state.modelLoading =
            true;


        showToast(
            "Loading CNN feature extractor..."
        );


        state.model =
            await mobilenet.load();


        state.modelReady =
            true;


        state.modelLoading =
            false;


        showToast(
            "CNN feature extractor ready"
        );


    } catch (error) {

        state.modelLoading =
            false;


        console.error(
            "CNN loading failed:",
            error
        );

    }

}


/* ============================================================
   IMAGE FEATURE EXTRACTION
   ============================================================ */

async function extractFeatures(
    imageElement
) {

    if (
        !state.modelReady ||
        !state.model
    ) {

        await loadCNNModel();

    }


    if (
        !state.model
    ) {

        return createFallbackEmbedding();

    }


    try {

        const embedding =
            state.model
                .infer(
                    imageElement,
                    true
                );


        const tensor =
            await embedding.data();


        embedding.dispose();


        return compressEmbedding(
            Array.from(tensor)
        );


    } catch (error) {

        console.warn(
            "CNN inference failed:",
            error
        );


        return createFallbackEmbedding();

    }

}


/* ============================================================
   8-D FEATURE COMPRESSION
   ============================================================ */

function compressEmbedding(
    values
) {

    if (!values.length)
        return createFallbackEmbedding();


    const result =
        new Array(8).fill(0);


    const block =
        Math.max(
            1,
            Math.floor(
                values.length / 8
            )
        );


    for (
        let i = 0;
        i < values.length;
        i++
    ) {

        const bucket =
            Math.min(
                7,
                Math.floor(
                    i / block
                )
            );


        result[bucket] +=
            Number(values[i]) || 0;

    }


    const max =
        Math.max(
            ...result.map(
                value =>
                    Math.abs(value)
            ),
            1e-9
        );


    return result.map(
        value =>
            value / max
    );

}


/* ============================================================
   FALLBACK 8-D EMBEDDING
   ============================================================ */

function createFallbackEmbedding() {

    return [

        .12,
        .28,
        .46,
        .71,
        .35,
        .62,
        .18,
        .54

    ];

}


/* ============================================================
   4-QUBIT QUANTUM STATE
   ============================================================ */

function createQuantumState() {

    const dimension = 16;

    const real =
        new Array(
            dimension
        ).fill(0);

    const imag =
        new Array(
            dimension
        ).fill(0);


    real[0] = 1;


    return {
        real,
        imag
    };

}


/* ============================================================
   SINGLE QUBIT ROTATION
   ============================================================ */

function applyRY(
    quantum,
    qubit,
    theta
) {

    const c =
        Math.cos(
            theta / 2
        );

    const s =
        Math.sin(
            theta / 2
        );


    const stride =
        1 << qubit;


    const block =
        stride * 2;


    for (
        let base = 0;
        base < 16;
        base += block
    ) {

        for (
            let offset = 0;
            offset < stride;
            offset++
        ) {

            const i0 =
                base + offset;

            const i1 =
                i0 + stride;


            const r0 =
                quantum.real[i0];

            const im0 =
                quantum.imag[i0];

            const r1 =
                quantum.real[i1];

            const im1 =
                quantum.imag[i1];


            quantum.real[i0] =
                c * r0 -
                s * r1;


            quantum.imag[i0] =
                c * im0 -
                s * im1;


            quantum.real[i1] =
                s * r0 +
                c * r1;


            quantum.imag[i1] =
                s * im0 +
                c * im1;

        }

    }

}


/* ============================================================
   RZ
   ============================================================ */

function applyRZ(
    quantum,
    qubit,
    theta
) {

    const half =
        theta / 2;


    const pR =
        Math.cos(
            half
        );

    const pI =
        Math.sin(
            half
        );


    for (
        let i = 0;
        i < 16;
        i++
    ) {

        const bit =
            (i >> qubit) & 1;


        if (bit === 0) {

            const r =
                quantum.real[i];

            const im =
                quantum.imag[i];


            quantum.real[i] =
                r * pR +
                im * pI;


            quantum.imag[i] =
                im * pR -
                r * pI;

        } else {

            const r =
                quantum.real[i];

            const im =
                quantum.imag[i];


            quantum.real[i] =
                r * pR -
                im * pI;


            quantum.imag[i] =
                im * pR +
                r * pI;

        }

    }

}


/* ============================================================
   CNOT
   ============================================================ */

function applyCNOT(
    quantum,
    control,
    target
) {

    for (
        let i = 0;
        i < 16;
        i++
    ) {

        const controlBit =
            (i >> control) & 1;


        if (!controlBit)
            continue;


        const targetBit =
            (i >> target) & 1;


        if (targetBit)
            continue;


        const j =
            i |
            (1 << target);


        [
            quantum.real[i],
            quantum.real[j]
        ] =
        [
            quantum.real[j],
            quantum.real[i]
        ];


        [
            quantum.imag[i],
            quantum.imag[j]
        ] =
        [
            quantum.imag[j],
            quantum.imag[i]
        ];

    }

}


/* ============================================================
   PQC INFERENCE
   ============================================================ */

function runPQC(
    embedding
) {

    const quantum =
        createQuantumState();


    for (
        let q = 0;
        q < 4;
        q++
    ) {

        const value =
            embedding[q] ||
            0;


        applyRY(
            quantum,
            q,
            value *
            Math.PI
        );

    }


    applyCNOT(
        quantum,
        0,
        1
    );


    applyCNOT(
        quantum,
        1,
        2
    );


    applyCNOT(
        quantum,
        2,
        3
    );


    for (
        let q = 0;
        q < 4;
        q++
    ) {

        applyRZ(
            quantum,
            q,
            (
                embedding[
                    q + 4
                ] ||
                0
            ) *
            Math.PI
        );

    }


    const probabilities =
        quantum.real.map(
            (real, index) => {

                const imag =
                    quantum.imag[index];


                return (
                    real * real +
                    imag * imag
                );

            }
        );


    let maxIndex = 0;


    for (
        let i = 1;
        i < probabilities.length;
        i++
    ) {

        if (
            probabilities[i] >
            probabilities[maxIndex]
        ) {

            maxIndex = i;

        }

    }


    const maxProbability =
        probabilities[maxIndex];


    const entropy =
        probabilities.reduce(
            (
                sum,
                probability
            ) => {

                if (
                    probability <=
                    1e-12
                )
                    return sum;


                return sum -
                    probability *
                    Math.log2(
                        probability
                    );

            },
            0
        );


    return {

        state:
            "|" +
            maxIndex
                .toString(2)
                .padStart(4, "0") +
            "⟩",

        probability:
            maxProbability,

        entropy,

        score:
            Math.round(
                maxProbability *
                100
            ),

        probabilities,

        quantum

    };

}


/* ============================================================
   IMAGE INPUT
   ============================================================ */

function readImage(
    file
) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const reader =
                new FileReader();


            reader.onload =
                event => {

                    const image =
                        new Image();


                    image.onload =
                        () =>
                            resolve(
                                image
                            );


                    image.onerror =
                        reject;


                    image.src =
                        event.target.result;

                };


            reader.onerror =
                reject;


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* ============================================================
   BASELINE IMAGE
   ============================================================ */

$("baselineUpload")
    ?.addEventListener(
        "change",
        async event => {

            const file =
                event.target.files?.[0];


            if (!file)
                return;


            state.baseline =
                await readImage(
                    file
                );


            showToast(
                "Baseline image loaded"
            );

        }
    );


/* ============================================================
   CURRENT IMAGE
   ============================================================ */

$("currentUpload")
    ?.addEventListener(
        "change",
        async event => {

            const file =
                event.target.files?.[0];


            if (!file)
                return;


            state.current =
                await readImage(
                    file
                );


            showToast(
                "Current image loaded"
            );

        }
    );


/* ============================================================
   INITIALIZE
   ============================================================ */

switchView(
    "explorer"
);


$("selectedYear")
    .textContent =
    "2026";


$("riskValue")
    .textContent =
    "24";


$("riskProgress")
    .style.width =
    "24%";


/*
   Load the CNN lazily so the Earth can
   appear immediately.
*/

setTimeout(
    loadCNNModel,
    700
);


/*
   Start realistic Earth.
*/

initializeEarth();


});