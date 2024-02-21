<template>
    <div 
        class="pagination-centered"
        v-if="data.data && data.data.length > 0 && data.lastPage > 1" 
        :key="render"
    >
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li 
                    :class="`page-item ${currentPage == 1 ? 'disabled' : ''}`"
                    @click="changePage(`${currentPage == 1 ? '#' : (data.url + '' + (currentPage - 1))}`)"
                >
                    <a class="page-link">Previous</a>
                </li>
                <li class="page-item" v-if="currentPage > 3">
                    <a class="page-link" @click="changePage(data.url + '1')">1</a>
                </li>
                <li v-if="currentPage > 4"><span>...</span></li>
                <li 
                    v-for="(n, index) in pagesToShow" 
                    :key="index"
                    :class="currentPage == n ? 'page-item active' : ''"
                >
                    <a 
                        class="page-link" 
                        v-if="currentPage != n"
                        @click="changePage(data.url + '' + n)"
                    >
                        {{ n }}
                    </a>
                    <a class="page-link" v-else>{{ n }}</a>
                </li>
                <li v-if="currentPage < data.lastPage - 3"><span>...</span></li>
                <li class="page-item" v-if="currentPage < data.lastPage - 2">
                    <a class="page-link" @click="changePage(data.url + '' + data.lastPage)">{{ data.lastPage }}</a>
                </li>
                
                <li :class="`page-item ${currentPage == data.lastPage ? 'disabled' : ''}`">
                    <a 
                        class="page-link"
                        @click="changePage(`${currentPage == data.lastPage ? '#' : (data.url + '' + (currentPage + 1))}`)"
                    >Next</a>
                </li>
            </ul>
        </nav>
    </div>
</template>
<script setup lang="ts">
const pagesToShow: Ref<any> = ref([])
const currentPage: Ref<number> = ref(0)
const render: Ref<number> = ref(0)
const emit = defineEmits(['getAction'])
const props = defineProps(
    {
        data: {
            type: Object,
            required: true
        }
    }
)
const getPagesToShow = () => {
    pagesToShow.value = []
    for (let i: number = 1; i <= props.data.lastPage; i++) {
        if (i >= currentPage.value - 2 && i <= currentPage.value + 2) {
            pagesToShow.value.push(i)
        }
    }
    render.value++
}
const changePage = (newPage: string) => {
    if (newPage !== '#') {
        currentPage.value = parseInt(newPage)
        emit('getAction', newPage)
        getPagesToShow()
    }
}
onMounted(() => {
    currentPage.value = props.data.currentPage
    getPagesToShow()
})
</script>
<style scoped>
.pagination-centered {
    margin-top: 1rem;
    display: flex;
    width: 100%;
    justify-content: center;
}
.page-link {
    cursor: pointer;
}
</style>