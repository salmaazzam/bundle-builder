import { Router } from "express";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(
  readFileSync(join(__dirname, "../../data/products.json"), "utf-8")
);

const router = Router();

router.get("/", (_req, res) => {
  res.json(data);
});

export default router;
