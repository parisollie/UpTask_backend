import type {Request, Response} from 'express'
import Task from '../models/Task'

//Vid 457
export class TaskController {
    //Vid 457
    static createTask = async (req: Request, res: Response) => {
        try {
            //Vid 458
            const task = new Task(req.body)
            //Vid 460
            task.project = req.project.id
            //Vid 460
            //Vid 471, le ponemos el req, esta en el task.ts el midelware 
            req.project.tasks.push(task.id)
            //Vid 461 Promise.allSettled
            await Promise.allSettled([task.save(), req.project.save() ])
            //Vid 458
            res.send('Tarea creada correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    //Vid 463
    static getProjectTasks = async (req: Request, res: Response) => {
        try {
            //Vid 464, populate es como un cross join 
            const tasks = await Task.find({project: req.project.id}).populate('project')
            res.json(tasks)
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    //Vid 466 
    static getTaskById = async (req: Request, res: Response) => {
        try {
            //Vid 600
            const task = await Task.findById(req.task.id)
                            .populate({path: 'completedBy.user', select: 'id name email'})
                            //Vid 609
                            .populate({path: 'notes', populate: {path: 'createdBy', select: 'id name email' }})
            res.json(task)
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    //Vid 468 
    static updateTask = async (req: Request, res: Response) => {
        try {
            //Vid 469
            req.task.name = req.body.name
            req.task.description = req.body.description
            await req.task.save()
            res.send("Tarea Actualizada Correctamente")
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    //Vid 469 
    static deleteTask = async (req: Request, res: Response) => {
        try {
            req.project.tasks = req.project.tasks.filter( task => task.toString() !== req.task.id.toString() )
            await Promise.allSettled([ req.task.deleteOne(), req.project.save() ])
            res.send("Tarea Eliminada Correctamente")
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    //Vid 470 
    static updateStatus = async (req: Request, res: Response) => {
        try {
            const { status } = req.body
            req.task.status = status
            const data = {
                //Vid 604
                user: req.user.id,
                status
            }
            //Vid 604
            req.task.completedBy.push(data)
            await req.task.save()
            res.send('Tarea Actualizada')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
}