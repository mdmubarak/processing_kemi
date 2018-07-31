/*

dotArray = []
effectiveRadius = 0


# ---------- Dot ------------------------------------------------------ //

class Dot
  constructor: ->
    @position = createVector 0, 0
    @displaySize = 10
    @displayColor = color 255

    @targetPosition = createVector 0, 0
    @currentMoveFrameCount = 0
    @isMoving = false

    @relayPointRatio = 0
    @relayPointPosition = createVector 0, 0

    @startPointRatio = 0
    @startPointPosition = createVector 0, 0
    @endPointRatio = 0
    @endPointPosition = createVector 0, 0

  moveDurationFrameCount: 17

  setTarget: (x, y) ->
    if this.isMoving then @position.set @endPointPosition.x, @endPointPosition.y

    @targetPosition.set x, y;
    @currentMoveFrameCount = 0
    @isMoving = true
    displacementX = x - @position.x
    displacementY = y - @position.y

    if Math.random() < 0.5
      @relayPointRatio = abs(displacementX) / (abs(displacementX) + abs(displacementY))
      @relayPointPosition.set @position.x + displacementX, @position.y
    else
      @relayPointRatio = abs(displacementY) / (abs(displacementX) + abs(displacementY))
      @relayPointPosition.set @position.x, @position.y + displacementY

    return

  update: ->
    if this.isMoving
      @currentMoveFrameCount++
      @startPointRatio = @getStartPointRatio()
      @endPointRatio = @getEndPointRatio()

      if @startPointRatio < @relayPointRatio
        ratio = @startPointRatio / @relayPointRatio
        startPointX = @position.x + ratio * (@relayPointPosition.x - @position.x)
        startPointY = @position.y + ratio * (@relayPointPosition.y - @position.y)
      else
        ratio = (@startPointRatio - @relayPointRatio) / (1 - @relayPointRatio)
        startPointX = @relayPointPosition.x + ratio * (@targetPosition.x - @relayPointPosition.x)
        startPointY = @relayPointPosition.y + ratio * (@targetPosition.y - @relayPointPosition.y)
      @startPointPosition.set startPointX, startPointY

      if @endPointRatio < @relayPointRatio
        ratio = @endPointRatio / @relayPointRatio
        endPointX = @position.x + ratio * (@relayPointPosition.x - @position.x)
        endPointY = @position.y + ratio * (@relayPointPosition.y - @position.y)
      else
        ratio = (@endPointRatio - @relayPointRatio) / (1 - @relayPointRatio)
        endPointX = @relayPointPosition.x + ratio * (@targetPosition.x - @relayPointPosition.x)
        endPointY = @relayPointPosition.y + ratio * (@targetPosition.y - @relayPointPosition.y)
      @endPointPosition.set endPointX, endPointY

      if @currentMoveFrameCount >= @moveDurationFrameCount
        @position.set @targetPosition.x, @targetPosition.y
        this.isMoving = false

    return

  display: ->
    if this.isMoving
      strokeWeight @displaySize
      stroke @displayColor
      noFill()

      beginShape()
      vertex @startPointPosition.x, @startPointPosition.y
      vertex @relayPointPosition.x, @relayPointPosition.y if @startPointRatio < @relayPointRatio and @relayPointRatio < @endPointRatio
      vertex @endPointPosition.x, @endPointPosition.y
      endShape()
    else
      noStroke()
      fill @displayColor
      ellipse @position.x, @position.y, @displaySize, @displaySize
    return

  getMoveProgressRatio: ->
    min 1, @currentMoveFrameCount / @moveDurationFrameCount
  getStartPointRatio: ->
    -(@getMoveProgressRatio() - 1) ** 2 + 1
  getEndPointRatio: ->
    -(@getMoveProgressRatio() - 1) ** 4 + 1
  getDistance: (x, y) ->
    dist(x, y, @position.x, @position.y)


createRandomDot = ->
  newDot = new Dot()
  newDot.position = createVector random(width), random(height)
  newDot.displaySize = 4 * width / 640
  newDot.displayColor = createRandomColor 50, 100
  return newDot

createRandomColor = (saturationValue, brightnessValue) ->
  colorMode HSB
  newColor = color random(360), saturationValue, brightnessValue
  colorMode RGB
  return newColor



# ---------- Methods for controlling dots ------------------------------------------ //

processDots = (func, effectiveRadius, probability) ->
  for eachDot in dotArray
    continue if eachDot.isMoving
    continue unless Math.random() < probability
    func(eachDot, effectiveRadius)
  return

awayFromMouse = (dot, effectiveRadius) ->
  return unless dot.getDistance(mouseX, mouseY) < effectiveRadius
  dot.setTarget random(width), random(height)
  return

attractToMouse = (dot, effectiveRadius) ->
  distance = Math.random() * effectiveRadius
  angle = Math.random() * TWO_PI
  x = mouseX + distance * cos angle
  if x < 0 then x = -x
  else if x > width then x = width - (x - width)
  y = mouseY + distance * sin angle
  if y < 0 then y = -y
  else if y > height then y = height - (y - height)
  dot.setTarget x, y
  return



# ---------- Setup & Draw ------------------------------------------ //

setup = ->
  canvasSideLength = max(min(windowWidth, windowHeight) * 0.95, min(displayWidth, displayHeight) * 0.5)
  createCanvas canvasSideLength, canvasSideLength
  dotArray.push createRandomDot() for [0...150]
  effectiveRadius = 0.25 * width
  return

draw = ->
  blendMode BLEND
  background 0, 0, 40
  blendMode ADD
  for eachDot in dotArray
    eachDot.update()
    eachDot.display()
  if mouseIsPressed
    processDots(awayFromMouse, effectiveRadius, 1)
    processDots(attractToMouse, effectiveRadius, 0.001)
  else
    processDots(attractToMouse, effectiveRadius, 0.1)
  return

keyPressed = ->
  if key == 'P' then noLoop()
  return

keyReleased = ->
  if key == 'P' then `loop()`
  return

*/