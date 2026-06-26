> AI-assisted generation, refinement, and validation of evidence-grounded business rules for already-identified clinical care gaps.

---

### Table of Contents

1. Problem Statement
2. Vision
3. Core Capabilities
4. Why This Is Hard
5. Recommended POC Scope
6. POC Architecture
7. Example Output Walkthrough
8. Business Rule Package — Full Framework
9. POC Scope Selection (What to Show / What to Skip)
10. Frontend Design
11. Sample Input DataReasoning 
12. Pipeline (How the LLM Combines Inputs)
13. Prompt Architecture
14. Roadmap Beyond the POC

---

## 1. Problem Statement

Defining care gaps in real-world data is one of the biggest bottlenecks in healthcare analytics delivery. The clinical guideline is usually known — the hard part is translating it into a rule that accurately identifies patients in claims, EMR, and lab data.

**Current process:**

```
Medical Affairs → Clinical Guideline → Therapy Area Scientists →
Business Consultant → Analytics Team → SQL Developer → Validation →
Repeat → Repeat → Repeat
```

**Typical timeline:**

|Phase|Duration|
|---|---|
|Understanding clinical guidelines|2–3 weeks|
|Writing business rules|2–4 weeks|
|Implementing SQL|1–2 weeks|
|Validating with scientists|2–3 weeks|
|Review cycles as definitions evolve|Multiple, ongoing|

---

## 2. Vision

Replace the sequential hand-off chain with a live, collaborative workshop:

```
Medical Director + TA Scientist + Commercial Lead + Analytics Lead
                          ↓
                    AI Assistant
                          ↓
            Business Rules generated live
                          ↓
                    Modify → Recalculate → Modify again → Approve
```

**Important framing:** the AI is **not** discovering care gaps. The care gap is already known (e.g., _"Patients with Type 2 Diabetes who should have received GLP-1 therapy but haven't"_). The AI's job is to answer:

> **"How do we accurately identify these patients in real-world data?"**

---

## 3. Core Capabilities

### 3.1 Evidence-Grounded Rule Generation

Every generated rule must be traceable:

```
Rule → Guideline → Section → Evidence Grade → Reference
```

Example:

```
Rule:              HbA1c > 9
Source:            ADA Standards of Care 2025
Recommendation:    9.14
Evidence Grade:    A
```

This is what earns clinician trust — no hallucinated thresholds.

### 3.2 Live Rule Tweaking

Stakeholders modify rules conversationally during a workshop and see instant updates:

|Scientist says|AI updates to|
|---|---|
|"Make it 21."|`Age >= 21`|
|"Exclude CKD Stage 4."|`AND CKD Stage != 4`|
|"Make HbA1c threshold 8 instead of 9."|`HbA1c > 8`|

### 3.3 Immediate Impact Feedback

After every change, show the population effect:

```
Current Population:     38,421 patients
Changed Threshold:      Age > 21
New Population:         35,812
Difference:             -2,609
```

or

```
Adding CKD exclusion → Population decreases by 11%
```

---

## 4. Why This Is Hard

This is not a simple prompt-engineering problem — it requires combining multiple distinct capabilities:

|Capability|Why It Matters|
|---|---|
|Guideline parsing|Extract recommendations from clinical documents|
|Evidence grounding|Link every rule to the exact recommendation + evidence level|
|Clinical reasoning|Interpret nuanced language ("consider," "preferred," "recommended")|
|Rule authoring|Convert narrative guidance into structured logical expressions|
|Temporal reasoning|Handle look-back periods, sequencing, persistence, monitoring windows|
|Data mapping|Translate clinical concepts into ICD, CPT, HCPCS, NDC, RxNorm, LOINC, SNOMED|
|Rule execution|Run rules against real-world datasets|
|Explainability|Show why a patient qualifies or doesn't|
|Interactive editing|Support live modification during workshops|
|Governance|Version, review, and audit rule changes over time|

