
require('dotenv').config()
const express = require("express");
const cors = require("cors")
// const Stripe = require("stripe")
const bodyParser = require('body-parser');
const PORT = process.env.PORT;
const app = express();
const userRoutes = require('./routes/userRoute')
const courseRoutes = require('./routes/courseRoute')
const lessonsRoutes = require('./routes/lessonsRoute')
const enrollmentRoutes = require('./routes/enrollmentRoute')
const course_lessonsRoutes = require('./routes/course_lessons')
const lessons_progressRoutes = require('./routes/lesson_progress')
const quizRoutes = require('./routes/quizRoute')
const quiz_questions = require('./routes/quiz_questionsRoute')
const course_desc = require('./routes/course_desc_route')
const review = require('./routes/reviewRoute')
const certificate = require('./routes/certificate')
const fileUpload = require("express-fileupload");


const { SquareClient, SquareEnvironment } = require("square");


app.use(fileUpload({
  useTempFiles: true
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
app.use("/api/quiz", quizRoutes);
app.use("/api/quiz_questions", quiz_questions);
app.use("/api/events", course_desc);
app.use("/api/reviews", review);
app.use("/api/certificate", certificate);

// stripe



const client = new SquareClient({
  token: process.env.SQUARE_SECRET_KEY,
  environment: SquareEnvironment.Production,
});




app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const { token, amount } = req.body; // token from frontend
 
    if (!token || !amount) {
      return res.status(400).json({ error: "Missing token or amount" });
    }


    const amountInCents = Math.round(Number(amount) * 100);
    // Create payment
    const payment = await client.payments.create({
      sourceId: token, // Frontend token
      idempotencyKey: crypto.randomUUID(), // unique key per request
      amountMoney: {
        amount: BigInt(amountInCents),
        currency: "USD", // adjust if needed
      },
    });
  

    const safePayment = JSON.parse(
      JSON.stringify(payment, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
    res.status(200).json({
      success: true,
      payment: safePayment
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});




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