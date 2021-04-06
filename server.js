import express from "express";
import connectDB from "./config/db.js"
import auth from "./routes/api/auth.js"
import users from "./routes/api/users.js"
import posts from "./routes/api/posts.js"
import profile from "./routes/api/profile.js"

const app = express()

connectDB()

app.use(express.json({ extended: false }))

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Fuck you")
})

app.use("/api/users", users) 
app.use("/api/auth", auth) 
app.use("/api/posts", posts) 
app.use("/api/profile", profile) 

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`)
})