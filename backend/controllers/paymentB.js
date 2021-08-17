 
const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "4yxxh6npm3bmyw6h",
  publicKey: "sq8gcd8t3krphf9g",
  privateKey: "37ebf15413ad30e52029182ca503f407"
});


exports.getToken = (req, res) => {
    gateway.clientToken.generate({}, function(err, response) {
      
        if(err){
            res.status(500).send(err);
        } else{
            res.send(response);
        }
      });
}

exports.processPayment = () => {
    let nonceFromTheClient = req.body.paymentMethodNonce

    let amountFromTheClient = req.body.amount;

    gateway.transaction.sale({
      
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
      },
      function(err, result) {
          if(err){
              res.status(500).json(error)
          } else{
              res.json(result);
          }
      }
      ).then(result => {}); 
}
