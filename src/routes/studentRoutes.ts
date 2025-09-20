import {Router, type Request, type Response } from "express";
import { students } from "../db/db.js";
import { type Student } from "../libs/types.js"
const studentsRouter = Router();

// Params URL เหมาะกับ ID มากก่วา
studentsRouter.get("/:studentId", async (req: Request, res: Response, next:Function) => {
  try {
      const program = req.params.program;
      let filtered = students;
        if (program !== null) {
            filtered = filtered.filter((std:Student) => std.program === program);
            return  res.send(filtered).json;
        }
  } catch (err) {
    next(err);
  }
});

export default studentsRouter;