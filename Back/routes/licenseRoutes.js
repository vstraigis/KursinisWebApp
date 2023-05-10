const authorization = require("../middleware/authorization");
const router = require("express").Router();
const db = require("../db");

router.get("/:userId", authorization, async (req, res) => {
  try {
    const { userId } = req.params;

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

router.post("/:userId", authorization, async (req, res) => {
  try {
    const { userId } = req.params;
    const { newLicenses, existingLicenses } = req.body; // Destructure new and existing licenses from the request body

    // Save new licenses to the database
    await Promise.all(
      newLicenses.map((license) =>
        db.license.create({
          data: {
            startDate: new Date(license.startDate),
            endDate: new Date(license.endDate),
            description: license.description,
            user: {
              connect: { id: parseInt(userId) },
            },
          },
        })
      )
    );

    // Update existing licenses in the database
    await Promise.all(
      existingLicenses.map((license) =>
        db.license.update({
          where: { id: license.id },
          data: {
            startDate: new Date(license.startDate),
            endDate: new Date(license.endDate),
            description: license.description,
          },
        })
      )
    );

    // Fetch the updated list of licenses from the database
    const updatedLicenses = await db.license.findMany({
      where: { userId: parseInt(userId) },
    });

    // Send the updated licenses as a response
    res.status(201).json(updatedLicenses);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving licenses");
  }
});

router.delete("/:userId/:licenseId", authorization, async (req, res) => {
  try {
    const { userId, licenseId } = req.params;

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