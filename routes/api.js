const express = require('express');
const router = express.Router();
const {Burgers} = require('../config/orm');


router.post('/createBurger', (req, res) => {
    const { burgername } = req.body;
    //console.log(burgername);
    Burgers.create({
        name: burgername
    }).then((burger)=>{
        let plain = burger.get({plain:true});
        return res.json({
            id: plain.id,
            name: plain.name
        });
    }).catch(err=> {
        console.log(err);
        res.status(400).end();
    });
});

router.get('/getBurgers', (req, res) => {
    Burgers.findAll().then(burgers=> {
        res.json(burgers);
    }).catch(err=> {
        console.log(err);
        res.status(400).end();
    });
});

router.put('/eatBurger', (req, res) => {
    const {id} = req.body;
    if (!id) {
        res.status(400).end();
    }
    console.log(id);
    Burgers.findOne({where: {id: id}})
        .then((burger)=> {
            if (burger) {
                burger.update({
                    isDevoured: true
                }).then(()=>{
                    res.json({});
                }).catch(err=> console.log(err));
            }
        }).catch(err=> {
            console.log(err);
            res.status(400).end();
    });
});

module.exports = router;