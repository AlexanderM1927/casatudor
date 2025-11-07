
export function generateSlug(name) {
    name = name.toLowerCase();
    name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    name = name.replace(/[^a-z0-9]+/g, '-');
    name = name.replace(/^-|-$/g, '');
    return name;
}

export function getSlugAndId(name, id) {
    const slug = generateSlug(name);
    return id + '-' + slug;
}

export function getIdFromSlug(slug) {
    if (slug.indexOf('-') === -1) {
        return slug;
    }
    const parts = slug.split('-');
    return parts[0];
}