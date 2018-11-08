gravity_acc = 9.0 #m/s^2
degtan = (angle) -> Math.tan(angle/180*Math.PI) #angle/180*Math.PI
degcos = (angle) -> Math.cos(angle/180*Math.PI) #angle/180*Math.PI
degsin = (angle) -> Math.sin(angle/180*Math.PI) #angle/180*Math.PI
max_arc_range = (v) => v*v/gravity_acc

ramp = (values, args) ->
  [r1, r2] = args
  [v1, v2] = values
  if r1 > r2
    [r2, r1] = args
    [v2, v1] = values
  (r) =>
    switch
      when r <= r1 then v1
      when r >= r2 then v2
      else v1 + (r-r1)/(r2-r1)*(v2-v1)

@heros =
  Ana:          color: "#718ab3", role: 'healer'
  Ashe:         color: "#982020", role: 'dd'
  Bastion:      color: "#7c8f7b", role: 'dd'
  Brigitte:     color: "#be736e", role: 'healer'
  Dva:          color: "#ed93c7", role: 'tank'
  Doomfist:     color: "#815049", role: 'dd'
  Genji:        color: "#97ef43", role: 'dd'
  Hanzo:        color: "#b9b48a", role: 'dd'
  Junkrat:      color: "#ecbd53", role: 'dd'
  Lucio:        color: "#85c952", role: 'healer'
  McCree:       color: "#ae595c", role: 'dd'
  Mei:          color: "#6faced", role: 'dd'
  Mercy:        color: "#ebe8bb", role: 'healer'
  Moira:        color: "#803c51", role: 'healer'
  Orisa:        color: "#468c43", role: 'tank'
  Pharah:       color: "#3e7dca", role: 'dd'
  Reaper:       color: "#7d3e51", role: 'dd'
  Reinhardt:    color: "#929da3", role: 'tank'
  Roadhog:      color: "#b68c52", role: 'tank'
  Soldier:      color: "#697794", role: 'dd'
  Sombra:       color: "#7359ba", role: 'dd'
  Symmetra:     color: "#8ebccc", role: 'dd'
  Torbjorn:     color: "#c0726e", role: 'dd'
  Tracer:       color: "#d79342", role: 'dd'
  Widowmaker:   color: "#9e6aa8", role: 'dd'
  WreckingBall: color: "#e6a027", role: 'tank'
  Winston:      color: "#a2a6bf", role: 'tank'
  Zarya:        color: "#e77eb6", role: 'tank'
  Zenyatta:     color: "#ede582", role: 'healer'

for name of @heros
  @heros[name].icon_url = "hero-icons/#{name.toLowerCase()}.png"
  @heros[name].name = name
@heros.Dva.name = "D.Va"
@heros.Soldier.name = "Soldier: 76"
@heros.WreckingBall.name = "Wrecking Ball"

