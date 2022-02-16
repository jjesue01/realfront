import React, {useState} from "react";
import styles from './MediaFile.module.sass'
import AspectRatioBox from "../aspect-ratio-box/AspectRatioBox";
import Image from "next/image";
import SkeletonBox from "../skeleton-box/SkeletonBox";
import cn from "classnames";

function MediaFile({ className, src, videoSrc, alt, controls= false, autoPlay= false }) {
  const [isLoading, setLoading] = useState(true)

  const videoParams = {
    autoPlay,
    controls,
    controlsList: 'nodownload',
    loop: true
  }

  if (autoPlay) {
    videoParams.playsInline = true
  }

  function handleLoadingComplete() {
    setLoading(false)
  }

  return (
    <AspectRatioBox className={cn(className, styles.root)}>
      {
        !!videoSrc ?
          <video
            className={styles.video}
            src={videoSrc}
            muted
            {...videoParams} />
          :
          src ?
            <>
              <Image
                src={src}
                layout="fill"
                objectFit={'contain'}
                onLoadingComplete={handleLoadingComplete}
                alt={alt} />
              <div className={styles.layer} />
            </>
            :
            null
      }
      <SkeletonBox loading={isLoading && !videoSrc} />
    </AspectRatioBox>
  )
}

export default MediaFile