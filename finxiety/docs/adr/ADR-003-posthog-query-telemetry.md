# ADR-003: PostHog Query Telemetry

**Date:** 2026-06-19  
**Status:** Accepted  
**Decided by:** Naomi Pinto

---

## Context

The search-first homepage (introduced in the v1 redesign) accepts free-text queries from users. Understanding what people actually type is product-critical: it tells us which tools to build next, which keywords to add to the search index, and which needs the current tool set doesn't serve.

The existing CLAUDE.md non-negotiable reads: "No PII. No user data stored, transmitted, or logged anywhere."

This ADR documents a deliberate, narrow deviation from that rule.

---

## Decision

Add PostHog to capture a single custom event — `query_submitted` — whenever a user submits a search query on the homepage.

**Event payload:**
```json
{
  "query": "<the text the user typed>",
  "result_count": 3,
  "top_result_id": "cliff-calculator"
}
```

**What is NOT captured:**
- User identity of any kind
- Session identifier across visits
- Clicks, form values, page structure, or any DOM data
- IP address (PostHog masks IPs by default on the free tier)

**PostHog configuration (non-negotiable):**
- `autocapture: false` — prevents any automatic DOM/form capture
- `capture_pageview: false` — no automatic page view tracking
- `persistence: 'memory'` — no cookies, no localStorage, no cross-visit tracking

**Delivery method:** PostHog script snippet in `app.html`, loaded async from PostHog's CDN. Not bundled into the JS bundle (keeps ~80 KB out of the main bundle, relevant for data-limited users).

---

## What This Means for the Privacy Posture

Query text is behavioral data, not personally identifiable information. A query like "I got a raise and I'm worried about losing food stamps" does not identify an individual. However, combined with other signals it could become sensitive context.

Mitigations in place:
1. No persistent user identifier — every visit is anonymous in PostHog
2. `persistence: 'memory'` means PostHog forgets the session on tab close
3. One-line disclosure shown to users below the search chips: "What you type isn't stored or tied to you." This is intentionally accurate: query text is sent to PostHog but not tied to any identifier
4. If PostHog is not initialized (e.g., ad blocker, script error), the search still works — telemetry is non-blocking

---

## Scope Constraints

This ADR authorizes **only** the `query_submitted` event. Any additional PostHog events, autocapture, pageview tracking, or session recording require a new ADR and Naomi's explicit approval.

---

## Reversibility

To remove telemetry entirely: delete the PostHog snippet from `src/app.html` and the `posthog.capture()` call in `src/routes/+page.svelte`. No data migration needed. PostHog's free tier data can be deleted from the PostHog dashboard.

---

## Alternatives Considered

- **Vercel Analytics:** Provides aggregate page-view data but does not support raw event text. Could not fulfill the "see what people actually typed" requirement.
- **No telemetry:** Leaves product decisions data-blind at a critical early stage. Rejected.
- **Full analytics (autocapture on):** Introduces PII risk through form field capture. Rejected.
