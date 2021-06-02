module.exports = {
    uploadVideo : function (video) {
        // TODO : upload video file to CloudStorage
        // TODO : get back live link pointing to this video
        data = {
            "status": 200,
            "message": "Video succesfully uploaded to CloudStorage.",
            "link": "cloudsql-link-video"
        }
        return data
    },
    uploadPitchDeck : function (pitchDeck) {
        // TODO : upload video file to CloudStorage
        // TODO : get back live link pointing to this video
        data = {
            "status": 200,
            "message": "PitchDeck succesfully uploaded to CloudStorage.",
            "link": "cloudsql-link-pitchDeck"
        }
        return data
    }
}