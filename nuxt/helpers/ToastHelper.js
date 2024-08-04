import bootstrap from '~/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'

export default {
    openToast (toastTarget) {
        if (bootstrap) {
            const el = document.getElementById(toastTarget)
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(el)
            toastBootstrap.show()
        }
    }
}