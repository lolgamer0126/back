import express from 'express' 
import passport from 'passport';
import { TypedRequestUser } from '../app';
import pool from '../database/db';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router()

router.post('/admin',async (req, res) => {
  res.json({message: 'success'});
})

router.post('/getuserdetails', async (req, res)=>{
  const userID = req.body.cookie
  if(userID!='unauthenticated'){
    const result = await pool.query(`SELECT * FROM costumers WHERE uniqueid = '${userID}'`)
    res.json({user: result.rows[0]})
  }
  else{
    res.json({user: 'unauthenticated'})
  }
})

router.get('/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));


router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  async function(req: TypedRequestUser<{
    displayName: string, photos: any, emails: any
  }>, res: any) {
    const user = req.user;
    const username = user.displayName;
    const email = user.emails[0].value;
    const photo = user.photos[0].value;
    try{
      const check = await pool.query(
        `SELECT uniqueID FROM costumers WHERE email='${email}'`
      )
      if(check.rowCount){
        res.cookie('user', check.rows[0].uniqueid).redirect('http://localhost:3000/')
      }
      else{
        const uniqueID = uuidv4()
        const resp = await pool.query(
          `INSERT INTO costumers (username, email, photo, uniqueID) VALUES ('${username}', '${email}', '${photo}', '${uniqueID}')`
        );
        res.cookie('user', uniqueID).redirect('http://localhost:3000/');
      }
    }
    catch(error){
      console.log(error);
    }
    
});

export default router;

