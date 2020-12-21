const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const convertRoute = require('./router')

const app = express()

app.use(express.json({ extended: true }))

app.use('/api/units', convertRoute)

const PORT = config.get('port') 

async function start () {
    try { 
        await mongoose.connect(config.get("mongoUrl"), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        app.listen(PORT, () => {
            console.log(`app has been started on port ${PORT}`)
         })
    } catch (error) {
        console.log('Server error', error.message)
        process.exit(1)
    }
}



start()