<template>
    <component
        :is="as"
        class="neon-glass"
        :class="{
            'neon-glass--interactive': interactive,
            'neon-glass--glow': glow,
            'neon-glass--raised': raised,
            'neon-glass--selected': selected,
            'neon-glass--overflow-visible': !clip,
        }"
    >
        <slot />
    </component>
</template>

<script setup>
defineProps({
    as:{type:String,default:"div"},
    interactive:Boolean,
    glow:Boolean,
    raised:Boolean,
    selected:Boolean,
    clip:{type:Boolean,default:true},
})
</script>

<style scoped lang="scss">
.neon-glass {
    position:relative;
    overflow:hidden;
    border:1px solid var(--color-border-default);
    border-radius:22px;
    background:var(--color-bg-panel);
    box-shadow:none;
    backdrop-filter:blur(18px) saturate(112%);
    -webkit-backdrop-filter:blur(18px) saturate(112%);
    transition:
        transform 190ms ease,
        border-color 190ms ease,
        box-shadow 190ms ease,
        background 420ms ease;
}

.neon-glass--raised,
.neon-glass--glow {
    background:var(--color-bg-raised);
}

.neon-glass--selected {
    background:var(--color-bg-selected);
    border-color:var(--color-border-strong);
    box-shadow:var(--shadow-selected);
}

.neon-glass--overflow-visible { overflow:visible; }

.neon-glass::before,
.neon-glass::after {
    content:"";
    position:absolute;
    inset:0;
    border-radius:inherit;
    pointer-events:none;
}

.neon-glass::before { opacity:0; }

.neon-glass::after {
    background:var(--color-accent-primary);
    opacity:0;
    transition:opacity 180ms ease;
    mix-blend-mode:soft-light;
}

.neon-glass--glow {
    border-color:var(--color-border-strong);
    box-shadow:var(--shadow-glow);
}

.neon-glass--interactive:hover {
    transform:translateY(-4px);
    border-color:var(--color-border-strong);
    box-shadow:var(--shadow-hover);
}

.neon-glass--interactive:hover::after { opacity:.04; }
.neon-glass--interactive:active { transform:translateY(-1px); }
.neon-glass--interactive:active::after { opacity:.08; }

.neon-glass--interactive:focus-within {
    border-color:var(--color-border-strong);
    box-shadow:
        0 0 0 2px color-mix(in srgb,var(--color-accent-primary) 48%,transparent),
        var(--shadow-glow);
}

@media (prefers-reduced-motion:reduce) {
    .neon-glass,
    .neon-glass::after { transition:none; }

    .neon-glass--interactive:hover,
    .neon-glass--interactive:active { transform:none; }
}
</style>
