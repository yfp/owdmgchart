#### templates

htmlToElement = (html) ->
  template = document.createElement('template')
  template.innerHTML = html.trim()
  template.content.firstChild

Handlebars.registerHelper 'ceilRound', (number) -> 2*Math.ceil(number/2)

Handlebars.registerPartial 'heroWeapon',
  d3.select('#hero-weapon-template').html()
hero_weapon_template = Handlebars.compile("{{> heroWeapon}}")
row_template = Handlebars.compile(
  d3.select('#row-template').html() )
hero_selection_template = Handlebars.compile(
  d3.select('#hero-selection-template').html() )

#### timescales constants

timescale = 60 # px/sec
max_time = 17.5 # sec
chart_padding_left = 15 # px
chart_padding_right = 0 # px
chart_width = max_time*timescale + chart_padding_left + chart_padding_right
timeScale = d3.scaleLinear()
    .domain([0, max_time])
    .range([chart_padding_left, chart_width])
timescale = do ->
  range = timeScale.range()
  domain = timeScale.domain()
  (range[1] - range[0]) / (domain[1] - domain[0])

timeAxis = d3.axisTop(timeScale)
            .ticks(20)

d3.select("svg.timeScale")
    .style 'min-width', chart_width
    .style 'max-width', chart_width
    .attr 'viewBox', "0 -30 #{chart_width} 30"
  .append("g")
    .call(timeAxis)
  .append 'text'
    .text 'time'
    .attrs 
      fill: "#000"
      y: -9
      x: chart_padding_left+timescale/2
      # 'text-anchor': 'start'    


areascale = 2 # px^2 / hp
radians = Math.PI/180

formatNumber = (num, d=1) ->
  if Math.abs(Math.round(num) - num) < 0.01
    d3.format('d')(num)
  else d3.format(".#{d}f")(num)


#### Enemy shooting

#constants
CRIT = 2
HIT  = 1
MISS = 0
basicCursorHeight = 1#m

#global
multiplier = 1
crosshair = {x:0, z: 1.0, distance: 5.0}

class HitBox
  registerHit: -> no
  appendElement: (g) -> g

class RectHitBox extends HitBox
  constructor: (cx, cz, width, height) ->
    super()
    @x1 = cx - width/2
    @x2 = cx + width/2
    @z1 = cz - height/2
    @z2 = cz + height/2
  registerHit: (p) ->
    @x1 <= p.x and p.x <= @x2 and @z1 <= p.z and p.z <= @z2
  appendElement: (g) ->
    g.append('rect').attrs
      x: @x1
      y: basicCursorHeight-@z2
      width:  @x2 - @x1
      height: @z2 - @z1

class CircleHitBox extends HitBox
  constructor: (@x, @z, @radius) ->
    super()
    @radius_squared = @radius*@radius
  registerHit: (p) ->
    dx = p.x - @x
    dz = p.z - @z
    dx*dx + dz*dz <= @radius_squared
  appendElement: (g) ->
    g.append('circle').attrs
      cx: @x
      cy: basicCursorHeight-@z
      r: @radius

class Enemy
  constructor: (@image, @body, @head) ->
  registerHit: (point) ->
    switch
      when @head.registerHit(point) then CRIT
      when @body.registerHit(point) then HIT
      else MISS
  shoot: (crosshair, radius=0, shift_x=0, shift_z=0) ->
    cx = cz = 0
    if radius > 0 
      phi = 2*Math.PI*Math.random()
      r = radius*Math.random()
      cx = r*Math.cos(phi)
      cz = r*Math.sin(phi)
    x = crosshair.x + cx + shift_x
    z = crosshair.z + cz + shift_z
    @registerHit({x:x, z:z})

enemy_Roadhog = do() ->
  body_width = 1.4
  body_height = 2.1
  head_height = 2.0
  head_width = 0.6
  new Enemy(
    {
      url: "images/roadhog_figure_lighter.png"
      dims:
        width: 858
        height:873
      x: 1.55
      y: 1.6
      height: 3.3
    },
    new RectHitBox(0, body_height/2, body_width, body_height),
    new CircleHitBox(0, head_height, head_width/2)
  )    

