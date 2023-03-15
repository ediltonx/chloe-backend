import { Request, Response } from 'express'
import { Address } from '../models/Address'
import { User } from '../models/User'

export const getAll = async (req: Request, res: Response) => {
    try {
        const list = await User.findAll({
            include: [
                {
                    model: Address,
                    as: 'endereco',
                },
            ],
        })
        if (list) {
            res.json({ list })
        }
    } catch ({ message }) {
        res.status(404).json({ message: message })
    }
}

export const getById = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const list = await User.findOne({
            where: { id },
            include: [
                {
                    model: Address,
                    as: 'endereco',
                },
            ],
        })
        if (!list) {
            throw new Error('Usuário não encontrado')
        }
        return res.json({ list })
    } catch ({ message }) {
        res.status(404).json({ error: message })
    }
}

export const createUser = async (req: Request, res: Response) => {
    const { nome_usuario, email_usuario, password, nivel, status } = req.body

    try {
        if (req.body === '') {
            throw new Error('Não foi possível cadastrar o usuário')
        }
        const newUser = await User.create({ nome_usuario, email_usuario, password, nivel, status })
        return res.json({ id: newUser.id, nome_usuario, email_usuario, password, nivel, status })
    } catch ({ message }) {
        return res.status(404).json({ error: message })
    }
}

export const editById = async (req: Request, res: Response) => {
    const { id } = req.params
    const { name, email, password, nivel, status } = req.body

    try {
        const list = await User.findByPk(id)
        if (!list) {
            throw new Error('Usuário não encontrado')
        }

        list.nome_usuario = name
        list.email_usuario = email
        list.password = password
        list.nivel = nivel
        list.status = status
        await list.save()

        return res.json({ message: list })
    } catch ({ message }) {
        return res.status(404).json({ error: message })
    }
}

export const deleteById = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const list = await User.destroy({ where: { id } })
        if (!list) {
            throw new Error('Usuário não encontrado')
        }
        return res.json({ message: 'Usuário excluido com sucesso' })
    } catch ({ message }) {
        res.status(404).json({ error: message })
    }
}
