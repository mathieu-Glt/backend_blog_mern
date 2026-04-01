const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;


module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await UserModel.find().select('-password');

        if (users) {
            res.status(200).json({ status: 200, message: "list users found", users: users });
        } else {
            res.status(400).json({ status: 400, message: "list users not found", users: users });

        }

    } catch (error) {
        res.status(500).json({ status: 500, message: "Failed request", users: users });
    }
}

module.exports.getUserById = async (req, res, next) => {
    console.log("🚀 ~ file: user.controller.js:22 ~ module.exports.getUserById= ~ req:", req.params)

    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);
    try {
        const user = await UserModel.findById(req.params.id).select('-password')
        if (!user) {
            return res.status(404).send('User not found');
        }
        return res.status(200).json({ message: "Succesfully user found", result: user })
    } catch (error) {
        console.log('Error fetching user by ID: ' + error);
        res.status(500).send('Internal Server Error');
    }

}

module.exports.updateUser = async (req, res, next) => {
    console.log("🚀 ~ file: user.controller.js:40 ~ module.exports.updateUser= ~ req:", req.body)
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    bio: req.body.bio
                }
            },
            { new: true, upsert: false, setDefaultsOnInsert: true },
        );
        console.log("🚀 ~ file: user.controller.js:54 ~ module.exports.updateUser= ~ updatedUser:", updatedUser)
        if (updatedUser) {
            console.log('User found !');
            return res.send(updatedUser);
        } else {
            return res.status(404).send('User not found');
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })

    }

}

module.exports.deleteUser = async (req, res, next) => {
    console.log("🚀 ~ file: user.controller.js:68 ~ module.exports.deleteUser= ~ req:", req.body)
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);
    try {
        const deleteUser = await UserModel.findByIdAndDelete(req.params.id);
        console.log("🚀 ~ file: user.controller.js:54 ~ module.exports.deleteUser= ~ deleteUser:", deleteUser)
        console.log('User found !');
        return res.status(200).json({ message: "Succesfully deleted user", result: deleteUser })
    } catch (error) {
        return res.status(500).json({ message: error.message })

    }

}


module.exports.follow = async (req, res, next) => {
    console.log("🚀 ~ file: user.controller.js:84 ~ module.exports.follow ~ req:", req.body)

    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow)) {
        return res.status(400).send('ID unknown : ' + req.params.id);
    }

    try {
        // add to the follower list
        const updateFollowing = await UserModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { following: req.body.idToFollow } },
            { new: true, upsert: true }
        );

        // add to following list
        const updateFollower = await UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            { $addToSet: { followers: req.params.id } },
            { new: true, upsert: true }
        );

        if (updateFollowing && updateFollower) {
            console.log('User found !');
            return res.status(200).json({ message: "Successfully following ", result: updateFollowing });
        } else {
            return res.status(400).json({ message: "Bad request ", result: null });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports.unfollow = async (req, res, next) => {
    console.log("🚀 ~ file: user.controller.js:98 ~ module.exports.unfollow ~ req:", req.body)
    console.log("🚀 ~ file: user.controller.js:98 ~ module.exports.unfollow ~ req:", req.params)

    if (!ObjectID.isValid(req.params.id)) return res.status(400).send('ID params unknown : ' + req.params.id);
    if (!ObjectID.isValid(req.body.idToUnFollow)) return res.status(400).send('ID body unknown : ' + req.body.idToUnfollow)

    try {
        // delete to the follower list
        const updateUnFollowing = await UserModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { following: req.body.idToUnFollow } },
            { new: true, upsert: true }
        );

        // delete to following list
        const updateUnFollower = await UserModel.findByIdAndUpdate(
            req.body.idToUnFollow,
            { $pull: { followers: req.params.id } },
            { new: true, upsert: true }
        );

        if (updateUnFollowing && updateUnFollower) {
            console.log('User found !');
            return res.status(200).json({ message: "Successfully unfollowing ", result: updateUnFollowing });
        } else {
            return res.status(400).json({ message: "Bad request ", result: null });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message })

    }

}