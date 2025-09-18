export default {
    openToast (message, type) {
        try {
            const toastContainer = document.getElementById('toast-container')
            if (!toastContainer) {
                console.error('Toast container not found')
                return
            }
            
            const toast = document.createElement('div');
            toast.classList.add('toast');
            toast.classList.add('show'); // Add show class immediately
            toast.classList.add(type); // Add 'error' or 'success' class
            toast.textContent = message;
            toastContainer.appendChild(toast);

            // Remove the toast after the animation completes
            setTimeout(() => {
                toast.remove();
            }, 5000); // Remove after 5 seconds to match your CSS animation
        } catch (error) {
            console.log(error)
            console.log('Toast error occurred')
        }
    }
}