const c = (r, g, b, a = 1) => [r, g, b, a]

export const themeStates = {
    night: {
        tokens: {
            bgBase:c(2,6,17), bgPanel:c(8,22,42,.84), bgPanelStrong:c(6,16,32,.96), panelHighlight:c(16,39,67,.78),
            chipBg:c(7,30,54,.88), borderGlow:c(22,143,216,.78), accentPrimary:c(32,174,255), accentSecondary:c(125,104,255),
            accentContrast:c(2,6,17), textPrimary:c(243,248,255), textSecondary:c(183,200,220),
            skyStart:c(2,6,17), skyMid:c(4,17,38), skyEnd:c(6,27,52), glowPrimary:c(32,174,255,.22), glowSecondary:c(125,104,255,.15),
        },
        atmosphere:{ starOpacity:.9, cloudOpacity:.1, haloOpacity:.12, warmOpacity:.02 },
    },
    dawn: {
        tokens: {
            bgBase:c(6,18,38), bgPanel:c(11,32,56,.84), bgPanelStrong:c(8,26,47,.96), panelHighlight:c(20,54,86,.8),
            chipBg:c(10,42,70,.88), borderGlow:c(53,165,229,.78), accentPrimary:c(76,194,255), accentSecondary:c(138,124,255),
            accentContrast:c(4,17,32), textPrimary:c(245,250,255), textSecondary:c(189,208,228),
            skyStart:c(4,12,28), skyMid:c(9,36,68), skyEnd:c(19,70,105), glowPrimary:c(76,194,255,.3), glowSecondary:c(138,124,255,.15),
        },
        atmosphere:{ starOpacity:.24, cloudOpacity:.2, haloOpacity:.2, warmOpacity:.07 },
    },
    day: {
        tokens: {
            bgBase:c(7,26,50), bgPanel:c(13,41,71,.84), bgPanelStrong:c(10,32,58,.96), panelHighlight:c(24,65,101,.8),
            chipBg:c(13,51,82,.88), borderGlow:c(58,185,238,.78), accentPrimary:c(90,210,255), accentSecondary:c(108,160,255),
            accentContrast:c(4,20,34), textPrimary:c(247,251,255), textSecondary:c(198,218,238),
            skyStart:c(5,22,43), skyMid:c(10,58,98), skyEnd:c(16,92,139), glowPrimary:c(90,210,255,.28), glowSecondary:c(108,160,255,.14),
        },
        atmosphere:{ starOpacity:.03, cloudOpacity:.28, haloOpacity:.2, warmOpacity:.03 },
    },
    sunset: {
        tokens: {
            bgBase:c(9,20,45), bgPanel:c(21,28,59,.86), bgPanelStrong:c(17,22,50,.96), panelHighlight:c(44,38,86,.8),
            chipBg:c(33,31,76,.88), borderGlow:c(135,104,232,.8), accentPrimary:c(138,122,255), accentSecondary:c(255,155,112),
            accentContrast:c(9,20,45), textPrimary:c(255,247,242), textSecondary:c(216,202,223),
            skyStart:c(7,13,34), skyMid:c(35,25,80), skyEnd:c(71,37,78), glowPrimary:c(138,122,255,.3), glowSecondary:c(255,155,112,.2),
        },
        atmosphere:{ starOpacity:.24, cloudOpacity:.2, haloOpacity:.2, warmOpacity:.16 },
    },
}

export const timeThemeKeyframes = [
    { minute:0, state:"night" },
    { minute:270, state:"night" },
    { minute:390, state:"dawn" },
    { minute:480, state:"day" },
    { minute:990, state:"day" },
    { minute:1090, state:"sunset" },
    { minute:1230, state:"night" },
    { minute:1440, state:"night" },
]

export function semanticThemeForMinute(minute) {
    if (minute >= 300 && minute < 480) return "dawn"
    if (minute >= 480 && minute < 990) return "day"
    if (minute >= 990 && minute < 1170) return "sunset"
    return "night"
}
