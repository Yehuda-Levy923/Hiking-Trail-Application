-- ============================================
-- Hiking Trail Traffic Application
-- Database Schema
-- ============================================

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS traffic_reports CASCADE;
DROP TABLE IF EXISTS trails CASCADE;

-- ============================================
-- Trails Table
-- ============================================
CREATE TABLE trails (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'moderate', 'hard', 'expert')),
    length_km DECIMAL(5, 2),
    elevation_gain_m INTEGER,
    estimated_time_hours DECIMAL(4, 2),
    location VARCHAR(255),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Traffic Reports Table
-- ============================================
CREATE TABLE traffic_reports (
    id SERIAL PRIMARY KEY,
    trail_id INTEGER NOT NULL REFERENCES trails(id) ON DELETE CASCADE,
    congestion_level INTEGER CHECK (congestion_level >= 1 AND congestion_level <= 5),
    reporter_count INTEGER DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX idx_traffic_trail_id ON traffic_reports(trail_id);
CREATE INDEX idx_traffic_updated ON traffic_reports(updated_at DESC);
CREATE INDEX idx_trails_difficulty ON trails(difficulty);

-- ============================================
-- Function to auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_trails_updated_at
    BEFORE UPDATE ON trails
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_traffic_updated_at
    BEFORE UPDATE ON traffic_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
