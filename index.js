import express from 'express';

import mongoose from 'mongoose';

import { registerValidation } from './validations/auth.js';

import checkAuth from './utils/checkAuth.js';

import * as UserController from './controllers/UserController.js'



mongoose
    .connect('mongodb+srv://admin:wwwwww@cluster0.pxrfoce.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());

// Авторизация
app.post('/auth/login', UserController.login);

// Регистрация 
app.post('/auth/register', registerValidation, UserController.register);

// Информация о нас
app.get('/auth/me',checkAuth, UserController.getMe);

app.listen(4444, (err) => {
    if(err) {
        return console.log(err);
    }

    console.log('Server OK');
});