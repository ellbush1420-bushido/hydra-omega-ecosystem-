import { generateIdentity } from "../../../packages/hydra-identity/src/index.js";
import { generateCompanion } from "../../../packages/hydra-companion/src/index.js";
import { generateMission } from "../../../packages/hydra-labyrinth/src/index.js";
import { logEvent, listEvents, getEventSummary } from "../../../packages/hydra-eyes/src/index.js";
import { listProducts } from "../../../packages/hydra-zeta/src/products.js";
import { listDistricts, getCityPulse } from "../../capital-city/src/districts.js";

function runMvpCommandRunner() {
  const identity = generateIdentity({ name: "Demo Operator" });
  logEvent("identity_generated", identity);

  const companion = generateCompanion(identity);
  logEvent("companion_generated", companion);

  const mission = generateMission(identity, companion);
  logEvent("mission_generated", mission);

  const products = listProducts();
  for (const product of products) {
    logEvent("product_loaded", {
      sku: product.sku,
      name: product.name,
      price: product.price,
      district: product.district
    });
  }

  const districts = listDistricts();
  const cityPulse = getCityPulse();
  logEvent("capital_city_loaded", cityPulse);

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
    app: "Omega Hydra Core MVP-01 Command Runner",
    status: "operational-prototype",
    sequence: [
      "Identity Genesis",
      "Companion Generator",
      "Daily Labyrinth Mission",
      "Hydra Eyes Telemetry",
      "Zeta Marketplace Catalog",
      "Omega Capital District Shell"
    ],
    identity,
    companion,
    mission,
    products,
    cityPulse,
    districts,
    eventSummary: getEventSummary(),
    events: listEvents(),
    safetyScope: "lawful defensive education, privacy awareness, digital hygiene, business automation, community service, and readiness training only"
  };
}

console.log(JSON.stringify(runMvpCommandRunner(), null, 2));
