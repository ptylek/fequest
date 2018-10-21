var express          = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    flash            = require("connect-flash"),
    moment           = require("moment"),
    passport         = require("passport"),
    LocalStrategy    = require("passport-local"),
    methodOverride   = require("method-override"),
    Question         = require("./models/question"),
    Comment          = require("./models/comment"),
    User             = require("./models/user"),
    seedDB           = require("./seeds");
    
// REQ routes
var commentRoutes    = require("./routes/comments"),
    questionsRoutes  = require("./routes/questions"),
    indexRoutes      = require("./routes/index");
    
var url = process.env.DATABASEURL || "mongodb://localhost:27017/fequest";
mongoose.connect(url, { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use('/modules', express.static(__dirname + '/node_modules'));
app.use(methodOverride("_method"));
app.use(flash());

// seed DB
// seedDB();
app.locals.moment = require('moment');

// PASSPORT config
app.use(require("express-session")({
    secret: "Bugerek jest słodkim maluszkiem",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error     = req.flash("error");
    res.locals.success   = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/questions", questionsRoutes);
app.use("/questions/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("fequest server has started!");
});