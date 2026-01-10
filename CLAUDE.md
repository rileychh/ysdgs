# YSDGS Project Documentation

This document provides context about the YSDGS project structure, setup, and conventions.

## Tech Stack

- **Framework**: Nuxt nightly (with Nitro, Vite, Vue 3)
- **Language**: TypeScript
- **UI Library**: shadcn-vue (with Radix Vue primitives via reka-ui)
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL (Alpine via Docker)
- **ORM**: Drizzle ORM with node-postgres driver
- **Authentication**: Better Auth with Google OAuth
- **Utilities**: VueUse composables, class-variance-authority, clsx, tailwind-merge
- **Icons**: lucide-vue-next
- **Package Manager**: pnpm with workspaces
- **Dependency Updates**: Automated via Renovate (configured in `.github/renovate.json`)

## Quick Start

### Prerequisites
- Node.js 24+ (see `engines` in package.json for exact requirement)
- pnpm (see `packageManager` in package.json for exact version)
- Docker (for PostgreSQL)
- Google OAuth credentials (from Google Cloud Console)

### Setup Steps

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd ysdgs
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start PostgreSQL:**
   ```bash
   docker compose up -d
   ```

4. **Run database migrations:**
   ```bash
   pnpm exec drizzle-kit push
   ```

5. **Start development server:**
   ```bash
   pnpm dev
   ```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
ysdgs/
├── app/                    # Nuxt app directory
│   ├── app.vue            # Main app component
│   ├── assets/
│   │   └── css/
│   │       └── tailwind.css # Tailwind CSS configuration
│   ├── components/        # Vue components
│   │   ├── AppHeader.vue  # Custom app header component
│   │   └── ui/            # shadcn-vue UI components
│   ├── layouts/           # Nuxt layouts
│   │   ├── default.vue    # Default layout (with auth)
│   │   └── public.vue     # Public layout (no auth)
│   ├── middleware/        # Route middleware
│   │   └── auth.ts        # Authentication middleware
│   ├── pages/             # File-based routing pages
│   │   ├── index.vue      # Landing page (/)
│   │   └── dashboard.vue  # Dashboard page (/dashboard)
│   └── utils/
│       ├── auth-client.ts # Better Auth client for Vue
│       └── shadcn.ts      # shadcn-vue utility (cn function)
├── server/                # Nuxt server directory
│   ├── api/
│   │   └── auth/
│   │       └── [...all].ts # Better Auth handler (catch-all route)
│   ├── auth.ts            # Better Auth configuration
│   └── db/
│       ├── index.ts       # Drizzle database client
│       ├── schema.ts      # Database schema (Better Auth tables)
│       └── drizzle/       # Generated migrations
├── components.json        # shadcn-vue configuration
├── compose.yaml           # Docker Compose (PostgreSQL)
├── drizzle.config.ts      # Drizzle Kit configuration
├── LICENSE                # MIT License
├── .env                   # Environment variables (gitignored)
└── .env.example           # Example environment variables
```

## Database Setup

### PostgreSQL via Docker

The project uses PostgreSQL 18 Alpine in Docker for local development.

**Container details:**

- Container name: `ysdgs-db`
- Port: `127.0.0.1:5432` (localhost only for security)
- Health check: Uses `pg_isready`

**Start database:**

```bash
docker compose up -d
```

### Drizzle ORM

Drizzle is configured with:

- Direct connection using individual environment variables (not connection string)
- Environment-based SSL: disabled in development, enabled in production
- Migrations output: `server/db/drizzle/`

**Run migrations:**

```bash
drizzle-kit push
```

**Generate migrations:**

```bash
drizzle-kit generate
```

## Environment Variables

All database credentials are defined once using `POSTGRES_*` variables, shared between Docker Compose, Drizzle Kit, and the application.

### Required Variables

```bash
# PostgreSQL configuration
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ysdgs

# Better Auth configuration
BETTER_AUTH_SECRET="<generate with: openssl rand -base64 32>"
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

### Environment-Based Configuration

**SSL/TLS:**

- SSL is controlled by `NODE_ENV` in both Drizzle config and database client
- Development: SSL disabled
- Production: SSL enabled

## Authentication

### Better Auth Setup

The project uses Better Auth with:

- **Adapter**: Drizzle adapter with PostgreSQL
- **Provider**: Google OAuth with domain restriction
- **Schema**: Standard Better Auth tables (user, session, account, verification)

