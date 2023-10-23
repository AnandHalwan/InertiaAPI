const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3000; 


const {firebaseApp} = require("./firebase.js");
const firebaseAuth = require('firebase/auth');
const firestore = require('firebase/firestore');

const auth = firebaseAuth.getAuth(firebaseApp);
const db = firestore.getFirestore(firebaseApp);

const {dbAdmin, authAdmin} = require('./firebaseAdmin.js')

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.post('/auth/signup', async (req, res) => {
    try {
      const {email, password} = req.body
  
      const userRecord = await authAdmin.createUser({
        email,
        password,
      });
  
      let userRef = dbAdmin.collection('User').doc(userRecord.uid)
      await userRef.create({
        userId: userRecord.uid,
        setup: false
      })
  
      res.status(200).json(userRecord.uid);
      
    } catch (error) {
      res.status(500).json({error: 'Unable to create user'})
    }
  })

  

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });