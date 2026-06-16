import { listProducts } from "../../../packages/hydra-zeta/src/products.js";
import { logEvent, listEvents, getEventSummary } from "../../../packages/hydra-eyes/src/index.js";

function runMarketplaceDemo() {
  const products = listProducts();

  for (const product of products) {
    logEvent("product_viewed", {
      sku: product.sku,
      name: product.name,
      price: product.price,
      district: product.district
    });
  }

  return {
    marketplace: "Hydra Zeta Marketplace",
    products,
    eventSummary: getEventSummary(),
    events: listEvents()
  };
}

console.log(JSON.stringify(runMarketplaceDemo(), null, 2));
