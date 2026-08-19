# Legal review required

This file is **not legal advice**. It was produced by reading the two repositories
(`home-app-ui`, `home-app-api`) and recording what the code actually does, so that a
qualified lawyer can review a factual description rather than reconstruct the system.

Every factual claim below is drawn from code. Where the code cannot answer a question, the
question is listed rather than guessed.

**Last updated:** 2026-08-19

---

## 1. Blocking: the legal entity is unknown

Nothing in either repository establishes a legal entity. `internal/brand` contains a
product name, a domain and a default sender address, and nothing else.

KVKK art. 10 makes the identity of the data controller a mandatory element of a privacy
disclosure. Accordingly:

- `src/lib/legal-facts.ts` holds every company fact, with unknown values as `null`.
- No page renders a placeholder such as `[COMPANY NAME]`.
- Documents whose honesty depends on naming the controller are gated behind
  `legalDocumentsArePublishable` and are **not published** until the facts exist.

### Required before the privacy, KVKK, terms and cookie documents can be published

| Field | Status |
|---|---|
| Legal entity name and form | **MISSING** |
| Trade registry number | **MISSING** |
| MERSIS number | **MISSING** |
| Tax office and number | **MISSING** |
| Registered address | **MISSING** |
| Contact: support / privacy / legal / security / IP / content reports | **MISSING** |
| Minimum permitted age | **LEGAL DECISION REQUIRED** — nothing in the code sets one |
| Hosting region for database and object storage | **MISSING** |
| VERBIS registration applicability | **LEGAL DECISION REQUIRED** |

---

## 2. What the product actually does

### Authentication
- Email one-time code, and Google Identity Services.
- Access token 15 min, refresh token 30 days, OTP 10 min.
- Refresh tokens stored as hashes (`auth_sessions.refresh_token_hash`).
- Request IP is stored **hashed only** (`email_verification_codes.request_ip_hash`).

### Cookies (the complete set — there are no others)
| Name | Flags | Purpose | Category |
|---|---|---|---|
| `bosagezme_access` | httpOnly, secure (prod), sameSite=lax, path `/` | access token | strictly necessary |
| `bosagezme_refresh` | httpOnly, secure (prod), sameSite=strict, path `/api/auth` | refresh token | strictly necessary |
| `bosagezme_visitor` | — | anonymous visitor session | strictly necessary |
| `bosagezme_locale` | not httpOnly, 1 year | language preference | preference |

**There are no analytics, advertising or marketing cookies.** No Google Analytics, Tag
Manager, Sentry, PostHog, Mixpanel, Hotjar or Meta pixel appears anywhere in `src/`.

→ **Counsel question:** does the current cookie set require a consent banner, or does it
fall within strictly necessary plus a user-set preference?

### Browser storage
- `localStorage`: last device geolocation fix.
- `sessionStorage`: search snapshot, search-origin attribution.

### Third parties actually used
| Party | What is sent | Destination |
|---|---|---|
| OpenAI | **search query text and locale only** | api.openai.com (US) |
| Google Places | query, coordinates, radius | places.googleapis.com |
| Google Identity Services | browser loads gsi/client | Google |
| Gmail API | authentication email delivery | gmail.googleapis.com |
| Object storage | uploaded media | `OBJECT_STORAGE_PROVIDER` (gcs in local config) |

**Verified detail:** `intentPrompt()` interpolates only `c.Locale` and `query`. The
`Context` struct carries latitude and longitude but they are **never** placed in the
prompt. Coordinates, user id and email are therefore not sent to OpenAI. If that prompt
changes, the privacy documents must change with it.

→ **Counsel question:** processor status and international transfer mechanism for Google
and OpenAI under the post-2024 KVKK art. 9 regime.

### Location — three distinct behaviours
1. **Search coordinates** — rounded before storage. `SEARCH_LOCATION_DECIMALS` default `3`
   (≈110 m), stored in `searches.request_latitude/longitude`.
2. **Visit verification** — `store_visit_verifications` stores **no coordinates at all**,
   only `verification_distance_meters` and `reported_accuracy_meters`.
3. **Saved discovery location** — `user_private_profiles.discovery_location` is a
   **full-precision** `geography(Point,4326)` with label, address, place id and accuracy.

Because of (3), no document may claim that precise location is not stored.

