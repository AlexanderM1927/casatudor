import Localbase from 'localbase'
export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.provide('db', new Localbase('db'))
})