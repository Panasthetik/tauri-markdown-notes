<script setup>
import { onMounted, ref, watch, watchEffect } from "vue";
import { Editor } from '@bytemd/vue-next';
import math from "@bytemd/plugin-math";
import highlight from "@bytemd/plugin-highlight";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import gemoji from "@bytemd/plugin-gemoji";
import gfm from "@bytemd/plugin-gfm";
import pdf from "./index";
import { debounce } from "../utils";
import { getContentApi, saveContentApi } from "../api/file"
import { message } from '@tauri-apps/api/dialog';
import { removeItem, StoreKey } from "../store/store";

import 'bytemd/dist/index.css';
import 'highlight.js/styles/vs.css';
import 'github-markdown-css';

let emits = defineEmits(['fileNotFound', 'valueChange']);
let props = defineProps(['currentPath']);
const plugins = [math(), highlight(), gfm(), gemoji(), mediumZoom(), pdf()];
const text = ref("");

const sanitize = (schema) => {
  schema.protocols.src.push('data');
  return schema
}


const handleSave = debounce(async (content) => {
  try {
    await saveContentApi(props.currentPath, content);
    let count = content && content.length || 0;
    let modifiedTime = +new Date();
    emits('valueChange', {count, modifiedTime});
  } catch (e) {
    console.log(e, "=====save error=====");
  }
}, 500)

const handleChange = (val) => {
  text.value = val;
  console.log("change", val);
  handleSave(val);
}

const getContent = async (path) => {  
  let content = await getContentApi(path)
  if(content === null) {

    await message('File not found', { title: 'Simple-notebook', type: 'error' });
    let res = await removeItem(StoreKey, path);
    emits('fileNotFound', res);
    console.log(res, "=====");
    return;
  }
  text.value = content;
  console.log(content, "=========content=======", path);
}

const uploadImg = (files) => {
  return Promise.all(
        files.map((file) => {
          return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = function(e) {
              let newUrl = this.result;
              console.log(newUrl, "=====utl=====")
              resolve({title: "test"});
            }
          })
          // var url = window.URL.createObjectURL(file);
          // // TODO:
          // return {
          //   url
          // }
        })
      )
}

onMounted(async () => {
  console.log("======editor", props.currentPath);
  try {
    await getContent(props.currentPath);
  } catch (e) {
    console.log("get content error=======", e);
  }
})

watch(() => props.currentPath, async (newContent, oldContent) => {
  console.log(newContent, "========", oldContent);
  text.value = "";
  await getContent(props.currentPath);
})
</script>

<template>
  <Editor
    :plugins="plugins"
    :uploadImages="uploadImg"
    :sanitize="sanitize"
    class="editor"
    :value="text"
    @change="handleChange"
  />
</template>

<style>
.editor .bytemd {
  height: 100vh;
  text-align: left;
  border: 0;
}
</style>