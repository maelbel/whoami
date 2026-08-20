export interface Project {
  name: string
  description: string
  tech: string[]
  repo: string
  live?: string
  compose?: string
}

export interface FeaturedProject extends Project {
  license: string
}

export interface PipelineStep {
  title: string
  description: string
  icon: string
}

export const featuredProject: FeaturedProject = {
  name: 'Croesus',
  description: 'Open-source net worth tracker — self-hosted or as a desktop app for Windows/macOS/Linux — with real support for French tax-advantaged accounts (PEA, assurance-vie), real estate, and debts.',
  tech: ['Vue', 'Nuxt UI', 'FastAPI', 'PostgreSQL', 'Docker', 'Tauri'],
  repo: 'https://github.com/maelbel/croesus',
  license: 'AGPL-3.0',
  compose: `services:
  backend:
    image: ghcr.io/maelbel/croesus-backend:latest
    restart: unless-stopped
    environment:
      DATABASE_URL: postgresql://\${POSTGRES_USER}:\${POSTGRES_PASSWORD}@postgres:5432/\${POSTGRES_DB}
    networks:
      - traefik
    labels:
      - traefik.enable=true
      - traefik.http.routers.croesus-api.rule=Host(\`api.\${DOMAIN}\`)
      - traefik.http.routers.croesus-api.tls.certresolver=le
      - traefik.http.services.croesus-api.loadbalancer.server.port=8000

  frontend:
    image: ghcr.io/maelbel/croesus-frontend:latest
    restart: unless-stopped
    networks:
      - traefik
    labels:
      - traefik.enable=true
      - traefik.http.routers.croesus.rule=Host(\`\${DOMAIN}\`)
      - traefik.http.routers.croesus.tls.certresolver=le
      - traefik.http.services.croesus.loadbalancer.server.port=80

  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: \${POSTGRES_DB}
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
    networks:
      - internal

networks:
  traefik:
    external: true
  internal:
    driver: bridge`
}

export const projects: Project[] = [
  {
    name: 'Cats',
    description: 'Full-stack CRUD app for cataloging cats — JWT auth, role-based admin dashboard, DB seeding.',
    tech: ['Vue', 'Quasar', 'NestJS', 'TypeORM'],
    repo: 'https://github.com/maelbel/cats'
  },
  {
    name: 'Culina',
    description: 'Full-stack meal planner — plan meals, manage ingredients, and generate a shopping list automatically.',
    tech: ['React', 'NestJS', 'MUI'],
    repo: 'https://github.com/maelbel/culina-frontend'
  },
  {
    name: 'Edusign',
    description: 'Digital attendance management app with electronic signatures, redeveloped from scratch during a master\'s year.',
    tech: ['PHP'],
    repo: 'https://github.com/maelbel/Edusign',
    live: 'https://edusign.maelbelliard.dev'
  },
  {
    name: 'COSMOS',
    description: 'Multilingual website about space, built during a DUT MMI internship with Express and MongoDB.',
    tech: ['Node.js', 'Express', 'MongoDB'],
    repo: 'https://github.com/maelbel/COSMOS',
    live: 'https://cosmos.maelbelliard.dev'
  },
  {
    name: 'Blob le Blog',
    description: 'Twitter-style social blog network built with Laravel as a school project.',
    tech: ['PHP', 'Laravel'],
    repo: 'https://github.com/maelbel/BlobLeBlog'
  },
  {
    name: 'Musico',
    description: 'A Discord bot for playing music from Deezer.',
    tech: ['JavaScript'],
    repo: 'https://github.com/maelbel/Musico'
  }
]

export const pipeline: PipelineStep[] = [
  { title: 'Code', description: 'Vue/Nuxt & TypeScript on the frontend, NestJS or FastAPI on the backend.', icon: 'i-lucide-code-2' },
  { title: 'Test & Lint', description: 'ESLint, type-checking and automated tests run on every push.', icon: 'i-lucide-check-check' },
  { title: 'Build', description: 'Reproducible, multi-stage Docker images.', icon: 'i-simple-icons-docker' },
  { title: 'CI/CD', description: 'GitHub Actions runs the pipeline and cuts releases.', icon: 'i-simple-icons-githubactions' },
  { title: 'Deploy', description: 'Traefik-routed, HTTPS by default, self-hosted.', icon: 'i-simple-icons-traefikproxy' }
]
