export const questions = [
  {
    title: "For Patrons",
    content: [
        {
            question_subtitle: "How do I create a crypto wallet?",
            answer: "When you click the Connect Wallet icon at the top of the page (green button) you will be asked to select a wallet provider.  We use MetaMask as our provider, they are one of the largest and safest applications available.  Click on the MetaMask icon and continue within that application and create a MetaMask wallet.  You will be asked to create a username and password, and given a long phrase to save somewhere safe.  This phrase is your security code, used to protect your account and applied only if you do not remember your password.",
        },
        {
            question_subtitle: "How do I purchase cryptocurrency?",
            answer: "Once your wallet is created you will need to purchase cryptocurrency, which can be done on a number of currency exchanges.  We recommend the Binance.US exchange (here is the link… https://www.binance.us/en/home).  They have very low prices, and a huge global presence (very secure).  Just make sure you are using the US version (not the global version).",
        },
        {
            question_subtitle:
                "Which cryptocurrency do I need to purchase NFTs on the real marketplace?",
            answer: "You will need two forms of cryptocurrency, BNB (to pay for your gas fees) and BUSD (to purchase the NFT).  BNB is Binance’s crypto coin that fluctuates with the market, and is the third most traded cryptocurrency among investors.  BUSD is Binance’s stablecoin which does not fluctuate, but mirrors the value of the US dollar.  Since the focus of the NFT world is the actual image (not the cryptocurrency), it’s important to have a stablecoin that will not fluctuate with the market.  A stablecoin is always recommended when purchasing a good or service.",
        },
        {
            question_subtitle:
                "How much cryptocurrency do I need to purchase NFTs on the real marketplace?",
            answer: "When in Binance, you will create an account, link your MetaMask wallet and purchase both BNB & BUSD.  You do not need much BNB.  Gas fees are the processing fees (similar to a tax).  Most gas fees are under $1 per transaction.  As for BUSD, you should purchase enough to match what you want to purchase on the NFT real marketplace.  Now we are ready to purchase real NFTs!",
        },
        {
            question_subtitle: "How do I search for NFTs to purchase?",
            answer: "Our Marketplace page hosts all available NFTs for sale.  You can search by Address, City, Price, NFT type (under Resources tab), or even Keyword (under More tab).  Plus, you can also search Trending Cities on the main page.",
        },
        {
            question_subtitle: "How do I purchase an NFT?",
            answer: "First, your wallet must be connected.  Once connected, you can select any NFT from our marketplace for purchase.  The price of the NFT will be listed in US dollars and BUSD (same equivalence).  When you select your NFT for purchase, you will also have gas fees to pay (which are very minimal and paid in BNB).  Once the transaction is complete, your new NFT will be available for you in your profile.  In fact, all transaction history is visible in your user profile.  Of course, the official storage of your NFTs is in your MetaMask wallet, viewed in the real marketplace or anywhere you access your wallet.",
        },
        {
            question_subtitle: "Can I sell an NFT that I purchase?  If so, how?",
            answer: "Yes.  To sell an NFT on the real marketplace, just go to your profile and click on the desired NFT.  Then select to sell that NFT, and set the sale price.  Once you mint your NFT for sale and the listing is live, you cannot go back and change the price.  You can remove the NFT for sale, but cannot adjust the existing listing.  Remember, this is being stored on a massive decentralized platform (blockchain) so manipulation of any minting is not possible.",
        },
    ],
},
{
    title: "For Artists",
    content: [
        {
            question_subtitle: "What makes a real NFT unique?",
            answer: "real is the first and only NFT marketplace designed specifically for the real estate community.  It not only protects the work of real estate photographers, it provides true digital ownership of each image bought and sold… protecting all parties involved in the transaction.",
        },
        {
            question_subtitle: "What are the gas fees on the real NFT marketplace?",
            answer: "Gas fees are paid in BNB.  As of March 2022, BNB gas fees are approximately 0.012 BNB (which equates to $0.05, a nickel per transaction).",
        },
        {
            question_subtitle: "What are the transaction fees on the real NFT marketplace?",
            answer: "The real marketplace takes a 4% base transaction fee for each NFT sale, while the artist receives 96% of the transaction.  All fees are received in BUSD.",
        },
        {
            question_subtitle: "Is there a residual fee structure (royalty) for NFT reales?",
            answer: "Yes, with every minted NFT, the original artist can set a royalty fee anywhere between 0 - 10% (which they collect with each resale of that NFT).",
        },
        {
            question_subtitle: "Where can I view my collection of real NFTs?",
            answer: "In addition to the real NFT marketplace, all of your real NFTs are accessible in your real profile and stored in your MetaMask wallet… until they sell of course!",
        },
        {
            question_subtitle:
                "If I have more questions, or want to become a real marketplace artist, how can I contact the real NFT marketplace?",
            answer: "The real NFT marketplace is affiliated with HomeJab Real Estate Photography.  For additional information, please go to homejab.com or contact our support team at support@homejab.com.",
        },
    ],
},
]

export const blockchainOptions = [
  {
    label: 'Binance Smart Chain',
    value: 'binance_smart_chain'
  },
  {
    label: 'Polygon',
    value: 'polygon'
  },
]

export const DAY = 1000 * 60 * 60 * 24

export const BINANCE_TESTNET = {
  chainId: '0x61',
  chainName: 'Binance Smart Chain Testnet',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'tBNB',
    decimals: 18,
  },
  rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
  blockExplorerUrls: ['https://testnet.bscscan.com'],
}

export const BINANCE_MAINNET = {
  chainId: '0x38',
  chainName: 'Binance Smart Chain Mainnet',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: ['https://bsc-dataseed1.binance.org'],
  blockExplorerUrls: ['https://bscscan.com'],
}

export const POLYGON_MAINNET = {
  chainId: '0x89',
  chainName: 'Polygon Mainnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: ['https://polygon-rpc.com/'],
  blockExplorerUrls: ['https://polygonscan.com'],
}

export const POLYGON_TESTNET = {
  chainId: '0x13881',
  chainName: 'Mumbai',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: ['https://rpc-mumbai.matic.today'],
  blockExplorerUrls: ['https://mumbai.polygonscan.com'],
}

export const BSC_CHAINS = [BINANCE_MAINNET.chainId, BINANCE_TESTNET.chainId]
export const POLYGON_CHAINS = [POLYGON_MAINNET.chainId, POLYGON_TESTNET.chainId]

export const DBUSD_TOKEN = {
  address: '0xdf1ae3ecff4e32431e9010b04c36e901f7ed388b',
  symbol: 'DBUSD',
  decimals: 18,
  image: ''
}

export const BUSD_TOKEN = {
  address: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
  symbol: 'BUSD',
  decimals: 18,
  image: ''
}

export const DUSDC_TOKEN = {
  address: '0x6519cb1F694CcBCc72417570b364F2D051EEfb9d',
  symbol: 'DUSDC',
  decimals: 18,
  image: ''
}

export const USDC_TOKEN = {
  address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  symbol: 'USDC',
  decimals: 6,
  image: ''
}

export const adminLinks = [
  {
    label: 'Invites',
    url: '/admin/invites'
  },
  {
    label: 'User Management',
    url: '/admin/user-management'
  },
  {
    label: 'Listings Management',
    url: '/admin/listings'
  },
  {
    label: 'Transactions Management',
    url: '/admin/transactions'
  }
]

export const HOST_NAME = 'https://nft.homejab.com'