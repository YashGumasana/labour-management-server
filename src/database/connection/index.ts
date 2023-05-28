import mongoose from 'mongoose'
import express from 'express'

let dbUrl: any
dbUrl = process.env.LOCAL_DB_URL

const mongooseConnection = express()

mongoose.connect(
    dbUrl
).then(() => console.log('Database successfully connected')
).catch(err => console.log(err)
)

export { mongooseConnection }