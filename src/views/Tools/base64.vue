<template>
  <a-breadcrumb style="margin: 14px auto;" separator=">">
    <a-breadcrumb-item><a href="./#/">首页</a></a-breadcrumb-item>
    <a-breadcrumb-item><a href="./#/Tools">工具</a></a-breadcrumb-item>
    <a-breadcrumb-item>Base64</a-breadcrumb-item>
  </a-breadcrumb>
  <a-card title="Base64 与 图片/视频 互转" class="content">
    <a-tabs v-model:activeKey="data.activeTab">
      <!-- Base64 转图片/视频 -->
      <a-tab-pane key="decode" tab="Base64 转 图片/视频">
        <a-form layout="vertical">
          <a-form-item label="类型">
            <a-radio-group v-model:value="data.decodeType">
              <a-radio-button value="image">图片</a-radio-button>
              <a-radio-button value="video">视频</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="Base64 文本">
            <a-textarea
              v-model:value="data.base64Input"
              placeholder="请粘贴 Base64 文本"
              :rows="6"
            />
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button type="primary" @click="decodeBase64">转换</a-button>
              <a-button @click="clearDecode">清空</a-button>
            </a-space>
          </a-form-item>
          <a-form-item label="预览">
            <div class="preview-box">
              <img v-if="data.decodeType === 'image' && data.previewUrl" :src="data.previewUrl" alt="预览" />
              <video
                v-if="data.decodeType === 'video' && data.previewUrl"
                :src="data.previewUrl"
                controls
                class="video-preview"
              ></video>
              <div v-if="!data.previewUrl" class="placeholder">预览区域</div>
            </div>
          </a-form-item>
          <a-form-item v-if="data.previewUrl">
            <a-button type="primary" @click="downloadFile">下载文件</a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>

      <!-- 图片/视频 转 Base64 -->
      <a-tab-pane key="encode" tab="图片/视频 转 Base64">
        <a-form layout="vertical">
          <a-form-item label="类型">
            <a-radio-group v-model:value="data.encodeType">
              <a-radio-button value="image">图片</a-radio-button>
              <a-radio-button value="video">视频</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="选择文件">
            <a-upload
              :before-upload="handleFileUpload"
              :show-upload-list="false"
              accept=".jpg,.jpeg,.png,.gif,.webp,.mp4,.webm,.ogg"
            >
              <a-button>
                <UploadOutlined /> 选择 {{ data.encodeType === 'image' ? '图片' : '视频' }}
              </a-button>
            </a-upload>
          </a-form-item>
          <a-form-item v-if="data.fileName" :label="'已选文件: ' + data.fileName">
            <div class="file-info">
              <span>大小: {{ formatFileSize(data.fileSize) }}</span>
            </div>
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button type="primary" :loading="data.encoding" @click="encodeFile">
                转换为 Base64
              </a-button>
              <a-button @click="clearEncode">清空</a-button>
            </a-space>
          </a-form-item>
          <a-form-item label="Base64 结果">
            <a-textarea
              v-model:value="data.base64Output"
              placeholder="转换结果将显示在这里"
              :rows="8"
              readonly
            />
          </a-form-item>
          <a-form-item v-if="data.base64Output">
            <a-space>
              <a-button type="primary" @click="copyBase64">
                <CopyOutlined /> 复制 Base64
              </a-button>
              <a-button @click="downloadBase64Txt">
                下载 TXT 文件
              </a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script setup>
import { reactive, ref } from "vue"
import { message } from "ant-design-vue"
import { CopyOutlined, UploadOutlined } from "@ant-design/icons-vue"

const data = reactive({
  activeTab: "decode",
  decodeType: "image",
  encodeType: "image",
  base64Input: "",
  previewUrl: "",
  fileName: "",
  fileSize: 0,
  fileData: null,
  base64Output: "",
  encoding: false,
})

// 格式化文件大小
function formatFileSize(bytes) {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// Base64 解码
function decodeBase64() {
  if (!data.base64Input.trim()) {
    message.warning("请输入 Base64 文本")
    return
  }
  try {
    // 清理 Base64 文本（移除可能的头部）
    let base64 = data.base64Input.trim()
    const mimeMatch = base64.match(/^data:([^;]+);base64,/)
    if (mimeMatch) {
      base64 = base64.replace(/^data:([^;]+);base64,/, "")
    }

    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    const mimeType = mimeMatch
      ? mimeMatch[1]
      : data.decodeType === "image"
      ? "image/png"
      : "video/mp4"

    const blob = new Blob([bytes], { type: mimeType })
    data.previewUrl = URL.createObjectURL(blob)
    message.success("转换成功")
  } catch (e) {
    message.error("Base64 解析失败，请检查输入是否正确")
    console.error(e)
  }
}

// 清空解码
function clearDecode() {
  data.base64Input = ""
  if (data.previewUrl) {
    URL.revokeObjectURL(data.previewUrl)
  }
  data.previewUrl = ""
}

// 下载文件
function downloadFile() {
  if (!data.previewUrl) return
  const link = document.createElement("a")
  link.href = data.previewUrl
  const ext = data.decodeType === "image" ? "png" : "mp4"
  link.download = `converted.${ext}`
  link.click()
}

// 文件上传
function handleFileUpload(file) {
  const isImage = file.type.startsWith("image/")
  const isVideo = file.type.startsWith("video/")

  if (!isImage && !isVideo) {
    message.error("只能上传图片或视频文件")
    return false
  }

  if (data.encodeType === "image" && !isImage) {
    message.error("请选择图片文件")
    return false
  }

  if (data.encodeType === "video" && !isVideo) {
    message.error("请选择视频文件")
    return false
  }

  data.fileName = file.name
  data.fileSize = file.size
  data.fileData = file
  data.base64Output = ""

  return false // 阻止自动上传
}

// 文件转 Base64
function encodeFile() {
  if (!data.fileData) {
    message.warning("请先选择文件")
    return
  }

  data.encoding = true
  const reader = new FileReader()

  reader.onload = function (e) {
    data.base64Output = e.target.result
    data.encoding = false
    message.success("转换成功")
  }

  reader.onerror = function () {
    message.error("文件读取失败")
    data.encoding = false
  }

  reader.readAsDataURL(data.fileData)
}

// 清空编码
function clearEncode() {
  data.fileName = ""
  data.fileSize = 0
  data.fileData = null
  data.base64Output = ""
}

// 复制 Base64
function copyBase64() {
  navigator.clipboard
    .writeText(data.base64Output)
    .then(() => {
      message.success("复制成功")
    })
    .catch(() => {
      message.error("复制失败")
    })
}

// 下载 Base64 为 TXT
function downloadBase64Txt() {
  if (!data.base64Output) return
  const blob = new Blob([data.base64Output], { type: "text/plain" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = `${data.fileName || "base64"}.txt`
  link.click()
}
</script>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
}

.preview-box {
  width: 100%;
  min-height: 200px;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  overflow: hidden;

  img {
    max-width: 100%;
    max-height: 400px;
  }

  .video-preview {
    max-width: 100%;
    max-height: 400px;
  }

  .placeholder {
    color: #999;
  }
}

.file-info {
  color: #666;
  font-size: 14px;
}
</style>
