'use strict';

const AWS = require('aws-sdk');
const querystring = require('querystring');
const tableName = process.env.DDB_TABLE;
const docClient = new AWS.DynamoDB.DocumentClient();
const braintreeClient = require('../lib/braintree_client');
const PAST_DUE_LIMIT = 90;

const writeSubscriptionIdToDb = (id) => {
  const recordOptions = {
    TableName: tableName,
    Item: {
      subscription_id: id
    }
  };

  docClient.
    put(recordOptions).
    promise().
    then( () => id ).
    catch( (e) => console.log("DDB ERROR:", e) );
};

const checkSubscription = (id, cb) => {
  braintreeClient.subscription.find(id).
    then(record => {
      const pastDue = record.daysPastDue;
      const id = record.id;

      if(pastDue >= PAST_DUE_LIMIT) {
        writeSubscriptionIdToDb(id);
      }

      cb();
    }).
    catch((err) => {
      console.log(err);
      cb();
    });
};

const parseReq = (body, cb) => {
  braintreeClient.webhookNotification.parse(
    body.bt_signature,
    body.bt_payload,
    (err, notification) => {
      if (err) {
        console.log("ERROR:", JSON.stringify(err));
      } else {
        console.log("NOTIFICATION:", JSON.stringify(notification));
        const subscriptionId = notification.subject.subscription.id;
        checkSubscription(subscriptionId, cb);
      }
    }
  );
};

module.exports.handler = (event, context, callback) => {
  parseReq(
    querystring.parse(event.body),
    () => callback(null, {statusCode: 200})
  )
};
