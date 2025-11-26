CREATE TABLE Trails (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT
);

CREATE TABLE TrafficReports (
    id SERIAL PRIMARY KEY,
    trail_id INTEGER REFERENCES Trails(id),
    congestion_level INTEGER CHECK (congestion_level >= 1 AND congestion_level <= 5),
    timestamp TIMESTAMP DEFAULT NOW()
);