Most existing tools solve only one or two of these. Solving all of them is what makes this a "magic bullet" rather than another analytics dashboard.

---

## 5. Recommended POC Scope

**Don't try to prove the whole platform.** Prove one thing only:

> **Can AI generate a clinically meaningful first draft of business rules that scientists can review and refine much faster than today?**

Everything else — conversational editing, live execution, governance, full deployment — is secondary and can be roadmapped for later phases.

### 5.1 Scope Simplification Recommendation

|Feature|Full Vision|POC Recommendation|
|---|---|---|
|Care gap creation|N/A|User selects an already-defined care gap|
|Rule editing|Free-form conversational|**Predefined, editable parameters only** (no chatbot)|
|Patient counts|Real-time on live data|Optional / can be mocked|
|Output format|SQL / Spark / rules engine|Human-readable English logic|

---

## 6. POC Architecture

### 6.1 Process Flow

```
Step 1 — User selects a Care Gap
        (e.g., "Initiation of GLP-1 Therapy in Eligible T2D Patients")
                          ↓
Step 2 — AI generates the first-pass rule package
        Input:  Care Gap + Guidelines + Publications + Business Context
        Output: Clinical Interpretation, Eligibility, Exclusions,
                Temporal Logic, Required Data, Code Sets,
                Evidence References, Confidence Score
                          ↓
Step 3 — User tweaks only predefined parameters
        (no free-form/chat editing — dramatically simplifies build)
                          ↓
Step 4 — AI regenerates the rule package
        Updated Rule Logic → Updated Patient Count (optional) → Export
```

### 6.2 System Architecture

```
        Clinical Guidelines + Publications +
        Internal Rule Library + Existing Care Gap
                          │
                LLM Rule Generator
                          │
        ┌─────────────────┴─────────────────┐
   Structured Business Rules         Evidence Mapping
        └─────────────────┬─────────────────┘
                          │
                  Parameter Editor
                          │
              Updated Business Rules
                          │
              Export (JSON / SQL / PDF)
```

**Note:** No conversational/chat editing layer in the POC — only structured parameter controls.

### 6.3 Editable Parameters (POC)

|Parameter|Original|Editable|
|---|---|---|
|Minimum Age|18|✅|
|HbA1c Threshold|9|✅|
|Lookback Period|180 Days|✅|
|Continuous Enrollment|12 Months|✅|
|Pregnancy Exclusion|Yes|✅|
|CKD Exclusion|Stage 4+|✅|

Everything else stays locked — this is what keeps the implementation manageable.

---

## 7. Example Output Walkthrough

**Care Gap:** Therapy Escalation in Type 2 Diabetes

### Clinical Summary

> Patients with uncontrolled Type 2 Diabetes should be considered for treatment escalation if HbA1c remains above target despite current therapy.

- **Source:** ADA 2025
- **Confidence:** 94%

### Eligibility Criteria

|Rule|Value|Editable|
|---|---|---|
|Age|≥18|✅|
|Diagnosis|Type 2 Diabetes|❌|
|HbA1c|>9|✅|
|Current Therapy|Metformin|❌|
|Latest Lab|Within 180 days|✅|

### Exclusions

|Rule|Value|Editable|
|---|---|---|
|Pregnancy|Yes|✅|
|ESRD|Yes|✅|
|Type 1 Diabetes|Yes|❌|

### Time Windows

|Rule|Value|Editable|
|---|---|---|
|Diagnosis Lookback|24 months|✅|
|Lab Lookback|180 days|✅|
|Therapy Stability|120 days|✅|

### Data Requirements

`Diagnosis` · `Procedure` · `Medication` · `Laboratory` · `Enrollment`

### Required Code Sets

`ICD10` · `NDC` · `RxNorm` · `LOINC`

### Generated Rule (Plain English, not SQL)

