# src/helper.py
import os
import time
from io import BytesIO
from dotenv import load_dotenv
import google.generativeai as genai
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

# Try importing PyMuPDF safely
try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None

# Load environment variables
load_dotenv()

# Configure Gemini API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
    except Exception as e:
        print(f"⚠️ Could not configure Gemini API: {e}")


def extract_text_from_pdf(uploaded_file):
    """Extract text from a PDF file and return it as a string."""
    if fitz is None:
        print("⚠️ PyMuPDF not installed. Please install using: pip install PyMuPDF")
        return "⚠️ PDF reader not available."

    try:
        data = uploaded_file.read()
        doc = fitz.open(stream=data, filetype="pdf")
        text_parts = [page.get_text("text") for page in doc]
        text = "\n".join(text_parts).strip()
        return text if text else "⚠️ No text extracted from PDF."
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return "⚠️ Unable to read the PDF file."


def ask_gemini(prompt, retries=3):
    """Send a prompt to Gemini API and return the response text."""
    if not GEMINI_API_KEY:
        return "⚠️ Gemini API key not configured."

    model_name = "models/gemini-2.5-flash"
    for attempt in range(retries):
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)
            return response.text.strip() if response and hasattr(response, "text") else "⚠️ No response generated."
        except Exception as e:
            err = str(e)
            print(f"Error in ask_gemini (attempt {attempt + 1}): {err}")
            if "429" in err or "quota" in err.lower():
                time.sleep(10)
                continue
            return "⚠️ AI service temporarily unavailable. Please try again later."
    return "⚠️ The AI service is temporarily unavailable. Please try again later."


def generate_pdf_report(summary, gaps, roadmap, out_path=None):
    """Generate a professional PDF report of the resume analysis."""
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
        max_width = 85
        content = (content or "").replace("*", "")

        for para in content.split("\n"):
            line = para.strip()
            while len(line) > max_width:
                text_obj.textLine(line[:max_width])
                line = line[max_width:]
            if line:
                text_obj.textLine(line)
            text_obj.textLine("")

        c.drawText(text_obj)

    y = height - 100
    write_section("📄 Resume Summary:", summary, y)
    c.showPage()
    write_section("🛠️ Skill Gaps & Missing Areas:", gaps, height - 80)
    c.showPage()
    write_section("🚀 Future Roadmap & Preparation Strategy:", roadmap, height - 80)

    c.save()
    buffer.seek(0)

    if out_path:
        with open(out_path, "wb") as f:
            f.write(buffer.read())
        return out_path
    return buffer
