const express = require('express');
const { Group, GroupImage, Membership, Venue, User, Event, EventImage, Attendance } = require('../../db/models');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');

const router = express.Router();

// AUTHORIZATION MIDDLEWARE

    // CURRENT USER MUST BE THE ORGANIZER FOR THE GROUP
const userIsOrganizer = async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId);

    if (!group) return res.status(404).json({
        messaage: 'Group couldn\'t be found',
        statusCode: 404
    });

    if (group.organizerId !== req.user.id) return res.status(403).json({
        message: 'Forbidden',
        statusCode: 403
    });

    next();
}

    // CURRENT USER MUST BE ORGANIZER OR A MEMBER WITH COHOST STATUS
const userIsAtLeastCohost = async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId, {
        include: [
            {
                model: Membership
            }
        ]
    });
    if (!group) return res.status(404).json({
        messaage: 'Group couldn\'t be found',
        statusCode: 404
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

    // CHANGE STATUS AUTHORIZATION
const changeStatusAuth = async (req, res, next) => {
    if (req.body.status === 'pending') return res.status(400).json({
        message: 'Validations Error',
        statusCode: 400,
        errors: {
            status: 'Cannot change a membership status to pending'
        }
    });
    const group = await Group.findByPk(req.params.groupId, {
        include: [
            {
                model: Membership
            }
        ]
    });
    if (!group) return res.status(404).json({
        messaage: 'Group couldn\'t be found',
        statusCode: 404
    });
    let coHostPermission = false;
    const obj = group.toJSON();

    if (req.body.status === 'co-host' && obj.organizerId !== req.user.id) return res.status(401).json({message: 'Must be group organizer to change member to co-host'})

    obj.Memberships.forEach(member => {
        if (member.userId === req.user.id && member.status === 'co-host') coHostPermission = true;
    });

    if (req.body.status === 'member' && (obj.organizerId !== req.user.id && !coHostPermission)) return res.status(401).json({ message: 'Must be organizer or cohost to change status to member' });

    next();
}

// CURRENT USER MUST BE HOST OF THE GROUP OR THE MEMBER THAT IS GOING TO BE DELETED
const userIsHostOrBeingDeleted = async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId, {
        include: [
            {
                model: Membership
            }
        ]
    });
    if (!group) return res.status(404).json({
        messaage: 'Group couldn\'t be found',
        statusCode: 404
    });


    let isBeingDeleted = false;
    group.Memberships.forEach(member => {
        if (req.user.id === member.userId && member.id === req.body.memberId) isBeingDeleted = true;
    });


    if (group.organizerId !== req.user.id && !isBeingDeleted) return res.status(401).json({ message: 'Must be organizer or user to delete membership' });

    next();
}

// GET ALL GROUPS
router.get('/', async (req, res) => {
    const groups = await Group.findAll({
        include: [
            {
                model: Membership
            },
            {
                model: GroupImage
            }
        ]
    });

    const groupsList = [];

    groups.forEach(group => {
        groupsList.push(group.toJSON());
    });

    groupsList.forEach(group => {

        let count = 0;
        const nonMems = ['pending', 'waitlist'];
        group.Memberships.forEach(member => {
            if (! nonMems.includes(member.status)) count++;
        })
        group.numMembers = count;
        delete group.Memberships;

        group.GroupImages.forEach(img => {
            if (img.preview === true) group.previewImage = img.url;
        });
        if (!group.previewImage) group.previewImage = 'no preview image provided';
        delete group.GroupImages;
    })


    res.json(groupsList);
});

