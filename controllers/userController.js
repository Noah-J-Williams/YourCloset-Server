const knex = require('knex')(require('../knexfile').development);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const register = (req, res) => {
    const { username, email, password } = req.body;
    

    if(!email || !emailRegex.test(email) || !password) {
        return res.status(400).send("Please enter a valid email and password");
    }

    bcrypt.hash(password, 10, function(err, hash) {
        if(err){
            return res.status(400).send("Error in password hashing, password may be too long");
        }

        knex('user')
            .insert({username, email, password: hash})
            .then(() => {
                res.status(201).send("Successfully registered");
            })
            .catch((err) => {
                console.log(err);
                res.status(400).send("Failed to register");
            });
    });
};

//Login a employee
//expected body: { email, password }
const login = (req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).send("Please enter a valid email and password");
    }

    knex('user')
        .where({email: email})
        .first()
        .then((user) => {
            const checkPassword = bcrypt.compareSync(password, user.password);

            if(!checkPassword) {
                return res.status(400).send("Invalid password");
            }

            const token = jwt.sign(
                {id: user.id, email: user.email},
                process.env.JWT_KEY,
                { expiresIn: "24h" }
            );

            res.json({ token });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send("Invalid credentials");
        });
};

const addClothes = (req, res) => {
    const { cost, title } = req.body;
    const { id } = req.user;

    knex('clothes')
        .insert({user_id: id, cost: cost, title: title})
        .then(() => {
            res.status(200).send("New clothing item added");
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send("Error adding clothing item");
        });
};

const getClothes = (req, res) => {
    const { id } = req.user;

    knex('user')
        .where({id: id})
        .join('clothes', 'clothes.user_id', '=', 'user.id')
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send("Error retrieving your clothes");
        });
};

const incrementWear = (req, res) => {
    const { id } = req.user;
    const clothingId = req.body.clothingId;

    knex('clothes')
        .where({
            id: clothingId,
            user_id: id
        })
        .increment({wears: 1})
        .then(() => {
            res.status(200).send("Added one wear");
        })
        .catch((err) => {
            console.log(err);
            res.status(200).send("Error adding a wear");
        });
};

const decrementWear = (req, res) => {
    const { id } = req.user;
    const clothingId = req.body.clothingId;

    knex('clothes')
        .where({
            id: clothingId,
            user_id: id
        })
        .decrement({wears: 1})
        .then(() => {
            res.status(200).send("Removed one wear");
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send("Error removing a wear");
        });
};
module.exports = {
    login, 
    register,
    addClothes,
    getClothes,
    incrementWear,
    decrementWear
}