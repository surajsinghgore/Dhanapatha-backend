import Stripe from "stripe";
const stripe = new Stripe(process.env.stipe_secret_key);

export const checkStripeCustomerByEmail = async (email) => {
    console.log(email)
    try {
      const customers = await stripe.customers.list({
        email: email,
        limit: 1,
      });
  
      if (customers.data.length > 0) {
        return {
          success: true,
          customer: customers.data[0],
        };
      } else {
        throw new Error("No customer found with this email");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  export const StripeBalanceFetch = async (accountId) => {
    try {
      const balance = await stripe.balance.retrieve({ stripeAccount: accountId });
      return balance;
    } catch (error) {
      console.error("Error fetching Stripe account balance:", error);
  
      if (error.type === 'StripeInvalidRequestError') {
    
        throw new Error("Invalid account ID provided or the account does not exist.");
      }
  
      if (error.type === 'StripePermissionError') {

        throw new Error("API key does not have access to the specified account. Check your permissions.");
      }

      throw new Error("Failed to fetch balance: " + error.message);
    }
  };