# ht = 2.21
# basicRectangle = new RectHitBox(0,ht/2,2,ht)
enemy = enemy_Roadhog
HOG_HP = 600

class WeaponData
  total_time = 1.2*max_time
  # draw_time = 1.2*max_time

  constructor: (@weapon) ->
    @order = @weapon.index + 1
    shot_spacing = timescale * (@weapon.burst?.delay or @weapon.shot_time)
    @filling = @weapon.filling or 0.5
    @is_beam = @weapon.type is "beam"
    @color = @weapon.hero.color
    @segments_factor = (@weapon.damage.segments or 1)

    unless @is_beam
      @max_shot_width = shot_spacing * @filling
      @max_square_dmg = @max_shot_width*@max_shot_width / areascale

  refresh_distance: (enemy, crosshair) ->
    @set_distance(crosshair.distance)
    @init_shots()
    @simulate_shot_outcomes(enemy, crosshair)
    @calculate_shots_damage()

  refresh_crosshair: (enemy, crosshair) ->
    @simulate_shot_outcomes(enemy, crosshair)
    @calculate_shots_damage()

  set_distance: (distance) ->
    @distance = distance
    @pellets     = if @weapon.pellets_func?
        @weapon.pellets_func(distance)
      else @weapon.pellets
    @basic_dmg   = @weapon.basic_damage_func(distance)
    @radius_func = @weapon.make_radius_func(distance)
    @time_delay  = @weapon.time_delay_func(distance)
    @shift_func  = @weapon.make_shift_func(distance)

  init_shots: ->
    t = 0
    @shots = []
    ammo = @weapon.ammo
    total_dmg = 0
    while t < total_time
      shot = {radius: @radius_func(ammo, t)}
      [ammo, dt, ammo_consumed] = @weapon.shot_time_func(ammo, t)
      shot.t = t + @time_delay
      shot.wdata = @
      if ammo_consumed > 1
        shot.ammo_mult = ammo_consumed
      if @weapon.type is "beam"
        shot.duration = @weapon.shot_time * ammo_consumed
      if @weapon.hero.name is 'Ana'
        shot.duration = @weapon.damage.duration
      @shots.push shot
      t += dt

  simulate_shot_outcomes: (enemy, crosshair) ->
    total_outcomes = [0,0,0]
    for shot in @shots
      outcomes = [0,0,0]
      if @weapon.spread?.randomly_rotated
        random_angle = 2*Math.PI*Math.random()
        SIN = Math.sin(random_angle)
        COS = Math.cos(random_angle)
      else
        SIN = 0
        COS = 1
      for i in [1..@pellets]
        shift = @shift_func(i) 
        hit_outcome = enemy.shoot(crosshair, shot.radius,
          COS*shift[0]-SIN*shift[1], COS*shift[1]+SIN*shift[0])
        outcomes[hit_outcome] += 1
      if @weapon.crit_factor is 1
        outcomes[HIT] += outcomes[CRIT]
        outcomes[CRIT] = 0
      shot.outcomes = outcomes
      total_outcomes[MISS] += outcomes[MISS]
      total_outcomes[HIT ] += outcomes[HIT ]
      total_outcomes[CRIT] += outcomes[CRIT]
    total = total_outcomes[MISS] + total_outcomes[HIT ] + total_outcomes[CRIT]
    @outcomes = (o/total for o in total_outcomes)

  calculate_shots_damage: ->
    @height = 0
    @hit_dmg = @basic_dmg*modificator.factor
    @crit_dmg = @hit_dmg * @weapon.crit_factor
    if modificator.mods.armor.on
      for key in ['hit_dmg', 'crit_dmg']
        @[key] = modificator.mods.armor.func @[key]
    total_dmg = 0
    @rhkt = undefined
    for shot, index in @shots
      shot.damage = (shot.outcomes[HIT ] * @hit_dmg + 
                     shot.outcomes[CRIT] * @crit_dmg) * @segments_factor
      h = @shot_dimensions(shot)
      total_dmg += shot.damage
      if total_dmg >= HOG_HP
        @rhkt ?= shot.t + if shot.duration?
          shot.duration*(HOG_HP+shot.damage-total_dmg)/shot.damage
        else 0
      @height = h if h > @height
    last_shot = @shots[@shots.length-1]
    time = last_shot.t
    if last_shot.duration?
      time += last_shot.duration
    
    @dps_raw = total_dmg / time
    mean_damage = ( @hit_dmg  * @outcomes[HIT] +
                    @crit_dmg * @outcomes[CRIT] ) * @pellets * @segments_factor
    @dps_wort = mean_damage / @weapon.dps_period_base
    @dps = mean_damage / (@weapon.dps_period_base+@weapon.dps_period_add)
    @rhkt ?= if @dps > 0
      HOG_HP / @dps
    else Infinity
    

    @height = 2*Math.ceil(@height/2)

  shot_dimensions: (shot) ->
    if shot.damage > @max_square_dmg
      shot.width = @max_shot_width
      shot.height = areascale * shot.damage / shot.width
    else
      shot.width = Math.sqrt(areascale * shot.damage)
      shot.height = shot.width
    shot.height