```
Patient must
• be ≥18 years
AND
• have Type 2 Diabetes
AND
• latest HbA1c >9
AND
• currently receiving Metformin
AND
• latest HbA1c within 180 days
AND
• no GLP-1 therapy
AND
• not pregnant
AND
• no ESRD
```

### Evidence Mapping

|Rule|Evidence|
|---|---|
|HbA1c >9|ADA Recommendation 9.14|
|Therapy Escalation|ADA Section 9|
|Lab Window|Derived from Monitoring Recommendation|

### Impact Summary (recommended addition)

```
Changes Made:
  Age:         18 → 21
  HbA1c:       9 → 8.5
  Lab Window:  180 → 120 days
------------------------------
Affected Rules:               3
Estimated Eligible Patients:  38,421 → 35,104
Confidence:                   92%
```

Even mocked, this demonstrates the end-state vision: instant visibility into how parameter changes affect the eligible population during a live workshop.

---

## 8. Business Rule Package — Full Framework

A complete rule package (most sections optional for POC) includes:

|#|Section|Description|
|---|---|---|
|1|Care Gap Definition|The business problem the rule identifies|
|2|Clinical Context|Disease area, guideline, evidence strength, recommendation text|
|3|Eligibility Criteria|Who is eligible (diagnosis, age, labs, therapy, enrollment, etc.)|
|4|Exclusion Criteria|Who should never qualify|
|5|Temporal Rules|Lookback, monitoring window, therapy stability, observation, follow-up|
|6|Event Sequence Rules|Ordering dependencies (e.g., diagnosis → lab → therapy → follow-up)|
|7|Threshold Rules|Numeric cutoffs (age, HbA1c, LDL, BMI, BP)|
|8|Treatment Rules|Current/prior/failed/combination therapy, dose changes, adherence|
|9|Laboratory Rules|Required tests, most recent/historical result, frequency, missing data|
|10|Diagnostic Rules|ICD diagnosis, confirmation, primary/secondary, procedure confirmation|
|11|Provider Rules|Specialty, practice type, network, prescribing history|
|12|Patient Characteristics|Age, gender, weight, BMI, smoking status, comorbidities, risk score|
|13|Data Availability Rules|What data is required vs. optional|
|14|Code Mapping|ICD10, NDC, RxNorm, LOINC, CPT, HCPCS, SNOMED|
|15|Derived Variables|Latest/max/average HbA1c, days since diagnosis, MPR, persistence flags|
|16|Rule Logic|The actual readable business rule (later convertible to SQL)|
|17|Rule Explanation|Why each rule was added|
|18|Evidence Mapping|Rule ↔ guideline ↔ section ↔ evidence grade|
|19|Confidence & Assumptions|Confidence score + explicit assumptions made|
|20|Validation Summary|Rules passed, warnings, missing data flags|
|21|Output Definition|Eligibility flag, gap type, priority, recommended action|
|22|Export|SQL, Spark, JSON, Drools, Excel, PDF|

---

## 9. POC Scope Selection

|Section|Show|Editable|
|---|---|---|
|Care Gap Definition|✅|No|
|Clinical Context|✅|No|
|Eligibility Criteria|✅|Selected parameters only|
|Exclusion Criteria|✅|Selected parameters only|
|Temporal Rules|✅|Yes|
|Threshold Rules|✅|Yes|
|Data Requirements|✅|No|
|Rule Logic (English)|✅|Auto-generated|
|Evidence Mapping|✅|No|
|Confidence & Assumptions|✅|No|

This balances clinical credibility with implementation simplicity, and leaves a clean path toward conversational editing, cohort impact analysis, SQL generation, and rules-engine deployment in later phases.

---

## 10. Frontend Design

### 10.1 Recommended Layout — Two Panels (No Left Navigation)

The care gap is selected **before** entering this screen — it's not browsed or defined here. So the screen only needs to do two things: show the generated rules, and let the user adjust parameters.

