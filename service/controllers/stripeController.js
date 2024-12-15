import Payment from "../models/payments.js";
import Stripe from "stripe";
import user from "../models/user.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Payment Intent
export const paymentIntent = async (req, res) => {
  const { amount, currency, bookingId } = req.body;

  if (!amount || !currency || !bookingId) {
    return res.json({
      status: 400,
      message: "Required Parameters are missing",
    });
  }

  try {
    const userId = req.user.id;
    const userMetaData = await user.findOne({ _id: userId });

    try {
      await stripe.customers.retrieve(userId);
    } catch {
      await stripe.customers.create({
        id: userId,
        name: userMetaData.username,
        email: userMetaData.email,
      });
    }

    // Create PaymentIntent in Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // always keep Amount in cents or smaller units (e.g., $10 = 1000)
      currency: currency || "usd",
      payment_method_types: ["card"],
      metadata: { booking: bookingId },
      customer: userId,
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret, // Send this to the frontend
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create payment intent.",
      message: error.message,
    });
  }
};

export const handleWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  try {
    // Construct the event using the raw body and signature
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object.id;

        // Update payment status in database
        await Payment.findOneAndUpdate(
          { paymentIntentId: paymentIntent },
          { status: "success" }
        );
        break;

      case "payment_intent.created":
        const userId = event.data.object.customer;
        const bookingId = event.data.object.metadata.booking;
        const amount = event.data.object.amount;
        const currency = event.data.object.currency;
        const paymentIntentId = event.data.object.id;
        const payment = new Payment({
          userId,
          bookingId,
          amount,
          currency,
          paymentIntentId,
          status: "pending",
        });
        await payment.save();
        break;

      case "payment_intent.payment_failed":
        console.error("Payment failed:", event.data.object.last_payment_error);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).send();
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
