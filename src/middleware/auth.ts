import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../models/User'

//Vid 567
declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}
//Vid 565
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization
    if(!bearer) {
        const error = new Error('No Autorizado')
        return res.status(401).json({error: error.message})
    }

    const [, token] = bearer.split(' ')
    //Vid 566
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        if(typeof decoded === 'object' && decoded.id) {
            //Vid 567 .select 
            const user = await User.findById(decoded.id).select('_id name email')
            //Vid 567
            if(user) {
                req.user = user
                //Vid 575
                next()
            } else {
                //Vid 567
                res.status(500).json({error: 'Token No Válido'})
            }
        }
    } catch (error) {
        res.status(500).json({error: 'Token No Válido'})
    }

}
