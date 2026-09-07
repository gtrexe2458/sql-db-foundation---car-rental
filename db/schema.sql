
PRAGMA foreign_keys = ON;

-- Users & Role-Based Access Control
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    contact TEXT,
    country TEXT NOT NULL,
    id TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Vehicle Performance Specs (Separated to keep vehicles table clean)
CREATE TABLE IF NOT EXISTS vehicle_specs (
    spec_id INTEGER PRIMARY KEY AUTOINCREMENT,
    engine TEXT,
    horsepower INTEGER,
    accel_0_100_sec REAL,
    top_speed_kmh INTEGER,
    top_speed_mph INTEGER,
    daily_rent_eur REAL,
    description TEXT
);

-- Vehicle Fleet Management (Shortened table linked via spec_id)
CREATE TABLE IF NOT EXISTS vehicles (
    vehicle_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category_name TEXT NOT NULL,
    spec_id INTEGER,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    color TEXT NOT NULL,
    license_plate TEXT UNIQUE NOT NULL,
    status TEXT CHECK(status IN ('AVAILABLE', 'RENTED', 'MAINTENANCE')) DEFAULT 'AVAILABLE',
    daily_rate REAL,
    image_url TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (spec_id) REFERENCES vehicle_specs(spec_id) ON DELETE SET NULL
);

-- Rental Agreements
--------------------
-- this table helps later updates of payments decisions! (future update, beta version)
CREATE TABLE IF NOT EXISTS rental_agreements (
    agreement_id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    vehicle_id INTEGER NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    total_cost REAL NOT NULL,
    status TEXT CHECK(status IN ('PENDING', 'APPROVED', 'ACTIVE', 'COMPLETED', 'REJECTED')) DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(user_id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id)
);
