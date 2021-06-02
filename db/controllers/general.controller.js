module.exports = {
    documents: function (req, res, next) {
        try {
            console.log('[DEV] : Get General Documents API reached')
        } catch (error){
            next(error)
        };
    }

}