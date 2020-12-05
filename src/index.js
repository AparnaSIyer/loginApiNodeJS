const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const server = express();
server.use(cookieParser());

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the API'
    });
});

server.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'keysecret', (err, authData) => {
        if (err) {
            console.log('Hi in post');
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created....',
                authData
            });
        }
    });
});
//Login
server.post('/api/login', (req, res) => {
    const user = {
        id: 1,
        username: 'Aparna',
        email: 'aparna@gmail.com'
    };
    jwt.sign({ user }, 'keysecret', { expiresIn: '30s' }, (err, token) => {
        res.json({
            token
        });
    });
});

function verifyToken(req, res, next) {
    //Authorization: Bearer<access_token>
    const bearerHeader = req.headers['authorization'];
    console.log(req.headers['authorization']);
    if (typeof bearerHeader !== 'undefined') {
        console.log('In middleware');
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        //Calling next() middleware
        next();
    } else {
        console.log('Forbidden In middleware');
        res.sendStatus(403);
    }
}
server.listen(5000, () => console.log('Server running'));

//Logout
