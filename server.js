var HTTP_PORT = process.env.PORT || 8080;
//express setup
const express = require("express");
const app = express();
const mongoose = require("mongoose");

//body parser setup and general middleware
const path = require("path");
const bodyParser = require("body-parser");

const exphbs = require("express-handlebars");
// app.use(express.static("assets"));
app.use(express.static("assets"));
const clientSessions = require("client-sessions");
const Art = require("./edit-article.js");
const bcrypt = require('bcryptjs');
const Article = require("./edit-article.js");


//mongoose setup
// mongoose.connect("mongodb+srv://Shibu:Ndheru666@senecaweb.l0lyg88.mongodb.net/?retryWrites=true&w=majority", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const register = mongoose.createConnection(
  "mongodb+srv://Shibu:Ndheru666@senecaweb.l0lyg88.mongodb.net/?retryWrites=true&w=majority"
);
const index = mongoose.createConnection(
  "mongodb+srv://Shibu:Ndheru666@senecaweb.l0lyg88.mongodb.net/?retryWrites=true&w=majority"
);
const article = mongoose.createConnection(
  "mongodb+srv://Shibu:Ndheru666@senecaweb.l0lyg88.mongodb.net/?retryWrites=true&w=majority"
);

const articleSchema = new mongoose.Schema({
  index_name: String,
});

const indexSchema = new mongoose.Schema({
  title: String,
  date: String,
  content: String,
  image: String,
});

let users = [];

const registerSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: { type: String, required: true, unique: true },
  password: String,
  confirmpassword: String,
  phone: String,
  address: String,
});

// const login = mongoose.createConnection(url);
// const loginSchema = new mongoose.Schema({
//     "email": String,
//     "password": String,
//     "user": String,
// });

const userlogo = register.model("registeration", registerSchema);
const indexpage = index.model("index", indexSchema);
const articlepage = article.model("article", articleSchema);

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use(
  clientSessions({
    cookieName: "session",
    secret: "secretSession",
    duration: 2 * 60 * 1000,
    activeDuration: 1000 * 60,
  })
);

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

//ensures that the user is logged in

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}


//engine setup
app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
  });


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});
app.get("/article", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard", { layout: false });
});

app.get("/login", function (req, res) {
  res.render("login", { layout: false });
});

function spChar(str) {
  const special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  return special.test(str);
}


// app.post("/login", function (req, res) {
//   console.log(req.body);

//   var loginInfo = {
//     usr: req.body.username,
//     pss: req.body.password,
//   };

//   if (loginInfo.usr == "" || loginInfo.pss == "") {
//     var loginError = "Please fill in all the fields";
//     res.render("login", {
//       loginError: loginError,
//       data: loginInfo,
//       layout: false,
//     });
//   } else {
//     console.log("loginInfo: ", loginInfo);
//     userlogo
//       .findOne({ email: loginInfo.usr, password: loginInfo.pss })
//       .exec()
//       .then((data) => {
//         if (data) {
//           console.log("it is working");
//           res.render("login_dashboard", {
//             firstname: data.firstname,
//             lastname: data.lastname,
//             username: data.username,
//             layout: false,
//           });
//         } else {
//           console.log("it is not working");
//           var userError =
//             "Incorrect username or password. Please try again!!!";
//           res.render("login", {
//             userError: userError,
//             data: loginInfo,
//             layout: false,
//           });
//         }
//       });
//   }
// });
app.post("/login", function (req, res) {
  console.log(req.body);

  var loginInfo = {
    usr: req.body.username,
    pss: req.body.password,
  };

  if (loginInfo.usr == "" || loginInfo.pss == "") {
    var loginError = "Please fill in all the fields";
    res.render("login", {
      loginError: loginError,
      data: loginInfo,
      layout: false,
    });
  } else {
    console.log("loginInfo: ", loginInfo);
    userlogo
      .
      findOne
      ({ email: loginInfo.usr, password: loginInfo.pss })
      .exec()
      .then((data) => {
        if (data) {
          console.log("it is working");
          req.session.user = data;
          console.log("req.session.user: ", req.session.user);
          if (data.role == "admin") {
            res.redirect("/articles");
          } else {
            res.redirect("/articles");
          }
        } else {
          var loginError = "Invalid username or password";
          res.render("login", {
            loginError: loginError,
            data: loginInfo,
            layout: false,
          });
        }
      });
  }
});

