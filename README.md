# Meridian Staffing Assistant

A production-deployed AI staffing assistant for Meridian Home Health. The assistant answers staffing questions using live Meridian API data across HR, Scheduling, Credentialing, and Facilities systems.

## Production URL

**HTTPS:** https://54-67-130-19.sslip.io

Authentication is required before accessing the assistant.

## Architecture

```mermaid
flowchart TD
    Reviewer["Reviewer / Staffing Coordinator"]
    Browser["Web Browser"]
    SSLIP["sslip.io hostname<br/>54-67-130-19.sslip.io"]
    Caddy["Caddy Reverse Proxy<br/>HTTPS / TLS<br/>Basic Authentication"]
    Next["Next.js Application<br/>127.0.0.1:3000"]
    PM2["PM2 Process Manager<br/>Unattended service"]
    Chat["/api/chat<br/>Server-side API route"]
    Meridian["Meridian API"]
    HR["HR"]
    Scheduling["Scheduling"]
    Credentialing["Credentialing"]
    Facilities["Facilities"]
    OpenRouter["OpenRouter API"]
    Env[".env.local<br/>Server-side secrets"]

    Reviewer --> Browser
    Browser -->|"HTTPS :443"| SSLIP
    SSLIP --> Caddy
    Caddy -->|"Authenticated request"| Next
    PM2 -->|"Keeps service running"| Next
    Next --> Chat

    Chat -->|"Bearer API key"| Meridian
    Meridian --> HR
    Meridian --> Scheduling
    Meridian --> Credentialing
    Meridian --> Facilities

    Chat -->|"Server-side API key"| OpenRouter
    Env -.->|"Secrets available only on server"| Chat

    Security["Security safeguards<br/>• HTTPS/TLS<br/>• Basic Authentication<br/>• API keys never sent to browser<br/>• .env.local excluded from Git<br/>• Next.js bound to localhost<br/>• PM2 process supervision"]

    Caddy -.-> Security
    Env -.-> Security
    PM2 -.-> Security
