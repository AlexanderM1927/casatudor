import * as bootstrap from '~/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'

export default {
    openToast (toastTarget) {
        try {
            const el = document.getElementById(toastTarget)
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(el)
            toastBootstrap.show()
        } catch (error) {
            console.log('err')
        }
    }
}