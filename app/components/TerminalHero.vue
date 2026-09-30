<script setup lang="ts">
const { site } = useAppConfig()

const { status: nowStatus } = useNowStatus(site.github.username)

interface HistoryEntry {
  command: string
  output: string[]
}

const history = ref<HistoryEntry[]>([])
const input = ref('')
const inputEl = ref<HTMLInputElement>()
const scrollArea = ref<HTMLElement>()

function focusInput() {
  inputEl.value?.focus()
}

function scrollToBottom() {
  nextTick(() => {
    if (scrollArea.value) scrollArea.value.scrollTop = scrollArea.value.scrollHeight
  })
}

const { pieces: confetti, launch: launchConfetti } = useConfetti()

const snakeOpen = ref(false)

function closeSnake() {
  snakeOpen.value = false
  nextTick(focusInput)
}

const blackholeOpen = ref(false)

function closeBlackhole() {
  blackholeOpen.value = false
  nextTick(focusInput)
}

const forkBombOpen = ref(false)

function closeForkBomb() {
  forkBombOpen.value = false
  nextTick(focusInput)
}

const { active: matrixModeActive, toggle: toggleMatrixMode } = useMatrixMode()

const COMMAND_LIST = 'whoami, ls, skills, experience, projects, pipeline, contact, resume, infra, uses, pi5, changelog, date, neofetch, snake, sudo hire-me, clear'

const NAV_PATHS: Record<string, string> = { resume: '/resume', infra: '/infra', uses: '/uses', pi5: '/pi5', changelog: '/changelog' }

const CREPE_RECIPES: Record<'sweet' | 'salt', string[]> = {
  sweet: [
    '🥞 Sweet Breton crêpe (crêpe bretonne, ~15 crêpes)',
    '',
    'Ingredients:',
    '- 500g wheat flour',
    '- 4 eggs',
    '- 1L milk',
    '- 50g melted butter',
    '- pinch of salt',
    '- 2 tbsp sugar',
    '- 1 tbsp rum or vanilla extract (optional)',
    '',
    'Steps:',
    '1. Mix flour, salt and sugar in a bowl, make a well in the center.',
    '2. Add the eggs, whisk while gradually pouring in the milk.',
    '3. Stir in the melted butter, whisk until smooth.',
    '4. Let the batter rest 1-2 hours in the fridge.',
    '5. Heat a lightly buttered crêpe pan, pour a ladleful and spread thin.',
    '6. Cook 1-2 min per side until golden.',
    '7. Serve with salted butter, sugar, or salted caramel.'
  ],
  salt: [
    '🥞 Savory Breton galette (galette bretonne, ~10 galettes)',
    '',
    'Ingredients:',
    '- 500g buckwheat flour (farine de sarrasin)',
    '- 1L water (or half water, half milk)',
    '- 2 eggs',
    '- 10g salt',
    '- 30g melted butter',
    '',
    'Steps:',
    '1. Mix buckwheat flour and salt in a bowl, make a well in the center.',
    '2. Add the eggs, whisk while gradually pouring in the water.',
    '3. Stir in the melted butter, whisk until smooth — batter should be thinner than sweet crêpe batter.',
    '4. Let the batter rest at least 1 hour, ideally overnight.',
    '5. Heat a well-seasoned, lightly buttered galette pan until very hot.',
    '6. Pour a ladleful, spread thin with a rozell (wooden rake).',
    '7. Cook until the edges lift and it dries out and crisps slightly, then flip briefly.',
    '8. Classic filling: ham, grated cheese, and an egg cracked in the center — fold the four sides in ("galette complète").'
  ]
}

