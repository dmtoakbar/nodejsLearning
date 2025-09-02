import { createUserService, deleteUserService, getAllUsersService, getUserByIdService, updateUserService } from "../model/userModel.js";

// standardized response function
const handleResponse = (res, status, message, data=null) => {
    res.status(status).json({
      status,
      message,
      data
    });
};

export const createUser = async (req, res, next) => {
  const {name, email} = req.body;
  try {
    const newUser = await createUserService(name, email);
    handleResponse(res, 201, "User created successfully", newUser);
  } catch(e) {
   next(e);
  }
};

export const updateUser = async (req, res, next) => {
  const { name, email } = req.body;
  const { id } = req.params;  
  try {
    const user = await updateUserService(id, name, email);
    if (!user) return handleResponse(res, 404, `User not found ${id, name, email}`); 
    handleResponse(res, 200, "User updated successfully", user);
  } catch (e) {
    next(e);
  }
};

export const getAllUsers = async (req, res, next) => {
    try {
      const users = await getAllUsersService();
      handleResponse(res, 201, "Users fetched successfully", users);
    } catch(e) {
     next(e);
    }
  };

  export const getUserById = async (req, res, next) => {
    try {
      const users = await getUserByIdService(req.params.id);
      if(!users) return handleResponse(res, 404, "User not found");
      handleResponse(res, 201, "User fetched successfully", users);
    } catch(e) {
     next(e);
    }
  };

  export const deleteUser = async (req, res, next) => {
    try {
      const user = await deleteUserService(req.params.id);
      if(!user) return handleResponse(res, 404, "User not found");
      handleResponse(res, 201, "User deleted successfully", user);
    } catch(e) {
     next(e);
    }
  };