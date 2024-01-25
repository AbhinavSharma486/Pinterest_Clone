var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post")
const passport = require('passport');
const localStrategy = require('passport-local')
const upload = require('./multer')

passport.use(new localStrategy(userModel.authenticate()))

/* GET home page. */
router.get('/', function (req, res) {
  res.render('register')
})


/* GET Login page. */
router.get('/login', function (req, res, next) {
  res.render('login');
});


router.get('/register', function (req, res, next) {
  res.render("register")
})


/* GET Profile page. */
router.get("/profile", isLoggedIn, async function (req, res) {
  const user = await userModel
    .findOne({ username: req.session.passport.user })
    .populate("posts")
  res.render("profile", { user })
})


router.get("/show/posts", isLoggedIn, async function (req, res) {
  const user = await userModel
    .findOne({ username: req.session.passport.user })
    .populate("posts")
  res.render("show", { user })
})

router.get("/feed/posts", isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user })
  const posts = await postModel.find()
    .populate("user")

  res.render("feed", { user, posts })
})

router.get("/add", isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user })
  res.render("add", { user })
})


router.post("/createpost", isLoggedIn, upload.single("postimage"), async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user })
  const post = await postModel.create({
    user: user._id,
    title: req.body.title,
    description: req.body.description,
    image: req.file.filename,
  })
  user.posts.push(post._id)
  await user.save()
  res.redirect("/profile")
})


router.post("/fileupload", isLoggedIn, upload.single("image"), async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user })
  user.profileImage = req.file.filename
  await user.save()
  res.redirect("/profile")
})


router.post('/register', function (req, res) {
  const data = new userModel({
    username: req.body.username,
    contact: req.body.contact,
    email: req.body.email,
    fullname: req.body.fullname,
  })

  userModel.register(data, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.redirect("/")
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect("/profile")
    })
  })
})


router.post('/login', passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/",
}));


router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err) }
    res.redirect('/')
  })
})


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/")
}


module.exports = router;
