const jwt = require("jsonwebtoken");

const generateJWT = (creditcard, secret) => {
  return new Promise((resolve, reject) => {
    const payload = { creditcard };

    jwt.sign(
      payload,
      secret,
      {
        expiresIn: "2h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("Failed to generate token");
        }

        resolve(token);
      }
    );
  });
};

const decodeJWT = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        console.log(err);
        reject("Failed to decode token");
      }
      resolve(decoded);
    });
  });
};

module.exports = {
  generateJWT,
  decodeJWT,
};
