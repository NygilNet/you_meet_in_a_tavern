const express = require('express');
const { Group, GroupImage, Membership, Venue, User } = require('../../db/models');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');

const router = express.Router();

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
        if (!group.previewImage) groupsList.previewImage = 'no preview image provided';
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
        if (!group.previewImage) groupsList.previewImage = 'no preview image provided';
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
        message: `No group with id ${id} found.`
    })

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

module.exports = router;
