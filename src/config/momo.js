module.exports = {
  partnerCode: process.env.MOMO_PARTNER_CODE,
  accessKey: process.env.MOMO_ACCESS_KEY,
  secretKey: process.env.MOMO_SECRET_KEY,
  // redirectUrl: process.env.MOMO_REDIRECT_URL,
  // ipnUrl: process.env.MOMO_IPN_URL,

  // redirectUrl: "https://unscanned-apprehensible-leone.ngrok-free.dev/payment/momo/redirect",
  // ipnUrl: "https://unscanned-apprehensible-leone.ngrok-free.dev/payment/momo/ipn",

//sau khi deploy:
// MOMO_REDIRECT_URL=https://api.codenova.vn/payment/momo/redirect
// MOMO_IPN_URL=https://api.codenova.vn/payment/momo/ipn


  ipnUrl: "https://unscanned-apprehensible-leone.ngrok-free.dev/payment/momo/ipn",
  redirectUrl: "http://localhost:5173/payment/result",

  endpoint: "https://test-payment.momo.vn/v2/gateway/api/create"
};
