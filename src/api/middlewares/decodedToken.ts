import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserData {
    user: number;
    emp_id: number;
}

declare global {
    namespace Express {
        interface Request {
            dataUsuario?: UserData;
        }
    }
}

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['token'] as string;

    if (!token) {
        return res.status(403).send({ message: 'No se proporcionó token' });
    }

    try {
        const decoded = jwt.verify(token, 'token') as UserData;
        console.log(decoded);
        req.dataUsuario = decoded; // Agrega los datos del usuario a la solicitud
        next(); // Continúa con el siguiente middleware
    } catch (error) {
        return res.status(401).send({ message: 'Token inválido' });
    }
};

export default validateToken;
