# Emotional Intelligence (EI) Assessment Framework for Evaluating Workplace Effectiveness

A full-stack academic web application for measuring emotional intelligence in workplace contexts, with PostgreSQL-backed result storage and interactive analytics.

## Table of Contents

- Project Overview
- Key Features
- Technology Stack
- Architecture and Data Flow
- Project Structure
- Assessment Design
- Scoring and Classification Logic
- API Documentation
- PostgreSQL Schema
- Environment Variables
- Local Setup
- Deployment (Vercel + PostgreSQL)
- Validation Checklist
- Troubleshooting
- Future Scope

## Project Overview

This project evaluates emotional intelligence and workplace effectiveness using a structured questionnaire.

- Part A: Emotional Intelligence (25 questions)
- Part B: Workplace Effectiveness (10 questions)

Only Part A is used for EI classification. Part B is stored and displayed as a separate workplace effectiveness score.

## Key Features

- Professional, modern, responsive UI with card-based layout
- Home page with framework introduction and EI dimensions
- Multi-step questionnaire with progress tracking
- 5-point Likert scale for all 35 questions
- Server-side validation for complete and valid submissions
- EI score calculation and category classification
- Dimension-wise score breakdown
- Results page with:
  - Total EI score
  - EI category
  - Part B workplace score
  - Bar chart and radar chart
  - Interpretation and applications
- PostgreSQL persistence through Next.js API routes

## Technology Stack

- Frontend + Backend: Next.js 16 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS v4
- Database: PostgreSQL
- Charts: Recharts
- Icons: Lucide React
- Linting: ESLint

## Architecture and Data Flow

1. User completes questionnaire at /assessment.
2. Frontend submits answers to POST /api/assessments.
3. API validates all answers (must be 1 to 5 for each of 35 questions).
4. Backend computes:
   - EI total score (Part A only)
   - EI category
   - Dimension scores
   - Part B workplace score
5. Data is inserted into PostgreSQL table assessments.
6. API returns generated UUID id.
7. Frontend redirects to /results/[id].
8. Results page fetches record with GET /api/assessments/[id] and renders charts.

## Project Structure

```text
.
├── app
│   ├── api
│   │   └── assessments
│   │       ├── route.ts
│   │       └── [id]
│   │           └── route.ts
│   ├── assessment
│   │   └── page.tsx
│   ├── results
│   │   └── [id]
│   │       └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── DimensionCard.tsx
│   ├── DimensionIcon.tsx
│   ├── ProgressBar.tsx
│   └── ResultCharts.tsx
├── lib
│   ├── assessmentData.ts
│   ├── assessmentRepository.ts
│   ├── postgres.ts
│   └── scoring.ts
├── .env.example
├── package.json
└── README.md
```

## Assessment Design

### Likert Scale

- 1 = Strongly Disagree
- 2 = Disagree
- 3 = Neutral
- 4 = Agree
- 5 = Strongly Agree

### Part A: Emotional Intelligence (Q1-Q25)

Dimensions:

- Self-Awareness (Q1-Q5)
- Self-Regulation (Q6-Q10)
- Motivation (Q11-Q15)
- Empathy (Q16-Q20)
- Social Skills (Q21-Q25)

### Part B: Workplace Effectiveness (Q26-Q35)

Categories:

- Performance (Q26-Q27)
- Teamwork (Q28-Q30)
- Leadership (Q31-Q32)
- Conflict Resolution (Q33-Q35)

### Full Question Set

1. I can easily recognize and name my emotions as I experience them.
2. When I receive negative feedback, I understand why it affects me.
3. I am aware of how my mood impacts my behavior at work.
4. I understand my strengths and weaknesses clearly.
5. I can identify physical signs of stress before important situations.
6. I think before I speak when I am upset.
7. I remain calm when dealing with difficult people.
8. I avoid making impulsive decisions under pressure.
9. I adapt quickly to unexpected changes.
10. I manage stress effectively during deadlines.
11. I stay focused on goals despite obstacles.
12. I learn from failure instead of giving up.
13. I actively seek opportunities to improve myself.
14. I recover quickly from setbacks.
15. I enjoy completing challenging tasks.
16. I can sense others' emotions even when not expressed.
17. I support colleagues facing personal difficulties.
18. I consider others' perspectives before making decisions.
19. I understand customer concerns easily.
20. I notice team morale and emotional climate.
21. I communicate ideas clearly and respectfully.
22. I help resolve conflicts in group settings.
23. I build strong professional relationships.
24. I encourage participation in group discussions.
25. I work well with different personalities.
26. I meet or exceed my work targets consistently.
27. My emotional control improves my work quality.
28. I contribute to a positive team environment.
29. Others seek my support or advice.
30. I build trust quickly with team members.
31. I motivate others toward common goals.
32. People rely on me during challenges.
33. I handle conflicts professionally.
34. I de-escalate tense situations effectively.
35. I aim for win-win solutions.

