const express = require('express');
const { Event, Group, Venue, EventImage, Attendance, User, Membership } = require('../../db/models');
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

    // CURRENT USER MUST BE HOST OR COHOST
const userIsAtLeastCohost = async (req, res, next) => {
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
    const isCohost = await Attendance.findOne({
        where: {
            eventId: req.params.eventId,
            userId: req.user.id,
            status: 'co-host'
        }
    });

    if (!isHost && !isCohost) return res.status(403).json({ message: 'You the host or a cohost of this event for this action' });

    next();
}

    // MUST BE A MEMBER OF THE GROUP
const userIsMember = async (req, res, next) => {
    const members = await Event.findByPk(req.params.eventId, {
        include: {
            model: Group,
            include: {
                model: Membership
            }
        }
    });
    if (!members) return res.status(404).json({
        message: 'Event couldn\'t be found',
        statusCode: 404
    });

    let isMember = false;
    members.Group.Memberships.forEach(member => {
        if (member.userId === req.user.id && member.status !== 'pending') isMember = true;
    });

    if (!isMember) return res.status(403).json({ message: 'You must be a non-pending member of the group for this action.'} );

    next();
}

    // CURRENT USER MUST BE HOST OF GROUP ATTENDEE THAT IS GOING TO BE DELETED
const userIsHostOrBeingDeleted = async (req, res, next) => {
    const event = await Event.findByPk(req.params.eventId, {
        include: [
            {
                model: Attendance
            }
        ]
    });
    if (!event) return res.status(404).json({
        message: 'Event couldn\'t be found',
        statusCode: 404
    });

    let isBeingDeleted = false;
    event.Attendances.forEach(attendee => {
        if (req.user.id === attendee.userId && req.user.id === req.body.userId) isBeingDeleted = true;
    });

    const eventGroup = await Group.findByPk(event.groupId);
    const isOwner = eventGroup.organizerId === req.user.id;

    if (!isOwner && !isBeingDeleted) return res.status(403).json({
        message: 'Only the User or organizer may delete an Attendance',
        statusCode: 403
    });

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

// EDIT AN EVENT SPECIFIED BY ITS ID
router.put('/:eventId', requireAuth, userIsAtLeastCohost, async (req, res) => {
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
    const venue = await Venue.findByPk(venueId);
    if (!venue) return res.status(404).json({
        message: 'Venue couldn\'t be found',
        statusCode: 404
    });
    const event = await Event.findByPk(req.params.eventId);

    try {
        if (venueId) event.venueId = venueId;
        if (name) event.name = name;
        if (type) event.type = type;
        if (capacity) event.capacity = capacity;
        if (price) event.price = price;
        if (description) event.description = description;
        if (startDate) event.startDate = startDate;
        if (endDate) event.endDate = endDate;
        event.updatedAt = Date();

        await event.save();
    } catch (e) {
        return res.status(400).json({
            message: 'Validation error',
            statusCode: 400,
            errors: e.errors
        });
    }

    const confirm = await Event.findByPk(req.params.eventId, {
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    });

    res.json(confirm);
});

// DELETE AN EVENT SPECIFIED BY ITS ID
router.delete('/:eventId', requireAuth, userIsAtLeastCohost, async (req, res) => {
    const toDelete = await Event.findByPk(req.params.eventId);

    await toDelete.destroy();

    res.json({
        message: 'Successfully deleted'
    });
});

// GET ALL ATTENDEES OF AN EVENT SPECIFIED BY ITS ID
router.get('/:eventId/attendees', async (req, res) => {

    const event = await Event.findByPk(req.params.eventId, {
        include: {
            model: Attendance
        }
    });
    if (!event) return res.status(404).json({
        message: 'Event couldn\'t be found',
        statusCode: 404
    });

    let isCohost = false;
    event.Attendances.forEach(attendance => {
        if (attendance.userId === req.user.id && attendance.status === 'co-host') isCohost = true;
    });
    const eventsGroup = await Group.findByPk(event.groupId);
    const isOwner = eventsGroup.organizerId === req.user.id;

    const where = {};
    where.eventId = req.params.eventId;

    if (!isCohost && !isOwner) where.status = ['member', 'co-host', 'waitlist'];

    const attendees = await User.findAll({
        attributes: {
            exclude: ['username']
        },
        include: {
            model: Attendance,
            attributes: ['status'],
            where
        }
    });

    const results = {};
    results.Attendees = attendees;

    res.json(results);

});

// REQUEST TO ATTEND AN EVENT BASED ON THE EVENT'S ID
router.post('/:eventId/attendance', requireAuth, userIsMember, async (req, res) => {
    const event = await Event.findByPk(req.params.eventId, {
        include: {
            model: Attendance
        }
    });

    let currentStatus;
    event.Attendances.forEach(attendance => {
        if (attendance.userId === req.user.id) {
            if (attendance.status === 'pending') {
                currentStatus = 'pending';
            } else {
                currentStatus = 'true'
            }
        }
    });

    if (currentStatus === 'pending') {
        return res.status(400).json({
            message: 'Attendance has already been requested',
            statusCode: 400
        });
    } else if (currentStatus === 'true') {
        return res.status(400).json({
            message: 'User is already an attendee of the event',
            statusCode: 400
        });
    } else {
        try {
            const request = await Attendance.create({
                eventId: req.params.eventId,
                userId: req.user.id,
                status: 'pending'
            });
        } catch (e) {
            return res.status(400).json({
                message: 'Validation error',
                statusCode: 400,
                errors: e.errors
            });
        }
    }

    const confirm = await Attendance.findOne({
        where: {
            userId: req.user.id,
            eventId: req.params.eventId
        }
    });

    const results = {};
    results.userId = confirm.id;
    results.status = confirm.status;

    res.json(results);
});

// CHANGE TO STATUS OF A ATTENDANCE FOR AN EVENT SPECIFIED BY ID
router.put('/:eventId/attendance', requireAuth, userIsAtLeastCohost, async (req, res) => {
    if (req.body.status === 'pending') return res.status(400).json({
        message: 'Cannot change an attendance status to pending',
        statusCode: 400
    });

    const attendee = await Attendance.findOne({
        where: {
            userId: req.body.userId,
            eventId: req.params.eventId
        }
    });
    if (!attendee) return res.status(404).json({
        message: 'Attendance between the user and the evenet does not exist',
        statusCode: 404
    });

    try {
        attendee.status = req.body.status;
        attendee.save();
    } catch (e) {
        return res.status(400).json({
            message: 'Validation error',
            statusCode: 400,
            errors: e.errors
        });
    }

    const confirm = await Attendance.findOne({
        where: {
            eventId: req.params.eventId,
            userId: req.body.userId
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    });

    res.json(confirm);
});

// DELETE ATTENDANCE TO AN EVENT SPECIFIED BY ID
router.delete('/:eventId/attendance', requireAuth, userIsHostOrBeingDeleted, async (req, res) => {
    const attendee = await Attendance.findOne({
        where: {
            eventId: req.params.eventId,
            userId: req.body.userId
        }
    });
    if (!attendee) return res.status(404).json({
        message: 'Attendance does not exist for this User',
        statusCode: 404
    });

    await attendee.destroy();

    res.json({
        message: 'Successfully deleted attendance from event'
    });
});

module.exports = router;