// GET ALL GROUPS JOINED OR ORGANIZED BY THE CURRENT USER
router.get('/current', requireAuth, async (req, res) => {

    const userId = req.user.id;

    const groups = await Group.findAll({
        include: [
            {
                model: Membership,

            },
            {
                model: GroupImage

            }
        ]
    });

    const userGroups = [];

    groups.forEach(group => {
        const grp = group.toJSON();

        if (grp.organizerId === userId) {
            userGroups.push(grp);
            grp.inArray = true;
        }

        grp.Memberships.forEach (member => {
            if (member.userId === userId && !grp.inArray) {
                userGroups.push(grp);
                grp.inArray = true;
            }
        })
    });

    userGroups.forEach(group => {

        let count = 0;
        const nonMems = ['pending', 'waitlist'];
        group.Memberships.forEach(member => {
            if (! nonMems.includes(member.status)) count++;
        })
        group.numMembers = count;
        delete group.Memberships;

        group.GroupImages.forEach(img => {
            if (img.preview === true) group.previewImage = img.url;
        });
        if (!group.previewImage) group.previewImage = 'no preview image provided';
        delete group.GroupImages;

        delete group.inArray;
    });

    res.json(userGroups);
});

// GET DETAILS OF A GROUP FROM AN ID
router.get('/:groupId', async (req, res) => {
    const id = req.params.groupId;

    const group = await Group.findByPk(id, {
        include: [
            {
                model: Membership
            },
            {
                model: GroupImage
            },
            {
                model: Venue,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            }
        ]
    });

    if (!group) return res.status(404).json({
        message: 'Group couldn\'t be found',
        statusCode: 404
    });

    const detailed = group.toJSON();

    let count = 0;
    const nonMems = ['pending', 'waitlist'];
    detailed.Memberships.forEach(member => {
        if (! nonMems.includes(member.status)) count++;
    });
    detailed.numMembers = count;
    delete detailed.Memberships;

    detailed.Organizer = await User.findByPk(detailed.organizerId, {
        attributes: ['id', 'firstName', 'lastName']
    });

    res.json(detailed);
});

// CREATE A GROUP
router.post('/', requireAuth, async (req, res) => {
    const { name, about, type, private, city, state } = req.body;

    const errors = {};

    if (name.length > 60) errors.name = 'Name must be 60 characters or less';
    if (about.length < 50) errors.about = 'About must be 50 characters or more';
    if (type !== 'Online' && !(type === 'In Person' || type === 'In person')) errors.type = "Type must be 'Online' or 'In person'";
    if (typeof(private) !== 'boolean') errors.private = 'Private must be a boolean';
    if (!city) errors.city = 'City is required';
    if (!state) errors.state = 'State is required';

    if (Object.keys(errors)[0]) return res.status(400).json({
        message: 'Validation Error',
        statusCode: 400,
        errors
    });

    try {
        const newGroup = await Group.create({
                name,
                about,
                type,
                private,
                city,
                state,
                organizerId: req.user.id
            });
    } catch (e) {
        return res.status(400).json({
            message: 'Validation Error',
            statusCode: 400,
            errors: e.errors
        });
    }

    const confirm = await Group.findOne({
        where: {
            name
        }
    });

    res.status(201).json(confirm);
});

// ADD AN IMAGE TO A GROUP BASED ON THE GROUP'S ID
router.post('/:groupId/images', requireAuth, userIsOrganizer, async (req, res) => {
    const group = await Group.findByPk(req.params.groupId);
    if (!group) return res.status(404).json({
        messaage: 'Group couldn\'t be found',
        statusCode: 404
    });

    const { url, preview } = req.body;

    try {
        const newImg = await GroupImage.create({
            url,
            preview,
            groupId: req.params.groupId
        })
    } catch (e) {
        return res.status(400).json(e);
    }

    const confirm = await GroupImage.findOne({
        where: {
            url,
            groupId: req.params.groupId
        },
        attributes: {
            exclude: ['groupId', 'createdAt', 'updatedAt']
        }
    });

    res.json(confirm)
});

