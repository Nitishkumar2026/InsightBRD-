# 🤖 InsightBRD+: Advisor & Simulation Logic (Phase 11)

This document defines the logic for the "Negotiation Assistant" and the "What-if Simulation Engine."

---

## 🤝 1. AI Negotiation Assistant
**Goal**: Provide automated compromise proposals for detected conflicts.

### **Logic Flow**
1.  **Input**: Two conflicting requirements ($R_a$, $R_b$) and their associated stakeholders.
2.  **Trade-off Analysis**:
    - Identify the core "Value Driver" (e.g., Performance vs. Cost, Security vs. UX).
    - Check stakeholder influence scores.
3.  **Proposal Patterns**:
    - **Phased Approach**: "Feature X in Sprint 1, Enhancement Y in Sprint 3."
    - **Minimum Viable Standard**: "Support SSO (Req A) but skip Biometrics (Req B) for MVP."
    - **Data-Driven Delay**: "Wait for User Feedback on X before deciding on Y."

### **Formula for "Optimal Compromise"**
The system will prefer proposals that minimize the **Alignment Score** drop.

---

## 🔮 2. "What-if" Impact Simulation
**Goal**: Predict the "Ripple Effect" of a requirement change.

### **The Simulation Engine**
We use a **Directed Acyclic Graph (DAG)** to model dependencies.

**Inputs**:
- $R_{target}$: The requirement being changed (e.g., "Delay Payment Gateway by 2 weeks").
- $D_{graph}$: Dependent requirements (e.g., "Subscription Logic" depends on "Payment Gateway").

**Impact Calculation**:
1.  **Timeline Impact**: $\sum \text{Slack time of dependents}$.
2.  **Sentiment Impact**: If $R_{target}$ belongs to a High-Influence stakeholder, predict a $-0.3$ drop in sentiment for them.
3.  **Risk Delta**: Recalculate **Risk Score** with simulation parameters.

---

## 💹 3. Advanced Visualizations
- **Influence Radar**: A polar chart mapping stakeholder power vs. alignment.
- **Impact Heatmap**: A matrix showing which modules are "tightly coupled" and risky to change.
