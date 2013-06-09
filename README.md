# PinIO - Arduino pin management in javascript

This is a simple node.js library for controlling multiple arduino boards and groups of pins. This is intended to be a fairly low-level library that exposes a library which makes lower-level management of Arduino pins easier.

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
 	// "0" is stop,
 	// "90" is full speed forward, 
 	// "-90" is full speed backwards.
 	var servo = board.pins(8)

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

	function shiftWrite(value, mask) {
		clockPin.low()

		var method = value & mask ? 'high' : 'low'
		dataPin[method]()

    	clockPin.high()
	}

	function shiftOut() {
		for (mask = 128; mask > 0; mask = mask >> 1) {
			shiftWrite(counter, mask)
		}
	}

	var counter = 0
    function loop() {

		if (counter >= 256)
			return

		latchPin.low()
		
		shiftOut(counter)

		latchPin.high()

		counter++
		setTimeout(loop, 100)
	}

	loop()
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
