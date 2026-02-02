# Job Sync – Smart Gmail-Powered Job Application Tracker
<img width="1470" height="645" alt="image" src="https://github.com/user-attachments/assets/5b8af6b5-7c9a-4f7d-b842-6c433ee0738f" />

Job Sync is a web application that automatically tracks your job applications by securely syncing with your Gmail inbox. It detects application confirmation emails, extracts relevant job details, and organizes them into a structured dashboard reducing the need for manual tracking.

The application combines **rule-based email parsing** with **AI-assisted extraction** to identify job applications, while still allowing full manual control.

---

## ✨ Key Features

### 🔐 Secure Gmail Integration
- Connects to Gmail using **Google OAuth 2.0**
- Requests **read-only email access**
- Clearly displays Google’s consent screen before access is granted
- Tokens are securely stored and refreshed automatically

---

### 📥 Automatic Job Application Sync
- Scans recent Gmail messages
- Detects job application confirmation emails (Indeed, company ATS, etc.)
- Extracts:
  - Company name  
  - Job title  
  - Application status (e.g., *Applied*)

---

### 📊 Centralized Dashboard
- View all job applications in one place
- See application status, confidence level, and last activity
- Automatically updated when new emails arrive

<img width="1470" height="623" alt="image" src="https://github.com/user-attachments/assets/476429fe-b96c-48f3-a062-29a763aaadb9" />

---

### 📝 Single Job View
- Detailed view for each job application
- Shows extracted data and internal notes
- Useful for reviewing auto-detected entries

[<img width="1470" height="691" alt="image" src="https://github.com/user-attachments/assets/83a34509-b4a7-4c21-aedb-54b62f6d919e" />
](https://res.cloudinary.com/ddwinmcui/image/upload/v1769959787/image2_cie1sr.png)
---

### ✍️ Manual Job Entry
- Users can manually add job applications
- Helpful when:
  - An email was missed
  - A job was applied via a portal without email confirmation

---

## 🤖 AI-Assisted Parsing (Current State)

The system uses a **hybrid approach**:
- **Heuristic-based parsing** for known email formats (e.g., Indeed)
- **AI fallback parsing** for low-confidence or ambiguous emails

### Current Limitations
- AI parsing is rate-limited due to daily API limits
- When the AI budget is exhausted:
  - Some recommendation emails may be incorrectly classified as “Applied”
  - Heuristic parsing continues to function

This behavior is **intentional and visible**, not silent.

---

## 🧠 Planned Improvements (Roadmap)

To reduce dependency on third-party AI and improve precision:

- Build a **lightweight in-house email classifier**
- Approach:
  - Label 500–1,000 emails into:
    - Applied
    - Recommendation
    - Other
  - Focus on emails most commonly misclassified
  - Apply sender + subject heuristics to reduce noise
  - Train a baseline **Logistic Regression + TF-IDF** classifier
  - Use active learning to iteratively improve precision

---

## 🛠 Tech Stack (Frontend)

- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **Axios**
- **ShadCN UI**
- **Google OAuth Redirect Flow**

---

## 🚧 Project Status

- Gmail sync: ✅ Working
- Job detection: ✅ Working
- Manual job entry: ✅ Working
- AI parsing: ⚠️ Limited by daily quota
- Recommendation vs applied differentiation: 🚧 In progress

---

## 🔒 Privacy & Security

- Emails are **never modified**
- Gmail access is **read-only**
- Tokens are securely handled on the backend
- No email content is shared or sold

---

## 📄 License

MIT License
