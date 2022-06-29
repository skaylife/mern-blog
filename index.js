import express from 'express';
import multer from 'multer';

import mongoose from 'mongoose';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import { checkAuth, handleValidationErrors } from './utils/index.js';

import { UserController, PostController } from './controllers/index.js'

 


mongoose
    .connect('mongodb+srv://admin:wwwwww@cluster0.pxrfoce.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

// Создание хранилища
const storage = multer.diskStorage({
    // Достаем путь зугруженного файла 
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    // Записываем оригинальное имя файла
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
})

// Указание куда нужно сохранять
const upload = multer({ storage });

// Использование json формата даннных
app.use(express.json());

//Проверка и вывод информации из папки uploads
app.use('/uploads/', express.static('uploads'));

// Авторизация
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);

// Регистрация 
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);

// Информация о нас
app.get('/auth/me',checkAuth, UserController.getMe);

// Роуты формата CRUD 
// - Создание поста (create)
// - Просмотр поста(ов)
// - Обновление поста
// - Удаление поста
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts',checkAuth, postCreateValidation, PostController.create);
app.patch('/posts/:id', checkAuth, PostController.update);
app.delete('/posts/:id', checkAuth, postCreateValidation, PostController.remove);

// Загрузка поста
app.post('/upload',checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
});


app.listen(4444, (err) => {
    if(err) {
        return console.log(err);
    }

    console.log('Server OK');
});