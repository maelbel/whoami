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

const featuredProject = featuredProjects[0]!

const repoUrl = `https://github.com/${site.github.repo}`

const { status: shipStatus, error: shipError } = useCiStatus(repoUrl, 'release.yml')

const { stats: repoStats } = useRepoStats([
  { key: featuredProject.name, repo: featuredProject.repo },
  { key: site.name, repo: repoUrl }
])
</script>

<template>
  <div>
    <PageIntro
      path="~/infra"
      title="How it's actually hosted"
      description="One VPS, one Traefik instance, reachable only from the home network or Tailscale, with real certs from OVH's DNS API — no PaaS, no managed Kubernetes. This very site is the exception: it ships straight to Vercel."
    />

    <ModuleSection
      index="01"
      topic="infra/layers"
      title="The stack"
      description="Every self-hosted project and home lab app on this page shares the same five pieces."
    >
      <div class="border border-default bg-elevated p-4 sm:p-8">
        <MermaidDiagram :code="overviewDiagram" />
      </div>

      <ol class="mt-12">
        <li
          v-for="(layer, index) in infraFlow"
          :key="layer.title"
          class="grid grid-cols-[3rem_1fr] gap-x-4 border-b border-default py-6 first:border-t first:border-accented sm:grid-cols-[4rem_12rem_1fr] sm:gap-x-8"
        >
          <span class="font-mono text-xs text-dimmed">L{{ infraFlow.length - index }}</span>
          <span class="flex items-center gap-2 font-medium text-highlighted">
            <UIcon
              :name="layer.icon"
              class="size-4 text-muted"
            />
            {{ layer.title }}
          </span>
          <p class="col-start-2 mt-2 text-sm text-muted text-pretty sm:col-start-auto sm:mt-0">
            {{ layer.description }}
          </p>
        </li>
      </ol>

      <h3 class="label mt-16 mb-4 text-highlighted">
        anatomy of a request
      </h3>
      <div class="border border-default bg-elevated p-4 sm:p-8">
        <MermaidDiagram :code="requestSequence" />
      </div>
    </ModuleSection>

    <ModuleSection
      id="services"
      index="02"
      topic="infra/services"
      title="My own projects"
      description="Everything in /services, routed through that same stack — restricted to me, not a public demo. Status pulled live from GitHub where a repo exists."
    >
      <ProjectSpec
        :project="featuredProject"
        :index="0"
        :total="3"
        tag="restricted access"
        :stats="repoStats?.[featuredProject.name]"
      />

      <div class="mt-6 grid gap-6 md:grid-cols-2">
        <article class="border border-default bg-elevated">
          <header class="flex items-center justify-between border-b border-default px-5 py-2.5">
            <span class="label text-dimmed">private · 02/03</span>
            <span class="label text-dimmed">no public repo</span>
          </header>
          <div class="p-5 sm:p-8">
            <h3 class="display text-4xl text-highlighted">
              {{ portail.name }}
            </h3>
            <p class="mt-3 text-sm text-muted text-pretty">
              {{ portail.description }}
            </p>
            <p class="mt-4 font-mono text-xs text-muted">
              {{ portail.tech.join(' · ') }}
            </p>
          </div>
        </article>

        <article class="border border-default bg-elevated">
          <header class="flex items-center justify-between border-b border-default px-5 py-2.5">
            <span class="label text-dimmed">dev copy · 03/03</span>
            <span class="label text-dimmed">whoami.maelbelliard.fr</span>
          </header>
          <div class="p-5 sm:p-8">
            <h3 class="display text-4xl text-highlighted">
              Whoami
            </h3>
            <p class="mt-3 text-sm text-muted text-pretty">
              This site's own dev container lives here too — a hot-reloading preview behind the same Traefik + Tailscale gate. Not the page you're reading right now.
            </p>
            <NuxtLink
              to="#deploy"
              class="mt-4 inline-block font-mono text-xs text-highlighted hover:text-primary"
            >
              ↓ how this site ships
            </NuxtLink>
          </div>
        </article>
      </div>
    </ModuleSection>

    <ModuleSection
      index="03"
      topic="infra/homelab"
      title="Home lab"
      description="The rest of what runs on that same host, for personal use — everything in /docker, on the same Traefik + Tailscale + OVH setup."
    >
      <InventoryTable
        :items="homelab"
        prefix="SVC"
      />

      <div class="mt-10 flex flex-wrap gap-x-8 gap-y-3 font-mono text-sm">
        <NuxtLink
          to="/uses"
          class="text-highlighted underline decoration-(--ui-border-accented) underline-offset-4 hover:text-primary hover:decoration-current"
        >
          /uses — the exact hardware and software →
        </NuxtLink>
        <NuxtLink
          to="/pi5"
          class="text-highlighted underline decoration-(--ui-border-accented) underline-offset-4 hover:text-primary hover:decoration-current"
        >
          /pi5 — the box, in 3D →
        </NuxtLink>
      </div>
    </ModuleSection>

    <ModuleSection
      id="deploy"
      index="04"
      topic="infra/deploy"
      title="How this site ships"
      description="This is the one exception to everything above — it doesn't stay on the VPS."
    >
      <div class="border border-default bg-elevated p-4 sm:p-8">
        <MermaidDiagram :code="shipDiagram" />
      </div>

      <div class="mt-6 grid gap-6 md:grid-cols-2">
        <article class="border border-default p-5 sm:p-8">
          <p class="label flex items-center gap-2 text-dimmed">
            <UIcon
              name="i-simple-icons-docker"
              class="size-3.5"
            />
            local / dev
          </p>
          <p class="mt-4 text-sm text-muted text-pretty">
            A docker-compose service, source mounted as a volume for hot reload, routed by the same home Traefik instance as everything else — reachable only over Tailscale, at whoami.maelbelliard.fr. It's a live preview of work in progress, not the public site.
          </p>
        </article>
        <article class="border border-default p-5 sm:p-8">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <p class="label flex items-center gap-2 text-dimmed">
              <UIcon
                name="i-simple-icons-vercel"
                class="size-3.5"
              />
              production
            </p>
            <CiStatusBadge
              :status="shipStatus"
              :error="shipError"
              label="release"
            />
          </div>
          <p class="mt-4 text-sm text-muted text-pretty">
            Pushing a tag like <code class="font-mono text-xs text-toned">v1.0.0</code> triggers GitHub Actions:
            lint, typecheck, <code class="font-mono text-xs text-toned">vercel build --prod</code>, deploy, then a
            GitHub Release with a changelog generated from Conventional Commits. That's what's
            actually live at <strong class="text-highlighted">www.maelbelliard.fr</strong>.
          </p>
          <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
            <RepoStats :stats="repoStats?.[site.name]" />
            <NuxtLink
              to="/changelog"
              class="font-mono text-xs text-highlighted hover:text-primary"
            >
              /changelog →
            </NuxtLink>
          </div>
        </article>
      </div>
    </ModuleSection>
  </div>
</template>
