import { createApp } from "vue"
import App from "./App.vue"
import router from "./js/router.js"
import { installChunkRecovery } from "./js/chunkRecovery.js"
import Antd from "ant-design-vue"
import "ant-design-vue/dist/reset.css"
import "@/assets/styles/theme.scss"
import "@/assets/styles/control-system.scss"

installChunkRecovery(router)

const app = createApp(App)
app.use(router)
app.use(Antd)
app.mount("#app")
