const CloudStorageService = require("../services/cloudStorage.service");

// middleware to upload video
// get identifier & pass to next middleware
exports.uploadVideo = async (req, res, next) => {
    const video = req.file;
    const data = await CloudStorageService.uploadVideo(video);
    req.body = {
      "video": data
    }
    next();
};

// middleware to upload pitchdeck
// get identifer & pass to next middleware
exports.uploadPitchDeck = async (req, res, next) => {
    const pitchDeck = req.file;
    const data = await CloudStorageService.uploadPitchDeck(pitchDeck);
    
    req.body = {
      "pitchDeck": data
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

// gets signedURL of requested filetype
exports.getSignedURL = async (req, res, next) => {
    try {
        const identifier = req.body.cloudItemIdentifier
        const signedURL = await CloudStorageService.getSignedURL(identifier)
        res.send(signedURL)
    } catch (error) {
        next(error)
    }
}