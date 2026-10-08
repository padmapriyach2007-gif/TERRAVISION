import streamlit as st  # type: ignore
import streamlit.components.v1 as components  # type: ignore
from pathlib import Path


# ============================================================
# PAGE CONFIGURATION
# ============================================================

st.set_page_config(
    page_title="TerraVision — Quantum Earth Intelligence",
    page_icon="🌍",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# Streamlit container styling: eliminate default padding, margins,
# and scrollbars so the dashboard fits 100% within the viewport.
st.markdown(
    """
    <style>
    /* Remove default Streamlit header, footer, and margin clipping */
    #MainMenu, header, footer, .stApp > header {
        display: none !important;
    }
    html, body, .stApp,
    div[data-testid="stAppViewContainer"],
    div[data-testid="stAppViewBlockContainer"],
    section[data-testid="stMain"],
    div[data-testid="stVerticalBlock"],
    div[data-testid="stCustomComponentV1"],
    .block-container {
        padding: 0 !important;
        margin: 0 !important;
        width: 100% !important;
        max-width: 100vw !important;
        box-sizing: border-box !important;
        overflow-x: hidden !important;
    }
    iframe {
        border: none !important;
        width: 100% !important;
        max-width: 100vw !important;
        min-height: 100vh !important;
        height: 100vh !important;
        display: block !important;
    }
    </style>
    """,
    unsafe_allow_html=True,
)


# ============================================================
# LOAD EXISTING FRONTEND FILES
# ============================================================

BASE_DIR = Path(__file__).parent

html_file = BASE_DIR / "index.html"
css_file = BASE_DIR / "style.css"
js_file = BASE_DIR / "script.js"


if not html_file.exists():
    st.error("index.html was not found.")
    st.stop()

if not css_file.exists():
    st.error("style.css was not found.")
    st.stop()

if not js_file.exists():
    st.error("script.js was not found.")
    st.stop()


html = html_file.read_text(encoding="utf-8")
css = css_file.read_text(encoding="utf-8")
js = js_file.read_text(encoding="utf-8")


# ============================================================
# PREPARE HTML FOR STREAMLIT
# ============================================================

# 1. Remove the external stylesheet link tags
html = html.replace('<link rel="stylesheet" href="style.css">', '')
html = html.replace('<link rel="stylesheet" href="./style.css">', '')

# 2. Remove the external script link tags
html = html.replace('<script src="script.js"></script>', '')
html = html.replace('<script src="./script.js"></script>', '')
html = html.replace('<script type="module" src="script.js"></script>', '')
html = html.replace('<script type="module" src="./script.js"></script>', '')

# 3. Inject CSS directly before </head>
html = html.replace(
    "</head>",
    f"""
    <style>
    {css}
    </style>
    </head>
    """
)

# 4. Inject JavaScript directly before </body>
html = html.replace(
    "</body>",
    f"""
    <script>
    {js}
    </script>
    </body>
    """
)


# ============================================================
# STREAMLIT UI (MOBILE & DESKTOP ZERO-SCROLL / AUTO-FIT)
# ============================================================

# Version build: 2026-10-04.v17-mobile-full-scroll-unlocked
components.html(
    html,
    height=1000,
    scrolling=True,
)
