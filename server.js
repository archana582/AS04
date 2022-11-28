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
  res.sendFile(path.join(__dirname, "/dashboard.html"));
});

app.get("/login", function (req, res) {
  res.render("login", { layout: false });
});

function spChar(str) {
  const special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  return special.test(str);
}


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
      .findOne({ email: loginInfo.usr, password: loginInfo.pss })
      .exec()
      .then((data) => {
        if (data) {
          console.log("it is working");
          res.render("login_dashboard", {
            firstname: data.firstname,
            lastname: data.lastname,
            username: data.username,
            layout: false,
          });
        } else {
          console.log("it is not working");
          var userError =
            "Incorrect username or password. Please try again!!!";
          res.render("login", {
            userError: userError,
            data: loginInfo,
            layout: false,
          });
        }
      });
  }
});

//article page
app.get("/article", (req, res) => {
  res.render("/", { layout: false });
});

app.get("/article", (req, res) => {
  indexpage.findOne({ title: req.body.title }).exec().then((data) => {
    if(data){
      res.render("readMore", { title: data.title, date: data.date, content: data.content, image: data.image, layout: false });
    }else{
      res.sendFile(path.join(__dirname, "/index.html"));
      //snde error message
    }
  });
});


app.get("/registeration", function (req, res) {
  res.render("registeration", { layout: false });
});

function phoneNumber(num) {
  const phone = /^\d{3}-\d{3}-\d{4}$/;
  return phone.test(num);
}

app.post("/registration", function (req, res) {
  //get data from the form and add it to the database
  // let data = req.body;
  //save data to json array and validate
  // let valid = true;
  console.log(req.body);
  console.log("------->")
  var userDetails = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.pass,
    confirmPassword: req.body.repass,
    address: req.body.address,
    phone: req.body.phone,
  };

  //validate the data
  if (
    userDetails.firstname == "" ||
    userDetails.lastname == "" ||
    userDetails.password == "" ||
    userDetails.confirmPassword == "" ||
    userDetails.email == "" ||
    userDetails.address == "" ||
    userDetails.phone == ""
  ) {
    var errors = "All fields are required";
    res.render("registeration", {
      errors: errors,
      data: userDetails,
      layout: false,
    });
  } else if (userDetails.password.length < 8) {
    var errors = "Password must be at least 8 characters";
    res.render("registeration", {
      errors: errors,
      data: userDetails,
      layout: false,
    });
  } else if (phoneNumber(userDetails.phone) == false) {
    var errors = "Phone number must be 10 digits";
    res.render("registeration", {
      errors: errors,
      data: userDetails,
      layout: false,
    });
  } else {
    res.render("dashboard", { layout: false });
  }

  let userDB = new userlogo({
    firstname: userDetails.firstname,
    lastname: userDetails.lastname,
    email: userDetails.email,
    password: userDetails.password,
    confirmpassword: userDetails.confirmPassword,
    phone: userDetails.phone,
    address: userDetails.address,
  }).save((e, data) => {
    if (e) {
      console.log(e);
      res.sendFile(path.join(__dirname, "/index.html"));
    } else {
      console.log(data);
    }
  });
});

//add article page
app.get('/AddArticle', (req, res) => {
  res.render('AddArticle', {layout: false});
});

app.post('/AddArticle', (req, res) => {
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
  res.redirect('/');
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



app.use((req, res) => {
  res.status(404).send("404: Page not Found");
});

var port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
