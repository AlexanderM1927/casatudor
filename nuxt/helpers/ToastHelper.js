export default {
    openToast (toastTarget) {
        const el = document.getElementById(toastTarget)
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(el)
        toastBootstrap.show()
    }
}