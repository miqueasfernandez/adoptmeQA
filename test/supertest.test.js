//no necesitamos trae un dao particular por que vamos a testear la app completa
//tengo que importar el modulo de supertest
import supertest from "supertest";
//importamos el modulo de chai que es una libreria de assertions para node
import chai from "chai";
import { it } from "mocha";
import http from 'http';
const expect = chai.expect;


let server;

before(() => {
  server = app.listen(8081); // Usa un puerto diferente si 8080 está ocupado
});

after(() => {
  server.close(); // Cierra el servidor después de las pruebas
});

//ahora vamos a creart un requester que se encargara de hacer las peticiones al servidor

const requester = supertest("http://localhost:8080");

//cremos los decribe, uno para la app en general y el otro para cada entidad interna.

describe("testing de la app web adoptme", () => {
    describe("testing de mascotas", () => {
        it("endpoint POST de la ruta api/pets debe crear una mascota correctamente", async () => {
        //vamos a crear un mock de una mascota
            const ramboMock = {
                name: "Rambo",
                specie: "Perro",
                birthDate: "12-30-2021",

            }
            const {statusCode, ok, _body } = await requester.post("/api/pets").send(ramboMock);
            //y en esta respuesta yo puedo recibir el ok, body y el status code
            //datos por consola
            console.log(_body);
            console.log(ok);
            console.log(statusCode);

            // preguntamos si el payload contiene _id, en caso de tenerlo, signifdica que la creacion fue correcta
            expect(_body.payload).to.have.property("_id")
        })

        it("se debe corroborar que la mascota creada cuente con propiedad true", async () => {
            const nuevaMascota = {
                name: "Rex",
                specie: "Perro",
                birthDate: "10-12-2020",

            };

            const {statusCode, ok, _body } = await requester.post("/api/pets").send(nuevaMascota);

            expect(statusCode).to.equal(200);
            expect(_body.payload).to.have.property("adopted").that.equals(false);
        })
        it("el modulo debe responder con estatus 400 si la mascota no tiene nombre", async () => {
            const mocksSinNombre = {
                specie: "Perro",
                birthDate: "10-12-2020",

            };

            const {statusCode} = await requester.post("/api/pets").send(mocksSinNombre);

            expect(statusCode).to.equal(400);


        })

        it("al obtener las mascotas con el metodo get, la respuesta debe tener los campos status y payload y debe ser de tipo arreglo ", async () => {
            const{statusCode, _body} = await requester.get("/api/pets");

            expect(statusCode).to.equal(200);
            expect(_body).to.have.property("payload").that.is.an("array")
            expect(_body).to.have.property("status").that.equals("success")
        })

        
        it('debería actualizar el nombre de la mascota', async () => {
            const mascotaId = '67202a49c433503bc27865e1';
            const mascotaActualizada = 'Max2';

            const {statusCode} = await requester.put(`/api/pets/${mascotaId}`).send(mascotaActualizada );

            expect(statusCode).to.equal(200)
            //verificamos que los datos sean actualizados


        })
        it('el metodo DELETE debería eliminar la ultima mascota agregada, primero la agregamos con un post, lugo borramos por el id creado y luego verificamos con un get que se haya eliminado', async () => {
            const nuevaMascota = {
                name: "mascota a borrar",
                specie: "Perro",
                birthDate: "11-9-2021",
            }

            const {_body:{payload:{_id}}} = await requester.post("/api/pets").send(nuevaMascota);

            //paso numero 2 borrar la mascota agregada
            const {statusCode} = await requester.delete(`/api/pets/${_id}`);

            //paso 3 verificamos que se haya borrado
            expect(statusCode).to.equal(200);
            //verificamos que en la db se hayan borrado los datos
        })
    });

    //testing 2 REGISTRO DE USUARIOS    

    describe("testing de usuarios", () => {
        let cookie;
        //declaramos de forma global la cookie para poder usarla en otros tests

        it("debe registrar un usuario", async () => {
            const nuevoUsuario = {
            first_name: "pepe",
            last_name: "perez",
            email: "pepeperez@arcanoe.com",
            password: "1234"
            
            };

            const {_body} = await requester.post("/api/sessions/register").send(nuevoUsuario);
            //validamos que tenga payload
            expect(_body.status).to.be.ok;
        })
    

        it("debe iniciar sesion", async () => {
            const MockUsuario = {
                email: "pepeperez@arcanoe.com",
                password: "1234"
            }
            const resultado = await requester.post("/api/sessions/login").send(MockUsuario);
            //aca me estoy guardando los header de la peticion
            //se obtiene la cookie de session de respuesta y se guarda en la variable
            const resultadocookie = resultado.headers["set-cookie"]["0"];

            //verificamos que la cookie exista
            expect(resultadocookie).to.be.ok;

            //se separa el nombre y el valor de la cookie recuperada y se guardan en un oobjeto
            let cookie = {
                name: resultadocookie.split("=")["0"],
                value: resultadocookie.split("=")["1"] //el metodo split separa un string en cadena mas pequeñas

            }
            // se verifica que el nombre de la cookie sea igual a resultadocookie
            expect(cookie.name).to.be.ok.and.equal(resultadocookie);
            expect(cookie.value).to.be.ok;

        })
        //probamos la ruta current
        it("debe enviar la cookie que contiene el usuario", async () =>{
            
            //enviamos la cookie que nos guardamos
            const{_body} = await requester.get("/api/sessions/current").set("Cookie",[`${cookie.name}=${cookie.value}`]);
            //verificamos que nos retorna el mail
            expect(_body.payload.email).to.be.equal("pepeperez@arcanoe.com");
        })

    }) 


    describe("testing de imagenes", () => {
        it("tenemos que crear una mascota con una imagen", async () => {
            const mocksConImagen = {
                name: "Rex",
                specie: "Perro",
                birthDate: "10-12-2020",

            }
            //ya usamos el metodo send, ahora usaremos el mtodo field para los distitntos campos
            const resultado = await requester.post("/api/pets/withimage")
            .field("name",mocksConImagen.name)
            .field("specie",mocksConImagen.specie)
            .field("birthDate",mocksConImagen.birthDate)
            .attach("image", "./test/cat-2083492_1280.jpg");
            //verificamos:
            expect(resultado.status).to.equal(200);

            expect(resultado._body.payload).to.have.property("_id");

            expect(resultado._body.payload.image).to.be.ok
        })
    })

    describe("testing de adopciones", () => {
        it("tenemos que crear una adopcion", async () => {
           const response = await requester
            .post("/api/pets/6744f3f3d7aab35a4748e267/67202a49c433503bc27865e1")
            .send()

            
            expect(response.statusCode).to.equal(404);
            

        })

        
    })

})