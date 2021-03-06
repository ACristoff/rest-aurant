import React, { useEffect, useState, useContext } from "react";
import axios from "axios";

//Table status API patch request, receipt creation API request
import { updateTableStatus } from "../api";
import { createReceipt } from '../actions/receipts'

//Dispatch and selector
import { useSelector, useDispatch } from "react-redux";

//Order context
import { orderContext } from "../providers/OrderProvider";

//Stripe API
import { CardElement, CardNumberElement, PaymentElement } from '@stripe/react-stripe-js';
import { useStripe, useElements } from "@stripe/react-stripe-js";
import Receipt from "./Receipt";
import { Button, Typography } from "@mui/material";
import { updateOrderStatus } from "../actions/orders";




const CheckoutForm = (props) => {

  //our order state
  const { state, setPaid, getOrderId, destroyCookie, resetOrder } = useContext(orderContext);

  //Allows the rendering of stripe API elements
  const stripe = useStripe();
  const elements = useElements();

  const orders = useSelector((state) => state.orders);

  // Allows us to dispatch any action to the store by
  // adding an action as an argument.
  const dispatch = useDispatch();

  //Local state for handling the payment secret
  const [secret, setSecret] = useState(null);
  //Local states for handling payment processing elements
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [receiptID, setReceiptID] = useState(null);

  const handleChange = async (event) => {
    // Listen for changes in the CardElement and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  //Request for payment intent from the API
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    //Changes state so that an element can be rendered during processing
    setProcessing(true);
    const payload = await stripe.confirmCardPayment(secret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });
    //will display an error message if any
    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
      console.log('error occured: ', payload)
    } else {
      //succesful payment logic
      setError(null);
      setProcessing(false);
      setPaid(true);
      console.log('succesful payment: ', payload)
      //uses the built-in API function to send a patch request to our table
      // updateTableStatus(state.table, "PAID")
      console.log(`table ${state.table} changed to PAID`)
      receipt(payload.paymentIntent.amount, payload.paymentIntent.id)
      setSucceeded(true);
      updateOrderStatus(getOrderId(), true);
      destroyCookie();
      // resetOrder();
    }
  };

  const receipt = (amountPaid, confirmationCode) => {
    const amount_paid = parseInt(amountPaid);
    const table = state.table;
    const items = state.order.map((item) => item.item_id);
    const options = state.order;
    const confirmation_code = confirmationCode;
    const order_id = getOrderId()
    console.log('order id is', order_id)
    const receiptData = { amount_paid, table, items, options, confirmation_code, order_id }
    console.log('sending...', receiptData)
    setReceiptID(order_id)
    dispatch(createReceipt(receiptData))
  }

  //Request to the server for payment secret
  useEffect(() => {
    axios.get((`paymentintent/?amount=${props.amount}`)).then(
      (res) => {
        setSecret(res.data.clientSecret)
        console.log(secret)
      }
    ).then(
      console.log(secret)
    )

  },
    //do not remove, ensures that new secret is created whenever transaction total changes to match 
    [props.amount])

  const options = {
    style: {

      base: {
        iconColor: "rgb(16, 179, 173)",
        color: "rgb(6, 82, 158)",
        fontSize: "16px",
        fontFamily: '"Open Sans", sans-serif',
        fontSmoothing: "antialiased"
      }
    }
  }

  const paymentStyle = {
    width: '90%'
  }

  return (
    <div class="receipt-container">
      <form id="payment-form" onSubmit={handleSubmit}>
        {!succeeded && (
          <div className="payment-input" style={paymentStyle}>
            <CardElement id="card-element" onChange={handleChange} options={options} />

            <Button disabled={processing || disabled || succeeded} variant="contained" id="submit" type="submit">{processing ? "Processing.." : "Pay"}</Button>
          </div>
        )}

        {error && (
          <div className="card-error" role="alert">{error}</div>
        )}
        {succeeded && (
          <div className={succeeded ? "result-message" : "result-message hidden"}><Typography>Payment succeeded!</Typography></div>
        )}
      </form>
      {succeeded && (
        <Receipt receiptOrderId={receiptID} />
      )}
    </div>

  )

}

export default CheckoutForm;