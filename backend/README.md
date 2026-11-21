# GymFit Diet Planner

This module adds Java 21, Spring Boot 3.5.16, JPA, Flyway and MySQL to the existing React/Vite/Tailwind application. The existing routes and non-diet features remain in place.

## Existing-code analysis and migration

The original module was implemented in `frontend/src/pages/DietPlannerPage.jsx`, `components/diet/`, `utils/nutritionCalculator.js`, and `data/nutritionDatabase.js`. It had no compatible backend. Authentication remains the frontend's demonstration role switcher.

The three old diet keys are `gymfit_diet_state`, `gymfit_diet_profile`, and `gymfit_diet_plan`. New profiles, generated plans, meal edits, intake, and weight logs are saved through the API. The page only reads old diet keys for migration. It does not write or remove them. Theme storage is unaffected.

Migration is user initiated. The server computes a SHA-256 fingerprint, stores the exact raw browser strings in an ownership-scoped archive, and returns an idempotent receipt. A missing profile can be imported for review; it is flagged for special-diet review because old data did not capture safety requirements. Existing server profiles are not overwritten. Old meal totals are **not** treated as verified recipes or silently converted into new prescriptions. They remain downloadable from the archive; the user reviews the profile and generates a new server-validated plan. A failed import retains all original browser data.

Main frontend integration files:

- `src/services/apiClient.js`: fetch, bearer-token injection, timeout/cancellation, structured errors.
- `src/services/dietApi.js`: API operations. No provider API keys or user IDs are sent.
- `src/utils/dietProfileAdapter.js`: form/API mapping and legacy reads.
- `src/pages/DietPlannerPage.jsx`: profile → targets → one/seven-day generation, history and import.
- `src/components/diet/DietOnboardingWizard.jsx`: existing profile form, with allergy/budget/price/safety fields.
- `src/components/diet/BackendDietDashboard.jsx`: existing three-column meal layout, now persisted through the API.
- `src/components/diet/NutritionSummary.jsx` and `DietProgress.jsx`: estimates and weight history.
- `vite.config.js`: `/api` proxy. The original local calculator and demo components remain available for existing code/tests; the connected diet route does not use them to generate or persist plans.

## Run locally

Requirements: JDK 21, MySQL 8, Node/npm. The Maven wrapper downloads Maven 3.9.11 on its first run. Point `JAVA_HOME` to JDK 21 and confirm `java -version` before building.

Create a **dedicated** empty MySQL database and a user with privileges only on that database. Flyway creates the tables; do not point this module at an unrelated application's database. No root password or API key is supplied by this repository.

In PowerShell, from `backend`:

```powershell
$env:JAVA_HOME = 'C:\path\to\jdk-21'
$env:SPRING_PROFILES_ACTIVE = 'local'
$env:DB_URL = 'jdbc:mysql://127.0.0.1:3306/gymfit?connectionTimeZone=UTC'
$env:DB_USERNAME = 'gymfit'
# Configure DB_PASSWORD and optional USDA_API_KEY through your environment/secret manager.
.\mvnw.cmd spring-boot:run
```

`backend/.env.example` lists the variables; Spring does not automatically read a `.env` file. Do not commit real credentials. The local profile binds the API to `127.0.0.1:8080`.

In another PowerShell window:

```powershell
cd E:\gymFit\frontend
npm install
npm run dev
```

Open the existing `/member/diet-plan` route. The default Vite proxy forwards `/api` to `http://127.0.0.1:8080`. Set the server-only `GYMFIT_API_TARGET` variable before starting Vite to use another API port. For a separately hosted frontend, set `VITE_API_BASE_URL` to the backend origin and configure `FRONTEND_ORIGIN`. Vite variables are public: never put provider keys in them.

| Variable | Purpose |
| --- | --- |
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | Dedicated MySQL connection; password has no source-code default |
| `SPRING_PROFILES_ACTIVE=local` | Explicit localhost-only shared demo mode |
| `USDA_API_KEY` | Server-side USDA key; optional for the sourced local catalog |
| `USDA_CACHE_DAYS` | Search/detail cache lifetime; default 30 days |
| `USDA_MIN_REQUEST_INTERVAL_MS` | Minimum provider request interval; default 1000 ms; configure for your account |
| `SPOONACULAR_ENABLED` | Keep `false`; no licensed adapter is implemented |
| `SPOONACULAR_API_KEY` | Reserved server-side setting; currently unused |
| `FRONTEND_ORIGIN` | Exact allowed browser origin; default `http://localhost:5173` |
| `PORT`, `SERVER_ADDRESS` | Default 8080 / 127.0.0.1; demo mode rejects a public binding |
| `JWT_ISSUER_URI`, `JWT_AUDIENCE` | Required issuer / expected audience outside local demo mode |
| `REPORTING_TIME_ZONE` | Calendar zone used for progress reports and future-meal logging; default `Asia/Kolkata` |
| `CALORIE_DEFICIT`, `CALORIE_SURPLUS` | Moderate adjustments; defaults 300 / 250 kcal, bounded to 0–500 |
| `MINIMUM_CALORIES`, `MAXIMUM_CALORIES` | Automatic-planning bounds; defaults 1500 / 4000 |

