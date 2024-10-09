import { WebSocketServer } from "ws"

// 创建 WebSocket 服务器并监听端口 8080
const wss = new WebSocketServer({ port: 2334 })

wss.on("connection", ws => {
    console.log("客户端已连接",ws)

    // 监听客户端发送的消息
    ws.on("message", message => {
        console.log("收到的消息:", message)

        // 向所有客户端广播消息
        wss.clients.forEach(client => {
            if (client.readyState === WebSocketServer.OPEN) {
                client.send(`服务端转发的消息: ${message}`)
            }
        })
    })

    // 当客户端断开连接
    ws.on("close", () => {
        console.log("客户端已断开")
    })

    // 向客户端发送初始消息
    ws.send("欢迎连接到 WebSocket 服务器！")
})
