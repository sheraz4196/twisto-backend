import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reviewsFilePath = path.join(__dirname, "../reviews.json");

const readReviewsFromFile = () => {
  if (!fs.existsSync(reviewsFilePath)) {
    return [];
  }
  const data = fs.readFileSync(reviewsFilePath, "utf8");
  return JSON.parse(data);
};

const writeReviewsToFile = (reviews) => {
  fs.writeFileSync(reviewsFilePath, JSON.stringify(reviews, null, 2));
};

const formatDate = (date) => {
  const options = { year: "numeric", month: "long", day: "2-digit" };
  return date.toLocaleDateString("en-GB", options).replace(",", "");
};

let Reviews = readReviewsFromFile();

router.get("/", (req, res) => {
  res.send(Reviews);
});

router.post("/", (req, res) => {
  const { userInfo, review } = req.body;
  if (!userInfo || !review) {
    return res.status(400).send({ error: "User info and review are required" });
  }

  const newId = Reviews.length ? Reviews[Reviews.length - 1].id + 1 : 1;
  const newReview = {
    id: newId,
    userInfo,
    review,
    uploaded_on: formatDate(new Date()),
  };

  Reviews.push(newReview);
  writeReviewsToFile(Reviews);

  res.status(201).send(newReview);
});

export default router;
