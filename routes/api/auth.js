import express from "express"
import { protect } from "../../middleware/auth.js"
import User from "../../models/Users.js"
import { check, validationResult } from "express-validator/check/index.js"
import jwt from "jsonwebtoken"
import config from "config"
import bcrypt from "bcryptjs"

const router = express.Router()

router.get("/", protect, async (req, res) => {
    try {
        const user = await (await User.findById(req.user.id)).isSelected("-password")
        res.json(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server Error")
    }
})

router.post("/", [
    check("email", "Email Required").isEmail(),
    check("password", "Enter Password min 6 chars").exists()
], async (req, res) =>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password} = req.body

    try {
        let user = await User.findOne({ email })

        if(!user) {
          return  res.status(400).json({ errors : [{ msg: "Invalid email or password "}]})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return  res.status(400).json({ errors : [{ msg: "Invalid email or password "}]})
        }

        const payload = {
            user: {
                id : user.id
            }
        }

        jwt.sign(payload, config.get("jwtSecret"), { expiresIn: "30d" }, 
        (err, token) => {
            if (err) throw err
            res.json({ token })
        })
        
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server Error")
    }  
    })


export default router