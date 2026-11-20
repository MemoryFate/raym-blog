import test from "node:test"
import assert from "node:assert/strict"
import { preprocessAesUrlText } from "../src/utils/aesUrlPreprocess.js"

test("URL 解码还原百分号编码并自动修复 Base64 空格", () => {
    assert.equal(preprocessAesUrlText("abc%2Bdef%2Fghi%3D", "decode"), "abc+def/ghi=")
    assert.equal(preprocessAesUrlText("a+b", "decode"), "a+b")
    assert.equal(preprocessAesUrlText("a b%20c%2Bd", "decode"), "a+b+c+d")
})

test("空格自动修复不替换其他空白，也不额外解码一层", () => {
    assert.equal(
        preprocessAesUrlText("a%09b%0Ac\u00a0d %2520", "decode"),
        "a\tb\nc\u00a0d+%20",
    )
})

test("URL 编码正确转换 Base64 中的特殊字符", () => {
    assert.equal(preprocessAesUrlText("a+b/c=", "encode"), "a%2Bb%2Fc%3D")
})

test("复用独立 URL 工具的字符集处理规则", () => {
    assert.equal(preprocessAesUrlText("%C4%E3%BA%C3", "decode", "GBK"), "你好")
    assert.equal(preprocessAesUrlText("%C4%E3%BA%C3%20%2B", "decode", "GBK"), "你好++")
})

test("对非法百分号、未知操作抛出明确错误，不返回损坏密文", () => {
    assert.throws(() => preprocessAesUrlText("%ZZ", "decode"), URIError)
    assert.throws(() => preprocessAesUrlText("abc", "unknown"), RangeError)
})
