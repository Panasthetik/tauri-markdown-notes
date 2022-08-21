<script setup>
import { onMounted, reactive, ref } from 'vue';
import ListItemVue from '../components/ListItem.vue';
import EmptyForList from "../components/EmptyForList.vue";
import { setData, getData, StoreKey } from "../store/store";
import DialogVue from "../components/Dialog.vue";
import { dialog } from '@tauri-apps/api';
import { createFileApi, readFolderApi, listenDoForFileApi } from "../api/file";

let emit = defineEmits([
  'itemclick'
]);


const state = reactive({
  list: []
});
const listDom = ref(null);
const showCreateDialog = ref(false);
const checkedItem = ref(null);


const showContent = (target) => {
  checkedItem.value = target;
  emit('itemclick', target.filePath);
}


const handleListClick = (evt) => {
  if(!evt || evt.target === listDom.value) {
    showCreateDialog.value = true
  }
}


const updateForce = async (data) => {
  state.list = data || [];
  checkedItem.value = null;
  await setData({key: StoreKey, val: [...state.list]});
}


const updateList = async (res) => {
  let store = await getData(StoreKey);
  let currentData = null;
  if(Array.isArray(res)) {
    currentData = res;
  } else {
    currentData = [ res.data ];
  }

  showContent(res.data);
  state.list = [ ...currentData, ...state.list];
  if(Array.isArray(store)) {
    await setData({key: StoreKey, val: [...currentData, ...store]});
  } else {
    await setData({key: StoreKey, val: [...currentData]});  
  }
}

const handleCreate = async ({filename, folderpath}) => {
    try {

        let res = await createFileApi(filename, folderpath);

        let data = {
            title: filename,
            createTime: +new Date(),
            filePath: res
        }

        updateList({
            fileType: 0,
            data
        })
        cancelCreate();
    } catch(err) {

    }
}

const cancelCreate = () => {
    showCreateDialog.value = false;
}

const emptyWorkspace = async () => {
  await setData({key: StoreKey, val: []});
  state.list = [];

    emit('itemclick', '');
}


const showFolderDialog = async () => {
    let dirPath = await dialog.open({
      title: "请选择文件夹",
      defaultPath: "..",
      directory: true
    });
    console.log("=======open-folder=====", dirPath)
    
    let res = await readFolderApi(dirPath);

    await emptyWorkspace();
    await updateList(res);
    // 更新列表项
    console.log(res, "======file checked=====");
}


const ListenResEventMap = {
  open: showFolderDialog,
  create: handleListClick,
  empty: emptyWorkspace
}

const updateCheckItemInfo = (info) => {
  let {count, modifiedTime} = info;
  checkedItem.value.count = count;
  checkedItem.value.createTime = modifiedTime;
}


defineExpose({updateForce, updateCheckItemInfo})


onMounted(async() => {
  try {
    let store = await getData(StoreKey);
    if(store) state.list = store;
    listenDoForFileApi(ListenResEventMap);
  } catch(e) {
    console.log(e, "======list vue mounted");
  }
})
</script>

<template>
  <div id="list-container" ref="listDom" @dblclick="handleListClick">
    <ListItemVue
      v-for="item in state.list"
      :class="checkedItem && item.filePath === checkedItem.filePath ? 'checked' : ''"
      :key="item"
      :title="item.title"
      :create-time="item.createTime"
      :count="item.count"
      :desc="item.desc"
      @click="showContent(item)"
    ></ListItemVue>
    <EmptyForList
      v-if="!state.list.length"
      @showlist="updateList"
      @create-file="handleListClick"
      @open-folder="showFolderDialog"
    />
    <DialogVue v-if="showCreateDialog" :confirm="handleCreate" :cancel="cancelCreate"/>
  </div>
</template>

<style scoped>
#list-container {
  height: 100%;
  overflow-y: auto;
}

.checked {
  color: lightcoral;
  border-color: lightcoral;
}
</style>