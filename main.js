const express = require('express');
const homeController = require('./controllers/homeController');
const errorController = require('./controllers/errorController');
const subscribersController = require('./controllers/subscribersController');
const usersController = require('./controllers/usersController');
const coursesController = require('./controllers/coursesController');
const layouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const connectFlash = require('connect-flash');
const passport = require('passport');
const User = require('./models/user');



const router = express.Router();
router.use(cookieParser("secret_passcode")); //TO DO - change to env variable
router.use(expressSession({
    secret: "secret_passcode",
    cookie: {
        maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false
}));
router.use(connectFlash());

router.use(passport.initialize());
router.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    next();
});

router.get("/subscribers", subscribersController.index, subscribersController.indexView);
router.get("/subscribers/new", subscribersController.new);
router.post("/subscribers/create",  subscribersController.create, subscribersController.redirectView);
router.get("/subscribers/:id", subscribersController.show, subscribersController.showView);
router.get("/subscribers/:id/edit", subscribersController.edit);
router.put("/subscribers/:id/update", subscribersController.update, subscribersController.redirectView);
router.delete("/subscribers/:id/delete", subscribersController.delete, subscribersController.redirectView);

router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post("/users/create",  usersController.userCheck, usersController.validate, usersController.create, usersController.redirectView);
router.get("/users/login", usersController.login);
router.post("/users/login", usersController.authenticate);
router.get("/users/logout", usersController.logout, usersController.redirectView);
router.get("/users/:id", usersController.show, usersController.showView);
router.get("/users/:id/edit", usersController.edit);
router.put("/users/:id/update", usersController.update, usersController.redirectView);
router.delete("/users/:id/delete", usersController.delete, usersController.redirectView);

router.get("/courses", coursesController.index, coursesController.indexView);
router.get("/courses/new", coursesController.new);
router.post("/courses/create", coursesController.create, coursesController.redirectView);
router.get("/courses/:id", coursesController.show, coursesController.showView);
router.get("/courses/:id/edit", coursesController.edit);
router.put("/courses/:id/update", coursesController.update, coursesController.redirectView);
router.delete("/courses/:id/delete", coursesController.delete, coursesController.redirectView);


mongoose.Promise = global.Promise;

const dbstring = process.env.CONFETTIDB;
mongoose.connect(dbstring, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});


const app = express();

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded( {extended: false}));
app.use(express.json());
// router.use(expressValidator()); // must be declared after express.urlencoded and after express.json

app.use(layouts);
app.use(methodOverride("_method", {methods: ["POST", "GET"]}));
app.use("/", router);

app.get("/", homeController.showHome);

app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);


app.listen(app.get("port"), () => {
    console.log(`Server is running at port ${app.get("port")} ...`);
});