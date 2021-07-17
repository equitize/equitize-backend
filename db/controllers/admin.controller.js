module.exports = {
    addKYCverifyFlag : (req, res, next) => {
        try {
            req.body.KYCverify = true;
            next();
        } catch (error) {
            next(error);
        }
    },
    checkKYCverification : (req, res, next) => {
        try {
            if (req.body.KYCverify && req.body.addPermsFlag && req.body.removePermsFlag) res.status(200).send({
                message: `Succesfully updated KYC status of ${req.body.email}`
            })
        } catch (error) {
            next(error);
        }
    },
}