const express = require("express");
const router = express.Router();
const fs = require("fs");

const authenticate = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

const recipesFile = "./recipes.json";

router.get("/", (req, res) => {
  const data = JSON.parse(fs.readFileSync(recipesFile));
  res.json(data);
});

router.post("/", authenticate, authorizeRoles("admin", "chef"), (req, res) => {
  const recipes = JSON.parse(fs.readFileSync(recipesFile));
  const newRecipe = { ...req.body, id: Date.now() };
  recipes.push(newRecipe);
  fs.writeFileSync(recipesFile, JSON.stringify(recipes));
  res.status(201).json({ message: "Recipe created" });
});

router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin", "chef"),
  (req, res) => {
    const recipes = JSON.parse(fs.readFileSync(recipesFile));
    const index = recipes.findIndex((r) => r.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: "Not found" });
    recipes[index] = { ...recipes[index], ...req.body };
    fs.writeFileSync(recipesFile, JSON.stringify(recipes));
    res.json({ message: "Recipe updated" });
  }
);

router.delete("/:id", authenticate, authorizeRoles("admin"), (req, res) => {
  const recipes = JSON.parse(fs.readFileSync(recipesFile));
  const filtered = recipes.filter((r) => r.id != req.params.id);
  fs.writeFileSync(recipesFile, JSON.stringify(filtered));
  res.json({ message: "Recipe deleted" });
});

module.exports = router;
