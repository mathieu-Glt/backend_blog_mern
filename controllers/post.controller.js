const PostModel = require('../models/post.model.js');
const UserModel = require('../models/user.model');
const { v4: uuidv4 } = require('uuid');
const ObjectId = require('mongoose').Types.ObjectId;
const fs = require('fs');
const { promisify } = require('util');
const { uploadErrors } = require('../utils/errors.utils');
const pipeline = promisify(require('stream').pipeline);
const path = require('path');



module.exports.test = async (req, res, next) => {

    try {
        res.status(200).json({ status: 200, message: "Welcome to application mern project !" });
    } catch (error) {
        console.log("🚀 ~ file: auth.controller.js:13 ~ module.exports.signUp= ~ error:", error)
        res.status(400).json({ status: 400, errors: error })


    }
}

module.exports.readPost = async (req, res, next) => {
    const posts = await PostModel.find().sort({ createdAt: -1 });
    // console.log("🚀 ~ file: post.controller.js:27 ~ module.exports.readPost= ~ posts:", posts)
    try {
        if (posts) {
            res.status(200).json({ status: 200, message: "list posts found", posts: posts });

        } else {
            res.status(400).json({ status: 400, message: "list posts not found", posts: posts });

        }

    } catch (error) {
        console.log("🚀 ~ file: post.controller.js:38 ~ module.exports.readPost= ~ error:", error)
        res.status(500).json({ status: 500, message: "Failed request", error: error });

    }
}

module.exports.readPostById = async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        const post = await PostModel.findById(req.params.id).lean();
        console.log("🚀 ~ file: post.controller.js:42 ~ post:", post)

        if (!post) {
            res.status(404).json({ status: 404, message: "Post not found", result: post })

        }

        res.status(200).json({ status: 200, message: "Post found", result: post })
    } catch (error) {
        res.status(500).json({ status: 500, message: "Internal Server Error", error: error })


    }
}

module.exports.createPost = async (req, res) => {
    console.log("🚀 ~ file: post.controller.js:66 ~ module.exports.createPost= ~ req:", req.body)
    console.log("🚀 ~ file: post.controller.js:66 ~ module.exports.createPost= ~ req:", req.file)
    let fileName;

  if (req.file !== null) {
    // try {
    //   if (
    //     req.file.detectedMimeType != "image/jpg" &&
    //     req.file.detectedMimeType != "image/png" &&
    //     req.file.detectedMimeType != "image/jpeg"
    //   )
    //     throw Error("invalid file");

    //   if (req.file.size > 500000) throw Error("max size");
    // } catch (err) {
    //   const errors = uploadErrors(err);
    //   return res.status(201).json({ errors });
    // }
    // fileName = req.body.posterId + Date.now() + ".jpg";
        const destinationPath = path.join(__dirname, '../../client/public/uploads/posts/', req.file.filename)
        console.log("🚀 ~ file: post.controller.js:83 ~ module.exports.createPost= ~ destinationPath:", destinationPath)

        await pipeline(fs.createReadStream(req.file.path), fs.createWriteStream(destinationPath))

    // await pipeline(
    //   req.file.stream,
    //   fs.createWriteStream(
    //     `${__dirname}/../client/public/uploads/posts/${fileName}`
    //   )
    // );
  }

  const newPost = new PostModel({
    posterId: req.body.posterId,
    message: req.body.message,
    picture: req.file !== null ? req.file.filename : "",
    video: req.body.video,
    likers: [],
    comments: [],
  });

  try {
    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).send(err);
  }
};
// module.exports.createPost = async (req, res) => {
//     console.log("🚀 ~ file: post.controller.js:65 ~ module.exports.createPost= ~ req:", req.body)
//     console.log("🚀 ~ file: post.controller.js:66 ~ module.exports.createPost= ~ req:", req.file)
//     let fileName;
//     let errors = { format: "", maxSize: ""}
//     if (req.file !== null) {
//         // try {
//             if (
//                 req.file.mimetype != "image/jpg" &&
//                 req.file.mimetype != "image/png" &&
//                 req.file.mimetype != "image/jpeg"
//             )
//                 // throw Error("invalid file");
//                 errors = { format: "invalid file", maxSize: ""}

//             if (req.file.size > 1000) 
//             throw Error("max size");

//             const errors = uploadErrors(err);
//             console.log("🚀 ~ file: post.controller.js:81 ~ module.exports.createPost= ~ errors:", errors)
//             return res.status(200).json({ errors });