## Scoring and Classification Logic

### EI Total Score (Part A only)

- Formula: sum of Q1 to Q25
- Minimum: 25
- Maximum: 125

### Dimension Scores

- Each dimension has 5 questions
- Score range per dimension: 5 to 25

### Workplace Effectiveness Score (Part B)

- Formula: sum of Q26 to Q35
- Minimum: 10
- Maximum: 50

### EI Classification

- 100 to 125: High Emotional Intelligence
- 70 to 99: Moderate Emotional Intelligence
- 25 to 69: Low Emotional Intelligence

## API Documentation

### POST /api/assessments

Creates a new assessment record.

Request body:

```json
{
  "answers": {
    "1": 4,
    "2": 3,
    "3": 4,
    "4": 5,
    "5": 4,
    "6": 4,
    "7": 3,
    "8": 4,
    "9": 4,
    "10": 3,
    "11": 4,
    "12": 4,
    "13": 5,
    "14": 4,
    "15": 5,
    "16": 4,
    "17": 4,
    "18": 5,
    "19": 4,
    "20": 4,
    "21": 5,
    "22": 4,
    "23": 5,
    "24": 4,
    "25": 5,
    "26": 4,
    "27": 4,
    "28": 5,
    "29": 4,
    "30": 4,
    "31": 4,
    "32": 4,
    "33": 4,
    "34": 4,
    "35": 5
  }
}
```

Success response:

```json
{
  "id": "6f78d8bc-0805-4e15-9f6a-80511f0a57ef",
  "totalScore": 103,
  "category": "High Emotional Intelligence",
  "dimensionScores": {
    "selfAwareness": 20,
    "selfRegulation": 18,
    "motivation": 22,
    "empathy": 21,
    "socialSkills": 22
  },
  "partBScore": 42
}
```

Error responses:

- 400: invalid or missing answers
- 500: server/database error

### GET /api/assessments/[id]

Fetches one assessment record by UUID id.

Success response:

```json
{
  "id": "6f78d8bc-0805-4e15-9f6a-80511f0a57ef",
  "answers": {
    "1": 4,
    "2": 3
  },
  "totalScore": 103,
  "category": "High Emotional Intelligence",
  "dimensionScores": {
    "selfAwareness": 20,
    "selfRegulation": 18,
    "motivation": 22,
    "empathy": 21,
    "socialSkills": 22
  },
  "partBScore": 42,
  "createdAt": "2026-04-02T10:30:15.000Z",
  "dimensionChartData": [
    {
      "key": "selfAwareness",
      "name": "Self-Awareness",
      "score": 20,
      "max": 25
    }
  ]
}
```

Error responses:

- 404: id not found
- 500: server/database error

## PostgreSQL Schema

The application auto-creates the table at runtime if it does not exist.

Table name: assessments

```sql
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY,
  answers JSONB NOT NULL,
  total_score INTEGER NOT NULL,
  category TEXT NOT NULL,
  dimension_scores JSONB NOT NULL,
  part_b_score INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Environment Variables

Use .env.local for local development.

Example:

```env
POSTGRES_URL=postgresql://<username>:<password>@<host>:5432/<database>?sslmode=require
```

Notes:

- POSTGRES_URL is required.
- .env.example is a template and should not contain real credentials.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create local environment file:

```bash
cp .env.example .env.local
```

3. Update .env.local with your PostgreSQL connection string.

4. Run development server:

```bash
npm run dev
```

5. Open in browser:

http://localhost:3000

### Quality Checks

```bash
npm run lint
npm run build
```

## Deployment (Vercel + PostgreSQL)

1. Push code to GitHub.
2. Import repo in Vercel.
3. Set environment variables in Vercel:
  - POSTGRES_URL
4. Deploy.

Recommended providers:

- Neon
- Railway Postgres
- Render Postgres
- AWS RDS Postgres

## Validation Checklist

- Home page loads and Start Assessment works.
- Assessment requires every answer before submit.
- Submission returns a UUID id.
- Results page renders score, category, breakdown, and charts.
- Missing id shows not-found state.
- Missing Postgres env shows configuration message.
- Lint and build pass.

## Troubleshooting

### Error: Please define POSTGRES_URL in your environment variables.

Cause:

- Database URL is not configured.

Fix:

- Add POSTGRES_URL in .env.local or deployment env settings.
- Restart the dev server.

### TLS or SSL connection errors with managed Postgres

Cause:

- Provider requires SSL/TLS but client is not configured for SSL.

Fix:

- Add sslmode=require in POSTGRES_URL.
- Verify provider connection string and firewall/IP rules.

### Results page shows record not found

Cause:

- Invalid id or deleted record.

Fix:

- Submit a new assessment and use generated id route.

## Future Scope

- AI-based personalized EI feedback
- User login and result history
- PDF export for HR and academic reporting
- Admin analytics dashboard
- Team-level benchmarking
