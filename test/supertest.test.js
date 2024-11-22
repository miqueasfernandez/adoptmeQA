//no necesitamos trae un dao particular por que vamos a testear la app completa
//tengo que importar el modulo de supertest
import supertest from "supertest";
import chai from "chai";

const expect = chai.expect;

//ahora vamos a creart una constante que se encargara de hacer las peticiones al servidor

const requester = supertest("http://localhost:8080");

//cremos los decribe uno para la app en general y el otro para cada entidad interna.

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
            
            // evaluamos
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
    })

    //testing con carga de img

    describe("testing de imagenes", () => {
        it("tenemos que crear una mascota con una imagen", async () => {
            const mocksConImagen = {
                name: "Rex",
                specie: "Perro",
                birthDate: "10-12-2020",
               
            }
            //ya usamos el metodo send, ahora usaremos el mtodo field para los distitntos campos
            await requester.post("/api/pets/withimage")
            .field("name",mocksConImagen.name)
            .field("specie",mocksConImagen.specie)
            .field("birthDate",mocksConImagen.birthDate)
            .attach("image", "./test/cat-2083492_1280.jpg");

            expect(resultado.status).to.equal(200);

            expect(resultado._body.payload).to.have.property("_id");

            expect(resultado._body.payload.image).to.be.ok
        })
    })
})