```
+-----------------------------------------------------------------------------------------+
| Care Gap: Therapy Escalation in T2D                             [ Generate Rules ]      |
+-----------------------------------------------------------------------------------------+
|                                                      |                                  |
|           Generated Business Rules                   |      Configurable Parameters      |
|                                                      |                                  |
| Clinical Summary                                     | Age ≥      [18 ▼]                |
|                                                      |                                  |
| Eligibility                                          | HbA1c >    [9.0 ▼]               |
| • Type 2 Diabetes                                    |                                  |
| • Age ≥18                                            | Lookback   [180 ▼] Days          |
| • HbA1c >9                                           |                                  |
|                                                      | Enrollment [12 ▼] Months         |
| Exclusions                                           |                                  |
| • Pregnancy                                          | Pregnancy ☑                      |
| • ESRD                                               | ESRD ☑                           |
|                                                      |                                  |
| Temporal Rules                                       | [ Generate Updated Rules ]       |
|                                                      |                                  |
| Evidence                                             | --- Impact Summary ---           |
| ADA 2025 Recommendation 9.14                         | Age: 18→21, HbA1c: 9→8.5         |
| FDA Label                                            | Eligible: 38,421 → 35,104        |
|                                                      | Confidence: 92%                  |
+------------------------------------------------------+----------------------------------+
```

### 10.2 Left-Panel Alternatives (Considered, Not Recommended for POC)

If a left navigation panel is desired in a future iteration:

|Option|Concept|
|---|---|
|**Rule Sections**|Navigate within the generated package (Word/Notion-style outline)|
|**Source Documents**|Show evidence sources used; clicking highlights which rules came from which doc — reinforces trust|
|**Generation Progress**|Simple checklist: Care Gap Selected → Evidence Parsed → Rules Generated → Parameters Updated → Export (likely too simple for a demo)|

**Recommendation:** Skip the left panel for the POC. Two panels is cleaner and matches what's actually happening — generated rules on one side, adjustable parameters on the other.

---

## 11. Sample Input Data

Realistic sample records make data sources self-explanatory for a client audience.

### 11.1 Medical Claims

_Purpose: diagnoses, procedures, provider interactions, hospitalizations._

|PATIENT_ID|SERVICE_DATE|DX1|DX2|POS|HCPCS|CPT|PROVIDER_NPI|
|---|---|---|---|---|---|---|---|
|P001|2024-01-15|K50.10|D84.9|11|J1745|99214|1234567890|
|P001|2024-03-20|K50.10|R19.7|22|J1745|96413|1234567890|
|P002|2024-02-08|K51.90|None|11|None|99213|9988776655|

_Tells the audience: patient has Crohn's (K50.xx), received a biologic infusion (J1745), and had outpatient visits._

### 11.2 Pharmacy Claims

_Purpose: medication exposure and treatment history._

|PATIENT_ID|FILL_DATE|NDC|DRUG_NAME|DAYS_SUPPLY|STRENGTH|QUANTITY|PRESCRIBER_NPI|
|---|---|---|---|---|---|---|---|
|P001|2024-01-16|57894-030|Prednisone|30|20 mg|30|1234567890|
|P001|2024-04-10|00074-4339|Humira|28|40 mg|2|1234567890|
|P002|2024-02-10|50458-579|Mesalamine|30|1.2 g|60|9988776655|

### 11.3 Patient Activity Summary

_Purpose: defines the observation period._

|PATIENT_ID|FIRST_ACTIVITY_DATE|LAST_ACTIVITY_DATE|ACTIVE_MONTHS|
|---|---|---|---|
|P001|2022-05-01|2025-01-10|32|
|P002|2023-08-18|2025-01-15|17|
|P003|2021-10-01|2024-12-28|38|

### 11.4 IBD Diagnosis Reference Table

