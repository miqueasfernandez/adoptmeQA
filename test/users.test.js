import User from "../src/dao/Users.dao.js"; //me trsigo el dao de users
import mongoose from "mongoose";
import assert  from "assert";

mongoose.connect('mongodb+srv://kanadesing:negros333@cluster0.cdmifvc.mongodb.net/Adoptme')

//describe: es una funcion que me permite agrupar un conjunto de pruebas relacionadas bajo el mismo bloque descriptivo
describe("testeamos el DAO de Users", function(){
    before(function(){
     this.usersDao = new User();   
    })
    
    
    this.beforeEach(async function(){
        await mongoose.connection.collections.users.drop();
        //aca pedimos que borre la colecion user despues de testear
    })
    

    //intentamos que nos retorne todos los usuarios
    it("el get de usuarios me debe retornar un array", async function(){
        const resultado = await this.userDao.get();

        assert.strictEqual(Array.isArray(resultado),true)
    })

    //test 1
    it("el DAO debe poder agregar un usuario a la base de datos", async function(){
        let usuario = {
            first_Name: "John",
            last_Name: "Doe",
            email: "JohnDoe3@example.com",
            password: "1234"
        }

        const resultado = await this.userDao.save(usuario);

        assert.ok(resultado._id)
        //aca verificamos que elvalor que recibimos sea verdadero
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
        assert.deepEqual(resultado.pets,[]);
    })

    //test 3
    it("validamos que el usuario por email",async function(){
        let usuario =  {
            first_Name: "pao",
            last_Name: "argento",
            email: "paoargento@example.com",
            password: "1234"
        }
        await this.userDao.save(usuario);

        const user = await this.userDao.getBy({email: usuario.email});
        assert.strictEqual(typeof user, "object")
    })
    after (async function(){
        await mongoose.disconnect();
    })
})