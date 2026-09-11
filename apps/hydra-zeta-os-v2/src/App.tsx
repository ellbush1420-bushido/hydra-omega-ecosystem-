import products from '../data/products.json';
import router from '../data/router.json';
import config from '../config/zeta.config.json';

type Product = { sku: string; name: string; price: string; lane: string; format: string; status: string };
type Lane = { id: string; title: string; purpose: string; audience: string };
const laneById = Object.fromEntries((router.lanes as Lane[]).map((lane) => [lane.id, lane]));

export default function App() {
  const lane = new URLSearchParams(window.location.search).get('lane') || 'delta';
  const selected = laneById[lane] ?? laneById.delta;
  const visible = (products as Product[]).filter((product) => product.lane === selected.id);
  return <main>
    <header><p className="eyebrow">{config.brand.productName}</p><h1>Guardian-first deployment shell</h1><p>Defensive education, consent-based audits, controlled fulfillment.</p></header>
    <nav>{(router.lanes as Lane[]).map((item) => <a className={item.id === selected.id ? 'active' : ''} href={`?lane=${item.id}`} key={item.id}>{item.title}</a>)}</nav>
    <section className="card"><h2>{selected.title}</h2><p>{selected.purpose}</p><small>Primary audience: {selected.audience}</small></section>
    <section><h2>Available products</h2><div className="grid">{visible.map((product) => <article className="card" key={product.sku}><small>{product.sku} · {product.format}</small><h3>{product.name}</h3><p className="price">{product.price}</p><p>{product.status}</p><button disabled>Checkout connection required</button></article>)}</div></section>
    <section className="card"><h2>Immediate client journey</h2><ol><li>Client accepts terms and completes the Guardian Awareness Audit.</li><li>Score and findings are stored with tenant boundaries.</li><li>Prioritized readiness report and tasks are delivered to the client portal.</li><li>Monthly Guardian Watch maintains the relationship.</li></ol></section>
  </main>;
}
