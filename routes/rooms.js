import express from "express";
import { verifyAdmin } from "../utils/verifyToken.js";
import {
  createRoom,
  getRooms,
  getRoom,
  updateRoom,
  deleteRoom,
  updateRoomAvailability,
} from "../controllers/roomController.js";
const router = express.Router();

router.post("/", verifyAdmin , createRoom);

router.put("/:id", updateRoom);
router.put("/availibility/:id", updateRoomAvailability);

router.delete("/:id/:hotelid", verifyAdmin, deleteRoom);

router.get("/:id", getRoom);

router.get("/", getRooms);

export default router;
