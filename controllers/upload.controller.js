const UserModel = require('../models/user.model');
const ObjectId = require('mongoose').Types.ObjectId;
const fs = require('fs');
const { promisify } = require('util');
const { uploadErrors } = require('../utils/errors.utils');
const pipeline = promisify(require('stream').pipeline);
const path = require('path');

module.exports.uploadProfil = async (req, res, next) => {
    console.log("🚀 ~ file: upload.controller.js:9 ~ module.exports.uploadProfil= ~ req:", req.file)

    try {

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        if (
            req.file.mimetype !== "image/jpg" &&
            req.file.mimetype !== "image/png" &&
            req.file.mimetype !== "image/jpeg"
        )
            throw Error("invalid file")
        // return res.status(400).json({ status: 400, message: "Problem with this file", error: errors });
            console.log("req.file.size", req.file.size);
        if (req.file.size > 1000) throw Error("max size")

 
    } catch (error) {
        const errors = uploadErrors(error)
        // return res.status(400).json({ status: 400, message: "File size limit exceeded", error: errors });
        return res.status(201).json({ errors });
    }
        const fileName = req.file.filename;
        const destinationPath = path.join(__dirname, '../../client/public/uploads/profil/', fileName);

    await pipeline(
        req.file.stream,
        fs.createWriteStream(
            `${__dirname}/../client/public/uploads/profil/${fileName}`
        )
    );

    try {

        const updatePictureUser = await UserModel.findByIdAndUpdate(
            req.body.userId,
            // { $set : { picture: "./uploads/profil/" + fileName}},
            { $set: { picture: fileName } },
            { new: true }
        );
            // console.log("🚀 ~ file: upload.controller.js:47 ~ module.exports.uploadProfil= ~ updatePictureUser:", updatePictureUser)
            // const pipeline = await pipeline(fs.createReadStream(req.file.path), fs.createWriteStream(destinationPath))
            // console.log("🚀 ~ file: upload.controller.js:41 ~ module.exports.uploadProfil= ~ pipeline:", pipeline)

        // if (updatePictureUser) {

        //     return res.status(200).json({ status: 200, message: "Succesfully file uploaded", result: updatePictureUser });
        // }

    } catch (error) {
        // return res.status(500).json({ status: 500, message: "Error internal Server", error: error });
        return res.status(500).send({ message: err });
    }

}

