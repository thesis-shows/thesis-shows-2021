/////TO DO: (* means Sid will definitely need help w/ this)
//Implement Map View*
//Tweak mobile css so it looks good (fix issue where buttons stack on top of each other if the window gets too narrow)
//Make sure everyone is included in credits at the bottom
//Add a couple more fonts
//Pre-design MORE default combos of colors/fonts for ppl to see when they first open the page

const searchBar = document.getElementById('search-bar');
const schoolsList = document.getElementById('schools-list');
const sortBy = document.getElementById('sort-by');
const remixButton = document.getElementById('remix-button');
const remixModal = document.getElementById('remix-modal');
const primaryColor = document.getElementById('primary-color');
const secondaryColor = document.getElementById('secondary-color');
const randomRemix = document.getElementById('random-remix');
const fontSelect = document.getElementById('font-select');
const fontSize = document.getElementById('font-size');
const doneButton = document.getElementById('done');
const customizable = document.getElementsByClassName('customizable')
const customizableInverse = document.getElementsByClassName('customizable-inverse')
const colorSlider = document.getElementById('color-slider');

let currentColor;
let currentSort = 'a-z';
let currentData = data;
let myLatitude;
let myLongitude;

//using chroma.js scaling to give us 100 colors that are light and dark
let cubelight = chroma.cubehelix().rotations(-5).lightness([0.0, 1]).scale();
let cubelightcolors = cubelight.correctLightness().colors(100);
let cubedark = chroma.cubehelix().rotations(4).lightness([1, 0.0]).scale();
let cubedarkcolors = cubedark.correctLightness().colors(100);

let rainbowScale = chroma.scale(['red','orange','yellow','green','blue','purple']).correctLightness().colors(100);

const fontArray = [
  'neue-haas-grotesk-text,arial,sans-serif',
  'verdana,sans-serif',
  'monotalic,monospace',
  'ivypresto-headline,serif',
  'comic-sans,sans-serif',
  'century-gothic,sans-serif',
  'ibm-plex-serif,serif',
  'ode,sans-serif'
];

searchBar.addEventListener('keyup', (e) => {
  const searchString = e.target.value.toLowerCase();
  const schoolResults = data.filter((schoolObject) => {
    return schoolObject.school_name.toLowerCase().includes(searchString);
  });

  currentData = schoolResults

  displaySchools();
});

function displaySchools() {
  schoolsList.textContent = '';

  switch (currentSort) {
    case 'a-z':
        currentData = currentData.sort((a, b) => (a.school_name > b.school_name ? 1 : -1))
    break;
    case 'z-a':
      currentData = currentData.sort((a, b) => (a.school_name < b.school_name ? 1 : -1));
    break;
    case 'distance-close':
      currentData = currentData.sort((a, b) => (getDistance(a) > getDistance(b) ? 1 : -1));
    break;
    case 'distance-far':
      currentData = currentData.sort((a, b) => (getDistance(a) < getDistance(b) ? 1 : -1));
    break;
    case 'shortest':
      currentData = currentData.sort((a, b) => (a.school_name.length > b.school_name.length ? 1 : -1));
    break;
    case 'longest':
      currentData = currentData.sort((a, b) => (a.school_name.length < b.school_name.length ? 1 : -1));
    break;
  }

  currentData.forEach((school) => displaySchool(school));
}

function displaySchool(schoolObject) {
  var p = document.createElement('p');
  p.className = 'school-link';

  if (schoolObject['url']) {
    var a = document.createElement('a');
    a.href = schoolObject['url'];
    a.innerText = schoolObject.school_name;
    a.target = '_blank';
    p.appendChild(a);
  } else {
    p.innerText = schoolObject.school_name;
  }

  schoolsList.appendChild(p)
}

remixButton.addEventListener('click', (e) => {
  if (remixModal.style.display == 'block') {
    remixModal.style.display = 'none';
  } else {
    remixModal.style.display = 'block';
  }
});

doneButton.addEventListener('click', (e) => {
  remixModal.style.display = 'none';
});

randomRemix.addEventListener('click', (e) => {
  let coinFlip = Math.floor(Math.random() * 1);
  if (coinFlip === 0) {
    setColors(Math.floor(Math.random() * (101 - 65) + 65));
  } else {
    setColors(Math.floor(Math.random() * 35));
  }

  setFont(fontArray[Math.floor(Math.random() * fontArray.length)]);
});

function setFont(font) {
  document.documentElement.style.setProperty('--typeface', font);
  fontSelect.value = font
}

function setColors(colorNumber) {
  document.documentElement.style.setProperty('--primary-color', cubelightcolors[colorNumber]);
  document.documentElement.style.setProperty('--secondary-color', cubedarkcolors[colorNumber]);
  colorSlider.value = colorNumber;
  
}

sortBy.onchange = function() {
  if (this.value === 'distance-close' || this.value === 'distance-far') {
    let value = this.value
    navigator.geolocation.getCurrentPosition(function(position) {
      myLatitude = position.coords.latitude;
      myLongitude = position.coords.longitude;
      currentSort = value;
      displaySchools();
    });
  } else {
    currentSort = this.value;
    displaySchools();
  }
}

colorSlider.oninput = function() {
setColors(this.value)
}

// primaryColor.oninput = function() {
//   document.documentElement.style.setProperty('--primary-color', this.value);
// };

// secondaryColor.oninput = function() {
//   document.documentElement.style.setProperty('--secondary-color', this.value);
// };

fontSize.oninput = function() {
  document.documentElement.style.setProperty('--type-size-large', `${2 * this.value}em`);
  document.documentElement.style.setProperty('--type-size', `${this.value}em`);
  document.documentElement.style.setProperty('--line-height', `${1.2 * this.value}em`);
};

fontSelect.onchange = function() {
  console.log(this.value);
  setFont(this.value)
};

function showRandomDefault() {
  

  let defaultArray = [
    {color: 76, font: fontArray[3]},
    {color: 5, font: fontArray[0]},
    {color: 68, font: fontArray[1]},
    {color: 88, font: fontArray[0]},
    {color: 25, font: fontArray[1]},
    {color: 93, font: fontArray[3]},
    {color: 21, font: fontArray[2]},
    {color: 15, font: fontArray[6]}
  ]

  let randomItem = Math.floor(Math.random() * defaultArray.length)
  currentColor = defaultArray[randomItem].color
  setColors(currentColor)
  setFont(defaultArray[randomItem].font)
  displaySchools();
}

showRandomDefault();

function getDistance(schoolObject) {
  let schoolLatitude = schoolObject.coords.split(', ')[0];
  let schoolLongitude = schoolObject.coords.split(', ')[1] * -1;
  let schoolCoords = [schoolLatitude, schoolLongitude];
  let distance = haversineDistance([myLatitude, myLongitude], schoolCoords);
  return distance;
}

const haversineDistance = ([lat1, lon1], [lat2, lon2], isMiles = false) => {
  const toRadian = angle => (Math.PI / 180) * angle;
  const distance = (a, b) => (Math.PI / 180) * (a - b);
  const RADIUS_OF_EARTH_IN_KM = 6371;

  const dLat = distance(lat2, lat1);
  const dLon = distance(lon2, lon1);

  lat1 = toRadian(lat1);
  lat2 = toRadian(lat2);

  // Haversine Formula
  const a =
    Math.pow(Math.sin(dLat / 2), 2) +
    Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.asin(Math.sqrt(a));

  let finalDistance = RADIUS_OF_EARTH_IN_KM * c;

  if (isMiles) {
    finalDistance /= 1.60934;
  }

  return finalDistance;
};
