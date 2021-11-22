import React, {useState} from "react";
import styles from './MediaFile.module.sass'
import AspectRatioBox from "../aspect-ratio-box/AspectRatioBox";
import Image from "next/image";
import SkeletonBox from "../skeleton-box/SkeletonBox";

function MediaFile({ className, src, videoSrc, alt, controls= false, autoPlay= false }) {
  const [isLoading, setLoading] = useState(true)

  function handleLoadingComplete() {
    setLoading(false)
  }

  return (
    <AspectRatioBox className={className}>
      {
        !!videoSrc ?
          <video
            className={styles.video}
            src={videoSrc}
            controls={controls}
            controlsList="nodownload"
            loop
            autoPlay={autoPlay} />
          :
          src ?
            <Image
              src={src}
              layout="fill"
              objectFit={'cover'}
              onLoadingComplete={handleLoadingComplete}
              alt={alt} />
              :
            null
      }
      <SkeletonBox loading={isLoading && !videoSrc} />
    </AspectRatioBox>
  )
}

export default MediaFile