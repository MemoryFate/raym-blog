<template>
    <component
        :is="as"
        class="neon-glass"
        :class="{
            'neon-glass--interactive': interactive,
            'neon-glass--glow': glow,
            'neon-glass--overflow-visible': !clip,
        }"
    >
        <slot />
    </component>
</template>

<script setup>
defineProps({
    as: { type: String, default: "div" },
    interactive: Boolean,
    glow: Boolean,
    clip: { type: Boolean, default: true },
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
    transition: transform 190ms ease, border-color 190ms ease, box-shadow 190ms ease, background 300ms ease;
}

.neon-glass--overflow-visible {
    overflow: visible;
}

.neon-glass::before,
.neon-glass::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
}

.neon-glass::before {
    background: linear-gradient(125deg, rgba(255,255,255,.1), transparent 34%, transparent 72%, rgba(255,255,255,.04));
    opacity: .62;
}

.neon-glass::after {
    background: var(--color-accent-primary);
    opacity: 0;
    transition: opacity 180ms ease;
    mix-blend-mode: soft-light;
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

.neon-glass--interactive:hover::after { opacity: .055; }
.neon-glass--interactive:active { transform: translateY(-1px); }
.neon-glass--interactive:active::after { opacity: .1; }

.neon-glass--interactive:focus-within {
    border-color: var(--color-accent-primary);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-accent-primary) 48%, transparent), var(--shadow-glow);
}

@media (prefers-reduced-motion: reduce) {
    .neon-glass,
    .neon-glass::after { transition: none; }
    .neon-glass--interactive:hover,
    .neon-glass--interactive:active { transform: none; }
}
</style>
