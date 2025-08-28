import express from 'express';
import cors from 'cors'

const app = express()
app.use(cors())

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/api/sahil', (req, res) => {
  const arr = [{'name': 'sahil'}, {'city': 'indore'}, {'country': 'india'}, {'hobby': 'coding'}, {'language': 'javascript'}, {'framework': 'react'}, {'library': 'express'}, {'database': 'mongodb'}, {'version': '1.0.0'}]
  res.send(arr)
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
