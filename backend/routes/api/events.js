const express = require('express');
const { Event, Group, Venue, EventImage, Attendance } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { Op } = require('sequelize');

const router = express.Router();

// AUTHORIZATION MIDDLEWARE

    // CURRENT USER MUST BE AN ATTENDEE, HOST, OR COHOST OF EVENT
const userIsAtLeastAttendee = async (req, res, next) => {
    const event = await Event.findByPk(req.params.eventId);
    if (!event) return res.status(400).json({
        message: 'Event couldn\'t be found',
        statusCode: 404
    });

    const isHost = await Group.findOne({
        where: {
            id: event.groupId,
            organizerId: req.user.id
        }
    });
    const isPart = await Attendance.findOne({
        where: {
            eventId: req.params.eventId,
            userId: req.user.id,
            status: {
                [Op.or]: ['co-host', 'member']
            }
        }
    });

    if (!isHost && !isPart) return res.status(403).json({ message: 'You must belong to this event for this action' });

    next();
}

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

// GET DETAILS OF AN EVENT SPECIFIED BY ITS ID
router.get('/:eventId', async (req, res) => {
    const event = await Event.findByPk(req.params.eventId, {
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        include: [
            {
                model: Attendance
            },
            {
                model: Group,
                attributes: ['id', 'name', 'private', 'city', 'state']
            },
            {
                model: Venue,
                attributes: ['id', 'address', 'city', 'state', 'lat', 'lng']
            },
            {
                model: EventImage,
                attributes: ['id', 'url', 'preview']
            }
        ]
    });
    if (!event) return res.status(404).json({
        message: 'Event couldn\'t be found',
        statusCode: 404
    });

    const detailed = event.toJSON();

    let count = 0;
    const nonMems = ['pending', 'waitlist'];
    detailed.Attendances.forEach(member => {
        if (! nonMems.includes(member.status)) count++;
    });
    detailed.numMembers = count;
    delete detailed.Attendances;

    res.json(detailed);
});

// ADD AN IMAGE TO AN EVENT BASED ON THE EVENT'S ID
router.post('/:eventId/images', requireAuth, userIsAtLeastAttendee, async (req, res) => {
    const { url, preview } = req.body;

    try {
        const newImg = await EventImage.create({
                eventId: req.params.eventId,
                url,
                preview
            });
    } catch(e) {
        return res.status(400).json({
            message: 'Validation error',
            statusCode: 400,
            errors: e.errors
        });
    }

    const confirm = await EventImage.findOne({
        attributes:{
            exclude: ['createdAt', 'updatedAt']
        },
        where: {
            eventId: req.params.eventId,
            url
        }
    });

    res.json(confirm);
});

module.exports = router;
