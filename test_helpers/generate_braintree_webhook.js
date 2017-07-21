'use strict';

const braintree = require('braintree');
const bt = require('../lib/braintree_client');
const fs = require('fs');


const sampleNotification = bt.webhookTesting.sampleNotification(
  braintree.WebhookNotification.Kind.SubscriptionChargedUnsuccessfully,
  '4vdbh6'
);

const signature = encodeURIComponent(sampleNotification.bt_signature);
const payload = encodeURIComponent(sampleNotification.bt_payload);
const body = `bt_signature=${signature}&bt_payload=${payload}`;


console.log(`"${body}"`);
