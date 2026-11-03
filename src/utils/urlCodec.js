/**
 * URL 百分号编解码（UTF-8）。
 * 使用 encodeURIComponent 编码单个 URL 组件；不用于直接编码整条链接。
 */
export function encodeUrlText(text) {
    return encodeURIComponent(text)
}

/**
 * 解码 URL 百分号编码。
 * spaceToPlus 为截图所示的“解码后空格替换 +”模式：
 * 仅将解码结果里的 ASCII 空格改为 +，不会把原有 + 变成空格。
 */
export function decodeUrlText(text, { spaceToPlus = false } = {}) {
    const decoded = decodeURIComponent(text)
    return spaceToPlus ? decoded.replace(/ /g, "+") : decoded
}
