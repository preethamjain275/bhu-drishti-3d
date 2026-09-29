<div align="center">

# 🌐 BhuSetu

### **AI-Powered Geospatial Harmonization & Urban Land Intelligence**

*Bridging fragmented land records into trusted, explainable and human-verified geospatial intelligence.*

<br/>

<a href="#-overview">
  <img src="https://img.shields.io/badge/AI-Geospatial%20Intelligence-0EA5A4?style=for-the-badge&logo=googlemaps&logoColor=white" />
</a>
<a href="#-architecture">
  <img src="https://img.shields.io/badge/GIS-Spatial%20Harmonization-0891B2?style=for-the-badge&logo=mapbox&logoColor=white" />
</a>
<a href="#-human-in-the-loop">
  <img src="https://img.shields.io/badge/Human-Human%20Verification-D4A017?style=for-the-badge&logo=shield&logoColor=white" />
</a>
<a href="#-auditability">
  <img src="https://img.shields.io/badge/Records-Auditable-334155?style=for-the-badge&logo=databricks&logoColor=white" />
</a>

<br/><br/>

<!-- Animated project banner -->

<img src="https://capsule-render.vercel.app/api?type=waving&color=0B1220,0F766E,0EA5A4&height=220&section=header&text=BhuSetu&fontSize=72&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=From%20Fragmented%20Data%20to%20Verified%20Geospatial%20Intelligence&descAlignY=62&descSize=18" width="100%" />

</div>

---

## 🛰️ What is BhuSetu?

**BhuSetu** is an AI-powered geospatial intelligence platform designed to harmonize fragmented land and spatial datasets.

Urban land information can come from multiple sources:

* 🗺️ Survey datasets
* 🏛️ Administrative records
* 🏗️ Municipal / built-environment data
* 🛰️ Satellite or imagery-derived data
* 📐 Spatial survey data
* 📊 Attribute databases
* ⏳ Datasets captured at different points in time

These sources may use different coordinate systems, schemas, geometries, identifiers and temporal references.

BhuSetu creates a structured pipeline to:

> **Ingest → Standardize → Align → Harmonize → Detect Conflicts → Investigate Evidence → Human Verify → Audit**

The platform does **not** blindly replace one source with another.

Instead, it preserves provenance, explains disagreements and keeps the final verification under authorized human control.

---

<div align="center">

### 🌉 **BhuSetu = Bhu + Setu**

**Bhu** → Land / Earth
**Setu** → Bridge

> A digital bridge between fragmented land and geospatial records.

</div>

---

# ✨ Core Idea

```text
                 FRAGMENTED GEOSPATIAL DATA
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   Survey Data       Administrative      Imagery / GIS
                         Data                Data
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ▼
                  ┌─────────────────┐
                  │   BhuSetu AI    │
                  │  GIS Pipeline   │
                  └────────┬────────┘
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
       Standardize     Align Data    Match Entities
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                    HARMONIZATION
                           │
                           ▼
                  CONFLICT DETECTION
                           │
                           ▼
                  EVIDENCE ANALYSIS
                           │
                           ▼
                    AI INVESTIGATOR
                           │
                           ▼
                 HUMAN VERIFICATION
                           │
                           ▼
                  VERIFIED RECORD
                           │
                           ▼
                    AUDITABLE DATA
```

---

# 🧭 The BhuSetu Pipeline

<div align="center">

```text
┌────────────┐
│   SOURCES  │
└─────┬──────┘
      │
      ▼
┌────────────┐
│  INGESTION │
└─────┬──────┘
      │
      ▼
┌───────────────┐
│ STANDARDIZE   │
│ CRS • Schema  │
│ Geometry      │
└──────┬────────┘
       │
       ▼
┌───────────────┐
│ SPATIAL ALIGN │
└──────┬────────┘
       │
       ▼
┌───────────────┐
│ ENTITY MATCH  │
└──────┬────────┘
       │
       ▼
┌───────────────┐
│ HARMONIZATION │
└──────┬────────┘
       │
       ▼
┌───────────────┐
│   CONFLICTS   │
└──────┬────────┘
       │
       ▼
┌───────────────┐
│   EVIDENCE    │
└──────┬────────┘
       │
       ▼
┌───────────────┐
│ AI INVESTIGATOR│
└──────┬────────┘
       │
       ▼
┌───────────────┐
│ HUMAN REVIEW  │
└──────┬────────┘
       │
       ▼
┌───────────────┐
│ VERIFIED DATA │
└──────┬────────┘
       │
       ▼
┌───────────────┐
│ AUDIT TRAIL   │
└───────────────┘
```

