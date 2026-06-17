import bcrypt from "bcrypt";

import config from "../../config";

import { User } from "./user.model";
import { IUser } from "./user.interface";
import {
  emitToRoles,
  emitNotification,
  SERVER_EVENTS,
  NOTIFICATION_TYPES,
  NOTIFICATION_PRIORITY,
} from "../../socket";
import { getUserName } from "../../socket/helpers";

const createUser = async (userData: IUser, issuedBy: string) => {
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
      throw new Error("This email already exists! Please use another email.");
    }
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(
      userData.password,
      parseInt(config.bcrypt_salt_rounds, 10)
    );

    // Replace the plain password with the hashed password
    const userWithHashedPassword = {
      ...userData,
      password: hashedPassword,
    };

    // Create the user
    const user = new User(userWithHashedPassword);
    const savedUser = await user.save();

    // Emit real-time notification for user created
    try {
      const creatorName = await getUserName(issuedBy);

      const userData = {
        userId: savedUser._id.toString(),
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        createdBy: issuedBy,
        userName: creatorName,
        timestamp: new Date(),
      };

      // Emit user created event to all admins
      emitToRoles(['admin'], SERVER_EVENTS.USER_CREATED, userData);

      // Also emit as notification
      emitNotification(
        ['admin'],
        NOTIFICATION_TYPES.USER,
        NOTIFICATION_PRIORITY.LOW,
        {
          title: 'New User Created',
          message: `${savedUser.name} joined as ${savedUser.role}`,
          details: userData,
        }
      );
    } catch (socketError) {
      console.error('Failed to emit socket event:', socketError);
    }

    return savedUser;
  } catch (error) {
    throw error;
  }
};

const getAllUser = async () => {
  try {
    // Retrieve all users who are not deleted and whose role is not super_admin
    const users = await User.find({
      isDeleted: false,
      role: { $ne: "super_admin" },
    });

    return users;
  } catch (error) {
    throw new Error("Failed to retrieve users");
  }
};

const getUserById = async (userId: string) => {
  try {
    // Find user by ID and check if not deleted
    const user = await User.findOne({ _id: userId, isDeleted: false });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error("Failed to retrieve user");
  }
};

const deleteUserById = async (userId: string) => {
  try {
    // Find user by ID and check if not deleted
    const user = await User.findOne({ _id: userId, isDeleted: false });
    if (!user) {
      throw new Error("User not found");
    }
    user.isDeleted = true;
    await user.save();
    return user;
  } catch (error) {
    throw new Error("Failed to delete user");
  }
};

const updateUserById = async (userId: string, updateData: Partial<IUser>) => {
  try {
    // Find user by ID and check if not deleted
    const user = await User.findOne({ _id: userId, isDeleted: false });
    if (!user) {
      throw new Error("User not found");
    }
    return await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
  } catch (error) {
    throw new Error("Failed to update user");
  }
};

const resetUserPassword = async (userId: string, newPassword: string) => {
  try {
    const user = await User.findOne({ _id: userId, isDeleted: false });
    
    if (!user) {
      throw new Error("User not found");
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      parseInt(config.bcrypt_salt_rounds, 10)
    );

    user.password = hashedPassword;
    user.needPassChange = true;

    await user.save();

    return user;
  } catch (error) {
    throw new Error("Failed to reset user password");
  }
};

export const UserServices = {
  createUser,
  getAllUser,
  getUserById,
  deleteUserById,
  updateUserById,
  resetUserPassword
};