### Sensitive profile data
`user_private_profiles` stores `relationship_status`, `has_children`,
**`children_age_ranges`**, `housing_status`, `occupation`, `age_range`,
`home_style_interests`.

→ **Counsel question:** this is household and family-composition profiling including data
about children. Which processing condition applies, and does it require explicit consent
rather than legitimate interest?

### Retention (implemented in `cmd/privacy-maintenance/main.go`)
| Data | Period |
|---|---|
| `searches` | 365 days |
| Search coordinates | nulled after 30 days |
| `visitor_sessions` | 180 days / on expiry |
| `email_verification_codes` | 30 days |
| `auth_sessions` | 30 days after expiry or revocation |
| `store_visit_verifications` | 30 days after expiry or consumption |
| `email_outbox` | 90 days (sent/failed) |

⚠ **It is a one-shot binary, not a scheduler.** Whether it runs in production, and how
often, cannot be determined from the repository.
→ **Operational question:** is it scheduled? If not, no stated retention period is true.

**Not covered by any retention job** (persist indefinitely): posts, comments, likes,
follows, favorites, media, `user_private_profiles`, `search_results`,
`search_interactions`, `platform_events`, daily metric tables.

### Account deletion
Deletes: likes, follows, favorites, searches, visit verifications, push devices,
notification preferences and outbox, private profile (including saved location),
verification codes and pending mail for the address.
Anonymises: post and comment bodies emptied and soft-deleted; profile becomes
"Deleted user"; username released; media marked deleted; analytics user link severed;
sessions revoked.
**Retains:** `users.primary_email`, with `status='inactive'` and `deleted_at` set, so that
signing in again reactivates the account. Reactivation restores the account but **not** the
content.

→ **Counsel question:** is retaining the email address for reactivation defensible, and for
how long?

---

## 3. What does NOT exist

- **No content reporting or moderation system.** No reports table, no moderation
  endpoints, no appeals mechanism, no enforcement tooling. `reporting.Service` in the
  backend is internal analytics, not abuse reporting.
- **No marketing or promotional messaging.** Only transactional mail (OTP, welcome).
- **No payment, cart, order or checkout code** anywhere in either repository.
- **No store ownership verification.**
- **No paid placement, sponsorship or advertising.**

→ **Counsel questions:**
- 5651 classification and what notice-and-takedown obligations follow.
- Whether a notice-and-action mechanism is required before further growth.
- Whether 6563 / İYS obligations are triggered at all today (probably not, since no
  commercial electronic communication is sent).

---

## 4. Checklist for external counsel

- [ ] Correct legal entity identity and its use across all documents
- [ ] Terms enforceability under Turkish law
- [ ] Governing law and competent courts, subject to mandatory consumer jurisdiction
- [ ] Minimum user age
- [ ] KVKK data controller role and scope
- [ ] Processing-condition mapping per activity (art. 5/6), stated specifically
- [ ] Retention periods, including the data with no retention job
- [ ] International transfers and the art. 9 mechanism relied on
- [ ] Processor status of Google (Places, Identity, Gmail, storage) and OpenAI
- [ ] Standard contracts / adequate safeguards
- [ ] VERBIS applicability
- [ ] Cookie consent requirement for the current cookie set
- [ ] Marketing / İYS applicability (currently no marketing messages exist)
- [ ] UGC liability and platform role
- [ ] Law No. 5651 role and classification
- [ ] IP notice and takedown process
- [ ] Consumer law applicability given nothing is sold
- [ ] DSA applicability and whether EU recipients are targeted
- [ ] GDPR applicability
- [ ] EU representative requirement
- [ ] German targeting and Impressum requirement (a German translation alone does not decide this)
- [ ] Children's privacy, given `children_age_ranges` is collected
- [ ] Terms acceptance evidence: what to log, and whether logging it adds personal data
- [ ] Account deletion and email retention behaviour
- [ ] Law enforcement request process

---

## 5. Signup consent design — not yet implemented

The brief distinguishes three legally separate concepts that must not be merged:

1. **Acknowledgement** — "I have read the Privacy Notice"
2. **Contract acceptance** — "I agree to the Terms of Service"
3. **Optional consent** — marketing communications

The current sign-in dialog presents none of these. Implementing them requires the
documents to exist first, and recording acceptance would require a backend change
(terms version, privacy version, timestamp, user id). That change is **documented here
rather than made**, so the API contract is not altered silently.