</div>

---

# 🚀 Why BhuSetu?

Traditional geospatial workflows often require analysts to manually compare datasets that differ in:

| Challenge               | BhuSetu Approach                           |
| ----------------------- | ------------------------------------------ |
| Different CRS           | Reference-system detection & normalization |
| Different schemas       | Semantic field harmonization               |
| Different geometries    | Spatial comparison & alignment             |
| Different identifiers   | Entity matching                            |
| Boundary disagreement   | Conflict detection                         |
| Attribute disagreement  | Attribute-level comparison                 |
| Different capture dates | Temporal analysis                          |
| Unclear disagreement    | Evidence graph                             |
| Difficult investigation | AI-assisted investigator                   |
| Manual final decision   | Human verification                         |
| Poor traceability       | Versioning & audit lineage                 |

---

# 🧠 Intelligence Layer

BhuSetu combines deterministic GIS processing with AI-assisted reasoning.

### GIS handles what should be deterministic.

* CRS transformation
* Geometry validation
* Geometry repair
* Spatial intersection
* Distance calculations
* Area calculations
* Overlap detection
* Gap detection
* Spatial displacement
* Temporal comparison

### AI assists where interpretation is useful.

* Schema matching
* Entity matching
* Conflict explanation
* Evidence synthesis
* Investigation summaries
* Natural-language investigation queries

### Humans remain responsible for verification.

```text
             ┌─────────────────────┐
             │      GIS ENGINE     │
             │                     │
             │ Deterministic       │
             │ spatial analysis    │
             └──────────┬──────────┘
                        │
                        ▼
             ┌─────────────────────┐
             │     AI LAYER        │
             │                     │
             │ Explain • Synthesize│
             │ Assist • Recommend  │
             └──────────┬──────────┘
                        │
                        ▼
             ┌─────────────────────┐
             │   HUMAN REVIEWER    │
             │                     │
             │ Review • Modify     │
             │ Accept • Reject     │
             └──────────┬──────────┘
                        │
                        ▼
             ┌─────────────────────┐
             │   VERIFIED RECORD   │
             └─────────────────────┘
```

---

# 🗺️ Geospatial Intelligence

BhuSetu provides a spatial workspace where multiple representations can be examined together.

### Supported concepts

* Parcel boundaries
* Building footprints
* Administrative boundaries
* Survey geometries
* Imagery context
* Terrain
* Spatial overlays
* Conflict regions
* Evidence locations
* Temporal layers

### Spatial comparison

```text
SOURCE A                 SOURCE B
┌─────────────┐          ┌─────────────┐
│             │          │             │
│    ┌────┐   │          │   ┌──────┐  │
│    │    │   │          │   │      │  │
│    └────┘   │          │   └──────┘  │
│             │          │             │
└─────────────┘          └─────────────┘
        │                       │
        └──────────┬────────────┘
                   ▼
             DIFFERENCE
                   │
                   ▼
            EVIDENCE LAYER
```

---

# ⚠️ Conflict Intelligence

BhuSetu identifies different types of disagreement across sources.

### Conflict Types

* 🔲 Boundary Difference
* 🔄 Overlap
* 🕳️ Gap
* 📍 Positional Difference
* 📐 Geometry Difference
* 🏷️ Attribute Conflict
* 🏙️ Land-use Conflict
* 🔗 Entity Matching Ambiguity
* ⏳ Temporal Difference

Each conflict can include:

```text
Conflict
   │
   ├── Severity
   │
   ├── Sources
   │
   ├── Geometry
   │
   ├── Attributes
   │
   ├── Temporal Context
   │
   ├── Evidence
   │
   └── Investigation History
```

---

# 🔎 Evidence-Driven Investigation

BhuSetu doesn't stop at:

