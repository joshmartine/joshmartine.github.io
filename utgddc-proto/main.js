$(() => {
  let asteroids = [];
  let bullets = [];

  update_asteroids = () => {
    if (asteroids.length < 2) {
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

  update_bullets = () => {
    bullets.forEach(bullet => {
      bullet.update(asteroids);
    });

    bullets
      .filter(bullet => !bullet.is_valid())
      .forEach(bullet => $(`#${bullet.id}`).remove());
  };

  window.setInterval(update_bullets, 20);

  $(document).on('click', event => {
    js_ship.fire();
  });

  var mouse = {};
  $(document).on('mousemove', event => {
    mouse.X = event.pageX;
    mouse.Y = event.pageY;
    js_ship.update();
  });

  $(document).on('scroll', event => {
    js_ship.update();
  });

  var ship = $('#moving_ship');

  var prev = { X: null, Y: null };

  class Ship {
    constructor() {
      this.svg = $('#moving_ship')[0].getBBox();
      this.rect = $('#moving_ship')[0].getBoundingClientRect();
      this.angle = 0;

      this.x = $(document).width() / 2 + this.svg.width / 2;
      this.y = $(document).height() / 2 + this.svg.height / 2;
    }

    fire() {
      let bullet = new Bullet(
        -Math.cos(this.angle),
        -Math.sin(this.angle),
        (this.rect.left + this.rect.right) / 2,
        (this.rect.top + this.rect.bottom) / 2
      );
      bullets.push(bullet);
    }

    update = () => {
      if (
        prev.Y != mouse.Y ||
        (prev.X != mouse.X && (prev.Y != null || prev.X != null))
      ) {
        var ship_pos = ship.position();
        var diff_x = ship_pos.left - mouse.X;
        var diff_y = ship_pos.top - mouse.Y;
        var tan = diff_y / diff_x;

        var atan = (Math.atan(tan) * 180) / Math.PI;
        atan += 90;
        if (diff_y > 0 && diff_x > 0) {
          atan += 180;
        } else if (diff_y < 0 && diff_x > 0) {
          atan -= 180;
        }

        this.angle = ((atan + 90) * Math.PI) / 180;

        prev.X = mouse.X;
        prev.Y = mouse.Y;

        $('#moving_ship').attr('transform', 'rotate(' + atan + ', 50, 50)');
        this.rect = $('#moving_ship')[0].getBoundingClientRect();
      }
    };
  }

  class Bullet {
    constructor(dir_x, dir_y, x, y) {
      this.r = 2;
      this.speed = 20;

      this.dir_x = dir_x;
      this.dir_y = dir_y;

      this.x = x;
      this.y = y;

      this.id = Date.now();

      var svgns = 'http://www.w3.org/2000/svg';
      var circle = document.createElementNS(svgns, 'circle');
      circle.setAttributeNS(null, 'cx', this.x);
      circle.setAttributeNS(null, 'cy', this.y);
      circle.setAttributeNS(null, 'id', this.id);
      circle.setAttributeNS(null, 'r', this.r);
      circle.setAttributeNS(
        null,
        'style',
        'fill: red; stroke: red; stroke-width: 1px;'
      );

      this.img = circle;

      $('#main').append(this.img);
    }

    update(asteroids) {
      this.x += this.dir_x * this.speed;
      this.y += this.dir_y * this.speed;
      this.img.setAttributeNS(null, 'cx', this.x);
      this.img.setAttributeNS(null, 'cy', this.y);

      asteroids.forEach(asteroid => {
        let x = asteroid.x - this.x;
        let y = asteroid.y - this.y;

        if (Math.sqrt(x * x + y * y) < asteroid.r) {
          asteroid.valid = false;
        }
      });
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

  class Asteroid {
    constructor() {
      this.r = 50;

      this.dir_x = 0.5 + Math.random() * 5;
      this.dir_y = (Math.random() * 2 - 1) * 5;
      this.x = 0;
      this.y = Math.random() * $(window).height() + $(document).scrollTop();

      this.valid = true;

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
      circle.setAttributeNS(null, 'r', this.r);
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
        this.y - this.r < $(window).height() + $(document).scrollTop() &&
        this.valid
      );
    }
  }

  let js_ship = new Ship();
});
