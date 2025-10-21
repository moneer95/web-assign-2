import express from 'express'
import { getDocs, editDocs, insertDocs, removeDocs } from './business'

const app = express()


app.listen(8000, () => 
    console.log("server running on port 8000")
)