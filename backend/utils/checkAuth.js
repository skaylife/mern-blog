import jwt from 'jsonwebtoken';

export default (req, res, next) => {

    // Передача токена и удаление слова Bearer с помощью регулярного выражения
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {

        try {
            // Декодировка с помощью секретного значения
            const decoded = jwt.verify(token, 'secret123');
            // Сохранение декодированного токена - кототорые является id - и запись его в req под 
            req.userId = decoded._id;
            next();
        } catch {
            return res.status(403).json({
                message: 'Нет доступа',
            });
        }
    } else {
        return res.status(403).json({
            message: 'Нет доступа',
        });
    }
}