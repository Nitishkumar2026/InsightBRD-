# 🧠 InsightBRD+: Product & Technical Overview

InsightBRD+ is an intelligent **SaaS platform** designed to bridge the gap between stakeholder communication and formal requirement documentation. It uses AI to extract, analyze, and resolve contradictions in complex projects.

---

## 🏗️ 1. Core Modules (What does each part do?)

### 📊 **Integrated Dashboard**
- **Purpose**: A "Command Center" view of project health.
- **Key Features**:
  - **KPIs**: Quick stats on total requirements, active conflicts, and overall project sentiment.
  - **Conflict Heatmap**: A visual grid showing which stakeholders have the most "friction" (disagreements).
- **Why it matters**: It allows leadership to identify communication bottlenecks in seconds rather than reading hundreds of emails.

### 📥 **Ingestion Pipeline**
- **Purpose**: The "Entry Point" for all data.
- **Connectors**: Slack, Gmail, PDF uploads, and Meeting Transcripts.
- **Technical Action**: When a file/message is ingested, the **AI Pipeline** triggers to parse the text.
- **Why it matters**: No more manual copying and pasting from Slack to Jira.

### 📁 **Requirements Repository**
- **Purpose**: The "Single Source of Truth."
- **Functionality**: Every extracted requirement is stored here with metadata (Priority, Category, Source).
- **Why it matters**: It provides a searchable database of every "promise" or "need" mentioned by any stakeholder.

### ⚔️ **Conflict Engine**
- **Purpose**: The "Resolver."
- **How it works**: It compares requirements from different stakeholders. If Stakeholder A says "The button must be Red" and Stakeholder B says "The button must be Blue," it flags a **Conflict**.
- **Resolution**: AI suggests a "Middle Ground" or highlights the trade-offs.

### 🎭 **Sentiment & Stakeholder Analysis**
- **Purpose**: Tracking the "Human Element."
- **Sentiment**: Monitors if a stakeholder sounds frustrated, happy, or uncertain.
- **Influence Mapping**: Identifies which stakeholders have the most power over the project's direction.

---

## ⚙️ 2. How it Works (Technical Architecture)

### **The Data Lifecycle**
1.  **Ingestion**: RAW text data enters the system.
2.  **AI Extraction**: We use LLMs (GPT/Claude) to identify "Requirements" (e.g., "Must have SSO").
3.  **Analysis**: The engine calculates:
    - **Priority Score (0-10)**: How critical is this?
    - **Sentiment Score (-1 to 1)**: Is the tone positive or negative?
    - **Mapping**: Connecting the requirement to a specific stakeholder.
4.  **Vector Comparison**: Requirements are converted into "Vectors" (mathematical representations). If two vectors are close in meaning but opposite in intent, a conflict is detected.

### **The Tech Stack**
- **Frontend**: **Next.js 15 (Turbopack)** + **Tailwind CSS v4**.
- **Backend**: **FastAPI** (Python). Fast and asynchronous.
- **Database**:
  - **Relational (SQLite/PostgreSQL)**: Stores users, projects, and requirements.
  - **Graph (Neo4j)**: Maps the complex relationships between stakeholders and requirements.

---

## 🔗 3. Connectivity (Why & How things are connected)

### **Why Connect Slack/Gmail?**
Requirements aren't just found in formal documents; they are hidden in daily chats. By connecting these, InsightBRD+ ensures **nothing is missed**.

### **How is the AI connected?**
The backend sends raw text to an AI Service. The response is "Structured JSON" which is then saved to our database and displayed on your frontend.

### **Why the Conflict -> Sentiment connection?**
A project with many conflicts often leads to negative stakeholder sentiment. By connecting these, we can predict if a project is going to fail before it actually happens.

---

## 🎯 4. The Value Proposition (The "Big Idea")
InsightBRD+ solves the **"Communication Gap."** In large enterprises, 70% of project failures are due to poor requirements. This tool uses AI to act as an automated "Business Analyst" that works 24/7 to keep everyone on the same page.
