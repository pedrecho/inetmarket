const Router = require('express')
const router = Router()
const brandController = require('../controllers/brandController')
const checkRole = require('../middleware/checkRoleMiddleware')


router.post('/', checkRole('ADMIN'), brandController.create)
router.get('/', brandController.getAll)


module.exports = router