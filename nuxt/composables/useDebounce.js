import { ref } from "vue"

export const useDebounce = () => {

    const timeoutId = ref(0)

    const createDebounce = function (fnc, delayMs) {
        if (timeoutId.value != 0) clearTimeout(timeoutId.value);
        timeoutId.value = setTimeout(() => {
          fnc();
        }, delayMs || 500);
    }

    return {
        debounce: createDebounce
    }
}