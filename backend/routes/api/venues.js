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

        if (!permission) return res.status(403).json({
            message: 'Forbidden',
            statusCode: 403
        });

        next();
    }

router.put('/:venueId', requireAuth, userIsAtLeastCohost, async (req, res) => {
    const venue = await Venue.findByPk(req.params.venueId);
    if (!venue) return res.status(404).json({
        message: 'Venue couldn\'t be found',
        statusCode: 404
    });
    const { address, city, state, lat, lng } = req.body;

    const errors = {};

    if (!address) errors.address = 'Street address is required';
    if (!city) errors.city = 'City is required';
    if (!state) errors.state = 'State is required';
    if (+lat > 90 || +lat < -90) errors.lat = 'Latitude is not valid';
    if (+lng > 180 || +lng < -180) errors.lng = 'Longitude is not valid';

    if(Object.keys(errors)[0]) return res.status(400).json({
        message: 'Validation error',
        statusCode: 400,
        errors
    });

    try {
        venue.address = address;
        venue.city = city;
        venue.state = state;
        venue.lat = lat;
        venue.lng = lng;
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
