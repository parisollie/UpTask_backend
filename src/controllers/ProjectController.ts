import type {Request, Response} from 'express'
import Project from '../models/Project'

//Vid 447
export class ProjectController {
    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body)

        //Vid 568, Asigna un manager
        project.manager = req.user.id
        //Vid 448
        try {
            await project.save() 
            res.send('Proyecto Creando Correctamente')
        } catch (error) {
            console.log(error)
        }
    }

    //Vid 447
    static getAllProjects = async (req: Request, res: Response) => {
        //Vid 450
        try {
            //find obtengo todos los registros 
            const projects = await Project.find({
                //Vid 570
                $or: [
                    {manager: {$in: req.user.id}},
                    //Vid 594
                    {team: {$in: req.user.id}}
                ]
            })
            res.json(projects)
        } catch (error) {
            console.log(error)
        }
    }
    
    
    //Vid 451
    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            //Vid 465 ,usamos populate para juntarlo con los task
            const project = await Project.findById(id).populate('tasks')
            if(!project) {
                const error = new Error('Proyecto no encontrado')
                return res.status(404).json({error: error.message})
            }
            //Vid 571
            //Vid 594,&& !project.team.includes(req.user.id)
            if(project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
                const error = new Error('Acción no válida')
                return res.status(404).json({error: error.message})
            }
            res.json(project)
        } catch (error) {
            console.log(error)
        }
    }

    //Vid 452
    static updateProject = async (req: Request, res: Response) => {
        try {      
            //Vid 472      y  Vid 640  req.
            req.project.clientName = req.body.clientName
            req.project.projectName = req.body.projectName
            req.project.description = req.body.description

            await req.project.save()
            res.send('Proyecto Actualizado')
        } catch (error) {
            console.log(error)
        }
    }

    //Vid 453  
    static deleteProject = async (req: Request, res: Response) => {
        try {
           // Vid 640  req.
            await req.project.deleteOne()
            res.send('Proyecto Eliminado')
        } catch (error) {
            console.log(error)
        }
    }
}