class BeamWeaponData extends WeaponData
  shot_dimensions: (shot) ->
    shot.damage *= shot.duration * @weapon.fire_rate
    shot.dps = shot.damage / shot.duration
    shot.height = shot.dps * areascale / timescale
    #beam mech

class BioticRifleWeaponData extends WeaponData
  shot_dimensions: (shot) ->
    dps = shot.damage / shot.duration
    shot.height = dps * areascale / timescale
    #beam mech

class PhotonProjectorWeaponData extends BeamWeaponData
  calculate_shots_damage: ->
    @height = 30
    @hit_dmg = @basic_dmg * modificator.factor
    @dmg_levels = []
    for factor in @weapon.damage.dps_factors
      @dmg_levels.push @hit_dmg*factor
    if modificator.mods.armor.on
      @dmg_levels = (modificator.mods.armor.func(dmg) for dmg in @dmg_levels)
    total_dmg = 0
    @rhkt = undefined
    for shot, index in @shots
      basic_dmg = if index >= @dmg_levels.length
        @dmg_levels[@dmg_levels.length-1]
      else @dmg_levels[index]
      shot.damage = shot.outcomes[HIT] * basic_dmg
      h = @shot_dimensions(shot)
      total_dmg += shot.damage
      @rhkt ?= if total_dmg >= HOG_HP
        shot.t + (total_dmg - HOG_HP)/shot.damage*shot.duration
      @height = h if h > @height
    last_shot = @shots[@shots.length-1]
    time = last_shot.t + last_shot.duration
    @dps_raw = total_dmg / time

    mean_damage = @outcomes[HIT] * @dmg_levels[@dmg_levels.length-1]
    @dps_wort = mean_damage / @weapon.dps_period_base
    @dps = mean_damage / (@weapon.dps_period_base+@weapon.dps_period_add)
    @height = 2*Math.ceil(@height/2)

