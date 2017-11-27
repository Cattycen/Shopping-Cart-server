
const crypto = require('crypto').randomBytes(256).toString('hex');
module.exports={
    url:'mongodb://localhost:27017/mongo_shopping',
    secret: crypto, // Cryto-created secret
};


