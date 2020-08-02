// Import Modules
const app = require('./app')

const port = process.env.PORT || 3000;

// Listen to the server
app.listen(port,()=>{
    console.log(`Server is listening to ${port}`)
})