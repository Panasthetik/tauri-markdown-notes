<script setup>
const emit = defineEmits([
    'showlist',
    'createFile',
    'openFolder'
])

const openFolderDialog = async () => {
    emit('openFolder');
}


// 创建文件
const createDoc = () => {
    emit('createFile');
}

</script>

<template>
    <div class="empty-container">
        <span>There are currently no files, you can choose</span>
        <span class="open-folder" @click="openFolderDialog">Import from folder</span>
        <span class="create" @click="createDoc">create a new file</span>
    </div>
    <!-- <DialogVue v-if="showCreateDialog" :confirm="handleCreate" :cancel="cancelCreate"/> -->
</template>

<style>
.empty-container {
    font-size: 14px;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 50%;
    translate: 10% -50%;
}

.open-folder,
.create {
    color: lightblue;
    cursor: pointer;
}
</style>