# info string 
info_string = do ->
  percent_str = (val) ->
    str = (100*val).toFixed(1)
    str = switch str
      when '0.0' then '0'
      when '100.0' then '100'
      else str
    "#{str}%"

  info_string = 
    current: 0
    variants: [
      name: 'dps'
      text: 'Mean DPS'
      func: (wdata) -> wdata.dps?.toFixed(1)
    ,
      name: 'dps_wort'
      text: 'Mean DPS w/o reload'
      func: (wdata) -> wdata.dps_wort?.toFixed(1)
    ,
      name: 'acc'
      text: 'Accuracy'
      func: (wdata) ->
        acc = wdata.outcomes[HIT]+wdata.outcomes[CRIT]
        percent_str acc
    ,
      name: 'crit_acc'
      text: 'Crit accur.'
      func: (wdata) ->
        if wdata.weapon.crit_factor is 1
          'n/a'
        else
          acc = wdata.outcomes[CRIT]
          percent_str acc
    ,
      name: 'rhkt'
      text: 'Kill time'
      func: (wdata) ->
        if wdata.rhkt is Infinity
          "∞"
        else
          "#{wdata.rhkt?.toFixed(1)}s"

    ]
    cv: -> @variants[@current]
    text: (wdata) ->
      @cv().func(wdata)
    increment: ->
      @current += 1
      @current = @current % @variants.length
    update_rows: ->
      hero_rows.rows
        .select('.info-string')
        .text (wdata) -> info_string.text(wdata)
      hero_filter.reloadOrder()

  d3.select('.nav-toggle-info')
    .on 'click', ->
      info_string.increment()
      info_string.update_rows()
      str = info_string.cv().text
      d3.select(@).select('a').text str

  info_string

chart = d3.select(".chart")
state_data = do -> #weapons, enemy, distance, crosshair 
  list = []
  for weapon in weapons
    wdata = switch
      when weapon.name is 'Photon Projector'
        new PhotonProjectorWeaponData(weapon)
      when weapon.type is 'beam'
        new BeamWeaponData(weapon)
      when weapon.type.match /EOT/
        new BioticRifleWeaponData(weapon)
      else
        new WeaponData(weapon)
    wdata.refresh_distance(enemy, crosshair)
    list.push(wdata)

  # state object
  list: list
  shot_attrs:
    height: (shot) -> shot.height
    y: (shot) -> - shot.height/2
    x: (shot) ->
      shift_x = if shot.duration? then 0 else shot.width/2
      timeScale(shot.t) - shift_x
    width: (shot) ->
      if shot.duration?
        shot.duration * timescale
      else shot.width
  refresh_distance: (enemy, crosshair) ->
    for wdata in @list
      wdata.refresh_distance(enemy, crosshair)
    @update_damage()
  refresh_crosshair: (enemy, crosshair) ->
    for wdata in @list
      wdata.refresh_crosshair(enemy, crosshair)
    @update_damage()
  update_row_heights: (rows) ->
    rows.style 'min-height', (wdata) ->
      h = if wdata.weapon.visible
        4+Math.max 46, wdata.height
      else 0 
      "#{h}px"
  update_damage: (update='all') ->
    if update is 'all'
      row_selector = 'div.row'
      update_list = @list
    else
      row_selector = 'div#'+update.idString
      update_list = [@list[update.index]]

    for wdata in update_list
      wdata.calculate_shots_damage()

    rows = chart.selectAll(row_selector)
    @update_row_heights rows
    rows.select '.info-string'
      .text (wdata) -> info_string.text(wdata)
    hero_filter.reloadOrder()
    svgs = rows.select('svg')
    svgs.selectAll('rect.shot')
        .data (wdata) -> wdata.shots
      .transition().duration(100)
      .attrs @shot_attrs
    
# init hero rows
hero_rows = do -> # state_data
  rows = chart.selectAll("div.row")
      .data(state_data.list)
    .enter().append (wdata) ->
      htmlToElement(row_template(wdata))

  rows.select '.info-string'
    .text (wdata) -> info_string.text(wdata)

  tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)

  svgs  = rows.select('svg')
    .style 'min-width', chart_width
    .style 'max-width', chart_width
    .attrs
      viewBox: "0 -100 #{chart_width} 200"

  shots = svgs.selectAll('rect.shot')
      .data (wdata) -> wdata.shots
    .enter().append('rect')
      .classed 'shot', yes
      .attrs state_data.shot_attrs
      .attr 'fill', (shot) -> shot.wdata.color
      .on "mouseover", (d) ->
          tooltip.transition().duration(200)
            .style("opacity", .9)
          [num, units] = if d.dps?
            [d.dps, "dps"]
          else
            [d.damage, "hp"]
          tooltip.html("#{formatNumber(num, 2)} #{units}")
            .style("left", "#{d3.event.pageX}px")
            .style("top", "#{d3.event.pageY - 28}px")
       .on "mouseout", (d) ->
         tooltip.transition()
           .duration(500)
           .style("opacity", 0)
  rows:  rows
  svgs:  svgs
  shots: shots

