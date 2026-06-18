from fastapi import FastAPI, Body, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# 🔥 HELPERS
from src.helper import analyze_resume_text, ask_ai, extract_text_from_pdf
from src.job_api import fetch_jobs_from_resume

# 🔥 MongoDB
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from bson import ObjectId

# ================================
# 🔐 ENV
# ================================
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("❌ MONGO_URI not found in .env")

# ================================
# 🍃 DB CONNECT
# ================================
client = MongoClient(MONGO_URI)
db = client["ai_resume_builder"]
collection = db["resumes"]

print("MongoDB Connected ✅")

# ================================
# 🚀 FASTAPI
# ================================
app = FastAPI()

# ================================
# 🌐 CORS
# ================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ================================
# 📄 MODEL
# ================================
class ResumeData(BaseModel):
    resume_text: str


# ================================
# 🤖 ANALYZE
# ================================
@app.post("/analyze")
def analyze_resume(data: ResumeData):
    try:
        result = analyze_resume_text(data.resume_text)
        return {"analysis": result}
    except Exception as e:
        print("Analyze Error:", e)
        return {"error": "Analysis failed"}


# ================================
# 📄 UPLOAD + AUTO ANALYZE
# ================================
@app.post("/upload-analyze")
async def upload_analyze(file: UploadFile = File(...)):
    try:
        resume_text = extract_text_from_pdf(file.file)

        if not resume_text or "⚠️" in resume_text:
            return {"error": "Invalid resume file"}

        analysis = analyze_resume_text(resume_text)

        return {"analysis": analysis, "resume_text": resume_text}

    except Exception as e:
        print("Upload Analyze Error:", e)
        return {"error": "Upload or analysis failed"}


# ================================
# 💼 JOBS
# ================================
@app.post("/jobs")
def get_jobs(data: ResumeData):
    try:
        keywords = ask_ai(
            f"""
        Extract 3-5 job titles from this resume:

        {data.resume_text}

        Only return comma separated values.
        """
        )

        jobs = fetch_jobs_from_resume(keywords)

        return {"keywords": keywords, "jobs": jobs}

    except Exception as e:
        print("Jobs Error:", e)
        return {"jobs": []}


# ================================
# 💾 CREATE
# ================================
@app.post("/save")
def save_resume(data: dict = Body(...)):
    result = collection.insert_one(data)
    return {"message": "Saved successfully", "id": str(result.inserted_id)}


# ================================
# 📥 GET ALL
# ================================
@app.get("/resumes")
def get_all_resumes():
    data = []
    for item in collection.find():
        item["_id"] = str(item["_id"])
        data.append(item)
    return data


# ================================
# 📥 GET ONE
# ================================
@app.get("/resume/{id}")
def get_resume(id: str):
    try:
        data = collection.find_one({"_id": ObjectId(id)})

        if not data:
            return {"error": "Resume not found"}

        data["_id"] = str(data["_id"])
        return data

    except Exception:
        return {"error": "Invalid ID format"}


# ================================
# ✏️ UPDATE
# ================================
@app.put("/resume/{id}")
def update_resume(id: str, data: dict = Body(...)):
    try:
        result = collection.update_one({"_id": ObjectId(id)}, {"$set": data})

        if result.matched_count == 0:
            return {"error": "Resume not found"}

        return {"message": "Updated successfully"}

    except Exception:
        return {"error": "Invalid ID format"}


# ================================
# ❌ DELETE
# ================================
@app.delete("/resume/{id}")
def delete_resume(id: str):
    try:
        result = collection.delete_one({"_id": ObjectId(id)})

        if result.deleted_count == 0:
            return {"error": "Resume not found"}

        return {"message": "Deleted successfully"}

    except Exception:
        return {"error": "Invalid ID format"}
