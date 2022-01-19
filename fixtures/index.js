export const questions = [
  {
    title: 'What makes a HomeJab Real NFT unique?',
    content: 'HomeJab Real is the first and only NFT marketplace designed specifically for the real estate community. It not only protects the work of real estate photographers nationwide, it provides a digital footprint for each and every listing agent and homeowner nationwide.'
  },
  {
    title: 'What are the gas fees on HomeJab Real?',
    content: 'Gas fees are paid in BNB. Currently, BNB gas fees are around 0.0007 to 0.0010 BNB which equates to roughly $1.80 per transaction.'
  },
  {
    title: 'What are the royalties of minting on HomeJab Real?',
    content: 'Payment is received in BUSD. And, you can set your fees anywhere between 0 - 10%.'
  },
  {
    title: 'What are transaction fees on HomeJab Real?',
    content: 'Real receives a 4% base transaction fee for each NFT sale.'
  },
  {
    title: 'Are there any added benefits of minting on HomeJab Real?',
    content: 'Yes, In addition to your royalty fees, HomeJab Real artists can obtain REAL tokens which will lower the transaction fees on their NFT sales.'
  },
  {
    title: 'How do HomeJab Real Artists obtain REAL tokens?',
    content: 'In addition to purchasing REAL tokens, artists will be gifted REAL tokens for minting NFTs. The greater the volume, the greater the reward.'
  },
  {
    title: 'Where can I view my collection of HomeJab Real NFTs?',
    content: 'In addition to the HomeJab Real marketplace, all of your HomeJab Real NFTs are stored in your MetaMask wallet until they sell of course!'
  },
  {
    title: 'If I have more questions, how can I contact HomeJab Real?',
    content: 'For additional information, please email us at real@homejab.com.'
  },
]

export const blockchainOptions = [
  {
    label: 'Binance Smart Chain',
    value: 'binance_smart_chain'
  },
]

export const scheduleOptions = [
  {
    label: 'In 1 day',
    value: '1'
  },
  {
    label: 'In 2 days',
    value: '2'
  },
  {
    label: 'In 3 days',
    value: '3'
  },
  {
    label: 'In 4 days',
    value: '4'
  },
]
export const durationOptions = [
  {
    label: '1 day',
    value: '1'
  },
  {
    label: '2 days',
    value: '2'
  },
  {
    label: '3 days',
    value: '3'
  },
  {
    label: '4 days',
    value: '4'
  },
  {
    label: '5 days',
    value: '5'
  },
  {
    label: '6 days',
    value: '6'
  },
  {
    label: '7 days',
    value: '7'
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

export const DBUSD_TOKEN = {
  address: '0xdf1ae3ecff4e32431e9010b04c36e901f7ed388b',
  symbol: 'DBUSD',
  decimals: 18,
  image: ''
}

export const BUSD_TOKEN = {
  address: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
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

export const HOST_NAME = 'https://nft-homejab.netlify.app'