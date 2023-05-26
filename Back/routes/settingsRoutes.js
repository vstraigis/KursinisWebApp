const authorization = require("../middleware/authorization");
const router = require("express").Router();
const db = require("../db");

router.put('/update', authorization, async (req, res) => {
    // Update user information logic here

    const id = req.user;
    const { firstName, lastName, birthDate } = req.body;

    try {
        const updatedUser = await db.user.update({
            where: { id: parseInt(id) },
            data: {
                name: firstName,
                lastName: lastName,
                birthDay: new Date(birthDate),
            },
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: 'Error updating user information' });
    }
});

router.put('/changepassword', authorization, async (req, res) => {
    const id = req.user;

    const { newPassword } = req.body;

    try {
        // Encrypt the new password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const encryptedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user password in the database
        const updatedUser = await db.user.update({
            where: { id: parseInt(id) },
            data: { password: encryptedPassword },
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: 'Error changing user password' });
    }
});

router.delete("/delete", authorization, async (req, res) => {
    const id = req.user;

    try {
        // Delete the associated lake visits
        await db.lakeVisit.deleteMany({
            where: {
                userId: parseInt(id),
            },
        });

        // Delete the associated licenses
        await db.license.deleteMany({
            where: {
                userId: parseInt(id),
            },
        });
        // Delete the associated trips
        await db.trip.deleteMany({
            where: {
                userId: parseInt(id),
            },
        });

        // Delete the user
        const deletedUser = await db.user.delete({
            where: {
                id: parseInt(id),
            },
        });

        res.json({ message: "User deleted" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Error deleting user" });
    }
});

module.exports = router;