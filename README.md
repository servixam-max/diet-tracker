# Diet Tracker 🥗

A comprehensive nutrition tracking application built with Next.js and Supabase. Track your meals, analyze nutritional data, manage recipes, and monitor your dietary goals with AI-powered food recognition.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS 4, Framer Motion
- **Database:** Supabase (PostgreSQL)
- **State Management:** React Context, IndexedDB (offline support)
- **Testing:** Vitest (unit), Playwright (E2E)
- **AI Integration:** Ollama Cloud (Llama 3.2, LLaVA for vision)
- **Barcode Scanning:** ZXing library
- **Charts:** Recharts
- **Icons:** Lucide React

## Features

- 📸 AI-powered food recognition from photos
- 📊 Barcode scanning for packaged foods
- 🍽️ Meal logging with nutritional breakdown
- 📈 Progress tracking and analytics
- 📝 Recipe management
- 🛒 Shopping list integration
- 📱 PWA support (offline mode)
- 🔄 Real-time sync with Supabase

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AntonioXam/diet-tracker.git
cd diet-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OLLAMA_BASE_URL=https://ollama.cloud
RESEND_API_KEY=your_resend_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:ui` | Run tests with UI |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:e2e` | Run E2E tests (Playwright) |

## Project Structure

```
diet-tracker/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utility functions & services
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   └── styles/           # Global styles
├── public/               # Static assets
├── tests/                # E2E test specs
├── .github/              # GitHub Actions workflows
└── scripts/              # Utility scripts
```

## CI/CD

The project uses GitHub Actions for continuous integration and deployment:

- **Build Job:** Runs on every push/PR to main
  - Installs dependencies
  - Runs type checking
  - Builds the application
  - Runs unit tests

- **Deploy Job:** Runs on main branch pushes
  - Builds and starts the production server

## Deployment

### Local Deployment (Tailscale)

The app is deployed locally on a Mac Mini M4 and accessible via Tailscale:
- URL: `http://100.126.164.101:3000`

### Production Build

```bash
npm run build
npm run start
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm test` and `npm run test:e2e`
4. Submit a pull request

## License

MIT

---

Built with ❤️ using Next.js and Supabase
