import {Router, type Request, type Response } from "express";
import { students, courses } from "../db/db.js";
import { zStudentId } from "../schemas/studentSchema.js"
import { type Student, type Course } from "../libs/types.js"
const studentsRouter = Router();


studentsRouter.get("/", async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Get all students successfully",
    data: students
  })
});
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

studentsRouter.get("/:studentId/courses", async (req: Request, res: Response) => {
  
  const studentId = req.params.studentId;
  const parseResult = zStudentId.safeParse(studentId);

  if (!parseResult.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: parseResult.error.issues[0]?.message,
    });
  }
  
  const foundIndex = students.findIndex(
    (std: Student) => std.studentId === studentId
  );

  if (foundIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Student does not exists",
    });
  }

  const student = students[foundIndex];
  const coursesDetails = courses.filter((c: Course) =>
      student?.courses?.includes(c.courseId)
  );
 
  const result = {
      studentId: studentId,
      courses: coursesDetails.map((cou: Course) => ({         
        courseId: cou.courseId,
        courseTitle: cou.courseTitle
      }))
   }
  return res.json({
    success: true,
    message: `Get courses detail of student ${studentId}`,
    data: result
  });
});

export default studentsRouter;