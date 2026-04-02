# Emotional Intelligence (EI) Assessment Framework for Evaluating Workplace Effectiveness

A full-stack academic web application that measures emotional intelligence and links it to workplace effectiveness.

The platform provides a guided questionnaire, automated EI scoring, MongoDB result storage, and visual analytics for interpretation.

## Table of Contents

- Project Summary
- Core Features
- Technology Stack
- System Architecture
- Project Structure
- Assessment Model
- Scoring Model
- Application Flow
- API Reference
- Database Schema
- UI and UX Details
- Setup and Local Development
- Deployment Guide
- Validation Checklist
- Troubleshooting
- Future Enhancements

## Project Summary

This project evaluates emotional intelligence in workplace context through two parts:

- Part A: Emotional Intelligence (25 questions)
- Part B: Workplace Effectiveness (10 questions)

Only Part A is used for EI classification, while Part B is stored and shown separately as workplace effectiveness score.

### Main Goal

Build a modern, clean, professional HR-style assessment experience that includes:

- Dimension-based questionnaire
- Automated scoring and categorization
- Dimension-wise analysis
- Chart-based visualization
- Interpretation and practical applications

## Core Features

- Home page with framework overview and dimension cards
- Multi-step section-based questionnaire (6 steps)
- 5-point Likert scale for all 35 questions
- Progress tracking and section completion states
- Server-side validation of all responses
- EI scoring using Part A only
- Score classification into High/Moderate/Low EI
- Dimension-wise score breakdown (5 dimensions)
- Results page with:
	- Total EI score
	- EI category
	- Workplace effectiveness score
	- Bar chart
	- Radar chart
	- Interpretation and HR applications
- MongoDB persistence using Next.js API routes
- Graceful handling for missing MongoDB configuration and invalid result IDs

## Technology Stack

- Framework: Next.js 16 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS v4
- Database: MongoDB (Atlas or local)
- Icons: lucide-react
- Charts: recharts
- Linting: ESLint

## System Architecture

High-level flow:

1. User answers 35 questions in the assessment page.
2. Frontend sends answers to POST /api/assessments.
3. API validates all answer values (must be 1 to 5).
4. Server computes:
	 - Part A total EI score
	 - EI category
	 - Dimension-wise scores
	 - Part B workplace score
