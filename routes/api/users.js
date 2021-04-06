import express from "express"
import { check, validationResult } from "express-validator/check/index.js"
import User from "../../models/Users.js"
import gravatar from "gravatar"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import config from "config"

const  router = express.Router()

router.post("/", [
    check("name", "Name is Required").not().isEmpty(),
    check("email", "Email Required").isEmail(),
    check("password", "Enter Password min 6 chars").isLength({ min: 6 })
], async (req, res) =>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password} = req.body

    try {
        let user = await User.findOne({ email })

        if(user) {
          return  res.status(400).json({ errors : [{ msg: "User Already Exists "}]})
        }

        const avatar = gravatar.url(email, {
            s: "200",
            r: "pg",
            d: "mm"
        })

        user = new User({
            name,
            email,
            avatar,
            password
        })

        const salt = await bcrypt.genSalt(10)

        user.password = await bcrypt.hash(password, salt)

        await user.save()

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