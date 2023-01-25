const express = require('express');
const { Venue, Group, Membership } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');


const router = express.Router();

// AUTHORIZATION MIDDLEWARE

    // CURRENT USER MUST BE ORGANIZER OR A MEMBER WITH COHOST STATUS
    const userIsAtLeastCohost = async (req, res, next) => {

        const venue = await Venue.findByPk(req.params.venueId);
        if (!venue) return res.status(404).json({
            message: 'Venue couldn\'t be found',
            statusCode: 404
        });
        const groupId = venue.groupId;

        const group = await Group.findByPk(groupId, {
            include: [
                {
                    model: Membership
                }
            ]
        });

        let permission = false;
        const obj = group.toJSON();

        if (obj.organizerId === req.user.id) permission = true;

        obj.Memberships.forEach(member => {
            if (member.userId === req.user.id && member.status === 'co-host') permission = true;
        });

        if (!permission) return res.status(401).json({ message: 'In order to do this action, you must be either the group\'s organizer or co-host.' });

        next();
    }

router.put('/:venueId', requireAuth, userIsAtLeastCohost, async (req, res) => {
    const venue = await Venue.findByPk(req.params.venueId);
    if (!venue) return res.status(404).json({
        message: 'Venue couldn\'t be found',
        statusCode: 404
    });
    const { address, city, state, lat, lng } = req.body;

    try {
        if (address) venue.address = address;
        if (city) venue.city = city;
        if (state) venue.state = state;
        if (lat) venue.lat = lat;
        if (lng) venue.lng = lng;
        venue.updateAt = Date();

        await venue.save()
    } catch (e) {
        return res.status(400).json({
            message: 'Validation error',
            statusCode: 400,
            errors: e.errors
        });
    }

    const confirm = await Venue.findByPk(req.params.venueId);

    res.json(confirm);
});

module.exports = router;
