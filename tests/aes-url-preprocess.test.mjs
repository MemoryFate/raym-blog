import test from "node:test"
import assert from "node:assert/strict"
import { preprocessAesUrlText } from "../src/utils/aesUrlPreprocess.js"

test("URL 解码保留 Base64 原有加号并还原百分号编码", () => {
    assert.equal(preprocessAesUrlText("abc%2Bdef%2Fghi%3D", "decode"), "abc+def/ghi=")
    assert.equal(preprocessAesUrlText("a+b", "decode"), "a+b")
    assert.equal(preprocessAesUrlText("a b%20c%2Bd", "decode"), "a b c+d")
})

test("URL 编码正确转换 Base64 中的特殊字符", () => {
    assert.equal(preprocessAesUrlText("a+b/c=", "encode"), "a%2Bb%2Fc%3D")
})

test("复用独立 URL 工具的字符集处理规则", () => {
    assert.equal(preprocessAesUrlText("%C4%E3%BA%C3", "decode", "GBK"), "你好")
})

test("对非法百分号、未知操作抛出明确错误，不返回损坏密文", () => {
    assert.throws(() => preprocessAesUrlText("%ZZ", "decode"), URIError)
    assert.throws(() => preprocessAesUrlText("abc", "unknown"), RangeError)
})
