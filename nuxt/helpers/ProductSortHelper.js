/**
 * Ordena productos por el campo 'sort'
 * Los productos con sort null o undefined quedan al final
 * @param {Array} products - Array de productos a ordenar
 * @returns {Array} - Array de productos ordenados
 */
export function sortProductsByField(products) {
    if (!products || !Array.isArray(products)) {
        return products;
    }

    return [...products].sort((a, b) => {
        const sortA = a.sort;
        const sortB = b.sort;

        // Si ambos tienen sort, ordenar por ese valor
        if (sortA != null && sortB != null) {
            return sortA - sortB;
        }

        // Si solo A tiene sort, A va primero
        if (sortA != null && sortB == null) {
            return -1;
        }

        // Si solo B tiene sort, B va primero
        if (sortA == null && sortB != null) {
            return 1;
        }

        // Si ninguno tiene sort, mantener orden original
        return 0;
    });
}
