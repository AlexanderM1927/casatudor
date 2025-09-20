<template>
    <div class="first-container bg-white">
        <h2 class="title">Mis Pedidos</h2>
        
        <div v-if="isLoading" class="text-center">
            <p>Cargando pedidos...</p>
        </div>
        
        <div v-else-if="orders.length === 0" class="text-center">
            <p>No tienes pedidos aún.</p>
        </div>
        
        <div v-else class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Total Factura</th>
                        <th>Total Pagado</th>
                        <th>Estado de Pago</th>
                        <th>Empresa de envio</th>
                        <th>Guia de rastreo</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in orders" :key="order.id">
                        <td>{{ order.id }}</td>
                        <td>${{ formatPrice(order.invoice?.total || 0) }}</td>
                        <td>${{ formatPrice(order.invoice?.totalPaid || 0) }}</td>
                        <td>
                            <span :class="getStatusClass(order.invoice?.paymentStatus)">
                                {{ getStatusText(order.invoice?.paymentStatus) }}
                            </span>
                        </td>
                        <td>{{ order.shipmentAgency }}</td>
                        <td>{{ order.shipmentGuide }}</td>
                        <td>{{ formatDate(order.createdAt) }}</td>
                        <td>
                            <button 
                                class="btn btn-primary btn-sm"
                                @click="openProductModal(order)"
                                :disabled="!order.invoice?.products || order.invoice.products.length === 0"
                            >
                                Ver Productos
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Products Modal -->
        <div 
            v-if="showModal" 
            class="modal-overlay" 
            @click="closeModal"
        >
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>Productos del Pedido #{{ selectedOrder?.id }}</h3>
                    <button class="btn-close" @click="closeModal">
                        <Icon name="material-symbols:close" />
                    </button>
                </div>
                <div class="modal-body">
                    <div v-if="selectedOrder?.invoice?.products" class="products-list">
                        <div 
                            v-for="(productItem, index) in selectedOrder.invoice.products" 
                            :key="index"
                            class="product-item"
                        >
                            <div class="product-info">
                                <NuxtImg
                                    :src="productItem.images[0]"
                                    :alt="productItem.name"
                                    class="w-16 h-16 object-cover rounded-md"
                                />
                                <div>
                                    <h5>{{ productItem.name }}</h5>
                                    <p class="text-muted">
                                        Cantidad: {{ productItem.quantity }}
                                    </p>
                                    <p class="text-muted" v-if="productItem.selectedVariants?.color || productItem.selectedVariants?.size">
                                        {{ productItem.selectedVariants?.color }} 
                                        {{ productItem.selectedVariants?.size ? '/ ' + productItem.selectedVariants.size : '' }}
                                    </p>
                                    <p class="font-weight-bold">
                                        ${{ formatPrice(productItem.price * productItem.quantity) }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="total-info">
                            <strong>Total: ${{ formatPrice(selectedOrder?.invoice?.total || 0) }}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IOrder } from '~/types/Order'
import NumberHelper from '~/helpers/NumberHelper'

definePageMeta({ middleware: 'auth', requiresAuth: true })

const page: Ref<number> = ref(1)
const orders: Ref<IOrder[]> = ref([])
const isLoading: Ref<boolean> = ref(true)
const showModal: Ref<boolean> = ref(false)
const selectedOrder: Ref<IOrder | null> = ref(null)

const formatPrice = NumberHelper.miles

const getOrders = async () => {
    try {
        isLoading.value = true
        const ordersData = await useGetUserOrders(page.value)
        
        const ordersMapped: IOrder[] = mapAPIOrderToIOrders(ordersData.map((order: any) => ({
            id: order.id,
            ...order.attributes
        })))
        
        orders.value = ordersMapped
    } catch (error) {
        console.error('Error fetching orders:', error)
    } finally {
        isLoading.value = false
    }
}

const getStatusClass = (status: string | undefined) => {
    switch (status) {
        case 'approved':
            return 'badge bg-success'
        case 'pending':
            return 'badge bg-warning'
        case 'declined':
            return 'badge bg-danger'
        default:
            return 'badge bg-secondary'
    }
}

const getStatusText = (status: string | undefined) => {
    switch (status) {
        case 'approved':
            return 'Aprobado'
        case 'pending':
            return 'Pendiente'
        case 'declined':
            return 'Rechazado'
        case 'error':
            return 'Error'
        default:
            return 'Desconocido'
    }
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const openProductModal = (order: IOrder) => {
    selectedOrder.value = order
    showModal.value = true
    document.body.style.overflow = 'hidden'
}

const closeModal = () => {
    showModal.value = false
    selectedOrder.value = null
    document.body.style.overflow = 'auto'
}

onMounted(async () => {
    await getOrders()
})

onUnmounted(() => {
    document.body.style.overflow = 'auto'
})
</script>

<style lang="scss" scoped>
.table {
    margin-top: 2rem;
}

.badge {
    padding: 0.5em 0.75em;
    font-size: 0.75em;
}

.bg-success {
    background-color: #28a745 !important;
}

.bg-warning {
    background-color: #ffc107 !important;
    color: #212529;
}

.bg-danger {
    background-color: #dc3545 !important;
}

.bg-secondary {
    background-color: #6c757d !important;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 8px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #dee2e6;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.25rem;
}

.btn-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    color: #6c757d;
}

.btn-close:hover {
    color: #000;
}

.modal-body {
    padding: 1.5rem;
}

.products-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.product-item {
    padding: 1rem;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    background-color: #f8f9fa;
}

.product-info {
    display: flex;
}

.product-info h5 {
    margin: 0 0 0.5rem 0;
    color: #212529;
}

.product-info p {
    margin: 0.25rem 0;
}

.text-muted {
    color: #6c757d !important;
}

.font-weight-bold {
    font-weight: bold !important;
}

.modal-footer {
    border-top: 1px solid #dee2e6;
    padding-top: 1rem;
    margin-top: 1rem;
}

.total-info {
    text-align: right;
    font-size: 1.1rem;
}

@media (max-width: 768px) {
    .table-responsive {
        font-size: 0.875rem;
    }
    
    .modal-content {
        width: 95%;
        margin: 1rem;
    }
    
    .modal-header,
    .modal-body {
        padding: 1rem;
    }
}
</style>