var dataModule = require("./serverDataModule.js");
test('test by zeduo zhang: when the game url already exists',()=>{
    return dataModule.addGame({
        gameName: "game with same url",
        gameUrl: 'https://www.youtube.com',
        gameDescription: 'A game is a structured form of play, usually undertaken for entertainment or fun, and sometimes used as an educational tool.[1] Games are distinct from work, which is usually carried out for remuneration, and from art, which is more often an expression of aesthetic or ideological elements. However, the distinction is not clear-cut, and many games are also considered to be work (such as professional players of spectator sports or games) or art (such as jigsaw puzzles or games involving an artistic layout such as Mahjong, solitaire, or some video games).',
        userNum: 1,
        categoryId: 1
    }).then(res=>res.json())
    .then((res)=>{
    })
    .catch(err=>{
        expect(err).toEqual("urlfail");
    })
});
test('test by zeduo zhang: when the game name already exists', () => {
    return dataModule.addGame({
        gameName: "game 1",
        gameUrl: "https://www.youtube.com",
        gameDescription: "A game is a structured form of play, usually undertaken for entertainment or fun, and sometimes used as an educational tool.[1] Games are distinct from work, which is usually carried out for remuneration, and from art, which is more often an expression of aesthetic or ideological elements. However, the distinction is not clear-cut, and many games are also considered to be work (such as professional players of spectator sports or games) or art (such as jigsaw puzzles or games involving an artistic layout such as Mahjong, solitaire, or some video games).",
        userNum: 1,
        categoryId: 1
    })
    .then(response=>response.json())
    .then(res=>{

    })
    .catch(err=>{
        expect(err).toEqual("namefail");
    })
});


test("test by zeduo zhang: when the game name and game url does not exist",()=>{
    return dataModule.addGame({
        gameName: "game test",
        gameUrl: 'https://www.youtube1.com',
        gameDescription: 'A game is a structured form of play, usually undertaken for entertainment or fun, and sometimes used as an educational tool.[1] Games are distinct from work, which is usually carried out for remuneration, and from art, which is more often an expression of aesthetic or ideological elements. However, the distinction is not clear-cut, and many games are also considered to be work (such as professional players of spectator sports or games) or art (such as jigsaw puzzles or games involving an artistic layout such as Mahjong, solitaire, or some video games).',
        userNum: 1,
        categoryId: 2
    })
    .then((res)=>{
        expect(res.json).toEqual("success");
    })
    .catch(err=>{
    })
});

test("test by zeduo zhang: update the information of user",()=>{
    return dataModule.updateUserInfo({
        userName:"jarvis",
        password:"123456",
        firstName:"zeduo",
        lastName:"zhang",
        email:"1102297439zzd@gmail.com",
        phoneNum:"6703402102",
        address:"18 james st, waterloo ontario"
    })
    .then(res=>res.json)
    .then(res=>{
        expect(res).toEqual("update user info successfully");
    })
    .catch(err=>{})
})