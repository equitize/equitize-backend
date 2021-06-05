const util = require('util');
const gc = require('../index');
const crypto = require("crypto");
const bucket = gc.bucket('equitize-cloud-storage');
const { format } = util;


// const uploadImage = (file) => new Promise((resolve, reject) => {
//   try {
    
//     const { originalname, buffer } = file
//     const id = crypto.randomBytes(20).toString('hex') + '.jpeg';
//     const blob = bucket.file(id)
//     const blobStream = blob.createWriteStream({
//       resumable: false, // recommended for files less than 10 mb.
//       // public: true
//     })

//     blobStream.on('finish', () => {
//       const publicUrl = format(
//         `https://storage.googleapis.com/${bucket.name}/${blob.name}`
//       )  
//       resolve(publicUrl)
//     })
//     .on('error', (err) => {
//       console.log(err)
//       reject(`Unable to upload image, something went wrong`)
//     })
//     .end(buffer)
//   } catch (err) {
    
//     console.log(err)
//   }
// });


// const getSignedURL = async (identifier) => {
//   try {
//     const bucketName = 'equitize-cloud-storage';
//     const fileName = identifier;
//     // const id = crypto.randomBytes(20).toString('hex') + '.jpeg';

//     const options = {
//       version: 'v4',
//       action: 'read',
//       expires: Date.now() + 15 * 60 * 1000, // 15 minutes
//     };
//     const [url] = await gc
//     .bucket(bucketName)
//     .file(identifier)
//     .getSignedUrl(options);
//     return {
//       message : url
//     }
//   } catch (err) {
//     console.log(err)
//   }
// }

module.exports = {
  uploadImage : function (file) {
    return new Promise((resolve, reject) => {
    try {
      const { originalname, buffer } = file
      const id = crypto.randomBytes(20).toString('hex') + '.jpeg';
      const blob = bucket.file(id)
      const blobStream = blob.createWriteStream({
        resumable: false, // recommended for files less than 10 mb.
        // public: true
      })
  
      blobStream.on('finish', () => {
        const publicUrl = format(
          `Stored ${blob.name} in ${bucket.name}`
        )  
        resolve(publicUrl)
      })
      .on('error', (err) => {
        console.log(err)
        reject(`Unable to upload image, something went wrong`)
      })
      .end(buffer)
    } catch (err) {
      
      console.log(err)
    }
  });
}
}

// module.exports = { 
//   uploadImage, getSignedURL }
// module.exports = getSignedURL

