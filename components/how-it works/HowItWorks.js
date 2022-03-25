import React from "react";
import styles from "./HowItWorks.module.sass";
import SectionTitle from "../section-title/SectionTitle";
import Image from "next/image";
import Typography from "../Typography";
import Button from "../button/Button";
import Link from "next/link";
import { useSelector } from "react-redux";

function HowItWorks({ center = false, onConnect }) {
    const user = useSelector((state) => state.auth.user);

    return (
        <section className={styles.root}>
            <div className="container">
                <SectionTitle center={center}>How it works</SectionTitle>
                {center && (
                    <Typography
                        fontFamily={"Lato"}
                        fontWeight={500}
                        fontSize={18}
                        lHeight={32}
                        margin={"24px auto 0"}
                        align={"center"}
                        maxWidth={615}
                        color={"rgba(55, 65, 81, 0.8)"}
                    >
                        Buying an NFT on the real marketplace is actually pretty easy, as long as
                        you remember to use MetaMask for your wallet, BNB for your gas fees, and
                        BUSD for your NFT purchases.
                    </Typography>
                )}
            </div>
            <div className={styles.stepsContainer}>
                <div className={styles.steps}>
                    <div className={styles.step}>
                        <div className={styles.stepImage}>
                            <Image src="/images/hiw-1.png" width={60} height={52} alt="Wallet" />
                        </div>
                        <Typography
                            fontSize={20}
                            fontWeight={600}
                            lHeight={24}
                            margin={"32px 0 18px"}
                            color={"#111111"}
                            align="center"
                        >
                            Set up your wallet
                        </Typography>
                        <Typography
                            fontFamily={"Lato"}
                            fontSize={14}
                            lHeight={22}
                            maxWidth={231}
                            align={"center"}
                            color={"rgba(55, 65, 81, 0.8)"}
                        >
                            We use MetaMask for our wallet. Once you’ve set up your MetaMask wallet,
                            connect it to the real NFT Marketplace by clicking Connect Wallet in the
                            top right corner.
                        </Typography>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepImage}>
                            <Image
                                src="/images/crypto-currency.png"
                                width={75}
                                height={60}
                                alt="crypto-currency"
                            />
                        </div>
                        <Typography
                            fontSize={20}
                            fontWeight={600}
                            lHeight={24}
                            margin={"32px 0 18px"}
                            color={"#111111"}
                            align="center"
                        >
                            Purchase your cryptocurrency
                        </Typography>
                        <Typography
                            fontFamily={"Lato"}
                            fontSize={14}
                            lHeight={22}
                            maxWidth={231}
                            align={"center"}
                            color={"rgba(55, 65, 81, 0.8)"}
                        >
                            We use BNB for our gas fees and BUSD for our NFT transactions. You can
                            purchase both BNB and BUSD on the Binance.US exchange, or a number of
                            other exchanges. Just remember, you will only need a little bit of BNB
                            (gas fees are less than $1), and a lot of BUSD (the sky’s the limit on
                            what you wish to purchase).
                        </Typography>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepImage}>
                            <Image src="/images/nft.png" width={74} height={69} alt="nft" />
                        </div>
                        <Typography
                            fontSize={20}
                            fontWeight={600}
                            lHeight={24}
                            margin={"32px 0 18px"}
                            color={"#111111"}
                            align="center"
                        >
                            Purchase your NFTs
                        </Typography>
                        <Typography
                            fontFamily={"Lato"}
                            fontSize={14}
                            lHeight={22}
                            maxWidth={231}
                            align={"center"}
                            color={"rgba(55, 65, 81, 0.8)"}
                        >
                            First, your wallet must be connected. Once connected, you can select any
                            NFT from our marketplace for purchase. The price of the NFT will be
                            listed in US dollars and BUSD (same equivalence).
                        </Typography>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepImage}>
                            <Image src="/images/hiw-4.png" width={72} height={69} alt="Sale" />
                        </div>
                        <Typography
                            fontSize={20}
                            fontWeight={600}
                            lHeight={24}
                            margin={"32px 0 18px"}
                            color={"#111111"}
                            align="center"
                        >
                            Resell your NFTs
                        </Typography>
                        <Typography
                            fontFamily={"Lato"}
                            fontSize={14}
                            lHeight={22}
                            maxWidth={231}
                            align={"center"}
                            color={"rgba(55, 65, 81, 0.8)"}
                        >
                            Yes, you can resell your purchased NFTs. To sell an NFT on the real
                            marketplace, just go to your profile and click on the desired NFT. Then
                            select to sell that NFT, and set the sale price. Just remember, once you
                            mint your NFT for sale and the listing is live, you cannot go back and
                            change the price.
                        </Typography>
                    </div>
                </div>
                <div className={styles.actions}>
                    <Link href="/marketplace">
                        <a>
                            <Button type="accent">Explore</Button>
                        </a>
                    </Link>
                    {!user && (
                        <Button onClick={onConnect} type="outlined">
                            Connect Wallet
                        </Button>
                    )}
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;