@weapons = [
# D.va mech
  name: "Fusion Cannons"
  hero: @heros.Dva
  icon_url: "hero-icons/dva-cannons.png"
  type: "hitscan shotgun"
  pellets: 11
  damage:
    dpshot:  [2, 0.6]
    falloff: [10, 20] # m
  spread: angle: 4.15
  fire_rate: 6.67 #shots/sec
  ammo: Infinity
, # D.va baby
  name: "Light Gun"
  hero: @heros.Dva
  icon_url: "hero-icons/dva-gun.png"
  type: "linear projectile"
  damage: dpshot: 14
  velocity: 50 #m/s
  fire_rate: 7 #shots/sec
  ammo: 20
  reload_time: 1.5 #sec
, # Orisa
  name: "Fusion Driver"
  hero: @heros.Orisa
  icon_url: "hero-icons/orisa-driver.png"
  type: "linear projectile"
  damage: dpshot: 11
  velocity: 80 #m/s
  spread: angle: 1.08
  fire_rate: 12 #shots/sec
  ammo: 150
  reload_time: 2.5 #sec
, # Reinhardt
  name: "Rocket Hammer"
  hero: @heros.Reinhardt
  icon_url: "hero-icons/reinhardt-hammer.png"
  type: "melee"
  damage:
    dpshot: 75
    max_range: 5 #m
  fire_rate: 1/0.9 #swings/sec
, # Roadhog M1
  name: "Scrap Gun (primary)"
  hero: @heros.Roadhog
  icon_url: "hero-icons/roadhog-gun.png"
  mousebutton: 'M1'
  type: "projectile shotgun"
  pellets: 25
  damage:
    dpshot:  [6, 4/3]
    falloff: [10, 20]
  spread: angle: 20.1
  velocity: 60 #m/s
  fire_rate: 1/0.7 #shots/sec
  ammo: 5
  reload_time: 1.5 #sec
, # Roadhog M2
  name: "Scrap Gun (secondary)"
  hero: @heros.Roadhog
  icon_url: "hero-icons/roadhog-gun.png"
  mousebutton: 'M2'
  type: "linear projectile/shotgun"
  pellets: [1, 25]
  damage:
    dpshot:  6#, 4/3]
    # falloff: [10, 20]
    dpshot_ball: 50
    range_ball: 9#m
  spread: angle: 20.1
  velocity: 60 #m/s
  crit_factor: 2
  fire_rate: 1/0.7 #shots/sec
  ammo: 5
  reload_time: 1.5 #sec
, # Winston
  name: "Tesla Cannon"
  hero: @heros.Winston
  icon_url: "hero-icons/winston-tesla.png"
  type: "beam"
  damage:
    dpshot: 3
    max_range: 8
  fire_rate: 20 #shots/sec
  ammo: 100
  reload_time: 1.5 #sec
, # Wrecking Ball
  name: "Quad Cannons"
  hero: @heros.WreckingBall
  icon_url: "hero-icons/wreckingball-cannon.png"
  type: "hitscan"
  damage:
    dpshot:  [5, 2.5]
    falloff: [15, 25]
  spread: angle: 2.0
  fire_rate: 25#shots/sec
  ammo: 80
  reload_time: 1.5#sec
, # Zarya M1
  name: "Particle Cannon (primary)"
  hero: @heros.Zarya
  icon_url: "hero-icons/zarya-cannon.png"
  mousebutton: 'M1'
  type: "beam"
  energy: 0
  damage:
    dpshot: 4.75 * 4
    max_range: 16#m
  fire_rate: 5 # 20 shots/sec to 5hz ticks = factor 4
  ammo: 100 / 4
  reload_time: 1.5 #sec
, # Zarya M2
  name: "Particle Cannon (secondary)"
  hero: @heros.Zarya
  icon_url: "hero-icons/zarya-cannon.png"
  mousebutton: 'M2'
  type: "arc projectile"
  velocity: 23.5#m
  energy: 0
  damage:
    dpshot: 45
  fire_rate: 1#shot/sec
  ammo: 4
  reload_time: 1.5 #sec
, # Ashe M1
  name: "The Viper (primary)"
  hero: @heros.Ashe
  icon_url: "hero-icons/ashe-viper.png"
  mousebutton: 'M1'
  type: "hitscan"
  damage:
    dpshot:  [40, 20]
    falloff: [20, 40]
  spread:
    max_angle: 1.85
    spreading_ammo_range: [2, 7]
  fire_rate: 4#shots/sec
  ammo: 12
  reload_time: 4.25 #sec
, # Ashe M2
  name: "The Viper (secondary)"
  hero: @heros.Ashe
  icon_url: "hero-icons/ashe-viper.png"
  mousebutton: 'M2'
  type: "hitscan"
  damage:
    dpshot:  [85, 42.5]
    falloff: [30, 60]
  fire_rate: 1.4#shots/sec
  ammo: 12
  reload_time: 4.25 #sec
, # Bastion Recon
  name: "Configuration: Recon"
  hero: @heros.Bastion
  icon_url: 'hero-icons/bastion-recon.png'
  type: "hitscan"
  damage:
    dpshot:  [20, 10]
    falloff: [26, 50]
  spread:
    max_angle: 1.25
    spreading_ammo_range: [2, 7]
  fire_rate: 8 #shots/sec
  ammo: 25
  reload_time: 2 #sec
, # Bastion Sentry
  name: "Configuration: Sentry"
  hero: @heros.Bastion
  icon_url: 'hero-icons/bastion-sentry.png'
  type: "hitscan"
  damage:
    dpshot:  [15, 7.5]
    falloff: [35, 55]
  spread: angle: 3
  fire_rate: 30 #shots/sec
  ammo: 300
  reload_time: 2 #sec
, # Doomfist
  name: "Hand Cannon"
  hero: @heros.Doomfist
  icon_url: "hero-icons/doomfist-cannon.png"
  type: "projectile shotgun"
  velocity: 80 #m/s
  pellets: 11
  damage:
    dpshot:  [6, 3]
    falloff: [15, 25]
  # damage: dpshot: 6
  spread: angle: 2.15
  ammo: 4
  fire_rate: 3 #shots/sec
  reload_time: 0.65#sec
  dps_period_base: 1/3
  dps_period_add: 0.65
, # Genji M1
  name: "Shuriken"
  hero: @heros.Genji
  icon_url: "hero-icons/genji-shuriken.png"
  mousebutton: 'M1'
  type: "linear projectile"
  velocity: 60#m
  damage: dpshot:  28
  ammo: 24
  fire_rate: 1.027 #bursts/sec
  burst:
    ammo: 3
    delay: 0.1083#sec
  reload_time: 1.5 #sec
, # Genji M2
  name: "Fan of Blades"
  hero: @heros.Genji
  icon_url: "hero-icons/genji-shuriken.png"
  mousebutton: 'M2'
  type: "linear projectile/fixed pattern shotgun"
  velocity: 60#m
  pellets: 3
  damage: dpshot:  28
  spread:
    randomly_rotated: no
    constant_angles:[
      [-15, 0]
      [0, 0]
      [15, 0]
    ]
  ammo: 24/3
  fire_rate: 1#shots/sec
  reload_time: 1.5 #sec
, # Hanzo
  name: "Storm Bow"
  hero: @heros.Hanzo
  icon_url: "hero-icons/hanzo-bow.png"
  type: "arc projectile"
  velocity: 100#m/sec
  damage: dpshot:  125
  ammo: Infinity
  fire_rate: 1/(0.5+0.5)#sec
  charge_delay: 0.5#sec
  crit_factor: 2
, # Junkrat
  name: "Frag Launcher"
  hero: @heros.Junkrat
  icon_url: "hero-icons/junkrat-launcher.png"
  type: "arc projectile"
  velocity: 17.5#m/sec
  damage: dpshot:  120
  ammo: 5
  fire_rate: 5/3 #shots/sec
  reload_time: 1.5#sec
, # McCree M1
  name: "Peacekeeper"
  hero: @heros.McCree
  icon_url: "hero-icons/mccree-peacemaker.png"
  mousebutton: 'M1'
  type: "hitscan"
  damage:
    dpshot:  [70, 35]
    falloff: [22, 45]
  ammo: 6
  fire_rate: 2#shots/sec
  reload_time: 1.5 #sec
, # McCree M2
  name: "Fan the Hammer"
  hero: @heros.McCree
  icon_url: "hero-icons/mccree-peacemaker.png"
  mousebutton: 'M2'
  type: "hitscan"
  damage:
    dpshot:  [45, 13.5]
    falloff: [18, 30]
  spread: angle: 6.50
  crit_factor: 1
  ammo: 6
  fire_rate: 6.9 #shots/sec
  reload_time: 1.5 #sec
, # Mei M1
  name: "Endothermic Blaster"
  hero: @heros.Mei
  icon_url: "hero-icons/mei-blaster.png"
  mousebutton: 'M1'
  type: "beam"
  velocity: 20#m/sec
  damage:
    dpshot: 2.25
    max_range: 10#m
  fire_rate: 20#shots/sec
  ammo: 200
  reload_time: 1.5 #sec
, # Mei M2
  name: "Icicle"
  hero: @heros.Mei
  icon_url: "hero-icons/mei-blaster.png"
  mousebutton: 'M2'
  type: "linear projectile"
  velocity: 120#m/sec
  damage: dpshot: 75
  fire_rate: 1.2#shots/sec
  ammo: 10
  charge_delay: 0.4#sec
  reload_time: 1.5 #sec
, # Soldier
  name: "Pulse Rifle"
  hero: @heros.Soldier
  icon_url: "hero-icons/soldier-rifle.png"
  type: "hitscan"
  damage:
    dpshot:  [19, 9.5]
    falloff: [30, 55]
  spread:
    max_angle: 2.4
    spreading_ammo_range: [6, 9]
  ammo: 25
  fire_rate: 9 #shots/sec
  reload_time: 1.5 #sec
, # Pharah
  name: "Rocket Launcher"
  hero: @heros.Pharah
  icon_url: "hero-icons/pharah-launcher.png"
  shape: "rect"
  type: "projectile"
  velocity: 35#m/s
  damage: dpshot: 120
  crit_factor: 1
  ammo: 6
  fire_rate: 1/0.75#shots/sec
  reload_time: 1 #sec
, # Reaper
  name: "Hellfire Shotguns"
  hero: @heros.Reaper
  icon_url: "hero-icons/reaper-shotgun.png"
  type: "hitscan shotgun"
  pellets: 20
  damage:
    dpshot:  [ 7,  2]
    falloff: [11, 20]
  spread: angle: 20.1
  ammo: 8
  fire_rate: 2#shots/sec
  reload_time: 1.5 #sec
, # Sombra
  name: "Machine Pistol"
  hero: @heros.Sombra
  icon_url: "hero-icons/sombra-pistol.png"
  type: "hitscan"
  damage:
    dpshot:  [ 8,  2.4]
    falloff: [15, 25]
  spread:
    max_angle: 2.7
    spreading_ammo_range: [3, 6]  #CHECK
  ammo: 60
  fire_rate: 20#shots/sec
  reload_time: 1.5 #sec
, # Symmetra M1 
  name: "Photon Projector"
  hero: @heros.Symmetra
  icon_url: "hero-icons/symmetra-projector.png"
  mousebutton: 'M1'
  type: "beam"
  damage:
    dpshot: 60/7*1.75
    dps_factors: [1, 2, 3]
    level_charging_time: 2#sec
    max_range: 12#m
  fire_rate: 4 # 7 shots/sec to 4 hz ticks = factor 7/4=1.75
  ammo: 70 / 1.75
  reload_time: 1.8 #sec
, # Symmetra M2 ### CHECK thoroughly
  name: "Photon Orb" 
  hero: @heros.Symmetra
  icon_url: "hero-icons/symmetra-projector.png"
  mousebutton: 'M2'
  type: "projectile"
  velocity: 20#m/s
  damage: dpshot: 60  # 6-60
  fire_rate: 1/(1+1+0.063) # shots/sec  0.2-1 sec = 0.063
  charge_delay: 1+1#sec  
  ammo: 10  #1-10 rounds 70 total
  reload_time: 1.8 #sec
  crit_factor: 1
, # Torbjorn M1
  name: "Rivet Gun (primary)"
  hero: @heros.Torbjorn
  icon_url: "hero-icons/torbjorn-gun.png"
  mousebutton: 'M1'
  type: "arc projectile"
  velocity: 70#m/sec
  damage:
    dpshot: 70
  fire_rate: 1/0.6 #shots/sec
  ammo: 18
  reload_time: 2#sec
  crit_factor: 2
, # Torbjorn M2
  name: "Rivet Gun (secondary)"
  hero: @heros.Torbjorn
  icon_url: "hero-icons/torbjorn-gun.png"
  mousebutton: 'M2'
  type: "projectile shotgun"
  pellets: 10
  velocity: 80#m/sec
  damage:
    dpshot: [12.5,  3.75]
    falloff:[ 7,   20]
  spread:
    randomly_rotated: yes
    constant_angles: [
      [ 0.000,  0.362]
      [-0.644,  3.098]
      [ 3.219,  1.448]
      [ 2.012, -2.213]
      [-1.569, -2.977]
      [-3.460,  0.241]
      [-1.167, -1.247]
      [ 0.885, -1.127]
      [ 0.966,  0.805]
      [-1.167,  0.885]
    ]
  fire_rate: 1.25 #shots/sec
  ammo: 6
  reload_time: 2#sec
, # Torbjorn hammer
  name: "Forge Hammer"
  hero: @heros.Torbjorn
  icon_url: "hero-icons/torbjorn-hammer.png"
  type: "melee"
  damage:
    dpshot: 55
    max_range: 3#m  
  fire_rate: 1.25 #shots/sec
, # Tracer
  name: "Pulse Pistols"
  hero: @heros.Tracer
  icon_url: "hero-icons/sombra-pistol.png"
  type: "hitscan shotgun"
  pellets: 2
  damage:
    dpshot:  [6, 1.5]
    falloff: [11, 30]
  spread:
    max_angle: 3.6
    spreading_ammo_range: [3, 6]  #CHECK
  ammo: 20
  fire_rate: 20#shots/sec
  reload_time: 1.25 #sec
, # Widowmaker M1
  name: "Widow's Kiss: Assault"
  hero: @heros.Widowmaker
  icon_url: "hero-icons/widowmaker-rifle.png"
  mousebutton: 'M1'
  type: "hitscan"
  damage:
    dpshot:  [13, 6.5]
    falloff: [10, 30]  ## CHECK
  spread:
    max_angle: 3.0
    spreading_ammo_range: [3, 6]  #CHECK
  ammo: 30
  fire_rate: 10#shots/sec
  reload_time: 1.5 #sec
, # Widowmaker M2
  name: "Widow's Kiss: Sniper"
  hero: @heros.Widowmaker
  icon_url: "hero-icons/widowmaker-rifle.png"
  mousebutton: 'M2'
  type: "hitscan"
  damage: dpshot: 120
  ammo: 30/3
  fire_rate: 1/1.25#shots/sec
  charge_delay: 0.75#sec
  reload_time: 1.5 #sec
  crit_factor: 2.5
, # Ana M1
  name: "Biotic Rifle (primary)"
  hero: @heros.Ana
  icon_url: "hero-icons/ana-rifle.png"
  mousebutton: 'M1'
  type: "projectile EOT"
  velocity: 90#m/sec
  damage:
    dpshot: 70
    duration: 0.79#sec
    segments: 4
  ammo: 14
  fire_rate: 1.25#shots/sec
  reload_time: 1.5 #sec
  crit_factor: 1
, # Ana M2
  name: "Biotic Rifle (secondary)"
  hero: @heros.Ana
  icon_url: "hero-icons/ana-rifle.png"
  mousebutton: 'M2'
  type: "hitscan EOT"
  damage:
    dpshot: 70
    duration: 0.79#sec
    segments: 4
  ammo: 14
  fire_rate: 1.25#shots/sec
  reload_time: 1.5 #sec
  crit_factor: 1
, # Brigitte
  name: "Rocket Flail"
  hero: @heros.Brigitte
  icon_url: "hero-icons/brigitte-flail.png"
  type: "melee"
  damage:
    dpshot: 35
    max_range: 6#m
  fire_rate: 1/0.6#shots/sec
, # Lucio 
  name: "Sonic Amplifier"
  hero: @heros.Lucio
  icon_url: "hero-icons/lucio-amplifier.png"
  type: "linear projectile"
  velocity:   50#m/sec
  damage: dpshot: 20
  burst:
    ammo: 4
    delay: 0.124#s
  fire_rate: 1.07#burst/sec
  ammo: 20
  reload_time: 1.5#sec 
, # Mercy
  name: "Caduceus Blaster"
  hero: @heros.Mercy
  icon_url: "hero-icons/mercy-blaster.png"
  type: "linear projectile"
  velocity: 40#m/sec
  damage: dpshot: 20
  fire_rate: 5#shots/sec
  ammo: 20
  reload_time: 1.5#sec
, # Moira
  name: "Biotic Grasp"
  hero: @heros.Moira
  icon_url: "hero-icons/moira-grasp.png"
  type: "beam"
  damage:
    dpshot: 50
    max_range: 21#m
  fire_rate: 1#shots/sec
  ammo: 17
  reload_time: 0#sec
, # Zenyatta M1
  name: "Orb of Destruction"
  hero: @heros.Zenyatta
  icon_url: "hero-icons/zenyatta-orb.png"
  mousebutton: 'M1'
  type: "linear projectile"
  velocity: 80#m/sec
  damage: dpshot: 46
  fire_rate: 2.5#shots/sec
  ammo: 20
  reload_time: 2#sec
, # Zenyatta M2
  name: "Orb Volley"
  hero: @heros.Zenyatta
  icon_url: "hero-icons/zenyatta-orb.png"
  mousebutton: 'M2'
  type: "linear projectile"
  velocity: 80#m/sec
  damage: dpshot: 46
  burst:
    ammo: 5
    delay: 0.118#sec   #   CHECK
  charge_delay: 3.616#sec
  fire_rate: 1/4.67167#burst/sec
  ammo: 20
  reload_time: 2#sec
]

