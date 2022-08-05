const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

const use = [];
var accountHead =["Salaries","Rent Income","Interest-Saving","Electricity Expenses"]
const details = "Enter Details";
app.set("view engine", "ejs");

app.use(session({
secret: "This is the secret line",
resave: false,
saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/abcDB");
const loginSchema = new mongoose.Schema({
  username: {type:String , required: false},
  email: {type:String , required: false},
  password: {type:String , required: false},
  head :[String],
  category: [String],
  expenditure: [String],
  accountCategory: [String],
  accountHead: [String],
  financialGroup: [String],
  financial: [String]
});

loginSchema.plugin(passportLocalMongoose);
const Login = new mongoose.model("Login",loginSchema);

passport.serializeUser(Login.serializeUser());
passport.deserializeUser(Login.deserializeUser());

app.get("/", function(req,res){
  res.render("home");
  console.log(use);
});
app.get("/register", function(req,res){
  res.render("register");
});
app.get("/login", function(req,res){
  res.render("login",{callback: details});
});
app.post("/main/setup", function(req,res){
  console.log("AC" + req.body.newDrop1);
  var newDrop1 = req.body.newDrop1;
  var newDrop = req.body.newDrop;
  var newDrop2 = req.body.newDrop2;
  var newFinancial = req.body.newFinancial;
  console.log("Financial"+newFinancial);
  console.log("Fin"+newDrop2);
  var newTitle = req.body.newItem;
  var newVal = req.body.newVal;
  var newCategory = req.body.newCategory;
  console.log(newVal);
  console.log(use);
  Login.findOne({username:use[0]},function(err,foundUser){
    if(foundUser){
        if(newCategory)
          foundUser.category.push(newCategory);
        if(newTitle)
          foundUser.head.push(newTitle);
        if(newVal)
          foundUser.expenditure.push(newVal);
        if(newDrop)
          foundUser.accountCategory.push(newDrop);
        if(newDrop1)
          foundUser.accountHead.push(newDrop1);
        if(newFinancial)
          foundUser.financialGroup.push(newFinancial);
        if(newDrop2)
          foundUser.financial.push(newDrop2);
      }
      foundUser.save();
      res.render("setup",{callback: accountHead, user: foundUser});
  });
});
app.get("/main/:title", function(req, res){
  console.log(req.params.title);
  if(req.params.title ==="setup"){
    Login.findOne({username: use[0]}, function(err,foundUser){
      var read= use;
      console.log(accountHead);
      res.render("setup",{callback: accountHead, user: foundUser});
      console.log(read);
    });
  }
  else
    res.render(req.params.title);
});
app.get('/logout', (req, res) => {
    use.pop();
    res.clearCookie('nToken');
    return res.redirect('/');
  });

app.post("/deletehead", function(req,res){
  console.log("Delete Called");
  console.log(req.body.listName);
  Login.findOne({username: use[0]}, function(err,foundUser){
    if(foundUser){
      foundUser.head = foundUser.head.filter(item => item!== foundUser.head[req.body.listName]);
      foundUser.save();
      res.redirect("/main/setup")
    }
  });
});
app.post("/deleteCategory", function(req,res){
  console.log("Delete Called");
  console.log(req.body.listName);
  Login.findOne({username: use[0]}, function(err,foundUser){
    if(foundUser){
      foundUser.category = foundUser.category.filter(item => item!== foundUser.category[req.body.listName]);
      foundUser.save();
      res.redirect("/main/setup")
    }
  });
});
app.post("/deleteFinancial", function(req,res){
  console.log("Delete Called");
  console.log(req.body.listName);
  Login.findOne({username: use[0]}, function(err,foundUser){
    if(foundUser){
      foundUser.financialGroup = foundUser.financialGroup.filter(item => item!== foundUser.financialGroup[req.body.listName]);
      foundUser.save();
      res.redirect("/main/setup")
    }
  });
});
app.post("/deleteExpenditure", function(req,res){
  console.log("Delete Called");
  console.log(req.body.listName);
  Login.findOne({username: use[0]}, function(err,foundUser){
    if(foundUser){
      foundUser.expenditure = foundUser.expenditure.filter(item => item!== foundUser.expenditure[req.body.listName]);
      foundUser.save();
      res.redirect("/main/setup")
    }
  });
});
app.post("/deleteAccountCategory",function(req,res){
  Login.findOne({username: use[0]}, function(err,foundUser){
    if(foundUser){
      foundUser.accountCategory = foundUser.accountCategory.filter(item => item!== foundUser.accountCategory[req.body.listName]);
      foundUser.save();
      res.redirect("/main/setup")
    }
  });
});
app.post("/deleteAccountHead",function(req,res){
  Login.findOne({username: use[0]}, function(err,foundUser){
    if(foundUser){
      foundUser.accountHead = foundUser.accountHead.filter(item => item!== foundUser.accountHead[req.body.listName]);
      foundUser.save();
      res.redirect("/main/setup")
    }
  });
});
app.post("/deleteFinancialGroup",function(req,res){
  Login.findOne({username: use[0]}, function(err,foundUser){
    if(foundUser){
      foundUser.financial = foundUser.financial.filter(item => item!== foundUser.financial[req.body.listName]);
      foundUser.save();
      res.redirect("/main/setup")
    }
  });
});

app.get("/main",checkAuthentication,function(req,res){
  console.log(use[0]);
  // Login.findOne({username:use[0]},function(err,foundUser){
  //   if(!err){
  //     res.render("main",{user: foundUser});
  //     console.log(foundUser);
  //   }
  // });
});
function checkAuthentication(req,res){
  if(req.isauthenticated()) {
    //res.render("main");
    console.log("isAuthenticated");
  }  else {
    res.redirect("/login");
  }
}
app.post("/register",function(req,res){
  // console.log(req.body.username);
  // var user = new Login({
  //   username: req.body.username,
  //   email: req.body.email,
  //   password: req.body.password,
  // })
  // user.save(function(err){
  //   if(!err){
  //       use.push(req.body.username);
  //       console.log("No errors, Registered Successfully");
  //       res.redirect("/main");
  //   }
  //   else
  //     console.log(err);
  // });
  console.log(req.body.username);
  console.log(req.body.email);
  console.log(req.body.password);
  Login.register({username: req.body.username, email:req.body.email}, req.body.password, function(err, user){
    if(err){
      console.log(err);
      res.redirect("/register");
    } else{
      passport.authenticate("local")(req, res, function(){
        console.log("Registered Successfully");
        res.redirect("/main");
      });
    }
  })
});

app.post("/login",function(req,res){
  // console.log(req.body.username);
  // var req_email= req.body.email;
  // var req_pass = req.body.password;
  // Login.findOne({username: req.body.username}, function(err,foundUser){
  //   if(!foundUser){
  //
  //     res.render("login",{callback:"Invalid username, Try Again"});
  //     console.log("Invalid Username");
  //   }
  //   else
  //     {
  //       use.push(req.body.username);
  //       console.log("User Found");
  //       if(req_email === foundUser.email){
  //         console.log("Correct Email");
  //         if(req_pass === foundUser.password){
  //           console.log("Correct Password");
  //           res.redirect("/main");
  //         }
  //         else{
  //           res.render("login",{callback:"Invalid Password, Try Again"});
  //         }
  //       }
  //       else{
  //         res.render("login",{callback:"Invalid Email, Try Again"});
  //       }
  //     }
  // });
});
app.listen(4000, function(){
  console.log("Server running on port 4000");
})
