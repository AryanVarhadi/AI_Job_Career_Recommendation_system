# src/job_api.py
import os
import requests
import concurrent.futures
from dotenv import load_dotenv
from src.helper import ask_gemini

load_dotenv()

APIFY_API_TOKEN = os.getenv("APIFY_API_KEY")
SERP_API_KEY = os.getenv("SERP_API_KEY")

APIFY_ACTORS = {
    "linkedin": "BHzefUZlZRKWxkTck",
    "naukri": "GLb4E7UrStD7XLJxO",
}


def fetch_from_apify(actor_id, query):
    """Fetch jobs safely and quickly from Apify"""
    if not APIFY_API_TOKEN:
        print("⚠️ APIFY_API_TOKEN not set. Skipping Apify fetch.")
        return []

    try:
        url = f"https://api.apify.com/v2/acts/{actor_id}/run-sync-get-dataset-items"
        params = {"token": APIFY_API_TOKEN}
        payload = {"searchQuery": query}

        response = requests.post(url, params=params, json=payload, timeout=25)
        response.raise_for_status()
        data = response.json()

        jobs = []
        for item in data:
            title = item.get("title") or item.get("jobTitle") or "Untitled Job"
            company = item.get("company") or item.get("companyName") or "Unknown"
            link = item.get("url") or item.get("jobUrl") or ""
            location = item.get("location") or "Not specified"

            if any(word in title.lower() for word in ["developer", "engineer", "software", "it", "intern", "data", "ai", "ml", "python", "web"]):
                jobs.append({
                    "title": title.strip(),
                    "company": company.strip(),
                    "location": location.strip(),
                    "link": link.strip(),
                    "source": "Apify"
                })
        return jobs

    except requests.Timeout:
        print(f"⏱️ Timeout for {actor_id}, skipping...")
        return []
    except Exception as e:
        print(f"⚠️ Apify fetch error ({actor_id}): {e}")
        return []


def fetch_google_jobs(query):
    """Fallback using SerpApi or Google Search"""
    try:
        if not SERP_API_KEY:
            google_url = f"https://www.google.com/search?q={query.replace(' ', '+')}+site:linkedin.com/jobs OR site:naukri.com"
            return [{"title": f"{query} (Google Fallback)", "company": "Unknown", "location": "Online", "link": google_url, "source": "Google"}]

        serp_url = f"https://serpapi.com/search.json?engine=google_jobs&q={query}&api_key={SERP_API_KEY}"
        r = requests.get(serp_url, timeout=15)
        data = r.json()
        jobs = []
        for job in data.get("jobs_results", []):
            jobs.append({
                "title": job.get("title", "Untitled Job"),
                "company": job.get("company_name", "Unknown"),
                "location": job.get("location", "Not specified"),
                "link": job.get("apply_link", job.get("link", "")),
                "source": "Google"
            })
        return jobs
    except Exception as e:
        print(f"⚠️ Google fallback error: {e}")
        return []


def fetch_jobs_from_resume(resume_text):
    """Extract job keywords and fetch jobs in parallel"""
    print("🧠 Extracting relevant job keywords from resume using Gemini...")
    prompt = f"""
    You are an AI career expert. Based on this resume text, extract the 8 most suitable IT job titles.
    Resume: {resume_text}
    Output them as a clean comma-separated list (e.g. "Frontend Developer, Python Developer, Data Analyst, ...")
    """
    extracted_text = ask_gemini(prompt)
    print(f"Extracted Job Keywords: {extracted_text}")

    if not extracted_text.strip():
        extracted_text = "Software Engineer, Web Developer, Python Developer, Data Analyst"

    job_keywords = [kw.strip() for kw in extracted_text.split(",") if kw.strip()]
    all_jobs = []

    def fetch_for_keyword(keyword):
        linkedin_jobs = fetch_from_apify(APIFY_ACTORS["linkedin"], keyword)
        naukri_jobs = fetch_from_apify(APIFY_ACTORS["naukri"], keyword)
        combined = linkedin_jobs + naukri_jobs
        if not combined:
            combined = fetch_google_jobs(keyword)
        filtered = [
            j for j in combined
            if any(w in j['title'].lower() for w in ["developer", "engineer", "it", "software", "data", "python", "ai", "ml", "web"])
        ]
        return filtered

    # 🔹 Run in parallel (up to 6 threads)
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
        futures = [executor.submit(fetch_for_keyword, kw) for kw in job_keywords]
        for f in concurrent.futures.as_completed(futures):
            try:
                all_jobs.extend(f.result())
            except Exception as e:
                print(f"⚠️ Thread fetch error: {e}")

    # Remove duplicates
    unique = []
    seen = set()
    for job in all_jobs:
        if job["link"] not in seen:
            seen.add(job["link"])
            unique.append(job)

    return unique
