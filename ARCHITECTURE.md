# Diet Tracker - Architecture

> **NOTA**: Lee `AGENTS.md` antes de trabajar en cualquier sprint.

---

## 1. Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.2.1 | App Router, SSR, API routes |
| React | 19.2.4 | UI library |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling (via CSS variables) |
| Framer Motion | 12.38.0 | Animations |

### Backend & Database
| Technology | Purpose |
|------------|---------|
| Supabase | Auth, PostgreSQL, Storage |
| @supabase/ssr | Server-side auth with cookies |

### AI & Vision
| Technology | Purpose |
|------------|---------|
| Ollama Cloud | Text and vision AI |
| @zxing/browser | Barcode scanning |

### PWA
| Technology | Purpose |
|------------|---------|
| next-pwa | Service worker generation |
| IndexedDB | Offline data storage |

---

## 2. Directory Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Auth: login, logout, register, session
│   │   ├── profile/           # Profile CRUD
│   │   ├── recipes/           # Recipe queries
│   │   ├── food-log/          # Food logging
│   │   ├── plans/             # Meal plans
│   │   ├── shopping-list/     # Shopping lists
│   │   ├── analyze-food/      # AI food analysis
│   │   ├── barcode-lookup/    # OpenFoodFacts
│   │   ├── generate-plan/     # Plan generation
│   │   ├── weekly-meals/      # Weekly meals
│   │   └── setup/             # DB schema setup
│   │
│   ├── (auth)/                 # Auth pages group
│   │   ├── login/
│   │   └── register/
│   │
│   ├── dashboard/             # Main dashboard
│   ├── recipes/               # Recipe browsing
│   ├── shopping/              # Shopping list
│   ├── profile/               # User profile
│   ├── settings/              # App settings
│   ├── onboarding/            # 9-step onboarding
│   ├── weekly-plan/           # Weekly planner
│   ├── coach/                  # AI Coach chat
│   │
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Root (redirects)
│   └── globals.css            # Global styles + design tokens
│
├── components/
│   ├── ui/                    # Shared UI components
│   │   ├── GlassCard.tsx
│   │   ├── Feedback.tsx
│   │   └── ...
│   │
│   ├── dashboard/             # Dashboard-specific
│   │   ├── MealCard.tsx
│   │   ├── MealList.tsx
│   │   ├── NutritionCard.tsx
│   │   └── WeekDaySelector.tsx
│   │
│   ├── add-food/              # Food input flow
│   │   ├── BarcodeTab.tsx
│   │   ├── CameraTab.tsx
│   │   ├── ManualEntryTab.tsx
│   │   └── PresetsTab.tsx
│   │
│   ├── recipes/               # Recipe components
│   ├── shopping/              # Shopping components
│   ├── profile/               # Profile components
│   ├── settings/              # Settings components
│   ├── onboarding/            # Onboarding components
│   ├── analytics/             # Analytics components
│   ├── coach/                  # AI Coach components
│   │
│   └── *.tsx                   # Shared components
│       ├── BottomNavBar.tsx
│       ├── AuthProvider.tsx
│       ├── ToastProvider.tsx
│       ├── MacroBar.tsx
│       ├── CalorieRing.tsx
│       └── ...
│
├── hooks/
│   ├── useAuth.ts             # Auth hook
│   ├── useOfflineSync.ts      # Offline sync hook
│   └── ...
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser client
│   │   └── server.ts          # Server client with cookies
│   │
│   ├── nutrition/
│   │   └── calculations.ts    # TMB/TDEE calculations
│   │
│   ├── offline-db.ts          # IndexedDB operations
│   └── ollama.ts              # Ollama API client
│
├── styles/
│   └── tokens.css             # CSS design tokens
│
├── data/
│   └── recipes.ts             # Static recipe data (450KB+)
│
├── types/
│   └── database.ts            # Supabase generated types
│
└── middleware.ts              # Route protection
```

---

## 3. Design System

### CSS Variables (from `globals.css`)

```css
/* Dark Theme (default) */
--bg-primary: #0D0D0D
--bg-secondary: #1A1A1A
--bg-card: rgba(255, 255, 255, 0.05)
--bg-glass: rgba(10, 10, 15, 0.8)

