yarn

serverless deploy \
  -s prod \
  --verbose \
  --bt_merchant_id $BT_MERCHANT_ID \
  --bt_public_key $BT_PUBLIC_KEY \
  --bt_private_key $BT_PRIVATE_KEY \
  --bt_env Production \
  --ak_user $AK_USER \
  --ak_password $AK_PASSWORD
