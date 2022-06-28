import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { registerValidation } from './validations/auth.js';
import { validationResult } from 'express-validator';

import UserModel from './models/User.js';
import checkAuth from './utils/checkAuth.js';



mongoose
    .connect('mongodb+srv://admin:wwwwww@cluster0.pxrfoce.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());

app.post('/auth/login', async (req, res) => {
    try {
        // Поиск в базе данных
        const user = await UserModel.findOne({ email:  req.body.email }); 

        // Проверка на случай если пользователь отсутсвует 
        if(!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }

        // Сравнение паролей с хешем на валидность 
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль',
            });
        }

        // Создание Jwt token'a
        const token = jwt.sign({
            _id: user._id, // Зашифрока id - Для фиксации что в token'e есть id.
        }, 
        'secret123', // Щифрока сообщения 
            {
                expiresIn: '30d' // Время жизни токена.
            }
        ); 

        // Деструктуризация для того чтоб не использовать passwordHash
        const {passwordHash, ...userData} = user._doc; 

        // Успешный пуш данных для регистрации 
        res.json({
            ...userData,
            token 
        });

    } catch (err) {
        console.log('Ошибка авторизации: ', err);
        res.status(500).json({
            message: 'Не удалось авторизоваться',
        });
    }
});

app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
           return res.status(400).json(errors.array());
        }
       
        // Создание зашифрованного паролья 
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
       
        // Присвоение doc модели user с названием полей
        const doc = new UserModel({
           email: req.body.email,
           fullName: req.body.fullName,
           avatarUrl: req.body.avatarUrl,
           passwordHash: hash,
        })

       // Сохранение user в базе данных 
        const user = await doc.save();

        // Создание Jwt token'a
        const token = jwt.sign({
            _id: user._id, // Зашифрока id - Для фиксации что в token'e есть id.
        }, 
        'secret123', // Щифрока сообщения 
        {
            expiresIn: '30d' // Время жизни токена.
        }
        ); 

        // Деструктуризация для того чтоб не использовать passwordHash
        const {passwordHash, ...userData} = user._doc; 
       
        // Успешный пуш данных для регистрации 
        res.json({
            ...userData,
            token 
        });
    } catch (err) {
            console.log('Ошибка при регистрации: ', err);
        res.status(500).json({
            message: 'Не удалось зарегистрироваться',
        });
    }   
});

// Информация о нас
app.get('/auth/me',checkAuth, async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if(!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        // Деструктуризация для того чтоб не использовать passwordHash
        const {passwordHash, ...userData} = user._doc; 

        // Успешный пуш данных для регистрации 
        res.json(userData);
    } catch (err) {
        console.log('Ошибка авторизации: ', err);
        res.status(500).json({
            message: 'Нет доступа',
        });
    }
})

app.listen(4444, (err) => {
    if(err) {
        return console.log(err);
    }

    console.log('Server OK');
});