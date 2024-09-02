<template>
    <div 
        class="pagination-centered"
        v-if="data.data && data.data.length > 0 && data.pageCount > 1" 
        :key="render"
    >
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li 
                    :class="`page-item ${currentPage == 1 ? 'disabled' : ''}`"
                    @click="changePage(`${currentPage == 1 ? '#' : (data.url + '' + (currentPage - 1))}`)"
                >
                    <a title="Previous" class="page-link">Previous</a>
                </li>
                <li class="page-item" v-if="currentPage > 3">
                    <a title="1" class="page-link" @click="changePage(data.url + '1')">1</a>
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
                        :title="`${n}`"
                    >
                        {{ n }}
                    </a>
                    <a class="page-link" v-else>{{ n }}</a>
                </li>
                <li v-if="currentPage < data.pageCount - 3"><span>...</span></li>
                <li class="page-item" v-if="currentPage < data.pageCount - 2">
                    <a
                        class="page-link"
                        @click="changePage(data.url + '' + data.pageCount)"
                        :title="data.pageCount"
                    >{{ data.pageCount }}</a>
                </li>
                
                <li :class="`page-item ${currentPage == data.pageCount ? 'disabled' : ''}`">
                    <a 
                        title="Next"
                        class="page-link"
                        @click="changePage(`${currentPage == data.pageCount ? '#' : (data.url + '' + (currentPage + 1))}`)"
                    >Next</a>
                </li>
            </ul>
        </nav>
    </div>
</template>
<script setup lang="ts">
const pagesToShow: Ref<number[]> = ref([])
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
    for (let i: number = 1; i <= props.data.pageCount; i++) {
        if (i >= currentPage.value - 2 && i <= currentPage.value + 2) {
            pagesToShow.value.push(i)
        }
    }
    console.log('pagesToShow.value', pagesToShow.value)
    render.value++
}
const changePage = (newPage: string) => {
    if (newPage !== '#') {
        currentPage.value = parseInt(newPage)
        emit('getAction', newPage)
        getPagesToShow()
    }
}

watch(() => props.data.pageCount, (val) => {
    getPagesToShow()
})

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