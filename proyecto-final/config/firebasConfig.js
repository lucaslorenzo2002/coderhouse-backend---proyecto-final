var admin = require('firebase-admin');
const fs = require('fs')

var serviceAccount = JSON.parse(fs.readFileSync('./config/proyecto-final-backend-d398f-firebase-adminsdk-vd7fu-7488a0d642.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log('firebase conectado');

const db = admin.firestore(); 


module.exports = db