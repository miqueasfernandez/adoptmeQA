
import { petsService, usersService } from "../services/index.js";
import MockingService from "../services/mocking.js";

const getMockingPets = async (req, res) => {
    const pets = await MockingService.generateMockingPets(100); 
    res.send({status: "success", payload: pets}); 
}

const getMockingUsers = async (req, res) => {
    const users = await MockingService.generateMockingUsers(50);
    res.send({status: "success", payload: users}); 
}

const generateData = async (req, res) => {
    const { users, pets } = req.body; 
    try {
        //generamos los usuarios falsos
        const mockingusers = await MockingService.generateMockingUsers(users);
        //generamos las mascotas falsas
        const mockingpets = await MockingService.generateMockingPets(pets);
        //insertamos los datos falsos en la base de datos
        await Promise.all(mockingusers.map(user => usersService.create(user)));
        await Promise.all(mockingpets.map(pet => petsService.create(pet)));
        res.send({status: "success", message: "Data generated"});
    } catch (error) {
        console.log(error);
        res.status(500).send({status: "error", error: error.message});
    }
}

export default {
    getMockingPets,
    getMockingUsers,
    generateData
}