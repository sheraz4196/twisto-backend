import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const subscribersFilePath = path.join(__dirname, "../subscribers.json");

const readSubscribersFromFile = () => {
  if (!fs.existsSync(subscribersFilePath)) {
    return [];
  }
  const data = fs.readFileSync(subscribersFilePath, "utf8");
  return JSON.parse(data);
};

const writeSubscribersToFile = (subscribers) => {
  fs.writeFileSync(subscribersFilePath, JSON.stringify(subscribers, null, 2));
};

let Subscribers = readSubscribersFromFile();

router.get("/", (req, res) => {
  res.send(Subscribers);
});

router.post("/", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send({ error: "Email is required" });
  }

  const emailExists = Subscribers.some(
    (subscriber) => subscriber.email === email
  );
  if (emailExists) {
    return res.status(409).send({ error: "Email already exists" });
  }

  const newId = Subscribers.length
    ? Subscribers[Subscribers.length - 1].id + 1
    : 1;
  const newSubscriber = { id: newId, email };

  Subscribers.push(newSubscriber);
  writeSubscribersToFile(Subscribers);

  res.status(201).send(newSubscriber);
});

export default router;
