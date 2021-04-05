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
    rating:Sequelize.FLOAT,
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
/*
Category.hasMany(Game, {foreignKey: 'categoryId'}); 
Category.create({
    categoryName: "adventure",
    categoryImage: "/img/adventure.jpeg"
}).then(res=>console.log(res))
.catch(err=>console.log(err));
Category.create({
    categoryName: "action",
    categoryImage: "/img/action.jpg"
}).then(res=>console.log(res))
.catch(err=>console.log(err));
Category.create({
    categoryName: "shooter",
    categoryImage: "/img/shooter.jpg"
}).then(res=>console.log(res))
.catch(err=>console.log(err));
Category.create({
    categoryName: "strategy",
    categoryImage: "/img/strategy.jpg"
}).then(res=>console.log(res))
.catch(err=>console.log(err));
*/

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
/*
User.create({
    userName:"jarvis",
    password: "123456",
    firstName: "jarvis",
    lastName: "zhang",
    email: "1102207439zzd@gmail.com",
    phoneNum: "3442322342",
    address: "130 columbia st, west",
    isAdmin: true
}).then(res=>console.log(res))
.catch(err=>console.log(err));
*/
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
            resolve("update user info successfully");
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
        GameRating.create(newRating).then(data=> {
            calculateRate(newRating.gameNum);
            resolve();
        }).catch(err=> {
            reject('unable to create rating: ');
        })
    });
};


const calculateRate = (gameNum)=>{
  //  console.log("Calculate Method*****gameNum:"+ gameNum);
    this.getAvgRatingByGameId(gameNum).then((data)=>{
        var newGameRate = data;
    //    console.log("Calculate Method***** newGameRate in Game"+ JSON.stringify(newGameRate));

        this.getGameById(gameNum).then((data)=>{
            var game = data;
          game.rating =newGameRate[0].rating;
    //        console.log("Calculate Method***** updated Game"+ JSON.stringify(game));
            this.updateGameRating(game).then(()=>{                
                console.log("***** Game updated in datbase");  
          })
            .catch((err)=>{
                return res.json({});
            })
        })
        .catch((err)=>{
            return res.json({});
        })

    })
    .catch((err)=>{
        return res.json({});
    })
 //   console.log("Calculate Method***** Updated Rating in Game"+ JSON.stringify(game));

}


module.exports.getRatingByGameId = function(id) {
    return new Promise((resolve, reject) =>{
        
        GameRating.findAll({
            where: {
                gameNum: id
            }
        }).then(data=>{
            data = data.map(value=>value.dataValues);
            resolve(data);
        }).catch(err=>{
            reject('no results returned');
        })
    });
}

module.exports.getAvgRatingByGameId = function(id) {
    return new Promise((resolve, reject) =>{
        
        GameRating.findAll({
            attributes: [             
                [Sequelize.fn('AVG', Sequelize.col('rating')), 'rating'],
           ],
               where: {
                gameNum: id
            }
        }).then(data=>{
            data = data.map(value=>value.dataValues);
            resolve(data);
           // console.log("Ratings:"+JSON.stringify(data));
        }).catch(err=>{
            reject('no results returned');
        })
    });
}

module.exports.updateGameRating = function(data){
    return new Promise(function (resolve, reject) { 
         
                 Game.update(data, {
                where: {
                    gameNum: data.gameNum
                }
               
            }).then(data=>{
                resolve(`Rating for Game  id: ${data.gameNum} successfully updated`);
            }).catch(err=>{
                reject(err);
            });
        
       });

 }

module.exports.getAllRates = function() {
    return new Promise((resolve, reject) => {
        GameRating.findAll().then(data=> {
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
