# Broker Playbook

Purpose: give Partner Intake OS a practical reference for brokers, ISOs, funding advisors, and funding agency owners. Use this when classifying brokers, recommending onboarding, creating CRM notes, and assigning resources/campaigns.

---

## Onboarding posture

Treat brokers as potential revenue partners, but do not confuse volume with quality. A broker with clean deal flow is a partner. A broker with mystery leads and guarantee language is a liability wearing a Bluetooth headset.

Evaluate:
- Deal flow.
- Lead source and consent.
- Funding product familiarity.
- Documentation discipline.
- Follow-up process.
- Compliance-safe language.
- CRM/tool maturity.
- Relationship quality.

---

## What makes a broker high-value

Strong indicators:
- Already sends or manages funding deals.
- Can describe target borrower profile.
- Has relevant business-owner audience.
- Uses CRM/tracking.
- Understands broad funding categories and use cases.
- Has repeatable follow-up.
- Collects docs cleanly.
- Avoids guarantee language.
- Wants enablement, product routing, and operational support.
- Can launch/referral within 7 days.

Example clues:
- “We submit 5–10 files per month.”
- “We work with contractors doing $30K–$150K monthly revenue.”
- “We need a missing-docs process.”
- “We have old leads to revive responsibly.”

Recommended:
- `partner_type: funding_broker` or `iso`.
- `partner_tier: tier_1` or `tier_2`.
- `onboarding_path: fast_track_revenue_partner` or `standard_affiliate_partner`.

---

## What makes a broker risky

Risk indicators:
- Purchased, scraped, aged, recycled, or non-consented lead source.
- Guaranteed approval, amount, or speed claims.
- “Bad credit does not matter for everyone.”
- MCA/revenue-based financing pushed as the only answer.
- Wants to send volume before understanding intake standards.
- No documentation process.
- Does not know industry, revenue, time in business, or use of funds.
- Credit repair or fake-doc shortcuts.
- Refuses manual review or safe copy rules.

Recommended:
- `risk_level: high` for severe risk.
- `manual_review_required: true`.
- `onboarding_path: reject_manual_risk_review` or `education_first_partner` if salvageable.

---

## Lead quality expectations

Good broker leads should include:
- Business owner name/contact.
- Business name.
- Industry.
- Time in business.
- Approximate monthly revenue.
- Use of funds.
- Timeline.
- Current debt/advance context if known.
- Bank statement status if known.
- Consent to contact.
- Lead source/context.

Weak lead indicators:
- “Needs money, call them.”
- No business name.
- No use of funds.
- No revenue context.
- No consent.
- Consumer-only inquiry.
- Fake urgency.

---

## Documentation expectations

Common categories:
- Recent business bank statements.
- Business identity/contact info.
- Revenue/cash-flow context.
- Use of funds.
- Current debt/advance obligations.
- Equipment quote/invoice when applicable.
- Invoices/AR details when applicable.
- Acquisition/franchise package when applicable.
- Tax returns/financials when applicable.

Safe language:
- “These documents help evaluate readiness and fit.”
- “Requirements vary by product, partner, and business profile.”

Avoid:
- “Send this and you are approved.”
- “No docs are needed.”
- “I can bypass underwriting.”

---

## Follow-up expectations

High-value brokers should:
- Respond quickly to missing info.
- Keep borrower expectations realistic.
- Track stages in CRM.
- Follow up without pressure or deception.
- Preserve clean handoff notes.
- Escalate questions rather than inventing answers.

Recommended stages:
1. New referral/intake received.
2. Missing info requested.
3. Documents pending.
4. Review in progress.
5. Follow-up needed.
6. Not ready/nurture.
7. Declined/alternative next steps.
8. Completed/funded/closed.
9. Renewal/future opportunity.

---

## Campaign recommendations

| Campaign | Use for | Angle | CTA | Guardrail |
|---|---|---|---|---|
| Broker Pipeline Revival | Old/stalled leads | Review readiness, missing docs, updated business context. | “Review your stalled funding pipeline.” | No promise old leads will fund. |
| Missing Docs Recovery | Borrowers gone quiet | Make doc requests clear and less chaotic. | “Send the missing-docs checklist.” | Docs do not equal approval. |
| Contractor Working Capital Check | Contractor audience | Materials, payroll, equipment, receivables. | “Check contractor funding readiness.” | No instant-funding pressure. |
| Equipment Upgrade Prep | Equipment-heavy businesses | Quote, use case, business docs. | “Prepare your equipment checklist.” | No guarantee equipment qualifies. |

---

## Resource recommendations

Default broker pack:
1. Funding Product Matrix.
2. Broker Follow-Up Machine.
3. Deal Intake Checklist.
4. Missing Docs Checklist.
5. Safe Language Guide.
6. Lead Submission Guidance.

New broker pack:
1. Funding Product Matrix.
2. Business Funding Readiness Checklist.
3. Broker onboarding checklist.
4. Safe Language Guide.

ISO pack:
1. Funding Product Matrix.
2. MCA/revenue-based financing education sheet.
3. Lead source and consent checklist.
4. CRM follow-up checklist.
5. Safe Language Guide.

---

## CRM note format

```text
Broker/ISO review: [name/company] appears to be [funding_broker/iso] with [deal flow/audience summary].
Tier recommendation: [tier_1/tier_2/tier_3/tier_4/reject] based on [audience, deal flow, trust, activation speed].
Risk level: [low/medium/high/reject]. Risk notes: [guarantee language, lead source, documentation gaps, compliance concerns].
Onboarding path: [fast_track_revenue_partner/standard_affiliate_partner/education_first_partner/reject_manual_risk_review].
Recommended resources: [resource list].
Recommended campaign: [campaign].
Next action: [schedule call/send resource pack/request lead source details/manual review].
```

---

## Training recommendations

For all brokers:
- Safe funding language.
- Product matrix overview.
- Lead quality and consent.
- Documentation collection.
- CRM stages.
- Missing-docs workflow.
- Referral handoff rules.

For new brokers:
- Funding product basics.
- Qualifying by use case and readiness.
- Avoiding overpromising.
- Managing borrower expectations.

For high-volume brokers:
- Referral routing standards.
- Campaign review.
- Pipeline reporting.
- Advanced follow-up automation.
- Partner performance review.

---

## Manual review triggers

Always trigger manual review when broker/ISO:
- Claims guaranteed approvals or amounts.
- Uses “everyone qualifies.”
- Uses credit repair language.
- Mentions fake docs, tradeline manipulation, or shortcuts.
- Buys/sells aged, scraped, or recycled leads.
- Has unclear lead consent.
- Requests commissions/payouts before approval.
- Wants high volume immediately without process review.
- Uses pressure tactics.
- Claims massive volume but has no CRM or process.
- Refuses safe language rules.

---

## Approval posture

Do:
- Fast-track clean brokers with real deal flow.
- Start newer brokers with education and one campaign.
- Require copy review for first campaign.
- Ask for lead source and documentation process.

Do not:
- Give dashboard/API access automatically.
- Send tracking links to high-risk brokers.
- Promise partner earnings.
- Let brokers use Moonshine/Partner Command Center language in ads without review.
- Treat lead volume as quality.
