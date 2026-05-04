# Product Platform Integration (Hydra Revenue Layer)

## Overview
This connects your funnel to real payment platforms (Gumroad / Stan Store / Whop) and feeds revenue back into Hydra.

---

## 1. Core Flow

User clicks → Product Page → Purchase → Redirect → /api/sale

---

## 2. Gumroad Setup

1. Go to Gumroad → Settings → Advanced
2. Set "After Purchase Redirect URL":

https://your-domain.com/api/sale?amount=9&product=prompt_pack&source=web_funnel

---

## 3. Stan Store Setup

1. Open product → Settings
2. Add redirect URL after purchase:

https://your-domain.com/api/sale?amount=9&product=prompt_pack&source=stan_store

---

## 4. Whop Setup

Use webhook:

POST to:
https://your-domain.com/api/sale

Body:
{
  "amount": 9,
  "product": "prompt_pack",
  "source": "whop"
}

---

## 5. Result

Now every purchase logs into Supabase:

- type: sale
- value: amount
- metadata: product + source

---

## 6. Next Step

Connect this to dashboard to visualize:
- revenue per character
- best funnel
- conversion rates

---

Hydra Revenue Layer: ACTIVE
