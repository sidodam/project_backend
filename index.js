import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import hotelsRoute from "./routes/hotels.js";
import usersRoute from "./routes/users.js";
import cookieParser from "cookie-parser";
import roomsRoute from "./routes/rooms.js";
import cors from "cors";
import nodemailer from "nodemailer";
import UserMessage from "./models/UserMessage.js";
import { verifyUser } from "./utils/verifyToken.js";

const app = express();

dotenv.config();
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("connected to mongo");
  } catch (error) {
    throw error;
  }
};

//middlewares

// app.use(
//   cors({
//     origin: "*",
//   })
// );

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(cookieParser());

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

// SENDING EMAIL
app.post("/api/send", async (req, res) => {
  const { target } = req.body;

  const transporter = nodemailer.createTransport({
    host: "SMTP.office365.com",
    port: "587",
    secure: false,
    auth: {
      user: "spaintravelsm8@outlook.com",
      pass: process.env.NODEMAILLERPASS,
    },
  });
  const mailOptions = {
    from: "spaintravelsm8@outlook.com",
    to: target,
    subject: "Spain travels weekly Subscription",
    html: `<div className="email" style="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px; 
    ">
    <strong>You subscribed to Spain travels!</strong>
    <p>
       Follow us on: </br> <a href="https://mobile.twitter.com/">Twitter</a> </br> <a href="https://www.facebook.com">Facebook</a> </br> <a href="https://www.instagram.com/">Instagram</a> </br> to stay up to date with our latest news. 
       
    </p>
    <p>All the best, Spain travels team.</p>
     </div>
`,
  };
  await transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      res.json({ message: "fail" });
    } else {
      res.json({ message: "success" });
    }
  });
});

// END OF EMAIL

// app post new usermessage

// message were positioned here in order to gurantee user anonamity
app.post("/api/contactus", async (req, res) => {
  const { fullname, email, textarea } = req.body;
  try {
    const userMessage = new UserMessage({
      fullname,
      email,
      textarea,
    });
    await userMessage.save();
    res.status(200).json("Message sent");
  } catch (error) {
    res.status(500).json(error);
  }
});

// end of contact us middleware

//create middleware to get contact us messages
app.get("/api/contactus", async (req, res) => {
  try {
    const messages = await UserMessage.find({});
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(8800, () => {
  connect();
  console.log("Connected to backend!");
});
