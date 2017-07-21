'use strict';

const request = require('request');

module.exports.handler = (event, context, callback) => {
  const handleResponse = (err, resp, body) => {
    if (!err && resp.statusCode == 200) {
      console.log(body)
      callback(null, JSON.stringify(body));
    } else {
      console.log(
        "ActionKit::RecurringOrder::CancelPush::Error",
        JSON.stringify(err),
        JSON.stringify(body)
      );

      callback(err);
    }
  };

  const cancelOnAK = (id) => {
    const ak_user = process.env.AK_USER;
    const ak_password = process.env.AK_PASSWORD;
    const url = `https://${ak_user}:${ak_password}@act.sumofus.org/rest/v1/profilecancelpush/`;
    const body = { canceled_by: 'admin', recurring_id: id };

    const options = {
      headers: {'Content-Type': 'application/json'},
      url: url,
      body: JSON.stringify(body)
    }
    request.post(options, handleResponse);
  };


  const handleRecord = (record) => {
    if(record.eventName !== 'INSERT') return;

    let subscription_id = record.dynamodb.Keys.subscription_id.S;
    cancelOnAK(subscription_id);
  };

  event.Records.forEach(handleRecord);
  callback(null, {message: 'Completed'});
};
