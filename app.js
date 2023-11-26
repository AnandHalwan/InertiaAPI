const express = require('express');
const bodyParser = require('body-parser');

const app = express();
var cors = require('cors')
app.use(cors());

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
  
      res.status(200).json({
        "userId": userRecord.uid
      });
      
    } catch (error) {
      res.status(500).json({
        error: 'Unable to create user'
      })
    }
  })

  app.get('/auth/signin', async (req, res) => {
    try {
      const {email, password} = req.body
      console.log("Email: ", email)
      console.log("Password: ", password)
      const userRecord = await firebaseAuth.signInWithEmailAndPassword(auth, email, password)

      console.log("User Id", userRecord.user.uid)
      res.status(200).json({
        "userId": userRecord.user.uid
      })
    } catch (error) {
      console.log("Error signing in: ", error)
      res.status(500).json({
        success: false
      })
    }
  })

  app.get('/split/get', async(req, res) => {
    try {
      console.log("Retrieving split")
      
      const {userId, splitId} = req.query;
      console.log("UserId: ", userId)
      console.log("SplitId: ", splitId)
      
      splitRef = dbAdmin.collection("User").doc(userId).collection("Splits");

      const snapshot = await splitRef.get();

      const splits = []
      snapshot.forEach((doc) => {
        splits.push(doc.data())
      });
      console.log("Splits: ", splits)
      res.status(200).json({
        success: true,
        message: "Successfully retrieved split",
        splits: splits
      })
    } catch (error) {
      console.log("Error retrieving split: ", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving split"
      })
    }
  })

  app.post('/split/save', async(req, res) => {
    try {
      console.log("Saving split")
      const {userId, splitDocument} = req.body;
      console.log("UserId: ", userId)
      console.log("SplitDocument: ", splitDocument.workouts[0].exercises)
      const splitId = splitDocument["SplitId"]
      console.log("SplitId: ", splitId)

      const splitRef = dbAdmin.collection("User").doc(userId).collection("Splits").doc(splitId);

      splitRef.set(splitDocument)
        .then(function() {
          console.log("Document successfully written!");
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });

      res.status(200).json({
        success: true,
        message: "Successfully saved split"
      })
    } catch (error) {
      console.log("Error saving split: ", error)
      res.status(500).json({
        success: false,
        message: "Unable to save split"
      })
    }
  })


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });