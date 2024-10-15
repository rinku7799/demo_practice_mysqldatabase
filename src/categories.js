const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();

router.post("/items", async (req, res) => {
  const { name, parentId, images } = req.body;
  console.log("name12",name);
  try {
    const newItem = await prisma.item.create({
      data: {
        name,
        parentId,
        images: {
          create: images.map((url) => ({ url })),
        },
      },
      include: {
        images: true,
      },
    });

    res.status(200).json(newItem);
  } catch (error) {
    console.error("Error creating item:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

router.get("/items", async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      where: {
        parentId: null,
      },
      include: {
        children: {
          include: {
            // images: true,
            children: {
              include: {
                // images: true,
                children: {
                  include: {
                    images: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    const formattedItems = items.map((item) => ({
      ...item,
      subservice: item.children.map((subservice) => ({
        ...subservice,
        subsubservice: subservice.children.map((subsubservice) => ({
          ...subsubservice,
          subsubsubservice: subsubservice.children,
          children: undefined,
        })),
        children: undefined,
      })),
      children: undefined,
    }));
    res.status(200).json(formattedItems);
  } catch (error) {
    console.error("Error fetching items:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

router.post("/itemsdetail", async (req, res) => {
  const { id } = req.body;

  try {
    const itemDetail = await prisma.item.findUnique({
      where: { id: parseInt(id) },
      include: {
        images: true,
        children: true,
      },
    });

    if (!itemDetail) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json({
      id: itemDetail.id,
      title: itemDetail.title,
      description: itemDetail.description,
      images: itemDetail.images,
    });
  } catch (error) {
    console.error("Error fetching item details:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

module.exports = router;