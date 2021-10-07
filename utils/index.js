import Typography from "../components/Typography";
import React from "react";

export function debounce(func, wait, immediate) {
  let timeout;

  return function executedFunction() {
    const context = this;
    const args = arguments;

    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}

export function getSortedArray(arr, field) {
  const splitField = field.split('_')
  const itemField = splitField[0];
  const direction = splitField[1]

  const result = arr.sort((a, b) => {
    if (a[itemField] < b[itemField])
      return -1
    if (a[itemField] > b[itemField])
      return 1
    return 0
  })

  if (direction === 'high')
    return result.reverse()

  return result
}

export function getImageUrl(image) {
  return typeof image === 'string' ? image : URL.createObjectURL(image)
}

export function scrollToTop(top = 0) {
  window.scrollTo({
    top,
    behavior: "smooth"
  })
}

export function getIdToken() {
  const auth = JSON.parse(localStorage.getItem('auth'))
  return auth?.token
}

export function getUser() {
  const auth = JSON.parse(localStorage.getItem('auth'))
  return auth?.user
}

export function decodeTags(tagsStr) {
  if (!tagsStr) return ''
  return tagsStr.split(', ').map(tag => tag.replace(/#/g, '')).join(',')
}

export function encodeTags(tagsArr) {
  if (tagsArr.length === 0) return ''
  return tagsArr.map(tag => '#' + tag).join(', ')
}

export function getShortWalletAddress(walletAddress) {
  if (!walletAddress) return ''
  return `${walletAddress.slice(0, 11)}...${walletAddress.slice(-4)}`
}

export function buildFormData(data) {
  const formData = new FormData()

  for (const [key, value] of Object.entries(data)) {
    const keyLowerCase = key.toLowerCase()
    if (keyLowerCase.includes('image') || keyLowerCase.includes('file') || keyLowerCase.includes('raw')) {
      if (typeof value?.name === 'string')
        formData.append(key, value, value.name)
    } else {
      formData.append(key, value)
    }
  }

  return formData
}

export function getMoneyView(value) {
  return `$${new Intl.NumberFormat('ru-RU').format(+value || 0)}`
}
