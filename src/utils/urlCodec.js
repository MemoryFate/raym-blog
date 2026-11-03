/**
 * URL 组件百分号编解码（浏览器本地处理）。
 * GBK / GB18030 / Big5 / Shift_JIS 编码表按浏览器 TextDecoder 反向生成。
 * GB18030 四字节指针使用 WHATWG Encoding Index 的 207 组范围。
 */
export const URL_ENCODING_OPTIONS = Object.freeze([
    { label:"UTF-8（推荐）", value:"UTF-8" },
    { label:"GBK（简体中文）", value:"GBK" },
    { label:"GB18030（简体中文）", value:"GB18030" },
    { label:"Big5（繁体中文）", value:"Big5" },
    { label:"Shift_JIS（日文）", value:"Shift_JIS" },
    { label:"ISO-8859-1（Latin-1）", value:"ISO-8859-1" },
    { label:"Windows-1252（西文）", value:"Windows-1252" },
    { label:"UTF-16LE", value:"UTF-16LE" },
])

const ENCODINGS = Object.freeze({
    "UTF-8":"utf-8",
    "GBK":"gbk",
    "GB18030":"gb18030",
    "Big5":"big5",
    "Shift_JIS":"shift_jis",
    "ISO-8859-1":"iso-8859-1",
    "Windows-1252":"windows-1252",
    "UTF-16LE":"utf-16le",
})

const WINDOWS_1252_SPECIAL = [
    0x20AC, null, 0x201A, 0x0192, 0x201E, 0x2026, 0x2020, 0x2021,
    0x02C6, 0x2030, 0x0160, 0x2039, 0x0152, null, 0x017D, null,
    null, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2013, 0x2014,
    0x02DC, 0x2122, 0x0161, 0x203A, 0x0153, null, 0x017E, 0x0178,
]

const GB18030_RANGES = [[0,128],[36,165],[38,169],[45,178],[50,184],[81,216],[89,226],[95,235],[96,238],[100,244],[103,248],[104,251],[105,253],[109,258],[126,276],[133,284],[148,300],[172,325],[175,329],[179,334],[208,364],[306,463],[307,465],[308,467],[309,469],[310,471],[311,473],[312,475],[313,477],[341,506],[428,594],[443,610],[544,712],[545,716],[558,730],[741,930],[742,938],[749,962],[750,970],[805,1026],[819,1104],[820,1106],[7922,8209],[7924,8215],[7925,8218],[7927,8222],[7934,8231],[7943,8241],[7944,8244],[7945,8246],[7950,8252],[8062,8365],[8148,8452],[8149,8454],[8152,8458],[8164,8471],[8174,8482],[8236,8556],[8240,8570],[8262,8596],[8264,8602],[8374,8713],[8380,8720],[8381,8722],[8384,8726],[8388,8731],[8390,8737],[8392,8740],[8393,8742],[8394,8748],[8396,8751],[8401,8760],[8406,8766],[8416,8777],[8419,8781],[8424,8787],[8437,8802],[8439,8808],[8445,8816],[8482,8854],[8485,8858],[8496,8870],[8521,8896],[8603,8979],[8936,9322],[8946,9372],[9046,9548],[9050,9588],[9063,9616],[9066,9622],[9076,9634],[9092,9652],[9100,9662],[9108,9672],[9111,9676],[9113,9680],[9131,9702],[9162,9735],[9164,9738],[9218,9793],[9219,9795],[11329,11906],[11331,11909],[11334,11913],[11336,11917],[11346,11928],[11361,11944],[11363,11947],[11366,11951],[11370,11956],[11372,11960],[11375,11964],[11389,11979],[11682,12284],[11686,12292],[11687,12312],[11692,12319],[11694,12330],[11714,12351],[11716,12436],[11723,12447],[11725,12535],[11730,12543],[11736,12586],[11982,12842],[11989,12850],[12102,12964],[12336,13200],[12348,13215],[12350,13218],[12384,13253],[12393,13263],[12395,13267],[12397,13270],[12510,13384],[12553,13428],[12851,13727],[12962,13839],[12973,13851],[13738,14617],[13823,14703],[13919,14801],[13933,14816],[14080,14964],[14298,15183],[14585,15471],[14698,15585],[15583,16471],[15847,16736],[16318,17208],[16434,17325],[16438,17330],[16481,17374],[16729,17623],[17102,17997],[17122,18018],[17315,18212],[17320,18218],[17402,18301],[17418,18318],[17859,18760],[17909,18811],[17911,18814],[17915,18820],[17916,18823],[17936,18844],[17939,18848],[17961,18872],[18664,19576],[18703,19620],[18814,19738],[18962,19887],[19043,40870],[33469,59244],[33470,59336],[33471,59367],[33484,59413],[33485,59417],[33490,59423],[33497,59431],[33501,59437],[33505,59443],[33513,59452],[33520,59460],[33536,59478],[33550,59493],[37845,63789],[37921,63866],[37948,63894],[38029,63976],[38038,63986],[38064,64016],[38065,64018],[38066,64021],[38069,64025],[38075,64034],[38076,64037],[38078,64042],[39108,65074],[39109,65093],[39113,65107],[39114,65112],[39115,65127],[39116,65132],[39265,65375],[39394,65510],[189000,65536]]