|ICD10|Disease|Category|
|---|---|---|
|K50.00|Crohn's Disease|IBD|
|K50.80|Crohn's Disease|IBD|
|K51.00|Ulcerative Colitis|IBD|
|K51.90|Ulcerative Colitis|IBD|

_Usage pattern:_ `LIKE 'K50%'` / `LIKE 'K51%'`

### 11.5 Drug Master Reference

|NDC|Drug|Generic|Drug Class|
|---|---|---|---|
|00054-0174|Prednisone|Prednisone|Oral Corticosteroid|
|00591-0467|Budesonide|Budesonide|Oral Corticosteroid|
|00009-0028|Methylprednisolone|Methylprednisolone|Oral Corticosteroid|

_Usage pattern:_ `INNER JOIN ... ON NDC`

### 11.6 Clinical Context + Evidence (Sample)

```
Disease Area:        Inflammatory Bowel Disease (IBD)
Care Gap:             Patients with moderate-to-severe IBD remaining on
                      prolonged oral corticosteroids without biologic therapy.
Primary Guideline:    AGA Clinical Practice Guideline (2024)
Supporting Evidence:  ACG Guideline · ECCO Guideline · BSG Guideline
```

### 11.7 Market Definitions

|Business Concept|Definition|
|---|---|
|Active Patient|≥2 medical claims within 12 months|
|OCS User|≥60 cumulative steroid days|
|Biologic User|≥1 biologic administration or prescription|
|Moderate-Severe IBD|Steroid dependence OR hospitalization OR biologic eligible|

### 11.8 Output Granularity

```
Patient Level   → Patient ID, Disease, Care Gap Flag, Priority, Evidence Score
HCP Level       → NPI, Eligible Patients, Gap Count
Account Level   → Hospital, Eligible Patients, Care Gap %
Payer Level     → Plan, Members, Gap Rate
```

### 11.9 Evidence Sources Library

|Document|Type|Version|
|---|---|---|
|AGA Clinical Guideline|Guideline|2024|
|ACG Crohn's Guideline|Guideline|2023|
|ECCO Guideline|Guideline|2024|
|FDA Prescribing Information|Label|Latest|
|Internal Medical Review|Internal|v2.1|

### 11.10 Input Data Story (Presentation View)

```
INPUT DATA
Medical Claims ────────────── P001 K50.10 J1745 | P002 K51.90 Office Visit | P003 Hospital Admission
        ↓
Pharmacy Claims ────────────── Prednisone | Humira | Mesalamine
        ↓
Reference Tables ────────────── ICD → Disease | NDC → Drug Class
        ↓
Clinical Context ────────────── Care Gap | Evidence | Guidelines
        ↓
Market Definitions ────────────── Business Definitions | Thresholds
        ↓
Output ────────────── Patient | HCP | Account | Payer
```

