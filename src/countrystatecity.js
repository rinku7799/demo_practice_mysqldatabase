const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();

router.post("/country", async (req, res) => {
    const { name } = req.body;
  
    try {
      const country = await prisma.country.create({
        data: { name },
      });
      res.status(200).json(country);
    } catch (error) {
      console.error("Error creating country:", error);
      res.status(500).json({ error: "Error creating country" });
    }
  });
  
  
  router.get("/country", async (req, res) => {
    try {
      const countries = await prisma.country.findMany();
      res.status(200).json(countries);
    } catch (error) {
      res.status(500).json({ error: "Error fetching countries" });
    }
  });
  
  
router.post("/state", async (req, res) => {
    const { name, countryId } = req.body;
  
    try {
      const state = await prisma.state.create({
        data: {
          name,
          country: {
            connect: { id: countryId },
          },
        },
      });
      res.status(201).json(state);
    } catch (error) {
      res.status(500).json({ error: "Error creating state" });
    }
  });
  
  router.post("/state/show", async (req, res) => {
    const { countryId } = req.body;
  
    try {
      const states = await prisma.state.findMany({
        where: {
          countryId: parseInt(countryId),
        },
      });
      res.status(200).json(states);
    } catch (error) {
      res.status(500).json({ error: "Error fetching states" });
    }
  });
  
  router.post("/city", async (req, res) => {
    const { name, stateId } = req.body;
  
    try {
      const city = await prisma.city.create({
        data: {
          name,
          state: {
            connect: { id: stateId },
          },
        },
      });
      res.status(201).json(city);
    } catch (error) {
      res.status(500).json({ error: "Error creating city" });
    }
  });
  
  router.post("/city/show", async (req, res) => {
    const { stateId } = req.body;
  
    try {
      const cities = await prisma.city.findMany({
        where: {
          stateId: parseInt(stateId),
        },
      });
      res.status(200).json(cities);
    } catch (error) {
      res.status(500).json({ error: "Error fetching cities" });
    }
  });
  

module.exports = router;