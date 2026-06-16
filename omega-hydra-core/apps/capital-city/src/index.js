import { listDistricts, getCityPulse } from "./districts.js";
import { listProducts } from "../../../packages/hydra-zeta/src/products.js";
import { logEvent, listEvents, getEventSummary } from "../../../packages/hydra-eyes/src/index.js";

function runCapitalCityDemo() {
  const districts = listDistricts();
  const pulse = getCityPulse();
  const products = listProducts();

  logEvent("capital_city_loaded", pulse);

  for (const district of districts) {
    logEvent("district_rendered", {
      id: district.id,
      name: district.name,
      status: district.status,
      signal: district.signal,
      readiness: district.metrics.readiness
    });
  }

  return {
    app: "Omega Capital City Shell",
    pulse,
    districts,
    marketplaceProducts: products,
    eventSummary: getEventSummary(),
    events: listEvents()
  };
}

console.log(JSON.stringify(runCapitalCityDemo(), null, 2));
