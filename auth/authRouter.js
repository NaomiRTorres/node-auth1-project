const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/usersModel.js');

router.post('/register', (req, res) => {
    let user = req.body;

    const rounds = process.env.HASH_ROUNDS || 8;

    const hash = bcrypt.hashSync(user.password, rounds);

    user.password = hash;

    Users.add(user)
    .then(saved => {
        res.status(201).json(saved);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            errorMessage: error.message
        });
    });
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
    .then(([found]) => {
        if(found && bcrypt.compareSync(password, found.password)) {
            req.session.loggedIn = true;
            res.status(200).json({
                message: 'Welcome'
            });
        } else {
            res.status(401).json({
                message: 'You will not pass'
            });
        };
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            errorMessage: error.message
        });
    });
});

module.exports = router;