import test from "node:test"
import assert from "node:assert/strict"
import { URL_ENCODING_OPTIONS, encodeUrlText, decodeUrlText } from "../src/utils/urlCodec.js"

test("支持 8 种字符编码，默认 UTF-8", () => {
    assert.deepEqual(URL_ENCODING_OPTIONS.map(item => item.value), [
        "UTF-8", "GBK", "GB18030", "Big5", "Shift_JIS",
        "ISO-8859-1", "Windows-1252", "UTF-16LE",
    ])
    assert.equal(encodeUrlText("你好"), "%E4%BD%A0%E5%A5%BD")
    assert.equal(decodeUrlText("%E4%BD%A0%E5%A5%BD"), "你好")
})

test("UTF-8 中文、Emoji 与 URL 分隔符保留原有编解码规则", () => {
    const original = "你好，RayM 🌤️"
    assert.equal(decodeUrlText(encodeUrlText(original)), original)
    assert.equal(encodeUrlText("a b&c=1/2?"), "a%20b%26c%3D1%2F2%3F")
})

test("GBK 经典中文字符测试向量", () => {
    assert.equal(encodeUrlText("你好", "GBK"), "%C4%E3%BA%C3")
    assert.equal(decodeUrlText("%C4%E3%BA%C3", { encoding:"GBK" }), "你好")
})

test("GB18030 可编码 GBK 字符和四字节 Emoji", () => {
    const source = "你好🧪"
    const encoded = encodeUrlText(source, "GB18030")
    assert.equal(encoded, "%C4%E3%BA%C3%95%30%E2%38")
    assert.equal(decodeUrlText(encoded, { encoding:"GB18030" }), source)
})

test("Big5 支持包含低 ASCII 字节的繁体中文字符", () => {
    assert.equal(encodeUrlText("中文", "Big5"), "%A4%A4%A4%E5")
    const encoded = encodeUrlText("繁體中文", "Big5")
    assert.match(encoded, /%C1%63/)
    assert.equal(decodeUrlText(encoded, { encoding:"Big5" }), "繁體中文")
})

test("Shift_JIS 的日文、半角假名可往返", () => {
    assert.equal(encodeUrlText("日本語", "Shift_JIS"), "%93%FA%96%7B%8C%EA")
    const sample = "日本語 ｶﾀｶﾅ"
    assert.equal(decodeUrlText(encodeUrlText(sample, "Shift_JIS"), { encoding:"Shift_JIS" }), sample)
})

test("ISO-8859-1 和 Windows-1252 按各自字节标准工作", () => {
    assert.equal(encodeUrlText("café", "ISO-8859-1"), "caf%E9")
    assert.equal(decodeUrlText("caf%E9", { encoding:"ISO-8859-1" }), "café")
    assert.equal(encodeUrlText("€", "Windows-1252"), "%80")
    assert.equal(decodeUrlText("%80", { encoding:"Windows-1252" }), "€")
    assert.equal(decodeUrlText("%80", { encoding:"ISO-8859-1" }).charCodeAt(0), 0x80)
})

test("UTF-16LE 编码两个字节的 ASCII 以及非 BMP 字符", () => {
    assert.equal(encodeUrlText("A", "UTF-16LE"), "%41%00")
    assert.equal(decodeUrlText("%41%00", { encoding:"UTF-16LE" }), "A")
    const source = "你好🧪"
    assert.equal(decodeUrlText(encodeUrlText(source, "UTF-16LE"), { encoding:"UTF-16LE" }), source)
})

test("普通解码保留加号，特殊模式仅替换解码后的普通空格", () => {
    assert.equal(decodeUrlText("a+b%20c%2Bd"), "a+b c+d")
    assert.equal(decodeUrlText("a+b%20c%2Bd", { spaceToPlus:true }), "a+b+c+d")
    assert.equal(decodeUrlText("%C4%E3%20RayM", { encoding:"GBK", spaceToPlus:true }), "你+RayM")
})

test("空输入与换行能够往返，普通 ASCII 不被多余编码", () => {
    for (const encoding of URL_ENCODING_OPTIONS.map(item => item.value)) {
        assert.equal(encodeUrlText("", encoding), "")
        assert.equal(decodeUrlText("", { encoding }), "")
    }
    assert.equal(encodeUrlText("hello", "GBK"), "hello")
    assert.equal(decodeUrlText(encodeUrlText("第一行\n第二行")), "第一行\n第二行")
})

test("编码不支持的字符时抛错而非静默替换为问号", () => {
    assert.throws(() => encodeUrlText("🧪", "GBK"), URIError)
    assert.throws(() => encodeUrlText("你好", "ISO-8859-1"), URIError)
    assert.throws(() => encodeUrlText("🧪", "Shift_JIS"), URIError)
})

test("非法百分号、不完整字节和不完整代理字符返回明确错误", () => {
    assert.throws(() => decodeUrlText("%ZZ"), URIError)
    assert.throws(() => decodeUrlText("%E4%BD"), URIError)
    assert.throws(() => decodeUrlText("%C4", { encoding:"GBK" }), URIError)
    assert.throws(() => decodeUrlText("%2", { encoding:"Big5" }), URIError)
    assert.throws(() => decodeUrlText("%41", { encoding:"UTF-16LE" }), URIError)
    assert.throws(() => encodeUrlText("\uD800"), URIError)
    assert.throws(() => encodeUrlText("\uD800", "GBK"), URIError)
    assert.throws(() => encodeUrlText("hi", "UNKNOWN"), RangeError)
})