# hero filterting
hero_filter = do () ->
  hero_filter = init_order: yes
  hero_selection_el = d3.select('.hero-selection-row')
  hero_selection_el.display = "none"
  toggleSelect = d3.selectAll('.nav-toggle-select')
    .on "click", ->
      toggle = not toggleSelect.classed('nav-selected')
      toggleSelect.classed 'nav-selected', toggle
      if toggle
        hero_selection_el.classed 'hidden-row', not toggle
        h = hero_selection_el.style 'height'
        hero_selection_el.style 'height', "0px"
        hero_selection_el
          .transition().duration(100)
          .style 'height', h
      else
        h = hero_selection_el.style 'height'
        hero_selection_el.style 'height', h
        hero_selection_el
          .transition().duration(100)
          .style 'height', "0px"
      setTimeout( ->
        h = hero_selection_el.style 'height'
        hero_selection_el.style 'height', undefined
        if h is '0px'
          hero_selection_el.classed 'hidden-row', yes
      , 2000)

  toggleSort = d3.selectAll('.nav-toggle-sort')
    .on 'click', ->
      hero_filter.init_order = not hero_filter.init_order
      hero_filter.reloadOrder()
      toggleSort.classed 'nav-selected', not toggleSort.classed('nav-selected')

  sel_weapons = d3.select('.hero-selection').selectAll('div')
      .data(weapons)
    .enter().append (weapon) ->
      htmlToElement hero_selection_template(weapon)
    .on 'click', (weapon) ->
      weapon.visible = not weapon.visible
      hero_filter.reloadVisibility([weapon])

  hero_filter.reloadVisibility = (weapons = sel_weapons)->
    sel_weapons
      .style 'background-color', (weapon) ->
        if weapon.visible
          weapon.hero.color
        else 'initial'
      .classed 'inverse', (weapon) -> not weapon.visible
    hero_rows.rows
      .style 'opacity', (wdata) ->
        if wdata.weapon.visible then 1 else 0
      .style 'order', (wdata)->wdata.order
    state_data.update_row_heights hero_rows.rows

  hero_rows.rows
    .each (wdata) ->
      TweenLite.set @, y: 0
      wdata.tween_box = 
        transform: @._gsTransform
        x: @.offsetLeft
        y: @.offsetTop
        node: @

  sort_by_field = (field) ->
    local_f = switch field
      when 'dps' then (d) -> d.dps
      when 'dps_wort' then (d) -> d.dps_wort
      when 'acc' then (d) -> d.outcomes[HIT]+d.outcomes[CRIT]
      when 'crit_acc' then (d) -> d.outcomes[CRIT]
      when 'rhkt' then (d) -> -d.rhkt
      else (d) -> -d.weapon.index
    (a, b) ->
      A = local_f(a.wdata)
      B = local_f(b.wdata)
      return  1 if A < B
      return -1 if A > B
      return a.idx - b.idx

  ease  = Power1.easeInOut
  hero_filter.reloadOrder = () ->
    changed = if hero_filter.init_order
      ch = false
      _.each state_data.list, (wdata) ->
        ch or= wdata.order isnt (wdata.weapon.index + 1)
        wdata.order = wdata.weapon.index + 1
      ch
    else
      sort_arr = _.map state_data.list, (wdata, idx)->
        {idx:wdata.order, wdata:wdata}
      sort_arr.sort sort_by_field(info_string.cv().name)
      ch = false
      _.each sort_arr, (d, idx) ->
        ch or= idx isnt d.idx
        d.wdata.order = idx
      ch
    if changed
      hero_rows.rows
        .style 'order', (wdata) -> wdata.order
        .each (wdata) ->
          box   = wdata.tween_box
          lastX = box.x
          lastY = box.y
          
          box.x = box.node.offsetLeft
          box.y = box.node.offsetTop
          
          #Continue if box hasn't moved
          if lastX is box.x and lastY is box.y
            return
          
          #Reversed delta values taking into account current transforms
          x = box.transform.x + lastX - box.x;
          y = box.transform.y + lastY - box.y;  
          
          #Tween to 0 to remove the transforms
          TweenLite.fromTo(
            box.node, 0.5,
            { x, y },
            { x: 0, y: 0, ease }
          )

  d3.select('.select-all')
    .on 'click', =>
      for weapon in @weapons
        weapon.visible = yes
      hero_filter.reloadVisibility()
  d3.select('.select-none')
    .on 'click', ->
      for weapon in weapons
        weapon.visible = no
      hero_filter.reloadVisibility()

  d3.selectAll('.select-by-role')
    .on 'click', ->
      role = d3.select(@).attr 'data-role'
      for weapon in weapons
        weapon.visible = (weapon.hero.role is role)
      hero_filter.reloadVisibility()

  d3.selectAll('.select-by-weapon')
    .on 'click', ->
      wtype = d3.select(@).attr 'data-weapon'
      for weapon in weapons
        weapon.visible = _.includes(weapon.type, wtype)
      hero_filter.reloadVisibility()

  hero_filter

