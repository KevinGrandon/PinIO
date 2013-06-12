var util = require('util')
var events = require('events')

/**
 * A board class wraps the firmata object
 * The board class provides shortcuts for writing/reading data
 */
function Board(port, firmata) {
	this.port = port
	this.firmata = firmata
	var self = this

	this.Component = function(config) {
		return new Component(self, config)
	}
}

Board.prototype.pins = function() {
	var pins = Array.prototype.slice.call(arguments)
	return new this.Component({
		pins: pins
	})
}

exports.Board = Board


function Component(board, config) {
	this.board = board

	// Standardize config
	// Use array of pins
	if (config.pins && !Array.isArray(config.pins)) {
		config.pins = [config.pins]
	} else if(config.pin && !config.pins) {
		config.pins = [config.pin]
		delete config.pin
	}

	this.config = config
}
util.inherits(Component, events.EventEmitter)

Component.prototype.mode = function(mode, pins) {
	pins = pins || this.config.pins
	pins.forEach(function(pin) {
		this.board.firmata.pinMode(pin, this.board.firmata.MODES[mode])
	}.bind(this))
}

Component.prototype.output = function(pins) {
	this.mode('OUTPUT', pins)
}

Component.prototype.low = function(pins) {
	pins = pins || this.config.pins
	pins.forEach(function(pin) {
		this.board.firmata.digitalWrite(pin, this.board.firmata.LOW)
	}.bind(this))
}

Component.prototype.high = function(pins) {
	pins = pins || this.config.pins
	pins.forEach(function(pin) {
		this.board.firmata.digitalWrite(pin, this.board.firmata.HIGH)
	}.bind(this))
}

Component.prototype.pulse = function(value, pulseOut) {

	this.board.firmata.setMaxListeners(100)

	value = value || this.board.firmata.HIGH
	pulseOut = pulseOut || 5

	var settings = {
		pulseOut: pulseOut,
		value: value,
		pin: this.config.pins[0]
	}

	this.board.firmata.pulseIn(settings, function(duration) {
		this.emit('read', duration)
	}.bind(this))
}

Component.prototype.write = function(value) {
	this.board.firmata.analogWrite(this.config.pins[0], value)
}

Component.prototype.read = function(callback) {

	var pin = this.config.pins[0]

	var method = 'digitalRead'
	var mode = 'INPUT'

	// Analog case
	if (pin.length && pin.length > 1) {
		mode = 'ANALOG'
		method = 'analogRead'
		pin = pin.substring(1)
	} else {
		this.mode(mode)
	}

	this.board.firmata[method](pin, function( data ) {
		callback(data)
	})
}