const COMMANDS: Record<string, () => string[]> = {
  help: () => [`Available commands: ${COMMAND_LIST}`],
  whoami: () => ['mael-belliard — fullstack-developer'],
  ls: () => ['skills  experience  projects  pipeline  contact'],
  date: () => [new Date().toString()],
  skills: () => [skills.flatMap(group => group.items.map(item => item.label)).join(', ')],
  experience: () => experience.map(entry => `${entry.date} — ${entry.title}`),
  projects: () => [...featuredProjects.map(fp => fp.name), ...projects.map(project => project.name)],
  pipeline: () => [pipeline.map(step => step.title).join(' → ')],
  contact: () => [site.email, `github.com/${site.github.username}`, site.linkedin.replace('https://', '')],
  neofetch: () => [
    'mael-belliard@portfolio',
    '-----------------------',
    'OS: PortfolioOS (Nuxt)',
    'Host: whoami.maelbelliard.fr',
    'Shell: fake-sh',
    'Stack: Vue, Nuxt UI, FastAPI, Docker, Traefik',
    'Uptime: since 2023'
  ]
}

function runCommand(raw: string) {
  const trimmed = raw.trim()
  input.value = ''
  if (!trimmed) return

  const normalized = trimmed.toLowerCase()

  if (normalized === 'clear') {
    history.value = []
    return
  }

  if (normalized === 'sudo hire-me') {
    history.value.push({
      command: trimmed,
      output: ['[sudo] password for visitor: ********', 'Permission granted.', 'Initiating hire sequence…']
    })
    scrollToBottom()
    setTimeout(() => {
      const subject = encodeURIComponent('Let\'s build something')
      const body = encodeURIComponent('Hi Mael,\n\nI just ran `sudo hire-me` on your portfolio — let\'s talk about...')
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`
    }, 600)
    return
  }

  if (normalized === 'crepe' || normalized.startsWith('crepe ')) {
    const tag = normalized.slice('crepe'.length).trim()
    const isSalt = ['salt', 'salty', 'savory', 'savoury'].includes(tag)
    const isSweet = tag === '' || tag === 'sweet'

    history.value.push({
      command: trimmed,
      output: isSweet
        ? CREPE_RECIPES.sweet
        : isSalt
          ? CREPE_RECIPES.salt
          : [`Unknown crepe tag: "${tag}". Try "crepe sweet" or "crepe salt".`]
    })
    scrollToBottom()
    if (isSweet || isSalt) launchConfetti()
    return
  }

  if (normalized === 'snake') {
    history.value.push({ command: trimmed, output: ['Loading game…'] })
    scrollToBottom()
    inputEl.value?.blur()
    snakeOpen.value = true
    return
  }

  if (normalized === 'matrix') {
    toggleMatrixMode()
    history.value.push({
      command: trimmed,
      output: [matrixModeActive.value ? 'Wake up…' : 'Back to reality.']
    })
    scrollToBottom()
    return
  }

  if (normalized === 'sudo rm -rf /') {
    history.value.push({
      command: trimmed,
      output: ['Nice try. This terminal is read-only — and so is your judgment.']
    })
    scrollToBottom()
    inputEl.value?.blur()
    blackholeOpen.value = true
    return
  }

  if (normalized === ':(){ :|:& };:') {
    const index = history.value.length
    history.value.push({ command: trimmed, output: [] })
    scrollToBottom()
    inputEl.value?.blur()

    const FLOOD_LINES: Array<{ text: string, at: number }> = [
      { text: 'fork: retry: Resource temporarily unavailable', at: 220 },
      { text: 'fork: retry: Resource temporarily unavailable', at: 480 },
      { text: 'bash: fork: Cannot allocate memory', at: 680 },
      { text: 'fork: retry: Resource temporarily unavailable', at: 840 },
      { text: '-- process table full --', at: 960 },
      { text: 'bash: fork: Cannot allocate memory', at: 1050 },
      { text: '-- process table full --', at: 1120 },
      { text: '-- process table full --', at: 1180 }
    ]

    FLOOD_LINES.forEach(({ text, at }) => {
      setTimeout(() => {
        history.value[index]?.output.push(text)
        scrollToBottom()
      }, at)
    })

    setTimeout(() => {
      history.value[index]?.output.push('Kernel panic — not syncing: Out of memory and no killable processes...')
      scrollToBottom()
    }, 1450)

    setTimeout(() => {
      forkBombOpen.value = true
    }, 2100)

    return
  }

  if (normalized in NAV_PATHS) {
    const path = NAV_PATHS[normalized]!
    history.value.push({ command: trimmed, output: [`Opening ${path}…`] })
    scrollToBottom()
    setTimeout(() => navigateTo(path), 400)
    return
  }

  const handler = COMMANDS[normalized]
  history.value.push({
    command: trimmed,
    output: handler ? handler() : [`command not found: ${trimmed}`]
  })
  scrollToBottom()
}
</script>

<template>
  <div
    class="flex cursor-text flex-col border border-black/40 bg-tty-bg font-mono text-[13px] leading-relaxed text-tty-text shadow-[6px_6px_0_0_var(--ui-border)] dark:border-white/10"
    @click="focusInput"
  >
    <div class="flex items-center justify-between border-b border-white/8 px-4 py-2 text-[11px] text-tty-dim">
      <span>visitor@maelbelliard: ~</span>
      <span>tty1</span>
    </div>

    <div
      ref="scrollArea"
      class="h-72 overflow-y-auto px-4 pt-3 [scrollbar-color:var(--color-tty-dim)_transparent]"
    >
      <p><span class="text-orange-400">$</span> whoami</p>
      <p class="mb-2 text-tty-muted">
        mael-belliard — fullstack-developer
      </p>
      <p class="break-all">
        <span class="text-orange-400">$</span> curl -s api.github.com/users/{{ site.github.username }}/events | jq '.[0]'
      </p>
      <p class="mb-2 text-tty-muted">
        <NuxtLink
          v-if="nowStatus"
          :to="nowStatus.url"
          target="_blank"
          class="transition-colors hover:text-orange-400"
        >
          "{{ nowStatus.message }}" → {{ nowStatus.repo }} · {{ nowStatus.time }}
        </NuxtLink>
        <template v-else>
          based in Lyon · working @ LM Control
        </template>
      </p>
      <p><span class="text-orange-400">$</span> ./deploy.sh --env production</p>
      <p class="mb-2 text-tty-muted">
        <span class="text-led-ok">✓</span> shipped.
      </p>

      <template
        v-for="(entry, index) in history"
        :key="index"
      >
        <p class="break-all">
          <span class="text-orange-400">$</span> {{ entry.command }}
        </p>
        <p
          v-for="(line, lineIndex) in entry.output"
          :key="lineIndex"
          class="whitespace-pre-wrap text-tty-muted"
        >
          {{ line }}
        </p>
      </template>

      <div class="flex items-center gap-2 pb-3">
        <span class="text-orange-400">$</span>
        <input
          ref="inputEl"
          v-model="input"
          type="text"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          placeholder="type help"
          aria-label="Terminal input"
          class="flex-1 bg-transparent text-tty-text caret-orange-400 outline-none placeholder:text-tty-dim"
          @keydown.enter="runCommand(input)"
        >
      </div>
    </div>

    <div class="flex items-center justify-between bg-orange-500 px-3 py-0.5 text-[11px] text-black">
      <span>[whoami] 0:sh*</span>
      <span>"{{ site.github.username }}" <LiveClock :seconds="false" /></span>
    </div>
  </div>

  <ConfettiOverlay
    :pieces="confetti"
    emoji="🥞"
  />

  <SnakeGame
    v-if="snakeOpen"
    @close="closeSnake"
  />

  <BlackholeOverlay
    v-if="blackholeOpen"
    @close="closeBlackhole"
  />

  <ForkBombOverlay
    v-if="forkBombOpen"
    @close="closeForkBomb"
  />
</template>
