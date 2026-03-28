-- DealCRM Sample Data
-- Run AFTER schema.sql
-- Replace 'YOUR_USER_ID' with your actual Supabase auth.users uuid

-- Deals
insert into public.deals (user_id, name, description, website_url, industry, acquisition_type, stage, priority, estimated_value, potential_score, risk_score, traction_score, source, notes_summary) values

('YOUR_USER_ID', 'Launchpad Analytics', 'B2B SaaS analytics tool for early-stage startups. ~$8k MRR, 3 years old, founder looking to exit.', 'https://launchpadanalytics.io', 'SaaS / Analytics', 'Asset Purchase', 'negotiating', 'high', 320000, 82, 30, 75, 'MicroAcquire', 'Strong retention, clean codebase. Founder burnt out. Integration risk is low.'),

('YOUR_USER_ID', 'FlowQueue', 'Async video review tool for design agencies. $4k MRR, solo founder, pre-product-market-fit pivot risk.', 'https://flowqueue.co', 'SaaS / Productivity', 'Stock Purchase', 'contacted', 'medium', 140000, 65, 55, 60, 'Acquire.com', 'Interesting niche. Needs pricing restructure. Had a call — founder is flexible.'),

('YOUR_USER_ID', 'Renterio', 'Property management SaaS for independent landlords. $22k MRR, 2 founders, Series A declined.', 'https://renterio.app', 'PropTech / SaaS', 'Asset Purchase', 'interested', 'high', 900000, 88, 20, 85, 'Inbound / Twitter', 'Best cashflow of all targets. Regulatory complexity is the main risk.'),

('YOUR_USER_ID', 'DocuSign Lite Clone (Signably)', 'Simple e-signature tool, no bloat. $1.2k MRR. Early. Solo founder happy to sell and move on.', 'https://signably.io', 'SaaS / Legal Tech', 'Asset Purchase', 'interested', 'low', 48000, 50, 40, 40, 'Acquire.com', 'Very simple product. Might be worth buying for customer list alone.'),

('YOUR_USER_ID', 'Ghostwrite AI', 'AI ghostwriting tool for newsletters. $6k MRR. Viral growth last quarter. Founder wants $500k.', 'https://ghostwrite.ai', 'AI / Content', 'Stock Purchase', 'contacted', 'high', 480000, 90, 45, 88, 'Twitter DM', 'High growth but AI commoditization risk. Founder is non-technical.'),

('YOUR_USER_ID', 'Onboard.ly', 'Customer onboarding flow builder. No-code. $3.5k MRR. Good churn rate. 2 years old.', 'https://onboard.ly', 'SaaS / No-Code', 'Asset Purchase', 'negotiating', 'medium', 175000, 72, 35, 68, 'Listing (MicroAcquire)', 'Founders agreed to seller financing. DD ongoing.'),

('YOUR_USER_ID', 'ClinicHub', 'Practice management for small clinics. $18k MRR. Health data compliance concern. 4 years old.', 'https://clinichub.io', 'HealthTech / SaaS', 'Stock Purchase', 'closed', 'high', 750000, 85, 60, 80, 'Broker (Quiet Light)', 'Acquisition closed. Integration in progress.'),

('YOUR_USER_ID', 'Stackpulse (deprecated)', 'DevOps incident response tool. Product abandoned. Customer list only valuable asset.', 'https://stackpulse.dev', 'DevOps / SaaS', 'Asset Purchase', 'rejected', 'low', 15000, 25, 80, 10, 'Cold outreach', 'Passed. Codebase unmaintainable, no real customers.');


-- Founders (linked to above deals by name — in real use, match by id)
-- These are illustrative; in production you'd use actual deal UUIDs

-- Note: To make seed data work, you'd query the deal ids first.
-- Here we insert with a subquery approach for portability:

insert into public.founders (deal_id, full_name, email, linkedin_url, twitter_url, role_title, notes)
select id, 'Marcus Webb', 'marcus@launchpadanalytics.io', 'https://linkedin.com/in/marcuswebb', '@marcuswebb', 'Founder & CEO', 'Very responsive. Wants a clean exit by Q3. Open to consulting arrangement post-acquisition.'
from public.deals where name = 'Launchpad Analytics' limit 1;

insert into public.founders (deal_id, full_name, email, linkedin_url, twitter_url, role_title, notes)
select id, 'Priya Nair', 'priya@flowqueue.co', 'https://linkedin.com/in/priyanair', '@priyanair_builds', 'Solo Founder', 'Responsive. Has other offers. Needs answer within 30 days.'
from public.deals where name = 'FlowQueue' limit 1;

insert into public.founders (deal_id, full_name, email, linkedin_url, twitter_url, role_title, notes)
select id, 'Jordan Ellis', 'jordan@renterio.app', 'https://linkedin.com/in/jordanellis', '@jordanellis', 'Co-Founder / CTO', 'Technical founder. Prefers stock deal. Wants earnout.'
from public.deals where name = 'Renterio' limit 1;

insert into public.founders (deal_id, full_name, email, linkedin_url, twitter_url, role_title, notes)
select id, 'Aisha Rowe', 'aisha@renterio.app', 'https://linkedin.com/in/aisharowe', null, 'Co-Founder / CEO', 'Business side. Driving the deal. Very organized.'
from public.deals where name = 'Renterio' limit 1;

insert into public.founders (deal_id, full_name, email, linkedin_url, twitter_url, role_title, notes)
select id, 'Devon Park', 'devon@ghostwrite.ai', 'https://linkedin.com/in/devonpark', '@devonpark_ai', 'Founder', 'Non-technical but has strong distribution. Asking price firm at $500k.'
from public.deals where name = 'Ghostwrite AI' limit 1;
