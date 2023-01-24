const express = require('express');
const { Group, GroupImage, Membership } = require('../../db/models');
const { Op } = require('sequelize');

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



module.exports = router;
