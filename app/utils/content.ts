export interface SkillGroup {
  category: string
  items: { label: string, icon: string }[]
}

export interface TimelineEntry {
  date: string
  title: string
  description: string
  icon: string
}

export interface Project {
  name: string
  description: string
  tech: string[]
  repo: string
  live?: string
}

export interface FeaturedProject extends Project {
  status: string
  license: string
}

export interface PipelineStep {
  title: string
  description: string
  icon: string
}

export const skills: SkillGroup[] = [
  {
    category: 'Frontend',
    items: [
      { label: 'Vue.js', icon: 'i-simple-icons-vuedotjs' },
      { label: 'Nuxt', icon: 'i-simple-icons-nuxt' },
      { label: 'TypeScript', icon: 'i-simple-icons-typescript' },
      { label: 'JavaScript', icon: 'i-simple-icons-javascript' },
      { label: 'Pinia', icon: 'i-simple-icons-pinia' },
      { label: 'Tailwind CSS', icon: 'i-simple-icons-tailwindcss' }
    ]
  },
  {
    category: 'Backend',
    items: [
      { label: 'NestJS', icon: 'i-simple-icons-nestjs' },
      { label: 'FastAPI', icon: 'i-simple-icons-fastapi' },
      { label: 'Python', icon: 'i-simple-icons-python' },
      { label: 'PostgreSQL', icon: 'i-simple-icons-postgresql' },
      { label: 'Prisma', icon: 'i-simple-icons-prisma' },
      { label: 'PHP', icon: 'i-simple-icons-php' }
    ]
  },
  {
    category: 'DevOps & Infra',
    items: [
      { label: 'Docker', icon: 'i-simple-icons-docker' },
      { label: 'Traefik', icon: 'i-simple-icons-traefikproxy' },
      { label: 'GitHub Actions', icon: 'i-simple-icons-githubactions' },
      { label: 'Git', icon: 'i-simple-icons-git' },
      { label: 'Linux', icon: 'i-simple-icons-linux' },
      { label: 'Tauri', icon: 'i-simple-icons-tauri' }
    ]
  }
]

export const experience: TimelineEntry[] = [
  {
    date: 'Jan 2025 – Present',
    title: 'Full Stack Developer',
    description: 'LM Control · Apprenticeship · Jonage, France. Payment terminal & kiosk software solutions. TypeScript, Nuxt.js and more.',
    icon: 'i-lucide-briefcase'
  },
  {
    date: 'Sep 2022 – Jun 2023',
    title: 'Full Stack Developer',
    description: 'masalledebain.com · Permanent contract · Biguglia, France. Migrated PrestaShop 1.6 to 1.7, built custom PrestaShop/Odoo modules, migrated the database (SQL → CSV) and handled production deployments and incident support. Stack: PHP, Symfony, SQL, Python, XML.',
    icon: 'i-lucide-briefcase'
  }
]

export const education: TimelineEntry[] = [
  {
    date: 'Jan 2025 – Jan 2027',
    title: 'Master, Informatics',
    description: 'Dawan',
    icon: 'i-lucide-graduation-cap'
  },
  {
    date: 'Sep 2024 – Jan 2025',
    title: 'POEI, Reactive AI Developer',
    description: 'Dawan. Government-funded pre-hire training program preparing for an AI/reactive developer role.',
    icon: 'i-lucide-graduation-cap'
  },
  {
    date: 'Sep 2023 – Jan 2024',
    title: 'Specialized MBA, Fullstack Developer',
    description: 'MyDigitalSchool. Diploma not obtained — training stopped ~4 months in after being unable to find an apprenticeship placement.',
    icon: 'i-lucide-graduation-cap'
  },
  {
    date: 'Sep 2021 – Jun 2022',
    title: 'Licence 3, Computer Science',
    description: 'Università di Corsica Pasquale Paoli.',
    icon: 'i-lucide-graduation-cap'
  },
  {
    date: 'Sep 2019 – Jun 2021',
    title: 'DUT, Multimedia & Internet Professions (Audiovisual)',
    description: 'Università di Corsica Pasquale Paoli.',
    icon: 'i-lucide-graduation-cap'
  }
]

export const featuredProject: FeaturedProject = {
  name: 'Croesus',
  description: 'Open-source net worth tracker — self-hosted or as a desktop app for Windows/macOS/Linux — with real support for French tax-advantaged accounts (PEA, assurance-vie), real estate, and debts.',
  tech: ['Vue', 'Nuxt UI', 'FastAPI', 'PostgreSQL', 'Docker', 'Tauri'],
  repo: 'https://github.com/maelbel/croesus',
  status: 'CI passing',
  license: 'AGPL-3.0'
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
