<template>
  <a-card title="字符串生成" class="content">
    <a-form ref="form" layout="vertical" :rules="rules" :model="data.formData">
      <a-form-item name="strLength" label="长度">
        <a-row>
          <a-col>
            <a-radio-group v-model:value="data.formData.strLength">
              <a-radio-button value="16">16</a-radio-button>
              <a-radio-button value="32">32</a-radio-button>
              <a-radio-button value="64">64</a-radio-button>
              <a-radio-button value="128">128</a-radio-button>
            </a-radio-group>
          </a-col>
          <a-col>
            <a-form-item-rest
              ><a-input-number
                v-model:value="data.formData.strLength"
                min="1"
                max="1024"
              ></a-input-number
            ></a-form-item-rest>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item name="type" label="类型">
        <a-checkbox-group v-model:value="data.formData.type" :options="types" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" style="float: right" @click="confirm()"
          >确定</a-button
        >
        <a-button
          type="primary"
          ghost
          style="float: right; margin-right: 20px"
          @click="reset()"
          >重置</a-button
        >
      </a-form-item>
    </a-form>
    <a-form-item label="结果">
      <a-row>
        <a-col :span="10">
          <a-textarea :rows="4" :value="data.result"></a-textarea>
        </a-col>
        <a-col>
          <a-button type="text" shape="circle" @click="copyToClipBoard"
            ><CopyOutlined
          /></a-button>
        </a-col>
      </a-row>
    </a-form-item>
  </a-card>
</template>
<script setup>
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { message } from "ant-design-vue";
import { CopyOutlined } from "@ant-design/icons-vue";

const { proxy, emit } = getCurrentInstance();
const data = reactive({
  formData: {
    strLength: 16,
    type: ["number"],
  },
  result: "",
});
const types = ref([
  {
    label: "数字",
    value: "number",
  },
  {
    label: "大写字母",
    value: "uppercase",
  },
  {
    label: "小写字母",
    value: "lowercase",
  },
  {
    label: "特殊字符",
    value: "special",
  },
]);
const regulars = {
  number: "0123456789",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  special: "!@#$%^&*()",
};
const rules = {
  strLength: [
    {
      required: true,
      message: "请输入长度",
      trigger: "submit",
    },
  ],
  type: [
    {
      required: true,
      message: "请至少选择一个",
      trigger: "submit",
    },
  ],
};
function reset() {
  data.showCopy = false;
  data.formData = { level: "L", pixel: "600" };
}
function confirm() {
  proxy.$refs.form
    .validateFields()
    .then((values) => {
      let charset = "";
      for (let i = 0; i < values.type.length; i++) {
        const key = values.type[i];
        charset += regulars[key];
      }
      data.result = randomStr(values.strLength, charset);
    })
    .catch((err) => {
      console.log(err);
    });
}
function randomStr(length, charset) {
  let result = "";
  const cryptoObj = window.crypto || window.msCrypto; // for IE 11
  if (cryptoObj && cryptoObj.getRandomValues) {
    const randomValues = new Uint32Array(length);
    cryptoObj.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
      result += charset[randomValues[i] % charset.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      result += charset[Math.floor(Math.random() * charset.length)];
    }
  }
  return result;
}
function copyToClipBoard(e) {
  navigator.clipboard
    .writeText(data.result)
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
