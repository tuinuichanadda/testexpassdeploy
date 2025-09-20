import express, {type Request, type Response} from "express";
import morgan from 'morgan';
import studentRoutes from "./routes/studentRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";

const app: any = express();
//Middleware
app.use(express.json());//ถ้าไม่ใส่ middleware นี้ req.body จะ ไม่ถูก parse
app.use(morgan('dev'));// ใช้ morgan ในโหมด "dev" (แสดง log แบบสั้นและมีสี)

app.use("/api/v2/students", studentRoutes);
app.use("/api/v2/courses", courseRoutes);

app.get("/me", (req: Request, res: Response) => {
  return res.status(200).json({
    studentId: "650610001",
    firstName: "Matt",
    lastName: "Damon",
    program: "CPE",
    section: "001"
  });
});

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);


export default app;