@weapon_dict = {}
for weapon, index in @weapons
  weapon.index = index
  @weapon_dict[weapon.name] = weapon

do(w = @weapon_dict['Photon Projector']) ->
  chtime = w.damage.level_charging_time
  levels = w.damage.dps_factors
  w.damage_factor_func = (ammo, t) ->
    n = Math.floor(t / chtime)
    console.log n
    if n >= levels.length
      n = levels.length-1
    levels[n]
  w.shot_time_func = (ammo, t) ->
    if t < (levels.length-1)*chtime
      consumed_ammo = chtime*@fire_rate
      [ammo - consumed_ammo, chtime, consumed_ammo]
    else
      [w.ammo, ammo*@shot_time + @reload_time, ammo]

do(w = @weapon_dict['Hand Cannon']) ->
  w.shot_time_func =
    (ammo) -> if ammo <= 1
        [1, @shot_time+@reload_time, 1]
      else [ammo-1, @shot_time, 1]

do(w = @weapon_dict['Scrap Gun (secondary)']) ->
  # falloff = ramp(w.damage.dpshot, w.damage.falloff)
  falloff = -> w.damage.dpshot
  w.basic_damage_func = 
    (distance) ->
      if distance < @damage.range_ball
        @damage.dpshot_ball
      else falloff(distance-@damage.range_ball)
  tan = degtan(w.spread.angle/2)
  w.make_radius_func = 
    (distance) ->
      if distance < @damage.range_ball
        return (ammo, t) -> 0
      radius = tan*(distance-@damage.range_ball)
      (ammo, t) -> radius
  w.pellets_func = (distance) ->
    if distance < @damage.range_ball
      @pellets[0]
    else
      @pellets[1]

