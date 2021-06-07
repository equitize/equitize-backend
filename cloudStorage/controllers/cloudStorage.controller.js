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
    console.log(data)
    req.body = {
      "pitchDeck": data
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