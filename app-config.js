import {BINANCE_TESTNET, DBUSD_TOKEN} from "./fixtures";

export function getConfig() {
  if (process.env.NEXT_PUBLIC_APP_ENV === 'prod')
    return {

    }

  return {
    API_URL: process.env.NEXT_PUBLIC_API_URL_DEV,
    ETHEREUM_NETWORK: BINANCE_TESTNET,
    ETHEREUM_TOKEN: DBUSD_TOKEN,
  }
}