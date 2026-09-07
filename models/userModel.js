
import { db } from '../config/db.js';

export const findUserById = async (userId) => {

  const result = await db.execute({
    sql: `
	SELECT user_id, full_name, email, contact, country, id 
	FROM users 
	WHERE user_id = ?`,
    args: [userId],
  });

  return result.rows[0];
};

export const findUserByEmail = async (email) => {

  const result = await db.execute({
    sql: `
	SELECT * 
	FROM users 
	WHERE email = ?
    `,
    args: [email.toLowerCase()],
  });

  return result.rows[0];
};

export const createUser = async (full_name, email, contact, id, country, passwordHash) => {
  
  const result = await db.execute({
    sql: `
	  INSERT INTO users (
	      full_name, 
	      email, 
	      contact,
	      id,
	      country,
	      password_hash
	  ) 
	  VALUES (?, ?, ?, ?, ?, ?)
	  RETURNING *
    `,
    args: [
	    full_name, 
	    email.toLowerCase(), 
	    contact || null,
	    id,
	    country.toUpperCase(),
	    passwordHash
    ]
  });

  return result.rows[0]; // [newUser]
};




export const updateUserModel = async (user_id, { full_name, contact, id, country }) => {
  
  const sql = `
    UPDATE users
    SET full_name = ?, contact = ?, id = ?, country = ?
    WHERE user_id = ?
    RETURNING user_id, full_name, email, contact, country, id;
  `;

  const result = await db.execute({ sql, args: [full_name, contact, id, country, user_id] });
  
  return result.rows[0];
};
