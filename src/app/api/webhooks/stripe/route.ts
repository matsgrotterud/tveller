import { NextResponse } from "next/server";

/**
 * Stripe webhook-endepunkt (plassholder).
 *
 * Når STRIPE_SECRET_KEY og STRIPE_WEBHOOK_SECRET er satt:
 * 1. Verifiser signaturen med stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET)
 * 2. Håndter hendelsene under og oppdater abonnementsstatus i databasen.
 *
 * Håndterte hendelser:
 * - checkout.session.completed     → opprett/aktiver abonnement
 * - customer.subscription.created  → lagre stripe_subscription_id
 * - customer.subscription.updated  → oppdater plan/status (trial, active, past_due, canceled)
 * - customer.subscription.deleted  → marker som churned
 * - invoice.paid                   → marker faktura betalt
 * - invoice.payment_failed         → sett status past_due + varsle kunde
 */
const HANDLED_EVENTS = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.paid",
  "invoice.payment_failed",
];

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    // Demo-modus: kvitter OK slik at Stripe CLI-testing ikke feiler, men gjør ingenting.
    return NextResponse.json({ received: true, mode: "mock", handled_events: HANDLED_EVENTS });
  }

  if (!signature) {
    return NextResponse.json({ error: "Mangler stripe-signature-header" }, { status: 400 });
  }

  // TODO når Stripe kobles til:
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  // const event = stripe.webhooks.constructEvent(await request.text(), signature, process.env.STRIPE_WEBHOOK_SECRET);
  // switch (event.type) { ... }

  return NextResponse.json({ received: true });
}
