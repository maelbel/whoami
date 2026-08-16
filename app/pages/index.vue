<script setup lang="ts">
const skills = [
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

const experience = [
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

const education = [
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

const featured = {
  name: 'Croesus',
  description: 'Open-source net worth tracker — self-hosted or as a desktop app for Windows/macOS/Linux — with real support for French tax-advantaged accounts (PEA, assurance-vie), real estate, and debts.',
  tech: ['Vue', 'Nuxt UI', 'FastAPI', 'PostgreSQL', 'Docker', 'Tauri'],
  repo: 'https://github.com/maelbel/croesus',
  status: 'CI passing',
  license: 'AGPL-3.0'
}

const projects = [
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

const pipeline = [
  { title: 'Code', description: 'Vue/Nuxt & TypeScript on the frontend, NestJS or FastAPI on the backend.', icon: 'i-lucide-code-2' },
  { title: 'Test & Lint', description: 'ESLint, type-checking and automated tests run on every push.', icon: 'i-lucide-check-check' },
  { title: 'Build', description: 'Reproducible, multi-stage Docker images.', icon: 'i-simple-icons-docker' },
  { title: 'CI/CD', description: 'GitHub Actions runs the pipeline and cuts releases.', icon: 'i-simple-icons-githubactions' },
  { title: 'Deploy', description: 'Traefik-routed, HTTPS by default, self-hosted.', icon: 'i-simple-icons-traefikproxy' }
]
</script>

<template>
  <div>
    <UPageHero
      headline="Fullstack Developer · Lyon, France"
      title="Hi, I'm Mael Belliard."
      description="I build and ship full-stack apps end to end — from Vue/Nuxt interfaces to NestJS/FastAPI services — then containerize, wire up CI/CD and self-host them behind Traefik. Currently building at LM Control."
      orientation="horizontal"
      :links="[{
        label: 'View projects',
        to: '#projects',
        trailingIcon: 'i-lucide-arrow-right',
        size: 'xl'
      }, {
        label: 'Get in touch',
        to: '#contact',
        size: 'xl',
        color: 'neutral',
        variant: 'subtle'
      }]"
    >
      <UCard
        variant="subtle"
        class="font-mono text-sm"
      >
        <div class="flex items-center gap-1.5 mb-3">
          <span class="size-2.5 rounded-full bg-red-500/70" />
          <span class="size-2.5 rounded-full bg-yellow-500/70" />
          <span class="size-2.5 rounded-full bg-green-500/70" />
        </div>
        <p><span class="text-primary">$</span> whoami</p>
        <p class="text-muted mb-2">
          mael-belliard — fullstack-developer
        </p>
        <p><span class="text-primary">$</span> cat status.txt</p>
        <p class="text-muted mb-2">
          based in Lyon · working @ LM Control
        </p>
        <p><span class="text-primary">$</span> ./deploy.sh --env production</p>
        <p class="text-muted">
          <UIcon
            name="i-lucide-check"
            class="text-primary align-[-2px]"
          /> shipped.
        </p>
      </UCard>
    </UPageHero>

    <UPageSection
      id="skills"
      title="Skills"
      description="What I reach for day to day, from interface to infrastructure."
    >
      <div class="grid gap-8 sm:grid-cols-3">
        <div
          v-for="group in skills"
          :key="group.category"
        >
          <h3 class="font-semibold text-highlighted mb-3">
            {{ group.category }}
          </h3>
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="item in group.items"
              :key="item.label"
              :icon="item.icon"
              color="neutral"
              variant="subtle"
              size="lg"
            >
              {{ item.label }}
            </UBadge>
          </div>
        </div>
      </div>
    </UPageSection>

    <UPageSection
      id="experience"
      title="Experience & Education"
      description="Where I've worked and studied."
    >
      <div class="grid gap-10 sm:grid-cols-2">
        <div>
          <h3 class="font-semibold text-highlighted mb-4">
            Experience
          </h3>
          <UTimeline
            :items="experience"
            :default-value="0"
          />
        </div>
        <div>
          <h3 class="font-semibold text-highlighted mb-4">
            Education
          </h3>
          <UTimeline
            :items="education"
            :default-value="0"
          />
        </div>
      </div>
    </UPageSection>

    <UPageSection
      id="projects"
      title="Projects"
      description="A flagship project I actively maintain, plus a few things built along the way."
    >
      <UPageCard
        :title="featured.name"
        :description="featured.description"
        orientation="horizontal"
        :to="featured.repo"
        target="_blank"
        highlight
        class="mb-6"
      >
        <template #header>
          <div class="flex flex-wrap items-center gap-2">
            <UBadge
              color="primary"
              variant="subtle"
              icon="i-lucide-circle-check"
            >
              {{ featured.status }}
            </UBadge>
            <UBadge
              color="neutral"
              variant="outline"
            >
              {{ featured.license }}
            </UBadge>
          </div>
        </template>
        <div class="flex flex-wrap gap-2 mt-4">
          <UBadge
            v-for="t in featured.tech"
            :key="t"
            color="neutral"
            variant="subtle"
            size="sm"
          >
            {{ t }}
          </UBadge>
        </div>
      </UPageCard>

      <UPageGrid>
        <UPageCard
          v-for="project in projects"
          :key="project.name"
          :title="project.name"
          :description="project.description"
          :to="project.repo"
          target="_blank"
          spotlight
        >
          <template #footer>
            <div class="flex flex-wrap items-center justify-between gap-2 w-full">
              <div class="flex flex-wrap gap-1.5">
                <UBadge
                  v-for="t in project.tech"
                  :key="t"
                  color="neutral"
                  variant="subtle"
                  size="sm"
                >
                  {{ t }}
                </UBadge>
              </div>
              <UButton
                v-if="project.live"
                :to="project.live"
                target="_blank"
                variant="link"
                size="sm"
                trailing-icon="i-lucide-external-link"
                @click.stop
              >
                Live
              </UButton>
            </div>
          </template>
        </UPageCard>
      </UPageGrid>
    </UPageSection>

    <UPageSection
      id="pipeline"
      title="How it ships"
      description="Every project follows the same pipeline, whether it lands on a home server or a VPS."
    >
      <UTimeline
        :items="pipeline"
        :default-value="pipeline.length - 1"
        orientation="horizontal"
        size="lg"
        class="w-full"
      />
    </UPageSection>

    <UPageSection>
      <UPageCTA
        id="contact"
        title="Let's build something."
        description="Open to fullstack and DevOps-leaning opportunities — or just want to talk shop about self-hosting."
        variant="subtle"
        :links="[{
          label: 'contact@maelbelliard.fr',
          to: 'mailto:contact@maelbelliard.fr',
          icon: 'i-lucide-mail',
          size: 'lg'
        }, {
          label: 'GitHub',
          to: 'https://github.com/maelbel',
          target: '_blank',
          icon: 'i-simple-icons-github',
          size: 'lg',
          color: 'neutral',
          variant: 'outline'
        }, {
          label: 'maelbelliard.fr',
          to: 'https://maelbelliard.fr',
          target: '_blank',
          icon: 'i-lucide-globe',
          size: 'lg',
          color: 'neutral',
          variant: 'outline'
        }]"
      />
    </UPageSection>
  </div>
</template>
