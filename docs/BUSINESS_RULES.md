# KWC CONNECT – BUSINESS RULES

## Purpose

This document defines the official business rules of KWC Connect.

Business rules always take precedence over technical implementation.

If any implementation conflicts with these rules, these rules must be followed.

---

# User Roles

## Citizen

Can:

- Register using Phone OTP
- Submit complaints
- Upload evidence
- Track complaints
- Receive notifications
- View hearing schedule
- View counselling schedule
- Update profile

Cannot:

- Modify complaint after final submission unless defect correction is requested
- View other users' complaints

---

## Akshaya Worker

Acts on behalf of a citizen.

Can:

- Register complaints
- Upload evidence
- Submit complaints

Cannot:

- Access other citizen data
- View officer functions

---

## KWC Officer

Managed in a separate dashboard.

Not part of this application.

---

# Complaint Lifecycle

Complaint Draft

↓

Complaint Submitted

↓

Scrutiny

↓

Defect Raised (if required)

↓

Citizen Resubmits

↓

Case Registered

↓

Assigned to Concerned Section

↓

Police Verification (if required)

↓

Counselling (if required)

↓

Adalat (if required)

↓

Case Closed

---

# Evidence

Supported file types:

- Images
- PDF
- Audio
- Video

Evidence cannot be deleted after successful submission unless permitted by KWC.

---

# Notifications

Notify citizens when:

- Complaint submitted
- Defect raised
- Case registered
- Officer assigned
- Hearing scheduled
- Counselling scheduled
- Case closed

---

# Security Rules

Users can only access their own complaints.

Authentication is mandatory.

Every complaint belongs to one citizen.

---

# Future Features

- AI Chatbot
- Voice to Text
- AI Case Summary
- Heatmap