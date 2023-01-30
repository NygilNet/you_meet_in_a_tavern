const express = require('express');
const { EventImage, Event, Group, Attendance } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

// AUTHORIZATION MIDDLEWARE

    // CURRENT USER MUST BE HOST OR COHOST
    const userIsAtLeastCohost = async (req, res, next) => {
        const img = await EventImage.findByPk(req.params.imageId);
        if (!img) return res.status(400).json({
            message: 'Group Image couldn\'t be found',
            statusCode: 404
        });
    const eventId = img.eventId;

    const event = await Event.findByPk(eventId);
    const group = await Group.findByPk(event.groupId);
    const isHost = group.organizerId === req.user.id;

        const isCohost = await Attendance.findOne({
            where: {
                eventId: eventId,
                userId: req.user.id,
                status: 'co-host'
            }
        });

        if (!isHost && !isCohost) return res.status(403).json({
            message: 'Forbidden',
            statusCode: 403
        });

        next();
    }

router.delete('/:imageId', requireAuth, userIsAtLeastCohost, async (req, res) => {
    const toDelete = await EventImage.findByPk(req.params.imageId);

    await toDelete.destroy();

    res.json({
        message: 'Successfully deleted',
        statusCode: 200
    });
});

module.exports = router;
