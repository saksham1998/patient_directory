// Import Modules
const express = require('express');
const app = express();
const sequelize = require('../db/sequelize');
const patientSchema = require('./routers/patient')

// Config Files
require('dotenv').config()

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/patient',patientSchema)

// Syncing Database
sequelize.sync().then(result=>console.log('Connected with Database'))
.catch(e=>console.log('Error Occured ',e))

module.exports = app