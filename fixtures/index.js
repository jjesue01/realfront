export const questions = [
  {
    title: 'What makes a HomeJab NFT unique?',
    content: 'HomeJab is the first and only NFT marketplace designed specifically for the real estate community. It not only protects the work of real estate photographers, it provides true digital ownership of each image bought and sold… protecting all parties involved in the transaction.'
  },
  {
    title: 'What are the gas fees on the HomeJab NFT Marketplace?',
    content: 'Gas fees are paid in BNB. Currently, BNB gas fees are around 0.0007 to 0.0010 BNB which equates to roughly $1.80 per transaction.'
  },
  {
    title: 'What are the transaction fees on the HomeJab NFT Marketplace?',
    content: 'The HomeJab Marketplace takes a 4% base transaction fee for each NFT sale, while the artist receives 96% of the transaction. All fees are received in USDC and BUSD.'
  },
  {
    title: 'Is there a residual fee structure (royalty) for NFT resales?',
    content: 'Yes, with every minted NFT, the original artist can set a royalty fee anywhere between 0 - 10%... which they collect with each resale of that NFT.'
  },
  {
    title: 'Where can I view my collection of HomeJab NFTs?',
    content: 'In addition to the HomeJab NFT Marketplace, all of your HomeJab NFTs are stored in your HomeJab profile and your MetaMask wallet… until they sell of course!'
  },
  {
    title: 'If I have more questions, how can I contact the HomeJab NFT Marketplace?',
    content: 'The HomeJab NFT Marketplace is a division of HomeJab Real Estate Photography. For additional information, please go to homejab.com and contact our support team.'
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

export const BUSD_POLYGON_TOKEN = {
  address: '0xdab529f40e671a1d4bf91361c21bf9f0c9712ab7',
  symbol: 'BUSD',
  decimals: 18,
  image: ''
}

export const adminLinks = [
  {
    label: 'Invites',
    url: '/admin/invites'
  },
]

export const HOST_NAME = 'https://nft.homejab.com'