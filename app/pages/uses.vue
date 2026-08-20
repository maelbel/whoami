<script setup lang="ts">
const { site } = useAppConfig()

const description = 'The actual hardware, software, and smart home setup behind the home server described on /infra.'

useSeoMeta({
  title: `Uses — ${site.name}`,
  description
})
defineOgImage('Terminal.satori', { title: 'Uses', description })
</script>

<template>
  <div>
    <UPageHero
      headline="Real hardware, real software"
      title="What I actually run this on"
      description="Not a wishlist — this is the real hardware and software behind the home server on /infra, plus the smart home devices it talks to."
    />

    <UPageSection
      title="The home server"
      description="One Raspberry Pi 5, doing all of it."
    >
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="tool in hardware"
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
      title="Day to day"
      description="OS, editor, terminal, browser, and how it's all reached from outside the home network."
    >
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="tool in software"
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
      title="Smart home"
      description="What's actually connected — most of it through Home Assistant and Zigbee2MQTT below."
    >
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="tool in smartHome"
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
      title="Homelab software"
      description="Everything self-hosted on that same Pi — see /infra for how it's all routed."
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

      <UButton
        to="/infra"
        variant="link"
        size="sm"
        trailing-icon="i-lucide-arrow-right"
        class="mt-4"
      >
        See how it's all routed
      </UButton>
    </UPageSection>
  </div>
</template>
