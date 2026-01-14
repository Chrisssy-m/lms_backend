
const express = require("express");
const cors = require("cors")
const bodyParser = require('body-parser');
const PORT = 8000;
const app = express();
const userRoutes = require('./routes/userRoute')
const courseRoutes = require('./routes/courseRoute')
const lessonsRoutes = require('./routes/lessonsRoute')
const enrollmentRoutes = require('./routes/enrollmentRoute')
const course_lessonsRoutes = require('./routes/course_lessons')
const lessons_progressRoutes = require('./routes/lesson_progress')

const fileUpload = require("express-fileupload");

app.use(fileUpload({
  useTempFiles:true
}))
// plugins
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json());


// routes
// app.use('/api/auth/register', userRegister)
// app.use('/api/auth/login', useLogin)

// middlewares

// app.use(authentication())



// post routes
// app.use('/api/posts', usePosts)

app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonsRoutes);
app.use("/api/enrollment", enrollmentRoutes);
app.use("/api/course_lessons", course_lessonsRoutes);
app.use("/api/lesson_progress", lessons_progressRoutes);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


// Global Error Handling
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception!", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 Unhandled Rejection!", reason);
  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  console.log("🔹 SIGTERM received");
  server.close(() => console.log("🔹 Process terminated"));
});

process.on("SIGINT", () => {
  console.log("🔹 SIGINT received");
  server.close(() => console.log("🔹 Process terminated"));
});