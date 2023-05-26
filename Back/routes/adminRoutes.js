const admincheck = require("../middleware/admincheck");
const router = require("express").Router();
const db = require("../db");

router.get('/lakes', admincheck, async (req, res) => {
    try {
        const lakes = await db.lake.findMany();
        res.json(lakes);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching lakes');
    }
});

router.put('/lakes/:id', admincheck, async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { name, isRented, isPrivate } = req.body;

        await db.lake.update({
            where: { id },
            data: { name, isRented, isPrivate },
        });

        res.status(200).send('Lake updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating lake');
    }
});

router.delete('/lakes/:id', admincheck, async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        // First, delete the related rows in the LakeVisit table
        await db.lakeVisit.deleteMany({
            where: { lakeId: id },
        });

        // Now you can delete the lake
        await db.lake.delete({
            where: { id },
        });

        res.status(200).send('Lake deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting lake');
    }
});

module.exports = router;