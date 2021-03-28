const Sequelize = require("sequelize");
var sequelize = new Sequelize('d9bfp8n89d7h2d','pdevmqkvqrkeko','e76470809e0349f6aaacd6d1619362c597b582c9e091d1ae7c5ac3827d810635',{
    host: 'ec2-23-21-229-200.compute-1.amazonaws.com',
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
    userNum:Sequelize.INTEGER,
    categoryId: Sequelize.INTEGER
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

var GameRating = sequelize.define('Rating',{
    RatingId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    gameNum: Sequelize.INTEGER,
    rating: Sequelize.FLOAT,
    userNum:Sequelize.INTEGER  
});

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
// function returns games by userNum
module.exports.getGamesByUser = function(num) {
    return new Promise((resolve, reject)=>{
        Game.findAll({
            where: {
                userNum: num
            }
        }).then(data=>{
            data = data.map(value=>value.dataValues);
            resolve(data);
        }).catch(err=>{
            reject('no results returned');
        })
    });
}

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
// function used to add a rating
module.exports.addRating = function(newRating) {
    return new Promise((resolve, reject) => {
        /*
        for (let item in newGame) {
            if (newGame[item] == "") {
                newGame[item] = null;
            }
        }
        */
        GameRating.create(newRating).then(data=> {
            
            resolve();
        }).catch(err=> {
            reject('unable to create rating: ');
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
