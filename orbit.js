// This is where stuff in our game will happen:
var scene = new THREE.Scene();
var focusedItemXY = {x: 0, y: 0};
var followAsteroid = false;
var followAsteroidId = null;

var renderer = new THREE.WebGLRenderer();
// This is what sees the stuff:
var container = document.getElementById('container');
//var aspect_ratio = container.offsetWidth / container.offsetHeight;
var aspect_ratio = document.body.clientWidth / document.body.clientHeight;
var above_cam = new THREE.PerspectiveCamera(45, aspect_ratio, 1, 1e6);
above_cam.position.z = 1500;
scene.add(above_cam);

var earth_cam = new THREE.PerspectiveCamera(45, aspect_ratio, 1, 1e6);

var camera = above_cam;

// This will draw what the camera sees onto the screen:
//renderer.setSize(container.offsetWidth, container.offsetHeight);
renderer.setSize(document.body.clientWidth, document.body.clientHeight);
container.appendChild(renderer.domElement);

var order_panel = document.getElementById('panel-order');
order_panel.style.width=container.offsetWidth+"px";

// ******** START CODING ON THE NEXT LINE ********
document.body.style.backgroundColor = 'black';

var surface = new THREE.MeshPhongMaterial({ color: 0xFFD700 });
var star = new THREE.SphereGeometry(getPlanetSize(fixedPlanets.sun.sizeR / 400), 28, 21);
var sun = new THREE.Mesh(star, surface);
scene.add(sun);

var ambient = new THREE.AmbientLight(0xffffff);
scene.add(ambient);

var sunlight = new THREE.PointLight(0xffffff, 10, 1000);
sun.add(sunlight);

var asteroidsIds = [];
dataset.forEach(function (asteroid) {
  var surface = new THREE.MeshPhongMaterial({ color: asteroid.color || 0x222222 });
  var radius = getPlanetSize(asteroid.size * 5);
  var geo = new THREE.SphereGeometry(radius < 5 ? 5 : radius, 10, 10);
  var item = new THREE.Mesh(geo, surface);

  asteroidsIds.push(item.id);
  scene.add(item);
});

var surfaceMars = new THREE.MeshPhongMaterial({color: 0xFF1111});
var marsGeo = new THREE.SphereGeometry(getPlanetSize(fixedPlanets.mars.sizeR), 20, 15);
var mars = new THREE.Mesh(marsGeo, surfaceMars);
scene.add(mars);

var surfacePhobos = new THREE.MeshPhongMaterial({color: 0xffffff});
var phobos = new THREE.SphereGeometry(5, 30, 25);
var phobos = new THREE.Mesh(phobos, surfacePhobos);

var phobos_orbit = new THREE.Object3D();
phobos_orbit.add(phobos);
phobos.position.set(0, 50, 0);

var surfaceDeimos = new THREE.MeshPhongMaterial({color: 0xffffff});
var deimos = new THREE.SphereGeometry(8, 30, 25);
var deimos = new THREE.Mesh(deimos, surfaceDeimos);
var deimos_orbit = new THREE.Object3D();
deimos_orbit.add(deimos);
deimos.position.set(0, -50, 0);

mars.add(phobos_orbit);
mars.add(deimos_orbit);

var surface = new THREE.MeshPhongMaterial({color: 0x0000cd});
var planet = new THREE.SphereGeometry(earthPXSizeR, 20, 15);
var earth = new THREE.Mesh(planet, surface);
scene.add(earth);

var surface = new THREE.MeshPhongMaterial({ color: 0xDDDDDD });
var moon = new THREE.SphereGeometry(15, 30, 25);
var moon = new THREE.Mesh(moon, surface);

var moon_orbit = new THREE.Object3D();
earth.add(moon_orbit);
moon_orbit.add(moon);
moon.position.set(0, getPXfromAU(fixedPlanets.moon.orbitR * 30), 0);
earth_cam.rotation.set(Math.PI / 2, 0, 0);
moon_orbit.add(earth_cam);

var time = 0,
  speed = 1,
  direction = 1,
  pause = false;
