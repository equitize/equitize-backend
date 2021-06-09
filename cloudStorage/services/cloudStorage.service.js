const crypto = require("crypto");
const gc = require("../index");
let bucket;
let bucketName;
if (process.env.NODE_ENV==="dev") {
  bucket = gc.bucket('equitize-cloud-storage-dev');
  bucketName = 'equitize-cloud-storage-dev';
}
else if (process.env.NODE_ENV==="prod") {
  bucket = gc.bucket('equitize-cloud-storage');
  bucketName = 'equitize-cloud-storage-dev';
} else {
  bucket = gc.bucket('equitize-cloud-storage');
  bucketName = 'equitize-cloud-storage-dev';
}


module.exports = {
  uploadPitchDeck : function (pitchDeck) {
    return new Promise((resolve, reject) => {
      try {
        const { originalname, buffer } = pitchDeck
        const fileExt = originalname.split(".")[1]
        const id = crypto.randomBytes(20).toString("hex") + "." + fileExt;
        
        const blob = bucket.file(id)
        const blobStream = blob.createWriteStream({
          resumable: false, // recommended for files less than 10 mb.
          // public: true
        });
    
        blobStream.on('finish', () => {
          const publicUrl = `${blob.name}`
          resolve(publicUrl)
        })
        .on('error', (err) => {
          console.log(err)
          reject(`Unable to upload pitchDeck, something went wrong`)
        })
        .end(buffer)
      } catch (err) {
        return err      
      }});
  },
  uploadVideo : function (video) {
    return new Promise((resolve, reject) => {
    try {
      const { originalname, buffer } = video
      const fileExt = originalname.split(".")[1]
      const id = crypto.randomBytes(20).toString("hex") + "." + fileExt;
      
      const blob = bucket.file(id)
      const blobStream = blob.createWriteStream({
        resumable: false, // recommended for files less than 10 mb.
        // public: true
      });
  
      blobStream.on('finish', () => {
        const publicUrl = `${blob.name}`
        resolve(publicUrl)
      })
      .on('error', (err) => {
        console.log(err)
        reject(`Unable to upload video, something went wrong`)
      })
      .end(buffer)
    } catch (err) {
      return err      
    }});
  },
  uploadCapTable : function (capTable) {
    return new Promise((resolve, reject) => {
    try {
      const { originalname, buffer } = capTable
      const fileExt = originalname.split(".")[1]
      const id = crypto.randomBytes(20).toString("hex") + "." + fileExt;
      
      const blob = bucket.file(id)
      const blobStream = blob.createWriteStream({
        resumable: false, // recommended for files less than 10 mb.
        // public: true
      });
  
      blobStream.on('finish', () => {
        const publicUrl = `${blob.name}`
        resolve(publicUrl)
      })
      .on('error', (err) => {
        console.log(err)
        reject(`Unable to upload capTable, something went wrong`)
      })
      .end(buffer)
    } catch (err) {
      return err      
    }});
  },
  uploadAcraDocuments : function (acraDocuments) {
    return new Promise((resolve, reject) => {
    try {
      const { originalname, buffer } = acraDocuments
      const fileExt = originalname.split(".")[1]
      const id = crypto.randomBytes(20).toString("hex") + "." + fileExt;
      
      const blob = bucket.file(id)
      const blobStream = blob.createWriteStream({
        resumable: false, // recommended for files less than 10 mb.
        // public: true
      });
  
      blobStream.on('finish', () => {
        const publicUrl = `${blob.name}`
        resolve(publicUrl)
      })
      .on('error', (err) => {
        console.log(err)
        reject(`Unable to upload acraDocuments, something went wrong`)
      })
      .end(buffer)
    } catch (err) {
      return err      
    }});
  },
  uploadBankInfo : function (bankInfo) {
    return new Promise((resolve, reject) => {
    try {
      const { originalname, buffer } = bankInfo
      const fileExt = originalname.split(".")[1]
      const id = crypto.randomBytes(20).toString("hex") + "." + fileExt;
      
      const blob = bucket.file(id)
      const blobStream = blob.createWriteStream({
        resumable: false, // recommended for files less than 10 mb.
        // public: true
      });
  
      blobStream.on('finish', () => {
        const publicUrl = `${blob.name}`
        resolve(publicUrl)
      })
      .on('error', (err) => {
        console.log(err)
        reject(`Unable to upload bankInfo, something went wrong`)
      })
      .end(buffer)
    } catch (err) {
      return err      
    }});
  },
  uploadIdProof : function (idProof) {
    return new Promise((resolve, reject) => {
    try {
      const { originalname, buffer } = idProof
      const fileExt = originalname.split(".")[1]
      const id = crypto.randomBytes(20).toString("hex") + "." + fileExt;
      
      const blob = bucket.file(id)
      const blobStream = blob.createWriteStream({
        resumable: false, // recommended for files less than 10 mb.
        // public: true
      });
  
      blobStream.on('finish', () => {
        const publicUrl = `${blob.name}`
        resolve(publicUrl)
      })
      .on('error', (err) => {
        console.log(err)
        reject(`Unable to upload idProof, something went wrong`)
      })
      .end(buffer)
    } catch (err) {
      return err      
    }});
  },
  uploadProfilePhoto : function (profilePhoto) {
    return new Promise((resolve, reject) => {
    try {
      const { originalname, buffer } = profilePhoto
      const fileExt = originalname.split(".")[1]
      const id = crypto.randomBytes(20).toString("hex") + "." + fileExt;
      
      const blob = bucket.file(id)
      const blobStream = blob.createWriteStream({
        resumable: false, // recommended for files less than 10 mb.
        // public: true
      });
  
      blobStream.on('finish', () => {
        const publicUrl = `${blob.name}`
        resolve(publicUrl)
      })
      .on('error', (err) => {
        console.log(err)
        reject(`Unable to upload profilePhoto, something went wrong`)
      })
      .end(buffer)
    } catch (err) {
      return err      
    }});
  },
  getSignedURL : async function (identifier) {
    try {
      
      const fileName = identifier;
      // const id = crypto.randomBytes(20).toString('hex') + '.jpeg';
      console.log('here', identifier)
      const options = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      };
      const [url] = await gc
      .bucket(bucketName)
      .file(identifier)
      .getSignedUrl(options);
      return {
        message : url
      }
    } catch (err) {
      console.log(err)
    }
}
}