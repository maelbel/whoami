<script setup lang="ts">
const { site } = useAppConfig()

const description = 'How my self-hosted projects and home lab are actually deployed — Traefik, Tailscale and OVH-issued certs on one VPS — plus how this very site ships to Vercel.'

useSeoMeta({
  title: `Infrastructure — ${site.name}`,
  description
})
defineOgImage('Terminal.satori', { title: 'Infrastructure', description })

const infraFlow = [
  {
    title: 'Internet',
    description: 'Public DNS resolves every *.maelbelliard.fr host, but none of it is forwarded to the public internet — the router only accepts these connections from the home network or the tailnet.',
    icon: 'i-lucide-globe'
  },
  {
    title: 'Tailscale',
    description: 'A private mesh VPN — together with the home LAN, the only two ways in. My laptop and phone reach the VPS over the tailnet when I\'m out, or straight over Wi-Fi when I\'m home — never through the public router.',
    icon: 'i-simple-icons-tailscale'
  },
  {
    title: 'Traefik',
    description: 'One reverse proxy instance for the whole host. Routing is decided purely from each container\'s Docker labels — nothing to hand-edit per service.',
    icon: 'i-simple-icons-traefikproxy'
  },
  {
    title: 'OVH',
    description: 'Every host gets a real Let\'s Encrypt certificate issued through OVH\'s DNS API (DNS-01). No port-80 challenge needed, so names that are never reachable from the internet still get valid, trusted HTTPS.',
    icon: 'i-simple-icons-ovh'
  },
  {
    title: 'Docker',
    description: 'Single host, one compose stack per project or app, every container attached to a shared external network so Traefik can reach it.',
    icon: 'i-simple-icons-docker'
  }
]

const overviewDiagram = `flowchart LR
    Internet((Internet)) -.->|blocked, not forwarded| Traefik
    LAN[["Home network"]] -->|only ways in| Traefik["Traefik<br/>reverse proxy"]
    Tailscale[["Tailscale<br/>mesh VPN"]] -->|only ways in| Traefik
    OVH["OVH<br/>DNS-01 API"] -.->|issues real certs<br/>for every host| Traefik
    Traefik --> Docker[("Docker host")]
    Docker --> MyProjects["My projects<br/>(Croesus, Portail, whoami-dev)"]
    Docker --> Homelab["Home lab<br/>(10 self-hosted apps)"]`

const requestSequence = `sequenceDiagram
    participant M as My device (LAN or tailnet)
    participant D as DNS
    participant T as Traefik
    participant A as Container

    Note over T: Cert already issued ahead of time<br/>via OVH DNS-01 — no live challenge here
    M->>D: Resolve *.maelbelliard.fr
    D-->>M: Private IP (LAN or tailnet)
    M->>T: HTTPS request (SNI = domain)
    T->>T: Match Host() rule from Docker labels
    T-->>M: TLS handshake (Let's Encrypt cert)
    T->>A: Forward request over Docker network
    A-->>T: Response
    T-->>M: Response`

const shipDiagram = `flowchart TB
    Repo[("whoami repo")] --> Dev["docker compose up<br/>(hot reload)"]
    Dev --> DevTraefik["Traefik + Tailscale"]
    DevTraefik --> DevSite["whoami.maelbelliard.fr<br/>— live preview, restricted"]

    Repo -->|git tag v*.*.*| Actions["GitHub Actions<br/>release.yml"]
    Actions -->|vercel build --prod| Vercel["Vercel"]
    Vercel --> ProdSite["www.maelbelliard.fr<br/>— this site, public"]
    Actions --> Release["GitHub Release<br/>+ generated changelog"]`

const portail = {
  name: 'Portail',
  description: 'A personal dashboard listing everything self-hosted here — search and filter by tag, backed by Postgres. No public repo, so no CI badge or stars to show.',
  tech: ['Nuxt', 'Prisma', 'PostgreSQL']
}