// EDIT A GROUP
router.put('/:groupId', requireAuth, userIsOrganizer, async (req, res) => {
    const toUpdate = await Group.findByPk(req.params.groupId);
    if (!toUpdate) return res.status(404).json({
        message: 'Group couldn\'t be found',
        statusCode: 404
    });
    const { name, about, type, private, city, state } = req.body;

    const errors = {};

    if (name.length > 60) errors.name = 'Name must be 60 characters or less';
    if (about.length < 50) errors.about = 'About must be 50 characters or more';
    if (type !== 'Online' && !(type === 'In Person' || type === 'In person')) errors.type = "Type must be 'Online' or 'In person'";
    if (typeof(private) !== 'boolean') errors.private = 'Private must be a boolean';
    if (!city) errors.city = 'City is required';
    if (!state) errors.state = 'State is required';

    if (Object.keys(errors)[0]) return res.status(400).json({
        message: 'Validation Error',
        statusCode: 400,
        errors
    });

    try {
        toUpdate.name = name;
        toUpdate.about = about;
        toUpdate.type = type;
        toUpdate.private = private;
        toUpdate.city = city;
        toUpdate.state = state;
        toUpdate.updatedAt = Date();

        await toUpdate.save();
    } catch (e) {
        return res.status(400).json({
            message: 'Validation Error',
            statusCode: 400,
            errors: e.errors
        });
    }

    const confirm = await Group.findByPk(req.params.groupId);
    res.json(confirm);
});

// DELETE A GROUP
router.delete('/:groupId', requireAuth, userIsOrganizer, async (req, res) => {
    const toDelete = await Group.findByPk(req.params.groupId);
    if (!toDelete) return res.status(404).json({
        message: 'Group couldn\'t be found',
        statusCode: 404
    });

    await toDelete.destroy();

    res.json({
        message: 'Successfully deleted',
        statusCode: 200
    });
});

// GET ALL VENUES FOR A GROUP SPECIFIED BY ITS ID
router.get('/:groupId/venues', requireAuth, userIsAtLeastCohost, async (req, res) => {
    const venues = await Venue.findAll({
        where: {
            groupId: req.params.groupId
        },
        attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
    });

    res.json(venues);
});

// CREATE A NEW VENUE FOR A GROUP SPECIFIED BY ITS ID
router.post('/:groupId/venues', requireAuth, userIsAtLeastCohost, async (req, res) => {
    const { address, city, state, lat, lng } = req.body;

    try {
        const newVenue = await Venue.create({
                groupId: req.params.groupId,
                address,
                city,
                state,
                lat,
                lng
            });
    } catch (e) {
        return res.status(400).json({
            message: 'Validation error',
            statusCode: 400,
            errors: e.errors
        });
    }

    const confirm = await Venue.findOne({
        where: {
            groupId: req.params.groupId,
            address: address
        }
    });

    res.json(confirm);
});

