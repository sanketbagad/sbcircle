import express from "express";
import connectDB from "./config/db.js"
import auth from "./routes/api/auth.js"
import users from "./routes/api/users.js"
import posts from "./routes/api/posts.js"
import profile from "./routes/api/profile.js"
import path from "path"

const app = express()

connectDB()

app.use(express.json({ extended: false }))




app.use("/api/users", users) 
app.use("/api/auth", auth) 
app.use("/api/posts", posts) 
app.use("/api/profile", profile) 

if(process.env.NODE_ENV = "production") {
    app.use(express.static("client/build"))

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    })
}
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`)
})