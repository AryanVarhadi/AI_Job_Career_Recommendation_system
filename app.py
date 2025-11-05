import streamlit as st
from src.helper import extract_text_from_pdf, ask_gemini, generate_pdf_report
from src.job_api import fetch_jobs_from_resume
import pyttsx3
import threading

st.set_page_config(page_title="AI Career and Job Recommendation", page_icon="🧑🏻‍🎓", layout="wide")

# ---------- THEME TOGGLE ----------
theme_choice = st.sidebar.radio("Theme", ["Dark", "Light"], index=0)
if theme_choice == "Dark":
    st.markdown("""
        <style>
        html, body, .stApp { background-color:#0b0f14 !important; color:#e6eef6 !important; }
        .stButton>button { cursor:pointer; }
        </style>
    """, unsafe_allow_html=True)
else:
    st.markdown("""
        <style>
        html, body, .stApp { background-color:#ffffff !important; color:#0b0b0b !important; }
        .stButton>button { cursor:pointer; }
        .resume-box { background-color:#f7f7f7 !important; color:#000 !important; }
        </style>
    """, unsafe_allow_html=True)

st.title("📄 AI Career and Job Recommendation")
st.markdown("Upload your resume and get AI-based analysis with job recommendations from LinkedIn and Naukri.")

# ---------- GLOBAL STATE ----------
_tts_state = {"thread": None, "stop_event": None}
for key in ["resume_text", "summary", "gaps", "roadmap", "tts_playing", "tts_chunks", "jobs", "keywords"]:
    if key not in st.session_state:
        st.session_state[key] = None if key not in ["tts_playing"] else False


# ---------- TEXT SPLITTER ----------
def split_text(text, chunk_size=180):
    words = text.split()
    return [" ".join(words[i:i + chunk_size]) for i in range(0, len(words), chunk_size)]


# ---------- TTS THREAD ----------
def _speak_chunks_worker(chunks, stop_event):
    engine = pyttsx3.init()
    engine.setProperty("rate", 170)
    for chunk in chunks:
        if stop_event.is_set():
            break
        try:
            engine.say(chunk)
            engine.runAndWait()
        except Exception:
            engine = pyttsx3.init()
            engine.setProperty("rate", 170)
    engine.stop()


# ---------- STEP 1: UPLOAD RESUME ----------
uploaded_file = st.file_uploader("📤 Upload your resume (PDF)", type=["pdf"])
if uploaded_file and not st.session_state.resume_text:
    with st.spinner("🔍 Extracting text from your resume..."):
        st.session_state.resume_text = extract_text_from_pdf(uploaded_file)

    with st.spinner("🧠 Analyzing your resume..."):
        st.session_state.summary = ask_gemini(
            f"Summarize this resume highlighting key skills, education, and experience:\n\n{st.session_state.resume_text}"
        )
        st.session_state.gaps = ask_gemini(
            f"Identify missing skills or certifications for this candidate:\n\n{st.session_state.resume_text}"
        )
        st.session_state.roadmap = ask_gemini(
            f"Suggest a short future roadmap to improve career growth based on this resume:\n\n{st.session_state.resume_text}"
        )

# ---------- STEP 2: SHOW ANALYSIS ----------
if st.session_state.summary:
    st.markdown("---")
    st.header("📑 Resume Summary")
    st.info(st.session_state.summary)

    st.header("🛠️ Skill Gaps & Missing Areas")
    st.warning(st.session_state.gaps)

    st.header("🚀 Future Roadmap & Preparation Strategy")
    st.success(st.session_state.roadmap)
    st.success("✅ Resume Analysis Completed Successfully!")

    # ---------- TEXT-TO-SPEECH ----------
    tts_text = f"Resume Summary: {st.session_state.summary}. Skill Gaps: {st.session_state.gaps}. Future Roadmap: {st.session_state.roadmap}."
    if not st.session_state.tts_chunks:
        st.session_state.tts_chunks = split_text(tts_text)

    tts_label = "🔊 Play Audio" if not st.session_state.tts_playing else "🔇 Stop Audio"
    if st.button(tts_label):
        if not st.session_state.tts_playing:
            stop_event = threading.Event()
            _tts_state["stop_event"] = stop_event
            th = threading.Thread(target=_speak_chunks_worker, args=(st.session_state.tts_chunks, stop_event), daemon=True)
            th.start()
            _tts_state["thread"] = th
            st.session_state.tts_playing = True
        else:
            if _tts_state.get("stop_event"):
                _tts_state["stop_event"].set()
            st.session_state.tts_playing = False

    # ---------- DOWNLOAD PDF ----------
    pdf_buffer = generate_pdf_report(st.session_state.summary, st.session_state.gaps, st.session_state.roadmap)
    st.download_button(
        "📥 Download Resume Analysis Report",
        data=pdf_buffer.getvalue(),
        file_name="resume_analysis_report.pdf",
        mime="application/pdf"
    )

# ---------- STEP 3: JOB RECOMMENDATIONS ----------
if st.session_state.summary and st.button("🔎 Get Job Recommendations"):
    if _tts_state.get("stop_event"):
        _tts_state["stop_event"].set()
    st.session_state.tts_playing = False

    with st.spinner("🧩 Extracting job keywords..."):
        st.session_state.keywords = ask_gemini(
            f"Based on this resume summary, list 8–10 ideal IT job titles (comma-separated):\n\n{st.session_state.summary}"
        ).replace("\n", "").strip()

    st.success(f"**Extracted Job Keywords:** {st.session_state.keywords}")

    with st.spinner("🌐 Fetching best matching IT jobs..."):
        st.session_state.jobs = fetch_jobs_from_resume(st.session_state.keywords)

    st.markdown("---")
    st.header("💼 Recommended Jobs Based on Your Resume")

    if st.session_state.jobs:
        for job in st.session_state.jobs:
            title = job.get("title", "Untitled Job")
            company = job.get("company", "Unknown")
            location = job.get("location", "Not specified")
            link = job.get("link") or f"https://www.google.com/search?q={title.replace(' ', '+')}+{company.replace(' ', '+')}+jobs"
            st.markdown(f"""
            <div style='background-color:#1a1d21; padding:15px; border-radius:10px; margin-bottom:12px; color:white;'>
                <h4>{title}</h4>
                <p><b>{company}</b> | 📍 {location}</p>
                <a href="{link}" target="_blank" style='background-color:#0A66C2; color:white; padding:8px 12px; border-radius:6px; text-decoration:none;'>🔗 View Job</a>
            </div>
            """, unsafe_allow_html=True)
    else:
        st.warning("⚠️ No IT jobs found. Try re-uploading a more detailed resume or check your keywords.")