# state_data.update_damage()
hero_filter.reloadVisibility()

# distance slider
do -> #enemy, crosshair, state_data
  local_update_dist = no
  update_distance = (val, update_slider=no, update_input=no) ->
    crosshair.distance = switch
      when isNaN(val) then 5
      when val < 0.1 then 0.1
      else val
    viewport.setscale(crosshair.distance)
    viewport.updateDummyFigure()
    state_data.refresh_distance(enemy, crosshair)
    if update_input
      slider.input.property 'value', crosshair.distance.toFixed(2)
    if update_slider
      local_update_dist = yes
      slider.slider.value crosshair.distance
      local_update_dist = no

  # slider
  slider = do ->
    input = d3.select('.distance-panel input')
      .attr 'value', crosshair.distance
      .on 'change', ->
        val = parseFloat input.property('value')
        update_distance(val, yes, no)

    slider = d3.sliderHorizontal()
        .min(0)
        .max(50)
        .width(295)
        .tickFormat(d3.format('.1f'))
        .ticks(6)
        .default(crosshair.distance)
        .on 'onchange', _.throttle(
          (val) ->
            unless local_update_dist
              update_distance(val, no, yes)
        , 25, leading: no)

    g = d3.select("div#distance-slider").append("svg")
        .attr("width", 400)
        .attr("height", 50)
        .append("g")
        .attr("transform", "translate(20,10)")
    g.call(slider)

    slider: slider
    input: input

  # enemy viewport
  viewport = do -> #enemy
    start_time = 0
    events_cnt = 0
    dragstarted = (d) ->
      start_time = Date.now()
      events_cnt = 0
      d3.select(@).raise().classed("dragging", yes)

    throttle_refresh_crosshair = _.throttle(
      (enemy, crosshair) ->
        viewport.update_crosshair(crosshair)
        state_data.refresh_crosshair(enemy, crosshair)
    , 100, leading: yes)
    throttle_update_position = _.throttle(
      ->
        viewport.updateDummyFigure()
    , 16, leading: yes)

    dragged = (d) ->
      d.x += d3.event.dx
      d.y += d3.event.dy
      throttle_update_position()
      # throttle_refresh_crosshair(enemy, crosshair)

    dragended = (d) ->
      throttle_refresh_crosshair(enemy, crosshair)
      d3.select(@).classed("dragging", no)

    viewport =
      x: 0
      y: 0
      scale: 1
      createTransformString: ->
        "translate(#{@x} #{@y}) scale(#{@scale})"
      setscale: (distance) ->
        @x /= @scale
        @y /= @scale
        @scale = 1.0 / distance / radians
        @x *= @scale
        @y *= @scale
      update_crosshair: (crosshair) ->
        crosshair.z = basicCursorHeight + @y/@scale
        crosshair.x = @x/@scale
      updateDummyFigure: ->
        dummyFigure.attr 'transform', (d) -> d.createTransformString()

    viewport.setscale(crosshair.distance)


    drag = d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
    dummyFigure = d3.select('svg.figure_chart g.figure')
      .data([viewport])
      .call(drag)
    
    viewport.updateDummyFigure()

    setEnemyFigure = () ->
      dummyFigure.select('image')
        .attrs
          x: -enemy.image.x
          y: -enemy.image.height + enemy.image.y
          height: enemy.image.height
          width: enemy.image.height * enemy.image.dims.width / enemy.image.dims.height
          'xlink:href': enemy.image.url
      enemy.body
        .appendElement( dummyFigure )
        .classed 'figure_body', yes
      enemy.head
        .appendElement( dummyFigure )
        .classed 'figure_head', yes
      # basicRectangle
      #   .appendElement(dummyFigure)
      #   .styles
      #     fill: "none"
      #     "stroke-width": 0.05
      #     stroke: "rgb(0,255,0)"
    setEnemyFigure()
    viewport

