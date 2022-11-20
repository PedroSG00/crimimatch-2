const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('./../models/User.model')
const saltRounds = 10


router.get('/sign-up', (req, res, next) => {
    res.render('auth/sign-up')
});

router.post('/sign-up', (req, res, next) => {

    const { password } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(hashedPassword => User.create({ ...req.body, password: hashedPassword }))
        .then(createdUser => res.redirect('/'))
        .catch(error => next(error))
})

router.get('/log-in', (req, res, next) => {
    res.render('auth/log-in')
})

router.post('/log-in', (req, res, next) => {

    const { email, password } = req.body

    User
        .findOne({ email })
        .then(user => {
            if (!user) {
                res.render('auth/log-in', { errorMessage: 'Email no registrado en la Base de Datos' })
                return
            } else if (bcrypt.compareSync(password, user.password) === false) {
                res.render('auth/log-in', { errorMessage: 'La contraseña es incorrecta' })
                return
            } else {
                req.session.currentUser = user
                res.redirect('/')
            }
        })
        .catch(error => next(error))
})


router.post('/log-out', (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/auth/log-in')
    })
})




module.exports = router;
