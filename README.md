# Zero Trust Cloud Security — AWS IAM & MFA

> A cloud-based web application demonstrating Zero Trust principles through
> Identity and Access Management (IAM) and Multi-Factor Authentication (MFA)
> on AWS — built as a BSc Cybersecurity & Web Development dissertation at the
> University of Northampton.

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)](https://react.dev/)
[![AWS Amplify](https://img.shields.io/badge/Hosting-AWS%20Amplify-FF9900?logo=amazonaws)](https://aws.amazon.com/amplify/)
[![AWS Cognito](https://img.shields.io/badge/Auth-AWS%20Cognito-FF9900?logo=amazonaws)](https://aws.amazon.com/cognito/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## What This Is

Reported cyber vulnerabilities totalled **40,000 in 2024** — more than double
the figure recorded in 2020. Traditional perimeter-based security models fail
in cloud environments where users, devices, and applications operate beyond
fixed network boundaries.

This project answers one question:

> *How can Zero Trust principles, implemented through AWS IAM and MFA,
> measurably reduce unauthorised access in cloud-based web applications?*

The answer: implement **"never trust, always verify"** — continuously
authenticate every user, enforce least privilege access for every service,
and monitor every login event in real time.

---

## What It Does

| Feature | Implementation |
|---|---|
| TOTP Multi-Factor Authentication | AWS Cognito + Google Authenticator / Authy |
| Role-Based Access Control | AWS IAM Groups — Admin / Developer / Regular User |
| Least Privilege Enforcement | Fine-grained IAM policies per user group |
| Real-Time Security Monitoring | AWS CloudWatch — CognitoSecurityEvents dashboard |
| Brute Force Detection | CloudWatch alarm triggers on 4+ failed logins / 5 min |
| Security HTTP Headers | HSTS, CSP, X-Frame-Options, X-Content-Type-Options |
| Serverless Architecture | AWS Amplify — automated CI/CD pipeline from GitHub |
| Vulnerability Assessed | OWASP ZAP, Nmap, and cURL — pre and post implementation |

---

## Architecture

+-----------------------------------------------------+
|                    USER BROWSER                     |
+------------------+----------------------------------+
                   | HTTPS only (Port 443)
+------------------v----------------------------------+
|              AWS AMPLIFY (Frontend Host)            |
|         React SPA — GitHub CI/CD Pipeline           |
|         Custom Security Headers (customHttp.yml)    |
+------------------+----------------------------------+
                   |
       +-----------+-----------+
       |           |           |
+------v--+  +-----v----+  +---v---------+
|   AWS   |  |   AWS    |  |    AWS      |
| Cognito |  |   IAM    |  | CloudWatch  |
|         |  |          |  |             |
| User    |  | Groups:  |  | Dashboard:  |
| Pools   |  | Admin    |  | Cognito     |
| MFA:    |  | Dev      |  | Security    |
| TOTP    |  | RegUser  |  | Events      |
+---------+  +----------+  +-------------+

---

## How Authentication Works

User enters username + password
          |
          v
    AWS Cognito validates credentials
          |
     +----+----+
     |         |
   Fail       Pass
     |         |
  Error    Prompt for TOTP code
  shown    (Google Authenticator / Authy)
               |
          +----+----+
          |         |
        Fail       Pass
          |         |
       Error    Session token created
       shown    > Redirect to Dashboard

Every login requires two factors — password plus a time-based
code generated offline on the user's device. No exceptions.

---

## Zero Trust Principles Applied

| Principle | How It Is Implemented |
|---|---|
| Never trust, always verify | Every user must pass password + TOTP before accessing anything |
| Least privilege access | IAM users hold only the permissions their role requires |
| Assume breach | Continuous monitoring via CloudWatch; alarms fire on suspicious activity |
| Verify explicitly | MFA enforced for all IAM console users and all Cognito app users |
| Continuous monitoring | Real-time dashboard with geolocation, IP address, and event tracking |

---

## Security Testing Results

Two full vulnerability assessments were conducted — before and after
security hardening — using OWASP ZAP, Nmap, and cURL.

| Severity | Pre-Hardening | Post-Hardening | Change |
|---|---|---|---|
| High | 0 | 0 | No change |
| Medium | 3 | 5 | New CSP directives introduced |
| Low | 4 | 2 | Resolved |
| Informational | 9 | 10 | +1 |
| Total | 16 | 17 | |

Fixing missing security headers introduced new CSP risks. This is
Zero Trust in practice — security is continuous improvement, not a
one-time fix.

### Confirmed Security Posture

- HTTPS enforced — HTTP returns 301 Moved Permanently
- Only ports 80 and 443 open — port 80 redirects to 443
- HSTS enforced (max-age=63072000; includeSubDomains; preload)
- MFA enforced for all IAM users and all Cognito users
- Least privilege applied — developer AdministratorAccess removed
- Unused IAM access keys removed
- No server-side /login endpoint — auth handled client-side via Cognito
- WARNING: CSP contains unsafe-inline / unsafe-eval — flagged for future fix
- WARNING: Session expiry not auto-enforced — manual sign-out available

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (HTML, CSS, JavaScript) |
| Routing | react-router-dom — GuestRoutes + ProtectedRoutes |
| Authentication | AWS Cognito — TOTP MFA via Authenticator Apps |
| Hosting | AWS Amplify — CI/CD from GitHub |
| Access Control | AWS IAM — Groups, Users, Least Privilege Policies |
| Monitoring | AWS CloudWatch — CognitoSecurityEvents Dashboard |
| Alerting | AWS SNS — Email alerts on failed login threshold |
| Security Testing | OWASP ZAP, Nmap, cURL |

---

## Project Structure

zero-trust/
+-- src/
|   +-- project/
|   |   +-- styles/
|   |       +-- globalStyles.js   # Reusable CSS-in-JS styling
|   |       +-- colors.js         # Centralised colour theming
|   +-- authentication.js         # Cognito auth functions
|   +-- login.js                  # Login + MFA interface
|   +-- app.js                    # Routing — GuestRoutes / ProtectedRoutes
+-- .env                          # Not committed — secrets only
+-- customHttp.yml                # AWS Amplify security headers
+-- package.json

---

## Known Limitations and Future Work

- Refine CSP — replace unsafe-inline / unsafe-eval with nonce-based policies
- Enable CloudTrail — audit all IAM user actions across AWS services
- Implement auto session expiry after inactivity
- Add route protection to /totp-setup and /mfa pages
- Enable Cognito blocking mode — upgrade from audit-only to active threat blocking
- Integrate AWS WAF for automated attack pattern mitigation
- Add AWS RDS database layer with CRUD operations for privileged users
- Progress to full penetration testing beyond automated scanning

---

## Regulatory Alignment

| Standard | Coverage |
|---|---|
| UK GDPR | Strict access controls protect personally identifiable information |
| OWASP Top 10 | Addresses Broken Access Control, Security Misconfiguration, Authentication Failures, and Logging Failures |
| Audit readiness | CloudWatch logs provide traceable records of all authentication events |

---

## Author


BSc (Hons) Cybersecurity and Web Development
2025

---

## License

MIT (c) 

---

> "Something versus nothing can still be highly effective in
> reducing unauthorised access."
