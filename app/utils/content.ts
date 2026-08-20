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

export interface ToolItem {
  name: string
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
    repo: 'https://github.com/maelbel/Edusign'
  },
  {
    name: 'COSMOS',
    description: 'Multilingual website about space, built during a DUT MMI internship with Express and MongoDB.',
    tech: ['Node.js', 'Express', 'MongoDB'],
    repo: 'https://github.com/maelbel/COSMOS'
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

export const homelab: ToolItem[] = [
  { name: 'AdGuard Home', description: 'Network-wide DNS ad- and tracker-blocking.', icon: 'i-lucide-shield' },
  { name: 'Authentik', description: 'Self-hosted SSO / identity provider — its Traefik forward-auth middleware exists, just not wired to any app yet.', icon: 'i-lucide-key-round' },
  { name: 'Home Assistant', description: 'Home automation hub.', icon: 'i-lucide-house' },
  { name: 'Zigbee2MQTT + Mosquitto', description: 'Zigbee-to-MQTT bridge for smart home devices.', icon: 'i-lucide-radio-tower' },
  { name: 'Paperless-ngx', description: 'OCR document archive.', icon: 'i-lucide-archive' },
  { name: 'Beszel', description: 'Lightweight server monitoring.', icon: 'i-lucide-activity' },
  { name: 'Affine', description: 'Notes and knowledge base.', icon: 'i-lucide-notebook-pen' },
  { name: 'Obsidian', description: 'The Obsidian app itself, containerized and accessed through the browser.', icon: 'i-lucide-sticky-note' },
  { name: 'Uptime Kuma', description: 'Status page and uptime monitoring for everything on the host.', icon: 'i-simple-icons-uptimekuma' },
  { name: 'Ghostfolio', description: 'Open-source investment portfolio tracker.', icon: 'i-simple-icons-ghostfolio' }
]

export const hardware: ToolItem[] = [
  { name: 'Raspberry Pi 5 — 16GB', description: 'The home server — runs every self-hosted project and the whole home lab.', icon: 'i-simple-icons-raspberrypi' },
  { name: 'Argon NEO case', description: 'Passively-cooled case built for the Pi 5.', icon: 'i-lucide-box' },
  { name: '1TB NVMe SSD', description: 'Boot drive and primary storage.', icon: 'i-lucide-hard-drive' },
  { name: '1TB external SSD', description: 'Backup target for the Pi.', icon: 'i-lucide-database-backup' },
  { name: 'SONOFF ZBDongle-E', description: 'Zigbee 3.0 USB dongle feeding Zigbee2MQTT and Home Assistant.', icon: 'i-lucide-usb' }
]

export const software: ToolItem[] = [
  { name: 'Raspberry Pi OS Lite', description: 'Headless OS on the home server.', icon: 'i-simple-icons-raspberrypi' },
  { name: 'WebStorm / VS Code', description: 'Both used over SSH straight onto the Pi — remote development, no local checkout.', icon: 'i-simple-icons-webstorm' },
  { name: 'Ghostty / Git Bash', description: 'Ghostty day to day; Git Bash on Windows.', icon: 'i-simple-icons-ghostty' },
  { name: 'Brave', description: 'Daily-driver browser.', icon: 'i-simple-icons-brave' },
  { name: 'Tailscale', description: 'Mesh VPN — how everything below stays reachable from outside the home network.', icon: 'i-simple-icons-tailscale' }
]

export const smartHome: ToolItem[] = [
  { name: 'Philips Hue', description: '2 lamps, bridged into Home Assistant.', icon: 'i-simple-icons-philipshue' },
  { name: 'Netatmo', description: 'Smart heat detector.', icon: 'i-lucide-thermometer' },
  { name: 'IKEA (Matter)', description: '1 lamp, 1 motion detector, and 2 heat detectors — bought, not yet integrated.', icon: 'i-simple-icons-ikea' },
  { name: 'Ring', description: 'Home alarm system.', icon: 'i-simple-icons-ring' }
]

export const pipeline: PipelineStep[] = [
  { title: 'Code', description: 'Vue/Nuxt & TypeScript on the frontend, NestJS or FastAPI on the backend.', icon: 'i-lucide-code-2' },
  { title: 'Test & Lint', description: 'ESLint, type-checking and automated tests run on every push.', icon: 'i-lucide-check-check' },
  { title: 'Build', description: 'Reproducible, multi-stage Docker images.', icon: 'i-simple-icons-docker' },
  { title: 'CI/CD', description: 'GitHub Actions runs the pipeline and cuts releases.', icon: 'i-simple-icons-githubactions' },
  { title: 'Deploy', description: 'Traefik-routed, HTTPS by default, self-hosted.', icon: 'i-simple-icons-traefikproxy' }
]