const encoderCaches = new Map()
const BIG5_DOUBLE_CODEPOINTS = new Set(["Ê\u0304", "Ê\u030C", "ê\u0304", "ê\u030C"])

function canonicalEncoding(encoding) {
    if (!Object.prototype.hasOwnProperty.call(ENCODINGS, encoding)) {
        throw new RangeError("不支持的字符编码：" + encoding)
    }
    return ENCODINGS[encoding]
}

function ensureValidUnicode(text) {
    for (const char of text) {
        const codePoint = char.codePointAt(0)
        if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
            throw new URIError("输入包含不完整的 Unicode 代理字符")
        }
    }
}

function legacyEncodingMap(encoding) {
    if (encoderCaches.has(encoding)) return encoderCaches.get(encoding)
    const decoder = new TextDecoder(canonicalEncoding(encoding))
    const table = new Map()
    const add = bytes => {
        const decoded = decoder.decode(new Uint8Array(bytes))
        if (!decoded || decoded.includes("\uFFFD")) return
        if (bytes.length === 2 && Array.from(decoded).length !== 1) {
            if (encoding !== "Big5" || !BIG5_DOUBLE_CODEPOINTS.has(decoded)) return
        }
        if (!table.has(decoded)) table.set(decoded, bytes)
    }

    for (let byte = 0x80; byte <= 0xFF; byte += 1) add([byte])
    for (let lead = 0x81; lead <= 0xFE; lead += 1) {
        if (encoding === "Shift_JIS" && !(lead <= 0x9F || (lead >= 0xE0 && lead <= 0xFC))) continue
        for (let trail = 0x40; trail <= 0xFE; trail += 1) {
            if (trail === 0x7F) continue
            if (encoding === "Big5" && trail > 0x7E && trail < 0xA1) continue
            if (encoding === "Shift_JIS" && trail > 0xFC) continue
            add([lead, trail])
        }
    }
    encoderCaches.set(encoding, table)
    return table
}

function gb18030FourBytes(codePoint) {
    let lower = 0
    let upper = GB18030_RANGES.length - 1
    while (lower <= upper) {
        const mid = (lower + upper) >>> 1
        if (GB18030_RANGES[mid][1] <= codePoint) lower = mid + 1
        else upper = mid - 1
    }
    if (upper < 0) throw new URIError("GB18030 无法编码该字符")
    let pointer = GB18030_RANGES[upper][0] + codePoint - GB18030_RANGES[upper][1]
    const byte1 = Math.floor(pointer / 12600) + 0x81
    pointer %= 12600
    const byte2 = Math.floor(pointer / 1260) + 0x30
    pointer %= 1260
    const byte3 = Math.floor(pointer / 10) + 0x81
    const byte4 = pointer % 10 + 0x30
    if (byte1 > 0xFE) throw new URIError("GB18030 字节超出有效范围")
    return [byte1, byte2, byte3, byte4]
}

