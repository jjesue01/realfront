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

  const result = [...arr].sort((a, b) => {
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
// tagStr = '#tag1, #tag2, #tag3'
export function decodeTags(tagsStr) {
  if (!tagsStr) return ''
  return tagsStr.split(', ').map(tag => tag.replace(/#/g, '')).join(',') // 'tag1,tag2,tag3'
}
//tagsStr = 'tag1,tag2,tag3'
export function encodeTags(tagsStr) {
  if (!tagsStr) return ''
  return tagsStr.split(',').map(tag => '#' + tag).join(', ') // '#tag1, #tag2, #tag3'
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
  return `$${new Intl.NumberFormat('en-US', { 
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  })
    .format(+value || 0)}`
}

const privateRoutes = [
  '/photos/create',
  '/photos/edit',
  '/photos/sell',
  '/settings',
  '/profile',
]

export function isPrivateRoute(pathname) {
  return privateRoutes.some(route => route?.exact ? pathname === route.path : pathname.includes(route))
}

export function buildFilterOptions(listings) {
  const cityOptions = new Set()
  let tagOptions = []

  listings.forEach(({ city, tags }) => {
    if (city?.name)
      cityOptions.add(JSON.stringify({
        label: city.name,
        value: city.ID
      }))
    
    if (Array.isArray(tags))
      tagOptions = [...tagOptions, ...tags]
    else if (typeof tags === 'string')
      tagOptions = [...tagOptions, ...tags.split(',')]
  })

  return {
    cities: [...cityOptions].map(city => JSON.parse(city)),
    tags: [...new Set(tagOptions)]
  }
}

const epochs = [
  ['year', 31536000],
  ['month', 2592000],
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
  ['second', 1]
];

const getDuration = (timeAgoInSeconds) => {
  for (let [name, seconds] of epochs) {
    const interval = Math.floor(timeAgoInSeconds / seconds);
    if (interval >= 1) {
      return {
        interval: interval,
        epoch: name
      };
    }
  }
};

export const timeAgo = (date) => {
  const timeAgoInSeconds = Math.floor((new Date() - new Date(date)) / 1000);
  const {interval, epoch} = getDuration(timeAgoInSeconds);
  const suffix = interval === 1 ? '' : 's';
  return `${interval} ${epoch}${suffix} ago`;
};

export function escapeValue(str) {
  return str.replace(/\s/g, '-').replace(/[^ \w-.]/g, '').toLowerCase()
}

export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

export const isTokenExpired = token => Date.now() >= (JSON.parse(atob(token.split('.')[1]))).exp * 1000

export function buildPlace(address_components) {
  const place = {
    address: '',
    postcode: '',
    city: ''
  }

  for (const component of address_components) {
    const componentType = component.types[0];

    switch (componentType) {
      case "street_number": {
        place.address = `${component.long_name} ${place.address}`;
        break;
      }

      case "route": {
        place.address += component.short_name;
        break;
      }

      case "postal_code": {
        place.postcode = `${component.long_name}${place.postcode}`;
        break;
      }

      case "postal_code_suffix": {
        place.postcode = `${place.postcode}-${component.long_name}`;
        break;
      }
      case "locality":
        place.city = component.long_name;
        break;
      case "administrative_area_level_1": {
        place.state = component.short_name;
        break;
      }
      case "country":
        place.country = component.long_name;
        break;
    }
  }
  return place
}

export function download(url, filename) {
  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    })
    .catch(console.error);
}

export function downloadNFT(id, filename) {
  download(process.env.NEXT_PUBLIC_PINATA_URL + id, filename)
}

export function getHost() {
  if (typeof window === 'undefined') return ''
  return window.location.origin
}

export function copyValue(value) {
  return navigator.clipboard.writeText(value)
}

export function getLatLng(listing) {
  return {
    lat: listing?.geoLocation?.coordinates[1],
    lng: listing?.geoLocation?.coordinates[0]
  }
}
