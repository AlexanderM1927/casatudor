export function sortByField(items) {
    if (!items || !Array.isArray(items)) {
        return items;
    }

    return [...items].sort((a, b) => {
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