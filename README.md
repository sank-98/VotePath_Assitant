# VotePath BHARAT 🇮🇳
### A Production-Grade Decision Support System for Democratic Participation

VotePath BHARAT is an advanced, multilingual AI-powered assistant designed to empower Indian citizens with explainable, data-driven voting guidance. It moves beyond simple FAQ bots into a **Weighted Decision Engine** that translates personal priorities into candidate alignment.

---

## 🚀 Key Engineering Pillars

### 1. Advanced Decision Engine (Explainable AI)
- **Weighted Sum Model**: Implements a rigorous mathematical model to calculate candidate matching based on user-weighted issues (Economy, Education, Healthcare).
- **Confidence Metrics**: Provides a percentage-based alignment score for transparency.
- **Visual Analytics**: Utilizes Radar Charts (via Recharts) to explain *why* a specific candidate is recommended.

### 2. Google Services Integration
- **Google Maps Interaction**: Not just display—logic influences. The system detects user location to filter relevant constituency data and polling booths.
- **Gemini Pro 1.5 Integration**: Uses multimodal context to simplify complex electoral laws (Form 6, Form 26, etc.) into conversational guidance.
- **Calendar API**: One-click "Add to Calendar" for election dates to boost voter turnout.

### 3. Modern Full-Stack Architecture
- **Layered Security**: Input sanitization (XSS protection) and a validation layer in `src/services` to ensure data integrity before Firestore writes.
- **Real-Time Synergy**: Firebase Firestore provides live "Community Trends" dashboards, showing aggregated interest without compromising individual PII.
- **Optimized Performance**: Modular structure with lazy-loaded components and memoized UI units (Recharts) for high frame rates on mobile.

### 4. Accessibility (WCAG 2.1)
- Full keyboard navigation support.
- Consistent ARIA labeling for screen readers.
- High-contrast BSR (Bento Style Render) UI with responsive adjustments for all device sizes.

---

## 🛠 Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Motion
- **Analytics**: Recharts (Decision breakdown & Trend analysis)
- **Backend/DB**: Google Firebase (Firestore, Auth)
- **AI**: Google Gemini API (Decision Logic & Retrieval)
- **Mapping**: Google Maps Embed API

---

## 📂 Architecture Diagram
```text
/src
 ├── /components   --> Atomized UI (Analytics, Maps, Results)
 ├── /logic        --> Decision weighted scoring engine
 ├── /services     --> External API abstractions (Firebase, Maps)
 ├── /utils        --> Validation, Sanitization, Math helpers
 └── /data         --> Static election datasets
```

---

## 🛡 Security Rules (Firestore)
The system enforces a **Zero-Trust** model:
- Users can only read their own interaction history.
- Aggregate stats are read-only and restricted to specific fields.
- Write operations are limited to authenticated users with rate-limiting patterns.

---

## 🧪 Testing Coverage
- **Unit Tests**: Coverage for the `DecisionEngine` scoring algorithm.
- **Integration Tests**: Verification of Firebase data flow and sanitization.
- **Accessibility Audit**: Passed internal LH (Lighthouse) accessibility scores > 95.

---

## 🧪 Testing & Validation

### Decision Engine Logic Verification
The `DecisionEngine` uses a weighted sum algorithm ($S = \sum w_i s_i$). 
- **Test Case 1**: Equal weights across all issues (Economy: 5, Education: 5...).
  - *Expected*: Neutral ranking based on baseline candidate performance.
- **Test Case 2**: Ultra-high Economy weighting (Economy: 10, Others: 0).
  - *Expected*: Candidate Beta (Economy Score 9) should rank #1 with 90% confidence.
- **Test Case 3**: Invalid issue ID input.
  - *Expected*: Graceful degradation to baseline (0 weight contribution).

### Security Validation
- **XSS Prevention**: Input strings are sanitized before processing in `src/utils/validation.ts`.
- **Relational Integrity**: Firestore rules enforce that a user can only follow states linked to their own `uid`.

---

## 📸 Screenshots
*(Coming soon - See Live Preview for interactive BSR UI)*

---

## 🔮 Future Scope
- **Verification Integration**: Real-time integration with ECI's voter search API.
- **Candidate Affidavits**: Direct ingestion of Form 26 PDFs for real-time AI summarization of criminal/financial records.

**Developed with ❤️ for Indian Democracy.**
