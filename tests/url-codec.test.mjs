import test from "node:test"
import assert from "node:assert/strict"
import { encodeUrlText, decodeUrlText } from "../src/utils/urlCodec.js"

test("UTF-8 中文和 Emoji 能正确往返", () => {
    const original = "你好，RayM 🌤️"
    assert.equal(decodeUrlText(encodeUrlText(original)), original)
})

test("编码 URL 组件时会转义保留分隔符", () => {
    assert.equal(encodeUrlText("a b&c=1/2?"), "a%20b%26c%3D1%2F2%3F")
})

test("普通解码保留加号并还原百分号空格", () => {
    assert.equal(decodeUrlText("a+b%20c%2Bd"), "a+b c+d")
})

test("解码后空格替换 + 模式不改变原有加号", () => {
    assert.equal(decodeUrlText("a+b%20c%2Bd", { spaceToPlus:true }), "a+b+c+d")
    assert.equal(decodeUrlText("%E4%BD%A0%E5%A5%BD%20RayM", { spaceToPlus:true }), "你好+RayM")
})

test("空文本和换行可正常处理", () => {
    assert.equal(encodeUrlText(""), "")
    assert.equal(decodeUrlText(""), "")
    assert.equal(decodeUrlText(encodeUrlText("第一行\n第二行")), "第一行\n第二行")
})

test("非法百分号和无效 UTF-8 应抛出 URIError", () => {
    assert.throws(() => decodeUrlText("%ZZ"), URIError)
    assert.throws(() => decodeUrlText("%E4%BD"), URIError)
    assert.throws(() => encodeUrlText("\uD800"), URIError)
})
