# AI Resume Analyzer & Job Recommendation System

## 📌 Overview

AI Resume Analyzer & Job Recommendation System is a full-stack web application that helps users create professional resumes, analyze them using Artificial Intelligence, identify skill gaps, and receive real-time job recommendations based on their profile.

The platform simplifies the job application process by combining resume building, AI-powered career guidance, and job discovery into a single system.

---

## 🚀 Features

### 📝 Resume Builder
- Create professional resumes using a user-friendly form interface
- Add personal information, education, experience, and skills
- Real-time resume preview
- Modern resume template

### 📄 PDF Resume Generation
- Download resumes as PDF
- Professional formatting
- Print-friendly layout

### 🤖 AI Resume Analysis
- Resume summary generation
- Skill gap detection
- Career roadmap suggestions
- Personalized improvement recommendations

### 💼 Job Recommendation System
- AI extracts suitable job roles from the resume
- Fetches real job opportunities using APIs
- Displays job title, company, location, and application links
- Direct redirection to job application pages

### 🔐 Authentication
- Secure user authentication using Clerk
- User session management
- Protected routes

### 🌙 Dark Mode
- Global light/dark theme support
- Professional UI design

---

## 🏗️ System Architecture

User → Resume Builder → MongoDB

↓

AI Analysis (OpenRouter LLM)

↓

Skill Gap Detection & Career Roadmap

↓

Job Role Extraction

↓

RapidAPI (JSearch)

↓

Job Recommendations

---

## 🛠️ Technology Stack

### Frontend
- React.js
- React Router DOM
- Tailwind CSS
- ShadCN UI
- Axios
- Clerk Authentication

### Backend
- Python
- FastAPI
- Uvicorn

### Database
- MongoDB

### AI Integration
- OpenRouter API
- LLM-Based Resume Analysis

### Job Search API
- RapidAPI JSearch

### PDF Generation
- jsPDF
- html2canvas

---

## 📂 Project Modules

### 1. Authentication Module
Handles:
- User Registration
- User Login
- Session Management

### 2. Resume Builder Module
Handles:
- Personal Information
- Education Details
- Experience Details
- Skills Management

### 3. Resume Preview Module
Handles:
- Dynamic Resume Rendering
- PDF Generation

### 4. AI Analysis Module
Handles:
- Resume Summary
- Skill Gap Analysis
- Career Recommendations

### 5. Job Recommendation Module
Handles:
- Job Role Extraction
- Real-Time Job Search
- Application Links

---

## 📊 Workflow

### Step 1
User logs into the system.

### Step 2
User creates a professional resume.

### Step 3
Resume data is stored in MongoDB.

### Step 4
User uploads or analyzes the resume.

### Step 5
AI generates:
- Resume Summary
- Skill Gap Analysis
- Career Roadmap

### Step 6
AI extracts suitable job roles.

### Step 7
Jobs are fetched using RapidAPI JSearch.

### Step 8
Recommended jobs are displayed with application links.

---

## 🎯 Advantages

- Easy resume creation
- AI-powered career guidance
- Skill gap identification
- Real-time job recommendations
- Professional PDF generation
- Responsive UI
- Secure authentication

---

## 🔮 Future Enhancements

- ATS Score Calculation
- Interview Preparation Module
- Resume Templates Marketplace
- Salary Prediction
- Job Filtering by Location and Package
- AI Cover Letter Generator
- LinkedIn Profile Analyzer

---

## 👨‍💻 Developed By

Aryan Varhadi

Bachelor of Engineering (Information Technology)

Atharva College of Engineering, Mumbai University

Academic Year: 2025-26

---

## 📜 License

This project is developed for educational and academic purposes as a Final Year Engineering Major Project.
