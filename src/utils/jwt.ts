import jwt from 'jsonwebtoken'
import Types from 'mongoose'

//Vid 563
type UserPayload = {
    id: Types.ObjectId
}
//Vid 562
export const generateJWT = (payload: UserPayload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        //Tiempo de validez 
        expiresIn: '180d'
    })
    return token
}