import React, {useEffect, useRef, useState} from 'react'
import styles from './Map.module.sass'
import {GoogleMap, MarkerClusterer, InfoWindow, Marker, InfoBox, useLoadScript} from '@react-google-maps/api';
import cn from "classnames";
import {debounce, getLatLng} from "../../../utils";
import Typography from "../../Typography";
import {logout} from "../../../features/auth/authSlice";

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = { lat: 39.099724, lng: -94.578331 }
const libraries = ['places']

function Map({ items, onBoundsChange, activeItem, onActiveItemChange }) {
  const [map, setMap] = useState(null)
  const [infoBox, setInfoBox] = useState(null)
  const [address, setAddress] = useState('')

  const markers = useRef({})

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDlqMYs6_uXvpAVJkVBf4hsUywAFVo5GBA',
    libraries,
    language: 'en'
  })

  const onLoad = React.useCallback(function callback(map) {
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const onInfoBoxLoad = infoBox => {
    infoBox.close()
    setInfoBox(infoBox)
  };

  const defaultIcon = {
    url: '/marker-icon.png',
    size: { width: 24, height: 24 },
    anchor: { x: 12, y: 12 }
  }
  const activeIcon = {
    url: '/marker-active-icon.png',
    size: { width: 38, height: 38 },
    anchor: { x: 19, y: 19 }
  }

  const clusterStyles = [
    {
      textColor: 'white',
      textSize: 13,
      fontFamily: `Montserrat`,
      url: '/map/cluster-38.png',
      height: 38,
      width: 38
    },
    {
      textColor: 'white',
      textSize: 13,
      fontFamily: `Montserrat`,
      url: '/map/cluster-48.png',
      height: 48,
      width: 48
    },
    {
      textColor: 'white',
      textSize: 13,
      fontFamily: `Montserrat`,
      url: '/map/cluster-63.png',
      height: 63,
      width: 63
    },
    {
      textColor: 'white',
      textSize: 13,
      fontFamily: `Montserrat`,
      url: '/map/cluster-78.png',
      height: 78,
      width: 78
    },
    {
      textColor: 'white',
      textSize: 13,
      fontFamily: `Montserrat`,
      url: '/map/cluster-94.png',
      height: 94,
      width: 94
    },
  ]

  const handleBoundsChange = debounce(function () {
    let bounds = map.getBounds()

      // console.log(bounds.toUrlValue())
    onBoundsChange(bounds.toUrlValue())
    // infoBox.close()
    // setActiveMarker(-1)
  }, 1000)


  function handleZoom(value) {
    return function () {
      const currentZoom = map.getZoom()
      map.setZoom(currentZoom + value)
    }
  }

  function handleMarkerClick(item) {
    return function () {
      onActiveItemChange(item)
    }
  }

  function handleMarkerLoad(item) {
    return function (marker) {
      markers.current[item._id] = marker
    }
  }

  function handleMarkerUnmount(item) {
    return function (marker) {
      if (activeItem?._id === item._id)
        onActiveItemChange(null)
    }
  }

  useEffect(function manageInfoBox() {
    if (activeItem !== null) {
      infoBox.close()
      infoBox.open(map, markers.current[activeItem._id])
      setAddress(activeItem.address)
    } else {
      infoBox?.close()
    }
  }, [activeItem, infoBox, map])

  return (
    <div className={styles.root}>
      {
        isLoaded &&
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          options={{ disableDefaultUI: true }}
          zoom={4}
          onLoad={onLoad}
          onBoundsChanged={handleBoundsChange}
          onUnmount={onUnmount}>
          <MarkerClusterer  styles={clusterStyles}>
            {
              clusterer =>
                items.map((item, index) => (
                  <Marker
                    onUnmount={handleMarkerUnmount(item)}
                    onLoad={handleMarkerLoad(item)}
                    title={item.name}
                    key={item._id}
                    position={getLatLng(item)}
                    onClick={handleMarkerClick(item)}
                    icon={activeItem?._id === item._id ? activeIcon : defaultIcon}
                    clusterer={clusterer}
                  />
                ))
            }
          </MarkerClusterer>

          <InfoBox
            onLoad={onInfoBoxLoad}
            options={{
              closeBoxURL: '',
              enableEventPropagation: true,
              alignBottom: true,
              disableAutoPan: true
            }}
            position={center}>
            <div className={styles.infoBox}>
              <Typography fontWeight={600} fontSize={12} color={'#111'} align="center">
                { address }
              </Typography>
            </div>
          </InfoBox>
        </GoogleMap>
      }
      <div className={styles.zoomControls}>
        <button onClick={handleZoom(1)} className={cn(styles.btnZoom, styles.btnZoomPlus)} />
        <button onClick={handleZoom(-1)} className={styles.btnZoom} />
      </div>
    </div>
  )
}

export default React.memo(Map)