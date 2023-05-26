const authorization = require("../middleware/authorization");
const router = require("express").Router();
const db = require("../db");

router.get("/", authorization, async (req, res) => {
  try {
    const userId = req.user;

    // Fetch licenses from the database
    const licenses = await db.license.findMany({
      where: { userId: parseInt(userId) },
    });

    // Send the licenses as a response
    res.json(licenses);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching licenses");
  }
});

router.post("/", authorization, async (req, res) => {
  try {
    const userId = req.user;
    const licenseData = req.body;

    // Save a new license
    const newLicense = await db.license.create({
      data: {
        startDate: new Date(licenseData.startDate),
        endDate: new Date(licenseData.endDate),
        description: licenseData.description,
        user: {
          connect: { id: parseInt(userId) },
        },
      },
    });

    // Send the new license as a response
    res.status(201).json(newLicense);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving license");
  }
});

router.put("/id", authorization, async (req, res) => {
  try {
    const  licenseId  = req.headers.licenseid;
    const licenseData = req.body;

    // Update an existing license
    const updatedLicense = await db.license.update({
      where: {
        id: parseInt(licenseId),
      },
      data: {
        startDate: new Date(licenseData.startDate),
        endDate: new Date(licenseData.endDate),
        description: licenseData.description,
      },
    });

    // Send the updated license as a response
    res.status(200).json(updatedLicense);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating license");
  }
});

router.delete("/id", authorization, async (req, res) => {
  try {
    const userId = req.user;
    const licenseId   = req.headers.licenseid;

    // Check if the license exists with the given userId and licenseId
    const license = await db.license.findFirst({
      where: {
        id: parseInt(licenseId),
        userId: parseInt(userId),
      },
    });

    if (!license) {
      res.status(404).send("License not found");
      return;
    }

    // Delete the license from the database
    const deletedLicense = await db.license.delete({
      where: {
        id: parseInt(licenseId),
      },
    });

    // Send the deleted license as a response
    res.status(200).json(deletedLicense);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting license");
  }
});

module.exports = router;