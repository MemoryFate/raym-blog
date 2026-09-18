<template>
    <component
        :is="as"
        class="neon-glass"
        :class="{ 'neon-glass--interactive': interactive, 'neon-glass--glow': glow }"
    >
        <slot />
    </component>
</template>

<script setup>
defineProps({
    as: {
        type: String,
        default: "div",
    },
    interactive: Boolean,
    glow: Boolean,
})
</script>

<style scoped lang="scss">
.neon-glass {
    position: relative;
    overflow: hidden;
    border: 1px solid var(--color-border-glow);
    border-radius: 22px;
    background: linear-gradient(145deg, var(--color-panel-highlight), var(--color-bg-panel));
    box-shadow: var(--shadow-panel);
    backdrop-filter: blur(18px) saturate(130%);
    -webkit-backdrop-filter: blur(18px) saturate(130%);
    transition:
        transform 180ms ease,
        border-color 180ms ease,
        box-shadow 180ms ease,
        background 300ms ease;
}

.neon-glass::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(125deg, rgba(255, 255, 255, 0.09), transparent 34%, transparent 72%, rgba(255, 255, 255, 0.04));
    opacity: 0.65;
}

.neon-glass--glow {
    border-color: var(--color-accent-primary);
    box-shadow: var(--shadow-glow);
}

.neon-glass--interactive:hover {
    transform: translateY(-4px);
    border-color: var(--color-accent-primary);
    box-shadow: var(--shadow-hover);
}

@media (prefers-reduced-motion: reduce) {
    .neon-glass {
        transition: none;
    }
}
</style>
