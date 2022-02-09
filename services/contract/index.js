import {getConfig} from "../../app-config";
import createContract from "./contractBody";

const abi = require('/public/abi.json')
const busd = require('/public/busd.json')

const HOMEJAB_ADDRESS_BSC = getConfig().BSC_CONTRACT_ADDRESS
const TOKEN_ADDRESS_BSC = getConfig().BSC_TOKEN_ADDRESS

// const HOMEJAB_ADDRESS_POLYGON = '0xB299cAee17e49c224FaaD30b14775E98964e1B15'
// const TOKEN_ADDRESS_POLYGON = '0x6519cb1F694CcBCc72417570b364F2D051EEfb9d'

const HOMEJAB_ADDRESS_POLYGON = getConfig().POLYGON_CONTRACT_ADDRESS
const TOKEN_ADDRESS_POLYGON = getConfig().POLYGON_TOKEN_ADDRESS

const HOMEJAB_BSC = new window.web3App.eth.Contract(
  abi,
  HOMEJAB_ADDRESS_BSC);
const TOKEN_BSC = new window.web3App.eth.Contract(
  busd,
  TOKEN_ADDRESS_BSC);

const HOMEJAB_POLYGON = new window.web3App.eth.Contract(
  abi,
  HOMEJAB_ADDRESS_POLYGON);
const TOKEN_POLYGON = new window.web3App.eth.Contract(
  busd,
  TOKEN_ADDRESS_POLYGON);

const contractApi = {
  polygon: createContract(HOMEJAB_POLYGON, TOKEN_POLYGON, HOMEJAB_ADDRESS_POLYGON),
  binance_smart_chain: createContract(HOMEJAB_BSC, TOKEN_BSC, HOMEJAB_ADDRESS_BSC)
}

module.exports = contractApi

