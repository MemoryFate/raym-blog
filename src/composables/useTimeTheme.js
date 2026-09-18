import { onBeforeUnmount, onMounted, ref } from "vue"

export function resolveTimeTheme(date = new Date()) {
    const hour = date.getHours()
    if (hour >= 5 && hour < 8) return "dawn"
    if (hour >= 8 && hour < 17) return "day"
    if (hour >= 17 && hour < 20) return "sunset"
    return "night"
}

export function useTimeTheme() {
    const theme = ref(resolveTimeTheme())
    let timerId

    const updateTheme = () => {
        theme.value = resolveTimeTheme()
    }

    onMounted(() => {
        updateTheme()
        timerId = window.setInterval(updateTheme, 60_000)
    })

    onBeforeUnmount(() => {
        if (timerId) window.clearInterval(timerId)
    })

    return { theme }
}
