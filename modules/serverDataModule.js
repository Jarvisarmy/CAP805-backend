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
    gameDescription: Sequelize.TEXT
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
module.exports.addGame = function(gameData) {
    return new Promise((resolve, reject) => {
        const newGame = gameData;
        for (let item in newGame) {
            if (newGame[item] == "") {
                newGame[item] = null;
            }
        }
        Game.create(newGame).then(data=> {
            resolve();
        }).catch(err=> {
            reject('unable to create game');
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

module.exports.initialize = function() {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(()=> {
            resolve();
        }).catch(err => {
            reject('unable to sync the database');
        });
    });
};
