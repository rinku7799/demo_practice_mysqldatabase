const express = require("express");
const { PrismaClient } = require("@prisma/client");
const app = express();
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const saltRounds = 10;

app.use(express.json());

// Create a new user profile
app.post("/userprofile", async (req, res) => {
  const { name, email, password, mobileNumber, gender, city } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUserprofile = await prisma.userprofile.create({
      data: {
        name,
        email,
        password: hashedPassword,
        mobileNumber,
        gender,
        city,
      },
    });
    res.json(newUserprofile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/userprofile", async (req, res) => {
  const { name, email, password, mobileNumber, gender, city } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUserprofile = await prisma.userprofile.create({
      data: {
        name,
        email,
        password: hashedPassword,
        mobileNumber,
        gender,
        city,
      },
    });
    res.json(newUserprofile);
  } catch(error) {
    res.status(400).json({error: error.message})
  }
});

// Update user profile
app.put("/userprofile/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password, mobileNumber, gender, city } = req.body;
  try {
    let dataToUpdate = { name, email, mobileNumber, gender, city };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      dataToUpdate.password = hashedPassword;
    }
    const newUserprofile = await prisma.userprofile.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });
    res.json(newUserprofile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Display a user profile
app.get("/userprofile/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const newUserprofile = await prisma.userprofile.findUnique({
      where: { id: Number(id) },
    });
    // console.log(Number(id))
    res.json(newUserprofile);
  } catch (error) {
    res.status(404).json({ error: "User not found" });
  }
});

// List all user profiles
app.get("/userprofile", async (req, res) => {
  try {
    const newUserprofile = await prisma.userprofile.findMany();
    res.json(newUserprofile);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = app;
