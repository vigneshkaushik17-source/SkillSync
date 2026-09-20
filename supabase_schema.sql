-- ==========================================
-- SUPABASE DATABASE INITIALIZATION SCHEMA
-- Project: SkillSync
-- ==========================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    sector TEXT NOT NULL,
    demand_score INTEGER NOT NULL CHECK (demand_score BETWEEN 0 AND 100),
    supply_score INTEGER NOT NULL CHECK (supply_score BETWEEN 0 AND 100),
    growth_rate NUMERIC NOT NULL,
    job_openings INTEGER NOT NULL,
    required_proficiency TEXT NOT NULL,
    associated_roles TEXT[] NOT NULL DEFAULT '{}',
    associated_industries TEXT[] NOT NULL DEFAULT '{}',
    top_districts TEXT[] NOT NULL DEFAULT '{}',
    signals JSONB NOT NULL DEFAULT '{"jobPostingsWeight": 45, "employerSurveysWeight": 25, "consultationsWeight": 15, "sectorGrowthWeight": 10, "emergingTechWeight": 5}',
    validated_by_employers_count INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Job Roles Table
CREATE TABLE IF NOT EXISTS public.job_roles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    sector TEXT NOT NULL,
    openings INTEGER NOT NULL,
    growth_rate NUMERIC NOT NULL,
    match_score INTEGER NOT NULL,
    avg_salary TEXT NOT NULL,
    experience_level TEXT NOT NULL,
    required_skills JSONB NOT NULL DEFAULT '[]',
    locations TEXT[] NOT NULL DEFAULT '{}',
    validated_by_industry BOOLEAN NOT NULL DEFAULT TRUE,
    active_hiring_companies TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Courses & Curriculum Table
CREATE TABLE IF NOT EXISTS public.courses (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    title TEXT NOT NULL,
    institution TEXT NOT NULL,
    sector TEXT NOT NULL,
    level TEXT NOT NULL,
    alignment_score INTEGER NOT NULL CHECK (alignment_score BETWEEN 0 AND 100),
    health_status TEXT NOT NULL,
    enrolled_students INTEGER NOT NULL,
    graduates_annual INTEGER NOT NULL,
    placement_rate INTEGER NOT NULL,
    employer_satisfaction NUMERIC NOT NULL,
    duration_weeks INTEGER NOT NULL,
    skills_taught JSONB NOT NULL DEFAULT '[]',
    recommended_actions JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Districts & Workforce Table
CREATE TABLE IF NOT EXISTS public.districts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    state TEXT NOT NULL,
    sector TEXT NOT NULL,
    demand_score INTEGER NOT NULL,
    talent_supply_score INTEGER NOT NULL,
    skill_gap_score INTEGER NOT NULL,
    active_job_demand INTEGER NOT NULL,
    unemployed_trained_youth INTEGER NOT NULL,
    training_capacity INTEGER NOT NULL,
    placement_rate INTEGER NOT NULL,
    trainers_required INTEGER NOT NULL,
    trainers_available INTEGER NOT NULL,
    labs_required INTEGER NOT NULL,
    labs_available INTEGER NOT NULL,
    equipment_shortage_items TEXT[] NOT NULL DEFAULT '{}',
    high_demand_roles TEXT[] NOT NULL DEFAULT '{}',
    priority_skills TEXT[] NOT NULL DEFAULT '{}',
    recommended_plan JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Employer Validations Table
CREATE TABLE IF NOT EXISTS public.employer_validations (
    id TEXT PRIMARY KEY DEFAULT ('val-' || extract(epoch from now())),
    company_name TEXT NOT NULL,
    representative TEXT NOT NULL,
    role TEXT NOT NULL,
    industry TEXT NOT NULL,
    action TEXT NOT NULL,
    target_item TEXT NOT NULL,
    comment TEXT NOT NULL,
    timestamp TEXT NOT NULL DEFAULT 'Just now',
    status TEXT NOT NULL DEFAULT 'Verified',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Candidate Profiles Table
CREATE TABLE IF NOT EXISTS public.candidate_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    age INTEGER,
    education TEXT,
    experience_years NUMERIC DEFAULT 0,
    industry_domain TEXT DEFAULT 'IT & Tech',
    internships TEXT,
    salary_expectation TEXT,
    desired_role TEXT NOT NULL,
    preferred_location TEXT,
    skills JSONB NOT NULL DEFAULT '[]',
    certifications TEXT[] NOT NULL DEFAULT '{}',
    ai_prediction JSONB,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Enable Public Read & Insert Access (Row Level Security)
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employer_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if rerun to prevent duplicate errors
DROP POLICY IF EXISTS "Allow public read access for skills" ON public.skills;
DROP POLICY IF EXISTS "Allow public read access for job_roles" ON public.job_roles;
DROP POLICY IF EXISTS "Allow public read access for courses" ON public.courses;
DROP POLICY IF EXISTS "Allow public read access for districts" ON public.districts;
DROP POLICY IF EXISTS "Allow public read & insert on employer_validations" ON public.employer_validations;
DROP POLICY IF EXISTS "Allow public read & write on candidate_profiles" ON public.candidate_profiles;

CREATE POLICY "Allow public read access for skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Allow public read access for job_roles" ON public.job_roles FOR SELECT USING (true);
CREATE POLICY "Allow public read access for courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Allow public read access for districts" ON public.districts FOR SELECT USING (true);
CREATE POLICY "Allow public read & insert on employer_validations" ON public.employer_validations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read & write on candidate_profiles" ON public.candidate_profiles FOR ALL USING (true) WITH CHECK (true);
