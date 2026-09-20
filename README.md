# SkillSync — Skill-Industry Alignment Dashboard

An enterprise-grade **Labour-Market Intelligence, Skill-Gap, and Curriculum-Alignment Platform** that establishes an end-to-end intelligence loop connecting:

$$\text{INDUSTRY DEMAND} \longrightarrow \text{SKILLS} \longrightarrow \text{JOBS} \longrightarrow \text{CANDIDATES} \longrightarrow \text{COURSES} \longrightarrow \text{CURRICULUM} \longrightarrow \text{DISTRICTS}$$

---

## 🌟 Core Features

1. **Market Overview**: Executive KPIs, multi-sector labour trends, emerging skills momentum leaderboard, and district workforce heatmap.
2. **Skill Intelligence Engine**: Decomposed demand signals (*Job Postings 45%, Employer Surveys 25%, Industry Consultations 15%, Sector Growth 10%, Emerging Tech 5%*), proficiency tiers, and drill-down modal.
3. **Skill Gap Analysis**: Radar comparison, demand-vs-supply matrix, severity classification (🟢 Aligned, 🟡 Needs Improvement, 🔴 Critical Gap), and priority ranking engine.
4. **Jobs & Live Employer Demand Portal**: Job role competency profiles, salary benchmarks, and interactive employer validation sandbox.
5. **Curriculum Alignment Engine**: Course alignment scorecards, visual skill-by-skill syllabus depth bars, and automated actions (🟢 Keep, 🟡 Update, 🔴 Reduce/Remove, 🔵 Add).
6. **Course Health & Learning Pathways**: Obsolescence detector and step-by-step qualification roadmap.
7. **District-Level Workforce Planner**: District workforce snapshot, lab equipment & trainer deficit analysis, and automated district plan generator.
8. **Longitudinal Outcome Analytics**: Tracking before/after impact on placement rates, employer satisfaction, and 24-month emerging technology radar.
9. **Candidate Profile & AI Career/Salary Predictor**: Profile manager (Name, Gmail, Age, Internships, Experiences, Salary Expectations) with automated AI high-ROI skill recommendations and multi-year future salary projections.
10. **Data Architecture & Supabase**: PostgreSQL database integration with typed client and offline local storage fallback.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and configure your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🛠️ Tech Stack
- **Framework**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, Glassmorphism design tokens
- **Data Visualizations**: Recharts
- **Icons**: Lucide React
- **Backend / Database**: Supabase (@supabase/supabase-js) + PostgreSQL
