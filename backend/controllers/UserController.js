import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';

export const register = async (req, res) => {
    try { 
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
};

export const login =  async (req, res) => {
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
};

export const getMe = async (req, res) => {
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
};