
import express from "express";
import jwt from "jsonwebtoken"
import { 
  searchVehiclesModel, 
  addVehicleModel, 
  updateVehicleModel, 
  deleteVehicleModel
} from "../models/searchModel.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();




router.post("/search", async (req, res) => {

  try {

    const { 
	query = "", 
	limit = 20, 
	sortBy = "vehicle_desc", 
	offset = 0, 
	mode = "all" 
    } = req.body || {};

    // logged-in user ID if JWT cookie exists
    let user_id = null;

    const token = req.cookies?.jwt;

    if (token) {

      try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

	// Verify if your JWT payload uses user_id or userID/id
        user_id = decoded.user_id;
      } 
	
      catch (error) {
        // Token invalid or missing
	console.error("JWT Verification failed:", error.message);
      }
    }

    const pageLimit = Math.max(1, parseInt(limit, 10) || 20);

    const pageOffset = Math.max(0, parseInt(offset, 10) || 0);

    const rows = await searchVehiclesModel({
      query,
      limit: pageLimit,
      offset: pageOffset,
      sortBy,
      mode,
      user_id
    });

    res.json({
      success: true,
      data: rows,
      limit: pageLimit,
      offset: pageOffset,
      count: rows.length
    });
  } 

  catch (error) {

    console.error("Error searching vehicles:", error);

    res.status(500).json({ success: false, error: "Failed to fetch vehicles" });
  }
});




router.post("/add", verifyToken, async (req, res) => {

  try {

    const vehicleId = await addVehicleModel({ ...req.body, user_id: req.user.user_id});

    res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      vehicle_id: vehicleId
    });
  } 

  catch (error) {

    console.error("Error adding vehicle:", error);

    res.status(500).json({ success: false, error: error.message || "Failed to add vehicle" });
  }
});




router.post("/update", verifyToken, async (req, res) => {

  try {

    const user_id = req.user.user_id;

    await updateVehicleModel({ ...req.body, user_id });

    res.json({ success: true, message: "Vehicle updated successfully" });
  } 

  catch (error) {

    console.error("Error updating vehicle:", error);

    res.status(500).json({ success: false, error: "Failed to update vehicle" });
  }
});




router.post("/delete", verifyToken, async (req, res) => {

  try {

    const { vehicle_id } = req.body;

    const user_id = req.user.user_id;

    await deleteVehicleModel(vehicle_id, user_id);

    res.json({ success: true, message: "Vehicle deleted successfully" });
  } 

  catch (error) {

    console.error("Error deleting vehicle:", error);

    res.status(500).json({ success: false, error: "Failed to delete vehicle" });
  }
});

export default router;
