export interface SkillGroup {
  category: string
  items: { label: string, icon: string }[]
}

export interface TimelineEntry {
  date: string
  title: string
  org: string
  meta?: string
  description: string
  current?: boolean
}

export const resumeTitle = 'Fullstack Developer'
export const resumeLocation = 'Lyon, France'
export const resumeSummary = 'I build and ship full-stack apps end to end — from Vue/Nuxt interfaces to NestJS/FastAPI services — then containerize, wire up CI/CD and self-host them behind Traefik. Currently building at LM Control.'

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
    org: 'LM Control',
    meta: 'Apprenticeship · Jonage, France',
    description: 'Payment terminal & kiosk software solutions. TypeScript, Nuxt.js and more.',
    current: true
  },
  {
    date: 'Sep 2022 – Jun 2023',
    title: 'Full Stack Developer',
    org: 'masalledebain.com',
    meta: 'Permanent contract · Biguglia, France',
    description: 'Migrated PrestaShop 1.6 to 1.7, built custom PrestaShop/Odoo modules, migrated the database (SQL → CSV) and handled production deployments and incident support. Stack: PHP, Symfony, SQL, Python, XML.'
  }
]

export const education: TimelineEntry[] = [
  {
    date: 'Jan 2025 – Jan 2027',
    title: 'Master, Informatics',
    org: 'Dawan',
    description: '',
    current: true
  },
  {
    date: 'Sep 2024 – Jan 2025',
    title: 'POEI, Reactive AI Developer',
    org: 'Dawan',
    description: 'Government-funded pre-hire training program preparing for an AI/reactive developer role.'
  },
  {
    date: 'Sep 2023 – Jan 2024',
    title: 'Specialized MBA, Fullstack Developer',
    org: 'MyDigitalSchool',
    description: 'Diploma not obtained — training stopped ~4 months in after being unable to find an apprenticeship placement.'
  },
  {
    date: 'Sep 2021 – Jun 2022',
    title: 'Licence 3, Computer Science',
    org: 'Università di Corsica Pasquale Paoli',
    description: ''
  },
  {
    date: 'Sep 2019 – Jun 2021',
    title: 'DUT, Multimedia & Internet Professions (Audiovisual)',
    org: 'Università di Corsica Pasquale Paoli',
    description: ''
  }
]
