const fs = require("fs");
const path = require("path");

//requiere bscryptjs to hash password
const bcrypt = require("bcryptjs");


// jala el JSON de menu Completo
const menuCompleto = path.join(__dirname, "../data/menuCompleto.json");
const menu = JSON.parse(fs.readFileSync(menuCompleto, "utf-8"));

// Jala el JSON de los reviews
const reviewsFilePath = path.join(__dirname, "../data/reviews.json");
const reviews = JSON.parse(fs.readFileSync(reviewsFilePath, "utf-8"));

//jala el JSON de las platillos Del mes
const platillosDelMesFilePath = path.join(
  __dirname,
  "../data/platillosDelMes.json"
);
const platillosDelMes = JSON.parse(
  fs.readFileSync(platillosDelMesFilePath, "utf-8")
);

//jala el JSON de usuarios
const usersPath = path.join(__dirname, "../data/users.json");
const users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));

//podemos ocuparlo despues para validar el string que entra
const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const mainController = {
  home: (req, res) => {
    res.render("home", { platillosDelMes, reviews });
  },
  carrito: (req, res) => {
    res.render("carrito", { item: menu });
  },
  sign_up: (req, res) => {
    res.render("createAccount");
  },
  new_sign_up: (req,res) => {
        // ingresa un nuevo usuario al JSON de usuarios
       
  },
  search: (req, res) => {
    let search = req.query.keywords;
    // recibe un string en la barra de busqueda y hace un filter para encontrar que objeto tiene ese mismo nombre
    let productsToSearch = menu.filter((menu) => menu.item == search);
    //si hay un match manda la info de ese objeto
    if (productsToSearch == "") {
      res.render("error");
    } else {
      // la neta no se por que se manda toThousand pero ahi esta
      res.render("product", { item: productsToSearch[0], search, toThousand });
    }
  },
  loginExisting: (req, res) => {    
    const user = users.find( user => user.username == req.body.username);

    if(user){
      bcrypt.compare(req.body.password,user.password).then((result)=>{
        if(result){
          res.redirect('/producto/menu')
        } else {
          console.log("Contrasena no hace match")
        }
      }).catch((err)=>console.error(err))
    } else {
      res.render('home', {errormessage: 'No hay usuario', platillosDelMes, reviews });
    }
  },
  dashboard: (req, res) => {
    res.send("estas dentro");
  },
};

module.exports = mainController;
