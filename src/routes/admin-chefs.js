const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')
const { onlyUsers } = require('../app/middlewares/session')

const chefs = require('../app/controllers/chefs')

routes.get('/', onlyUsers, chefs.index)
routes.get('/create', onlyUsers, chefs.create)
routes.get('/:id', onlyUsers, chefs.show)
routes.get('/:id/edit', onlyUsers, chefs.edit)

routes.post('/', multer.array('photos', 1), chefs.post)
routes.put('/', multer.array('photos', 1), chefs.put)
routes.delete('/', chefs.delete)

module.exports = routes