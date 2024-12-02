import app from '../src/app.js';
import supertest from 'supertest';
import { expect } from 'chai';

let server;

before(() => {
  server = app.listen(3000); // Usa un puerto diferente si 8080 está ocupado
});

after(() => {
  server.close(); // Cierra el servidor después de las pruebas
});

describe('Adoptions API', () => {

    // Test para obtener todas las adopciones
    describe('GET /adoptions', () => {
        it('deberia retornar todas las adopciones', async () => {
            const res = await supertest(app)  
                .get('/api/adoptions');
                console.log(res.body);
            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal("success");
            //expect(res.body.payload).to.have.property('_id').equal(adoptionId);;
        });
    });

    // Test para obtener una adopción por ID
    describe('GET /adoptions/:aid', () => {
        it('deberia retornar una adopcion por ID', async () => {
            const adoptionId = '67466b050be9f6a7b2ee6f32';

            const res = await supertest(app)  
                .get(`/api/adoptions/${adoptionId}`);

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal('success');
            expect(res.body.payload).to.have.property('_id').equal(adoptionId);
        });

        it('deberia retornar 404 si la adopcion no existe', async () => {
            const invalidAdoptionId = '67466b050be9f6a7b2ee6f31';

            const res = await supertest(app) 
                .get(`/api/adoptions/${invalidAdoptionId}`);

            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal('error');
            expect(res.body.error).to.equal('Adopcion no encontrada');
        });
    });

    // Test para crear una adopción
    describe('POST /adoptions/:uid/:pid', () => {
        it('deberia adoptar una mascota', async () => {
            const userId = '6744f3f3d7aab35a4748e267'; 
            const petId = '6743e3533be42ddfebcbe23b'; 

            const res = await supertest(app)  
                .post(`/api/adoptions/${userId}/${petId}`)
                .send();

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal('success');
            expect(res.body.message).to.equal('mascota adoptada');
        });

        it('deberia retornar 404 si el usuario no existe', async () => {
            const invalidUserId = '67202a49c433503bc2786511';
            const petId = '67202a49c433503bc27865e1';

            const res = await supertest(app)  
                .post(`/api/adoptions/${invalidUserId}/${petId}`)
                .send();

            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal('error');
            expect(res.body.error).to.equal('usuario no encontrado');
        });

        it('deberia retornar 404 si la mascota no existe', async () => {
            const userId = '6744f3f3d7aab35a4748e267';
            const invalidPetId = '67202a49c433503bc2786522';

            const res = await supertest(app)  // Usa supertest(app) directamente
                .post(`/api/adoptions/${userId}/${invalidPetId}`)
                .send();

            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal('error');
            expect(res.body.error).to.equal('mascota no encontrada');
        });

        it('deberia retornar 400 si la mascota ya esta adoptada', async () => {
            const userId = '6744f3f3d7aab35a4748e267';
            const petId = '67202a49c433503bc27865e1'; // Pet ID que ya está adoptada

            const res = await supertest(app)  // Usa supertest(app) directamente
                .post(`/api/adoptions/${userId}/${petId}`)
                .send();

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal('error');
            expect(res.body.error).to.equal('la mascota ya esta adoptada');
        });
    });

});