// GET ALL EVENT OF A GROUP SPECIFIED BY ITS ID
router.get('/:groupId/events', async (req, res) => {
    const check = await Group.findByPk(req.params.groupId);
    if (!check) return res.status(404).json({
        message: 'Group couldn\'t be found',
        statusCode: 404
    });

    const events = await Event.findAll({
        where: {
            groupId: req.params.groupId
        },
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

// CREATE AN EVENT FOR A GROUP SPECIFIED BY ITS ID
router.post('/:groupId/events', requireAuth, userIsAtLeastCohost, async (req, res) => {
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

    const venue = await Venue.findByPk(venueId)
    const errors = {};

    if (!venue && venueId !== null) errors.venueId = 'Venue does not exist';
    if (name.length < 5) errors.name = 'Name must be at least 5 characters';
    if (type !== 'Online' && !(type === 'In Person' || type === 'In person')) errors.type = "Type must be 'Online' or 'In person'";
    if (!Number.isInteger(capacity)) errors.capacity = 'Capacity must be an integer';
    if (price < 0) errors.price = 'Price is invalid';
    if (!description) errors.description = 'Description is required';
    if (Date.parse(startDate) < Date.parse(Date())) errors.startDate = 'Start date must be in the future';
    if (Date.parse(startDate) > Date.parse(endDate)) errors.endDate = 'End date is less than start date';

    if (Object.keys(errors)[0]) return res.status(400).json({
        message: 'Validation error',
        statusCode: 400,
        errors
    });

    try {
        const newEvent = await Event.create({
            groupId: req.params.groupId,
            venueId,
            name,
            type,
            capacity,
            price,
            description,
            startDate,
            endDate
        });
    } catch (e) {
        return res.status(400).json({
            message: 'Validation error',
            statusCode: 400,
            errors: e.errors
        })
    }

    const confirm = await Event.findOne({
        where: {
            groupId: req.params.groupId,
            name,
            startDate
        },
        attributes: {
            exclude: ['updatedAt', 'createdAt']
        }
    });

    res.json(confirm);
});

// GET ALL MEMBERS OF A GROUP SPECIFIED BY ITS ID
router.get('/:groupId/members', async (req, res) => {

    const group = await Group.findByPk(req.params.groupId, {
        include: {
            model: Membership,
        }
    });
    if (!group) return res.status(404).json({
        message: 'Group couldn\'nt be found',
        statusCode: 404
    });

    let isCohost = false;
    group.Memberships.forEach(member => {
        if (member.id === req.user.id && member.status === 'co-host') isCohost = true;
    });
    const isOwner = group.organizerId === req.user.id;


    const where = {}
    where.groupId = req.params.groupId;

    if (!isCohost && !isOwner) where.status = ['member', 'co-host']

    const members = await User.findAll({
        attributes: {
            exclude: ['username']
        },
        include: {
            model: Membership,
            attributes: ['status'],
            where
        }
    });

    const result = {};
    result.Members = members

    res.json(result);

});

// REQUEST A MEMBERSHIP FOR A GROUP BASED ON THE GROUP'S ID
router.post('/:groupId/membership', requireAuth, async (req, res) => {
    const group = await Group.findByPk(req.params.groupId, {
        include: {
            model: Membership,
        }
    });
    if (!group) return res.status(404).json({
        message: 'Group couldn\'t be found',
        statusCode: 404
    });

    let currentStatus;
    group.Memberships.forEach(member => {
        if (member.userId === req.user.id) {
            if (member.status === 'pending') {
                currentStatus = 'pending'
            } else {
                currentStatus = 'true'
            }
        }
    });

    if (currentStatus === 'pending') {
        return res.status(400).json({
            message: 'Membership has already been requested',
            statusCode: 400
        });
    } else if (currentStatus === 'true') {
        return res.status(400).json({
            message: 'User is already a member of the group',
            statusCode: 400
        });
    } else {
        try {
            const request = await Membership.create({
                userId: req.user.id,
                groupId: req.params.groupId,
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

    const confirm = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: req.params.groupId
        }
    });

    const results = {};
    results.memberId = confirm.id;
    results.status = confirm.status;

    res.json(results);
});

// CHANGE THE STATUS OF A MEMBERSHIP FOR A GROUP SPECIFIED BY ID
router.put('/:groupId/membership', requireAuth, changeStatusAuth, async (req, res) => {

    const member = await Membership.findByPk(req.body.memberId);
    if (!member) return res.status(400).json({
        message: 'Validation Error',
        statusCode: 400,
        errors: {
            memberId: 'User couldn\'t be found'
        }
    });
    if (+member.groupId !== +req.params.groupId) return res.status(404).json({
        message:'Membership between the user and the group does not exits',
        statusCode: 404
    });

    try {
        member.status = req.body.status;
        member.save();
    } catch (e) {
        return res.status(400).json({
            message: 'Validation error',
            statusCode: 400,
            errors: e.errors
        });
    }

    const confirm = await Membership.findByPk(req.body.memberId);
    const results = {};

    results.id = confirm.userId;
    results.groupId = confirm.groupId;
    results.memberId = confirm.id;
    results.status = confirm.status;

    res.json(results);
});

// DELETE MEMBERSHIP TO A GROUP SPECIFIED BY ID
router.delete('/:groupId/membership', requireAuth, userIsHostOrBeingDeleted, async (req, res) => {

    const user = await Membership.findByPk(req.body.memberId);
    if (!user) return res.status(400).json({
        message: 'Validation Error',
        statusCode: 400,
        errors: {
            memberId: 'User couldn\'t be found'
        }
    });
    if (+user.groupId !== +req.params.groupId) return res.status(404).json({
        message:'Membership does not exist for this User',
        statusCode: 404
    });

    await user.destroy();

    res.json({
        message: 'Successfully deleted membership from group'
    });
});

module.exports = router;
