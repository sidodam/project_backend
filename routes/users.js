import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
} from "../controllers/userController.js";
import { verifyUser, verifyAdmin } from "../utils/verifyToken.js";
const router = express.Router();

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

router.get("/:id", getUser);

router.get("/", verifyAdmin, getUsers);

export default router;
