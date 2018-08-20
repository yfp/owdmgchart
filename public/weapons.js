// Generated by CoffeeScript 2.3.1
(function() {
  var degtan, gravity_acc, i, index, j, k, len, len1, len2, max_arc_range, name, ramp, ref, ref1, ref2, weapon;

  gravity_acc = 9.0; //m/s^2

  degtan = function(angle) {
    return Math.tan(angle / 180 * Math.PI); //angle/180*Math.PI
  };

  max_arc_range = (v) => {
    return v * v / gravity_acc;
  };

  ramp = function(values, args) {
    var r1, r2, v1, v2;
    [r1, r2] = args;
    [v1, v2] = values;
    if (r1 > r2) {
      [r2, r1] = args;
      [v2, v1] = values;
    }
    return (r) => {
      switch (false) {
        case !(r <= r1):
          return v1;
        case !(r >= r2):
          return v2;
        default:
          return v1 + (r - r1) / (r2 - r1) * (v2 - v1);
      }
    };
  };

  this.heros = {
    Ana: {
      color: "#718ab3",
      role: 'healer'
    },
    Bastion: {
      color: "#7c8f7b",
      role: 'dd'
    },
    Brigitte: {
      color: "#be736e",
      role: 'healer'
    },
    Dva: {
      color: "#ed93c7",
      role: 'tank'
    },
    Doomfist: {
      color: "#815049",
      role: 'dd'
    },
    Genji: {
      color: "#97ef43",
      role: 'dd'
    },
    Hanzo: {
      color: "#b9b48a",
      role: 'dd'
    },
    Junkrat: {
      color: "#ecbd53",
      role: 'dd'
    },
    Lucio: {
      color: "#85c952",
      role: 'healer'
    },
    McCree: {
      color: "#ae595c",
      role: 'dd'
    },
    Mei: {
      color: "#6faced",
      role: 'dd'
    },
    Mercy: {
      color: "#ebe8bb",
      role: 'healer'
    },
    Moira: {
      color: "#803c51",
      role: 'healer'
    },
    Orisa: {
      color: "#468c43",
      role: 'tank'
    },
    Pharah: {
      color: "#3e7dca",
      role: 'dd'
    },
    Reaper: {
      color: "#7d3e51",
      role: 'dd'
    },
    Reinhardt: {
      color: "#929da3",
      role: 'tank'
    },
    Roadhog: {
      color: "#b68c52",
      role: 'tank'
    },
    Soldier: {
      color: "#697794",
      role: 'dd'
    },
    Sombra: {
      color: "#7359ba",
      role: 'dd'
    },
    Symmetra: {
      color: "#8ebccc",
      role: 'dd'
    },
    Torbjorn: {
      color: "#c0726e",
      role: 'dd'
    },
    Tracer: {
      color: "#d79342",
      role: 'dd'
    },
    Widowmaker: {
      color: "#9e6aa8",
      role: 'dd'
    },
    WreckingBall: {
      color: "#e6a027",
      role: 'tank'
    },
    Winston: {
      color: "#a2a6bf",
      role: 'tank'
    },
    Zarya: {
      color: "#e77eb6",
      role: 'tank'
    },
    Zenyatta: {
      color: "#ede582",
      role: 'healer'
    }
  };

  for (name in this.heros) {
    this.heros[name].icon_url = `hero-icons/${name.toLowerCase()}.png`;
    this.heros[name].name = name;
  }

  this.heros.Dva.name = "D.Va";

  this.heros.Soldier.name = "Soldier: 76";

  this.heros.WreckingBall.name = "Wrecking Ball";

  this.weapons = [
    {
      // D.va mech
      name: "Fusion Cannons",
      hero: this.heros.Dva,
      icon_url: "hero-icons/dva-cannons.png",
      type: "hitscan shotgun",
      pellets: 11,
      damage: {
        dpshot: [2,
    0.6],
        falloff: [
          10,
          20 // m
        ]
      },
      spread: {
        angle: 4.15
      },
      fire_rate: 6.67, //shots/sec
      ammo: 2e308 // D.va baby
    },
    {
      name: "Light Gun",
      hero: this.heros.Dva,
      icon_url: "hero-icons/dva-gun.png",
      type: "linear projectile",
      damage: {
        dpshot: 14
      },
      velocity: 50, //m/s
      fire_rate: 7, //shots/sec
      ammo: 20,
      reload_time: 1.5 //sec
    // Orisa
    },
    {
      name: "Fusion Driver",
      hero: this.heros.Orisa,
      icon_url: "hero-icons/orisa-driver.png",
      type: "linear projectile",
      damage: {
        dpshot: 11
      },
      velocity: 80, //m/s
      spread: {
        angle: 1.35
      },
      fire_rate: 12, //shots/sec
      ammo: 150,
      reload_time: 2.5 //sec
    // Reinhardt
    },
    {
      name: "Rocket Hammer",
      hero: this.heros.Reinhardt,
      icon_url: "hero-icons/reinhardt-hammer.png",
      type: "melee",
      damage: {
        dpshot: 75,
        max_range: 5 //m
      },
      fire_rate: 1 / 0.9 //swings/sec
    // Roadhog M1
    },
    {
      name: "Scrap Gun (primary)",
      hero: this.heros.Roadhog,
      icon_url: "hero-icons/roadhog-gun.png",
      mousebutton: 'M1',
      type: "projectile shotgun",
      pellets: 25,
      damage: {
        dpshot: [6,
    4 / 3],
        falloff: [10,
    20]
      },
      spread: {
        angle: 20.1
      },
      velocity: 60, //m/s
      fire_rate: 1 / 0.7, //shots/sec
      ammo: 5,
      reload_time: 1.5 //sec
    // Roadhog M2
    },
    {
      name: "Scrap Gun (secondary)",
      hero: this.heros.Roadhog,
      icon_url: "hero-icons/roadhog-gun.png",
      mousebutton: 'M2',
      type: "linear projectile/shotgun",
      pellets: [1,
    25],
      damage: {
        dpshot: 6, //, 4/3]
        // falloff: [10, 20]
        dpshot_ball: 50,
        range_ball: 9 //m
      },
      spread: {
        angle: 20.1
      },
      velocity: 60, //m/s
      crit_factor: 2,
      fire_rate: 1 / 0.7, //shots/sec
      ammo: 5,
      reload_time: 1.5 //sec
    // Winston
    },
    {
      name: "Tesla Cannon",
      hero: this.heros.Winston,
      icon_url: "hero-icons/winston-tesla.png",
      type: "beam",
      damage: {
        dpshot: 3,
        max_range: 8
      },
      fire_rate: 20, //shots/sec
      ammo: 100,
      reload_time: 1.5 //sec
    // Wrecking Ball
    },
    {
      name: "Quad Cannons",
      hero: this.heros.WreckingBall,
      icon_url: "hero-icons/wreckingball-cannon.png",
      type: "hitscan",
      damage: {
        dpshot: [5,
    2.5],
        falloff: [15,
    25]
      },
      spread: {
        angle: 2.0
      },
      fire_rate: 25, //shots/sec
      ammo: 80,
      reload_time: 1.5 //sec
    // Zarya M1
    },
    {
      name: "Particle Cannon (primary)",
      hero: this.heros.Zarya,
      icon_url: "hero-icons/zarya-cannon.png",
      mousebutton: 'M1',
      type: "beam",
      energy: 0,
      damage: {
        dpshot: 4.75 * 4,
        max_range: 16 //m
      },
      fire_rate: 5, // 20 shots/sec to 5hz ticks = factor 4
      ammo: 100 / 4,
      reload_time: 1.5 //sec
    // Zarya M2
    },
    {
      name: "Particle Cannon (secondary)",
      hero: this.heros.Zarya,
      icon_url: "hero-icons/zarya-cannon.png",
      mousebutton: 'M2',
      type: "arc projectile",
      velocity: 23.5, //m
      energy: 0,
      damage: {
        dpshot: 45
      },
      fire_rate: 1, //shot/sec
      ammo: 4,
      reload_time: 1.5 //sec
    // Bastion Recon
    },
    {
      name: "Configuration: Recon",
      hero: this.heros.Bastion,
      icon_url: 'hero-icons/bastion-recon.png',
      type: "hitscan",
      damage: {
        dpshot: [20,
    6],
        falloff: [26,
    50]
      },
      spread: {
        max_angle: 1.25,
        spreading_ammo_range: [5,
    10]
      },
      fire_rate: 8, //shots/sec
      ammo: 25,
      reload_time: 2 //sec
    // Bastion Sentry
    },
    {
      name: "Configuration: Sentry",
      hero: this.heros.Bastion,
      icon_url: 'hero-icons/bastion-sentry.png',
      type: "hitscan",
      damage: {
        dpshot: [15,
    4],
        falloff: [35,
    55]
      },
      spread: {
        angle: 3
      },
      fire_rate: 30, //shots/sec
      ammo: 300,
      reload_time: 2 //sec
    // Doomfist
    },
    {
      name: "Hand Cannon",
      hero: this.heros.Doomfist,
      icon_url: "hero-icons/doomfist-cannon.png",
      type: "projectile shotgun",
      velocity: 80, //m/s
      pellets: 11,
      damage: {
        dpshot: 6
      },
      spread: {
        angle: 2.15
      },
      ammo: 4,
      fire_rate: 3, //shots/sec
      reload_time: 0.65 //sec
    // Genji M1
    },
    {
      name: "Shuriken",
      hero: this.heros.Genji,
      icon_url: "hero-icons/genji-shuriken.png",
      mousebutton: 'M1',
      type: "linear projectile",
      velocity: 60, //m
      damage: {
        dpshot: 28
      },
      ammo: 24,
      fire_rate: 1, //shots/sec
      burst: {
        ammo: 3,
        delay: 0.1 //sec  ### CHECK
      },
      reload_time: 1.5 //sec
    // Genji M2
    },
    {
      name: "Fan of Blades",
      hero: this.heros.Genji,
      icon_url: "hero-icons/genji-shuriken.png",
      mousebutton: 'M2',
      type: "linear projectile/fixed pattern shotgun",
      velocity: 60, //m
      pellets: 3,
      damage: {
        dpshot: 28
      },
      spread: {
        fixed_angle: 30
      },
      ammo: 24 / 3,
      fire_rate: 1, //shots/sec
      reload_time: 1.5 //sec
    // Hanzo
    },
    {
      name: "Storm Bow",
      hero: this.heros.Hanzo,
      icon_url: "hero-icons/hanzo-bow.png",
      type: "arc projectile",
      velocity: 100, //m/sec
      damage: {
        dpshot: 125
      },
      ammo: 2e308,
      fire_rate: 1 / (0.5 + 0.5), //sec
      charge_delay: 0.5, //sec
      crit_factor: 2 // Junkrat
    },
    {
      name: "Frag Launcher",
      hero: this.heros.Junkrat,
      icon_url: "hero-icons/junkrat-launcher.png",
      type: "arc projectile",
      velocity: 17.5, //m/sec
      damage: {
        dpshot: 120
      },
      ammo: 5,
      fire_rate: 5 / 3, //shots/sec
      reload_time: 1.5 //sec
    // McCree M1
    },
    {
      name: "Peacekeeper",
      hero: this.heros.McCree,
      icon_url: "hero-icons/mccree-peacemaker.png",
      mousebutton: 'M1',
      type: "hitscan",
      damage: {
        dpshot: [70,
    21],
        falloff: [22,
    45]
      },
      ammo: 6,
      fire_rate: 2, //shots/sec
      reload_time: 1.5 //sec
    // McCree M2
    },
    {
      name: "Fan the Hammer",
      hero: this.heros.McCree,
      icon_url: "hero-icons/mccree-peacemaker.png",
      mousebutton: 'M2',
      type: "hitscan",
      damage: {
        dpshot: [45,
    13.5],
        falloff: [18,
    30]
      },
      spread: {
        angle: 6.50
      },
      crit_factor: 1,
      ammo: 6,
      fire_rate: 6.9, //shots/sec
      reload_time: 1.5 //sec
    // Mei M1
    },
    {
      name: "Endothermic Blaster",
      hero: this.heros.Mei,
      icon_url: "hero-icons/mei-blaster.png",
      mousebutton: 'M1',
      type: "beam",
      velocity: 20, //m/sec
      damage: {
        dpshot: 2.25,
        max_range: 10 //m
      },
      fire_rate: 20, //shots/sec
      ammo: 200,
      reload_time: 1.5 //sec
    // Mei M2
    },
    {
      name: "Icicle",
      hero: this.heros.Mei,
      icon_url: "hero-icons/mei-blaster.png",
      mousebutton: 'M2',
      type: "linear projectile",
      velocity: 120, //m/sec
      damage: {
        dpshot: 75
      },
      fire_rate: 1.2, //shots/sec
      ammo: 10,
      charge_delay: 0.4, //sec
      reload_time: 1.5 //sec
    // Soldier
    },
    {
      name: "Pulse Rifle",
      hero: this.heros.Soldier,
      icon_url: "hero-icons/soldier-rifle.png",
      type: "hitscan",
      damage: {
        dpshot: [19,
    5.7],
        falloff: [30,
    55]
      },
      spread: {
        max_angle: 2.4,
        spreading_ammo_range: [3,
    6]
      },
      ammo: 25,
      fire_rate: 9, //shots/sec
      reload_time: 1.5 //sec
    // Pharah
    },
    {
      name: "Rocket Launcher",
      hero: this.heros.Pharah,
      icon_url: "hero-icons/pharah-launcher.png",
      shape: "rect",
      type: "projectile",
      velocity: 35, //m/s
      damage: {
        dpshot: 120
      },
      crit_factor: 1,
      ammo: 6,
      fire_rate: 1.1, //shots/sec
      reload_time: 1 //sec
    // Reaper
    },
    {
      name: "Hellfire Shotguns",
      hero: this.heros.Reaper,
      icon_url: "hero-icons/reaper-shotgun.png",
      type: "hitscan shotgun",
      pellets: 20,
      damage: {
        dpshot: [7,
    2],
        falloff: [11,
    20]
      },
      spread: {
        angle: 20.1
      },
      ammo: 8,
      fire_rate: 2, //shots/sec
      reload_time: 1.5 //sec
    // Sombra
    },
    {
      name: "Machine Pistol",
      hero: this.heros.Sombra,
      icon_url: "hero-icons/sombra-pistol.png",
      type: "hitscan",
      damage: {
        dpshot: [8,
    2.4],
        falloff: [15,
    25]
      },
      spread: {
        max_angle: 2.7,
        spreading_ammo_range: [
          3,
          6 //CHECK
        ]
      },
      ammo: 60,
      fire_rate: 20, //shots/sec
      reload_time: 1.5 //sec
    // Symmetra M1 
    },
    {
      name: "Photon Projector",
      hero: this.heros.Symmetra,
      icon_url: "hero-icons/symmetra-projector.png",
      mousebutton: 'M1',
      type: "beam",
      damage: {
        dpshot: 60 / 7 * 1.75,
        dps_factors: [1,
    2,
    3],
        level_charging_time: 2, //sec
        max_range: 10 //m
      },
      fire_rate: 4, // 7 shots/sec to 4 hz ticks = factor 7/4=1.75
      ammo: 70 / 1.75,
      reload_time: 1.8 //sec
    // Symmetra M2 ### CHECK thoroughly
    },
    {
      name: "Photon Orb",
      hero: this.heros.Symmetra,
      icon_url: "hero-icons/symmetra-projector.png",
      mousebutton: 'M2',
      type: "projectile",
      velocity: 20, //m/s
      damage: {
        dpshot: 60 // 6-60
      },
      fire_rate: 1 / (1 + 1 + 0.063), // shots/sec  0.2-1 sec = 0.063
      charge_delay: 1 + 1, //sec  
      ammo: 10, //1-10 rounds 70 total
      reload_time: 1.8, //sec
      crit_factor: 1 // Torbjorn M1
    },
    {
      name: "Rivet Gun (primary)",
      hero: this.heros.Torbjorn,
      icon_url: "hero-icons/torbjorn-gun.png",
      mousebutton: 'M1',
      type: "arc projectile",
      velocity: 57, //m/sec
      damage: {
        dpshot: 70
      },
      fire_rate: 1 / 0.6, //shots/sec
      ammo: 18,
      reload_time: 2, //sec
      crit_factor: 2 // Torbjorn M2
    },
    {
      name: "Rivet Gun (secondary)",
      hero: this.heros.Torbjorn,
      icon_url: "hero-icons/torbjorn-gun.png",
      mousebutton: 'M2',
      type: "projectile shotgun",
      pellets: 10,
      velocity: 80, //m/sec
      damage: {
        dpshot: [15,
    6],
        falloff: [7,
    20]
      },
      spread: {
        angle: 4.15
      },
      fire_rate: 1.25, //shots/sec
      ammo: 6,
      reload_time: 2 //sec
    // Torbjorn hammer
    },
    {
      name: "Forge Hammer",
      hero: this.heros.Torbjorn,
      icon_url: "hero-icons/torbjorn-hammer.png",
      type: "melee",
      damage: {
        dpshot: 55,
        max_range: 2 //m   ### CHECK
      },
      fire_rate: 1.25 //shots/sec
    // Tracer
    },
    {
      name: "Pulse Pistols",
      hero: this.heros.Tracer,
      icon_url: "hero-icons/sombra-pistol.png",
      type: "hitscan shotgun",
      pellets: 2,
      damage: {
        dpshot: [6,
    1.5],
        falloff: [11,
    30]
      },
      spread: {
        max_angle: 3.6,
        spreading_ammo_range: [
          3,
          6 //CHECK
        ]
      },
      ammo: 20,
      fire_rate: 20, //shots/sec
      reload_time: 1.25 //sec
    // Widowmaker M1
    },
    {
      name: "Widow's Kiss: Assault",
      hero: this.heros.Widowmaker,
      icon_url: "hero-icons/widowmaker-rifle.png",
      mousebutton: 'M1',
      type: "hitscan",
      damage: {
        dpshot: [13,
    6.5],
        falloff: [
          10,
          30 //# CHECK
        ]
      },
      spread: {
        max_angle: 3.0,
        spreading_ammo_range: [
          3,
          6 //CHECK
        ]
      },
      ammo: 30,
      fire_rate: 10, //shots/sec
      reload_time: 1.5 //sec
    // Widowmaker M2
    },
    {
      name: "Widow's Kiss: Sniper",
      hero: this.heros.Widowmaker,
      icon_url: "hero-icons/widowmaker-rifle.png",
      mousebutton: 'M2',
      type: "hitscan",
      damage: {
        dpshot: 120
      },
      ammo: 30 / 3,
      fire_rate: 1 / 1.25, //shots/sec
      charge_delay: 0.75, //sec
      reload_time: 1.5, //sec
      crit_factor: 2.5 // Ana M1
    },
    {
      name: "Biotic Rifle (primary)",
      hero: this.heros.Ana,
      icon_url: "hero-icons/ana-rifle.png",
      mousebutton: 'M1',
      type: "projectile",
      velocity: 90, //m/sec
      damage: {
        dpshot: 70
      },
      ammo: 14,
      fire_rate: 1.25, //shots/sec
      reload_time: 1.5, //sec
      crit_factor: 1 // Ana M2
    },
    {
      name: "Biotic Rifle (secondary)",
      hero: this.heros.Ana,
      icon_url: "hero-icons/ana-rifle.png",
      mousebutton: 'M2',
      type: "hitscan",
      damage: {
        dpshot: 70
      },
      ammo: 14,
      fire_rate: 1.25, //shots/sec
      reload_time: 1.5, //sec
      crit_factor: 1 // Brigitte
    },
    {
      name: "Rocket Flail",
      hero: this.heros.Brigitte,
      icon_url: "hero-icons/brigitte-flail.png",
      type: "melee",
      damage: {
        dpshot: 35,
        max_range: 6 //m
      },
      fire_rate: 1 / 0.6 //shots/sec
    // Lucio 
    },
    {
      name: "Sonic Amplifier",
      hero: this.heros.Lucio,
      icon_url: "hero-icons/lucio-amplifier.png",
      type: "linear projectile",
      velocity: 50, //m/sec
      damage: {
        dpshot: 20
      },
      burst: {
        ammo: 4,
        delay: 0.125 //s
      },
      fire_rate: 1, //burst/sec
      ammo: 20,
      reload_time: 1.5 //sec 
    // Mercy
    },
    {
      name: "Caduceus Blaster",
      hero: this.heros.Mercy,
      icon_url: "hero-icons/mercy-blaster.png",
      type: "linear projectile",
      velocity: 40, //m/sec
      damage: {
        dpshot: 20
      },
      fire_rate: 5, //shots/sec
      ammo: 20,
      reload_time: 1.5 //sec
    // Moira
    },
    {
      name: "Biotic Grasp",
      hero: this.heros.Moira,
      icon_url: "hero-icons/moira-grasp.png",
      type: "beam",
      damage: {
        dpshot: 50,
        max_range: 21 //m
      },
      fire_rate: 1, //shots/sec
      ammo: 17,
      reload_time: 0 //sec
    // Zenyatta M1
    },
    {
      name: "Orb of Destruction",
      hero: this.heros.Zenyatta,
      icon_url: "hero-icons/zenyatta-orb.png",
      mousebutton: 'M1',
      type: "linear projectile",
      velocity: 80, //m/sec
      damage: {
        dpshot: 46
      },
      fire_rate: 2.5, //shots/sec
      ammo: 20,
      reload_time: 2 //sec
    // Zenyatta M2
    },
    {
      name: "Orb Volley",
      hero: this.heros.Zenyatta,
      icon_url: "hero-icons/zenyatta-orb.png",
      mousebutton: 'M2',
      type: "linear projectile",
      velocity: 80, //m/sec
      damage: {
        dpshot: 46
      },
      burst: {
        ammo: 5,
        delay: 0.125 //sec   #   CHECK
      },
      charge_delay: 3.4, //sec
      fire_rate: 1 / 4, //burst/sec
      ammo: 20,
      reload_time: 2 //sec
    }
  ];

  this.weapon_dict = {};

  ref = this.weapons;
  for (index = i = 0, len = ref.length; i < len; index = ++i) {
    weapon = ref[index];
    weapon.index = index;
    this.weapon_dict[weapon.name] = weapon;
  }

  (function(w) {
    var chtime, levels;
    chtime = w.damage.level_charging_time;
    levels = w.damage.dps_factors;
    w.damage_factor_func = function(ammo, t) {
      var n;
      n = Math.floor(t / chtime);
      console.log(n);
      if (n >= levels.length) {
        n = levels.length - 1;
      }
      return levels[n];
    };
    return w.shot_time_func = function(ammo, t) {
      var consumed_ammo;
      if (t < (levels.length - 1) * chtime) {
        consumed_ammo = chtime * this.fire_rate;
        return [ammo - consumed_ammo, chtime, consumed_ammo];
      } else {
        return [w.ammo, ammo * this.shot_time + this.reload_time, ammo];
      }
    };
  })(this.weapon_dict['Photon Projector']);

  (function(w) {
    return w.shot_time_func = function(ammo) {
      if (ammo <= 1) {
        return [1, this.shot_time + this.reload_time, 1];
      } else {
        return [ammo - 1, this.shot_time, 1];
      }
    };
  })(this.weapon_dict['Hand Cannon']);

  (function(w) {
    var falloff, tan;
    // falloff = ramp(w.damage.dpshot, w.damage.falloff)
    falloff = function() {
      return w.damage.dpshot;
    };
    w.basic_damage_func = function(distance) {
      if (distance < this.damage.range_ball) {
        return this.damage.dpshot_ball;
      } else {
        return falloff(distance - this.damage.range_ball);
      }
    };
    tan = degtan(w.spread.angle / 2);
    w.make_radius_func = function(distance) {
      var radius;
      if (distance < this.damage.range_ball) {
        return function(ammo, t) {
          return 0;
        };
      }
      radius = tan * (distance - this.damage.range_ball);
      return function(ammo, t) {
        return radius;
      };
    };
    return w.pellets_func = function(distance) {
      if (distance < this.damage.range_ball) {
        return this.pellets[0];
      } else {
        return this.pellets[1];
      }
    };
  })(this.weapon_dict['Scrap Gun (secondary)']);

  ref1 = ['primary', 'secondary'];
  for (j = 0, len1 = ref1.length; j < len1; j++) {
    name = ref1[j];
    (function(w) {
      return w.basic_damage_func = function(distance) {
        if (distance > this.damage.max_range) {
          return 0;
        }
        return this.damage.dpshot * (1 + this.energy / 100);
      };
    })(this.weapon_dict[`Particle Cannon (${name})`]);
  }

  (function(w) {
    return w.make_shift_func = function(distance) {
      var radius;
      radius = degtan(this.spread.fixed_angle / 2) * distance;
      return function(pellet) {
        return radius * (pellet - 2);
      };
    };
  })(this.weapon_dict['Fan of Blades']);

  ref2 = this.weapons;
  for (k = 0, len2 = ref2.length; k < len2; k++) {
    weapon = ref2[k];
    (function(w) {
      var angle_rad_func, func, range, ref3, tan;
      w.visible = true;
      w.idString = w.name.replace(/[ \(\):\']/g, '-');
      if (w.type === "arc projectile") {
        w.damage.max_range = max_arc_range(w.velocity);
        if (w.crit_factor == null) {
          w.crit_factor = 1;
        }
      }
      if (w.pellets == null) {
        w.pellets = 1;
      }
      if (w.crit_factor == null) {
        w.crit_factor = (ref3 = w.type) === 'melee' || ref3 === 'beam' ? 1 : 2;
      }
      if (w.type === 'melee') {
        w.ammo = 2e308;
      }
      if (w.shot_time == null) {
        w.shot_time = 1 / w.fire_rate;
      }
      if (w.charge_delay == null) {
        w.charge_delay = 0;
      }
      if (w.damage_factor_func == null) {
        w.damage_factor_func = function(ammo, t) {
          return 1;
        };
      }
      if (w.basic_damage_func == null) {
        w.basic_damage_func = (function() {
          switch (false) {
            case w.damage.falloff == null:
              func = ramp(w.damage.dpshot, w.damage.falloff);
              return function(distance) {
                return func(distance);
              };
            case w.damage.max_range == null:
              return function(distance) {
                return (distance <= w.damage.max_range) * w.damage.dpshot;
              };
            default:
              return function(distance) {
                return w.damage.dpshot;
              };
          }
        })();
      }
      if (w.shot_time_func == null) {
        w.shot_time_func = (function() {
          switch (false) {
            case w.type !== 'beam':
              return function(ammo) {
                return [this.ammo, this.ammo * this.shot_time + this.reload_time, this.ammo];
              };
            case w.burst == null:
              return function(ammo) {
                var delay;
                ammo -= 1;
                delay = (this.ammo - ammo) % this.burst.ammo === 0 ? this.shot_time - this.burst.delay * (this.burst.ammo - 1) : this.burst.delay;
                if (ammo === 0) {
                  delay += this.reload_time;
                  ammo = this.ammo;
                }
                return [ammo, delay, 1];
              };
            default:
              return function(ammo) {
                if (ammo <= 1) {
                  return [this.ammo, this.shot_time + this.reload_time, 1];
                } else {
                  return [ammo - 1, this.shot_time, 1];
                }
              };
          }
        })();
      }
      if (w.make_radius_func == null) {
        w.make_radius_func = (function() {
          var ref4, ref5;
          switch (false) {
            case ((ref4 = w.spread) != null ? ref4.angle : void 0) == null:
              tan = degtan(w.spread.angle / 2);
              return function(distance) {
                var radius;
                radius = distance * tan;
                return function(ammo, t) {
                  return radius;
                };
              };
            case ((ref5 = w.spread) != null ? ref5.max_angle : void 0) == null:
              range = w.spread.spreading_ammo_range;
              angle_rad_func = ramp([w.spread.max_angle / 180 * Math.PI, 0], [w.ammo - range[1], w.ammo - range[0]]);
              return function(distance) {
                return function(ammo, t) {
                  return distance * Math.tan(angle_rad_func(ammo) / 2);
                };
              };
            default:
              return function(distance) {
                return function(ammo, t) {
                  return 0;
                };
              };
          }
        })();
      }
      if (w.time_delay_func == null) {
        w.time_delay_func = (function() {
          switch (false) {
            case w.type !== 'arc projectile':
              return function(distance) {
                var phi, sin;
                sin = gravity_acc * distance / (this.velocity * this.velocity);
                if (sin > 1) {
                  sin = 1;
                }
                phi = Math.asin(sin) / 2;
                return this.charge_delay + distance / (this.velocity * Math.cos(phi));
              };
            case w.velocity == null:
              return function(distance) {
                return this.charge_delay + distance / this.velocity;
              };
            default:
              return function(distance) {
                return this.charge_delay;
              };
          }
        })();
      }
      return w.make_shift_func != null ? w.make_shift_func : w.make_shift_func = function(distance) {
        return function(pellet) {
          return 0;
        };
      };
    })(weapon);
  }

  this.modificator = (function() {
    var mod, obj;
    obj = {
      factor: 1
    };
    obj.mods = {
      armor: {
        color: "#fac50e", //@heros.Torbjorn.color
        func: function(dmg) {
          if (dmg > 10) {
            return dmg - 5;
          } else {
            return dmg / 2;
          }
        }
      },
      nanoboost_def: {
        color: this.heros.Ana.color
      },
      damage_boost: {
        color: this.heros.Pharah.color
      },
      supercharger: {
        color: this.heros.Orisa.color
      },
      nanoboost_off: {
        color: this.heros.Ana.color
      },
      discord: {
        color: "#7b539c"
      }
    };
    obj.mod_list = [];
    for (name in obj.mods) {
      mod = obj.mods[name];
      mod.name = name;
      mod.on = false;
      obj.mod_list.push(mod);
    }
    obj.refresh_factor = function() {
      var percent;
      percent = 100;
      if (this.mods.damage_boost.on) {
        percent += 30;
      }
      if (this.mods.supercharger.on) {
        percent += 50;
      }
      if (this.mods.nanoboost_off.on) {
        percent += 50;
      }
      if (this.mods.discord.on) {
        percent *= 1.3;
      }
      if (this.mods.nanoboost_def.on) {
        percent *= 0.5;
      }
      return this.factor = percent / 100;
    };
    return obj;
  })();

}).call(this);
