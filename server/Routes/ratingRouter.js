const Router = require('express')
const router = new Router()
const ratingController = require('../controllers/ratingController')
const authMiddleware = require('../middleware/AuthMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.get('/:id', ratingController.getFeedbacks)
router.post('/', authMiddleware, ratingController.addRating)
router.delete('/:id', authMiddleware, checkRole('ADMIN'), ratingController.deleteFeedback)

module.exports = router