app.get("/articles", ensureLogin, (req, res) => {
  articlepage.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.render("articles", {
        layout: false,
        articles: data,
        user: req.session.user,
      });
    }
  });
});

app.get("/articles/:id", ensureLogin, (req, res) => {
  articlepage.findById(req.params.id, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.render("article", {
        layout: false,
        article: data,
        user: req.session.user,
      });
    }
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});





app.get("/registeration", function (req, res) {
  res.render("registeration", { layout: false });
});

function phoneNumber(num) {
  const phone = /^\d{3}-\d{3}-\d{4}$/;
  return phone.test(num);
}

app.post("/register", (req, res) => {
  var registerInfo = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    confirmpassword: req.body.confirmpassword,
  };
  if (
    registerInfo.firstname == "" ||
    registerInfo.lastname == "" ||
    registerInfo.username == "" ||
    registerInfo.email == "" ||
    registerInfo.password == "" ||
    registerInfo.confirmpassword == ""
  ) {
    var registerError = "Please fill in all the fields";
    res.render("register", {
      registerError: registerError,
      data: registerInfo,
      layout: false,
    });
  } else if (registerInfo.password != registerInfo.confirmpassword) {
    var registerError = "Password does not match";
    res.render("register", {
      registerError: registerError,
      data: registerInfo,
      layout: false,
    });
  } else if (spChar(registerInfo.password)) {
    var registerError = "Password must not contain special characters";
    res.render("register", {
      registerError: registerError,
      data: registerInfo,
      layout: false,
    });
  } else {
    userlogo
      .
      findOne
      ({ email: registerInfo.email })
      .exec()
      .then((data) => {
        if (data) {
          var registerError = "Email already exists";
          res.render("register", {
            registerError: registerError,
            data: registerInfo,
            layout: false,
          });
        } else {
          bcrypt.hash(registerInfo.password, 10, (err, hash) => {
            if (err) {
              console.log(err);
            } else {
              var user = new userlogo({
                firstname: registerInfo.firstname,
                lastname: registerInfo.lastname,
                username: registerInfo.username,
                email: registerInfo.email,
                password: hash,
              });
              user.save((err, data) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log("data: ", data);
                  res.render("login", { layout: false });
                }
              });
            }
          });
        }
      });
  }
});


//add article page
app.get('/AddArticle', (req, res) => {
  res.render('AddArticle', {layout: false});
});

app.post('/AddArticle', ensureLogin, (req, res) => {
  let articleInfo = new indexpage({
    title: req.body.title,
    date: req.body.date,
    content: req.body.content,
    image: req.body.image,
  }).save((e, data) => {
    if (e) {
      console.log(e);
    } else {
      console.log(data);
    }
  });
  res.redirect('/articles');
});


app.get("/articles", ensureLogin, (req, res) => {
  if (req.query.minDate) {
    Art.getArticlesByMinDate(req.query.minDate)
      .then((data) => {
        if (data.length == 0) {
          res.render("articles", {
            message: "No more articles",
            layout: false,
          });
          return;
        }
        res.render("articles", { articles: data, layout: false });
      })
      .catch((err) => {
        res.render("articles", { message: err, layout: false });
      });
  } else {
    Art.getAllArticles()
      .then((data) => {
        res.render("articles", { articles: data, layout: false });
      })
      .catch((err) => {
        res.render("articles", { message: err, layout: false });
      });
  }
});

app.get("/articles/:id", function (req, res) {
  Art.getArticlesById(req.params.id).then((data) => {
    res.render("articles", { data: data, layout: false });
  });
});


app.post("/articles/:id/edit", function (req, res) {
  Art.updateArticle(req.params.id, req.body).then((data) => {
    res.redirect("/articles");
  });
});

app.get("/articles/delete/:id", ensureLogin, (req, res) => {
  Art.deleteArticleById(req.params.id)
    .then((data) => {
      res.redirect("/");
    })
    .catch((err) => {
      res.render("AddArticle", { message: err });
    });
});


//make routest for readMore
app.get("/readMore", function(req, res) {
  indexpage.find().exec().then((data) =>{
      let blogData = new Array;
      data.forEach(element => {
          blogData.push({
              title: element.title,
              date: element.date,
              content: element.content,
              image: element.image
          });
      });
      res.render("readMore", { admData: blogData, layout: false});
  });
});

app.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    res.redirect("/");
  });
});


app.use((req, res) => {
  res.status(404).send("404: Page not Found");
});

var port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