function encodeBytesAsUrl(bytes) {
    // 多字节字符中的 ASCII 范围字节也要转义，如 Big5 的 0x63 和 GB18030 的数字位。
    return bytes.map(byte => "%" + byte.toString(16).toUpperCase().padStart(2, "0")).join("")
}

function encodeLegacyText(text, encoding) {
    ensureValidUnicode(text)
    if (encoding === "UTF-16LE") {
        const bytes = []
        for (let i = 0; i < text.length; i += 1) {
            const codeUnit = text.charCodeAt(i)
            bytes.push(codeUnit & 0xFF, codeUnit >>> 8)
        }
        return encodeBytesAsUrl(bytes)
    }

    const chars = Array.from(text)
    const hasNonAscii = chars.some(c => c.codePointAt(0) > 0x7F)
    const table = hasNonAscii && !["ISO-8859-1", "Windows-1252"].includes(encoding)
        ? legacyEncodingMap(encoding) : null
    let result = ""
    for (let i = 0; i < chars.length; i += 1) {
        const char = chars[i]
        const codePoint = char.codePointAt(0)
        if (codePoint < 0x80) {
            result += encodeURIComponent(char)
            continue
        }
        let bytes
        if (encoding === "ISO-8859-1") {
            if (codePoint > 0xFF) throw new URIError("ISO-8859-1 无法编码字符：" + char)
            bytes = [codePoint]
        } else if (encoding === "Windows-1252") {
            if (codePoint <= 0xFF && !(codePoint >= 0x80 && codePoint <= 0x9F)) {
                bytes = [codePoint]
            } else {
                const index = WINDOWS_1252_SPECIAL.indexOf(codePoint)
                if (index < 0) throw new URIError("Windows-1252 无法编码字符：" + char)
                bytes = [index + 0x80]
            }
        } else {
            const doubleChar = char + (chars[i + 1] || "")
            if (chars[i + 1] && table.has(doubleChar)) {
                bytes = table.get(doubleChar)
                i += 1
            } else if (table.has(char)) {
                bytes = table.get(char)
            } else if (encoding === "GB18030") {
                bytes = gb18030FourBytes(codePoint)
            } else {
                throw new URIError(encoding + " 无法编码字符：" + char)
            }
        }
        result += encodeBytesAsUrl(bytes)
    }
    return result
}

export function encodeUrlText(text, encoding = "UTF-8") {
    canonicalEncoding(encoding)
    if (encoding === "UTF-8") return encodeURIComponent(text)
    return encodeLegacyText(text, encoding)
}

function decodePercentBytes(fragment, encoding) {
    const hex = fragment.match(/[0-9a-fA-F]{2}/g) || []
    const bytes = Uint8Array.from(hex, value => Number.parseInt(value, 16))
    if (encoding === "ISO-8859-1") {
        return Array.from(bytes, byte => String.fromCharCode(byte)).join("")
    }
    if (encoding === "Windows-1252") {
        return Array.from(bytes, byte => {
            if (byte >= 0x80 && byte <= 0x9F) {
                const codePoint = WINDOWS_1252_SPECIAL[byte - 0x80]
                return String.fromCodePoint(codePoint ?? byte)
            }
            return String.fromCharCode(byte)
        }).join("")
    }
    try {
        return new TextDecoder(canonicalEncoding(encoding), { fatal:true, ignoreBOM:true }).decode(bytes)
    } catch {
        throw new URIError(encoding + " 字节序列无效或不完整")
    }
}

export function decodeUrlText(text, { spaceToPlus = false, encoding = "UTF-8" } = {}) {
    canonicalEncoding(encoding)
    let decoded
    if (encoding === "UTF-8") {
        decoded = decodeURIComponent(text)
    } else {
        if (/%(?![0-9a-fA-F]{2})/.test(text)) throw new URIError("百分号编码格式无效")
        decoded = text.replace(/(?:%[0-9a-fA-F]{2})+/g, part => decodePercentBytes(part, encoding))
    }
    return spaceToPlus ? decoded.replace(/ /g, "+") : decoded
}
