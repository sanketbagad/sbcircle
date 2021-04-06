import mongoose from "mongoose"
import config from "config"

const db = config.get("mongoURI")

const connectDB = async () => {
    try {
       await mongoose.connect(db,  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false  } )
       console.log("Mongo DB Connected")
    } catch (error) {
        console.error(error.message)
        process.exit(1)
    }
}

export default connectDB
