import test from "node:test"
import assert from "node:assert/strict"
import { preprocessAesUrlText, isDecryptReadyOperation } from "../src/utils/aesUrlPreprocess.js"

test("URL 解码保留 Base64 原有加号并还原百分号编码", () => {
    assert.equal(preprocessAesUrlText("abc%2Bdef%2Fghi%3D", "decode"), "abc+def/ghi=")
    assert.equal(preprocessAesUrlText("a+b", "decode"), "a+b")
})

test("空格修复仅替换 ASCII 空格，不影响加号及其他空白", () => {
    assert.equal(preprocessAesUrlText("a b+c\td", "space-to-plus"), "a+b+c\td")
})

test("解码与空格修复可一并执行", () => {
    assert.equal(preprocessAesUrlText("a%2Bb%20c", "decode-space-to-plus"), "a+b+c")
})

test("URL 编码可独立预览，但不能作为直接解密密文", () => {
    assert.equal(preprocessAesUrlText("a+b/c=", "encode"), "a%2Bb%2Fc%3D")
    assert.equal(isDecryptReadyOperation("encode"), false)
    assert.equal(isDecryptReadyOperation("decode"), true)
    assert.equal(isDecryptReadyOperation("space-to-plus"), true)
    assert.equal(isDecryptReadyOperation("decode-space-to-plus"), true)
})

test("复用独立 URL 工具的字符集处理规则", () => {
    assert.equal(preprocessAesUrlText("%C4%E3%BA%C3", "decode", "GBK"), "你好")
})

test("对非法百分号、未知操作抛出明确错误，不返回损坏密文", () => {
    assert.throws(() => preprocessAesUrlText("%ZZ", "decode"), URIError)
    assert.throws(() => preprocessAesUrlText("abc", "unknown"), RangeError)
})
