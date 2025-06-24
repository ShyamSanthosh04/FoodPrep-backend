const express = require("express");
const fs = require("fs");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/role");
const router = express.Router();

const FILE = "./recipes.json";

// Read & write helpers
const getRecipes = () => JSON.parse(fs.readFileSync(FILE));
const saveRecipes = (data) =>
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

// GET all recipes
router.get("/", (req, res) => {
  const recipes = getRecipes();
  res.json(recipes);
});

// POST create recipe
router.post("/", auth, roleCheck(["chef", "admin"]), (req, res) => {
  const recipes = getRecipes();
  const newRecipe = { id: Date.now(), ...req.body, createdBy: req.user.id };
  recipes.push(newRecipe);
  saveRecipes(recipes);
  res.json(newRecipe);
});

// PUT update recipe
router.put("/:id", auth, roleCheck(["chef", "admin"]), (req, res) => {
  let recipes = getRecipes();
  const index = recipes.findIndex((r) => r.id == req.params.id);
  if (index === -1) return res.status(404).json({ msg: "Recipe not found" });

  recipes[index] = { ...recipes[index], ...req.body };
  saveRecipes(recipes);
  res.json(recipes[index]);
});

// DELETE recipe
router.delete("/:id", auth, roleCheck(["admin"]), (req, res) => {
  let recipes = getRecipes();
  recipes = recipes.filter((r) => r.id != req.params.id);
  saveRecipes(recipes);
  res.json({ msg: "Deleted" });
});

module.exports = router;
