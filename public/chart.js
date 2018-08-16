// Generated by CoffeeScript 2.3.1
(function() {
  //### templates
  var BeamWeaponData, CRIT, CircleHitBox, Enemy, HIT, HitBox, MISS, PhotonProjectorWeaponData, RectHitBox, WeaponData, areascale, basicCursorHeight, chart, chart_padding_left, chart_padding_right, chart_width, crosshair, enemy, enemy_Roadhog, formatNumber, hero_filter, hero_rows, hero_selection_template, hero_weapon_template, htmlToElement, info_string, max_time, multiplier, radians, row_template, state_data, timeAxis, timeScale, timescale;

  htmlToElement = function(html) {
    var template;
    template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
  };

  Handlebars.registerHelper('ceilRound', function(number) {
    return 2 * Math.ceil(number / 2);
  });

  Handlebars.registerPartial('heroWeapon', d3.select('#hero-weapon-template').html());

  hero_weapon_template = Handlebars.compile("{{> heroWeapon}}");

  row_template = Handlebars.compile(d3.select('#row-template').html());

  hero_selection_template = Handlebars.compile(d3.select('#hero-selection-template').html());

  //### timescales constants
  timescale = 1000 / 20; // px/sec

  max_time = 17.5; // sec

  chart_padding_left = 30; // px

  chart_padding_right = 30; // px

  chart_width = max_time * timescale + chart_padding_left + chart_padding_right;

  timeScale = d3.scaleLinear().domain([0, max_time]).range([chart_padding_left, chart_width]);

  timescale = (function() {
    var domain, range;
    range = timeScale.range();
    domain = timeScale.domain();
    return (range[1] - range[0]) / (domain[1] - domain[0]);
  })();

  timeAxis = d3.axisTop(timeScale).ticks(20);

  d3.select("svg.timeScale").style('width', chart_width).attr('viewBox', `0 -30 ${chart_width} 30`).append("g").call(timeAxis);

  areascale = 2; // px^2 / hp

  radians = Math.PI / 180;

  formatNumber = function(num, d = 1) {
    if (Math.abs(Math.round(num) - num) < 0.01) {
      return d3.format('d')(num);
    } else {
      return d3.format(`.${d}f`)(num);
    }
  };

  //### Enemy shooting

  //constants
  CRIT = 2;

  HIT = 1;

  MISS = 0;

  basicCursorHeight = 1; //m

  
  //global
  multiplier = 1;

  crosshair = {
    x: 0,
    z: 1.0,
    distance: 5.0
  };

  HitBox = class HitBox {
    registerHit() {
      return false;
    }

    appendElement(g) {
      return g;
    }

  };

  RectHitBox = class RectHitBox extends HitBox {
    constructor(cx, cz, width, height) {
      super();
      this.x1 = cx - width / 2;
      this.x2 = cx + width / 2;
      this.z1 = cz - height / 2;
      this.z2 = cz + height / 2;
    }

    registerHit(p) {
      return this.x1 <= p.x && p.x <= this.x2 && this.z1 <= p.z && p.z <= this.z2;
    }

    appendElement(g) {
      return g.append('rect').attrs({
        x: this.x1,
        y: basicCursorHeight - this.z2,
        width: this.x2 - this.x1,
        height: this.z2 - this.z1
      });
    }

  };

  CircleHitBox = class CircleHitBox extends HitBox {
    constructor(x1, z1, radius1) {
      super();
      this.x = x1;
      this.z = z1;
      this.radius = radius1;
      this.radius_squared = this.radius * this.radius;
    }

    registerHit(p) {
      var dx, dz;
      dx = p.x - this.x;
      dz = p.z - this.z;
      return dx * dx + dz * dz <= this.radius_squared;
    }

    appendElement(g) {
      return g.append('circle').attrs({
        cx: this.x,
        cy: basicCursorHeight - this.z,
        r: this.radius
      });
    }

  };

  Enemy = class Enemy {
    constructor(image, body, head) {
      this.image = image;
      this.body = body;
      this.head = head;
    }

    registerHit(point) {
      switch (false) {
        case !this.head.registerHit(point):
          return CRIT;
        case !this.body.registerHit(point):
          return HIT;
        default:
          return MISS;
      }
    }

    shoot(crosshair, radius = 0, shift_x = 0) {
      var cx, cy, x, z;
      cx = cy = 0;
      if (radius > 0) {
        cx = cy = 1;
        while (!(cx * cx + cy * cy < 1.0)) {
          cx = 2 * Math.random() - 1;
          cy = 2 * Math.random() - 1;
        }
        cx *= radius;
        cy *= radius;
      }
      x = crosshair.x + cx + shift_x;
      z = crosshair.z + cy;
      return this.registerHit({
        x: x,
        z: z
      });
    }

  };

  enemy_Roadhog = (function() {
    var body_height, body_width, head_height, head_width;
    body_width = 1.4;
    body_height = 2.1;
    head_height = 2.0;
    head_width = 0.6;
    return new Enemy({
      url: "images/roadhog_figure.png",
      dims: {
        width: 858,
        height: 873
      },
      x: 1.55,
      y: 1.6,
      height: 3.3
    }, new RectHitBox(0, body_height / 2, body_width, body_height), new CircleHitBox(0, head_height, head_width / 2));
  })();

  
  // ht = 2.21
  // basicRectangle = new RectHitBox(0,ht/2,2,ht)
  enemy = enemy_Roadhog;

  WeaponData = (function() {
    var draw_time, total_time;

    class WeaponData {
      constructor(weapon1) {
        var ref, shot_spacing;
        this.weapon = weapon1;
        shot_spacing = timescale * (((ref = this.weapon.burst) != null ? ref.delay : void 0) || this.weapon.shot_time);
        this.filling = this.weapon.filling || 0.5;
        this.is_beam = this.weapon.type === "beam";
        this.color = this.weapon.hero.color;
        if (!this.is_beam) {
          this.max_shot_width = shot_spacing * this.filling;
          this.max_square_dmg = this.max_shot_width * this.max_shot_width / areascale;
        }
      }

      refresh_distance(enemy, crosshair) {
        this.set_distance(crosshair.distance);
        this.init_shots();
        this.simulate_shot_outcomes(enemy, crosshair);
        return this.calculate_shots_damage();
      }

      refresh_crosshair(enemy, crosshair) {
        this.simulate_shot_outcomes(enemy, crosshair);
        return this.calculate_shots_damage();
      }

      set_distance(distance) {
        this.distance = distance;
        this.pellets = this.weapon.pellets_func != null ? this.weapon.pellets_func(distance) : this.weapon.pellets;
        this.basic_dmg = this.weapon.basic_damage_func(distance);
        this.radius_func = this.weapon.make_radius_func(distance);
        this.time_delay = this.weapon.time_delay_func(distance);
        return this.shift_func = this.weapon.make_shift_func(distance);
      }

      init_shots() {
        var ammo, ammo_consumed, dt, results, shot, t, total_dmg;
        t = 0;
        this.shots = [];
        ammo = this.weapon.ammo;
        total_dmg = 0;
        results = [];
        while (t < total_time) {
          shot = {
            radius: this.radius_func(ammo, t)
          };
          [ammo, dt, ammo_consumed] = this.weapon.shot_time_func(ammo, t);
          if (t < draw_time) {
            shot.t = t + this.time_delay;
            shot.wdata = this;
            if (ammo_consumed > 1) {
              shot.ammo_mult = ammo_consumed;
            }
            if (this.weapon.type === "beam") {
              shot.duration = this.weapon.shot_time * ammo_consumed;
            }
            this.shots.push(shot);
          }
          results.push(t += dt);
        }
        return results;
      }

      simulate_shot_outcomes(enemy, crosshair) {
        var hit_outcome, i, j, k, len, o, outcomes, ref, ref1, shift_x, shot, total, total_outcomes;
        total_outcomes = [0, 0, 0];
        ref = this.shots;
        for (j = 0, len = ref.length; j < len; j++) {
          shot = ref[j];
          outcomes = [0, 0, 0];
          for (i = k = 1, ref1 = this.pellets; (1 <= ref1 ? k <= ref1 : k >= ref1); i = 1 <= ref1 ? ++k : --k) {
            shift_x = this.shift_func(i);
            hit_outcome = enemy.shoot(crosshair, shot.radius, shift_x);
            outcomes[hit_outcome] += 1;
          }
          if (this.weapon.crit_factor === 1) {
            outcomes[HIT] += outcomes[CRIT];
            outcomes[CRIT] = 0;
          }
          shot.outcomes = outcomes;
          total_outcomes[MISS] += outcomes[MISS];
          total_outcomes[HIT] += outcomes[HIT];
          total_outcomes[CRIT] += outcomes[CRIT];
        }
        total = total_outcomes[MISS] + total_outcomes[HIT] + total_outcomes[CRIT];
        return this.outcomes = (function() {
          var l, len1, results;
          results = [];
          for (l = 0, len1 = total_outcomes.length; l < len1; l++) {
            o = total_outcomes[l];
            results.push(o / total);
          }
          return results;
        })();
      }

      calculate_shots_damage() {
        var h, index, j, k, key, last_shot, len, len1, ref, ref1, shot, time, total_dmg;
        this.height = 30;
        this.hit_dmg = this.basic_dmg * modificator.factor;
        this.crit_dmg = this.hit_dmg * this.weapon.crit_factor;
        if (modificator.mods.armor.on) {
          ref = ['hit_dmg', 'crit_dmg'];
          for (j = 0, len = ref.length; j < len; j++) {
            key = ref[j];
            this[key] = modificator.mods.armor.func(this[key]);
          }
        }
        total_dmg = 0;
        ref1 = this.shots;
        for (index = k = 0, len1 = ref1.length; k < len1; index = ++k) {
          shot = ref1[index];
          shot.damage = shot.outcomes[HIT] * this.hit_dmg + shot.outcomes[CRIT] * this.crit_dmg;
          h = this.shot_dimensions(shot);
          total_dmg += shot.damage;
          if (h > this.height) {
            this.height = h;
          }
        }
        last_shot = this.shots[this.shots.length - 1];
        time = last_shot.t;
        if (last_shot.duration != null) {
          time += last_shot.duration;
        }
        this.dps = total_dmg / time;
        console.log(this.dps);
        return this.height = 2 * Math.ceil(this.height / 2);
      }

      shot_dimensions(shot) {
        if (shot.damage > this.max_square_dmg) {
          shot.width = this.max_shot_width;
          shot.height = areascale * shot.damage / shot.width;
        } else {
          shot.width = Math.sqrt(areascale * shot.damage);
          shot.height = shot.width;
        }
        return shot.height;
      }

    };

    total_time = 10 * max_time;

    draw_time = 1.2 * max_time;

    return WeaponData;

  }).call(this);

  BeamWeaponData = class BeamWeaponData extends WeaponData {
    shot_dimensions(shot) {
      shot.damage *= shot.duration * this.weapon.fire_rate;
      shot.dps = shot.damage / shot.duration;
      return shot.height = shot.dps * areascale / timescale;
    }

  };

  //beam mech
  PhotonProjectorWeaponData = class PhotonProjectorWeaponData extends BeamWeaponData {
    calculate_shots_damage() {
      var basic_dmg, dmg, factor, h, index, j, k, len, len1, ref, ref1, shot;
      this.height = 30;
      this.hit_dmg = this.basic_dmg * modificator.factor;
      this.dmg_levels = [];
      ref = this.weapon.damage.dps_factors;
      for (j = 0, len = ref.length; j < len; j++) {
        factor = ref[j];
        this.dmg_levels.push(this.hit_dmg * factor);
      }
      if (modificator.mods.armor.on) {
        this.dmg_levels = (function() {
          var k, len1, ref1, results;
          ref1 = this.dmg_levels;
          results = [];
          for (k = 0, len1 = ref1.length; k < len1; k++) {
            dmg = ref1[k];
            results.push(modificator.mods.armor.func(dmg));
          }
          return results;
        }).call(this);
      }
      ref1 = this.shots;
      for (index = k = 0, len1 = ref1.length; k < len1; index = ++k) {
        shot = ref1[index];
        basic_dmg = index >= this.dmg_levels.length ? this.dmg_levels[this.dmg_levels.length - 1] : this.dmg_levels[index];
        shot.damage = shot.outcomes[HIT] * basic_dmg;
        h = this.shot_dimensions(shot);
        if (h > this.height) {
          this.height = h;
        }
      }
      console.log(this.weapon.name, this.height, this.dmg_levels);
      return this.height = 2 * Math.ceil(this.height / 2);
    }

  };

  // hero filterting
  hero_filter = (function() {
    var hero_selection_el, reloadVisibility, sel_weapons;
    hero_selection_el = d3.select('.hero-selection-row');
    hero_selection_el.display = "none";
    d3.selectAll('.nav-toggle-select').on("click", function() {
      return hero_selection_el.style('display', function() {
        return hero_selection_el.display = hero_selection_el.display === "none" ? "block" : "none";
      });
    });
    sel_weapons = d3.select('.hero-selection').selectAll('div').data(weapons).enter().append(function(weapon) {
      return htmlToElement(hero_selection_template(weapon));
    }).on('click', function(weapon) {
      weapon.visible = !weapon.visible;
      d3.select(this).style('background-color', weapon.visible ? weapon.hero.color : 'initial').classed('inverse', !weapon.visible);
      return d3.select(`.row#${weapon.idString}`).style('display', weapon.visible ? 'flex' : 'none');
    });
    reloadVisibility = function() {
      sel_weapons.style('background-color', function(weapon) {
        if (weapon.visible) {
          return weapon.hero.color;
        } else {
          return 'initial';
        }
      }).classed('inverse', function(weapon) {
        return !weapon.visible;
      });
      return chart.selectAll("div.row").style('display', function(wdata) {
        if (wdata.weapon.visible) {
          return 'flex';
        } else {
          return 'none';
        }
      });
    };
    d3.select('.select-all').on('click', () => {
      var j, len, ref, weapon;
      ref = this.weapons;
      for (j = 0, len = ref.length; j < len; j++) {
        weapon = ref[j];
        weapon.visible = true;
      }
      return reloadVisibility();
    });
    d3.select('.select-none').on('click', function() {
      var j, len, weapon;
      for (j = 0, len = weapons.length; j < len; j++) {
        weapon = weapons[j];
        weapon.visible = false;
      }
      return reloadVisibility();
    });
    d3.selectAll('.select-by-role').on('click', function() {
      var j, len, role, weapon;
      role = d3.select(this).attr('data-role');
      for (j = 0, len = weapons.length; j < len; j++) {
        weapon = weapons[j];
        weapon.visible = weapon.hero.role === role;
      }
      return reloadVisibility();
    });
    d3.selectAll('.select-by-weapon').on('click', function() {
      var j, len, weapon, wtype;
      wtype = d3.select(this).attr('data-weapon');
      for (j = 0, len = weapons.length; j < len; j++) {
        weapon = weapons[j];
        weapon.visible = _.includes(weapon.type, wtype);
      }
      return reloadVisibility();
    });
    return {
      reloadVisibility: reloadVisibility
    };
  })();

  // info string 
  info_string = (function() {
    info_string = {
      current: 0,
      variants: [
        {
          text: 'Mean DPS',
          func: function(wdata) {
            var ref;
            return (ref = wdata.dps) != null ? ref.toFixed(1) : void 0;
          }
        },
        {
          text: 'Acc',
          func: function(wdata) {
            var acc;
            acc = 100 * (wdata.outcomes[HIT] + wdata.outcomes[CRIT]);
            return acc.toFixed(1) + '%';
          }
        },
        {
          text: 'Crit acc',
          func: function(wdata) {
            var acc;
            acc = 100 * wdata.outcomes[CRIT];
            return acc.toFixed(1) + '%';
          }
        }
      ],
      text: function(wdata) {
        return this.variants[this.current].func(wdata);
      },
      increment: function() {
        this.current += 1;
        return this.current = this.current % this.variants.length;
      },
      update_rows: function() {
        return hero_rows.rows.select('.info-string').text(function(wdata) {
          return info_string.text(wdata);
        });
      }
    };
    d3.select('.nav-toggle-info').on('click', function() {
      var str;
      info_string.increment();
      info_string.update_rows();
      str = info_string.variants[info_string.current].text;
      return d3.select(this).select('a').text(str);
    });
    return info_string;
  })();

  chart = d3.select(".chart");

  state_data = (function() { //weapons, enemy, distance, crosshair 
    var j, len, list, wdata, weapon;
    list = [];
    for (j = 0, len = weapons.length; j < len; j++) {
      weapon = weapons[j];
      wdata = (function() {
        switch (false) {
          case weapon.name !== 'Photon Projector':
            return new PhotonProjectorWeaponData(weapon);
          case weapon.type !== 'beam':
            return new BeamWeaponData(weapon);
          default:
            return new WeaponData(weapon);
        }
      })();
      wdata.refresh_distance(enemy, crosshair);
      list.push(wdata);
    }
    return {
      list: list,
      shot_attrs: {
        height: function(shot) {
          return shot.height;
        },
        y: function(shot) {
          return -shot.height / 2;
        },
        x: function(shot) {
          var shift_x;
          shift_x = shot.duration != null ? 0 : shot.width / 2;
          return timeScale(shot.t) - shift_x;
        },
        width: function(shot) {
          if (shot.duration != null) {
            return shot.duration * timescale;
          } else {
            return shot.width;
          }
        }
      },
      refresh_distance: function(enemy, crosshair) {
        var k, len1, ref;
        ref = this.list;
        for (k = 0, len1 = ref.length; k < len1; k++) {
          wdata = ref[k];
          wdata.refresh_distance(enemy, crosshair);
        }
        return this.update_damage();
      },
      refresh_crosshair: function(enemy, crosshair) {
        var k, len1, ref;
        ref = this.list;
        for (k = 0, len1 = ref.length; k < len1; k++) {
          wdata = ref[k];
          wdata.refresh_crosshair(enemy, crosshair);
        }
        return this.update_damage();
      },
      update_damage: function(update = 'all') {
        var k, len1, row_selector, rows, svgs, update_list;
        if (update === 'all') {
          row_selector = 'div.row';
          update_list = this.list;
        } else {
          row_selector = 'div#' + update.idString;
          update_list = [this.list[update.index]];
        }
        for (k = 0, len1 = update_list.length; k < len1; k++) {
          wdata = update_list[k];
          wdata.calculate_shots_damage();
        }
        rows = chart.selectAll(row_selector);
        rows.select('.info-string').text(function(wdata) {
          return info_string.text(wdata);
        });
        rows.select('.icon-box').transition().style('height', function(wdata) {
          return `${wdata.height}px`;
        });
        svgs = rows.select('svg').style('height', function(wdata) {
          return `${wdata.height}px`;
        }).attr('viewBox', function(wdata) {
          return `0 -${wdata.height / 2} ${chart_width} ${wdata.height}`;
        });
        return svgs.selectAll('rect.shot').data(function(wdata) {
          return wdata.shots;
        }).transition().attrs(this.shot_attrs);
      }
    };
  })();

  // init hero rows
  hero_rows = (function() { // state_data
    var rows, shots, svgs, tooltip;
    rows = chart.selectAll("div.row").data(state_data.list).enter().append(function(wdata) {
      return htmlToElement(row_template(wdata));
    });
    tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
    svgs = rows.select('svg');
    shots = svgs.selectAll('rect.shot').data(function(wdata) {
      return wdata.shots;
    }).enter().append('rect').classed('shot', true).attrs(state_data.shot_attrs).attr('fill', function(shot) {
      return shot.wdata.color;
    }).on("mouseover", function(d) {
      var num, units;
      tooltip.transition().duration(200).style("opacity", .9);
      [num, units] = d.dps != null ? [d.dps, "dps"] : [d.damage, "hp"];
      return tooltip.html(`${formatNumber(num, 2)} ${units}`).style("left", `${d3.event.pageX}px`).style("top", `${d3.event.pageY - 28}px`);
    }).on("mouseout", function(d) {
      return tooltip.transition().duration(500).style("opacity", 0);
    });
    return {
      rows: rows,
      svgs: svgs,
      shots: shots
    };
  })();

  state_data.update_damage();

  hero_filter.reloadVisibility();

  (function() {    // distance slider
    //enemy, crosshair, state_data
    var local_update_dist, slider, update_distance, viewport;
    local_update_dist = false;
    update_distance = function(val, update_slider = false, update_input = false) {
      crosshair.distance = (function() {
        switch (false) {
          case !isNaN(val):
            return 5;
          case !(val < 0.1):
            return 0.1;
          default:
            return val;
        }
      })();
      state_data.refresh_distance(enemy, crosshair);
      viewport.setscale(crosshair.distance);
      viewport.updateDummyFigure();
      if (update_input) {
        slider.input.property('value', crosshair.distance.toFixed(2));
      }
      if (update_slider) {
        local_update_dist = true;
        slider.slider.value(crosshair.distance);
        return local_update_dist = false;
      }
    };
    // slider
    slider = (function() {
      var g, input;
      input = d3.select('.distance-panel input').attr('value', crosshair.distance).on('change', function() {
        var val;
        val = parseFloat(input.property('value'));
        return update_distance(val, true, false);
      });
      slider = d3.sliderHorizontal().min(0).max(50).width(350).tickFormat(d3.format('.1f')).ticks(6).default(crosshair.distance).on('onchange', _.throttle(function(val) {
        if (!local_update_dist) {
          return update_distance(val, false, true);
        }
      }, 100));
      g = d3.select("div#distance-slider").append("svg").attr("width", 400).attr("height", 50).append("g").attr("transform", "translate(20,10)");
      g.call(slider);
      return {
        slider: slider,
        input: input
      };
    })();
    // enemy viewport
    return viewport = (function() { //enemy
      var drag, dragended, dragged, dragstarted, dummyFigure, setEnemyFigure;
      dragstarted = function(d) {
        return d3.select(this).raise().classed("dragging", true);
      };
      dragged = function(d) {
        d.x += d3.event.dx;
        d.y += d3.event.dy;
        viewport.updateDummyFigure();
        viewport.update_crosshair(crosshair);
        return state_data.refresh_crosshair(enemy, crosshair);
      };
      dragended = function(d) {
        return d3.select(this).classed("dragging", false);
      };
      viewport = {
        x: 0,
        y: 0,
        scale: 1,
        createTransformString: function() {
          return `translate(${this.x} ${this.y}) scale(${this.scale})`;
        },
        setscale: function(distance) {
          this.x /= this.scale;
          this.y /= this.scale;
          this.scale = 1.0 / distance / radians;
          this.x *= this.scale;
          return this.y *= this.scale;
        },
        update_crosshair: function(crosshair) {
          crosshair.z = basicCursorHeight + this.y / this.scale;
          return crosshair.x = this.x / this.scale;
        },
        updateDummyFigure: function() {
          return dummyFigure.attr('transform', function(d) {
            return d.createTransformString();
          });
        }
      };
      viewport.setscale(crosshair.distance);
      drag = d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
      dummyFigure = d3.select('svg.figure_chart g.figure').data([viewport]).call(drag);
      viewport.updateDummyFigure();
      setEnemyFigure = function() {
        dummyFigure.select('image').attrs({
          x: -enemy.image.x,
          y: -enemy.image.height + enemy.image.y,
          height: enemy.image.height,
          width: enemy.image.height * enemy.image.dims.width / enemy.image.dims.height,
          'xlink:href': enemy.image.url
        });
        enemy.body.appendElement(dummyFigure).classed('figure_body', true);
        return enemy.head.appendElement(dummyFigure).classed('figure_head', true);
      };
      // basicRectangle
      //   .appendElement(dummyFigure)
      //   .styles
      //     fill: "none"
      //     "stroke-width": 0.05
      //     stroke: "rgb(0,255,0)"
      setEnemyFigure();
      return viewport;
    })();
  })();

  (function() {    // modificators
    var set_multiplier_string;
    set_multiplier_string = function() {
      var str;
      str = `${this.modificator.factor}×`;
      if (modificator.mods.armor.on) {
        str += " + armor";
      }
      return d3.select('p.mod-result').text(str);
    };
    return d3.select('.modificators').selectAll('.hero-ability-icon-bg').data(modificator.mod_list).classed('inverse', true).style('background-color', 'transparent').on('click', function(m) {
      m.on = !m.on;
      d3.select(this).classed('inverse', !m.on).style('background-color', m.on ? m.color : 'transparent');
      modificator.refresh_factor();
      set_multiplier_string();
      return state_data.update_damage();
    });
  })();

  // zarya energy sliders
  (function(weapon_dict) {
    return d3.selectAll('.hero-slider').each(function() {
      return new Dragdealer(this, {
        animationCallback: function(x, y) {
          var el, energy, name, wdata, weapon;
          energy = Math.round(x * 100);
          el = d3.select(this.wrapper);
          el.select('.handle').text(energy);
          name = el.attr('data-weapon-name');
          weapon = weapon_dict[name];
          weapon.energy = energy;
          wdata = state_data.list[weapon.index];
          wdata.set_distance(crosshair.distance);
          return state_data.update_damage(weapon);
        }
      });
    });
  })(weapon_dict);

}).call(this);