const firebaseAdmin = require("firebase-admin");
const multer = require('multer');
const path = require('path');

// Initialize Firebase Admin SDK
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(require('../firebase-adminsdk.json')),
  storageBucket: "realtesh-e166d.appspot.com"
});

const bucket = firebaseAdmin.storage().bucket();

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('photos'); // Adjust 'photos' to match your form field name

// Function to upload file to Firebase Storage
const uploadToFirebase = (req, res, next) => {
  // Run multer to handle file uploads
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: "Error handling file upload" });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const uploads = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const blob = bucket.file(`${Date.now()}_${file.originalname}`);
        const blobStream = blob.createWriteStream({
          metadata: {
            contentType: file.mimetype
          }
        });

        blobStream.on('error', err => reject(err));
        blobStream.on('finish', () => {
          blob.makePublic().then(() => {
            resolve(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
          });
        });

        blobStream.end(file.buffer);
      });
    });

    Promise.all(uploads)
      .then(urls => {
        req.uploadedFiles = urls;
        next();
      })
      .catch(error => {
        console.error('Error uploading to Firebase:', error);
        res.status(500).json({ error: 'Error uploading files' });
      });
  });
};

module.exports = uploadToFirebase;