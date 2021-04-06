import express from "express"
import { protect } from "../../middleware/auth.js"
import { check, validationResult } from "express-validator/check/index.js"
import Post from "../../models/Post.js"
import Profile from "../../models/Profile.js"
import User from "../../models/Users.js"

const  router = express.Router()

router.post("/", [protect, check("text", "Text Required").not().isEmpty()],
    async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

   try {
    
    const user = await User.findById(req.user.id).select("-password")

    const newPost = new Post ({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
    })
    
    const post = await newPost.save()

    res.json(post)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error") 
    }   
})

router.get("/", protect, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 })
        res.json(posts)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error") 
    }
})

router.get("/:id", protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if(!post) {
            return res.status(404).json({ msg: "No Post" })
        }

        res.json(post)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error") 

        if(error.kind === "ObjectId") {
            return res.status(404).json({ msg: "No Post" })
        }
    }
})

router.delete("/:id", protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        
        if(!post) {
            return res.status(404).json({ msg: "No Post" })
        }

        if(post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User Not Authorized" })

        }

        await post.remove()

        res.json({ msg: "Post Removed" })

    } catch (error) {
        if(error.kind === "ObjectId") {
            return res.status(404).json({ msg: "No Post" })
        }

        console.error(error.message)
        res.status(500).send("Server error") 
    }
})

router.put("/like/:id", protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: "Already Like" })
        }

        post.likes.unshift({ user: req.user.id })

        await post.save()

        res.json(post.likes)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error") 
    }
})

router.put("/unlike/:id", protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: "Post has not been Liked" })
        }

        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)

        post.likes.splice(removeIndex, 1)
        
        await post.save()

        res.json(post.likes)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error") 
    }
})

router.post("/comment/:id", [protect, check("text", "Text Required").not().isEmpty()],
 async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
    
    const user = await User.findById(req.user.id).select("-password")
    
    const post =  await Post.findById(req.params.id)

    const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
    }

    post.comments.unshift(newComment)
    
    await post.save()

    res.json(post.comments)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error") 
    }   
})

router.delete("/comment/:id/:comment_id", protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        const comment = post.comments.find(comment => comment.id === req.params.comment_id)

        if(!comment) {
            return res.status(404).json({ msg: "Comment not found" })
        }

        if(comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User Not Authorized" })
        }

        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id)

        post.comments.splice(removeIndex, 1)
        
        await post.save()

        res.json(post.comments)


    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error") 
    }
})

export default router