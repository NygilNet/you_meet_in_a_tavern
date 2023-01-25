const express = require('express');
const { Event, Group, Venue, EventImage, Attendance } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

// GET ALL EVENTS
router.get('/', async (req, res) => {
    const events = await Event.findAll({
        attributes: {
            exclude: ['description', 'capacity', 'price', 'createdAt', 'updatedAt']
        },
        include: [
            {
                model: Attendance
            },
            {
                model: EventImage
            },
            {
                model: Group,
                attributes: ['id', 'name', 'city', 'state']
            },
            {
                model: Venue,
                attributes: ['id', 'city', 'state']
            }
        ]
    });

    const eventsList = [];

    events.forEach(event => {
        eventsList.push(event.toJSON());
    });

    eventsList.forEach(event => {

        let count = 0;
        const nonMems = ['pending', 'waitlist'];
        event.Attendances.forEach(member => {
            if (! nonMems.includes(member.status)) count++;
        })
        event.numMembers = count;
        delete event.Attendances;

        event.EventImages.forEach(img => {
            if (img.preview === true) event.previewImage = img.url;
        });
        if (!event.previewImage) event.previewImage = 'no preview image provided';
        delete event.EventImages;
    })

    res.json(eventsList);
});

module.exports = router;
