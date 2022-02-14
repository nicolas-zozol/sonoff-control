const axios = require("axios")
const {getLogger} = require('../../logger/logger-factory');
const logger = getLogger("APP");

let values = []

module.exports = function(){
  return values
}

loadData()
setInterval(loadData, 5*60*1000)

async function loadData(){
  try {
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=50&convert=USD', {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_KEY
      },
    });
    const json = response.data;
    values = json.data.map(t=>({price:t.quote.USD.price, symbol:t.symbol}))
    values.push({
      price:values.find(t=>t.symbol === 'BTC').price,
      symbol:'WBTC'}
    )
    values.push({
      price:values.find(t=>t.symbol === 'ETH').price,
      symbol:'WETH'}
    )

  } catch(ex) {
    logger.error(JSON.stringify(ex))
  }
}