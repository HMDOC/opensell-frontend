export function getAdImageUrl(fileName?: string) {
    return fileName ? import.meta.env.VITE_IMAGES_SERVER_URL+import.meta.env.VITE_AD_IMAGES_FOLDER+fileName : undefined;
}

export function getCustomerIconUrl(fileName?: string) {
    return fileName ? import.meta.env.VITE_IMAGES_SERVER_URL+import.meta.env.VITE_CUSTOMER_PROFILE_FOLDER+fileName : undefined;
}