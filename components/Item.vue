<template>
    <div :class="`card ${childClass}`">
        <img src="/img/bgjpg.jpg" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <a class="add-cart-btn btn btn-outline-primary" @click="addToCart(idItem)">
                Add to cart
                <Icon name="material-symbols:add-shopping-cart" />
            </a>
        </div>
    </div>
    <Notification type="positive" :toast-id="idItem">
        Item added to cart
    </Notification>
</template>
<script setup>
import ToastHelper from '~/helpers/ToastHelper';
const props = defineProps(['childClass'])
const idItem = 'product-' + 123

const addToCart = ((id) => {
    ToastHelper.openToast(id)
})
</script>

<style scoped>
.add-cart-btn {
    display: flex;
    align-items: center;
    vertical-align: middle;
    justify-content: space-between;
}
</style>