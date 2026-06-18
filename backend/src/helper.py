# src/helper.py
import os
from io import BytesIO
from dotenv import load_dotenv
import requests
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

# Try importing PyMuPDF safely
try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None

# Load ENV
load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


# ===========================
# 📄 PDF TEXT EXTRACT
# ===========================
def extract_text_from_pdf(uploaded_file):
    if fitz is None:
        return "⚠️ PyMuPDF not installed."

    try:
        data = uploaded_file.read()
        doc = fitz.open(stream=data, filetype="pdf")
        text = "\n".join([page.get_text("text") for page in doc]).strip()
        return text if text else "⚠️ No text extracted."
    except Exception as e:
        print(f"PDF Error: {e}")
        return "⚠️ Unable to read PDF."


def ask_ai(prompt):
    if not OPENROUTER_API_KEY:
        return "⚠️ OpenRouter API key missing."

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                # 🔥 IMPORTANT (add this)
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "AI Resume Builder",
            },
            json={
                "model": "meta-llama/llama-3-8b-instruct",
                "messages": [{"role": "user", "content": prompt}],
            },
            timeout=30,
        )

        data = response.json()
        print("OpenRouter Response:", data)

        if "choices" in data:
            return data["choices"][0]["message"]["content"].strip()

        if "error" in data:
            print("API Error:", data["error"])
            return "⚠️ AI service unavailable."

        return "⚠️ No response from AI."

    except Exception as e:
        print("AI Error:", e)
        return "⚠️ AI service unavailable."


# ===========================
# 🔥 ONE CALL ANALYSIS
# ===========================
def analyze_resume_text(resume_text):
    prompt = f"""
    Analyze this resume and give output in this format:

    Summary:
    <short summary>

    Skills Missing:
    <missing skills>

    Career Roadmap:
    <step by step roadmap>

    Resume:
    {resume_text}
    """

    return ask_ai(prompt)


# ===========================
# 📄 PDF REPORT
# ===========================
def generate_pdf_report(summary, gaps, roadmap, out_path=None):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    c.setFont("Helvetica-Bold", 18)
    c.drawCentredString(width / 2, height - 60, "Resume Analysis Report")

    def write_section(title, content, y_start):
        c.setFont("Helvetica-Bold", 14)
        c.drawString(50, y_start, title)
        c.setFont("Helvetica", 11)

        text_obj = c.beginText(50, y_start - 25)
        text_obj.setLeading(16)

        for line in (content or "").split("\n"):
            text_obj.textLine(line.strip())

        c.drawText(text_obj)

    y = height - 100
    write_section("Summary", summary, y)
    c.showPage()
    write_section("Skill Gaps", gaps, height - 80)
    c.showPage()
    write_section("Roadmap", roadmap, height - 80)

    c.save()
    buffer.seek(0)

    if out_path:
        with open(out_path, "wb") as f:
            f.write(buffer.read())
        return out_path

    return buffer
