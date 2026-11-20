import { encodeUrlText, decodeUrlText } from "./urlCodec.js"

/**
 * AES-GCM 密文预处理，不触碰密钥与加解密状态。
 *
 * URL 解码保留原有 +，仅还原百分号编码。
 */
export function preprocessAesUrlText(input, operation, encoding = "UTF-8") {
    switch (operation) {
        case "encode":
            return encodeUrlText(input, encoding)
        case "decode":
            return decodeUrlText(input, { encoding })
        default:
            throw new RangeError("不支持的 URL 预处理操作：" + operation)
    }
}
