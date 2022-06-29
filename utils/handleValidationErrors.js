import { validationResult } from "express-validator";

export default (req, res, next) => {
    // Возврат ошибок, если они имеются
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    // Продолжение, если их нет.
    next()
}