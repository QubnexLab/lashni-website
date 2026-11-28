/*
 * LASHNI product catalogue - the single source of truth.
 *
 * To add a suit, append one object with a unique `code` and its details.
 * `addedAt` is optional (YYYY-MM-DD); omit it to use today's date.
 * The newest products always render first in New Arrivals and drive the hero.
 *
 * Availability is edited manually. Only "Sold Out" disables Enquire Now;
 * other values are shown as-is without inventing stock claims.
 */
var products = [
  {
    code: 'LSH-MV05',
    name: 'Royal Maroon Velvet Suit Set',
    image: 'assets/maroon-velvet.jpeg',
    width: 1040,
    height: 1373,
    alt: 'Royal maroon velvet embroidered suit set',
    price: 'Price on DM',
    sub: 'Rich maroon velvet suit set with detailed multicolour embroidery and matching dupatta. Perfect for festive occasions and functions.',
    post: 'https://www.instagram.com/p/DgPtv4HSWiy/',
    availability: 'Check Availability',
    addedAt: '2026-11-27',
    message: "Hi LASHNI, I'm interested in Royal Maroon Velvet Suit Set - Code LSH-MV05. Please confirm current price and availability."
  },
  {
    code: 'LSH-RC01',
    name: 'Rangoli Crush Suit Set',
    image: 'assets/rangoli.jpeg',
    width: 1200,
    height: 1600,
    alt: 'Rust red Rangoli Crush embroidered unstitched suit set',
    price: '₹999',
    sub: 'Complete unstitched suit set. Kurta fabric, bottom and dupatta included.',
    post: 'https://www.instagram.com/p/DgH2I9aS4P7/',
    availability: 'Check Availability',
    addedAt: '2026-11-24',
    message: "Hi LASHNI, I'm interested in Rangoli Crush Suit Set - Code LSH-RC01. Please confirm current price and availability."
  },
  {
    code: 'LSH-FL02',
    name: 'Floral Embroidered Suit Set',
    image: 'assets/mustard.jpeg',
    width: 853,
    height: 1280,
    alt: 'Mustard floral embroidered unstitched suit with contrast dupatta',
    price: '₹999',
    sub: 'Complete unstitched suit set with embroidery and matching bottom and dupatta.',
    post: 'https://www.instagram.com/p/DgH2k-9yfHM/',
    availability: 'Check Availability',
    addedAt: '2026-11-22',
    message: "Hi LASHNI, I'm interested in Floral Embroidered Suit Set - Code LSH-FL02. Please confirm current price and availability."
  },
  {
    code: 'LSH-OL04',
    name: 'Olive Elegance Suit Set',
    image: 'assets/olive.jpeg',
    width: 1200,
    height: 1600,
    alt: 'Olive green embroidered unstitched suit set',
    price: 'Price on DM',
    sub: 'Elegant floral embroidery with contrast dupatta. Ask for current price and colour options.',
    post: 'https://www.instagram.com/p/DgMryIAS7rc/',
    availability: 'Check Availability',
    addedAt: '2026-11-20',
    message: "Hi LASHNI, I'm interested in Olive Elegance Suit Set - Code LSH-OL04. Please confirm current price and availability."
  },
  {
    code: 'LSH-PK03',
    name: 'Pretty Pink Floral Suit',
    image: 'assets/pink.jpeg',
    width: 1200,
    height: 1600,
    alt: 'Pink floral embroidered unstitched suit set',
    price: 'Price on DM',
    sub: 'Floral neckline embroidery with coordinated dupatta. Message us for current price and availability.',
    post: 'https://www.instagram.com/p/DgKgKi0yguT/',
    availability: 'Check Availability',
    addedAt: '2026-11-18',
    message: "Hi LASHNI, I'm interested in Pretty Pink Floral Suit - Code LSH-PK03. Please confirm current price and availability."
  }
];
