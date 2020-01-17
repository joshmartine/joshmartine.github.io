const pages = ['section1', 'section2', 'section3'];
let completedPages = [];
let windowHeight = $(window).height();

let asteroids = [];

$(window).resize(function() {
  windowHeight = $(window).height();
});

$(document).scroll(function() {
  if (completedPages.length == 3) return;
  const distance = $(document).scrollTop();
  const page = Math.floor(distance / windowHeight);
  $('#' + pages[page]).css({ opacity: '1', 'padding-top': '4vh' });
  if (!completedPages.includes(pages[page])) {
    completedPages.push(pages[page]);
  }
});

update_asteroids = () => {
  if (asteroids.length < 5) {
    let asteroid = new Asteroid();
    asteroids.push(asteroid);
  }

  asteroids.forEach(asteroid => {
    asteroid.update();
  });

  asteroids
    .filter(asteroid => !asteroid.is_valid())
    .forEach(asteroid => $(`#${asteroid.id}`).remove());

  asteroids = asteroids.filter(asteroid => asteroid.is_valid());
};

window.setInterval(update_asteroids, 20);

class Asteroid {
  constructor() {
    this.r = 50;

    this.dir_x = 0.5 + Math.random() * 5;
    this.dir_y = (Math.random() * 2 - 1) * 5;
    this.x = 0;
    this.y = Math.random() * $(window).height() + $(document).scrollTop();

    if (Math.random() > 0.5) {
      this.x = $(window).width();
      this.dir_x = -this.dir_x;
    }

    this.id = Date.now();

    var svgns = 'http://www.w3.org/2000/svg';
    var circle = document.createElementNS(svgns, 'circle');
    circle.setAttributeNS(null, 'cx', this.x);
    circle.setAttributeNS(null, 'cy', this.y);
    circle.setAttributeNS(null, 'id', this.id);
    circle.setAttributeNS(null, 'r', 50);
    circle.setAttributeNS(
      null,
      'style',
      'fill: none; stroke: blue; stroke-width: 1px;'
    );

    this.img = circle;

    $('#main').append(this.img);
  }

  update() {
    this.x += this.dir_x;
    this.y += this.dir_y;
    this.img.setAttributeNS(null, 'cx', this.x);
    this.img.setAttributeNS(null, 'cy', this.y);
  }

  is_valid() {
    return (
      this.x + this.r > 0 &&
      this.x - this.r < $(window).width() &&
      this.y + this.r > 0 &&
      this.y - this.r < $(window).height() + $(document).scrollTop()
    );
  }
}