This presentation-friendly framing tells a story (what each input contains and why it's needed) rather than reading like a raw database schema.

---

## 12. Reasoning Pipeline

The LLM does not simply read inputs — it uses each one to answer a specific question required to construct an executable business rule, progressively reducing ambiguity.

### 12.1 Overall Flow

```
CARE GAP: "IBD patients eligible for biologic initiation"
        │  What does this mean?
        ▼
Clinical Context
        │  What does evidence recommend?
        ▼
Evidence Sources
        │  What clinical concepts are needed?
        ▼
Market Definitions
        │  Can these concepts be identified in our available data?
        ▼
Claims + Pharmacy + Activity Data
        │
        ▼
Generate Business Rules
```

### 12.2 What Each Input Answers

|Input|Question It Answers|Contribution|
|---|---|---|
|**Clinical Context**|What are we trying to identify?|Defines the business objective and target care gap|
|**Evidence Sources**|How should this care gap be clinically defined?|Candidate eligibility, exclusions, thresholds, monitoring windows|
|**Market Definitions**|How do we measure these clinical concepts?|Converts vague clinical language (e.g., "moderate-to-severe") into measurable definitions and code mappings|
|**Medical Claims**|Can we identify these patients?|Determines technical feasibility via ICD, HCPCS, POS, dates|
|**Pharmacy Claims**|What medications has the patient received?|Enables therapy history, steroid exposure, biologic-naïve status|
|**Patient Activity Summary**|Is there enough longitudinal data to evaluate this patient?|Validates whether temporal rules (e.g., 12-month lookback) can be applied|

### 12.3 Worked Example

**Clinical Context →**

```
Find patients eligible for biologic therapy.
```

**Evidence →**

```
Patients with Moderate-Severe IBD + Steroid Failure + No Biologic
```

**Market Definitions →**

```
Moderate-Severe = Hospitalization OR CRP >10 OR Steroid >60 days
```

**Medical Claims →**

```
IBD → ICD10 | Hospitalization → POS | Procedure
```

**Pharmacy →**

```
Prednisone → NDC | Humira → NDC
```

**Activity →**

```
Need 12-month observation
```

**Resulting Rule Logic:**

```
Eligible if
  IBD Diagnosis
  AND Steroid Exposure >= 60 days
  AND No Prior Biologic
  AND 12-month Continuous Enrollment
  AND Moderate-Severe Disease
```

### 12.4 Mental Model — Five Types of Knowledge

|Input|Contributes|Role|
|---|---|---|
|Clinical Context|Business objective and target care gap|Defines **what** rules need to identify|
|Evidence Sources|Guideline recommendations and rationale|Defines **which** clinical criteria to consider|
|Market Definitions|Client-specific definitions and mappings|Converts clinical concepts into **measurable** definitions|
|Medical & Pharmacy Claims|Available diagnoses, procedures, meds, dates|Determines **how** rules can be implemented in available data|
|Patient Activity Summary|Observation period and enrollment history|Validates **whether** sufficient longitudinal data exists|

Together, these transform a high-level clinical recommendation into a business rule package that is clinically grounded, client-specific, and technically executable.

---

## 13. Prompt Architecture

**Design principle:** use a _dynamic_ prompt template with injected sections, not one static monolithic prompt — this makes the LLM reusable across disease areas (IBD, Oncology, Diabetes, RA, etc.).

```
                    Base System Prompt
                           +
                  Clinical Context
                           +
                  Claims Summary
                           +
                Market Definitions
                           +
                 Evidence Summary
                           +
                 Output Granularity
                           ↓
                 Final Runtime Prompt
```

### 13.1 Base System Prompt (Disease-Agnostic)

```
You are an expert Clinical Business Rule Author specializing in
pharmaceutical care gaps.

Your responsibility is to generate the first draft of evidence-grounded
business rules for an already-defined care gap.

Your objective is NOT to discover new care gaps. Your objective is to
translate the supplied clinical objective into structured business rules
that are:
• Clinically accurate
• Supported by evidence
• Technically executable using available datasets
• Easy for therapy-area scientists to review

You must only use information supplied in the context. If sufficient
evidence is unavailable, explicitly state the assumption instead of
inventing rules.

Generate the output using these sections:
1. Clinical Summary
2. Eligibility Criteria
3. Exclusion Criteria
4. Temporal Rules
5. Threshold Rules
6. Required Data Elements
7. Rule Logic
8. Evidence Mapping
9. Assumptions
10. Confidence
```

### 13.2 Injected Section: Clinical Context

```
## Clinical Context
Disease Area:       Inflammatory Bowel Disease
Care Gap:            Patients with moderate-to-severe IBD who remain on
                     prolonged oral corticosteroids without initiation
                     of biologic therapy.
Business Objective:  Identify patients likely eligible for biologic therapy.
Therapy Area:        Gastroenterology
Target Population:   Adult IBD patients
```

### 13.3 Injected Section: Claims Summary (Summarized, Not Raw Schema)

```
## Available Data
Medical Claims
  • Diagnosis Codes (ICD10)
  • Procedure Codes (HCPCS/CPT)
  • Service Date
  • Provider NPI
  • Place of Service

Pharmacy Claims
  • NDC
  • Drug Name
  • Fill Date
  • Days Supply
  • Quantity

Patient Activity
  • First Activity Date
  • Last Activity Date
  • Continuous Observation Period
```

### 13.4 Injected Section: Market Definitions

```
## Business Definitions
Moderate-Severe IBD defined as:
  Steroid dependence OR Hospitalization OR CRP >10 OR Fecal Calprotectin >250

OCS Exposure defined as:
  Prednisone, Budesonide, Methylprednisolone

Biologic Therapy defined as:
  Humira, Skyrizi, Remicade, Entyvio
```

### 13.5 Injected Section: Evidence Summary

```
## Evidence Summary
Source:            AGA Clinical Guideline 2024
Recommendation:    Patients with moderate-to-severe IBD who remain steroid
                   dependent should transition to biologic therapy.
Evidence Strength: Strong
---
Source:            ACG Guideline
Recommendation:    Long-term corticosteroid therapy should be avoided.
Evidence Strength: High
```

### 13.6 Injected Section: Output Instructions

```
## Required Output
Generate rules at: Patient Level
Output should identify: Eligible Patients
Required fields: Patient ID, Care Gap Flag, Rule Explanation, Evidence Reference
```

### 13.7 Assembled Runtime Prompt

```
SYSTEM PROMPT
    ↓
Clinical Context
    ↓
Available Claims Data
    ↓
Market Definitions
    ↓
Evidence Summary
    ↓
Output Instructions →  Eligibility, Exclusions, Temporal Rules,
                        Threshold Rules, Evidence Mapping, Rule Logic
```

### 13.8 Recommended Preprocessing Layer (Differentiator)

Rather than passing raw schemas or raw guideline PDFs into the final rule-generation prompt, introduce a lightweight preprocessing stage:

|Stage|Function|
|---|---|
|**Claims Profiler**|Converts the claims schema into a concise "Available Data Capabilities" summary (e.g., diagnoses available, pharmacy history available, enrollment available, labs unavailable)|
|**Evidence Extractor**|Parses guidelines into structured recommendations with evidence grades|
|**Market Definition Normalizer**|Standardizes client-specific definitions (e.g., what "moderate-to-severe IBD" means for this engagement)|

The rule-generation LLM then receives these **structured summaries**, not raw inputs. This keeps the prompt compact, reduces hallucinations, and produces far more consistent output.

In practice, this turns the workflow into a **Retrieval-Augmented Generation (RAG) pipeline followed by a deterministic rule-authoring step** — far more scalable than a single oversized prompt.

---

## 14. Roadmap Beyond the POC

|Phase|Capability|
|---|---|
|POC|Predefined parameter editing, mocked/optional patient counts, English rule logic|
|Phase 2|Conversational/free-form rule editing replacing the parameter panel|
|Phase 3|Live execution against real-world data with true patient-count impact|
|Phase 4|Full governance: versioning, approval workflows, audit trails|
|Phase 5|Export to SQL / Spark / Drools / rules engine for production deployment|

The parameter panel in the POC is designed so it can evolve into a conversational rule editor later, and "Generate Updated Rules" can be replaced with live AI-assisted refinement — without changing the overall user experience.

---

## Summary

|Aspect|Detail|
|---|---|
|**What this is NOT**|A care gap _discovery_ tool|
|**What this IS**|An evidence-grounded _rule authoring_ assistant for already-known care gaps|
|**POC hypothesis**|AI can produce a clinically meaningful first draft faster than the current multi-week manual process|
|**Key design choice**|Structured parameters, not free-form chat — for traceability and simplicity|
|**Key differentiator**|Evidence-to-rule traceability + a RAG-based preprocessing layer instead of one giant prompt|