import express, { Express, Request, Response } from 'express'

const app: Express = express()

const port: number = 3000

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Hello Express + TypeScirpt!!'
  })
})

// ✅ ใช้ export default
export default app;