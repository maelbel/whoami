<script setup lang="ts">
const { site } = useAppConfig()

const title = `Résumé — ${site.name}`

useSeoMeta({ title, description: resumeSummary })

function printResume() {
  window.print()
}

onMounted(printResume)
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-10 sm:px-6">
    <div class="print:hidden flex items-center justify-between gap-2 mb-8">
      <UButton
        to="/"
        icon="i-lucide-arrow-left"
        variant="ghost"
        color="neutral"
      >
        Back to site
      </UButton>
      <UButton
        icon="i-lucide-printer"
        @click="printResume"
      >
        Print / Save as PDF
      </UButton>
    </div>

    <div class="bg-white text-black rounded-lg p-8 sm:p-12 print:p-0 print:rounded-none">
      <header class="mb-6 border-b border-gray-300 pb-6">
        <h1 class="text-3xl font-bold">
          {{ site.name }}
        </h1>
        <p class="text-lg text-gray-600">
          {{ resumeTitle }} · {{ resumeLocation }}
        </p>
        <p class="mt-2 text-sm text-gray-600 flex flex-wrap gap-x-4">
          <span>{{ site.email }}</span>
          <span>github.com/{{ site.github.username }}</span>
          <span>{{ site.linkedin.replace('https://www.', '') }}</span>
        </p>
      </header>

      <section class="mb-6">
        <p class="text-sm leading-relaxed">
          {{ resumeSummary }}
        </p>
      </section>

      <section class="mb-6">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Skills
        </h2>
        <p
          v-for="group in skills"
          :key="group.category"
          class="text-sm mb-1"
        >
          <span class="font-semibold">{{ group.category }}:</span>
          {{ group.items.map(item => item.label).join(', ') }}
        </p>
      </section>

      <section class="mb-6">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
          Experience
        </h2>
        <div
          v-for="entry in experience"
          :key="entry.title + entry.date"
          class="mb-4 last:mb-0"
        >
          <div class="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 class="text-sm font-semibold">
              {{ entry.title }}
            </h3>
            <span class="text-xs text-gray-500">{{ entry.date }}</span>
          </div>
          <p class="text-sm text-gray-700">
            {{ entry.description }}
          </p>
        </div>
      </section>

      <section>
        <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
          Education
        </h2>
        <div
          v-for="entry in education"
          :key="entry.title + entry.date"
          class="mb-4 last:mb-0"
        >
          <div class="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 class="text-sm font-semibold">
              {{ entry.title }}
            </h3>
            <span class="text-xs text-gray-500">{{ entry.date }}</span>
          </div>
          <p class="text-sm text-gray-700">
            {{ entry.description }}
          </p>
        </div>
      </section>
    </div>
  </div>
</template>
