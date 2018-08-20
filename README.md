# Interactive Overwatch damage chart

Chart nicely presents how damage organized in time
for all heroes and weapons
and how the damage output changes at various conditions.
Only ‘shooting’ is considered,
not abilities (everything that has cooldown or
binds not to primary/secondary fire).

# Considered game mechanics

## Critical damage (headshots)
If pellet/bullet/projectile hits the head,
critical damage factor applies (except for heroes with no critical damage).
For most heroes, the factor is 2, for Widowmaker it is 2.5.

## Hitscan and projectiles

## Falloff damage

### Weapon spread
Some weapons have spread, i.e. the real direction of the shot
is different from the aim on 

### Spread widening (barrel heating)

### Shotgun spread
For shotgun weapons, the hit of a single pellet is considered.
Shot damage is calculated from the sum of pellet damages.

## Projectile velocities

## Arc projectiles
Aiming for arc projectiles is different from that in the game
in the sense that it adjusts automatically to hit (if it's possible)
the point marked by crosshair the prefect aim.
Velocity of the arc projectile also determines the maximum range.

## Wind-up / charging time

## Zarya's energy


# Physics and hitboxes

Unlike the game, there is no true 3D engine here:

- Enemy figures have flat and simple hitboxes (circular head and rectangular body).
- There is no floor, so no splash damage and no bouncing of projectiles.
- Despite the flatness of hitboxes,
the distance to the enemy is the same
for all the pellets in the spread.
- Projectile hitboxes are point-like (no flying logs from Hanzo).
- The previous also applies to melees and wide beams:
the size of the swing or the beam considered to be zero.

All of the above does not change
the qualitative behaviour of the shooting mechanics.


# Data references

The biggest chunk of data was taken from overwatch.gamepedia.com
- Hero colours
- Gravity constant
- Damage boost stacking
- Armor - defensive nanoboost stacking
- Details of bursts, spread widenings and other,
were analyzed from the recordings of tests in practice range.


# Technologies used

- d3.js
- coffeescript
- handlebars
- lodash
- tween
- dragdealer
- d3js-simple-slider
- google material-icons


# Fun facts

- Torbjorn is the only hero with 3 damaging weapon modes (primary, secondary, hammer melee).
- All damage boosts and amplificators can sum up to 2.99×
- Tracer's pistols are technically a shotgun weapon.
- Genji's Fan of Blades is also technically a shotgun (with the only constant pattern in game).
- Roadhog's secondary fire is the only one in the game with non-monotonously decreasing damage with distance.
- Prior to nerf, McCree's Peacekeeper had the simpliest mechanics possible:
hitscan, no spread, no falloff, no wind-up or charging.
- Tracer is the fastest to unload the magazine (1 second).
Orisa is the longest (11 seconds) among heros with finite ammo.
- Hanzo has maximal range (given target on the same height) of 1,111 meters.
The time of the arrow's flight here is 15.7 seconds
- Moira is the only truthiest “DPS” hero
(i.e. she is the only hero with constant damage per second)
- Torbjorn and Brigitte colours are practically the same. Also true for Reaper and Moira.
- Two Roadhogs separated by 50 m distance can kill each other with primary fire 
in just 21 minutes 10 seconds.

