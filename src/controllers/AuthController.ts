import type { Request, Response } from 'express';
import User from '../models/User';
import Token from '../models/Token';
import { checkPassword, hashPassword } from '../utils/auth';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';
import { generateJWT } from '../utils/jwt';

export class AuthController {

    //Vid 530 
    static createAccount = async (req: Request, res: Response) => {
        try {
            //Vid 532
            const { password, email } = req.body

            //Vid 533 ,Prevenir duplicados
            const userExists = await User.findOne({ email })
            if (userExists) {
                const error = new Error('El Usuario ya esta registrado')
                return res.status(409).json({ error: error.message })
            }

            //Vid 531, Crea un usuario
            const user = new User(req.body)

            //Vid 532,Hash Password
            user.password = await hashPassword(password)

            //Vid 535 ,Generar el token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            //Vod 537.enviar el email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            //Vid 535 
            await Promise.allSettled([user.save(), token.save()])
            //Vid 531
            res.send('Cuenta creada, revisa tu email para confirmarla')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    //Vid 538 
    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body

            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Token no válido')
                return res.status(404).json({ error: error.message })
            }

            //Vid 539
            const user = await User.findById(tokenExists.user)
            user.confirmed = true

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            res.send('Cuenta confirmada correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    //Vid 540 
    static login = async (req: Request, res: Response) => {
        try {
            //Vid 540 
            const { email, password } = req.body
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('Usuario no encontrado')
                return res.status(404).json({ error: error.message })
            }

            //Vid 541
            if (!user.confirmed) {
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()

                // enviar el email
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error('La cuenta no ha sido confirmada, hemos enviado un e-mail de confirmación')
                return res.status(401).json({ error: error.message })
            }

            //Vid 542, Revisar password
            const isPasswordCorrect = await checkPassword(password, user.password)
            if(!isPasswordCorrect) {
                const error = new Error('Password Incorrecto')
                return res.status(401).json({ error: error.message })
            }

            //Vid 563,ERRROR 
            const token = generateJWT({id: user.id})

            res.send(token)

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    //Vid 550
    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            // Usuario existe
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('El Usuario no esta registrado')
                return res.status(404).json({ error: error.message })
            }

            if(user.confirmed) {
                const error = new Error('El Usuario ya esta confirmado')
                return res.status(403).json({ error: error.message })
            }

            // Generar el token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            // enviar el email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])

            res.send('Se envió un nuevo token a tu e-mail')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    //Vid 553
    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            // Usuario existe
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('El Usuario no esta registrado')
                return res.status(404).json({ error: error.message })
            }

            // Generar el token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            //Vid 553
            await token.save()

            // enviar el email
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })
            res.send('Revisa tu email para instrucciones')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    //Vid 557
    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body

            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Token no válido')
                return res.status(404).json({ error: error.message })
            }
            res.send('Token válido, Define tu nuevo password')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    //Vid 558 
    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params
            const { password } = req.body

            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Token no válido')
                return res.status(404).json({ error: error.message })
            }

            //Vid 558 
            const user = await User.findById(tokenExists.user)
            user.password = await hashPassword(password)

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])

            res.send('El password se modificó correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    //Vid 575
    static user = async (req: Request, res: Response) => {
        return res.json(req.user)
    }

    //Vid 620
    static updateProfile = async (req: Request, res: Response) => {
        const { name, email } = req.body

        const userExists = await User.findOne({email})
        //Si ya existe el usuario y no es el usuario 
        if(userExists && userExists.id.toString() !== req.user.id.toString() ) {
            const error = new Error('Ese email ya esta registrado')
            return res.status(409).json({error: error.message})
        }

        req.user.name = name
        req.user.email = email

        try {
            await req.user.save()
            res.send('Perfil actualizado correctamente')
        } catch (error) {
            res.status(500).send('Hubo un error')
        }
    }

    //Vid 622
    static updateCurrentUserPassword = async (req: Request, res: Response) => {
        const { current_password, password } = req.body

        const user = await User.findById(req.user.id)

        const isPasswordCorrect = await checkPassword(current_password, user.password)
        if(!isPasswordCorrect) {
            const error = new Error('El Password actual es incorrecto')
            return res.status(401).json({error: error.message})
        }

        try {
            user.password = await hashPassword(password)
            await user.save()
            res.send('El Password se modificó correctamente')
        } catch (error) {
            res.status(500).send('Hubo un error')
        }
    } 

    //Vid 625
    static checkPassword = async (req: Request, res: Response) => {
        const { password } = req.body

        const user = await User.findById(req.user.id)

        const isPasswordCorrect = await checkPassword(password, user.password)
        if(!isPasswordCorrect) {
            const error = new Error('El Password es incorrecto')
            return res.status(401).json({error: error.message})
        }

        res.send('Password Correcto')
    }
}