<script setup>
import { ref, reactive, onMounted } from 'vue';
import SearchResItemVue from '../components/SearchResItem.vue';
import LoadingVue from '../components/Loading.vue';
import { getSearchRes } from "../utils";
import { getData } from "../store/store";
import { debounce } from '../utils';

const emit = defineEmits(['itemClick']);
const searchVal = ref("");

const loadingStatus = ref(false);

const showSearchRes = ref(false);
const searchRes = reactive({
    list: []
});

const handleSearchValChange = debounce(async () => {
    searchRes.list = [];
    if(!searchVal.value) return;
    showSearchRes.value = true;
    loadingStatus.value = true;
    console.log(searchVal.value, "======searchVal change");

    let allFiles = await getData("list");
    let res = await getSearchRes(searchVal.value, allFiles);
    console.log(res, "======search res");
    loadingStatus.value = false;
    searchRes.list = res;
}, 500)



const handleSearchItemClick = (item) => {
    console.log("=======search item click", item);
    emit('itemclick', item.originPath);
}
</script>

<template>
  <div class="search-container">
    <input
      autofocus
      placeholder="Enter a keyword query"
      v-model="searchVal"
      @input="handleSearchValChange"
    />
    <div class="search-contents" v-if="showSearchRes && searchVal.length">
        <div v-if="!loadingStatus" class="contents">
            <SearchResItemVue
                v-for="(item, index) in searchRes.list"
                :key="index"
                :desc="item.desc"
                :origin="item.origin"
                :origin-desc="item.originDesc"
                @click="handleSearchItemClick(item)"
            />
            <p class="no-res" v-if="!searchRes.list.length">No search results yet</p>
        </div>
        <LoadingVue v-else text="Loading..." />
    </div>

  </div>
</template>

<style scoped>
.search-container {
    display: flex;
    flex-direction: column;
}

input {
    margin: 20px 10px;
    height: 20px;
}

.search-contents,
.contents {
    display: flex;
    flex-direction: column;
    border-top: 1px solid #e1e4e8;
}

.contents {
    border: 0;
}

.no-res {
    text-align: center;
    font-size: 12px;
}
</style>