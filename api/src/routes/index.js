const { json } = require('body-parser');
const bodyParser = require('body-parser');
const { Router, application } = require('express');
const axios = require('axios').default;
const {Activity , Country , Country_Activity} = require('../db.js')
const { Op } =require('sequelize')
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();
router.use(bodyParser.json())

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

const removeCharacters = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036fÅ]/g, ""); // eimino acentos y caracter Å
};
/* const data = async () =>{

    //console.log("recibo la data",Arr.data); //recibe la data de la api
    return Arr.data;
} */

router.get('/countries', async (req , res,next)=>{
    const name = req.query.name
    try {
        let full = await Country.findAll(); // verifico si mi tabla esta llena
        if(!full.length) {
            const Arr = await axios.get('https://restcountries.com/v3/all')
            const data = Arr.data.map((e) => {
                return {
                id: e.cca3,
                name: removeCharacters(e.name.common),
                flag: e.flags[1],
                continent: e.region,
                capital: e.capital ? e.capital[0] : "doesn't have capital",
                subregion: e.subregion,
                area: e.area,
                tld: e.tld,
                population: e.population,
                };
            });
            await Country.bulkCreate(data);
            res.status(200)
        }
    } catch (error) {
        next(error)
    }
'----------------------------------------------------------------------------'
/* The above code is a function that is used to search for a country by name. */
    if (name){
        try {
            let nameDb = await Country.findAll({
                where : {
                    name :{
                        [Op.iLike] : '%' + name + '%'
                    }
                },
                include : {model : Activity}
            })
            return res.status(200).json(nameDb)
        } catch (error) {
            next(error ,'no existe el pais')
        }
    }  else if(req.query.filter === 'Population'){
        try {
            let allForPopulation = await Country.findAll({
                limit : 10,
                offset : req.query.page,
                order : [["population",req.query.order]],
                include : {model : Activity}
            });
            res.status(200).json(allForPopulation)
        } catch (error) {
            next(error);
        }
    }  else if (req.query.filter) {
        try {
            let filterContinent = await Country.findAll({
                where : {
                    continent : req.query.filter,
                },
                limit : 10,
                offset : req.query.page,
                order : [["name",req.query.order]],
                include : {model : Activity}
            });
            return res.status(200).json(filterContinent)
        } catch (error) {
            next(error)
        }
    }else {
        try {
            let allCountries = await Country.findAll({
                limit : 10,
                offset : req.query.page,
                order : [["name",req.query.order]],
                include : {model : Activity}
            });
            res.status(200).json(allCountries)
        } catch (error) {
            next(error);
        }
    }
})
/* This is a function that is used to search for a country by id. */
router.get('/countries/:id', async (req , res)=>{
    const {id} = req.params
    try {
        let idDb = await Country.findAll({
            where: {
                id : id
            },
            include : {
                model : Activity
            }
        })
        return res.status(200).json(idDb)
    } catch (error) {
        next(400 , error);
    }
})
/* This function is used to get all the activities. */
router.get('/activities',async (req , res)=>{
    try {
        const getActivities = await Activity.findAll()
        return res.status(200).json(getActivities)
    } catch (error) {
        next(error)
    }
})
router.post('/activities', async (req , res,next)=>{
    const form = req.body;
    console.log(req.body)
    try {
        let [activityCreated , created] = await Activity.findOrCreate({
            where : {
                name : form.name,
                duration : form.duration,
                difficulty : form.difficulty,
                season : form.season
            }
        })
        console.log(created)//devuelve true si crea la tabla
        /* relaciono las tablas */
        await activityCreated.setCountries(form.countryId)
        res.status(200).json(activityCreated)
    } catch (error) {
        next(error)
    }
})
router.delete('/delete/:id',async(req,res,next)=>{
    try {
        await Activity.destroy({
            where: {
                id : req.params.id
            }
        })
        res.status(200).send('Deleted successfully')
    } catch (error) {
        next(error)
    }
})
// router.post('/prueba',async(req,res,next)=>{
//     const newCountry = req.body;
//     try {
//         const country = await Country.findOrCreate({
//             where:{
//                 id : newCountry.id,
//                 name : newCountry.name,
//                 flag : newCountry.flag,
//                 continent : newCountry.continent,
//                 capital : newCountry.capital,
//             }
//         })
//         res.status(200).send(country)
//     } catch (error) {
//         next(error)
//     }
// })

module.exports = router;
