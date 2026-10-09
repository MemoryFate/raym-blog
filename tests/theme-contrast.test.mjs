import test from "node:test"
import assert from "node:assert/strict"
import { resolveTimeStateByMinute } from "../src/composables/useTimeTheme.js"
import { themeStates } from "../src/config/timeThemes.js"

function rgb(style) {
    const match = /^rgba?\(([^)]+)\)$/.exec(style)
    assert.ok(match, "Expected CSS rgba token, received: " + style)
    const values = match[1].split(",").map(value => Number(value.trim()))
    assert.ok(values.every(Number.isFinite), "Non-finite RGB token: " + style)
    return values
}

function luminance(color) {
    const [r, g, b] = color.map(value => {
        const channel = value / 255
        return channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a, b) {
    const x = luminance(a.slice(0, 3))
    const y = luminance(b.slice(0, 3))
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

const minContrast = 4.5
const timeLabels = [
    [270, "04:30"], [324, "05:24"], [390, "06:30"],
    [990, "16:30"], [1044, "17:24"], [1090, "18:10"],
    [1230, "20:30"], [1410, "23:30"],
]

test("all 1,440 theme samples preserve usable semantic UI contrast", () => {
    const surfaces = ["--color-bg-panel", "--color-bg-raised", "--color-bg-control", "--color-bg-selected"]
    const inks = ["--color-text-primary", "--color-heading-primary", "--color-text-secondary", "--color-accent-primary"]

    for (let minute = 0; minute < 1440; minute += 1) {
        const { styleVars, uiTheme } = resolveTimeStateByMinute(minute)
        assert.ok(["night", "dawn", "day", "sunset"].includes(uiTheme))

        for (const ink of inks) {
            for (const surface of surfaces) {
                const measured = contrast(rgb(styleVars[ink]), rgb(styleVars[surface]))
                assert.ok(
                    measured >= minContrast,
                    minute + ": " + ink + " against " + surface + " fell to " + measured.toFixed(2)
                )
            }
        }

        const actionContrast = contrast(
            rgb(styleVars["--color-action-primary"]),
            rgb(styleVars["--color-accent-contrast"]),
        )
        assert.ok(actionContrast >= minContrast, minute + ": primary action contrast " + actionContrast.toFixed(2))
    }
})

test("twilight hours switch a matched text-and-surface palette together", () => {
    assert.equal(resolveTimeStateByMinute(324).uiTheme, "night")
    assert.equal(resolveTimeStateByMinute(330).uiTheme, "dawn")
    assert.equal(resolveTimeStateByMinute(1044).uiTheme, "sunset")

    for (const [minute, label] of timeLabels) {
        const sample = resolveTimeStateByMinute(minute)
        assert.ok(sample.theme, label + ": missing phase theme")
        assert.ok(sample.styleVars["--sky-mid"], label + ": missing interpolated sky")
        assert.ok(sample.styleVars["--color-on-sky-primary"], label + ": missing readable sky text")
    }
})

test("青岚和暮光使用明确的青绿→蓝、天空蓝→麦穗金调色逻辑", () => {
    const dawn = themeStates.dawn.tokens
    const sunset = themeStates.sunset.tokens

    assert.ok(dawn.skyMid[1] > dawn.skyMid[0], "青岚中段应该以青绿为主")
    assert.ok(dawn.skyEnd[2] > dawn.skyEnd[0], "青岚末端应该融入天空蓝")
    assert.ok(sunset.skyStart[2] > sunset.skyStart[0], "暮光上方应该是蓝色")
    assert.ok(sunset.skyEnd[0] > sunset.skyEnd[2] * 1.5, "暮光下方应该是麦穗金黄色")

    for (const minute of [324, 390, 990, 1044, 1090, 1160, 1230]) {
        const vars = resolveTimeStateByMinute(minute).styleVars
        assert.ok(vars["--sky-start"], minute + ": 缺少天空渐变")
        assert.ok(vars["--color-bg-panel"], minute + ": 缺少卡片底色")
    }
})