# modificators
do ->
  set_multiplier_string = ->
    str = "#{@modificator.factor}×"
    if modificator.mods.armor.on
      str += " – armor"
    d3.select('.mod-result').text str

  d3.select('.modificators')
    .selectAll('.hero-ability-icon-bg')
      .data(modificator.mod_list)
    .classed 'inverse', on
    .style 'background-color', 'transparent'
    .on 'click', (m) ->
      m.on = not m.on
      d3.select(@)
        .classed 'inverse', not m.on
        .style 'background-color', if m.on then m.color else 'transparent'
      modificator.refresh_factor()
      set_multiplier_string()
      state_data.update_damage()

# zarya energy sliders
do (weapon_dict = weapon_dict) ->
  d3.selectAll('.hero-slider')
    .each ->
      new Dragdealer @,
        animationCallback: (x, y) ->
          energy = Math.round(x * 100)
          el = d3.select(@wrapper)
          el.select('.handle')
            .text(energy)
          name = el.attr('data-weapon-name')
          weapon = weapon_dict[name]
          weapon.energy = energy
          wdata = state_data.list[weapon.index]
          wdata.set_distance(crosshair.distance) 
          state_data.update_damage(weapon)

# plot data calculations

# download_file = (data, filename, type="text/plain") ->
#     file = new Blob([data], {type: type})
#     if (window.navigator.msSaveOrOpenBlob)
#         window.navigator.msSaveOrOpenBlob(file, filename)
#     else
#         a = document.createElement("a")
#         url = URL.createObjectURL(file)
#         a.href = url
#         a.download = filename
#         document.body.appendChild(a)
#         a.click()
#         setTimeout( ->
#             document.body.removeChild(a)
#             window.URL.revokeObjectURL(url)
#         , 0)

# do -> 
#   d = 0.1
#   texts = []
#   while d <= 50.1
#   # do ->
#     crosshair = {x:0, z: 2.0, distance: d}
#     for wdata in state_data.list
#       wdata.refresh_distance(enemy, crosshair)
#     nums = [d].concat(wdata.dps for wdata in state_data.list)
#     texts.push nums.join("\t")
#     console.log(d)
#     d+=0.1
#   data = texts.join("\n")
#   download_file data, "data.txt"

# do -> 
#   texts = []
#   for wdata in state_data.list
#     fields = [wdata.weapon.hero.name,
#               wdata.weapon.hero.color,
#               wdata.weapon.name ]
#     texts.push fields.join("\t")
#   data = texts.join("\n")
#   download_file data, "legend.txt"

