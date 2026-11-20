import { encodeUrlText, decodeUrlText } from "./urlCodec.js"

/**
 * AES-GCM 密文预处理，不触碰密钥与加解密状态。
 *
 * URL 解码保留原有 +，并将解码后的普通空格还原为 Base64 加号。
 */
export function preprocessAesUrlText(input, operation, encoding = "UTF-8") {
    switch (operation) {
        case "encode":
            return encodeUrlText(input, encoding)
        case "decode":
            return decodeUrlText(input, { encoding, spaceToPlus:true })
        default:
            throw new RangeError("不支持的 URL 预处理操作：" + operation)
    }
}
