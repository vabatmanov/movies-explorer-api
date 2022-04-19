const router = require('express').Router();
const { updateUserProfile, getUserInfo, logOff } = require('../controllers/users');
const { updateProfileValidation } = require('../middlewares/validations');

router.get('/me', getUserInfo);
router.patch('/me', updateProfileValidation, updateUserProfile);
router.post('/logoff', logOff);

module.exports = router;