/* Light Theme */
--bg-primary-light: #FAFAFA
--bg-secondary-light: #F5F5F5

/* Accent Colors */
--accent: #22C55E           /* Green - primary */
--accent-warm: #F97316       /* Orange - energy/alerts */
--accent-secondary: #10B981

/* Text */
--text-primary: #FFFFFF
--text-secondary: #A1A1AA
--text-primary-light: #0D0D0D

/* Semantic */
--error: #EF4444
--success: #22C55E
--warning: #F97316

/* Macros */
--macro-protein: #3B82F6     /* Blue */
--macro-carbs: #EAB308       /* Yellow */
--macro-fat: #EF4444         /* Red */

/* Gradients */
--accent-gradient: linear-gradient(135deg, #22C55E 0%, #10B981 100%)
```

### Typography
```css
--font-sans: 'Inter', system-ui, sans-serif
--font-mono: 'JetBrains Mono', monospace

/* Sizes follow 4px base */
--text-xs: 0.75rem    /* 12px */
--text-sm: 0.875rem   /* 14px */
--text-base: 1rem     /* 16px */
--text-lg: 1.125rem   /* 18px */
--text-xl: 1.25rem    /* 20px */
--text-2xl: 1.5rem    /* 24px */
```

### Spacing & Sizing
```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 12px
--spacing-lg: 16px
--spacing-xl: 24px
--spacing-2xl: 32px

--input-height: 48px
--button-height: 52px
--nav-height: 56px
--touch-target: 44px
```

---

## 4. Authentication Flow

### Architecture
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   API Route │────▶│   Supabase  │
│  (Browser) │◀────│  (Next.js)  │◀────│    Auth     │
└─────────────┘     └─────────────┘     └─────────────┘
       │                  │
       │                  ▼
       │           ┌─────────────┐
       │           │   Cookie    │
       │           │  (session)  │
       │           └─────────────┘
       │
       ▼
┌─────────────┐
│ AuthProvider│ (React Context)
└─────────────┘
```

### API Routes

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/register` | POST | No | Create user + profile |
| `/api/auth/login` | POST | No | Sign in with email/password |
| `/api/auth/logout` | POST | Yes | Sign out |
| `/api/auth/session` | GET | No | Get current session |
| `/api/profile` | GET/PUT | Yes | Get/Update profile |

### Cookie Strategy
- Uses `@supabase/ssr` for automatic cookie management
- Cookies: `sb-[project-ref]-auth-token`
- HttpOnly, Secure, SameSite=Lax

### Middleware Protection
```typescript
// middleware.ts
const protectedRoutes = ['/dashboard', '/recipes', '/shopping', '/profile', '/onboarding']
const authRoutes = ['/login', '/register']

// Redirect logic:
// - Unauthenticated user → /login (for protected routes)
// - Authenticated user → /dashboard (for auth routes)
```

---

## 5. Database Schema (Supabase)

### Tables

#### profiles
```sql
id          UUID PRIMARY KEY REFERENCES auth.users
email       TEXT NOT NULL
name        TEXT
age         INTEGER
gender      TEXT ('male', 'female')
weight_kg   DECIMAL
height_cm   DECIMAL
activity_level TEXT ('sedentary', 'lightly_active', ...)
goal        TEXT ('lose', 'maintain', 'gain')
speed       TEXT ('slow', 'medium', 'fast')
daily_calories INTEGER
preferred_meals INTEGER DEFAULT 4
dietary_restrictions TEXT[]
created_at  TIMESTAMP DEFAULT now()
updated_at  TIMESTAMP DEFAULT now()
```

#### recipes
```sql
id          UUID PRIMARY KEY
name        TEXT NOT NULL
description TEXT
image_url   TEXT
prep_time   INTEGER  -- minutes
cook_time   INTEGER  -- minutes
servings    INTEGER
calories    INTEGER
protein     DECIMAL
carbs       DECIMAL
fat         DECIMAL
supermarket TEXT  -- 'mercadona', 'lidl', 'aldi', 'family'
ingredients JSONB
instructions JSONB
tags        TEXT[]
created_at  TIMESTAMP DEFAULT now()
```

#### weekly_plans
```sql
id          UUID PRIMARY KEY
user_id     UUID REFERENCES profiles
week_start  DATE
total_calories INTEGER
meals_per_day  INTEGER
is_active   BOOLEAN DEFAULT false
created_at  TIMESTAMP DEFAULT now()
```

#### plan_days
```sql
id          UUID PRIMARY KEY
plan_id     UUID REFERENCES weekly_plans
day_of_week INTEGER  -- 0-6
date        DATE
```

#### plan_meals
```sql
id          UUID PRIMARY KEY
plan_day_id UUID REFERENCES plan_days
meal_type   TEXT  -- 'breakfast', 'lunch', 'dinner', 'snack'
recipe_id   UUID REFERENCES recipes
planned_calories INTEGER
custom_name TEXT
custom_calories INTEGER
```

#### food_logs
```sql
id          UUID PRIMARY KEY
user_id     UUID REFERENCES profiles
date        DATE
meal_type   TEXT
description TEXT
calories    INTEGER
protein     DECIMAL
carbs       DECIMAL
fat         DECIMAL
image_url   TEXT
source      TEXT  -- 'manual', 'barcode', 'photo', 'recipe'
created_at  TIMESTAMP DEFAULT now()
```

#### shopping_lists
```sql
id          UUID PRIMARY KEY
user_id     UUID REFERENCES profiles
plan_id     UUID REFERENCES weekly_plans (optional)
created_at  TIMESTAMP DEFAULT now()
```

#### shopping_items
```sql
id          UUID PRIMARY KEY
list_id     UUID REFERENCES shopping_lists
ingredient_name TEXT
quantity    TEXT
unit        TEXT
supermarket TEXT
category    TEXT
checked     BOOLEAN DEFAULT false
```

### Row Level Security (RLS)
All tables have RLS enabled. Policies ensure users can only access their own data.

---

## 6. API Design

### Response Format
```typescript
// Success
{
  data: T,        // The payload
  error: null     // Always null on success
}

// Error
{
  data: null,
  error: string   // Error message
}
```

### Status Codes
| Code | Usage |
|------|-------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

### Example: Profile Update
```typescript
// PUT /api/profile
Request: { name?: string, weight_kg?: number, ... }
Response: { data: Profile, error: null }
```

---

## 7. Offline Strategy

### Architecture
```
┌─────────────────┐     ┌─────────────────┐
│   IndexedDB    │◀───▶│   Supabase     │
│  (Local Data)   │     │   (Server)     │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │   ┌───────────────────┘
         ▼   ▼
┌─────────────────┐
│  Sync Queue    │ (actions to sync)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Online/Offline  │
│    Status       │
└─────────────────┘
```

### IndexedDB Stores
- `profiles` - User profile cache
- `recipes` - Recipe database
- `plans` - Meal plans
- `food_logs` - Daily food entries
- `shopping_lists` - Shopping lists
- `sync_queue` - Pending sync actions

### Sync Strategy
1. All writes go to IndexedDB first
2. If online, sync to Supabase immediately
3. If offline, queue in `sync_queue`
4. On reconnect, process queue in order
5. Conflict resolution: server wins for profiles, merge for logs

---

## 8. Key Libraries Usage

### @supabase/ssr
```typescript
// Server Component
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()

// Client Component
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
supabase.auth.onAuthStateChange((event, session) => { ... })
```

### Framer Motion
```typescript
// Page transitions
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
>

// Gesture animations
<motion.div
  drag="x"
  dragConstraints={{ left: -100, right: 100 }}
>
```

### @zxing/browser
```typescript
const codeReader = new BrowserMultiFormatReader()
codeReader.decodeFromVideoDevice(
  undefined,  // default camera
  videoElement,
  (result) => { console.log(result.getText()) }
)
```

### Ollama Cloud
```typescript
// Text generation
POST https://ollama.cloud/api/generate
{ model: "llama3.2", prompt: "..." }

// Vision
POST https://ollama.cloud/api/generate
{ model: "llava-llama3", prompt: "...", images: [base64] }
```

---

## 9. Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx  # Server-side only!

# Ollama Cloud
OLLAMA_BASE_URL=https://ollama.cloud
OLLAMA_TEXT_MODEL=llama3.2
OLLAMA_VISION_MODEL=llava-llama3

# Resend (email, optional)
RESEND_API_KEY=xxx
```

---

## 10. Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Lighthouse Performance | > 90 |
| Initial Bundle Size | < 200KB |
| Core Web Vitals | All Green |

### Optimization Strategies
- Code splitting per route
- Lazy loading heavy components (recipes list, analytics)
- Image optimization with next/image
- Font subsetting and preload
- Service worker caching
- Virtual scrolling for long lists

---

## 11. Security Considerations

1. **Supabase Admin Key**: Never exposed to client, only in API routes
2. **RLS Policies**: All tables enforce user-scoped access
3. **Cookie Security**: HttpOnly, Secure, SameSite=Lax
4. **Input Validation**: Zod schemas on all API inputs
5. **CORS**: Only allow same-origin in API routes
6. **Environment Variables**: Use `.env.local` not committed

---

## 12. Testing Strategy

### Unit Tests (Vitest)
- Nutrition calculations
- Utility functions
- Component logic

### Component Tests (React Testing Library)
- Form components
- UI components
- Hook behavior

### API Tests
- Request/response validation
- Auth checks
- Error handling

### E2E Tests (Playwright)
- Auth flow (register → login → logout)
- Onboarding flow
- Food logging flow
- Plan generation
- Shopping list

### Coverage Target
- Overall: > 80%
- Critical paths: 100%

---

## 13. File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase.tsx | `MealCard.tsx` |
| Hooks | useCamelCase.ts | `useAuth.ts` |
| Utils | camelCase.ts | `nutrition.ts` |
| API Routes | route.ts | `route.ts` |
| Pages | page.tsx | `page.tsx` |
| Styles | kebab-case.css | `tokens.css` |
| Types | PascalCase.ts | `database.ts` |

---

## 14. State Management

### React Context
- `AuthContext` - User authentication state
- `ThemeContext` - Dark/light theme
- `ToastContext` - Notifications

### Local State
- `useState` for component state
- `useReducer` for complex state

### Server State
- Supabase queries for persistent data
- React Query for caching (future)

### URL State
- Search params for filters
- Route params for detail pages

---

## 15. Error Handling

### API Errors
```typescript
try {
  // operation
} catch (error) {
  console.error('Context:', error)
  return NextResponse.json(
    { error: 'User-friendly message' },
    { status: 500 }
  )
}
```

### Component Errors
```typescript
<ErrorBoundary fallback={<ErrorUI />}>
  <Component />
</ErrorBoundary>
```

### Form Validation
- Client-side: Immediate feedback
- Server-side: Return errors in API response
- Use Zod for schema validation

---

## 16. Deployment

### Platform
Vercel (recommended) or any Node.js host

### Build
```bash
npm run build
```

### Environment
- Build-time: `NEXT_PUBLIC_*` must be set
- Runtime: All env vars in Vercel dashboard

### Database
Hosted Supabase - no setup needed

---
