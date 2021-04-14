import express from "express"
import { protect } from "../../middleware/auth.js"
import Profile from "../../models/Profile.js"
import Post from "../../models/Post.js"
import User from "../../models/Users.js"
import request from "request"
import config from "config"
import { check, validationResult } from "express-validator/check/index.js"

const  router = express.Router()

router.get("/me", protect, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate("user", ["name", "avatar"])

        if (!profile) {
            return res.status(400).json({msg: "No Profile Found"})
        }

        res.json(profile)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error")
    }
})

router.post("/", [protect, [
    check("status", "Status is Required").not().isEmpty(),
    check("skills", "Skills is Required").not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req)
    
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body

    const profileFields = {}
    profileFields.user = req.user.id
    if(company) profileFields.company = company
    if(website) profileFields.website = website
    if(location) profileFields.location = location
    if(bio) profileFields.bio = bio
    if(status) profileFields.status = status
    if(githubusername) profileFields.githubusername = githubusername
    if (skills) {
        profileFields.skills = skills.split(",").map(skill => skill.trim())
    }

   profileFields.social = {}
   if (youtube) profileFields.social.youtube = youtube
   if (twitter) profileFields.social.twitter = twitter
   if (facebook) profileFields.social.facebook = facebook
   if (instagram) profileFields.social.instagram = instagram
   if (linkedin) profileFields.social.linkedin = linkedin

   try {
       let profile = await Profile.findOne({ user: req.user.id })

       if(profile) {
           profile = await Profile.findOneAndUpdate({ user: req.user.id },
             { $set: profileFields }, 
             { new : true })

             return res.json(profile)            
       }
       profile = new Profile(profileFields)

       await profile.save()
       res.json(profile)

   } catch (error) {
       console.error(error.message)
       res.status(500).send("Server error")
   }
})

router.get("/", async (req, res) => {
    try {
        const profiles = await Profile.find().populate("user", ["name", "avatar"])
        res.json(profiles)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error")
    }
})

router.get("/user/:id", async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user._id }).populate("user", ["name", "avatar"])
        
        if(!profile) return res.status(400).json({ msg: "No User Found" })
        
        res.json(profile)

    } catch (error) {
        console.error(error.message)
        
        if (error.kind == "ObjectId") {
        
        return res.status(400).json({ msg: "User Not Found" })
        }
        res.status(500).send("Server error")
    }
})

router.delete("/", protect, async (req, res) => {
    try {

        await Post.deleteMany({ user: req.user.id })

       await Profile.findOneAndRemove({ user: req.user.id })

       await User.findOneAndRemove({ _id: req.user.id })
        
       res.json({ msg: "User Removed" })

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error")
    }
})

router.put("/experience", [protect, [
    check("title", "Title is Required").not().isEmpty(),
    check("company", "Company is Required").not().isEmpty(),
    check("from", "From Date is Required").not().isEmpty()

]], async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body

    const newExp =  {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id })

        profile.experience.unShift(newExp)
        await profile.save()

        res.json(profile)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error")
    }

})

router.delete("/experience/:exp_id", protect, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })

        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)

        profile.experience.splice(removeIndex, 1)

        await profile.save()

        res.json(profile)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server Error")
    }
})

router.put("/education", [protect, [
    check("school", "School is Required").not().isEmpty(),
    check("degree", "Degree is Required").not().isEmpty(),
    check("from", "From Date is Required").not().isEmpty(),
    check("fieldofstudy", "Field Of Study is Required").not().isEmpty()

]], async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body

    const newEdu =  {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id })

        profile.education.unShift(newEdu)
        await profile.save()

        res.json(profile)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error")
    }

})

router.delete("/education/:edu_id", protect, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })

        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)

        profile.education.splice(removeIndex, 1)

        await profile.save()

        res.json(profile)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server Error")
    }
})

router.get("/github/:username", async (req, res) => {
    try {
      const options = {
          uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&
          sort=created:asc&client_id=${config.get(`githubClientId`)}&client_secret=${config.get(
              "githubSecret"
          )}`,
          method: `Get`,
          headers: { "user-agent": "node.js" }
      }

      request(options, (error, response, body) => {
          if(error) console.error(error)

          if(response.statusCode !== 200) {
            return  res.status(404).json({ msg: "No Github Profile Found" })
          }

          res.json(JSON.parse(body))
      })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server Error")
    }
  })


export default router