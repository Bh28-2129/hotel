const { Room } = require('../models/Room');

const ROOM_PRICING_PER_NIGHT = {
  single: 2500,
  double: 3800,
  deluxe: 5200,
  suite: 8200,
};

function buildSeedRooms() {
  // 10 per type, matches IDs used in the frontend.
  const mk = (roomId, type, title, about, image) => ({
    roomId,
    type,
    title,
    about,
    image,
    pricePerNight: ROOM_PRICING_PER_NIGHT[type],
    isAvailable: true,
  });

  const single = [
    mk('S-101', 'single', 'Single Room', 'Cozy room for solo travelers with a comfortable bed, work desk, and fast Wi‑Fi.', 'assets/single.jpg'),
    mk('S-102', 'single', 'Single Room', 'Quiet corner room with soft lighting, minibar, and complimentary water.', 'assets/single.jpg'),
    mk('S-103', 'single', 'Single Room', 'Comfortable single room with fresh linens and a compact work area.', 'assets/single.jpg'),
    mk('S-104', 'single', 'Single Room', 'Single room with great lighting and a relaxing seating corner.', 'assets/single.jpg'),
    mk('S-105', 'single', 'Single Room', 'Peaceful stay with quick access to amenities and Wi‑Fi.', 'assets/single.jpg'),
    mk('S-106', 'single', 'Single Room', 'Well‑planned space with smart storage and clean design.', 'assets/single.jpg'),
    mk('S-107', 'single', 'Single Room', 'Perfect for business trips: desk, charging points, and calm vibes.', 'assets/single.jpg'),
    mk('S-108', 'single', 'Single Room', 'Soft lighting, cozy bed, and quiet ambience for deep rest.', 'assets/single.jpg'),
    mk('S-109', 'single', 'Single Room', 'Comfort-first room with housekeeping-ready cleanliness.', 'assets/single.jpg'),
    mk('S-110', 'single', 'Single Room', 'A neat single room with simple premium touches.', 'assets/single.jpg'),
  ];

  const double = [
    mk('D-201', 'double', 'Double Room', 'Ideal for two guests with a spacious bed, seating area, and ensuite bathroom.', 'assets/double.jpg'),
    mk('D-202', 'double', 'Double Room', 'Bright room with city view, extra storage, and premium toiletries.', 'assets/double.jpg'),
    mk('D-203', 'double', 'Double Room', 'Comfortable double room with extra space and a cozy sitting area.', 'assets/double.jpg'),
    mk('D-204', 'double', 'Double Room', 'Great for couples with soft bedding and a calm ambience.', 'assets/double.jpg'),
    mk('D-205', 'double', 'Double Room', 'Double room with practical storage and bright interiors.', 'assets/double.jpg'),
    mk('D-206', 'double', 'Double Room', 'Modern room with upgraded lighting and premium feel.', 'assets/double.jpg'),
    mk('D-207', 'double', 'Double Room', 'Relaxing stay with seating corner and smooth room service access.', 'assets/double.jpg'),
    mk('D-208', 'double', 'Double Room', 'Spacious comfort for two with great ventilation and cleanliness.', 'assets/double.jpg'),
    mk('D-209', 'double', 'Double Room', 'A bright double room suitable for short or long stays.', 'assets/double.jpg'),
    mk('D-210', 'double', 'Double Room', 'Premium double room experience with extra comfort.', 'assets/double.jpg'),
  ];

  const deluxe = [
    mk('DX-301', 'deluxe', 'Deluxe Room', 'Elevated comfort with upgraded interiors, larger space, and plush bedding.', 'assets/delux.jpg'),
    mk('DX-302', 'deluxe', 'Deluxe Room', 'Perfect for a premium stay with lounge chair, premium linens, and scenic view.', 'assets/delux.jpg'),
    mk('DX-303', 'deluxe', 'Deluxe Room', 'Extra-wide workspace, espresso setup, and enhanced sound insulation.', 'assets/delux.jpg'),
    mk('DX-304', 'deluxe', 'Deluxe Room', 'Premium deluxe room with upgraded seating and a relaxing layout.', 'assets/delux.jpg'),
    mk('DX-305', 'deluxe', 'Deluxe Room', 'A refined stay with enhanced comfort and premium linens.', 'assets/delux.jpg'),
    mk('DX-306', 'deluxe', 'Deluxe Room', 'Deluxe space with modern interiors and calm lighting.', 'assets/delux.jpg'),
    mk('DX-307', 'deluxe', 'Deluxe Room', 'Premium room with extra space and a cozy ambience.', 'assets/delux.jpg'),
    mk('DX-308', 'deluxe', 'Deluxe Room', 'Comfort-forward deluxe room with premium feel throughout.', 'assets/delux.jpg'),
    mk('DX-309', 'deluxe', 'Deluxe Room', 'A spacious deluxe room designed for restful stays.', 'assets/delux.jpg'),
    mk('DX-310', 'deluxe', 'Deluxe Room', 'Top-tier comfort with thoughtful layout and premium touches.', 'assets/delux.jpg'),
  ];

  const suite = [
    mk('SU-401', 'suite', 'Suite', 'Separate living area, premium bath amenities, and a calm luxury ambience.', 'assets/suite.jpg'),
    mk('SU-402', 'suite', 'Suite', 'Spacious suite with extra seating, upgraded entertainment, and late checkout.', 'assets/suite.jpg'),
    mk('SU-403', 'suite', 'Suite', 'Our best suite experience with privacy, comfort, and premium service support.', 'assets/suite.jpg'),
    mk('SU-404', 'suite', 'Suite', 'Suite with a comfortable lounge area and premium service experience.', 'assets/suite.jpg'),
    mk('SU-405', 'suite', 'Suite', 'Luxury suite for longer stays with extra space and comfort.', 'assets/suite.jpg'),
    mk('SU-406', 'suite', 'Suite', 'Premium suite with calm interiors and comfortable seating.', 'assets/suite.jpg'),
    mk('SU-407', 'suite', 'Suite', 'Spacious suite with upgraded ambience and premium touches.', 'assets/suite.jpg'),
    mk('SU-408', 'suite', 'Suite', 'Suite featuring a living space and a comfortable premium bed.', 'assets/suite.jpg'),
    mk('SU-409', 'suite', 'Suite', 'Refined suite with privacy and a luxury ambience.', 'assets/suite.jpg'),
    mk('SU-410', 'suite', 'Suite', 'Best-in-class suite with premium layout and comfort.', 'assets/suite.jpg'),
  ];

  return [...single, ...double, ...deluxe, ...suite];
}

async function seedRoomsIfMissing() {
  const count = await Room.countDocuments({});
  if (count > 0) return { seeded: false, count };
  const rooms = buildSeedRooms();
  await Room.insertMany(rooms);
  return { seeded: true, count: rooms.length };
}

module.exports = { seedRoomsIfMissing };
