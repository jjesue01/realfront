import React from "react";
import Head from "next/head";
import CommonHero from "../components/common-hero/CommonHero";
import AboutUs from "../components/about/about-us/AboutUs";
import {HOST_NAME} from "../fixtures";
import Typography from "../components/Typography";

function WhyBuy() {
  return (
    <main>
      <Head>
        <title>Why buy on NFT Marketplace - HomeJab</title>
        <meta name="description" content="HomeJab’s NFT marketplace is where real estate photographers can promote their work, without fear of losing ownership of their efforts." />
        <meta property="og:locale" content="en_US" />
        <meta property="og:title" content="Why buy on NFT Marketplace - HomeJab" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={HOST_NAME + '/about'} />
        <meta property="og:image" content="/images/why-buy.jpg" />
        <meta property="og:image:alt" content="HomeJab icon" />
        <meta property="og:description" content="HomeJab’s NFT marketplace is where real estate photographers can promote their work, without fear of losing ownership of their efforts." />
      </Head>
      <CommonHero
        title={'Own your piece of the digital world'}
        description={`
        By using NFTs, real estate photographers can deliberately and transparently deliver digital usage rights to their customers without the need for any legal contracts. Buyers can then use the image exclusively for their marketing without any legal or licensing issues.
        
        But what is stopping someone from right-clicking on images to download the file or take a screenshot?  The simple answer – nothing.  Anyone can steal a JPG.  But, it’s near impossible to steal the NFT recorded on the blockchain that proves rightful ownership of that image. This means there is no resale value for the stolen image, and the perpetrator has no usage rights.
        `}
        imgUrl={'/images/why-buy.jpg'} />
      <AboutUs
        title="A secondary market emerges"
        imageUrl="/images/why-buy-market.jpeg">
        <Typography
          fontFamily={'Lato'}
          fontSize={16}
          lHeight={32}
          margin={'24px 0 0'}
          color={'rgba(55, 65, 81, 0.8)'}>
          Online image theft is rampant, especially in the real estate community. And, while it seems harmless on the surface, it’s actually quite damaging for the artist who creates the image. Photographers are forced to put their work out there with zero protections, at very little pay. The HomeJab NFT Marketplace is designed to protect the ownership of an artist’s digital portfolio, while rewarding them for their hard work.
        </Typography>
        <Typography
          fontFamily={'Lato'}
          fontSize={16}
          lHeight={32}
          margin={'32px 0 0'}
          color={'rgba(55, 65, 81, 0.8)'}>
          When you purchase an NFT from HomeJab, you are not only owning a piece of real world history, you are supporting a real life artist. Most photographers work as independent contractors, with little recourse after a shoot is complete. Once the work is published, the possession is out of the artist’s control. The HomeJab NFT Marketplace is the only place, real or digital, that secures their efforts and the ongoing value they provide.
        </Typography>
      </AboutUs>
      <CommonHero
        title={'Support local photographers'}
        description={`
        96% of all sales on the Real Marketplace are paid to the photographer. In the existing model, these types of images would typically get sold by large, centralized corporations in the form of stock images.  The problem is, stock images are not unique in any way.  It’s the same image getting sold over and over again to many different people.  Also, most of the money earned from these sales go to the corporation and the photographer earns very little income after the initial shoot.
        
        Buying NFTs supports individual photographers and flips the old stock image industry upside down so all financial benefits go back to the photography community.
        `}
        imgUrl={'/images/why-buy-support.jpeg'} />
      <AboutUs
        title="Invest in a decentralized future"
        imageUrl="/images/why-buy-invest.jpeg">
        <Typography
          fontFamily={'Lato'}
          fontSize={16}
          lHeight={32}
          margin={'24px 0 0'}
          color={'rgba(55, 65, 81, 0.8)'}>
          85% of the stock image industry is dominated by just five companies.  Two of those companies control nearly half of all sales.  By purchasing real estate photo NFTs, buyers will disrupt the old system for the benefit of individual creators.
        </Typography>
        <Typography
          fontFamily={'Lato'}
          fontSize={16}
          lHeight={32}
          margin={'32px 0 0'}
          color={'rgba(55, 65, 81, 0.8)'}>
          Imagine a world in which each image and its creator were protected, and where owners were credited, rewarded, or compensated after each download or transfer of their images.  Such is the decentralized, distributed ledger known as the blockchain, and it’s poised to revolutionize how digital assets are bought and sold across various industries.
        </Typography>
      </AboutUs>
    </main>
  )
}

export default WhyBuy