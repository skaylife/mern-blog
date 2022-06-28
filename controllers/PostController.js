import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
    try {

        // Создание запроса для получения статьи 
        const posts = await PostModel.find().populate('user').exec();

        // Получение статье 
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось вывести статьи',
        });
    }
}

export const getOne = async (req, res) => {
    try {

        // Создание запроса для получения статьи 
        const postId = req.params.id;

        // Поиск поста
        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                // Добавить один просмотр
                $inc: { viewsCount: 1 }
            },
            {
                // Возврат обновленной верси документа
                returnDocument: 'after' 
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удалось вернуть статью',
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Статья не найдена'
                    });
                }

                res.json(doc);
            }
        )
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось вывести статьи',
        });
    }
}

export const create = async (req, res) => {
    try {
        const doc = await new PostModel({
            title: req.body.title, 
            text: req.body.text, 
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        });


        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью',
        });
    }
}

export const remove = async (req, res) => {
    try {

        // Создание запроса для получения статьи 
        const postId = req.params.id;

        PostModel.findOneAndDelete({
            _id: postId,
        }, (err, doc) => {
            if(err) {
                console.log(err);
                res.status(500).json({
                    message: 'Не удалось удалить статью',
                });
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'Статья не найдена',
                })
            }

            res.json({
                success: true,
            });
        })

        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось вывести статьи',
        });
    }
}