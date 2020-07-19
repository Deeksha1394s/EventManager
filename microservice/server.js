const express = require('express')
const bodyParser = require('body-parser')
const configUtil =require('../common/utils/config-util')
const app = express()
const router = require('./routes/event-route')
const port = configUtil.get('server:port')


app.use(bodyParser.json({limit: '20mb'}))
app.use(bodyParser.urlencoded({limit: '20mb', extended: true}));
app.use('/eventApp',router)
app.listen(port,()=>{console.log(`running on port ${port}`)})