//         // } catch (err) {
//         //     const errors = uploadErrors(err);
//         //     console.log("🚀 ~ file: post.controller.js:81 ~ module.exports.createPost= ~ errors:", errors)
//         //     return res.status(400).json({ errors });
//         // }
//         fileName = req.body.posterId + Date.now() + ".jpg";
//         const destinationPath = path.join(__dirname, '../../client/public/uploads/posts/', req.file.filename)
//         console.log("🚀 ~ file: post.controller.js:83 ~ module.exports.createPost= ~ destinationPath:", destinationPath)

//         await pipeline(fs.createReadStream(req.file.path), fs.createWriteStream(destinationPath))
//         //   await pipeline(
//         //     req.file.filename,
//         //     fs.createWriteStream(
//         //       `${__dirname}./client/public/uploads/posts/'${req.file.filename}`
//         //     )
//         //   );
//     }

//     const newPost = new PostModel({
//         posterId: req.body.posterId,
//         message: req.body.message,
//         picture: req.file !== null ? req.file.filename : "",
//         video: req.body.video,
//         likers: [],
//         comments: [],
//     });

//     try {
//         const post = await newPost.save();
//         return res.status(201).json(post);
//     } catch (err) {
//         return res.status(400).send(err);
//     }
// };





// module.exports.createPost = async (req, res, next) => {
//     console.log("🚀 ~ file: post.controller.js:70 ~ module.exports.createPost= ~ req:", req.file)
//     console.log("🚀 ~ file: post.controller.js:70 ~ module.exports.createPost= ~ req:", req.body)
//     // console.log("🚀 ~ file: post.controller.js:68 ~ module.exports.createPost= ~ req:", req)
//     // console.log("🚀 ~ file: post.controller.js:68 ~ module.exports.createPost= ~ req.file:", req.file.stream)
//     let fileName;

//     if (req.file !== null) {
//         console.log('il y a des fichiers telechargé');
//         try {
//             if (
//                 req.file.mimetype != "image/jpg" &&
//                 req.file.mimetype != "image/png" &&
//                 req.file.mimetype != "image/jpeg"
//             )
//                 throw Error("invalid file");

//             if (req.file.size > 1000) throw Error("max size")

//         } catch (error) {
//             const errors = uploadErrors(error);
//             console.log("🚀 ~ file: post.controller.js:89 ~ module.exports.createPost= ~ errors:", errors)
//             return res.status(201).json({ errors });
//             // return res.status(500).json({ status: 500, message: "Failed request", errors: errors });

//         }


//         fileName = req.body.posterId + Date.now() + '.jpg';
//         const destinationPath = path.join(__dirname, '../../client/public/uploads/posts/', req.file.originalname);

//         await pipeline(fs.createReadStream(req.file.path), fs.createWriteStream(destinationPath))

//     }



//     console.log("🚀 ~ file: post.controller.js:82 ~ module.exports.createPost= ~ fileName:", fileName)

//     const newPost = new PostModel({
//         posterId: req.body.posterId,
//         message: req.body.message,
//         picture: req.file !== null ? req.file.originalname : "",
//         video: req.body.video,
//         likers: [],
//         comments: [],
//     });

//     try {
//         const post = await newPost.save();
//         console.log("🚀 ~ file: post.controller.js:49 ~ module.exports.createPost= ~ post:", newPost)
//         if (post) {
//             res.status(201).json({ status: 201, message: "Post has been created", post: newPost });

//         }
//     } catch (error) {
//         console.log("🚀 ~ file: post.controller.js:51 ~ module.exports.createPost= ~ error:", error)
//         res.status(500).json({ status: 500, message: "Failed request", post: newPost });

//     }
// }

module.exports.updatePost = async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    const updatedRecord = {
        message: req.body.message
    }

    const updatePost = await PostModel.findByIdAndUpdate(
        req.params.id,
        { $set: updatedRecord },
        { new: true },

    );
    console.log("🚀 ~ file: post.controller.js:75 ~ module.exports.updatePost= ~ updatePost:", updatePost)
    if (updatePost) {
        console.log('Post found !');
        return res.send(updatePost)
    } else {
        return res.status(404).send('Post not found');

    }
}

module.exports.deletePost = async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        const deletePost = await PostModel.findByIdAndDelete(req.params.id);
        console.log("🚀 ~ file: post.controller.js:91 ~ module.exports.deletePost ~ deletePost:", deletePost)
        if (deletePost) {
            return res.status(200).json({ message: "Succesfully deleted post", result: deletePost })

        }

    } catch (error) {
        return res.status(500).json({ message: error.message })

    }

}