> “Conflict detected.”

It asks:

> **Why was this flagged?**

Evidence can originate from:

* Source metadata
* Spatial observations
* Attribute observations
* Temporal observations
* Processing transformations
* Imagery context
* Survey information
* Investigator notes

### Evidence Graph

```text
                 ┌─────────────┐
                 │   CONFLICT  │
                 └──────┬──────┘
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
        ┌──────────┐        ┌──────────┐
        │ SOURCE A │        │ SOURCE B │
        └────┬─────┘        └────┬─────┘
             │                   │
             └─────────┬─────────┘
                       ▼
                ┌─────────────┐
                │ OBSERVATION │
                └──────┬──────┘
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
       Supporting            Contradicting
        Evidence              Evidence
             │                   │
             └─────────┬─────────┘
                       ▼
                ┌─────────────┐
                │ INVESTIGATOR│
                └─────────────┘
```

---

# 🤖 AI Investigator

The AI Investigator works **inside the context of a specific geospatial conflict**.

Example questions:

```text
Why was this flagged?

Which datasets disagree?

What exactly differs?

What evidence supports the finding?

Could the capture date explain the difference?

What transformations were applied?

What evidence is missing?

What should I inspect next?
```

The AI response is explicitly distinguished from:

* Source facts
* System findings
* User observations
* Human decisions

### Trust Model

```text
SOURCE FACT
    ↓
SYSTEM FINDING
    ↓
AI INTERPRETATION
    ↓
HUMAN REVIEW
    ↓
VERIFIED RECORD
```

---

# 👤 Human-in-the-Loop

BhuSetu follows a simple principle:

<div align="center">

## **AI proposes. GIS analyzes. Evidence explains. Humans verify.**

</div>

A harmonization candidate can be:

```text
       ┌──────────────┐
       │   CANDIDATE  │
       └───────┬──────┘
               │
       ┌───────┼────────┐
       ▼       ▼        ▼
    ACCEPT   MODIFY   REJECT
       │       │        │
       │       ▼        │
       │   NEW VERSION  │
       │       │        │
       └───────┼────────┘
               ▼
       ┌──────────────┐
       │ VERIFIED     │
       │ RECORD       │
       └──────────────┘
```

Original source data remains immutable.

---

# 🧾 Auditability

Every meaningful transformation can be traced.

```text
SOURCE DATA
     │
     ▼
NORMALIZATION
     │
     ▼
SPATIAL ALIGNMENT
     │
     ▼
ENTITY MATCH
     │
     ▼
HARMONIZATION
     │
     ▼
CONFLICT
     │
     ▼
EVIDENCE
     │
     ▼
INVESTIGATION
     │
     ▼
HUMAN REVIEW
     │
     ▼
VERIFIED RECORD
```

A verified record retains:

* Source references
* Transformation history
* Evidence
* Candidate versions
* Reviewer decision
* Decision reason
* Timestamp
* Audit events

---

# 🏗️ System Architecture

```text
┌───────────────────────────────────────────────────────────────┐
│                         BhuSetu UI                            │
│                                                               │
│ React • TypeScript • Tailwind • shadcn/ui • Framer Motion    │
└───────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────┐
│                    APPLICATION SERVICES                       │
│                                                               │
│ Data • Harmonization • Conflicts • Evidence • Verification   │
│ Search • Notifications • Audit • Analytics                    │
└───────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────┐
│                   GEOSPATIAL / AI ENGINE                      │
│                                                               │
│ GDAL • GeoPandas • Shapely • Rasterio • PROJ                 │
│ Spatial Matching • Geometry Analysis • AI Investigation       │
└───────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────┐
│                         DATA LAYER                             │
│                                                               │
│ PostgreSQL • PostGIS • Object Storage • Audit/Event Store    │
└───────────────────────────────────────────────────────────────┘
```

---

# 🛠️ Technology Stack

### Frontend

| Technology                      | Purpose                       |
| ------------------------------- | ----------------------------- |
| ⚛️ React                        | Application UI                |
| 📘 TypeScript                   | Type-safe development         |
| 🎨 Tailwind CSS                 | Design system                 |
| 🧩 shadcn/ui                    | Reusable interface components |
| ✨ Framer Motion                 | Motion & transitions          |
| 🗺️ MapLibre                    | Interactive maps              |
| 🌐 Three.js / React Three Fiber | 3D geospatial visualization   |
| 🧭 Lucide                       | Interface icons               |

