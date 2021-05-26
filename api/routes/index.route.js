const router = require('express').Router();


router.get('/', (req, res, next) => {
    console.log('index page reached')
    res.send('index');
});

module.exports = router