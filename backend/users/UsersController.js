const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('./User')

const router = express.Router()

router.get('/users', (req, res) => {
    User
        .findAll({
            attributes: [
                'id',
                'name',
                'email'
            ]
        })
        .then(users => {
            if (users.length) {
                res.statusCode = 200
                res.json(users)
            } else {
                res.sendStatus(404)
            }
        })
        .catch(err => {
            console.log(`[ERR] FIND ALL USERS: ${err}`)
            res.sendStatus(500)
        })
})

router.get('/user/:id', (req, res) => {
    const id = parseInt(req.params.id)

    if (!isNaN(id)) {
        User
            .findByPk(id, {
                attributes: [
                    'id',
                    'name',
                    'email'
                ]
            })
            .then(user => {
                if (user) {
                    res.statusCode = 200
                    res.json(user)
                } else {
                    res.sendStatus(404)
                }
            })
            .catch(err => {
                console.log('[ERR] FIND ESPECIFIC USER:', err)
                res.sendStatus(500)
            })
    } else {
        res.sendStatus(400)
    }
})

router.post('/user', (req, res) => {
    const {name, email, password} = req.body

    if (name, email, password) {
        User
            .findOne({
                where: {
                    email: email
                }
            })
            .then(user => {
                if (!user) {
                    let salt = bcrypt.genSaltSync(10)
                    let hash = bcrypt.hashSync(password, salt)

                    User
                        .create({
                            name: name,
                            email: email,
                            password: hash
                        })
                        .then(_ => {
                            res.sendStatus(201)
                        })
                        .catch(err => {
                            console.log('[ERR] DEFINE USER:', err)
                            res.sendStatus(500)
                        })
                } else {
                    res.sendStatus(422)
                }
            })
            .catch(err => {
                console.log(`[ERR] FIND USER TO DEFINE; ${err}`)
                res.sendStatus(500)
            })
    } else {
        res.sendStatus(400)
    }
})

router.put('/user/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    
    if (!isNaN(id)) {
        if (name || email || password) {
            try {
                let userById = await User.findByPk(id)
    
                if (userById) {
                    if (email) {
                        let emailExistence = await User.findOne({
                            where: {
                                email: email
                            }
                        })
    
                        if (!emailExistence) {
                            User.update({
                                email: email
                            }, {
                                where: {
                                    id: id
                                }
                            })
                        } else {
                            throw 'email_existence_excepcion'
                        }
                    }
                    if (name) {
                        User.update({
                            name: name
                        }, {
                            where: {
                                id: id
                            }
                        })
                    }
                    if (password) {
                        let salt = bcrypt.genSaltSync(10)
                        let hash = bcrypt.hashSync(password, salt)
    
                        User.update({
                            password: hash
                        }, {
                            where: {
                                id: id
                            }
                        })
                    }
    
                    res.sendStatus(200)
                } else {
                    res.sendStatus(404)
                }
            } catch (err) {
                if (err === 'email_existence_excepcion') {
                    console.log(`[ERR] USER UPDATE: ${err}`)
                    res.sendStatus(422)
                } else {
                    console.log(`[ERR] USER UPDATE: ${err}`)
                    res.sendStatus(500)
                }
            }
        }
    } else {
        res.sendStatus(400)
    }
})

router.delete("/user/:id", (req, res) => {
    const id = parseInt(req.params.id)

    if (!isNaN(id)) {
        User
            .findByPk(id)
            .then(user => {
                if (user) {
                    User
                        .destroy({where: {
                            id: id
                        }})
                        .then(_ => {
                            res.sendStatus(200)
                        })
                        .catch(err => {
                            console.log(`[ERR] DELETE USER: ${err}`)
                            res.sendStatus(500)
                        })
                } else {
                    res.sendStatus(404)
                }
            })
    } else {
        res.sendStatus(400)
    }
})

module.exports = router