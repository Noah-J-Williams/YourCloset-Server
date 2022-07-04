const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/data', authenticate, userController.getClothes);
router.post('/data', authenticate, userController.addClothes);
router.delete('/data', authenticate, userController.deleteClothes);
router.put('/upWear', authenticate, userController.incrementWear);
router.put('/downWear', authenticate, userController.decrementWear);
module.exports = router;