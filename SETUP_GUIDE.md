# Gmail aur Slack Real Connection Setup Guide

## 🎯 Overview
Yeh guide aapko step-by-step batayega ki Gmail aur Slack ko real mein kaise connect karein.

---

## 📧 GMAIL CONNECTION SETUP

### Step 1: Google Cloud Console Configuration

1. **Google Cloud Console mein jao**: https://console.cloud.google.com/

2. **Apna project select karo**: "insightBRD-Gmail"

3. **Client Secret nikalo**:
   - Left sidebar → "APIs & Services" → "Credentials"
   - OAuth 2.0 Client ID pe click karo (Client ID: `741523059557-rv23jkrbeamq2q25nrs2ngsm1qh8704a.apps.googleusercontent.com`)
   - Client Secret copy karo

4. **Redirect URIs verify karo**:
   - Authorized redirect URIs mein yeh add karein: `http://localhost:8000/auth/google/callback`

5. **.env file update karo**:
   - `GOOGLE_CLIENT_SECRET=apka_copy_kiya_hua_secret`

---

## 💬 SLACK CONNECTION SETUP

### Step 1: Slack App Create Karo
1. **Slack API jao**: https://api.slack.com/apps
2. "Create New App" pe click karo → "From scratch" select karo.
3. App Name: `InsightBRD` aur workspace select karo.

### Step 2: Permissions (OAuth & Permissions)
1. Sidebar mein "OAuth & Permissions" pe jao.
2. **Redirect URLs** mein yeh add karo: `http://localhost:8000/auth/slack/callback` (Click "Add", then "Save URLs").
3. **Scopes (Bot Token Scopes)** mein yeh permissions add karein:
   - `channels:history`
   - `channels:read`
   - `groups:read`
   - `im:read`
   - `mpim:read`
   - `users:read`

### Step 3: Credentials Copy Karo
1. Sidebar mein "Basic Information" pe jao.
2. "App Credentials" section mein:
   - `App ID` (optional)
   - `Client ID` copy karo.
   - `Client Secret` copy karo.

### Step 4: .env file update karo
- `SLACK_CLIENT_ID=apka_client_id`
- `SLACK_CLIENT_SECRET=apka_client_secret`

---

## 🚀 VERIFICATION

1. **Frontend pe jao**: http://localhost:3000/ingest
2. **Connect Button** pe click karo.
3. Real OAuth flow complete karo.
4. Connection success hone ke baad, backend script se verify kar sakte hain:
   ```bash
   cd backend
   python scripts/test_connections.py
   ```