### Google OAuth Configuration

Google OAuth is configured to restrict authentication to `@ntut.org.tw` accounts:

**Key settings:**

- `hd: 'ntut.org.tw'` - Restricts account picker to NTUT workspace domain

**Callback URL:**

```
http://localhost:3000/api/auth/callback/google (development)
https://your-domain.com/api/auth/callback/google (production)
```

### Database Schema

Better Auth uses these tables:

- `user` - User profiles (id, name, email, emailVerified, image)
- `session` - Active sessions (id, token, expiresAt, userId)
- `account` - OAuth accounts (id, providerId, accountId, userId, tokens)
- `verification` - Email verification tokens

All tables use:

- Text IDs (not auto-increment)
- Timestamps with `defaultNow()` and `$onUpdate()`
- Foreign keys with cascade delete
- Indexes on userId fields

## UI & Styling

### Tailwind CSS v4

The project uses Tailwind CSS v4 with the following setup:

- **Vite Plugin**: `@tailwindcss/vite` for optimal integration with Vite
- **Configuration**: Defined inline in `app/assets/css/tailwind.css`
- **Dark Mode**: Built-in dark mode support with custom variant
- **Theme**: Uses CSS variables with OKLCH color space for modern color definitions

**Key features:**

- Custom color system with semantic tokens (background, foreground, primary, secondary, etc.)
- Responsive border radius using CSS custom properties
- Support for chart colors (5 distinct chart color tokens)
- Sidebar component color tokens

**Tailwind CSS import:**

```typescript
// nuxt.config.ts
css: ['~/assets/css/tailwind.css']
```

### shadcn-vue

The project uses shadcn-vue for UI components:

- **Component Library**: Based on Radix Vue primitives (via reka-ui)
- **Style**: "new-york" style preset
- **Configuration**: `components.json` at project root
- **Component Location**: `app/components/ui/` directory
- **Icons**: Uses `lucide-vue-next` for icons
- **Utility Function**: `cn()` helper in `app/utils/shadcn.ts` for conditional class merging

**Configuration:**

```json
{
  "style": "new-york",
  "typescript": true,
  "tailwind": {
    "css": "app/assets/css/tailwind.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "iconLibrary": "lucide"
}
```

**Installed Components:**
- Avatar (with AvatarImage and AvatarFallback)
- Button
- Dropdown Menu (full suite of dropdown components)

**Adding components:**

```bash
npx shadcn-vue add [component-name]
# Components will be added to app/components/ui/
# Always run ESLint fix after adding components
pnpm lint
```

**Using the cn utility:**

```typescript
import { cn } from '~/utils/shadcn'

// Merge classes conditionally
const classes = cn('base-class', condition && 'conditional-class')
```

## Development Workflow

### Running the Dev Server

```bash
pnpm dev
```

Server runs on `http://localhost:3000` (or `:3001` if 3000 is occupied)

### Type Checking

```bash
pnpm typecheck
# or
nuxt typecheck
```

### Linting

```bash
pnpm lint
```

### Building

```bash
pnpm build
```

## Important Patterns & Conventions

### Nuxt Configuration

- **Auto-imports disabled**: `imports.scan: false` in `nuxt.config.ts`
- All imports must be explicit
- TypeScript type checking enabled on build

### Routing & Layouts

The app uses Nuxt's file-based routing with two layouts:

**Layouts:**
- `default.vue` - Authenticated layout with AppHeader component
- `public.vue` - Public layout for unauthenticated pages

**Pages:**
- `/` (index.vue) - Landing page, uses public layout
- `/dashboard` (dashboard.vue) - Protected dashboard, uses default layout

**Authentication Middleware:**

The `auth.ts` middleware protects routes requiring authentication:

```typescript
// Applied globally or per-page via definePageMeta
definePageMeta({
  middleware: 'auth'
})
```

### Database Connection

The database client (`server/db/index.ts`) uses individual connection parameters instead of a connection string:

```typescript
export const db = drizzle({
  connection: {
    host: process.env.POSTGRES_HOST!,
    port: Number(process.env.POSTGRES_PORT!),
    user: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.POSTGRES_DB!,
  },
})
```

This avoids duplicating credentials (DATABASE*URL vs POSTGRES*\* vars).

### Drizzle Schema Patterns