var dayNo = document.getElementById('day');
var date = new Date();
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  if (pause) return;

  time = time + speed * direction;
  var dayIdx = parseInt(time/10);
  date.setTime(dayIdx * 1000 * 3600 * 24 + new Date().getTime());
  dayNo.innerText = dayIdx + ' / ' + date.toLocaleDateString('en-US');

  var earthOneDayAngle = time/10;
  var e_angle = time * 0.001;
  var earthOrbit = getPXfromAU(fixedPlanets.earth.orbitR);
  earth.position.set(
    earthOrbit * Math.cos(THREE.Math.degToRad(earthOneDayAngle)),
    earthOrbit * Math.sin(THREE.Math.degToRad(earthOneDayAngle)), 0);

  // var mars_angle = time * 0.001;
  var marsOrbit = getPXfromAU(fixedPlanets.mars.orbitR);
  var marsPeriodFactor = getPlanetOrbitDayAngleFactor(fixedPlanets.mars.period);
  mars.position.set(
    marsOrbit * Math.cos(THREE.Math.degToRad(earthOneDayAngle / marsPeriodFactor + 180)),
    marsOrbit * Math.sin(THREE.Math.degToRad(earthOneDayAngle / marsPeriodFactor + 180)), 0);

  var m_angle = time * 0.01;
  moon_orbit.rotation.set(0, 0, THREE.Math.degToRad(earthOneDayAngle / getPlanetOrbitDayAngleFactor(fixedPlanets.moon.period)));

  phobos_orbit.rotation.set(0, 0, THREE.Math.degToRad(earthOneDayAngle / getPlanetOrbitDayAngleFactor(fixedPlanets.phobos.period)));
  deimos_orbit.rotation.set(0, 0, THREE.Math.degToRad(earthOneDayAngle / getPlanetOrbitDayAngleFactor(fixedPlanets.deimos.period)));

  var asteroids_angel = time * 0.001;
  asteroidsIds.forEach(function(id, index){
    var asteroidOnOrbit = scene.getObjectById(id);
    var orbitR = getPXfromAU(dataset[index].distance);
    var asteroidRadius = asteroidOnOrbit.geometry.parameters.radius;
    // console.log(id, index, orbitR)
    var angle = earthOneDayAngle / getPlanetOrbitDayAngleFactor(dataset[index].period)
      + 365 / asteroidsIds.length * index;

    var x = orbitR * Math.cos(THREE.Math.degToRad(angle));
    var y = orbitR * Math.sin(THREE.Math.degToRad(angle));
    asteroidOnOrbit.position.set(x, y, 0);

    if (followAsteroid) {
      if (followAsteroidId === id) {
        above_cam.position.x = x;
        above_cam.position.y = y;
      }
    } else {
      above_cam.position.x = 0;
      above_cam.position.y = 0;
    }

    if (!asteroidBars[id]) {
      var sphereBarMaterial = new THREE.MeshBasicMaterial({color: 0x0000FF });
      var sphereBar = new THREE.SphereGeometry(asteroidRadius, 10, 10);
      var sphereBar = new THREE.Mesh(sphereBar, sphereBarMaterial);
      asteroidBars[id] = sphereBar;
      // scene.add(sphereBar)
    }
    // asteroidBars[id].position.set(x + 80, y, 0);
  });

}
var asteroidBars = {};
animate();

var stars = new THREE.Geometry();
while (stars.vertices.length < 1e4) {
  var lat = Math.PI * Math.random() - Math.PI / 2;
  var lon = 2 * Math.PI * Math.random();

  stars.vertices.push(new THREE.Vector3(
    1e5 * Math.cos(lon) * Math.cos(lat),
    1e5 * Math.sin(lon) * Math.cos(lat),
    1e5 * Math.sin(lat)
  ));
}
var star_stuff = new THREE.PointsMaterial({size: 200});
var star_system = new THREE.Points(stars, star_stuff);
scene.add(star_system);

document.addEventListener("keydown", function (event) {
  var code = event.which || event.keyCode;

  if (code == 67) changeCamera(); // C
  if (code == 32) {
    console.log('switch camera')
    followAsteroid = !followAsteroid;
  } // Space
  if (code == 80) pause = !pause; // P
  if (code == 192) direction *= -1; // ~ reverse
  if (code == 49) speed = 1; // 1
  if (code == 50) speed = 2; // 2
  if (code == 51) speed = 10; // 3
  if (code == 52) speed = 20; // 4
  if (code == 53) speed = 50; // 5
//        event.preventDefault();
});


document.addEventListener('mousewheel', function (event) {
  above_cam.position.z += event.wheelDelta;
});

document.addEventListener('click', function (event) {
  if (event.target.id !== 'cheap') return

  asteroids.forEach(function(asteroid, index) {
    var sceneObj = scene.getObjectById(asteroidsIds[index]);
    sceneObj.visible = asteroid.name === 'Vesta'
  })
});


document.addEventListener('click', function (event) {
  if (event.target.className !== 'draw-line') return;
  var material = new THREE.LineBasicMaterial({
    color: 0xFF00FF
  });
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(0, 0, 0));
  geometry.vertices.push(new THREE.Vector3(200, 200, 0));

  var line = new THREE.Line(geometry, material);
  scene.add(line);
});

function changeCamera() {
  if (camera == above_cam) camera = earth_cam;
  else camera = above_cam;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getPlanetSize(planetSizeR) {
  return parseInt(earthPXSizeR * planetSizeR / fixedPlanets.earth.sizeR, 10)
}

function getPlanetOrbitDayAngleFactor(period) {
  return period / fixedPlanets.earth.period
}

function getPXfromAU(au) {
  return parseInt(au * 150, 10);
}

$(function() {
  $('.factor-value').text( $('.factor').val() / 100 );
  $('.factor').on('change', function(){
    $('.factor-value').text( $('.factor').val() / 100 )
  })

  $('.scale-value').text( $('.scale').val() / 100 );
  $('.scale').on('change', function(){
    scale = $('.scale').val()
  });

  $('#container').click(function() {
      $('#panel-order').show();
  });
    
  // Purpose buttons click handler
  $('a.purpose-btn').click(function(){
    $('.title').html( $(this).html() ).addClass('open');

    var type = $(this).data('type');
    var factor = $('.factor').val() / 100;

    asteroidsIds.forEach(function(asteroidIdOnScene, index) {
      var sceneObj = scene.getObjectById(asteroidIdOnScene);
      sceneObj.visible = dataset[index][type] > factor
    })
    
    return false;
  });
});
