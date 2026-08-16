<script setup lang="ts">
const { site } = useAppConfig()
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
        :title="featuredProject.name"
        :description="featuredProject.description"
        orientation="horizontal"
        :to="featuredProject.repo"
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
              {{ featuredProject.status }}
            </UBadge>
            <UBadge
              color="neutral"
              variant="outline"
            >
              {{ featuredProject.license }}
            </UBadge>
          </div>
        </template>
        <div class="flex flex-wrap gap-2 mt-4">
          <UBadge
            v-for="t in featuredProject.tech"
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
          label: site.email,
          to: `mailto:${site.email}`,
          icon: 'i-lucide-mail',
          size: 'lg'
        }, {
          label: 'GitHub',
          to: `https://github.com/${site.github.username}`,
          target: '_blank',
          icon: 'i-simple-icons-github',
          size: 'lg',
          color: 'neutral',
          variant: 'outline'
        }, {
          label: site.url.replace('https://', ''),
          to: site.url,
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
