import {getConfig} from "../../app-config";
import createContract from "./contractBody";

const abi = require('/public/abi.json')
const busd = require('/public/busd.json')

const HOMEJAB_ADDRESS_BSC = getConfig().BSC_CONTRACT_ADDRESS
const TOKEN_ADDRESS_BSC = getConfig().BSC_TOKEN_ADDRESS

const HOMEJAB_ADDRESS_POLYGON = getConfig().POLYGON_CONTRACT_ADDRESS
const TOKEN_ADDRESS_POLYGON = getConfig().POLYGON_TOKEN_ADDRESS

const POLYGON_GAS_PRICE = '40000000000' // 40 Gwei

const HOMEJAB_BSC = new window.web3App.eth.Contract(
  abi,
  HOMEJAB_ADDRESS_BSC);
const TOKEN_BSC = new window.web3App.eth.Contract(
  busd,
  TOKEN_ADDRESS_BSC);

const HOMEJAB_POLYGON = new window.web3App.eth.Contract(
  abi,
  HOMEJAB_ADDRESS_POLYGON,
  {
    gasPrice: POLYGON_GAS_PRICE
  });
const TOKEN_POLYGON = new window.web3App.eth.Contract(
  busd,
  TOKEN_ADDRESS_POLYGON,
  {
    gasPrice: POLYGON_GAS_PRICE
  });

const polygonWeiUnit = process.env.NEXT_PUBLIC_APP_ENV === 'prod' ? 'mwei' : 'ether'

const contractApi = {
  polygon: createContract(HOMEJAB_POLYGON, TOKEN_POLYGON, HOMEJAB_ADDRESS_POLYGON, polygonWeiUnit),
  binance_smart_chain: createContract(HOMEJAB_BSC, TOKEN_BSC, HOMEJAB_ADDRESS_BSC)
}

module.exports = contractApi

