  const express = require('express');
  const app = express();
  const cors=require('cors');
  const bcrypt=require('bcrypt');
  const dotenv=require('dotenv');
  const jwt = require('jsonwebtoken');
  const cookieParser=require('cookie-parser');
  const {Pool}= require('pg');
  const auth = require('./auth').auth;
  const port = 3000;
  
  dotenv.config();
  const SALT_ROUNDS=10;
  const JWT_SECRET = process.env.JWT_SECRET;

  const createToken =(data) => {
    const token= jwt.sign(data, JWT_SECRET, { algorithm: 'HS256' });
    return token;
  }

  // pool req for db connection
  const pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASS, 
      port: process.env.DB_PORT,
  });

  const cookieOptions={
        httpOnly: true,
        sameSite: "none",
        // secure: process.env.NODE_ENV === "production",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      }

  app.use(cors({
    origin:[ "http://localhost:5173", "http://127.0.0.1:5173"], // your frontend URL
    credentials: true
  }));  


  app.use(cookieParser());

  app.use(express.json());

  app.get('/', async (req, res) => {
    const result=await pool.query('select NOW();');
    console.log(result.rows);
    res.send('Hello World!');
  }) 

  const performQuery= async (res, query, values)=>{
    try{
      const result=await pool.query(query, values);
      console.log(result.rows);
      return res.status(200).json(result.rows);
    }catch(error){
      return res.status(403).send(error);
    }
  }
  // send users details to verified users
  app.get('/me', auth, async (req, res)=>{
    const userId=req.userId;
    const fetchQuery='select id, username, email from users where id=$1;'
    const values=[userId];
    performQuery(res, fetchQuery, values);
  })
  // get a user's blogs
  app.get('/users/:userId/blogs', auth, async (req, res) => {
    console.log('welcome to users blogs!');
    const { userId}=req.params;
    const fetchQuery='select a.id, a.user_id, a.title, count(b.id) as likes from blogs as a left join likes as b on a.id=b.blog_id where a.user_id=$1 group by a.id;'
    const values=[userId];
    performQuery(res, fetchQuery, values);
  })
  // get the like count of a blog
  app.get('/blogs/:blogId/likes', auth, async (req, res) => {
    const {blogId} = req.params;
    const query='select count(id) from likes where blog_id=$1 group by blog_id ';
    const values=[blogId];
    performQuery(res, query, values);
  })
  // like a blog
  app.post('/blogs/:blogId/likes/:userId', auth, async (req, res) => {
    const {blogId, userId}=req.params;
    const insertQuery='INSERT INTO LIKES(user_id, blog_id) VALUES($1, $2);';
    const values=[userId, blogId];
    performQuery(res, insertQuery, values);
  })
  // 1 is user has liked the blog
  app.get('/blogs/:blogId/likes/:userId', auth, async (req, res) => {
    const {blogId, userId}=req.params;
    const fetchQuery='SELECT id FROM LIKES WHERE user_id=$1 and blog_id=$2;';
    const values=[userId, blogId];
    performQuery(res, fetchQuery, values);
  })
  // unlike a blog
  app.delete('/blogs/:blogId/likes/:userId', auth, async (req, res) => {
    const {blogId, userId}=req.params;
    const deleteQuery='DELETE FROM LIKES WHERE user_id=$1 and blog_id=$2;';
    const values=[userId, blogId];
    performQuery(res, deleteQuery, values);
  })
  // get all blogs
  app.get('/blogs', auth, async (req, res) => {
    console.log('welcome to blogs!');
    try{
      const result=await pool.query(
        'select a.id, a.user_id, a.title, count(b.id) as likes from blogs as a left join likes as b on a.id=b.blog_id group by a.id;'
      );
      console.log(result.rows);
      return res.status(200).json(result.rows);
    }catch(error){
      return res.status(403).send(error);
    }
  })
  // post a blog
  app.post('/blogs', auth,  async (req, res) => {
    console.log('welcome to blogs!');
    const {authorId, title, content }=req.body;
    const insertQuery = `INSERT INTO BLOGS(user_id, title, content) VALUES($1, $2, $3);`
    const values=[authorId, title, content];
    performQuery(res, insertQuery, values);
  })
  // delete a blog
  app.delete('/blogs/:id', auth, async (req, res) => {
    const {id}=req.params;
    const deleteQuery=`DELETE FROM BLOGS WHERE id=$1 ;`
    const values=[id];
    console.log('deleting blog', id);
    performQuery(res, deleteQuery, values);
  })

  // get single blogs all data
  app.get('/blogs/:id', auth, async (req, res) => {
    const {id}=req.params;
    const fetchQuery="SELECT * FROM BLOGS WHERE id=$1 ;";
    const values=[id];
    console.log('fetching blog', id);
    performQuery(res, fetchQuery, values);
  })

  app.post('/logout', auth, (req, res) => {
    console.log('hi from logout');
    try{
      // console.log('clearing cookies....');
      // console.log('cookieOptions =', cookieOptions); // 👈 debug
      res.clearCookie("token", cookieOptions);
      // console.log('cleared cookie successfully'); 
      return res.status(200).json({msg: "logged out user successfully"});
    }catch(error){
      console.log('error logging out');
      return res.status(403).json(error);
    }
  })

  app.post('/signup', async (req, res) => {
    // console.log(req.query);
    console.log(req.body);
    const {username, email, password}=req.body;
    const hashedPassword=bcrypt.hashSync(password, SALT_ROUNDS);

    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log(`Hashed Password: ${hashedPassword}`);  

    const insertQuery=`INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id;`;
    const values=[username, email, hashedPassword];

    try {
      const result=await pool.query(insertQuery, values);
      const userid=result.rows[0].id;
      const username=result.rows[0].username;
    
      console.log('user created successfully', userid);
      const jwtToken=createToken({userid: userid});

      res.cookie("token", jwtToken, cookieOptions);

      return res.status(200).json({authorization: true, userid: userid, username: username});
    }catch(error){
      res.status(403).send(error.detail);
    }

    res.send('Signup Page');
  })

  app.post('/login', async (req, res) => {
    // console.log(req.query);
    console.log(req.body);
    const {input1, password}=req.body;
    // const hashedPassword=bcrypt.hashSync(password, SALT_ROUNDS);
    // console.log(`Username: ${username}`);
    // console.log(`Password: ${password}`);
    // console.log(`Hashed Password: ${hashedPassword}`);  
    console.log(input1);
    console.log(typeof(input1));
    console.log(password);
    let inputIsEmail=false;
    for(let i=0; i<input1.length; i++){
      if(input1[i]==='@') inputIsEmail=true;
    }
    const insertQuery=inputIsEmail ? 
    `SELECT id, username, password_hash from users where email=$1;`:
    `SELECT id, username, password_hash from users where username=$1;`;

    const values=[input1];

    try {
      const result=await pool.query(insertQuery, values);
      const pwInDB=result.rows[0].password_hash;
      const userid=result.rows[0].id;
      const username=result.rows[0].username;
      const match=await bcrypt.compare(password, pwInDB);
      console.log(result.rows);
      console.log(match);
      
      if(result.rows.length===0){
        console.log('user does not exists');
      }else if(match){
        console.log('user logged in successfully');
        const jwtToken=createToken({userid: userid});
        console.log('token crated');
        res.cookie("token", jwtToken, cookieOptions);
        return res.status(200).json({authorization: true, userid: userid, username: username});
      }else{
        return res.status(403).json({authorization: false});
      }
    }catch(error){
      console.log('some error occured', error);
      return res.status(403).json(error);
    }
    // res.send('Signup Page');
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