### Geospatial / Backend Architecture

| Technology    | Purpose               |
| ------------- | --------------------- |
| 🐍 Python     | Geospatial processing |
| ⚡ FastAPI     | API layer             |
| 🐘 PostgreSQL | Structured data       |
| 🗺️ PostGIS   | Spatial database      |
| GDAL          | Geospatial processing |
| GeoPandas     | Vector analysis       |
| Shapely       | Geometry operations   |
| Rasterio      | Raster processing     |
| PROJ          | CRS transformations   |

---

# 📂 Project Structure

```text
BhuSetu/
│
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   ├── maps/
│   │   ├── conflicts/
│   │   ├── evidence/
│   │   ├── verification/
│   │   ├── audit/
│   │   └── ui/
│   │
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── DataSources/
│   │   ├── Harmonization/
│   │   ├── Map/
│   │   ├── Conflicts/
│   │   ├── Evidence/
│   │   ├── Verification/
│   │   ├── VerifiedRecords/
│   │   └── Audit/
│   │
│   ├── services/
│   │   ├── datasets/
│   │   ├── harmonization/
│   │   ├── conflicts/
│   │   ├── evidence/
│   │   ├── verification/
│   │   └── audit/
│   │
│   ├── models/
│   ├── hooks/
│   ├── utils/
│   └── lib/
│
├── public/
│
├── README.md
├── package.json
└── ...
```

---

# 🔄 End-to-End Example

Imagine four datasets describe the same urban parcel.

```text
Survey
   │
   ├── CRS: EPSG:X
   ├── Parcel ID: A-1023
   └── Boundary: Geometry A
             │
             ▼
Municipal
   │
   ├── CRS: EPSG:Y
   ├── Property No: 1023
   └── Boundary: Geometry B
             │
             ▼
Imagery
   │
   └── Capture: 2025
             │
             ▼
Administrative
   │
   └── Land-use: Residential
```

BhuSetu processes them:

```text
CRS NORMALIZATION
        ↓
SCHEMA MAPPING
        ↓
ENTITY MATCHING
        ↓
SPATIAL ALIGNMENT
        ↓
GEOMETRY COMPARISON
        ↓
CONFLICT DETECTION
        ↓
EVIDENCE COLLECTION
        ↓
AI INVESTIGATION
        ↓
HUMAN REVIEW
        ↓
VERIFIED RECORD
```

---

# 🔐 Data Trust Model

BhuSetu intentionally distinguishes data states.

| State                       | Meaning                                       |
| --------------------------- | --------------------------------------------- |
| **Original Source**         | Unmodified source representation              |
| **Derived**                 | Produced through deterministic processing     |
| **System Finding**          | Computed observation                          |
| **AI-Assisted**             | AI-generated interpretation or suggestion     |
| **Harmonization Candidate** | Proposed integrated representation            |
| **Accepted Difference**     | Difference explicitly accepted during review  |
| **Human Verified**          | Explicitly verified by an authorized reviewer |
| **Sample Data**             | Demonstration-only data                       |

This separation is fundamental to the platform.

---

# 🎯 Key Design Principles

### 01 — Preserve the Source

Original datasets should remain untouched.

### 02 — Explain the Difference

A conflict should come with evidence, not just a red marker.

### 03 — Separate Fact from Interpretation

Source facts, system findings, AI interpretations and human decisions remain distinct.

### 04 — Human Authority

AI assists the workflow but does not silently verify records.

### 05 — Trace Everything

Every meaningful transformation should have provenance.

### 06 — Spatial First

Maps and spatial relationships remain central to the user experience.

### 07 — Evidence Before Decisions

Investigators should be able to inspect why a result was produced.

---

# 📊 Platform Modules

