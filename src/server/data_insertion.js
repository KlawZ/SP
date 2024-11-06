import finnhub from "finnhub";
import { query } from "../db/index.js";
const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = "cs4mor9r01qgd1p65p60cs4mor9r01qgd1p65p6g";
const finnhubClient = new finnhub.DefaultApi();

async function updatePrice(symbol) {
  finnhubClient.quote(symbol, async (error, data, response) => {
    if (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      return;
    }

    await query(
      "UPDATE stocks SET current_price = $1, time = NOW() WHERE symbol = $2",
      [data.c, symbol]
    );
  });
}

function updateAll() {
  const stockSymbols = ["AAPL", "GOOGL", "AMZN", "TSLA", "MSFT"];

  stockSymbols.forEach((symbol) => {
    updatePrice(symbol);
  });
}

setInterval(updateAll, 10000);
