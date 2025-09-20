import {Router, type Request, type Response } from "express";
import { students } from "../db/db.js";
import { type Student } from "../libs/types.js"
const studentsRouter = Router();

// Params URL เหมาะกับ ID มากก่วา
studentsRouter.get("/:studentId", async (req: Request, res: Response, next:Function) => {
  try {
      const studentId = req.params.studentId as string | null;
      let filtered = students;
        if (studentId !== null) {
            filtered = filtered.filter((std:Student) => {return std.studentId === studentId});
            res.send(filtered).json;
        }
  } catch (err) {
    next(err);
  }
});

export default studentsRouter;