5. Server stores result in MongoDB and returns inserted id.
6. Frontend redirects to /results/[id].
7. Results page fetches stored assessment and renders analytics.

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
│   ├── mongodb.ts
│   └── scoring.ts
├── .env.example
├── package.json
└── README.md
```

## Assessment Model

### Likert Scale (All Questions)

- 1 = Strongly Disagree
- 2 = Disagree
- 3 = Neutral
- 4 = Agree
- 5 = Strongly Agree

### Part A: Emotional Intelligence (Questions 1 to 25)

Dimensions and question grouping:

- Self-Awareness: 1 to 5
- Self-Regulation: 6 to 10
- Motivation: 11 to 15
- Empathy: 16 to 20
- Social Skills: 21 to 25

Questions:

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

### Part B: Workplace Effectiveness (Questions 26 to 35)

Categories and grouping:

- Performance: 26 to 27
- Teamwork: 28 to 30
- Leadership: 31 to 32
- Conflict Resolution: 33 to 35

Questions:

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

## Scoring Model

### EI Total Score

Only Part A contributes to EI total:

```text
EI Total Score = sum(Q1 ... Q25)
Minimum = 25
Maximum = 125
```

### Dimension Score

Each dimension has 5 questions:

```text
Dimension Score = sum(its 5 mapped questions)
Minimum per dimension = 5
Maximum per dimension = 25
```

### Workplace Effectiveness Score

Part B is stored and shown separately:

```text
Workplace Effectiveness Score = sum(Q26 ... Q35)
Minimum = 10
Maximum = 50
```

### EI Classification

- 100 to 125: High Emotional Intelligence
- 70 to 99: Moderate Emotional Intelligence
- 25 to 69: Low Emotional Intelligence

## Application Flow

### Home Page (/)

- Presents framework intro and purpose
- Shows EI dimensions with icons/cards
- Shows scoring thresholds
- Start Assessment button routes to /assessment

### Assessment Page (/assessment)

- 6 steps:
	- 5 EI dimensions
	- 1 Workplace Effectiveness section
- Prevents moving forward if current section is incomplete
- Shows global progress bar for all 35 questions
- Submits answers to backend API
- Redirects to /results/[id]

### Results Page (/results/[id])

Displays:

- Total EI Score
- EI Category
- Part B Workplace Effectiveness Score
- Dimension-wise bars with percentage fill
- Bar chart and radar chart
- Interpretation section for all categories
- Practical workplace applications

Also handles:

- Missing MongoDB configuration
- Invalid or non-existing assessment id

## API Reference

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
	"id": "67ecf8f1f06b96b4d0bf1a5a",
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

Validation errors:

- 400 if answers are missing or any question is not answered with value 1 to 5.
- 500 for unexpected server/database errors.

### GET /api/assessments/[id]

Fetches one stored assessment by Mongo ObjectId.

Success response:

```json
{
	"id": "67ecf8f1f06b96b4d0bf1a5a",
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

Errors:

- 404 if id is invalid format or record not found.
- 500 for unexpected server/database errors.

## Database Schema

Collection name: assessments

Document shape:

```ts
{
	_id: ObjectId,
	answers: Record<string, number>,
	totalScore: number,
	category: "High Emotional Intelligence" | "Moderate Emotional Intelligence" | "Low Emotional Intelligence",
	dimensionScores: {
		selfAwareness: number,
		selfRegulation: number,
		motivation: number,
		empathy: number,
		socialSkills: number
	},
	partBScore: number,
	createdAt: Date
}
```

## UI and UX Details

- Visual style: clean, minimal, professional
- Theme direction: soft blue and indigo gradients
- Layout style: card-based with subtle shadows and rounded surfaces
- Motion: smooth transitions and staggered reveal animations
- Responsiveness: mobile-first with adaptive grid and spacing
- Accessibility basics:
	- Semantic sections and headings
	- Radio groups for Likert choices
	- Disabled states for navigation and submit actions

## Setup and Local Development

### Prerequisites

- Node.js 20+
- npm 10+
- MongoDB Atlas cluster (recommended) or local MongoDB instance

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create local env file:

```bash
cp .env.example .env.local
```

Set values in .env.local:

```env
# MongoDB connection string (Atlas or local)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/

# Optional database name (defaults to ei_assessment_db)
MONGODB_DB=ei_assessment_db
```

### 3) Start development server

```bash
npm run dev
```

Open http://localhost:3000

### 4) Quality checks

```bash
npm run lint
npm run build
```

### 5) Run production mode locally (optional)

```bash
npm run build
npm run start
```
◊
## Deployment Guide

### Deploy to Vercel

1. Push code to GitHub.
2. Import repository in Vercel.
3. Configure environment variables in Vercel project settings:
	 - MONGODB_URI
	 - MONGODB_DB (optional)
4. Deploy.

### MongoDB Atlas Setup

1. Create a cluster.
2. Create database user.
3. Add IP allow list (or Vercel outbound access strategy).
4. Copy connection URI and set MONGODB_URI.

## Validation Checklist

Use this checklist after deployment:

- Home page loads and Start Assessment button works.
- Assessment enforces completion before next step.
- All 35 answers are required before submit.
- Submission returns a valid result id.
- Results page shows score, category, and chart visualizations.
- Missing/invalid id returns not found state.
- Missing MongoDB env shows configuration message.
- Lint and build pass without errors.

## Troubleshooting

### Error: Please define MONGODB_URI in your environment variables.

Cause:

- MONGODB_URI is missing in .env.local or deployment environment.

Fix:

- Add MONGODB_URI, restart dev server, and re-test.

### Assessment not found on results page

Cause:

- Wrong id, deleted record, or invalid ObjectId.

Fix:

- Submit assessment again and use returned id route.

### Build passes but runtime fetch fails

Cause:

- Database network/access settings in MongoDB Atlas are not configured.

Fix:

- Check Atlas user permissions, connection URI, and IP/network allow list.

## Future Enhancements

- AI-based personalized recommendations for EI development
- User authentication and result history dashboard
- PDF export for HR and academic reporting
- Admin analytics panel across participants
- Benchmarking against team or department averages

---

This project is designed for academic and learning purposes in emotional intelligence and workplace effectiveness analysis.
