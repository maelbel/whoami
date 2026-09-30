<script setup lang="ts">
// Skills laid out like a GPIO header: odd pins on the left, even pins on the
// right, each category occupying consecutive rows.
const GROUP_STYLES = [
  { pin: 'bg-orange-500', swatch: 'bg-orange-500', note: 'Interfaces in Vue & Nuxt, typed end to end.' },
  { pin: 'bg-[#DCD7CB]', swatch: 'bg-[#DCD7CB] dark:bg-[#DCD7CB] ring-1 ring-black/20', note: 'APIs in NestJS or FastAPI, backed by Postgres.' },
  { pin: 'bg-led-ok', swatch: 'bg-led-ok', note: 'Containers, proxies and pipelines that ship it.' }
]

const rows = computed(() => skills.flatMap((group, groupIndex) => {
  const pairs = []
  for (let i = 0; i < group.items.length; i += 2) {
    pairs.push({
      group: group.category,
      groupIndex,
      groupStart: i === 0,
      left: group.items[i]!,
      right: group.items[i + 1]
    })
  }
  return pairs
}).map((row, index) => ({ ...row, leftPin: index * 2 + 1, rightPin: index * 2 + 2 })))

const groupRowSpan = computed(() => Object.fromEntries(skills.map(group => [group.category, Math.ceil(group.items.length / 2)])))

const hovered = ref<number | null>(null)

function pad(pin: number) {
  return String(pin).padStart(2, '0')
}
</script>

<template>
  <div class="grid gap-12 xl:grid-cols-[1fr_16rem]">
    <div
      class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] font-mono text-xs sm:grid-cols-[7rem_minmax(0,1fr)_auto_minmax(0,1fr)] sm:text-[13px]"
      role="table"
      aria-label="Skills pinout"
    >
      <template
        v-for="(row, index) in rows"
        :key="row.leftPin"
      >
        <div
          v-if="row.groupStart"
          class="label hidden border-r border-default pt-3 pr-3 text-dimmed sm:block"
          :class="index > 0 && 'border-t'"
          :style="{ gridRow: `span ${groupRowSpan[row.group]}` }"
        >
          {{ row.group }}
        </div>

        <div
          class="flex items-center justify-end gap-2 py-2.5 pr-3 text-right sm:pr-4"
          :class="[row.groupStart && index > 0 && 'border-t border-default', hovered === row.leftPin ? 'text-highlighted' : 'text-toned']"
          role="cell"
          @mouseenter="hovered = row.leftPin"
          @mouseleave="hovered = null"
        >
          <span class="truncate">{{ row.left.label }}</span>
          <UIcon
            :name="row.left.icon"
            class="size-4 shrink-0 text-muted"
          />
          <span class="w-5 text-[10px] text-dimmed">{{ pad(row.leftPin) }}</span>
        </div>

        <div
          class="flex items-center gap-2.5 bg-tty-bg px-2.5"
          :class="[index === 0 && 'pt-2', index === rows.length - 1 && 'pb-2']"
          aria-hidden="true"
        >
          <span
            v-for="pin in [row.leftPin, row.rightPin]"
            :key="pin"
            class="flex size-4 items-center justify-center transition-transform"
            :class="[pin === 1 ? '' : 'rounded-full', hovered === pin ? 'scale-125' : '']"
          >
            <span
              v-if="pin === row.leftPin || row.right"
              class="size-2.5"
              :class="[GROUP_STYLES[row.groupIndex]!.pin, pin === 1 ? '' : 'rounded-full', hovered === pin && 'shadow-[0_0_8px_currentColor]']"
            />
          </span>
        </div>

        <div
          class="flex items-center gap-2 py-2.5 pl-3 sm:pl-4"
          :class="[row.groupStart && index > 0 && 'border-t border-default', hovered === row.rightPin ? 'text-highlighted' : 'text-toned']"
          role="cell"
          @mouseenter="hovered = row.rightPin"
          @mouseleave="hovered = null"
        >
          <template v-if="row.right">
            <span class="w-5 text-[10px] text-dimmed">{{ pad(row.rightPin) }}</span>
            <UIcon
              :name="row.right.icon"
              class="size-4 shrink-0 text-muted"
            />
            <span class="truncate">{{ row.right.label }}</span>
          </template>
        </div>
      </template>
    </div>

    <ul class="flex flex-col gap-6 border-t border-default pt-6 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-8">
      <li
        v-for="(group, groupIndex) in skills"
        :key="group.category"
        class="flex gap-3"
      >
        <span
          class="mt-1 size-2.5 shrink-0"
          :class="GROUP_STYLES[groupIndex]!.swatch"
        />
        <div>
          <p class="label text-highlighted">
            {{ group.category }}
          </p>
          <p class="mt-1 text-sm text-muted">
            {{ GROUP_STYLES[groupIndex]!.note }}
          </p>
        </div>
      </li>
      <li class="label text-dimmed">
        {{ rows.length * 2 }} of 40 pins used
      </li>
    </ul>
  </div>
</template>
