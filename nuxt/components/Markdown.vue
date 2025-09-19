<template>
    <div v-if="!isLoading">
        <div v-html="textHtml"></div>
    </div>
</template>
  
<script setup lang="ts">
import MarkdownIt from "markdown-it";
import MarkdownItMark from "markdown-it-mark";
import MarkdownItIns from "markdown-it-ins";
import MarkdownItDeflist from "markdown-it-deflist";
import MarkdownItContainer from "markdown-it-container";
import MarkdownItAbbr from "markdown-it-abbr";
import MarkdownItAnchor from "markdown-it-anchor";
import MarkdownItFootnote from "markdown-it-footnote";
import MarkdownItHighlightjs from "markdown-it-highlightjs";
import MarkdownItSub from "markdown-it-sub";
import MarkdownItSup from "markdown-it-sup";
import MarkdownItTasklists from "markdown-it-task-lists";
import MarkdownItTOC from "markdown-it-toc-done-right";
  
const markdown = new MarkdownIt()
    .use(MarkdownItMark)
    .use(MarkdownItIns)
    .use(MarkdownItDeflist)
    .use(MarkdownItAbbr)
    .use(MarkdownItContainer)
    .use(MarkdownItAnchor)
    .use(MarkdownItFootnote)
    .use(MarkdownItHighlightjs)
    .use(MarkdownItSub)
    .use(MarkdownItSup)
    .use(MarkdownItTasklists)
    .use(MarkdownItTOC);
  
const props = defineProps({
    source: {
        type: String,
        default: ""
    }
});

const textHtml: Ref<string> = ref('hola')
const isLoading: Ref<Boolean> = ref(true)

const fixHtml = (elText: string) => {
    let newText = elText
    newText = newText.replaceAll('&lt;', '<')
    newText = newText.replaceAll('&gt;', '>')
    newText = newText.replaceAll('&quot;', '"')
    newText = newText.replaceAll('<span class="hljs-operator">', '')
    newText = newText.replaceAll('<span class="hljs-string">', '')
    newText = newText.replaceAll('</span>', '')
    return newText
}

const loadContent = () => {
    isLoading.value = true
    const textWithHTML = fixHtml(markdown.render(props.source))
    textHtml.value = textWithHTML
    isLoading.value = false
}

onMounted(() => {
    setTimeout(() => {
        loadContent()
    }, 500)
})
</script>