module.exports.likePost = async (req, res, next) => {
    console.log("🚀 ~ file: post.controller.js:162 ~ module.exports.likePost= ~ req:", req.params.id)
    console.log("🚀 ~ file: post.controller.js:163 ~ module.exports.likePost= ~ req:", req.body.id)
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        // add to the likers list(POST)
        const likersPost = await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: { likers: req.body.id }
            },
            { new: true, upsert: true }
        );
        console.log("🚀 ~ file: post.controller.js:176 ~ module.exports.likePost= ~ likersPost:", likersPost)

        // add to the like list(USER)
        const likePost = await UserModel.findByIdAndUpdate(
            req.body.id,
            {
                $addToSet: { likes: req.params.id }
            },
            { new: true, upsert: true }
        );
        console.log("🚀 ~ file: post.controller.js:185 ~ module.exports.likePost= ~ likePost:", likePost)


        if (likersPost && likePost) {
            console.log('Post found !');
            return res.status(200).json({ message: "Successfully following ", result: { "user": likePost, "post": likersPost } });
        } else {
            return res.status(400).json({ message: "Bad request ", result: likersPost + likePost });

        }
    } catch (error) {
        return res.status(500).json({ message: error.message });

    }
}

module.exports.unlikePost = async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        // add to the likers list(POST)
        const likersPost = await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: { likers: req.body.id }
            },
            { new: true, upsert: true }
        );

        // add to the like list(USER)
        const likePost = await UserModel.findByIdAndUpdate(
            req.body.id,
            {
                $pull: { likes: req.params.id }
            },
            { new: true, upsert: true }
        );


        if (likersPost && likePost) {
            console.log('Post found !');
            return res.status(200).json({ message: "Successfully following ", result: likePost });
        } else {
            return res.status(400).json({ message: "Bad request ", result: likersPost + likePost });

        }
    } catch (error) {
        return res.status(500).json({ message: error.message });

    }
}


module.exports.commentPost = async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        const post = await PostModel.findById(req.params.id)
        console.log("🚀 ~ file: post.controller.js:210 ~ post:", post)
        const addCommentPost = await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments: {
                        commenterId: req.body.commenterId,
                        commenterPseudo: req.body.commenterPseudo,
                        text: req.body.text,
                        timestamp: new Date().getTime()
                    },
                },
            },

        );
        console.log("🚀 ~ file: post.controller.js:223 ~ addCommentPost:", addCommentPost.text)
        if (addCommentPost) {
            res.status(201).json({ status: 201, message: `Comment '${req.body.text}' has been added to post ${post.message}`, post: post });
        }

    } catch (error) {
        console.log("🚀 ~ file: post.controller.js:228 ~ error:", error)
        return res.status(500).json({ message: error.message });

    }
}


module.exports.editCommentPost = async (req, res, next) => {
    console.log("🚀 ~ file: post.controller.js:275 ~ module.exports.editCommentPost= ~ req:", req.params)
    console.log("🚀 ~ file: post.controller.js:276 ~ module.exports.editCommentPost= ~ req:", req.body)
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        const post = await PostModel.findById(req.params.id)
        console.log("🚀 ~ file: post.controller.js:244 ~ module.exports.editCommentPost= ~ post:", post)
        if (post) {
            const editCommentOfPost = post.comments.find((comment) => comment._id.toString() === req.body.commentId)
            // const editCommentsOfPost = post.comments.filter((comment) => comment.commenterId.toString() === req.body.commentId);
            console.log("🚀 ~ file: post.controller.js:246 ~ module.exports.editCommentPost= ~ editCommentOfPost:", editCommentOfPost)
            if (editCommentOfPost) {
                editCommentOfPost.text = req.body.text;
                const posteSaved = await post.save()
                console.log("🚀 ~ file: post.controller.js:251 ~ module.exports.editCommentPost= ~ postModified:", posteSaved)
                if (posteSaved) {
                    return res.status(201).json({ status: 200, message: "Comment has been modified ", results: posteSaved });

                }



            } else {
                return res.status(404).json({ message: "Comment not found " });
            }
        } else {
            return res.status(404).json({ message: "Post not found " });

        }
    } catch (error) {
        return res.status(500).json({ message: error.message });

    }


}


module.exports.deleteCommentPost = async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        const deletePost = await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    comments: {
                        _id: req.body.commentId
                    }
                }

            },
            { new: true }
        );
        if (deletePost) {
            return res.status(201).json({ status: 200, message: "Comment has been deleted ", results: deletePost });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });

    }

}


