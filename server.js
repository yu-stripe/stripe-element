const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
var cors = require('cors');

const path = require('path');

console.log(process.env.PAYPAY_SECRET_KEY)
router.use(cors());
const paypayKey = process.env.PAYPAY_SECRET_KEY

const PAYPAY = require('@paypayopa/paypayopa-sdk-node');
const uuid = require('uuid');
PAYPAY.Configure({
  clientId: 'a_yeMLLbTuuy_EZNl',
  clientSecret: paypayKey,
  merchantId: "689533420559024128",
  productionMode: false
});

router.post('/create-payment-intent', async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 19140,
    currency: 'jpy',
    statement_descriptor: 'My Store',
    confirm: false,
    payment_method_types: ['card']
  });

  res.json({
    clientSecret: paymentIntent.client_secret
  });
});

router.post('/api/create-paypay', async (req, res, next) => {
  console.log(req.body);

  const paymentId = uuid.v4();
  const payload = {
    merchantPaymentId: paymentId,
    amount: { "amount": 19140, "currency": "JPY" },
    codeType: 'ORDER_QR',
    orderItems: null,
    redirectUrl: 'https://stripe-element.onrender.com/',
    redirectType: 'WEB_LINK',
  };
  console.log(payload);

  PAYPAY.QRCodeCreate(payload, (ppResonse) => {
    const body = ppResonse.BODY;
    console.log(JSON.stringify(ppResonse));
    console.log(ppResonse.STATUS, body.data);
    console.log(body.data.url);
    res.send({ url: body.data.url});
  });


});

//module.exports = router;
const app = express();

app.use('/', router);
app.use(express.static(path.join(__dirname, './public')));

// port where app is served
app.listen(3000, () => {
    console.log('The web server has started on http://localhost:3000');
});
