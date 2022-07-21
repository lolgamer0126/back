import express from 'express';
import pool from '../database/db';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router()

router.post('/', async(req, res)=>{
    const option = req.body.option=='rating' ? 'rating' : 'id'; 
    const sql = `select * from restaurants ORDER BY ${option} DESC LIMIT '${req.body.limit}'`;
    try{
        const result = await pool.query(sql)
        res.json({"message": 'success', restaurants:result.rows});
    }
    catch(error){
        console.log(error)
        res.json({"message":"error"});
    }
    
})

router.post('/increment', async(req, res)=>{
    const query = `UPDATE restaurants SET rating = rating + 1 WHERE uniqueid = '${req.body.uniqueid}'`;
    const checkQuery = `SELECT email from costumers where uniqueid = '${req.body.cookie}'`;
    try{
        const check = await pool.query(checkQuery);
        if(check.rowCount != 0){
            const result = await pool.query(query);
            res.json({message:"success"});
        }
        else{
            res.json({message:"unauthenticated"});
        }
    }
    catch(error){
        console.log(error)
        res.json({message:"error"})
    }
})

router.post('/delete', async (req ,res)=>{
    const query = `DELETE FROM restaurants WHERE uniqueid = '${req.body.id}'`;
    try{
        const check = await pool.query(`select admin from costumers where uniqueid = '${req.body.cookie}'`);
        if(check.rows[0].admin){
            const resp = await pool.query(query);
            res.json({message:'success'});
        }
        else{
            res.json({message:'unauthorized'});
        }
        
    }
    catch(error){
        console.log(error)
        res.json({"message":"error"})
    }
})

router.post('/search', async(req, res)=>{
    const query = `select name, uniqueid from restaurants where name Ilike '%${req.body.key}%'`
    try{
        const result = await pool.query(query);
        res.json({"message":"success", "restaurants": result.rows});
    }
    catch(error){
        console.log(error);
    }
})

router.get('/edit/:id', async(req, res)=>{
    const query = `select * from restaurants where uniqueid='${req.params.id}'`
    try{
        const result = await pool.query(query);
        if(result.rowCount != 0){
            res.json({message:"success", restaurant:result.rows[0]});
        }
        else{
            res.json({message:"invalid restaurant"});
        }
    }
    catch(error){
        res.json({message:"error"});
    }
})
router.post('/edit/:id', async(req, res)=>{
    const c = req.body;
    const query = `UPDATE restaurants SET name = '${c.name}', phone = '${c.phone}', tags='${c.tags}', description = '${c.description}', photo='${c.photo}', email='${c.email}', branch = '${c.branch}' WHERE uniqueid = '${c.uniqueid}'`
    try{
        const result = await pool.query(query);
        res.json({"message":"success"});
    }
    catch(error){
        console.log(error)
        res.json({"message":"error"});
    }
})

router.get('/:id',async (req,res)=>{
    const sql = `select * from restaurants WHERE uniqueid='${req.params.id}'`;
    try{
        const result = await pool.query(sql);
        if (result.rowCount!=0){
            res.json({message:"success", restaurant:result.rows[0]});
        }
        else{
            res.json({message:"error"});
        }
    }
    catch(error){
        res.json({message:"unexpected error"});
    }
})

router.post('/create', async (req, res)=>{
    const {name, email, photo, tags, branch, description, phone,x,y} = req.body;
    const location = x+';'+y;
    const uniqueid = uuidv4();
    try{
        const check = await pool.query(`select * from costumers where uniqueid = '${req.body.cookie}'`)
        if(check.rowCount!=0 && check.rows[0].admin){
            const query = await pool.query(`INSERT INTO restaurants (name, email, photo, phone, tags, branch, description, uniqueid, location) VALUES ('${name}', '${email}','${photo}', '${phone}', '${tags}','${branch}','${description}','${uniqueid}', '${location}')`)
            // const comment = await pool.query(`CREATE TABLE '${uniqueid}' (id SERIAL PRIMARY KEY, username VARCHAR(50) NOT NULL, comment VARCHAR(500) NOT NULL, rating integer DEFAULT 0 NOT NULL, commentorID VARCHAR(50) NOT NULL)`)
            res.json({"message": "success"})
        }
        else{
            res.json({"message":"admin privilage required"})
        }
    }
    catch(error){
        console.log(error);
        res.json({"message": "error"})
    }
})


export default router;
