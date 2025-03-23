const express = require('express')
const { query } = require('../helpers/db.js')

const todoRouter = express.Router()

todoRouter.get("/",async (req,res) => {
    try {
        const result = await query('select * from task')
        res.status(200).json(result.rows || [])
    } catch (error) {
        console.error("Error fetching tasks:", error)
        res.status(500).json({ error: error.message })
    }
})

todoRouter.post("/new",async (req,res) => {
    try {
        const result = await query('INSERT INTO task (description) VALUES ($1) RETURNING id',
        [req.body.description])
        res.status(200).json({id:result.rows[0].id})
    } catch (error) {
        console.error("Error inserting task:", error)
        res.status(500).json({ error: error.message })
    }
})

todoRouter.delete("/delete/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        const result = await query('DELETE FROM task WHERE id = $1 RETURNING id', [id])
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Task not found" })
        }
        res.status(200).json({ id })
    } catch (error) {
        console.error("Error deleting task:", error)
        res.status(500).json({ error: error.message })
    }
})

module.exports = {
    todoRouter
}