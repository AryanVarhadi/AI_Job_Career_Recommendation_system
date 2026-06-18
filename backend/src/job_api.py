# src/job_api.py
import os
import requests
import concurrent.futures
from dotenv import load_dotenv
from src.helper import ask_ai

load_dotenv()

RAPID_API_KEY = os.getenv("RAPID_API_KEY")
SERP_API_KEY = os.getenv("SERP_API_KEY")


# ================================
# 🔥 JSEARCH API (PRIMARY - IMPROVED)
# ================================
def fetch_jsearch_jobs(query):
    try:
        url = "https://jsearch.p.rapidapi.com/search"

        headers = {
            "X-RapidAPI-Key": RAPID_API_KEY,
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        }

        # 🔥 FIX: better query (Indeed heavy results)
        params = {
            "query": f"{query} jobs in India",
            "page": "1",
            "num_pages": "2",  # 🔥 more jobs
        }

        res = requests.get(url, headers=headers, params=params, timeout=15)
        data = res.json()

        jobs = []

        for job in data.get("data", []):
            link = job.get("job_apply_link")

            if not link:
                continue

            jobs.append(
                {
                    "title": job.get("job_title"),
                    "company": job.get("employer_name"),
                    "location": job.get("job_city") or "Not specified",
                    "link": link,
                    "source": "Indeed/JSearch",  # 🔥 clarified
                }
            )

        return jobs

    except Exception as e:
        print("JSearch error:", e)
        return []


# ================================
# 🌐 GOOGLE FALLBACK (IMPROVED)
# ================================
def fetch_google_jobs(query):
    try:
        # 🔥 FIX: direct Indeed search instead of generic Google
        url = f"https://www.indeed.com/jobs?q={query.replace(' ', '+')}"

        return [
            {
                "title": query,
                "company": "Various",
                "location": "Online",
                "link": url,
                "source": "Indeed (Fallback)",
            }
        ]

    except Exception as e:
        print("Google error:", e)
        return []


# ================================
# 🤖 EXTRACT KEYWORDS (STABLE)
# ================================
def extract_keywords(resume_text):
    try:
        prompt = f"""
        Extract 5 strong and popular IT job roles from this resume.

        Rules:
        - Avoid generic roles like "IT Engineer"
        - Prefer roles like:
          Software Developer, Frontend Developer, Backend Developer, Full Stack Developer, React Developer
        - Avoid only internships unless clearly mentioned

        Return only comma separated values.

        Resume:
        {resume_text}
        """

        result = ask_ai(prompt)

        keywords = [k.strip() for k in result.split(",") if k.strip()]

        # 🔥 FIX: fallback if AI weak
        if len(keywords) < 3:
            return [
                "Software Developer",
                "Frontend Developer",
                "React Developer",
                "Full Stack Developer",
                "Python Developer",
            ]

        return keywords[:5]

    except Exception as e:
        print("Keyword error:", e)
        return [
            "Software Developer",
            "Frontend Developer",
            "Full Stack Developer",
        ]


# ================================
# 💼 MAIN FUNCTION
# ================================
def fetch_jobs_from_resume(resume_text):
    print("🔍 Fetching jobs...")

    job_keywords = extract_keywords(resume_text)

    print("Keywords:", job_keywords)  # 🔥 DEBUG

    all_jobs = []

    def fetch_for_keyword(keyword):
        jobs = fetch_jsearch_jobs(keyword)

        # 🔥 fallback if API fails
        if not jobs:
            jobs = fetch_google_jobs(keyword)

        return jobs

    # 🔥 PARALLEL FETCH
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(fetch_for_keyword, kw) for kw in job_keywords]

        for f in concurrent.futures.as_completed(futures):
            try:
                all_jobs.extend(f.result())
            except Exception as e:
                print("Thread error:", e)

    # 🔥 REMOVE DUPLICATES
    unique = []
    seen = set()

    for job in all_jobs:
        link = job.get("link")

        if link and link not in seen:
            seen.add(link)
            unique.append(job)

    return unique[:20]  # 🔥 max 20 jobs
