<script setup lang="ts">
const { site } = useAppConfig()

const { stats: repoStats } = useRepoStats([...featuredProjects, ...projects].map(project => ({ key: project.name, repo: project.repo })))

useScrollSpy(['skills', 'experience', 'projects', 'pipeline', 'contact'])

const copied = ref(false)

async function copyEmail() {
  await navigator.clipboard.writeText(site.email)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}

const contactLinks = [
  { label: 'github', value: `github.com/${site.github.username}`, to: `https://github.com/${site.github.username}` },
  { label: 'linkedin', value: site.linkedin.replace('https://www.', '').replace(/\/$/, ''), to: site.linkedin },
  { label: 'résumé', value: '/resume — print or save as PDF', to: '/resume' }
]
</script>

<template>
  <div>
    <section class="relative overflow-hidden border-b border-default">
      <div
        class="graph-paper pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_20%,transparent_85%)]"
        aria-hidden="true"
      />

      <div class="container-site relative grid gap-12 pt-12 pb-14 sm:pt-20 lg:grid-cols-[1fr_28rem] lg:items-end lg:gap-16 lg:pb-20">
        <div class="min-w-0">
          <p class="label flex flex-wrap gap-x-5 gap-y-1 text-muted">
            <span class="text-primary">■ node/01</span>
            <span>{{ resumeLocation }}</span>
            <span class="hidden sm:inline">45.76° N · 4.84° E</span>
          </p>

          <h1 class="display mt-6 text-[clamp(4.75rem,16vw,11.5rem)] text-highlighted">
            Mael<br>Belliard<span class="text-primary">_</span>
          </h1>

          <p class="mt-8 max-w-xl text-xl font-medium text-toned text-balance sm:text-2xl">
            {{ resumeTitle }}. I build it, containerize it, and run it on my own hardware.
          </p>
          <p class="mt-4 max-w-xl text-muted text-pretty">
            {{ resumeSummary }}
          </p>

          <div class="mt-9 flex flex-wrap gap-3 font-mono text-sm">
            <NuxtLink
              to="#projects"
              class="bg-inverted px-4 py-2.5 text-inverted transition-colors hover:bg-primary hover:text-white"
            >
              ./projects ↓
            </NuxtLink>
            <NuxtLink
              to="/resume"
              class="border border-accented px-4 py-2.5 text-highlighted transition-colors hover:border-(--ui-text-highlighted)"
            >
              résumé.pdf
            </NuxtLink>
            <NuxtLink
              to="#contact"
              class="border border-accented px-4 py-2.5 text-highlighted transition-colors hover:border-(--ui-text-highlighted)"
            >
              contact
            </NuxtLink>
          </div>
        </div>

        <TerminalHero />
      </div>

      <div class="container-site relative">
        <TelemetryStrip class="border-x border-default bg-default" />
      </div>
    </section>

    <ModuleSection
      id="skills"
      index="01"
      topic="mael/skills/#"
      title="Stack"
      description="What I reach for day to day, from interface to infrastructure — wired up like a GPIO header, because most of it ends up running on one."
    >
      <SkillsPinout />
    </ModuleSection>

    <ModuleSection
      id="experience"
      index="02"
      topic="mael/log"
      title="Experience"
      description="Where I've worked and studied. Current units are still running."
    >
      <div class="grid gap-14 lg:grid-cols-2 lg:gap-12">
        <ServiceLog
          title="work.target"
          :entries="experience"
        />
        <ServiceLog
          title="education.target"
          :entries="education"
        />
      </div>
    </ModuleSection>

    <ModuleSection
      id="projects"
      index="03"
      topic="mael/projects/+"
      title="Projects"
      description="The ones I actively maintain, then everything built along the way."
    >
      <div class="flex flex-col gap-6">
        <ProjectSpec
          v-for="(project, index) in featuredProjects"
          :key="project.name"
          :project="project"
          :index="index"
          :total="featuredProjects.length"
          :stats="repoStats?.[project.name]"
        />
      </div>

      <ProjectTable
        :projects="projects"
        :stats="repoStats"
        class="mt-16"
      />
    </ModuleSection>

    <ModuleSection
      id="pipeline"
      index="04"
      topic="mael/pipeline"
      title="How it ships"
      description="Every project follows the same path, whether it lands on the home server or a VPS."
    >
      <PipelineTrace :steps="pipeline" />

      <NuxtLink
        to="/infra"
        class="mt-12 inline-flex items-center gap-2 font-mono text-sm text-highlighted underline decoration-(--ui-border-accented) underline-offset-4 transition-colors hover:text-primary hover:decoration-current"
      >
        cd /infra — the live infrastructure behind it →
      </NuxtLink>
    </ModuleSection>

    <ModuleSection
      id="contact"
      index="05"
      topic="mael/contact"
      title="Let's build something."
      description="Open to fullstack and DevOps-leaning opportunities — or just want to talk shop about self-hosting."
    >
      <div class="border-y border-accented py-8">
        <p class="label text-dimmed">
          email
        </p>
        <div class="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            :href="`mailto:${site.email}`"
            class="font-mono text-2xl break-all text-highlighted transition-colors hover:text-primary sm:text-4xl"
          >{{ site.email }}</a>
          <button
            type="button"
            class="label cursor-pointer border border-accented px-2.5 py-1.5 text-muted transition-colors hover:text-highlighted"
            @click="copyEmail"
          >
            {{ copied ? 'copied ✓' : 'copy' }}
          </button>
        </div>
      </div>

      <dl class="font-mono text-sm">
        <div
          v-for="link in contactLinks"
          :key="link.label"
          class="grid grid-cols-[6rem_1fr] border-b border-default py-4 sm:grid-cols-[10rem_1fr]"
        >
          <dt class="text-dimmed">
            {{ link.label }}
          </dt>
          <dd class="min-w-0 truncate">
            <NuxtLink
              :to="link.to"
              :target="link.to.startsWith('http') ? '_blank' : undefined"
              class="text-toned transition-colors hover:text-primary"
            >
              {{ link.value }}
            </NuxtLink>
          </dd>
        </div>
      </dl>

      <p class="mt-8 font-mono text-xs text-dimmed">
        # or scroll back up and run <span class="text-primary">sudo hire-me</span>
      </p>
    </ModuleSection>
  </div>
</template>
