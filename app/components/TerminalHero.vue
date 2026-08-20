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

const COMMAND_LIST = 'whoami, ls, skills, experience, projects, pipeline, contact, resume, infra, date, neofetch, sudo hire-me, clear'

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
  projects: () => [featuredProject.name, ...projects.map(project => project.name)],
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

  if (normalized === 'sudo rm -rf /') {
    history.value.push({
      command: trimmed,
      output: ['Nice try. This terminal is read-only — and so is your judgment.']
    })
    scrollToBottom()
    return
  }

  if (normalized === 'resume' || normalized === 'infra') {
    const path = normalized === 'resume' ? '/resume' : '/infra'
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
  <UCard
    variant="subtle"
    class="font-mono text-sm cursor-text"
    @click="focusInput"
  >
    <div class="flex items-center gap-1.5 mb-3">
      <span class="size-2.5 rounded-full bg-red-500/70" />
      <span class="size-2.5 rounded-full bg-yellow-500/70" />
      <span class="size-2.5 rounded-full bg-green-500/70" />
    </div>

    <div
      ref="scrollArea"
      class="max-h-72 overflow-y-auto"
    >
      <p><span class="text-primary">$</span> whoami</p>
      <p class="text-muted mb-2">
        mael-belliard — fullstack-developer
      </p>
      <p><span class="text-primary">$</span> curl -s api.github.com/users/{{ site.github.username }}/events | jq '.[0]'</p>
      <p class="text-muted mb-2">
        <NuxtLink
          v-if="nowStatus"
          :to="nowStatus.url"
          target="_blank"
          class="hover:text-primary transition-colors"
        >
          "{{ nowStatus.message }}" → {{ nowStatus.repo }} · {{ nowStatus.time }}
        </NuxtLink>
        <template v-else>
          based in Lyon · working @ LM Control
        </template>
      </p>
      <p><span class="text-primary">$</span> ./deploy.sh --env production</p>
      <p class="text-muted mb-2">
        <UIcon
          name="i-lucide-check"
          class="text-primary align-[-2px]"
        /> shipped.
      </p>

      <template
        v-for="(entry, index) in history"
        :key="index"
      >
        <p><span class="text-primary">$</span> {{ entry.command }}</p>
        <p
          v-for="(line, lineIndex) in entry.output"
          :key="lineIndex"
          class="text-muted"
        >
          {{ line }}
        </p>
      </template>
    </div>

    <div class="flex items-center gap-1.5 mt-2">
      <span class="text-primary">$</span>
      <input
        ref="inputEl"
        v-model="input"
        type="text"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        placeholder="type help"
        class="flex-1 bg-transparent outline-none text-default placeholder:text-dimmed"
        @keydown.enter="runCommand(input)"
      >
    </div>
  </UCard>

  <ConfettiOverlay
    :pieces="confetti"
    emoji="🥞"
  />
</template>
