<template>
  <a-card title="AES-GCM" class="content">
    <a-form ref="form" layout="vertical" :rules="rules" :model="data">
      <a-form-item name="key" label="秘钥">
        <a-input v-model:value="data.key" placeholder="请输入秘钥" />
      </a-form-item>
      <a-form-item>
        <a-radio-group v-model:value="data.type" button-style="solid" @change="typeChanged">
          <a-radio-button value="decrypt">解密</a-radio-button>
          <a-radio-button value="encrypt">加密</a-radio-button>
        </a-radio-group>
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
    </a-form>
  </a-card>
</template>
<script setup>
import { getCurrentInstance, onMounted, reactive, ref, watch } from "vue";
import { CopyOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import forge from "node-forge";
const { proxy, emit } = getCurrentInstance();
const data = reactive({
  key: "1qaz2wsx3edc4rfv",
  input: "",
  output: "",
  type: "decrypt"
});
watch(() => data.input, (val) => {
  if (data.type === 'encrypt') {
    data.output = Encrypt(val)
  }else if (data.type === 'decrypt') {
    data.output = Decrypt(val)
  }
}, {deep: true})
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

function typeChanged(e) {
  console.log(e)
  data.input = ''
}

/**
 * AES加密 ：字符串 key iv  返回base64
 */
function Encrypt(word) {
  if (!word) return
  // GCM
  const iv = forge.random.getBytesSync(12); // 生成随机iv 12字节
  const cipher = forge.cipher.createCipher("AES-GCM", data.key); // 生成AES-GCM模式的cipher对象 并传入密钥
  cipher.start({ iv: iv });
  cipher.update(forge.util.createBuffer(forge.util.encodeUtf8(word)));
  cipher.finish();
  const encrypted = cipher.output;
  const tag = cipher.mode.tag;

  const ivBytes = forge.util.createBuffer(iv).toHex();
  const encryptedBytes = forge.util.createBuffer(encrypted.data).toHex();
  const tagBytes = forge.util.createBuffer(tag.data).toHex();

  // 合并为一个Uint8Array
  const totalHex = ivBytes + encryptedBytes + tagBytes;
  const totalBytes = new Uint8Array(
    totalHex.match(/.{2}/g).map((byte) => parseInt(byte, 16))
  );

  // base64编码
  return btoa(String.fromCharCode.apply(null, totalBytes)).replace(
    /[\r\n]/g,
    ""
  );
}

/**
 * AES 解密 ：字符串 key iv  返回base64
 */
/**
 * AES 解密
 * @param {string} word - 需要解密的Base64字符串
 * @returns {string|null} 解密后的明文字符串或错误提示
 */
function Decrypt(word) {
  // GCM
  if (!word) return null;
  try {
    // 移除换行符和回车符
    let datamsg = atob(word.replace(/[\r\n]/g, "").replace(/\s/g, "+"));
    const buffer = forge.util.createBuffer(datamsg, "raw");
    const iv = buffer.getBytes(12);
    const ciphertextAndTagLength = buffer.length();
    const ciphertextLength = ciphertextAndTagLength - 16;
    const ciphertext = buffer.getBytes(ciphertextLength);
    const tag = buffer.getBytes(16);
    const decipher = forge.cipher.createDecipher("AES-GCM", data.key);
    decipher.start({ iv: iv, tag: tag });
    decipher.update(forge.util.createBuffer(ciphertext));
    const pass = decipher.finish();
    if (pass) {
      return forge.util.decodeUtf8(decipher.output.getBytes());
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
