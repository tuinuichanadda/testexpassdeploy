import {Router, type Request, type Response } from "express";
import { students, courses } from "../db/db.js";
import { zCoursePostBody, zCoursePutBody,zCourseDeleteBody, zCourseId } from "../schemas/courseSchema.js"
import { type Course, type Student } from "../libs/types.js"
const router: Router = Router();

// READ all
router.get("/", (req: Request, res: Response) => {
  const result = students.map((std: Student) => {
    const coursesDetails = courses.filter((cou: Course) =>
      std.courses?.includes(cou.courseId)
    );
    return {
      studentId: std.studentId,
      firstName: std.firstName,
      lastName: std.lastName,
      program: std.program,
      courses: coursesDetails.map((cou: Course) => ({         
        courseId: cou.courseId,
        courseTitle: cou.courseTitle
      }))
   }
  })
  return res.json(result);
});

// Params URL 
router.get("/:courseId", async (req: Request, res: Response, next:Function) => {
  try {
    const courseId =  Number(req.params.courseId);
    const parseResult = zCourseId.safeParse(courseId);
    
    if (!parseResult.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parseResult.error.issues[0]?.message,
      });
    }

    const foundIndex = courses.findIndex( (c: Course) => c.courseId === courseId );
    
    if (foundIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Course does not exists",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Get course ${courseId} successfully`,
      data: courses[foundIndex]
    });
      
  } catch (err) {
    next(err);
  }
});

// CREATE //ต้องไปเพิ่ม setting postman header / boby -> row -> type json 
router.post("/", async(req: Request, res: Response,next:Function) => {
  try {
      const body = await req.body;
      // console.log(req.body,body);
      // เอา data ที่เป็น any type ไป validate โดยใช้ zod schema
      const result = zCoursePostBody.safeParse(body); // check zod
      if (!result.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: result.error.issues[0]?.message,
        });
      }
      //check duplicate course id
      const foundDupe = courses.find((couses:Course) => couses.courseId === req.body.courseId);
      if (foundDupe) {
        return res.status(409).json({ 
            success: false,
            message: "Course Id already exists" 
          });
      }

    const newCouse = body;
    courses.push(body);
    // add response header 'Link'
    res.set("Link", `/courses/${newCouse.courseId}`);

      //return res.json(newCouse);
    return res.status(201).json({
      success: true,
      message: `Course ${newCouse.courseId} has been added successfully`,
      data: newCouse,
    });
    // return res.json({ ok: true, message: "successfuly", newcouse: courses[newCouse - 1] });
  } catch (err) {
     return res.status(500).json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: err,
    });
  }
});

router.put("/", async(req: Request, res: Response,next:Function) => {
  try {
      const body = await req.body;
      // console.log(req.body,body);
      const parseResult = zCoursePutBody.safeParse(body);
      if (parseResult.success === false) {
    return res.status(400).json(
      {
        success: false,
        message: "Validation failed",
        errors:  parseResult.error.issues[0]?.message,
      },
    );
  }

  const foundIndex = courses.findIndex(
    (std) => std.courseId === body.courseId
  );
  if (foundIndex === -1) {
     return res.status(404).json({
        success: false,
        message: "Course Id does not exists",
      });
  }

  courses[foundIndex] = { ...courses[foundIndex], ...body };
  res.set("Link", `/courses/${body.courseId}`);
   return res.json({    
      success: true,
      message: `course ${body.courseId} has been updated successfully`,
      data: courses[foundIndex]
    });

  }catch(err){
   return res.status(500).json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: err,
    });
  }
});

router.delete("/", async (req: Request, res: Response, next: Function) => {
  try {
    const body = req.body;

    // Validate ด้วย Zod
    const parseResult = zCourseDeleteBody.safeParse(body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: parseResult.error.issues[0]?.message,
      });
    }

    const { courseId } = parseResult.data;

    // หา course ที่จะลบ
    const courseToDelete = courses.find(c => c.courseId === courseId);
    if (!courseToDelete) {
      return res.status(404).json({
         success: false,
         message: "Course Id does not exist",
      });
    }
    // ลบ course ออกจาก array
    const result = courses.filter(c => c.courseId !== courseId);

    return res.status(200).json({
      success: true,
      message: `Course ${body.courseId} has been deleted successfully`,
      data: courseToDelete,
    });

  } catch (err) {
     return res.status(500).json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: err,
    });
  }
});


export default router;