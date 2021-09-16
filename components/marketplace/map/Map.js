import React, { useState } from 'react'
import styles from './Map.module.sass'
import {GoogleMap, MarkerClusterer, Marker, InfoBox, useJsApiLoader} from '@react-google-maps/api';
import cn from "classnames";
import {debounce} from "../../../utils";

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = { lat: -31.56391, lng: 147.154312 }

function Map({ items, onBoundsChange }) {
  const [activeMarkerIndex, setActiveMarkerIndex] = useState(-1)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyDlqMYs6_uXvpAVJkVBf4hsUywAFVo5GBA'
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    //map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const onInfoBoxLoad = infoBox => {
    //infoBox.close()
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

  const options = {
    imagePath: '/map/m', // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
    clusterClass: styles.cluster
  }

  const handleBoundsChange = debounce(function () {
    let bounds = map.getBounds()
    let viewportItems = []
    items.forEach(item => {
      if (bounds.contains(item.location)) {
        viewportItems.push(item)
      }
    })
    onBoundsChange(viewportItems)
  }, 500)

  function createKey(location) {
    return location.lat + location.lng
  }

  function handleZoom(value) {
    return function () {
      const currentZoom = map.getZoom()
      map.setZoom(currentZoom + value)
    }
  }

  function handleMarkerClick(index) {
    return function () {
      setActiveMarkerIndex(index)
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
          zoom={10}
          onLoad={onLoad}
          onBoundsChanged={handleBoundsChange}
          onUnmount={onUnmount}>
          {/*<MarkerClusterer options={options}>*/}
          {/*  {(clusterer) =>*/}
          {
            items.map((item, index) => (
              <Marker
                title={item.name}
                key={createKey(item.location)}
                position={item.location}
                onClick={handleMarkerClick(index)}
                icon={activeMarkerIndex === index ? activeIcon : defaultIcon}
                // clusterer={clusterer}
              />
            ))
          }
          {/*  }*/}
          {/*</MarkerClusterer>*/}
          {/*<InfoBox*/}
          {/*  anchor={{ lat: -31.56391, lng: 147.154312 }}*/}
          {/*  onLoad={onInfoBoxLoad}*/}
          {/*  options={options}*/}
          {/*  position={center}*/}
          {/*>*/}
          {/*  <div style={{ backgroundColor: 'yellow', opacity: 0.75, padding: 12 }}>*/}
          {/*    <div style={{ fontSize: 16, fontColor: `#08233B` }}>*/}
          {/*      Hello, World!*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</InfoBox>*/}
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