const CloudStorageService = require("../services/cloudStorage.service");

// middleware to upload video
// get identifier & pass to next middleware
exports.uploadVideo = async (req, res, next) => {
    const video = req.file;
    const { originalname, buffer } = video;
    console.log(originalname)
    const data = await CloudStorageService.uploadVideo(video);
    req.body = {
      "videoCloudID": data,
      "videoOriginalName": originalname
    }
    next();
};

// middleware to upload pitchdeck
// get identifer & pass to next middleware
exports.uploadPitchDeck = async (req, res, next) => {
    const pitchDeck = req.file;
    const { originalname, buffer } = pitchDeck;
    const data = await CloudStorageService.uploadPitchDeck(pitchDeck);
    
    req.body = {
      "pitchDeckCloudID": data,
      "pitchDeckOriginalName": originalname
    }
    next();
};

exports.uploadCapTable = async (req, res, next) => {
    const capTable = req.file;
    const data = await CloudStorageService.uploadCapTable(capTable);
    
    req.body = {
      "capTable": data
    }
    next();
};

exports.uploadAcraDocuments = async (req, res, next) => {
  const acraDocuments = req.file;
  const data = await CloudStorageService.uploadAcraDocuments(acraDocuments);
  
  req.body = {
    "acraDocuments": data
  }
  next();
};

exports.uploadBankInfo = async (req, res, next) => {
  const bankInfo = req.file;
  const data = await CloudStorageService.uploadBankInfo(bankInfo);
  
  req.body = {
    "bankInfo": data
  }
  next();
};

exports.uploadIdProof = async (req, res, next) => {
  const idProof = req.file;
  const data = await CloudStorageService.uploadIdProof(idProof);
  
  req.body = {
    "idProof": data
  }
  next();
};

exports.uploadProfilePhoto = async (req, res, next) => {
  const profilePhoto = req.file;
  const data = await CloudStorageService.uploadProfilePhoto(profilePhoto);
  
  req.body = {
    "profilePhoto": data
  }
  next();
};

// gets signedURL of requested filetype and send back original name
exports.getSignedUrlWithName = async (req, res, next) => {
    try {
        const identifier = req.body.cloudItemIdentifier
        const originalFileName = req.body.originalFileName
        const signedURL = await CloudStorageService.getSignedURL(identifier)
        res.send(
          {
            "originalName": originalFileName,
            "signedURL": signedURL
          })
    } catch (error) {
        next(error)
    }
}

// gets signedURL of requested filetype without sending back original name
exports.getSignedURL = async (req, res, next) => {
  try {
      const identifier = req.body.fileType
      const signedURL = await CloudStorageService.getSignedURL(identifier)
      res.send(
        {
          "signedURL": signedURL
        })
  } catch (error) {
      next(error)
  }
}