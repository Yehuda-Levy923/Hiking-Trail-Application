-- ============================================
-- Seed Data for Hiking Trail Application
-- ============================================

-- Clear existing data
TRUNCATE trails, traffic_reports RESTART IDENTITY CASCADE;

-- ============================================
-- Insert Trails
-- ============================================
INSERT INTO trails (name, description, difficulty, length_km, elevation_gain_m, estimated_time_hours, location) VALUES
(
    'Mount Hermon Summit Trail',
    'Israel''s highest peak offering stunning views of the Golan Heights, Lebanon, and Syria. Best visited in spring when wildflowers bloom or winter for snow activities. The trail passes through alpine meadows and ancient volcanic formations.',
    'hard',
    12.5,
    850,
    6.0,
    'Golan Heights'
),
(
    'Ein Gedi Nature Reserve',
    'A desert oasis trail featuring waterfalls, natural pools, and diverse wildlife including ibex and hyrax. David''s Waterfall is the highlight, cascading into a refreshing pool surrounded by lush vegetation.',
    'moderate',
    6.0,
    320,
    3.5,
    'Dead Sea Region'
),
(
    'Carmel Forest Trail',
    'A beautiful Mediterranean forest hike through pine and oak woodlands. The trail offers panoramic views of Haifa Bay and passes by ancient Druze villages. Particularly beautiful in autumn.',
    'easy',
    8.0,
    180,
    3.0,
    'Mount Carmel'
),
(
    'Makhtesh Ramon Rim Trail',
    'Circumnavigate the world''s largest erosion crater with breathtaking desert landscapes. Watch for ibex, vultures, and unique geological formations. Best hiked during cooler months.',
    'hard',
    42.0,
    1200,
    16.0,
    'Negev Desert'
),
(
    'Banias Waterfall Trail',
    'An easy walk to one of Israel''s most powerful waterfalls at the source of the Jordan River. Rich in history with ancient Roman ruins and Crusader remains along the path.',
    'easy',
    3.5,
    80,
    1.5,
    'Golan Heights'
),
(
    'Masada Snake Path',
    'The historic eastern ascent to King Herod''s ancient fortress. A challenging climb rewarded with spectacular sunrise views over the Dead Sea. Rich in Jewish history and UNESCO World Heritage site.',
    'hard',
    6.0,
    450,
    3.0,
    'Dead Sea Region'
),
(
    'Nahal Yehudia',
    'A thrilling canyon trail with pools, waterfalls, and optional cliff jumps. The black basalt gorge offers a unique geological experience. Swimming required in several sections.',
    'moderate',
    7.5,
    280,
    4.0,
    'Golan Heights'
),
(
    'Israel National Trail - Jerusalem Section',
    'Part of the famous 1,100km trail crossing Israel. This section passes through Jerusalem Forest, Ein Karem village, and offers views of the Old City. A taste of the complete trail experience.',
    'moderate',
    15.0,
    420,
    6.0,
    'Jerusalem Hills'
);

-- ============================================
-- Insert Initial Traffic Reports
-- ============================================
INSERT INTO traffic_reports (trail_id, congestion_level, reporter_count, notes) VALUES
(1, 2, 5, 'Light crowds, good conditions'),
(2, 4, 12, 'Popular weekend destination, expect queues at waterfalls'),
(3, 2, 3, 'Quiet weekday hiking'),
(4, 1, 2, 'Remote trail, very few hikers'),
(5, 3, 8, 'Moderate traffic, parking filling up'),
(6, 5, 20, 'Very crowded - sunrise hike popular today'),
(7, 3, 6, 'Normal traffic for the season'),
(8, 2, 4, 'Light traffic on this section');
