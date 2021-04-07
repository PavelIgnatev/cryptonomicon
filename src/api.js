const API_KEY =
  "f8d7a6cd530ec63952005e6ff2137365fcefb142ba3622eb31eae3f3150bcf7e";

const tickersHandlers = new Map();

const loadTicker = () => {
  if (tickersHandlers.size === 0) return;
  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
      ...tickersHandlers.keys(),
    ]}&tsyms=USD&api_key=${API_KEY}`
  )
    .then((r) => r.json())
    .then((rawData) => {
      const updatedPrices = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value.USD])
      );
      Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
        const handlers = tickersHandlers.get(currency) ?? [];
        handlers.forEach((fn) => fn(newPrice));
      });
    });
};

export const subscribeToTickers = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
};

export const unsubscribeToTickers = (ticker) => {
  tickersHandlers.delete(ticker)
};

setInterval(loadTicker, 5000);
window.tickersHandlers = tickersHandlers;
