'use strict';

const bt = require('../lib/braintree_client');

module.exports.handler = (event, context, callback) => {
  const handleResponse = (err, result) => {
    if(err){
      console.log("Braintree::Subscription::Cancel::Error", JSON.stringify(result));
      callback(err.type);
    } else {
      callback(null, result);
    }
  };

  const handleRecord = (record) => {
    let subscription_id = record.dynamodb.Keys.subscription_id.S;
    bt.subscription.cancel(subscription_id, handleResponse);
  };

  event.Records.forEach(handleRecord);
};
