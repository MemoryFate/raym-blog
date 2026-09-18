<template>
    <footer class="site-footer">
        <span>© 2026 RayM. 由好奇心驱动。</span>
        <a href="https://github.com/MemoryFate/raym-blog" target="_blank" rel="noreferrer">GitHub ↗</a>
    </footer>
</template>

<style scoped lang="scss">
.site-footer {
    width: min(1180px, calc(100% - 40px)); margin: 80px auto 0; padding: 22px 0 30px;
    border-top: 1px solid color-mix(in srgb, var(--color-border-glow) 58%, transparent);
    display: flex; align-items: center; justify-content: space-between; gap: 20px;
    color: var(--color-text-secondary); font-size: 12px;
}
.site-footer a { color: var(--color-text-secondary); text-decoration: none; }
.site-footer a:hover { color: var(--color-accent-primary); }
@media (max-width: 600px) {
    .site-footer { width: calc(100% - 40px); margin-top: 56px; align-items: flex-start; flex-direction: column; }
}
</style>
