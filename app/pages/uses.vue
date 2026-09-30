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
    <PageIntro
      path="~/uses"
      title="What I actually run this on"
      description="Not a wishlist — this is the real hardware and software behind the home server on /infra, plus the smart home devices it talks to."
    >
      <NuxtLink
        to="/pi5"
        class="mt-8 inline-flex items-center gap-2 bg-inverted px-4 py-2.5 font-mono text-sm text-inverted transition-colors hover:bg-primary hover:text-white"
      >
        take the Pi apart in 3D →
      </NuxtLink>
    </PageIntro>

    <ModuleSection
      index="01"
      topic="uses/hardware"
      title="The home server"
      description="One Raspberry Pi 5, doing all of it."
    >
      <InventoryTable
        :items="hardware"
        prefix="HW"
      />
    </ModuleSection>

    <ModuleSection
      index="02"
      topic="uses/software"
      title="Day to day"
      description="OS, editor, terminal, browser, and how it's all reached from outside the home network."
    >
      <InventoryTable
        :items="software"
        prefix="SW"
      />
    </ModuleSection>

    <ModuleSection
      index="03"
      topic="uses/iot"
      title="Smart home"
      description="What's actually connected — most of it through Home Assistant and Zigbee2MQTT below."
    >
      <InventoryTable
        :items="smartHome"
        prefix="IOT"
      />
    </ModuleSection>

    <ModuleSection
      index="04"
      topic="uses/homelab"
      title="Homelab software"
      description="Everything self-hosted on that same Pi — see /infra for how it's all routed."
    >
      <InventoryTable
        :items="homelab"
        prefix="SVC"
      />

      <NuxtLink
        to="/infra"
        class="mt-10 inline-block font-mono text-sm text-highlighted underline decoration-(--ui-border-accented) underline-offset-4 hover:text-primary hover:decoration-current"
      >
        /infra — how it's all routed →
      </NuxtLink>
    </ModuleSection>
  </div>
</template>