```text
┌─────────────────────────────────────────┐
│             BhuSetu Platform            │
├─────────────────────────────────────────┤
│                                         │
│  🏠 Intelligence Dashboard              │
│                                         │
│  📥 Data Sources                        │
│                                         │
│  🗺️ Geospatial Workspace                │
│                                         │
│  ⚙️ Harmonization Engine                │
│                                         │
│  ⚠️ Conflict Intelligence               │
│                                         │
│  🔎 Evidence & AI Investigator          │
│                                         │
│  👤 Human Verification                  │
│                                         │
│  🧾 Verified Records & Audit             │
│                                         │
│  📈 Analytics                           │
│                                         │
└─────────────────────────────────────────┘
```

---

# 🌟 What Makes BhuSetu Different?

BhuSetu is designed around a combination of:

**Geospatial Computing**

*

**Data Harmonization**

*

**AI-Assisted Investigation**

*

**Evidence & Provenance**

*

**Human Verification**

*

**Auditability**

Instead of treating AI as the final decision-maker, BhuSetu positions AI as an explainable layer inside a controlled geospatial workflow.

---

# 🎥 Suggested Demo Flow

For a live demonstration:

```text
01  Dashboard
       ↓
02  Select Data Sources
       ↓
03  Start Harmonization
       ↓
04  Show CRS / Schema / Spatial Alignment
       ↓
05  Generate Harmonization Candidate
       ↓
06  Open Conflict
       ↓
07  Explain "Why was this flagged?"
       ↓
08  Inspect Evidence
       ↓
09  Ask AI Investigator
       ↓
10  Open Verification
       ↓
11  Modify Candidate
       ↓
12  Complete Review Checklist
       ↓
13  Accept
       ↓
14  Verified Record
       ↓
15  Open Audit Trail
```

### The final story:

> **From fragmented geospatial data to an explainable, human-verified and auditable land record.**

---

# 🧪 Demo Environment

This repository may contain simulated/sample datasets and deterministic AI responses for demonstration purposes.

Sample records should **not** be interpreted as official government records.

Production deployment would connect BhuSetu to authorized data sources, geospatial processing services, AI services, authentication and persistent government infrastructure.

---

# 🚀 Getting Started

## 1. Clone

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

## 2. Install dependencies

```bash
npm install
```

## 3. Start development server

```bash
npm run dev
```

## 4. Open the application

```text
http://localhost:5173
```

---

# 🔮 Future Architecture

BhuSetu is designed to evolve toward:

```text
             ┌──────────────────┐
             │ Government Data  │
             │     Sources      │
             └────────┬─────────┘
                      │
                      ▼
             ┌──────────────────┐
             │ Secure Ingestion │
             └────────┬─────────┘
                      │
                      ▼
             ┌──────────────────┐
             │ GIS Processing   │
             │     Engine       │
             └────────┬─────────┘
                      │
                      ▼
             ┌──────────────────┐
             │ AI Investigation │
             └────────┬─────────┘
                      │
                      ▼
             ┌──────────────────┐
             │ Human Verification│
             └────────┬─────────┘
                      │
                      ▼
             ┌──────────────────┐
             │ Verified Spatial │
             │      Record      │
             └────────┬─────────┘
                      │
                      ▼
             ┌──────────────────┐
             │ Audit / Analytics│
             └──────────────────┘
```

---

# 🧩 Roadmap

* [x] Premium application foundation
* [x] Multi-source data intelligence
* [x] Geospatial workspace
* [x] Intelligent harmonization workflow
* [x] Conflict intelligence
* [x] Evidence & AI investigation
* [x] Human verification
* [x] Verified record workflow
* [x] Audit architecture
* [x] Analytics architecture
* [ ] Production geospatial backend
* [ ] Production authentication / RBAC
* [ ] Production-scale data persistence
* [ ] Real government data integrations
* [ ] Production AI services
* [ ] Large-scale geospatial optimization

---

<div align="center">

# 🌐 BhuSetu

### **Connecting Data. Understanding Space. Verifying Records.**

<br/>

**Fragmented Data**

↓

**Geospatial Intelligence**

↓

**Evidence**

↓

**Human Verification**

↓

**Trusted Spatial Records**

<br/>

---

### Built for intelligent, explainable and auditable land-record workflows.

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0B1220,0F766E,0EA5A4&height=120&section=footer" width="100%" />

</div>
