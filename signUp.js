const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors")
const { createServer } = require("http");
const { Server } = require("socket.io");

app.use(express.json());
app.use(cors());


const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("chat message", (msg) => {
    console.log("Message: " + msg);
    io.emit("chat message", msg); 
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});


require('dotenv').config();

const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI);

// Define a schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password:String,
  role:String,
  dob:String,
}, { collection: 'users' });

// Schema for Collection 2 (e.g., 'products')
const privateSchema = new mongoose.Schema({
  send: String,
  receive: String,
  msg: String
}, { collection: 'Private' });

// Schema for Collection 3 (e.g., 'orders')
const attendenceSchema = new mongoose.Schema({
  username:String,
  In: String,
  Out: String,
  date:Date}, 
  { collection: 'Attendence' });

// Schema for Collection 4 (e.g., 'reviews')
const msgSchema = new mongoose.Schema({
  name:String,
  msg:String
}, { collection: 'Msg' });

// Schema for Collection 5 (e.g., 'customers')
const leaveApprovalSchema = new mongoose.Schema({
  username:String,
  leaveType:String ,
  result:String,
  date:Date,
  applied:Date
}, { collection: 'LeaveApproval' });

const leaveSchema = new mongoose.Schema({
  username:String,
  leaveType:String,
  date:Date,
  ids:Number
},
   { collection: 'Leave' });

// Create models for each schema with the specific collection names
const User = mongoose.model('User', userSchema);
const Private = mongoose.model('Private', privateSchema);
const Attendence = mongoose.model('Attendence', attendenceSchema);
const Msg = mongoose.model('Msg', msgSchema);
const LeaveApproval = mongoose.model('LeaveApproval', leaveApprovalSchema);
const Leave = mongoose.model('Leave', leaveSchema);

app.post("/msg", async (req, res) => {
  const { name, msg, id } = req.body;
  const newUser = new Msg({ name:name,msg:msg });
  await newUser.save();
});
app.get("/msg", async(req, res) => {
  try {

    const Msgs = await Msg.find();
    console.log('All Users:', Msgs);
          res.status(200).json(Msgs);  // Send the users as a JSON response

  } catch (error) {
    console.error('Error fetching users:', error);
  }
});
app.delete("/msg/:id", async(req, res) => {
  //  const id=req.body
  try {
    await Msg.deleteMany();
    console.log("Documents deleted");
  } catch (err) {
    console.log(err);
  }
});


app.post('/attendence',async (req,res)=>{
    const {username,In,Out,date}=req.body
    console.log('atten',req.body);
    
    const newUser = new Attendence({username:username,In:In,Out:Out,date:date });
    await newUser.save();
  });
  
  app.get('/attendence',async(req,res)=>{
    try {
      const Attendences = await Attendence.find();
      console.log('All Users:', Attendences);
            res.status(200).json(Attendences);  // Send the users as a JSON response

    } catch (error) {
      console.error('Error fetching users:', error);
    }
   })

app.post('/leaveapproval',async (req,res)=>{
    const {username,leaveType,result,date,applied}=req.body
    const newUser = new LeaveApproval({
       username:username,
      leaveType:leaveType ,
      result:result,
      date:date,
      applied:applied
    });
    await newUser.save();
    });
  
  app.get('/leaveapproval',async(req,res)=>{
    try {
      const LeaveApprovals = await LeaveApproval.find();
      console.log('All Users:', LeaveApprovals);
            res.status(200).json(LeaveApprovals);  // Send the users as a JSON response

    } catch (error) {
      console.error('Error fetching users:', error);
    }
   })
  
   
app.post('/leave',async (req,res)=>{
    const {username,leaveType,ids,date}=req.body
    
    const newUser = new Leave({ username:username,leaveType:leaveType,date:date,ids:ids });
    await newUser.save();
    });
  
  app.get('/leave',async (req,res)=>{
    try {
      const Leaves = await Leave.find();
      console.log('All Users:', Leaves);
            res.status(200).json(Leaves);  // Send the users as a JSON response
            console.log('idsssssssss',Leaves);

    } catch (error) {
      console.error('Error fetching users:', error);
    }
  });
  
   app.delete('/leave/:id', async(req, res) => {
    const id = req.params.id;
    
    try {
      
      const objectId =new mongoose.Types.ObjectId(id);
      await Leave.deleteOne({_id:objectId});
      console.log("Documents deleted",id);
    } catch (err) {
      console.log(err);
    }
      }  );

app.post('/private',async (req,res)=>{
    const {send,receive,msg}=req.body
    
    const newUser = new Private({ send:send,receive:receive,msg:msg });
    await newUser.save();
  });
  
  app.get('/private',async (req,res)=>{
    try {
      const Privates = await Private.find();
      console.log('All Users:', Privates);
            res.status(200).json(Privates);  // Send the users as a JSON response

    } catch (error) {
      console.error('Error fetching users:', error);
    }
  });
  


 app.post('/signup',async (req,res)=>{
  const {name,email,password,role,dob}=req.body
  console.log('req',req.body);
    const newUser = new User({ name:name,email:email,password:password,role:role,dob:dob });
    await newUser.save();
  });
  app.get('/signup', async (req, res) => {  // Added async keyword
    try {
      const users = await User.find();
      console.log('All Users:', users);
            res.status(200).json(users);  // Send the users as a JSON response

    } catch (error) {
      console.error('Error fetching users:', error);
    }
  });
  



// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });
server.listen(process.env.PORT || port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
