<script setup>
import { ref } from "vue";
import { dialog } from '@tauri-apps/api';

let props = defineProps({
    confirm: Function,
    cancel: Function
})

const errMsg = ref("");
const filename = ref("");
const folderpath = ref("");

const handleValChange = () => {
    if(!filename.value.trim()) {
        errMsg.value = "Can not be empty";
        return
    }
    props.confirm({
        filename: filename.value,
        folderpath: folderpath.value
    });
    filename.value = "";
    folderpath.value = "";
}

const showFolderDialog = async () => {
    let dirPath = await dialog.open({
      title: "Please select a folder",
      defaultPath: "..",
      directory: true
    });

    folderpath.value = dirPath;
    console.log(folderpath.value, "======file checked=====");
}

const cancel = () => {
    filename.value = "";
    props.cancel();
}
</script>

<template>
    <div class="dialog">
        <div class="form">
            <label>file name:</label>
            <input autofocus v-model="filename" />
        </div>
        <div class="form">
            <label>folder:</label>
            <input autofocus readonly @click="showFolderDialog" :value="folderpath" />
        </div>
        <p class="error" v-if="errMsg">ERROR:{{errMsg}}</p>
        <div class="btns">
            <button @click="cancel">Cancel</button>
            <button @click="handleValChange">Confirm</button>
        </div>
    </div>
</template>

<style scoped>
p {
    margin: 0;
    padding: 0;
}
.dialog {
    position: fixed;
    top: 40vh;
    left: 40vw;
    padding: 40px 30px 20px;
    display: flex;
    flex-direction: column;
    background-color: lightblue;
    border-radius: 15px;
    z-index: 9999;
}

label {
    margin-right: 20px;
}

.form {
    margin-bottom: 20px;
}

.btns {
    text-align: right;
}

.btns button {
    padding: 6px 12px;
    cursor: pointer;
    color: #fff;
    background-color: #409eff;
    border: none;
    outline: none;
    border-radius: 6px;
}

button:first-child {
    background-color: #f56c6c;
}

.error {
    color: red;
    font-size: 12px;
    font-weight: bold;
}
</style>