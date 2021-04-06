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
    categoryId: Sequelize.INTEGER,
    isApproved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
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
Category.create({
    categoryName: "adventure",
    categoryImage: "/img/adventure.jpeg"
});
Category.create({
    categoryName: "action",
    categoryImage: "/img/action.jpg"
});
Category.create({
    categoryName: "shooter",
    categoryImage: "/img/shooter.jpg"
});
Category.create({
    categoryName: "strategy",
    categoryImage: "/img/strategy.jpg"
});
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
    phoneNum: Sequelize.STRING,
    address: Sequelize.STRING,
    "isAdmin": Sequelize.BOOLEAN
});
User.hasMany(Game, {foreignKey: 'userNum'}); 

User.create({
    userName:"jarvis",
    password: "123456",
    firstName: "jarvis",
    lastName: "zhang",
    email: "1102207439zzd@gmail.com",
    phoneNum: "3442322342",
    address: "130 columbia st, west",
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


module.exports.getAllUsers = function() {
    return new Promise((resolve, reject) => {
        User.findAll().then(data=> {
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
module.exports.getGameById = function(id) {
    return new Promise((resolve, reject) =>{
        Game.findAll({
            where: {
                gameNum: id
            }
        }).then(data=>{
            data = data.map(value=>value.dataValues);
            resolve(data[0]);
        }).catch(err=>{
            reject('no results returned');
        })
    });
}

// function used to find user
module.exports.getUser = function(user){
    return new Promise((resolve,reject)=>{
        
        User.findAll({
            where: {
              userName: user
            }
          }).then(data=>{
              data = data.map(value=>value.dataValues);
              resolve(data);
          }).catch(err=>{
              reject("No user by that name");
        })
    });
}

//function used to add a user
module.exports.addUser = function(newUser) {
    return new Promise((resolve, reject) => {
        User.create(newUser).then(resolve()).catch(err=> {
            reject('unable to create game: ');
        })
    });
};     
    

// function used to add a game
module.exports.checkGameExist = function(newGame) {

}
module.exports.addGame = function(newGame) {
    return new Promise((resolve, reject) => {
        Game.findAll({
            where: {
                gameName: newGame.gameName
            }
        }).then(data=>{
            data = data.map(value=>value.dataValues);
            if (data.length !== 0) {
                reject("namefail");
                
            } else {
                Game.findAll({
                    where: {
                        gameUrl: newGame.gameUrl
                    }
                }).then(data=>{
                    data = data.map(value=>value.dataValues);
                    if (data.length !== 0) {
                        reject("urlfail");
                        
                    } else {
                        Game.create(newGame).then(data=> {
                            resolve("success");
                        }).catch(err=> {
                            reject('other');
                        })
                    }
                }).catch(err=>{
                    reject("other");
                })
            }
        }).catch(err=>{
            reject("other");
        })
        
            
    });
};

module.exports.updateUserInfo = function(user) {
    return new Promise((resolve, reject) => {
        var temp = {};
        temp.firstName = user.firstName;
        temp.lastName = user.lastName;
        temp.email = user.email;
        temp.phoneNum = user.phoneNum;
        temp.address = user.address;
        User.update(temp,{
            where: {
            userName: user.userName,
            password: user.password
        }}).then(data=> {
            resolve();
        }).catch(err=>{
            reject('unable to update user');
        })
    })
}
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

module.exports.deleteUserByNum=function(Num) {
    return new Promise((resolve,reject)=> {
        User.destroy({
            where:{userNum: Num}
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

//Get all unapproved games
module.exports.getUnApprovedGames = function() {
    return new Promise((resolve, reject)=>{
        Game.findAll({
            where: {
                isApproved: false
            }
        }).then(data=>{
            data = data.map(value=>value.dataValues);
            resolve(data);
        }).catch(err=>{
            reject('no results returned');
        })
    });
}

//approve games
module.exports.approveGames = function(num){
    return new Promise((resolve, reject) => {
         

        Game.update({isApproved : true},{
            where: {
            gameNum: num
        }}).then(data=> {
            resolve();
        }).catch(err=>{
            reject('unable to approve game');
        })
    }) 
}

module.exports.initialize = function() {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(()=> {
            resolve();
        }).catch(err => {
            reject('unable to sync the database');
        });
    });
};
