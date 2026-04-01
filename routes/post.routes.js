const router = require("express").Router();
const postController = require("../controllers/post.controller");
const path = require("path");
const multer = require("multer");
const { checkUser } = require("../middleware/auth.middleware");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../client/public/uploads/profil/"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// test
router.get("/test", postController.test);

router.get("/", postController.readPost);
router.get("/:id", postController.readPostById);
router.post("/", upload.single("file"), postController.createPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);
router.patch("/like-post/:id", postController.likePost);
router.patch("/unlike-post/:id", postController.unlikePost);

// comments
router.patch("/comment-post/:id", checkUser, postController.commentPost);
router.patch(
  "/edit-comment-post/:id",
  checkUser,
  postController.editCommentPost,
);
router.patch(
  "/delete-comment-post/:id",
  checkUser,
  postController.deleteCommentPost,
);

module.exports = router;
