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
  croesus:
    image: ghcr.io/maelbel/croesus:latest
    restart: unless-stopped
    environment:
      DATABASE_URL: \${DATABASE_URL}
    labels:
      - traefik.enable=true
      - traefik.http.routers.croesus.rule=Host(\`croesus.\${DOMAIN}\`)
      - traefik.http.routers.croesus.tls.certresolver=le
      - traefik.http.services.croesus.loadbalancer.server.port=3000
    networks:
      - traefik

networks:
  traefik:
    external: true`
}

export const projects: Project[] = [
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
