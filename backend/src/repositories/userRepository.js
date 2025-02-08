
import User from "../schema/user.js";
import crudRepository from "./crudRepository.js";

export const userRepository = crudRepository(User);

export const createUser = async (data) => userRepository.create(data);
export const getUsers = async () => userRepository.getAll();
export const getUserById = async (id) => userRepository.getById(id);
export const updateUser = async (id, data) => userRepository.update(id, data);
export const deleteUser = async (id) => userRepository.delete(id);

export const getUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

export const getUserByName = async (username) => {
  try {
    return await User.findOne({ username });
  } catch (error) {
    console.error('Error getting user by name:', error);
    throw error;
  }
};

