# PinIO - Arduino pin management in javascript

This is a simple node.js library for controlling multiple arduino boards and groups of pins. This is intended to be a fairly low-level library that exposes an API which makes lower-level management of Arduino pins easier.

### Beginners

Beginners with arduino would be better off looking at the excellent Johnny-Five Library: https://github.com/rwldrn/johnny-five. This library will abstract away a lot of pain points of dealing with pesky bits.

### Installation

```
npm install pinio
```

#### Turning a LED on and off



```
var pinio = new (require('pinio')).Pinio()

pinio.on('ready', function(board) {

	var led = board.pins(11)
	led.output()
	led.high()

	setTimeout(function() {
		led.low()
	}, 2000)

})

```
#### Managing multiple boards



```
var pinio = new (require('pinio')).Pinio()

pinio.on('ready', function(first, second) {

	function turnOn(board, pin) {
		var led = board.pins(11)

		led.output()
		led.high()

		setTimeout(function() {
			led.low()
		}, 2000)
	}

	// Turn on an LED connected to the first board on port 11
	turnOn(first, 11)

	// Turn on an LED connected to the second board on port 10
	turnOn(second, 10)
})

```
#### Ping distance sensor



```
var pinio = new (require('pinio')).Pinio()

pinio.on('ready', function(board) {
	var ping = board.pins(13)

	setInterval(function() {
		ping.pulse()
	}, 500)

	ping.on('read', function(distance) {
		console.log('Distance is:', distance)
	})
})

```
#### Continuous Rotation Servo

The best way to position a continuous rotation servo is to set it to stopped, servo.write(90), then adjust the potentiometer until the servo no longer moves.

```
var pinio = new (require('pinio')).Pinio()

pinio.on('ready', function(board) {
	// "0" is full speed backwards.
	// "90" is stop,
	// "180" is full speed forward, 
	// TODO: I would like to make this -90, 0, 90

	var servo = board.pins(9)

	servo.mode('SERVO')

	var incrementer = 10
	var current = 90

	function setPosition() {
		servo.write(current)
		current += incrementer

		if (current >= 180 || current == 0)
			incrementer = 0 - incrementer

		setTimeout(setPosition, 500)
	}
	setPosition()

})

```
#### Shift Register

This example will implement a binary counter with 8 LEDs connected to a shift register on pins 2, 3, 4.

```
var pinio = new (require('pinio')).Pinio()

pinio.on('ready', function(board) {

	var dataPin = board.pins(2)
	var latchPin = board.pins(3)
	var clockPin = board.pins(4)

	dataPin.output()
	latchPin.output()
	clockPin.output()

	function shiftOut(clockPin, dataPin, value) {
		for (var mask = 128; mask > 0; mask = mask >> 1) {
			clockPin.low()
			dataPin[ value & mask ? 'high' : 'low' ]()
			clockPin.high()
		}
	}

	var counter = 0
    function loop() {

		if (counter >= 256)
			return

		latchPin.low()
		
		shiftOut(clockPin, dataPin, counter)

		latchPin.high()

		counter++
		setTimeout(loop, 100)
	}

	loop()
})

```
#### Encoder

Detecting motor speed with an encoder.

```
var pinio = new (require('pinio')).Pinio()

pinio.on('ready', function(board) {

	var encoders = [

		// Encoder 1
		[1, 2],

		// Encoder 2
		[3, 4]
	]

	function setupEncoder(pins, idx) {
		console.log('Setting up encoder:', idx, pins)
		var encodeA = board.pins(pins[0])
		var encodeB = board.pins(pins[1])

		try {
			encodeA.mode('INPUT')
			encodeA.high()
			encodeB.mode('INPUT')
			encodeB.high()
		} catch(e) {
			console.log('Err ', e)
		}

		function gotDataA(val) {
			console.log('Encoder: ', idx, ' a: ', val)
		}

		function gotDataB(val) {
			console.log('Encoder: ', idx, ' b: ',  val)
		}

		encodeA.read(gotDataA)
		encodeB.read(gotDataB)
	}
	encoders.forEach(setupEncoder)

	// Start the motors
	var motor1Speed = new board.Component({
		pin: 5
	})

	var motor2Speed = new board.Component({
		pin: 6
	})

	var motor1Dir = new board.Component({
		pin: 4
	})

	var motor2Dir = new board.Component({
		pin: 7
	})

	motor1Speed.mode('PWM')
	motor2Speed.mode('PWM')

	var currSpeed = 100
	var incSpeed = 10

	function go() {
		currSpeed += incSpeed

		if (currSpeed >= 250) {
			incSpeed = 0 - incSpeed
		}

		motor1Speed.write(currSpeed)
		motor2Speed.write(currSpeed)

		motor1Dir.high()
		motor2Dir.high()

		setTimeout(go, 1000)
	}

	setTimeout(function() {
		go()
	}, 1000)
})

```


### Board API

After initialization, the ready event will be fired with several board objects. A board object may create a pin wrapper with the following commands:

```
var myLed = board.pins(12)
var myGroup = board.pins(8, 9)
```

### Pin API

Each pin group has shortcut methods.

* pin.output() - Sets the pin to output mode
* pin.high() - digital high
* pin.low() - digital low
* pin.pulse() - for things like IR sensors
* pin.write() - analog signals
