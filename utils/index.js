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
  if (!tagsStr) return []
  return tagsStr.split(', ').map(tag => tag.replace(/#/g, ''))
}

export function encodeTags(tagsArr) {
  if (tagsArr.length === 0) return ''
  return tagsArr.map(tag => '#' + tag).join(', ')
}
