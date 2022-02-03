import {getConfig} from "../../app-config";
import {BUSD_POLYGON_TOKEN} from "../../fixtures";
import createContract from "./contractBody";

const abi = require('/public/abi.json')
const busd = require('/public/busd.json')

const HOMEJAB_ADDRESS_BSC = getConfig().CONTRACT_ADDRESS
const BUSD_ADDRESS_BSC = getConfig().TOKEN_ADDRESS

const HOMEJAB_ADDRESS_POLYGON = '0xB299cAee17e49c224FaaD30b14775E98964e1B15'
const BUSD_ADDRESS_POLYGON = BUSD_POLYGON_TOKEN.address

const homejab_BSC = new window.web3App.eth.Contract(
  abi,
  HOMEJAB_ADDRESS_BSC);
const BUSD_BSC = new window.web3App.eth.Contract(
  busd,
  BUSD_ADDRESS_BSC);

const homejab_POLYGON = new window.web3App.eth.Contract(
  abi,
  HOMEJAB_ADDRESS_POLYGON);
const BUSD_POLYGON = new window.web3App.eth.Contract(
  busd,
  BUSD_ADDRESS_POLYGON);

const contractApi = {
  polygon: createContract(homejab_POLYGON, BUSD_POLYGON),
  binance_smart_chain: createContract(homejab_BSC, BUSD_BSC)
}

module.exports = contractApi

