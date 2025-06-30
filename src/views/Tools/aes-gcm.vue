<template>
  <a-card title="AES-GCM" class="content">
    <a-form ref="form" layout="vertical" :rules="rules" :model="data">
      <a-form-item name="key" label="秘钥">
        <a-input v-model:value="data.key" placeholder="请输入秘钥" />
      </a-form-item>
      <a-form-item name="input" label="输入">
        <a-textarea
          v-model:value="data.input"
          placeholder="请输入要转码的文本"
          :rows="4"
        />
      </a-form-item>
      <a-form-item name="output" label="输出">
        <a-textarea
          v-model:value="data.output"
          placeholder="输出"
          :rows="4"
          disabled
        />
        <a-button
          type="text"
          shape="circle"
          @click="copyToClipBoard(data.output)"
        >
          <CopyOutlined />
        </a-button>
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          style="float: right"
          @click="data.output = Decrypt(data.input)"
          >解密</a-button
        >
        <a-button
          type="primary"
          ghost
          style="float: right; margin-right: 20px"
          @click="data.output = Encrypt(data.input)"
          >加密</a-button
        >
      </a-form-item>
    </a-form>
  </a-card>
</template>
<script setup>
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { CopyOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import forge from "node-forge";
const { proxy, emit } = getCurrentInstance();
const data = reactive({
  key: "1qaz2wsx3edc4rfv",
  input: "",
  output: "",
});

const rules = {
  key: [
    {
      required: true,
      message: "请输入秘钥",
      trigger: "submit",
    },
  ],
  input: [
    {
      required: true,
      trigger: "submit",
    },
  ],
  output: [
    {
      required: false,
    },
  ],
};

/**
 * AES加密 ：字符串 key iv  返回base64
 */
function Encrypt(word) {
  // GCM
  const iv = forge.random.getBytesSync(12); // 生成随机iv 12字节
  const cipher = forge.cipher.createCipher("AES-GCM", data.key); // 生成AES-GCM模式的cipher对象 并传入密钥
  cipher.start({ iv: iv });
  cipher.update(forge.util.createBuffer(forge.util.encodeUtf8(word)));
  cipher.finish();
  const encrypted = cipher.output;
  const tag = cipher.mode.tag;
  return btoa(iv + encrypted.data + tag.data).replaceAll(/[\r\n]/g, "");
}

/**
 * AES 解密 ：字符串 key iv  返回base64
 */
function Decrypt(word) {
  // GCM
  if (!word) return null;
  try {
    let datamsg = atob(word.replaceAll(/\s/g, "+"));
    const iv = datamsg.slice(0, 12);
    const tag = datamsg.slice(-16);
    const d = datamsg.slice(12, datamsg.length - 16);
    const decipher = forge.cipher.createDecipher("AES-GCM", data.key);
    decipher.start({ iv: iv, tag: tag });
    decipher.update(forge.util.createBuffer(d));
    const pass = decipher.finish();
    if (pass) {
      return decipher.output.toString();
    } else {
      return "解密失败，请检查输入内容";
    }
  } catch (error) {
    return "解密失败，请检查输入内容";
  }
}
function copyToClipBoard(e) {
  navigator.clipboard
    .writeText(e)
    .then(() => {
      message.info("复制成功");
    })
    .catch((err) => {
      message.info(err.message);
    });
}
</script>
<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
}
</style>
