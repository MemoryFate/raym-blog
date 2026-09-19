const c = (r, g, b, a = 1) => [r, g, b, a]

export const themeStates = {
    night: {
        tokens: {
            bgBase:c(5,9,14),
            bgPanel:c(11,21,29),
            bgPanelStrong:c(15,28,38),
            bgRaised:c(15,28,38),
            bgControl:c(17,38,51),
            bgSelected:c(20,53,70),
            panelHighlight:c(15,28,38),
            chipBg:c(17,38,51),

            headingPrimary:c(234,246,255),
            textPrimary:c(234,246,255),
            textSecondary:c(150,175,191),
            textOnAccent:c(4,16,24),

            accentPrimary:c(120,207,246),
            accentSecondary:c(169,231,255),
            actionPrimary:c(120,207,246),
            accentContrast:c(4,16,24),

            borderDefault:c(35,72,95),
            borderStrong:c(88,188,235),
            borderGlow:c(97,200,255),

            ambientPrimary:c(31,106,152),
            ambientSecondary:c(126,215,255),
            canvasStar:c(235,247,255),
            canvasCloud:c(98,120,136),

            skyStart:c(5,9,14),
            skyMid:c(7,19,29),
            skyEnd:c(10,28,41),
            glowPrimary:c(31,106,152,.12),
            glowSecondary:c(126,215,255,.20),
        },
        atmosphere:{
            starDimOpacity:.56,
            starBrightOpacity:.90,
            starCount:72,
            starDrift:.42,
            twinkleAmount:.28,
            cloudOpacity:.18,
            cloudDensity:.58,
            cloudBlur:22,
            cloudTravelSeconds:190,
            cloudParallax:1,
            particleCount:42,
            particleOpacity:.20,
            particleSpeed:.55,
            meteorOpacity:.52,
            haloOpacity:.15,
            warmOpacity:0,
            speed:.70,
        },
    },

    dawn: {
        tokens: {
            bgBase:c(243,247,242),
            bgPanel:c(233,242,236),
            bgPanelStrong:c(246,250,247),
            bgRaised:c(246,250,247),
            bgControl:c(216,232,222),
            bgSelected:c(203,227,211),
            panelHighlight:c(246,250,247),
            chipBg:c(216,232,222),

            headingPrimary:c(24,55,43),
            textPrimary:c(24,55,43),
            textSecondary:c(92,116,105),
            textOnAccent:c(247,255,250),

            accentPrimary:c(47,143,103),
            accentSecondary:c(143,199,166),
            actionPrimary:c(47,143,103),
            accentContrast:c(247,255,250),

            borderDefault:c(169,203,183),
            borderStrong:c(103,169,133),
            borderGlow:c(127,190,153),

            ambientPrimary:c(248,252,246),
            ambientSecondary:c(185,230,202),
            canvasStar:c(235,247,255),
            canvasCloud:c(248,251,248),

            skyStart:c(243,247,242),
            skyMid:c(231,241,234),
            skyEnd:c(221,234,228),
            glowPrimary:c(248,252,246,.34),
            glowSecondary:c(185,230,202,.42),
        },
        atmosphere:{
            starDimOpacity:.14,
            starBrightOpacity:.22,
            starCount:54,
            starDrift:.20,
            twinkleAmount:.16,
            cloudOpacity:.30,
            cloudDensity:.92,
            cloudBlur:28,
            cloudTravelSeconds:220,
            cloudParallax:.72,
            particleCount:30,
            particleOpacity:.12,
            particleSpeed:.34,
            meteorOpacity:.04,
            haloOpacity:.18,
            warmOpacity:0,
            speed:.72,
        },
    },

    day: {
        tokens: {
            bgBase:c(221,239,229),
            bgPanel:c(207,230,220),
            bgPanelStrong:c(229,243,236),
            bgRaised:c(229,243,236),
            bgControl:c(189,218,213),
            bgSelected:c(174,215,198),
            panelHighlight:c(229,243,236),
            chipBg:c(189,218,213),

            headingPrimary:c(21,54,47),
            textPrimary:c(21,54,47),
            textSecondary:c(73,104,95),
            textOnAccent:c(247,255,255),

            accentPrimary:c(37,143,105),
            accentSecondary:c(62,157,204),
            actionPrimary:c(37,143,105),
            accentContrast:c(247,255,255),

            borderDefault:c(143,191,184),
            borderStrong:c(74,159,192),
            borderGlow:c(99,182,215),

            ambientPrimary:c(167,221,190),
            ambientSecondary:c(142,212,238),
            canvasStar:c(235,247,255),
            canvasCloud:c(233,245,239),

            skyStart:c(221,239,229),
            skyMid:c(201,233,221),
            skyEnd:c(185,221,242),
            glowPrimary:c(167,221,190,.28),
            glowSecondary:c(142,212,238,.34),
        },
        atmosphere:{
            starDimOpacity:.02,
            starBrightOpacity:.04,
            starCount:34,
            starDrift:.10,
            twinkleAmount:.08,
            cloudOpacity:.34,
            cloudDensity:1,
            cloudBlur:30,
            cloudTravelSeconds:175,
            cloudParallax:.86,
            particleCount:24,
            particleOpacity:.10,
            particleSpeed:.30,
            meteorOpacity:0,
            haloOpacity:.20,
            warmOpacity:0,
            speed:.78,
        },
    },

    sunset: {
        tokens: {
            bgBase:c(140,100,54),
            bgPanel:c(95,73,56,.97),
            bgPanelStrong:c(108,84,64,.97),
            bgRaised:c(108,84,64,.97),
            bgControl:c(122,96,71,.98),
            bgSelected:c(139,109,79,.97),
            panelHighlight:c(108,84,64,.97),
            chipBg:c(122,96,71,.98),

            headingPrimary:c(242,242,236),
            textPrimary:c(247,241,231),
            textSecondary:c(171,183,190),
            textOnAccent:c(30,22,16),

            accentPrimary:c(113,168,196),
            accentSecondary:c(217,162,74),
            actionPrimary:c(217,162,74),
            accentContrast:c(30,22,16),

            borderDefault:c(169,133,92,.95),
            borderStrong:c(212,168,102,.90),
            borderGlow:c(212,168,102,.95),

            ambientPrimary:c(216,154,72),
            ambientSecondary:c(122,167,199),
            canvasStar:c(243,217,162),
            canvasCloud:c(156,122,89),

            skyStart:c(79,57,39),
            skyMid:c(140,100,54),
            skyEnd:c(169,121,62),
            glowPrimary:c(216,154,72,.34),
            glowSecondary:c(122,167,199,.12),
        },
        atmosphere:{
            starDimOpacity:.066,
            starBrightOpacity:.11,
            starCount:50,
            starDrift:.25,
            twinkleAmount:.18,
            cloudOpacity:.12,
            cloudDensity:.76,
            cloudBlur:26,
            cloudTravelSeconds:205,
            cloudParallax:.82,
            particleCount:34,
            particleOpacity:.14,
            particleSpeed:.42,
            meteorOpacity:.16,
            haloOpacity:.22,
            warmOpacity:.13,
            speed:.66,
        },
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