## Identity and production boundary

Local mode uses **one shared demo identity**, independent of the React persona switcher. It is not real authentication or a multi-user production deployment. The UI labels it explicitly. Browser data imported in this mode belongs to that shared demo identity.

Outside `local`, startup requires an OIDC issuer. Spring Security validates JWT signature, issuer, expiry, audience and subject. Controllers derive identity from the authenticated principal and all personal lookups use that identity. Requests do not accept arbitrary user IDs. Connect a real frontend login through `setDietAccessTokenProvider`; the existing persona switcher is not an OIDC login. Do not publish the demo backend or use it for private real-user records.

The backend uses a single configured issuer. User IDs are opaque external identity-provider subjects rather than foreign keys into a nonexistent local login service. Profile IDs, food prices, recipes, recipe ingredients, plans and plan meals have their own relational keys and constraints. Plan versions prevent stale/concurrent edits.

## Nutrition and recommendation rules

The server calculates adult Mifflin–St Jeor BMR, activity-based TDEE, bounded goal adjustments, protein (1.6 g/kg maintenance or 2 g/kg gain/loss), 25% fat energy, and carbohydrate energy remaining after protein/fat. These are estimates for generally healthy adults. Minors, pregnancy/breastfeeding, medical dietary requirements and out-of-range estimates receive an explanatory 422 response rather than an automatic plan.

The deterministic engine:

1. Reads the saved profile and reviewed local recipes.
2. Checks every ingredient's dietary type, allergen tags, exclusions and optional availability list.
3. Calculates each recipe from ingredient quantity / nutrient-basis quantity / recipe servings.
4. Searches servings from 0.5× to 2.5× in quarter-serving increments, with a 1100 g total ingredient limit per meal.
5. Uses a bounded beam search over breakfast, lunch, snack and dinner. The score considers calories, protein, carbohydrate and fat, with a repetition penalty across the week.
6. Accepts only days within calories ±10%, protein 90–125%, carbs ±25%, fat ±30%, and the configured daily budget. It is a bounded heuristic, not a proof of global optimality.
7. Saves the entire requested plan transactionally. A day that fails validation causes an explanatory failure, not a partial or invented plan.

Budget prices are user-entered **INR per 100 g**, for each ingredient's named preparation state. Unknown prices remain unknown. A specified budget requires known prices for every ingredient used. They are not guessed, treated as zero, or confused with raw/cooked purchase weights. A restricted availability list must include all ingredients used, including oil and other staples; leaving it empty allows the full reviewed catalog.

Ingredient quantities and nutrient totals are frozen on the saved meal. Later catalog refreshes cannot rewrite recorded intake. Meal replacements and food additions/swaps are validated against the entire day's remaining totals, restrictions and budget. If the profile or prices changed, generate a new plan before editing the old one. Weight logs do not silently alter the profile or an existing plan.

## Saved progress reports

Flyway `V2__diet_progress_reports.sql` adds one database-backed report per diet plan. Restart the backend after installing the update so Flyway applies it to the configured MySQL database. Hibernate continues to validate the schema; there is no browser-storage fallback. The diet page displays the actual database product returned by its authenticated backend context.

Generating a plan creates its report in the same transaction. The report freezes a starting weight from an already-recorded measurement, or from the immutable profile snapshot if no measurement is available. New plans get separate reports; older plans and their reports remain available through the saved-plan selector. Plans created before this update receive a report on first access using their saved profile as the historical baseline.

Marking a meal eaten, undoing it, replacing/editing food, or recording weight refreshes the affected report snapshots in MySQL. Reads also refresh the reporting date as time passes without rewriting an unchanged snapshot. Report rows use optimistic versions to avoid silently overwriting newer progress.

Reports show the plan period, elapsed days, meals logged, logged calories/protein compared with targets, daily records, the starting and latest recorded weights, and weight change. Future days do not enter logging percentages; the API rejects marking future meals eaten. Unlogged meals mean unknown intake, not that the user ate nothing. Only weights within the plan period and no earlier than its baseline are used to calculate change. Averages use elapsed calendar days, including days without logs, and are labeled as logged intake. The UI also offers a CSV download from the saved server report and a chart only when at least two actual weights are recorded.

The original theme preference and read-only legacy-data import remain the only relevant browser-storage uses. New diet reports, weight entries, meal logs and generated plans are persisted by the backend.

## Data provenance and units