for name in ['primary', 'secondary']
  do(w = @weapon_dict["Particle Cannon (#{name})"]) ->
    w.basic_damage_func = 
      (distance) ->
        if distance > @damage.max_range
          return 0
        @damage.dpshot * (1+@energy/100)

# do(w = @weapon_dict['Fan of Blades']) ->
#   w.make_shift_func = 
#     (distance) ->
#       radius = degtan(@spread.fixed_angle/2) * distance
#       (pellet) ->
#         radius * (pellet - 2)

for weapon in @weapons
  do(w=weapon) ->
    w.visible = yes
    w.idString = w.name.replace /[ \(\):\']/g, '-'
    if w.type == "arc projectile"
      w.damage.max_range = max_arc_range(w.velocity)
      w.crit_factor ?= 1
    if w.type.match /EOT/
      w.damage.dpshot /= w.damage.segments

    w.pellets ?= 1
    w.crit_factor ?= if w.type in ['melee', 'beam'] then 1 else 2
    w.ammo = Infinity if w.type is 'melee'
    w.shot_time ?= 1/w.fire_rate
    w.charge_delay ?= 0


    w.damage_factor_func ?= (ammo, t) -> 1
    w.basic_damage_func ?= switch
      when w.damage.falloff?
        func = ramp(w.damage.dpshot, w.damage.falloff)
        (distance) ->
          func(distance)
      when w.damage.max_range?
        (distance) ->
          (distance <= w.damage.max_range) * w.damage.dpshot
      else
        (distance) -> w.damage.dpshot

    w.shot_time_func ?= switch
      when w.type == 'beam'
        (ammo) ->
          [ @ammo,
            @ammo*@shot_time + @reload_time,
            @ammo ]
      when w.burst?
        (ammo) ->
          ammo -= 1
          delay = if (@ammo - ammo) % @burst.ammo is 0
            @shot_time - @burst.delay*(@burst.ammo-1)
          else @burst.delay
          if ammo == 0
            delay += @reload_time
            ammo = @ammo
          [ammo, delay, 1]
      else
        (ammo) ->
          if ammo <= 1
            [@ammo, @shot_time+@reload_time, 1]
          else [ammo-1, @shot_time, 1]

    w.make_radius_func ?= switch
      when w.spread?.angle?
        tan = degtan(w.spread.angle/2)
        (distance) ->
          radius = distance*tan
          (ammo, t) -> radius
      when w.spread?.max_angle?
        range = w.spread.spreading_ammo_range
        angle_rad_func = ramp([w.spread.max_angle/180*Math.PI, 0],
          [w.ammo-range[1], w.ammo-range[0]]) 
        (distance) ->
          (ammo, t) ->
            distance*Math.tan(angle_rad_func(ammo)/2)
      else
        (distance) ->
          (ammo, t) -> 0

    w.time_delay_func ?= switch 
      when w.type == 'arc projectile'
        (distance) ->
          sin = gravity_acc*distance/(@velocity*@velocity)
          sin = 1 if sin > 1
          phi = Math.asin(sin) / 2
          @charge_delay + distance / (@velocity*Math.cos(phi))
      when w.velocity?
        (distance) -> @charge_delay + distance / @velocity
      else (distance) -> @charge_delay

    w.make_shift_func ?= if w.spread?.constant_angles?
        unit_shifts = for as in w.spread.constant_angles
          uy = degcos(as[0])*degcos(as[1])
          # cz, and cx on distance 1
          cx = degsin(as[0])*degcos(as[1])/uy
          cz = degsin(as[1])/uy
          [cx, cz]
        (distance) ->
          shifts = for us in unit_shifts
            [us[0]*distance, us[1]*distance]
          (pellet) -> shifts[pellet-1]
      else (distance) -> (pellet) -> [0, 0]

    w.dps_period_base ?= w.shot_time
    if w.burst?
      w.dps_period_base = w.dps_period_base / w.burst.ammo

    w.dps_period_add ?= if w.ammo is Infinity
      0
    else w.reload_time/w.ammo


@modificator = do ->
  obj = {factor: 1}
  obj.mods = 
    armor:
      color: "#fac50e" #@heros.Torbjorn.color
      func: (dmg) -> if dmg > 10 then dmg-5 else dmg/2
    nanoboost_def:
      color: @heros.Ana.color
    damage_boost:
      color: @heros.Pharah.color
    supercharger:
      color: @heros.Orisa.color
    nanoboost_off:
      color: @heros.Ana.color
    discord:
      color: "#7b539c"

  obj.mod_list = []
  for name of obj.mods
    mod = obj.mods[name]
    mod.name = name
    mod.on = off
    obj.mod_list.push mod

  obj.refresh_factor = ->
    percent = 100
    percent += 30  if @mods.damage_boost.on
    percent += 50  if @mods.supercharger.on
    percent += 50  if @mods.nanoboost_off.on
    percent *= 1.3 if @mods.discord.on
    percent *= 0.5 if @mods.nanoboost_def.on
    @factor = percent / 100

  obj
