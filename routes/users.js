const router = require('express').Router();
const { updateUserProfile, getUserInfo } = require('../controllers/users');
const { updateProfileValidation } = require('../middlewares/validations');

router.get('/me', getUserInfo);
router.patch('/me', updateProfileValidation, updateUserProfile);

module.exports = router;
