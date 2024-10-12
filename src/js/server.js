import { WebSocketServer, WebSocket } from "ws"

let count = 0
// 创建 WebSocket 服务器并监听端口 8080
const wss = new WebSocketServer({ port: 2334 })

wss.on("connection", ws => {
    console.log("客户端已连接",ws)
    count ++
    // 监听客户端发送的消息
    ws.on("message", message => {
        console.log("收到的消息:", message)
        broadcastMsg(`服务端转发的消息: ${message}`)
    })

    // 当客户端断开连接
    ws.on("close", () => {
        console.log("客户端已断开")
        count--

        broadcastMsg(`有人离开了！ 当前服务器${count}人`)
    })

    // 向客户端发送初始消息
    broadcastMsg(`欢迎！ 当前服务器${count}人`)
})

function broadcastMsg(msg) {
    // 向所有客户端广播消息
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(msg)
        }
    })
}