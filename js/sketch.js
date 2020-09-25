// https://editor.p5js.org/jn3008/sketches/0NVLg4ABL
// https://twitter.com/jn3008_
// https://jn3008.tumblr.com/

//switches
var smoothSwitch, randomSwitch, themeSwitch, restartSwitch,

  //strings and arrays
  typed = [],
  test0 = 'abcdefghijklmnopqrstuvwxyz',
  test = test0,
  score = [Array(5), Array(5)],
  scoreIdx = 0,
  egg = [],
  best = Infinity,
    bestBadge = '',

  //booleans
  won = false,
  lost = false,

  //progress and time
  reach = 0,
  time = 0,
  start, current,

  //colours
  fg = 0,
  bg = 0;
let green, red;

const marg = 20,
  spacing = 24;

function setup() {
  createCanvas(windowWidth, windowHeight);
  randomSwitch = new Switch(3);
  smoothSwitch = new Switch(2);
  restartSwitch = new Switch(1);
  themeSwitch = new Switch(0);
  smoothSwitch.toggle();
  restartSwitch.toggle();
  themeSwitch.toggle();

  green = color('#98D839');
  red = color('#F25438');
  rectMode(CENTER);
  ellipseMode(RADIUS);
  strokeCap(ROUND);
  noStroke();
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < score[j].length; i++) {
      score[j][i] = Infinity;
    }
  }
  textFont('Source Sans Pro');
}

function draw() {
  theme();
  background(bg);
  randomSwitch.display();
  smoothSwitch.display();
  restartSwitch.display();
  themeSwitch.display();
  translate(width * 0.5, height * 0.5);

  if (reach === 0) {
    start = floor(millis());
    if (!won) time = 0;
    current = 0;
  }

  let recCol;
  if (won)
    recCol = green;
  else if (lost) {
    if (restartSwitch.on) start = floor(millis());
    recCol = red;
    time = floor(millis()) - floor(start);
  } else {
    recCol = fg;
    time = floor(millis()) - floor(start);
  }

  fill(recCol);
  rect(0, 0, width, 100);

  if (smoothSwitch.on) {
    if (current !== reach) current += (reach - current) * 0.1;
  } else
    current = reach;

  if (reach === test.length)
    current = 0;

  textFormat(RIGHT, TOP, NORMAL, 30);
  fill(fg, 150);
  for (var i = 0; i < score[scoreIdx].length; i++) {
    if (isFinite(score[scoreIdx][i]))
      text(T(score[scoreIdx][i]), width * 0.5 - marg, marg - height * 0.5 + 30 * i); //top scores
    else
      text("-", width * 0.5 - marg, marg - height * 0.5 + 30 * i); //empty score
  }


  textFormat(LEFT, TOP, NORMAL, 30);
  fill(fg, 150);
  text(key, marg - width * 0.5, marg - height * 0.5); //recent key
  textAlign(RIGHT, BOTTOM);
  text(join(egg, ' ') + ' ' + bestBadge, width * 0.5 - marg, height * 0.5 - marg); //easter eggs

  fill(fg);
  textFormat(CENTER, TOP, BOLD, 50);
  text(T(time), 0, marg - height * 0.5); //time

  translate(-spacing * current, 0);

  for (let i = 0; i < test.length; i++) {
    let opacity = map(spacing * abs(i - current), 0, width * 0.5, 0, 1)
    opacity = 1 - 0.5 * pow(constrain(opacity, 0, 1), 2);
    opacity = 255 * constrain(opacity - (i < reach ? 0 : 0.3), 0, 1);

    fill(bg, opacity);
    textFormat(CENTER, BOTTOM, i < reach ? BOLD : NORMAL, 36);
    text(test.charAt(i), i * spacing, 0); //letters
    stroke(bg, opacity);

    let e;
    if (i === reach)
      e = 1 - reach + current;
    else if (i === reach - 1)
      e = reach - current;
    else
      e = 0;
    strokeWeight(3);
    line(i * spacing, 20, i * spacing, 20 + e * 10);
    noStroke();
  }
}

function keyPressed() {
  if (typed.length > 0 && !restartSwitch.on && lost && keyCode === BACKSPACE) {
    typed.pop(); //ability to delete when auto-restart is off
    reach--;
    lost = false;
  }
}

function keyTyped() {
  if (!lost || typed.length === 0) typed.push(key);
  var typedStr = join(typed, '');

  if (won) {
    reach = 0;
    start = floor(millis());
    time = 0;
    current = 0;
    won = false;
  }
  if (lost && restartSwitch.on)
    lost = false;

  if (!won) {
    if (typedStr.toUpperCase().charAt(reach) === test.toUpperCase().charAt(reach)) {
      reach++;
      if (reach == test.length) {
        won = true;
        reach = 0;
        typed.length = 0;
        scoreCheck();
        eggCheck();
        if (randomSwitch.on) testCheck();
      }
    } else if (typedStr.toUpperCase().charAt(reach) !== test.toUpperCase().charAt(reach)) {
      if (restartSwitch.on) {
        reach = 0;
        typed.length = 0;
        if (randomSwitch.on) testCheck();
      } else {
        if (!lost)
          if (reach !== test.length - 1) reach++;
          else typed.pop();
      }
      lost = true;
    }
  }
}

