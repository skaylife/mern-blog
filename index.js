import express from 'express';

import mongoose from 'mongoose';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import checkAuth from './utils/checkAuth.js';

import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'
 


mongoose
    .connect('mongodb+srv://admin:wwwwww@cluster0.pxrfoce.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());

// Авторизация
app.post('/auth/login',loginValidation, UserController.login);

// Регистрация 
app.post('/auth/register', registerValidation, UserController.register);

// Информация о нас
app.get('/auth/me',checkAuth, UserController.getMe);

app.get('/posts', PostController.getAll);
// app.get('/posts'/:id, PostController.getOne);
app.post('/posts',checkAuth, postCreateValidation, PostController.create);
// app.delete('/posts', PostController.remove);
// app.patch('/posts', PostController.update);


app.listen(4444, (err) => {
    if(err) {
        return console.log(err);
    }

    console.log('Server OK');
});