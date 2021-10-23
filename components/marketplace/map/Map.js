import React, {useEffect, useState} from 'react'
import styles from './Map.module.sass'
import {GoogleMap, MarkerClusterer, InfoWindow, Marker, InfoBox, useLoadScript} from '@react-google-maps/api';
import cn from "classnames";
import {debounce} from "../../../utils";
import Typography from "../../Typography";

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = { lat: 34.1880148, lng: -118.4653348 }
const libraries = ['places']

function Map({ items, onBoundsChange }) {
  const [map, setMap] = useState(null)
  const [infoBox, setInfoBox] = useState(null)
  const [activeMarkerIndex, setActiveMarkerIndex] = useState(-1)
  const [markers, setMarkers] = useState([])

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
    if (items.length !== 0) {
      let bounds = map.getBounds()
      //console.log(bounds.toJSON())
      // console.log(bounds.getNorthEast(), bounds.getSouthWest())
      let viewportItems = []

      items.forEach(item => {
        const location = {
          lat: item.geoLocation.coordinates[1],
          lng: item.geoLocation.coordinates[0],
        }
        if (bounds.contains(location)) {
          viewportItems.push(item)
        }
      })
      onBoundsChange(viewportItems)
    }
  }, 500)


  function handleZoom(value) {
    return function () {
      const currentZoom = map.getZoom()
      map.setZoom(currentZoom + value)
    }
  }

  function handleMarkerClick(index) {
    return function () {
      setActiveMarkerIndex(index)
      infoBox.open(map, markers[index])
    }
  }

  function handleMarkerLoad(index) {
    return function (marker) {
      setMarkers(prevMarkers => {
        const updatedMarkers = [...prevMarkers]
        updatedMarkers[index] = marker
        return updatedMarkers
      })
    }
  }

  return (
    <div className={styles.root}>
      {
        isLoaded &&
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          options={{ disableDefaultUI: true }}
          zoom={3}
          onLoad={onLoad}
          onBoundsChanged={handleBoundsChange}
          onUnmount={onUnmount}>
          <MarkerClusterer  styles={clusterStyles}>
            {
              clusterer =>
                items.map((item, index) => (
                  <Marker
                    onLoad={handleMarkerLoad(index)}
                    title={item.name}
                    key={item._id}
                    position={{ lat: item.geoLocation.coordinates[1], lng: item.geoLocation.coordinates[0] }}
                    onClick={handleMarkerClick(index)}
                    icon={activeMarkerIndex === index ? activeIcon : defaultIcon}
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
              alignBottom: true ,
            }}
            position={center}>
            <div className={styles.infoBox}>
              <Typography fontWeight={600} fontSize={12} color={'#111'} align="center">
                { items[activeMarkerIndex]?.address }
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