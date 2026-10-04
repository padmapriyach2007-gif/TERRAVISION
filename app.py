import streamlit as st
import streamlit.components.v1 as components
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

# Remove the original stylesheet reference because we inject
# the CSS directly into the HTML.
html = html.replace(
    '<link rel="stylesheet" href="style.css">',
    ""
)

# Remove the original JavaScript reference because we inject
# the JavaScript directly into the HTML.
html = html.replace(
    '<script type="module" src="script.js"></script>',
    ""
)

# Inject CSS before </head>
html = html.replace(
    "</head>",
    f"""
    <style>
    {css}
    </style>
    </head>
    """
)

# Inject JavaScript before </body>
html = html.replace(
    "</body>",
    f"""
    <script type="module">
    {js}
    </script>
    </body>
    """
)


# ============================================================
# STREAMLIT UI
# ============================================================

components.html(
    html,
    height=1200,
    scrolling=True,
)
