-- ============================================
-- Seed Data for Hiking Trail Application
-- ============================================

-- Clear existing data
TRUNCATE users, trails, traffic_reports RESTART IDENTITY CASCADE;

-- ============================================
-- Insert Test Users
-- Password for all test users is: password123
-- Hash generated with bcrypt (10 salt rounds)
-- ============================================
INSERT INTO users (email, password_hash, name) VALUES
('yehuda.levy@example.com', '$2b$10$rQZ8K5YJhKVzH5YLwLvUxeqK8K5YJhKVzH5YLwLvUxeqK8K5YJhK', 'Yehuda Levy'),
('haggai.slater@example.com', '$2b$10$rQZ8K5YJhKVzH5YLwLvUxeqK8K5YJhKVzH5YLwLvUxeqK8K5YJhK', 'Haggai Slater'),
('michael.aharoni@example.com', '$2b$10$rQZ8K5YJhKVzH5YLwLvUxeqK8K5YJhKVzH5YLwLvUxeqK8K5YJhK', 'Michael Aharoni'),
('maor.atari@example.com', '$2b$10$rQZ8K5YJhKVzH5YLwLvUxeqK8K5YJhKVzH5YLwLvUxeqK8K5YJhK', 'Maor Atari');

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
),
(
    'Red Canyon Trail',
    'A spectacular desert hike through narrow red sandstone corridors. The vibrant rock formations create a natural cathedral of color. Popular for photography and requires some scrambling.',
    'moderate',
    4.5,
    120,
    2.5,
    'Eilat Mountains'
),
(
    'Mount Arbel Cliff Trail',
    'Dramatic cliff-side path with panoramic views of the Sea of Galilee, Golan Heights, and Mount Hermon. Features iron rungs and ladders for steep sections. Ancient cave dwellings visible along route.',
    'hard',
    5.5,
    380,
    3.5,
    'Lower Galilee'
),
(
    'Nachal Amud',
    'A scenic stream trail connecting Safed to the Sea of Galilee. Passes through oak forests, natural pools, and historical sites. Ideal for summer hiking with multiple swimming spots.',
    'easy',
    9.0,
    200,
    4.0,
    'Upper Galilee'
),
(
    'Timna Park Mushroom Trail',
    'Desert trail featuring unique mushroom-shaped rock formations carved by millennia of erosion. Ancient copper mines and Solomon''s Pillars nearby. Best visited in early morning or late afternoon.',
    'easy',
    2.5,
    50,
    1.0,
    'Eilat Region'
),
(
    'Mount Meron Summit',
    'Israel''s second-highest mountain with lush Mediterranean vegetation. The summit offers 360-degree views of Galilee. Sacred to Jewish tradition, especially during Lag BaOmer celebrations.',
    'moderate',
    8.5,
    520,
    4.5,
    'Upper Galilee'
),
(
    'Nahal Ayun Waterfalls',
    'Four stunning waterfalls cascading down from the Lebanese border. The Tanur Waterfall plunges 30 meters into a natural amphitheater. Wheelchair-accessible portions available.',
    'easy',
    4.0,
    90,
    2.0,
    'Upper Galilee'
),
(
    'Gamla Nature Reserve',
    'Combines ancient Jewish history with dramatic cliff views and nesting griffon vultures. The steep trail descends to a majestic waterfall. Archaeological site of ancient Gamla visible.',
    'hard',
    6.5,
    450,
    4.0,
    'Golan Heights'
),
(
    'Ein Avdat Canyon',
    'A narrow desert canyon with spring-fed pools and white chalk cliffs. Ibex commonly spotted. The trail includes ladders and scrambling through stunning geological formations.',
    'moderate',
    5.0,
    200,
    2.5,
    'Negev Desert'
),
(
    'Snir Stream Trail',
    'Shaded riverside walk through lush vegetation along cold, clear water. One of Israel''s most pristine streams, ideal for hot summer days. Rich in flora and fauna.',
    'easy',
    3.0,
    40,
    1.5,
    'Upper Galilee'
),
(
    'Mount Tabor Summit Loop',
    'Historic mountain where tradition places the Transfiguration of Jesus. Ancient ruins and churches at summit. Circular trail through Mediterranean forest with panoramic Jezreel Valley views.',
    'moderate',
    7.0,
    340,
    3.5,
    'Lower Galilee'
),
(
    'Nahal Dishon',
    'Remote Upper Galilee stream trail with cascading waterfalls and deep pools. Excellent for adventurous hikers seeking solitude. Some route-finding skills required.',
    'hard',
    10.0,
    480,
    5.5,
    'Upper Galilee'
),
(
    'Beit Guvrin Caves',
    'Ancient bell-shaped caves carved into soft chalk. Explore underground chambers used throughout history. Easy walking with fascinating archaeological features.',
    'easy',
    4.5,
    60,
    2.0,
    'Judean Lowlands'
),
(
    'Yehi''am Fortress Trail',
    'Medieval Crusader fortress surrounded by natural forest. Trail includes historical ruins, spring water sources, and scenic overlooks. Family-friendly with picnic areas.',
    'easy',
    5.5,
    140,
    2.5,
    'Western Galilee'
),
(
    'Nahal Kziv',
    'Year-round flowing stream through Western Galilee mountains. The trail passes Montfort Crusader castle ruins and numerous natural pools perfect for swimming.',
    'moderate',
    11.0,
    380,
    5.0,
    'Western Galilee'
),
(
    'Mount Sodom Salt Trail',
    'Unique geological trail through salt formations and caves. Lot''s Wife salt pillar viewpoint included. Surreal lunar landscape along Dead Sea shore.',
    'moderate',
    6.0,
    280,
    3.0,
    'Dead Sea Region'
),
(
    'Keshet Cave Arch',
    'Natural limestone arch spanning 30 meters, one of Israel''s most impressive geological formations. Short hike with dramatic views. Popular for sunset photography.',
    'easy',
    2.0,
    80,
    1.0,
    'Upper Galilee'
),
(
    'Sataf Terraces Trail',
    'Ancient agricultural terraces with fruit trees and spring water. Historical farming methods still visible. Pleasant year-round walk through cultivated Mediterranean landscape.',
    'easy',
    4.0,
    110,
    2.0,
    'Jerusalem Hills'
),
(
    'Nahal Keziv Canyon',
    'Deep, narrow canyon requiring rappelling and water navigation. Technical trail for experienced adventurers. Stunning white limestone walls and emerald pools.',
    'expert',
    8.0,
    520,
    6.0,
    'Western Galilee'
),
(
    'Mount Gilboa Ridge Trail',
    'Biblical mountain famous for wildflower blooms in spring. Panoramic views of Jezreel Valley and Jordan Valley. Historical significance from biblical King Saul narrative.',
    'moderate',
    9.5,
    310,
    4.0,
    'Gilboa Mountains'
),
(
    'Dan Nature Reserve',
    'Lush northern trail along Dan River, one of Jordan River sources. Ancient Tel Dan archaeological site included. Easy walking through shaded canopy.',
    'easy',
    5.0,
    50,
    2.0,
    'Upper Galilee'
),
(
    'Nahal Bokek Canyon',
    'Desert canyon near Dead Sea with dramatic rock formations and seasonal waterfalls. Dry canyon hiking with spectacular geology. Accessible from Dead Sea hotels.',
    'moderate',
    7.0,
    310,
    3.5,
    'Dead Sea Region'
),
(
    'Rosh Hanikra Grottoes',
    'Coastal grottos carved by Mediterranean waves into white chalk cliffs. Cable car access with underground tunnels and sea caves. Stunning blue water views.',
    'easy',
    1.5,
    30,
    1.0,
    'Northern Coast'
),
(
    'Amram Pillars',
    'Surreal desert landscape with towering red and white sandstone pillars. Best visited at sunrise or sunset for dramatic lighting. Easy desert walk.',
    'easy',
    3.0,
    70,
    1.5,
    'Eilat Region'
),
(
    'Nahal Darga Canyon',
    'Remote Dead Sea canyon combining desert hiking with biblical history. David''s Cave and Monastery of St. George visible. Requires early start for heat.',
    'hard',
    14.0,
    650,
    7.0,
    'Judean Desert'
),
(
    'Mount Precipice',
    'Dramatic cliff overlooking Nazareth and Jezreel Valley. Religious significance from Gospel narratives. Short but steep climb with rewarding views.',
    'moderate',
    3.5,
    220,
    2.0,
    'Lower Galilee'
),
(
    'Nahal Arugot',
    'Ein Gedi''s southern canyon with year-round water flow and multiple waterfalls. The Hidden Waterfall is a spectacular 30-meter cascade. Ibex frequently spotted.',
    'moderate',
    8.0,
    410,
    4.5,
    'Dead Sea Region'
),
(
    'Horshat Tal Forest',
    'Ancient oak and eucalyptus forest surrounding cool water pools. Easy family trail with picnic areas and wading pools. Great for summer heat escape.',
    'easy',
    3.5,
    20,
    1.5,
    'Upper Galilee'
),
(
    'Flour Cave Trail',
    'Soft white chalk canyon creating flour-like powder underfoot. Narrow passages and unique geological formations. Moderate scrambling required.',
    'moderate',
    4.5,
    180,
    2.5,
    'Negev Desert'
),
(
    'Nahal Taninim',
    'Coastal stream with historical flour mill ruins and lush riparian vegetation. Easy walking along flowing water. Rich in historical and natural features.',
    'easy',
    6.0,
    40,
    2.5,
    'Carmel Coast'
),
(
    'Golan Volcanic Plateau',
    'Unique trail across black basalt volcanic landscape. Ancient volcanic cones and lava flows visible. Wide open spaces with distant mountain views.',
    'moderate',
    12.0,
    280,
    5.0,
    'Golan Heights'
),
(
    'Nahal Zavitan',
    'Spectacular hexagonal basalt column formations creating natural pools. The hexagon pool is Instagram-famous. Requires scrambling and sure footing.',
    'hard',
    6.5,
    380,
    4.0,
    'Golan Heights'
),
(
    'Ein Prat Spring',
    'Desert oasis spring with swimming holes and monastery ruins. The trail follows Prat Stream through dramatic canyon. Popular for summer canyon hikes.',
    'moderate',
    9.0,
    340,
    4.5,
    'Judean Desert'
),
(
    'Mount Bental Lookout Trail',
    'Former military position with panoramic views into Syria. Short trail with bunkers and memorial. Clear views of Mount Hermon and Damascus plain.',
    'easy',
    2.5,
    60,
    1.0,
    'Golan Heights'
),
(
    'Achziv National Park Trail',
    'Coastal trail combining sea grottos, ancient ruins, and Mediterranean vegetation. Natural tidal pools for swimming. Easy beach and cliff walking.',
    'easy',
    4.0,
    50,
    2.0,
    'Northern Coast'
);

