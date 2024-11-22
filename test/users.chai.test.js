////chai es una libreria de assertions la cual permite hacer comparaciones
//mucho mas claras 
import mongoose from "mongoose";
import User from "../src/dao/Users.dao.js";
import chai from "chai";

const expect = chai.expect;

mongoose.connect('mongodb+srv://kanadesing:negros333@cluster0.cdmifvc.mongodb.net/Adoptme')

describe("testeamos el DAO de Users", function() {
    before(async function() {
        this.usersDao = new User();   
    })
     //intentamos que nos retorne todos los usuarios
    this.beforeEach( function(){
        mongoose.connection.collections.users.drop();
        //aca pedimos que borre la colecion user despues de testear
        this.timeout(6000)
    })
    
    it("el get de usuarios me retorna un array", async function() {
        const resultadoChai = await this.usersDao.get();
        expect(Array.isArray(resultadoChai)).to.be.true;
    });
    
    it("el DAO debe poder agregar un usuario a la base de datos", async function(){
        let usuario = {
            first_Name: "John",
            last_Name: "Doe",
            email: "JohnDoe3@example.com",
            password: "1234"
        }

        const resultado = await this.usersDao.save(usuario);

        expect(resultado).to.have.property("_id")

    })

    //test 2
    it("validamos que el usuario tenga un array de mascvotas vacio",async function(){
        let usuario =  {
            first_Name: "pao",
            last_Name: "argento",
            email: "paoargento@example.com",
            password: "1234"
        }
        const resultado = await this.userDao.save(usuario);
        //assert.deepEqual(resultado.pets,[]);

        expect(resultado).to.deep.equal([])
    })
        
    after (async function(){
        await mongoose.disconnect();
    })
    
})   
   
    

   