import express from "express";
import subscribersRouter from "./routes/subscribers.js";
import reviewsRouter from "./routes/reviews.js";
import faqRouter from "./routes/faq.js";
const app = express();
const port = 8010;

app.use(express.json()); // Middleware to parse JSON bodies

app.use("/subscribers", subscribersRouter);
app.use("/reviews", reviewsRouter);
app.use("/faq", faqRouter);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
