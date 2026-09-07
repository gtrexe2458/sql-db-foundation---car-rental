
import { db } from "../config/db.js";




export const searchVehiclesModel = async ({ 
  query = "", 
  limit = 10, 
  sortBy = "vehicle_desc", 
  offset = 0, 
  mode="all", 
  user_id = null }) => {
  let sql = `SELECT 
    v.vehicle_id, v.make, v.model, v.year, v.color, v.license_plate, 
    v.status, v.daily_rate, v.image_url,
    v.category_name,
    s.engine, s.horsepower, s.accel_0_100_sec, s.top_speed_kmh, s.top_speed_mph, s.description,
    u.contact AS contact, u.country AS country
    FROM vehicles v
    LEFT JOIN vehicle_specs s ON v.spec_id = s.spec_id
    LEFT JOIN users u ON v.user_id = u.user_id
  `;

  const args = [];
  const whereConditions = [];

  const isMyMode = String(mode).toLowerCase().includes("my");

  // Filter based on dropdown mode
  if (user_id) {

    if (isMyMode) {
      whereConditions.push(`v.user_id = ?`);
      args.push(user_id);
    } 

    else {
      // Exclude logged-in user's cars when viewing marketplace
      whereConditions.push(`v.user_id != ?`);
      args.push(user_id);
    }
  }

  // Search filter
  const searchQuery = query.trim();

  if (searchQuery.length > 0) {

    const terms = searchQuery.split(/\s+/);

    const whereClauses = terms.map(() => `(
	    u.country LIKE ? OR 
	    v.color LIKE ? OR 
	    v.make LIKE ? OR 
	    v.model LIKE ? OR 
	    CAST(v.year AS TEXT) LIKE ? OR 
	    v.category_name LIKE ?
    )`);

    whereConditions.push(`(` + whereClauses.join(" AND ") + `)`);

    terms.forEach((term) => {

      const wildcard = `%${term}%`;

      args.push(wildcard, wildcard, wildcard, wildcard, wildcard, wildcard);
    });
  }

  if (whereConditions.length > 0) {

    sql += ` WHERE ` + whereConditions.join(" AND ");
  }
  
  // Whitelist allowed sort fields to prevent SQL injection
  const sortMap = {
    vehicle_desc: "v.vehicle_id DESC",
    price_asc: "v.daily_rate ASC",
    price_desc: "v.daily_rate DESC",
    year_desc: "v.year DESC",
    year_asc: "v.year ASC",
    make_asc: "v.make ASC",
    hp_asc: "s.horsepower ASC",
    hp_desc: "s.horsepower DESC"
  };

  const selectedSort = sortMap[sortBy] || "v.daily_rate ASC";

  sql += ` ORDER BY ${selectedSort} LIMIT ? OFFSET ?;`;

  args.push(limit, offset);

  const result = await db.execute({ sql, args });

  return result.rows;
};




export const addVehicleModel = async (carData) => {
  const {
    user_id,
    make, model, year, color, license_plate, category_name,
    daily_rent_eur, engine, horsepower, accel_0_100_sec,
    top_speed_kmh, top_speed_mph, image_url, description
  } = carData;

  // Insert into vehicle_specs
  const specResult = await db.execute({
    sql: `INSERT INTO vehicle_specs 
            (engine, horsepower, accel_0_100_sec, top_speed_kmh, top_speed_mph, daily_rent_eur, description) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      engine || null,
      horsepower ? parseInt(horsepower, 10) : null,
      accel_0_100_sec ? parseFloat(accel_0_100_sec) : null,
      top_speed_kmh ? parseInt(top_speed_kmh, 10) : null,
      top_speed_mph ? parseInt(top_speed_mph, 10) : null,
      daily_rent_eur ? parseFloat(daily_rent_eur) : 0,
      description || null
    ]
  });
  const specId = Number(specResult.lastInsertRowid);

  // Insert into vehicles
  const vehicleResult = await db.execute({
    sql: `INSERT INTO vehicles 
            (user_id, category_name, spec_id, make, model, year, color, license_plate, daily_rate, image_url) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      user_id,
      category_name,
      specId,
      make,
      model,
      parseInt(year, 10),
      color,
      license_plate,
      parseFloat(daily_rent_eur || 0),
      image_url || null
    ]
  });

  return Number(vehicleResult.lastInsertRowid);
};




export const updateVehicleModel = async (data) => {

  const {
    vehicle_id, user_id, make, model, year, color, license_plate,
    daily_rate, image_url, status = 'AVAILABLE', category_name, engine, horsepower,
    accel_0_100_sec, top_speed_kmh, top_speed_mph, description
  } = data;

  // Update vehicle base fields
  const sqlVehicle = `
    UPDATE vehicles 
    SET make = ?, model = ?, year = ?, color = ?, license_plate = ?, daily_rate = ?, image_url = ?, status = ?, category_name = ?
    WHERE vehicle_id = ? AND user_id = ?
  `;

  await db.execute({
    sql: sqlVehicle,
    args: [
	make, 
	model, 
	year, 
	color,
	license_plate, 
	daily_rate, 
	image_url, 
	status,
	category_name ?? '', 
	vehicle_id, 
	user_id
    ].map(v => v ?? null)
  });

  // Update vehicle specs
  const sqlSpecs = `
    UPDATE vehicle_specs 
    SET engine = ?, horsepower = ?, accel_0_100_sec = ?, top_speed_kmh = ?, top_speed_mph = ?, description = ?
    WHERE spec_id = (
      SELECT spec_id 
      FROM vehicles 
      WHERE vehicle_id = ? 
      AND user_id = ?
    )
  `;

  await db.execute({
    sql: sqlSpecs,
    args: [
	engine, 
	horsepower, 
	accel_0_100_sec, 
	top_speed_kmh, 
	top_speed_mph, 
	description, 
	vehicle_id,
	user_id
    ].map(v => v ?? null)
  });

  return true;
};




export const deleteVehicleModel = async (vehicle_id, user_id) => {

  const sql = `
    DELETE FROM vehicles 
    WHERE vehicle_id = ? AND user_id = ?
  `;

  return await db.execute({ sql, args: [vehicle_id, user_id] });
};