**Timestamps:**

```typescript
createdAt: timestamp('created_at').defaultNow().notNull(),
updatedAt: timestamp('updated_at')
  .defaultNow()
  .$onUpdate(() => new Date())
  .notNull(),
```

**Indexes:**

```typescript
(table) => [index('session_userId_idx').on(table.userId)]
```

**Relations:**
Use Drizzle's `relations()` helper for type-safe joins

### Better Auth Client

Client-side auth uses Better Auth's Vue integration:

```typescript
import { createAuthClient } from 'better-auth/vue'

export const authClient = createAuthClient()
```

**Sign in:**

```typescript
await authClient.signIn.social({ provider: 'google' })
```

## Deployment Considerations

### Production Checklist

1. **Environment Variables:**
   - Set `NODE_ENV=production`
   - Update `BETTER_AUTH_URL` to production domain
   - Update `POSTGRES_HOST` to production database
   - Enable SSL in PostgreSQL connection

2. **Google OAuth:**
   - Add production callback URL to Google Cloud Console
   - Update redirect URIs

3. **Database:**
   - Run migrations in production
   - Set up database backups
   - Use connection pooling if needed

4. **Security:**
   - SSL is automatically enabled when `NODE_ENV=production`
   - Ensure `BETTER_AUTH_SECRET` is cryptographically secure
   - Review CORS and CSP policies

## Troubleshooting

### Database Connection Issues

**Port conflict:**
If port 5432 is already in use, update `POSTGRES_PORT` in `.env` and `compose.yaml`

**SSL errors in development:**
Ensure `NODE_ENV` is not set to `production` in development

### OAuth Issues

**redirect_uri_mismatch:**

- Verify `BETTER_AUTH_URL` matches the URL in your browser
- Check Google Cloud Console redirect URIs match exactly

**hd parameter not working:**
The `hd` parameter only restricts the UI. For security, validate email domains server-side in production.

## Git Hooks

The project uses `simple-git-hooks` and `lint-staged` for automated code quality checks:

**Pre-commit Hook:**
- Automatically runs ESLint with `--fix` on all staged files
- Configured in `package.json`:
  ```json
  {
    "simple-git-hooks": {
      "pre-commit": "pnpm lint-staged"
    },
    "lint-staged": {
      "*": "eslint --fix"
    }
  }
  ```

**Setup:**
After cloning the repository, git hooks are automatically installed via the `postinstall` script.

## Git Workflow

This project follows Conventional Commits format:

- `feat:` - New features
- `fix:` - Bug fixes
- `chore:` - Maintenance tasks
- `docs:` - Documentation
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Tests

Commits are authored by the developer (no AI attribution per CLAUDE.md global config).

## Code Quality

### ESLint Configuration

The project uses `@antfu/eslint-config` with additional plugins:

- **Base**: `@antfu/eslint-config` (opinionated ESLint config)
- **Nuxt**: `@nuxt/eslint` for Nuxt-specific rules
- **Tailwind**: `eslint-plugin-better-tailwindcss` for Tailwind CSS class sorting and validation
- **Formatting**: `eslint-plugin-format` for code formatting

**Key features:**
- Respects `.gitignore` patterns (won't lint ignored files)
- Auto-fixes on save (via git hooks)
- TypeScript support enabled
- Ignores generated files (`server/db/drizzle/`, `.nuxt/`)

**Run manually:**
```bash
pnpm lint        # Check all files
pnpm lint --fix  # Fix all auto-fixable issues
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Notes

### Package Management
- **Package Manager**: pnpm (version specified in `packageManager` field in package.json)
- **Node.js**: Version requirement specified in `engines` field in package.json
- **Dependencies**: All dependencies are production dependencies (no devDependencies)
- **Version Pinning**: Uses `saveExact: true` to pin exact dependency versions
- **Workspaces**: Configured via `pnpm-workspace.yaml`
- **Updates**: Renovate automatically creates PRs for dependency updates

### Nuxt Version
- Uses `nuxt-nightly` (latest nightly build) for cutting-edge features
- Specified as `npm:nuxt-nightly@latest` in dependencies
- Automatically updated by Renovate

### Key Files to Ignore
- `server/db/drizzle/` - Generated migrations (tracked in git but ignored by ESLint)
- `.nuxt/` - Generated Nuxt build files
- `.env` - Local environment variables (never commit)