-- ============================================
-- Insert Traffic Reports for All Trails
-- ============================================
INSERT INTO traffic_reports (trail_id, congestion_level, reporter_count, notes) VALUES
(1, 2, 5, 'Light crowds, good conditions'),
(2, 4, 12, 'Popular weekend destination, expect queues at waterfalls'),
(3, 2, 3, 'Quiet weekday hiking'),
(4, 1, 2, 'Remote trail, very few hikers'),
(5, 3, 8, 'Moderate traffic, parking filling up'),
(6, 5, 20, 'Very crowded - sunrise hike popular today'),
(7, 3, 6, 'Normal traffic for the season'),
(8, 2, 4, 'Light traffic on this section'),
(9, 3, 7, 'Popular photography spot, moderate crowds'),
(10, 4, 10, 'Busy on weekends, arrive early for parking'),
(11, 2, 3, 'Peaceful stream hike, few people'),
(12, 2, 5, 'Light traffic, good for families'),
(13, 3, 8, 'Moderate crowds on trail, summit busy'),
(14, 2, 4, 'Accessible trail, steady flow of visitors'),
(15, 4, 11, 'Popular for vulture watching, crowded viewpoints'),
(16, 3, 6, 'Moderate traffic, pools can get busy'),
(17, 1, 2, 'Very quiet, pristine conditions'),
(18, 3, 7, 'Religious site brings steady visitors'),
(19, 1, 3, 'Remote location, very few hikers'),
(20, 2, 5, 'Popular with school groups midweek'),
(21, 2, 4, 'Family-friendly, light to moderate traffic'),
(22, 3, 6, 'Montfort castle attracts visitors, moderate crowds'),
(23, 2, 3, 'Unique geology attracts photographers'),
(24, 4, 9, 'Very popular, small parking lot fills quickly'),
(25, 2, 4, 'Pleasant local trail, light traffic'),
(26, 1, 2, 'Technical trail, experienced hikers only, very quiet'),
(27, 3, 8, 'Spring wildflower season brings crowds'),
(28, 3, 7, 'Archaeological site popular, steady traffic'),
(29, 2, 4, 'Desert location keeps crowds low'),
(30, 5, 15, 'Tourist attraction, very busy, long cable car queues'),
(31, 3, 5, 'Beautiful desert scenery, moderate interest'),
(32, 1, 2, 'Challenging remote hike, very few attempt'),
(33, 3, 6, 'Religious tourism, moderate steady traffic'),
(34, 4, 10, 'Popular Ein Gedi alternative, busy weekends'),
(35, 2, 6, 'Family destination, moderate traffic'),
(36, 2, 3, 'Off-beaten path, quiet exploration'),
(37, 2, 5, 'Historical site attracts steady visitors'),
(38, 2, 4, 'Volcanic landscape draws geology enthusiasts'),
(39, 5, 18, 'Instagram hotspot, expect crowds at hexagon pool'),
(40, 3, 7, 'Popular summer destination, pools busy'),
(41, 2, 3, 'Quick viewpoint, light traffic'),
(42, 3, 6, 'Coastal location, popular in summer');