function mouseClicked() {
  if (randomSwitch.mouseOver()) {
    randomSwitch.toggle();
    testCheck();
  }
  if (smoothSwitch.mouseOver()) smoothSwitch.toggle();
  if (restartSwitch.mouseOver()) restartSwitch.toggle();
  if (themeSwitch.mouseOver()) themeSwitch.toggle();
}

function scoreCheck() {
  score[scoreIdx].push(time);
  score[scoreIdx].sort(function(a, b) {
    return a - b
  });
  score[scoreIdx].pop();
}

function T(t) {
  return floor(t * 0.001) + "." + floor(t % 1000 * 0.01) + floor(t % 100 * 0.1) + floor(t % 10);
}

function eggCheck() {
  let timeCeil = ceil(time * 0.001);
  if (timeCeil < best) best = timeCeil;
  
  if (best <= 1) bestBadge = '🤔';
  else if (best <= 2) bestBadge = '2️⃣';
  else if (best <= 3) bestBadge = '3️⃣';
  else if (best <= 4) bestBadge = '4️⃣';
  else if (best <= 5) bestBadge = '5️⃣';
  else if (best <= 6) bestBadge = '6️⃣';
  else if (best <= 7) bestBadge = '7️⃣';
  else if (best <= 8) bestBadge = '8️⃣';
  else if (best <= 9) bestBadge = '9️⃣';
  else if (best <= 10) bestBadge = '🔟';
  else if (best > 10) bestBadge = '🐌';
  
  if (match(String(time), '666') !== null) egg.push('😈');
  if (match(String(time), '420') !== null) egg.push('🍕');
  if (match(String(time), '100') !== null) egg.push('💯');
  if (match(String(time), '314') !== null) egg.push('🥧');
  if (match(String(time), '1337') !== null) egg.push('🔫');
  if (match(String(time), '3008') !== null) egg.push('🥥');
}

class Switch {
  constructor(idx) {
    this.idx = idx;
    this.on = false;
    this.r = 8;
    this.x = 0 + marg + this.r * 2;
    this.y = height - marg - this.r * (1 + 3.5 * idx);
    this.x_ = this.x - this.r;
    this.x__ = this.x_; //smooth
    
    this.pct=0;
  }
  mouseOver() {
    if (dist(mouseX, mouseY, this.x__, this.y) <= this.r)
      return true;
    return false;
  }
  toggle() {
    if (this.on) this.on = false;
    else this.on = true;
    this.move();
    if (this.idx === 1 || this.idx === 3) {
      testCheck();
      reach = 0;
      typed.length = 0;
      won = false;
      lost = false;
    }
  }
  move() {
    if (this.on)
      this.x_ = this.x + this.r;
    else
      this.x_ = this.x - this.r;
  }
  colour() {
    if (this.mouseOver()) this.col1 = color(bg, 100);
    else this.col1 = bg;
    if (this.on) this.col2 = lerpColor(green, red, this.pct);
    else this.col2 = lerpColor(red, green, this.pct);
    if (this.idx == 0) this.col2 = fg;
  }
  display() {
    this.x__ += (this.x_ - this.x__) * 0.03;
    this.pct = abs(this.x_-this.x__)*0.5/this.r;
    this.colour();
    fill(this.col2);
    let k = 1.25;
    rect(this.x, this.y, this.r * 2, this.r * 2 * k);
    circle(this.x - this.r, this.y, this.r * k);
    circle(this.x + this.r, this.y, this.r * k);
    
    
    fill(this.col1);
    circle(this.x__, this.y, this.r);
    if (this.idx === 0) this.tex = 'theme';
    if (this.idx === 1) this.tex = 'auto-restart';
    if (this.idx === 2) this.tex = 'smooth';
    if (this.idx === 3) this.tex = 'random';

    textFormat(LEFT, CENTER, BOLD, 20);
    fill(fg, themeSwitch.on ? 150 : 250);
    text(this.tex, this.x + this.r * 3, this.y);
  }
}

function theme() {
  if (themeSwitch.on) {
    bg = 20;
    fg = 200;
  } else {
    bg = 210;
    fg = 45;
  }
}

function testCheck() {
  if (randomSwitch.on) {
    var testlist = split(test0, '');
    testlist.sort(function(a, b) {
      return 0.5 - Math.random()
    });
    test = join(testlist, '');
    scoreIdx = 1;
  } else {
    test = test0;
    scoreIdx = 0;
  }
}

function textFormat(align1, align2, style, size) {
  textAlign(align1, align2);
  textStyle(style);
  textSize(size);
}