const homelab = [
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

const repoUrl = `https://github.com/${site.github.repo}`

const { status: ciStatus, error: ciError } = useCiStatus(featuredProject.repo)
const { status: shipStatus, error: shipError } = useCiStatus(repoUrl, 'release.yml')

const { stats: repoStats } = useRepoStats([
  { key: featuredProject.name, repo: featuredProject.repo },
  { key: site.name, repo: repoUrl }
])
</script>

<template>
  <div>
    <UPageHero
      headline="Self-hosted (mostly)"
      title="How it's actually hosted"
      description="One VPS, one Traefik instance, reachable only from the home network or Tailscale, with real certs from OVH's DNS API — no PaaS, no managed Kubernetes. This very site is the exception: it ships straight to Vercel. Here's the real path a request takes, plus live status for what's running."
    />

    <UPageSection
      title="The stack behind all of it"
      description="Every self-hosted project and home lab app on this page shares the same five pieces."
    >
      <MermaidDiagram
        :code="overviewDiagram"
        class="mb-8"
      />

      <UTimeline
        :items="infraFlow"
        :default-value="infraFlow.length - 1"
        size="lg"
      />

      <h3 class="text-lg font-semibold text-highlighted mt-10 mb-4">
        Anatomy of a request
      </h3>
      <MermaidDiagram :code="requestSequence" />
    </UPageSection>

    <UPageSection
      id="services"
      title="My own projects"
      description="Everything in /services, routed through that same stack — restricted to me, not a public demo. Status pulled live from GitHub where a repo exists."
    >
      <UPageCard
        :description="featuredProject.description"
        highlight
        :ui="{ footer: 'w-full' }"
      >
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-base font-semibold text-highlighted">{{ featuredProject.name }}</span>
            <div class="flex flex-wrap items-center gap-2">
              <UBadge
                color="neutral"
                variant="subtle"
                icon="i-lucide-lock"
                size="sm"
              >
                Restricted access
              </UBadge>
              <CiStatusBadge
                :status="ciStatus"
                :error="ciError"
                label="CI"
              />
              <RepoStats :stats="repoStats?.[featuredProject.name]" />
              <UButton
                :to="featuredProject.repo"
                target="_blank"
                variant="link"
                size="sm"
                icon="i-simple-icons-github"
                trailing-icon="i-lucide-external-link"
                @click.stop
              >
                Source
              </UButton>
            </div>
          </div>
        </template>

        <template #footer>
          <div class="flex flex-col gap-2 w-full">
            <div class="flex flex-wrap gap-1.5">
              <UBadge
                v-for="tech in featuredProject.tech"
                :key="tech"
                color="neutral"
                variant="subtle"
                size="sm"
              >
                {{ tech }}
              </UBadge>
            </div>
            <ComposePeek
              v-if="featuredProject.compose"
              :compose="featuredProject.compose"
            />
          </div>
        </template>
      </UPageCard>

      <div class="grid gap-4 sm:grid-cols-2 mt-4">
        <UPageCard
          :description="portail.description"
          :ui="{ footer: 'w-full' }"
        >
          <template #header>
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="text-base font-semibold text-highlighted">{{ portail.name }}</span>
              <UBadge
                color="neutral"
                variant="subtle"
                icon="i-lucide-lock"
                size="sm"
              >
                Private, no public repo
              </UBadge>
            </div>
          </template>

          <template #footer>
            <div class="flex flex-wrap gap-1.5">
              <UBadge
                v-for="tech in portail.tech"
                :key="tech"
                color="neutral"
                variant="subtle"
                size="sm"
              >
                {{ tech }}
              </UBadge>
            </div>
          </template>
        </UPageCard>

        <UPageCard
          title="Whoami"
          description="This site's own dev container lives here too, at whoami.maelbelliard.fr — a hot-reloading preview behind the same Traefik + Tailscale gate. Not the page you're reading right now."
        >
          <template #footer>
            <UButton
              to="#deploy"
              variant="link"
              size="sm"
              trailing-icon="i-lucide-arrow-down"
            >
              See how this site ships
            </UButton>
          </template>
        </UPageCard>
      </div>
    </UPageSection>

    <UPageSection
      title="Home lab"
      description="The rest of what runs on that same host, for personal use — everything in /docker, on the same Traefik + Tailscale + OVH setup."
    >
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="tool in homelab"
          :key="tool.name"
          class="flex items-start gap-3 rounded-lg border border-default p-4"
        >
          <UIcon
            :name="tool.icon"
            class="size-5 shrink-0 text-primary mt-0.5"
          />
          <div>
            <p class="text-sm font-semibold text-highlighted">
              {{ tool.name }}
            </p>
            <p class="text-sm text-muted">
              {{ tool.description }}
            </p>
          </div>
        </div>
      </div>
    </UPageSection>

    <UPageSection
      id="deploy"
      title="How this site ships"
      description="This is the one exception to everything above — it doesn't stay on the VPS."
    >
      <MermaidDiagram
        :code="shipDiagram"
        class="mb-8"
      />

      <div class="grid gap-4 sm:grid-cols-2">
        <UPageCard description="A docker-compose service, source mounted as a volume for hot reload, routed by the same home Traefik instance as everything else — reachable only over Tailscale, at whoami.maelbelliard.fr. It's a live preview of work in progress, not the public site.">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-simple-icons-docker"
                class="size-5 shrink-0 text-primary"
              />
              <span class="text-base font-semibold text-highlighted">Local / dev</span>
            </div>
          </template>
        </UPageCard>
        <UPageCard>
          <template #header>
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-simple-icons-vercel"
                  class="size-5 shrink-0 text-primary"
                />
                <span class="text-base font-semibold text-highlighted">Production</span>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <CiStatusBadge
                  :status="shipStatus"
                  :error="shipError"
                />
                <RepoStats :stats="repoStats?.[site.name]" />
              </div>
            </div>
          </template>
          <template #description>
            Pushing a tag like <code class="text-xs">v1.0.0</code> triggers GitHub Actions:
            lint, typecheck, <code class="text-xs">vercel build --prod</code>, deploy, then a
            GitHub Release with a changelog generated from Conventional Commits. That's what's
            actually live at <strong>www.maelbelliard.fr</strong>.
          </template>
          <template #footer>
            <UButton
              to="/changelog"
              variant="link"
              size="sm"
              trailing-icon="i-lucide-arrow-right"
            >
              See every shipped release
            </UButton>
          </template>
        </UPageCard>
      </div>
    </UPageSection>
  </div>
</template>
