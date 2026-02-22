# InsightBRD+ 🚀
### AI-Powered Business Requirements Discovery & Alignment Engine

**InsightBRD+** is a next-generation platform designed to eliminate the chaos in software project scoping. By leveraging advanced AI (Gemini), it connects directly into corporate communication channels (Gmail, Slack) to automatically extract, categorize, and cross-reference business requirements in real-time.

---

## 🌟 Vision & Key Innovation
Traditional BRD (Business Requirements Document) creation is slow and manual. **InsightBRD+** changes this by introducing:
- **Neural Ingestion**: Direct data pipelines from Gmail threads and Slack channels.
- **Conflict Engine**: Automated detection of contradictions between stakeholders (e.g., Security vs. Performance).
- **Sentiment Mapping**: Tracking stakeholder emotional response to specific project features.
- **Production-Ready OAuth**: Secure, encrypted token management with automated refresh logic.

---

## 🛠️ Tech Stack
- **Frontend**: Next.js 15+, Tailwind CSS, Framer Motion (Modern Aesthetics)
- **Backend**: FastAPI (Python), SQLAlchemy, Pydantic (High Performance)
- **Intelligence**: Google Gemini Pro (LLM), LangChain
- **Databases**: SQLite (Prototype), Designed for PostgreSQL / Pinecone (Vector)
- **Security**: AES-256 Token Encryption, OAuth 2.0 (Google & Slack)

---

## 📊 Current Project Status

### ✅ Phase 1: Core Engine (Completed)
- [x] **Real Gmail Integration**: Full OAuth2 handshake, real-time email fetching, and body parsing.
- [x] **Real Slack Integration**: Multi-scope authorization for channels, groups, and DMs.
- [x] **AI Requirements Extraction**: Automated mapping of raw text to structured Functional/Non-Functional requirements.
- [x] **Conflict Detection**: Heuristic engine detecting high-severity contradictions in project scope.
- [x] **Interactive Dashboard**: Modern UI with real-time stats and connection status indicators.

### 🚧 Phase 2: Intelligence & Persistence (In Progress)
- [x] **Realistic Conflict Scenarios**: Seeded technical disputes (e.g., *MFA Security vs. UX Friction*) for demonstration.
- [x] **Encrypted Token Management**: Secure storage of refresh/access tokens.
- [/] **Deployment**: GitHub push successfully completed; Frontend optimized for Netlify.

### 📅 Phase 3: Scaling (Upcoming)
- [ ] **Vector Search Integration**: Using Pinecone/Milvus for deep semantic requirement matching.
- [ ] **Multi-User Collaboration**: Live editing and resolution voting for stakeholders.
- [ ] **Automated PDF Export**: Generating professional BRD documents with one click.

---

## 🚀 Getting Started

### 1. Setup Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Configure Credentials
Update `backend/.env` with your:
- `GOOGLE_CLIENT_ID / SECRET`
- `SLACK_CLIENT_ID / SECRET`
- `GOOGLE_API_KEY` (Gemini)

---

## 🛡️ Security First
InsightBRD+ uses industry-standard encryption for all third-party integrations. We do not store plain-text passwords or secret keys. All OAuth tokens are encrypted at rest.

---

**Developed for the Next Generation of Software Architects.**  | [Explore Dashboard](http://localhost:3000)
