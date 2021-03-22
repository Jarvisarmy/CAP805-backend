const Sequelize = require("sequelize");
var sequelize = new Sequelize('d4tkh6ejtbp6fk','zsizxunfpcswki','ec32e999218ebd9c5886fce0650ec789dd90627c1db7641fc9c8c76b9dcff8dd',{
    host: 'ec2-54-90-13-87.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: {rejectUnauthorized: false}
    }
});
var Game = sequelize.define('Game',{
    gameNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    gameName: Sequelize.STRING,
    gameUrl: Sequelize.STRING,
    gameDescription: Sequelize.TEXT,
    user_id:Sequelize.INTEGER,
    category_id: Sequelize.STRING
    // isAdmin: Sequel:ize.BOOLEAN
});

var Category = sequelize.define('Category',{
    categoryId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    categoryName:  {   
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    categoryImage: Sequelize.STRING      
   });
   Category.hasMany(Game, {foreignKey: 'categoryId'}); 

var User = sequelize.define('User', {
    userNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userName: {
        type:Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: Sequelize.STRING,
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: {
        type: Sequelize.STRING,
        unique: true
    },
    "isAdmin": Sequelize.BOOLEAN
});
User.hasMany(Game, {foreignKey: 'userNum'}); 
User.create({
    userName:"jarvis",
    password: "123456",
    firstName: "jarvis",
    lastName: "zhang",
    email: "1102207439zzd@gmail.com",
    isAdmin: true
});

// function used to return all games
module.exports.getAllGames = function() {
    return new Promise((resolve, reject) => {
        Game.findAll().then(data=> {
            data = data.map(value=>value.dataValues);
            resolve(data);
        }).catch(err=> {
            reject('no results returned');
        })
    });
};

// function used to add a game
module.exports.addGame = function(newGame) {
    return new Promise((resolve, reject) => {
        /*
        for (let item in newGame) {
            if (newGame[item] == "") {
                newGame[item] = null;
            }
        }
        */
        Game.create(newGame).then(data=> {
            resolve();
        }).catch(err=> {
            reject('unable to create game: ');
        })
    });
};
module.exports.deleteGameByNum=function(gameNum) {
    return new Promise((resolve,reject)=> {
        Game.destroy({
            where:{gameNum: gameNum}
        }).then(()=>{
            resolve();
        }).catch(err=>{
            reject();
        });
    });
}


// function used to return categories
module.exports.getAllCategories = function() {
    return new Promise((resolve, reject) => {
        Category.findAll().then(data=> {
            data = data.map(value=>value.dataValues);
            resolve(data);
        }).catch(err=> {
            reject('no results returned');
        })
    });
};
module.exports.initialize = function() {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(()=> {
            resolve();
        }).catch(err => {
            reject('unable to sync the database');
        });
    });
};
