import 'bootstrap'

export default {
    openToast (toastTarget) {
        if (bootstrap) {
            const el = document.getElementById(toastTarget)
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(el)
            toastBootstrap.show()
        }
    }
}