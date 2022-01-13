import Typography from "../components/Typography";
import React from "react";
import {execOnce} from "next/dist/shared/lib/utils";

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
      if (Array.isArray(value))
        value.forEach(item => {
          if (typeof item?.name === 'string')
            formData.append(key, item, value.name)
        })
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
    
    if (!!tags)
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
  const duration = getDuration(timeAgoInSeconds);

  if (!duration) return 'just now'

  const suffix = duration.interval === 1 ? '' : 's';
  return `${duration.interval} ${duration.epoch}${suffix} ago`;
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
  fetch(url, {
    headers: {
      'Authorization': getIdToken()
    }
  })
    .then(response => response.blob())
    .then(blob => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    })
    .catch(console.error);
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

export function countDownTime(endDate) {
  const end = new Date(endDate);

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;

  const now = new Date();
  const distance = end - now;

  if (distance < 0) {
    return null
  }

  const hours = Math.floor(distance / hour);
  const minutes = Math.floor((distance % hour) / minute);
  const seconds = Math.floor((distance % minute) / second);

  return {
    hours,
    minutes,
    seconds
  }
}

export function getFormattedEndTime(dateStr) {
  const date = new Date(dateStr)
  const options = {
    dateStyle: 'full',
    timeStyle: 'short',
    hour12: true,
    timeZone: 'EST'
  }

  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date)
  const dateArray = formattedDate.split(', ')
  dateArray.shift()

  return `${dateArray.join(', ')} EST`
}

export function getFormattedFileFormats(formatsArr) {
  return formatsArr.map(format => format.slice(1).toUpperCase()).join(', ')
}

export function getFormattedDate(dateStr) {
  const date = new Date(dateStr)
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }
  return new Intl.DateTimeFormat('en-US', options).format(date)
}

export function dateToString(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1
  const day = date.getDate();

  return `${year}-${('0' + month).slice(-2)}-${('0' + day).slice(-2)}`
}

export function dateFromESTtoISOString(dateStr, timeStr) {
  const time24 = convertTime(timeStr)
  const estString = `${dateStr}T${time24}:00.000-05:00`

  return new Date(estString).toISOString()
}

export function getESTDateTimeFromISO(isoString) {
  const estDateString = new Date(isoString).toLocaleString('en-US', { timeZone: 'America/New_York' })
  const [dateString, time12] = estDateString.split(', ')

  return {
    date: dateToString(new Date(dateString)),
    time: convertTime(time12, true)
  }
}

export function convertTime(timeStr, hour12 = false) {
  const date = new Date(`${dateToString(new Date)} ${timeStr}`)
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12
  }
  return new Intl.DateTimeFormat('en-US', options).format(date)
}