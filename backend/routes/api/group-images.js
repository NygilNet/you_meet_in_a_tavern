const express = require('express');
const { GroupImage, Group, Membership } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

// AUTHORIZATION MIDDLEWARE

    // CURRENT USER MUST BE HOST OR COHOST
    const userIsAtLeastCohost = async (req, res, next) => {
        const img = await GroupImage.findByPk(req.params.imageId);
        if (!img) return res.status(400).json({
            message: 'Group Image couldn\'t be found',
            statusCode: 404
        });
        const id = img.groupId;

        const isHost = await Group.findOne({
            where: {
                id,
                organizerId: req.user.id
            }
        });
        const isCohost = await Membership.findOne({
            where: {
                groupId: id,
                userId: req.user.id,
                status: 'co-host'
            }
        });

        if (!isHost && !isCohost) return res.status(403).json({ message: 'You must be the host or a cohost of this group for this action' });

        next();
    }


router.delete('/:imageId', requireAuth, userIsAtLeastCohost, async (req, res) => {
    const toDelete = await GroupImage.findByPk(req.params.imageId);

    await toDelete.destroy();

    res.json({
        message: 'Successfully deleted',
        statusCode: 200
    });
});

module.exports = router;
