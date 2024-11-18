import express from 'express';
import "dotenv/config"

const port = process.env.PORT || 8800
const app = express();
app.use(express.json());



// Routes
import route from "./routes/index.js"
app.use("/", route)



app.get('/', (req,res)=>{
    res.send('Hello from server')
})

// middleware 
import error from './middleware/error.js';
app.use(error)

app.listen(port, ()=>{
    console.log(`Server is listening on http://localhost:${port}`)
})



