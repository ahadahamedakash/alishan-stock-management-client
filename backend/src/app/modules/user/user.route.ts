import express from "express";

import { USER_ROLE } from "./user.constant";
import { UserControllers } from "./user.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { UserValidation } from "../../validation/user.validation";
import { auditLogger } from "../../middlewares/auditLogger";

import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

// CREATE A USER
router.post(
  "/create-user",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin),
  auditLogger('USER_CREATE', 'User'),
  validateRequest(UserValidation.createUserZodSchema),
  UserControllers.createUser
);

// GET ALL USERS
router.get(
  "/get-all-user",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin),
  UserControllers.getAllUser
);

// GET A USER BY ID
router.get(
  "/get-single-user/:id",
  authMiddleware(
    USER_ROLE.super_admin,
    USER_ROLE.admin,
    USER_ROLE.accountant,
    USER_ROLE.stock_manager
  ),
  UserControllers.getUserById
);

// DELETE A USER BY ID
router.delete(
  "/delete-user/:id",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin),
  auditLogger('USER_DELETE', 'User'),
  UserControllers.deleteUserById
);

// UPDATE A USER BY ID
router.patch(
  "/update-user/:id",
  authMiddleware(
    USER_ROLE.super_admin,
    USER_ROLE.admin,
    USER_ROLE.accountant,
    USER_ROLE.stock_manager
  ),
  auditLogger('USER_UPDATE', 'User'),
  UserControllers.updateUserById
);

// RESET USER
router.patch(
  "/reset-user",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin),
  UserControllers.resetUserPassword
);

export const UserRoutes = router;
