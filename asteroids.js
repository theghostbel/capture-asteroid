var earthPXSizeR = 50;
var fixedPlanets = {
  sun: { sizeR: 1392000, orbitR: 0, period: 0 },
  earth: { sizeR: 6378, orbitR: 1, period: 365 },
  moon: { sizeR: 1737, orbitR: 0.01613, period: 30 },
  phobos: { period: 7.39/24 * 10 },
  deimos: { period: 30/24 * 10 },
  mars: { sizeR: 3389, orbitR: 1.52, period: 686.2 }
};

var fossils = {
  H2O: { name: 'Water' },
  NH3: { name: 'Ammonia' },
  CH4: { name: 'Methane' },
  Ni: { name: 'Nickel' },
  Ir: { name: 'Iridium' }
};

var asteroids = [
  { radius: 0, color: 0 },
  { name: 'Vesta', orbitR: 3, period: 1680, radius: 30, color: 0xFF0000, mass: 1000, fossils: { H2O: 0.1, NH3: 0.2, CH4: 0.1, Ni: 0.01 } },
  { name: 'Vesta', orbitR: 2.9, period: 1600, radius: 30, color: 0xFF8800, mass: 1000, fossils: { H2O: 0.1, NH3: 0.2, CH4: 0.1, Ni: 0.01 } },
  { name: 'Pallad', period: 1680, radius: 20, color: 0xFFFF22 }
];