`src/main/resources/catalog/foods.json` contains 18 sourced foods. Sixteen come from the official [USDA SR Legacy CSV download](https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_csv_2018-04.zip), April 2018 release. Each stores its FDC ID, source link, composition and exact preparation state. The other two are explicitly identified as [Sabar Dairy's Amul paneer label](https://sabardairy.org/product/amul-fresh-paneer/) and [KVIC's dry soya-chunk composition](https://kviconline.gov.in/pmegp/pmegpweb/docs/commonprojectprofile/SoyaChunks.pdf). They are not represented as USDA or Spoonacular responses. Check the current product label when using branded products; missing fiber remains unknown.

All catalog nutrients are per **100 g**, including milk. Milk is weighed in grams; no unverified gram-to-milliliter conversion is used. Branded USDA serving quantities are retained as metadata; per-serving `labelNutrients` are not mixed into the per-100-g `foodNutrients` basis. kcal/kJ and g/mg conversions are handled explicitly. Missing energy/protein/carbohydrate/fat are not filled with invented values.

The 30 original GymFit local recipe templates specify measured dry or cooked ingredients and simple preparation instructions. Dry oats/flour/soya inputs are not presented as cooked portion weights. Roti uses dry flour input; rice, dal, chana, vegetables, eggs and chicken use the preparation state named in the food record. All calorie-bearing ingredients, including oil, are counted. The recipes are local authored templates, not attributed external recipe responses.

## External providers

USDA search and exact FDC-detail import run only on the server. Results are cached in MySQL; provider failures use existing food records with a visible notice. Timeouts, 429 cooldowns and malformed/missing nutrients are handled without automatic request storms. Search matches remain individually labeled: ambiguous foods are not silently interchanged. Newly imported foods are `UNCLASSIFIED`/unreviewed and cannot enter automatic recipes until their dietary and allergen metadata is reviewed.

See the [USDA API guide](https://fdc.nal.usda.gov/api-guide/) and [data-type documentation](https://fdc.nal.usda.gov/data-documentation/). The public demo key was rate-limited during development; normal operation should use your own environment-configured key. No key is bundled.

Spoonacular is deliberately an optional `SpoonacularRecipeProvider` interface with a disabled implementation. No requests, quota assumptions, endpoint-cost assumptions or stored Spoonacular content are present. The local catalog works independently. Implement an adapter only after confirming your account's endpoint access, quotas and storage/license terms. This is particularly relevant because the public [pricing FAQ](https://spoonacular.com/food-api/pricing) describes limited caching rights. Future wearable adapters can supply reviewed activity summaries without changing recipe selection; no wearable APIs or heart-rate-only calorie calculation are implemented.

## REST API

All diet/food endpoints require the configured principal (or explicit local demo mode). DTOs are returned instead of JPA entities. Validation failures return 400, missing owned records 404, stale/conflicting edits 409, impossible/unsuitable plans 422, unavailable providers without cached matches 503.

| Method / path | Purpose |
| --- | --- |
| `GET /api/v1/status` | Public mode/service status |
| `GET /api/v1/diet/context` | Current server-derived identity and demo flag |
| `POST /api/v1/diet/profile` | Create profile |
| `GET, PUT /api/v1/diet/profile` | Fetch/update profile |
| `POST /api/v1/diet/calculate` | Validated profile → estimates |
| `POST /api/v1/diet/generate` | `{startDate, days}` → persisted plan |
| `GET /api/v1/diet/plans` | Up to 30 latest owned plans |
| `GET /api/v1/diet/plans/{id}` | Owned plan with dates, ingredients and totals |
| `GET /api/v1/diet/plans/{id}/report` | Persisted, ownership-scoped progress report for that plan |
| `GET /api/v1/foods/catalog` | Reviewed local ingredient list |
| `GET /api/v1/foods/search?query=banana` | Cached/provider food search |
| `GET /api/v1/foods/{id}` | Internal food ID lookup |
| `GET /api/v1/foods/usda/{fdcId}` | Import/cache an exact selected USDA food |
| `GET /api/v1/diet/plans/{id}/meals/{mealId}/alternatives` | Valid replacement choices |
| `POST /api/v1/diet/replace-meal` | `{planId, mealId, recipeId, servingMultiplier, version}` |
| `POST /api/v1/diet/plans/{id}/meals/{mealId}/foods` | `{foodId, quantity, ingredientIndex, version}`; index -1 adds |
| `PUT /api/v1/diet/plans/{id}/meals/{mealId}/intake` | `{eaten, version}` |
| `POST, GET /api/v1/diet/progress` | Upsert daily weight / fetch history |
| `POST /api/v1/diet/import` | `{profile, legacyData}` → archive receipt |
| `GET /api/v1/diet/imports` | Owned migration receipts |
| `GET /api/v1/diet/imports/{id}` | Owned original-data archive |

## Verification

```powershell
cd backend
.\mvnw.cmd test
cd ..\frontend
npm test
npm run build
```

The default Java test profile uses H2 in MySQL mode with the real Flyway migration and JPA validation. Run the same API integration tests against a **disposable** MySQL database by setting `GYMFIT_TEST_DB_URL`, `GYMFIT_TEST_DB_USERNAME`, and `GYMFIT_TEST_DB_PASSWORD` before `mvnw test`. Tests create profiles/plans within rolled-back transactions; catalog startup creates source records. Do not use a production database.

Tests cover BMR/TDEE/macros, special requirements, ingredient/serving calculations, dietary and allergy checks, budget, one/seven-day generation, distinct profiles, ownership, replacements, stale writes, intake, progress, idempotent migration, normalization, provider cooldown and caching. Frontend tests cover the API client, errors/timeouts, profile mapping, nondestructive legacy reads, and existing anatomy/animation regressions. The original large frontend bundle warning is separate from this module.
## Nutrition Diary

Open **Nutrition Diary** from the member sidebar or the diet planner. Flyway V4 adds food entries, water logs and diary preferences to the configured MySQL database. The diary supports local and USDA food search, Indian recipes by serving, manual entries, portion edits, favorites, recent foods, and daily nutrition and hydration goals. A seven-day CSV summarizes records through the selected date. The diary works before diet onboarding. After onboarding it displays the existing profile's nutrition targets.

Diary intake and diet-plan checkmarks are independent. A diary entry records what the user entered, with a nutrient snapshot at the time of logging. Unknown fiber is preserved as missing. The service uses the authenticated account and the server reporting date. The test class `NutritionDiaryIntegrationTest` exercises the same routes on H2 in MySQL mode or disposable MySQL via the test environment variables above.

Flyway V5 adds meal templates, calendar reminders, a progress photo gallery, CSV activity import and nutrition groups. **Describe** lets a member confirm local food matches and portions before saving a batch. **Saved foods** can copy a named meal template containing all entries from a meal slot. The diary displays coverage of protein, fiber and water goals, and the member dashboard shows today's totals and logging streak.

Open **Nutrition tools** from the diary for the remaining web features. Download a recurring calendar event for each saved reminder. Upload existing JPEG or PNG images and select two dates to compare them. Images are re-encoded as JPEG without original metadata and are served only to the authenticated owner. Activity import accepts `date,steps,active_minutes` CSVs, with explicit confirmation before it replaces data on matching dates. Discoverable groups and invitation-only household spaces support check-ins, replies, reactions and a check-in leaderboard. Account records remain private to each member. Local demo mode shares one identity and is intended for synthetic data.

These web tools do not include automatic Health Connect or Apple Health sync, Android home-screen widgets, or paid family subscriptions. A ranked food health score is not provided. Goal coverage is calculated from the logged nutrients and the member's goals. Food capture and scanning are excluded.

## Home Workout

Start the backend with the same Java 21 and MySQL settings above, then run `npm run dev` from `frontend` and open **Home Workout** from the member dashboard or `/home-workout`. Flyway V3 adds the workout tables alongside the diet tables. Startup seeds the versioned local catalog into `home_exercises`. No API keys are needed for this module.

Complete onboarding, generate a weekly plan or a quick session, and start a workout scheduled for today. Log sets, optionally pause, then finish to see the session in History and Progress. A new plan keeps previously logged sessions. The player restores saved sets, exercise position, notes and pause state after a reload. Rest countdowns and unsubmitted sets are temporary.

The `/api/v1/home-workouts` routes cover profiles, exercise search, calendar edits, session commands, paged history, progress and challenge enrollment. Owner identity comes from Spring Security. The localhost demo uses a shared identity. Production requires an identity provider and the existing frontend token provider. The workout dashboard shares diet weight records and links to nutrition guidance. It does not change calorie targets.

The catalog contains original written guides and a placeholder illustration. The front and back selector uses schematic regions and links to the existing anatomy planner. No exercise videos ship with the home catalog. Exercise descriptions use the [ACE exercise library](https://www.acefitness.org/resources/everyone/exercise-library/) as a general reference. Gross calorie estimates use broad activity values from the [Adult Compendium](https://pacompendium.com/conditioning-exercise/) and include a low-intensity allowance for time without recorded activity. A recovery day can include optional light movement.

Run `mvnw.cmd test` in `backend` and `npm test` plus `npm run build` in `frontend`. Set `GYMFIT_TEST_DB_URL`, `GYMFIT_TEST_DB_USERNAME` and `GYMFIT_TEST_DB_PASSWORD` to exercise Flyway and the workout API against disposable MySQL. Workout integration tests commit synthetic records to verify persistence between requests, so use a test database.
