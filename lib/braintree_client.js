'use strict';

const braintree = require("braintree");

const braintreeClient = braintree.connect({
  environment: braintree.Environment[process.env.BT_ENV],
  merchantId: process.env.BT_MERCHANT_ID,
  publicKey: process.env.BT_PUBLIC_KEY,
  privateKey: process.env.BT_PRIVATE_KEY,
});

module.exports = braintreeClient;
