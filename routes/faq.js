import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const faqsFilePath = path.join(__dirname, "../faqs.json");

// Function to read FAQs from the file
const readFaqsFromFile = () => {
  if (!fs.existsSync(faqsFilePath)) {
    return [];
  }
  const data = fs.readFileSync(faqsFilePath, "utf8");
  return JSON.parse(data);
};

// Function to write FAQs to the file
const writeFaqsToFile = (faqs) => {
  fs.writeFileSync(faqsFilePath, JSON.stringify(faqs, null, 2));
};

let FAQs = readFaqsFromFile();

// Get all questions
router.get("/", (req, res) => {
  res.send(FAQs);
});

// Post a new question
router.post("/question", (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).send({ error: "Question is required" });
  }

  const newId = FAQs.length ? FAQs[FAQs.length - 1].id + 1 : 1;
  const newQuestion = { id: newId, question, status: "pending", answer: null };

  FAQs.push(newQuestion);
  writeFaqsToFile(FAQs);

  res.status(201).send(newQuestion);
});

// Post an answer to a question
router.post("/answer/:id", (req, res) => {
  const { id } = req.params;
  const { answer } = req.body;

  const question = FAQs.find((q) => q.id == id);
  if (!question) {
    return res.status(404).send({ error: "Question not found" });
  }

  if (!answer) {
    return res.status(400).send({ error: "Answer is required" });
  }

  question.answer = answer;
  question.status = "answered";
  writeFaqsToFile(FAQs);

  res.status(200).send(question);
});

// Update a question
router.put("/question/:id", (req, res) => {
  const { id } = req.params;
  const { question } = req.body;

  const faq = FAQs.find((q) => q.id == id);
  if (!faq) {
    return res.status(404).send({ error: "Question not found" });
  }

  if (!question) {
    return res.status(400).send({ error: "Question is required" });
  }

  faq.question = question;
  writeFaqsToFile(FAQs);

  res.status(200).send(faq);
});

// Update an answer
router.put("/answer/:id", (req, res) => {
  const { id } = req.params;
  const { answer } = req.body;

  const faq = FAQs.find((q) => q.id == id);
  if (!faq) {
    return res.status(404).send({ error: "Question not found" });
  }

  if (!answer) {
    return res.status(400).send({ error: "Answer is required" });
  }

  faq.answer = answer;
  faq.status = "answered";
  writeFaqsToFile(FAQs);

  res.status(200).send(faq);
});

// Partially update a question
router.patch("/question/:id", (req, res) => {
  const { id } = req.params;
  const { question } = req.body;

  const faq = FAQs.find((q) => q.id == id);
  if (!faq) {
    return res.status(404).send({ error: "Question not found" });
  }

  if (question !== undefined) {
    faq.question = question;
  }

  writeFaqsToFile(FAQs);

  res.status(200).send(faq);
});

// Partially update an answer
router.patch("/answer/:id", (req, res) => {
  const { id } = req.params;
  const { answer } = req.body;

  const faq = FAQs.find((q) => q.id == id);
  if (!faq) {
    return res.status(404).send({ error: "Question not found" });
  }

  if (answer !== undefined) {
    faq.answer = answer;
    faq.status = "answered";
  }

  writeFaqsToFile(FAQs);

  res.status(200).send(faq);
});

export default router;
