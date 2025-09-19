<template>
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div :id="toastId" :class="`toast align-items-center border-0 ${toastColor}`" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">
          <slot></slot>
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps(['toastId', 'type'])
const toastColor = computed(() => {
  const types = {
    positive: 'text-bg-success',
    info: 'text-bg-primary',
    negative: 'text-bg-danger'
  }
  return types[props.type]
})
</script>
