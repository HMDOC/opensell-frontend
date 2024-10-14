export function getAdImageUrl(fileName?: string) {
  return fileName
    ? process.env.REACT_APP_BACKEND_URL + "/ad-image/" + fileName
    : undefined;
}

export function getCustomerIconUrl(fileName?: string) {
  return fileName
    ? process.env.REACT_APP_BACKEND_URL + "/customer-profile/" + fileName
    : undefined;
}
