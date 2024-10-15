const express = require("express");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const prisma = new PrismaClient();
const app = express();
const saltRounds = 10;

app.use(express.json());

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  mobileNumber: Joi.string().required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  city: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

app.get("/register", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        password: true, 
      },
    });    
    res.json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password, mobileNumber, gender, city } = req.body;

  //validation all filed required
  if (!name && !email && !password && !mobileNumber && !gender && !city) {
    return res.status(400).json({ error: "All filed are required!" });
  }
  //validation for one filed
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    //email unique for validation
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // password create new hashcode
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        mobileNumber,
        gender,
        city,
      },
    });
    res.status(200).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Login failed", error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ message: "Login failed", error: "Invalid password" });
    }

    // Generate login token
    const token = jwt.sign({ userId: user.id }, "login api", {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: "Login failed", error: "Internal server error" });
  }
});
async function validateCredentials(email, password) {
  return true;
}
app.post("/logout", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const isValidCredentials = await validateCredentials(email, password);
  if (!isValidCredentials) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  res.json({ message: "logout successfully" });
});

module.exports = app;
