var os = require('os')
var util = require('util')
var events = require('events')
var child = require('child_process')
var Firmata = require('firmata')

var Board = require('./board.js').Board


// Find all USB ports
var rport = os.platform() === 'darwin' ? 'cu' : 'tty'
var grep = 'ls /dev | grep -iE \'usb|acm\' | grep -i ' + rport

function Pinio() {
	this._ports = []
	this._boards = {}
	process.nextTick(this.findBoards.bind(this))
}
util.inherits(Pinio, events.EventEmitter)

/**
 * Gets a board wrapper by index (0, 1), etc
 */
Pinio.prototype.get = function(index) {
	var port = this._ports[index]

	if (!port)
		console.error('Could not find port at index: ', index)

	if (!this._boards['/dev/' + port])
		console.error('Could not find board for: ', port)

	var board = this._boards['/dev/' + port]
	return board
}

/**
 * Finds all connected boards
 */
Pinio.prototype.findBoards = function() {
	child.exec(grep, function( err, stdout, stderr ) {
		var ports = stdout.slice( 0, -1 ).split("\n")

		// If no ports are detected when scanning /dev/, then there is
		// nothing left to do and we can safely exit the program
		if (!ports || !ports.length || ports[0] == '') {
			// Alert user that no devices were detected
			console.warn('No USB devices detected')

			// Exit the program by sending SIGABRT
			process.exit(3)
		}

		// Now initialize firmata for each board
		// Users can access the raw firmata values at: pinio
		this._ports = ports
		this.initBoards()

	}.bind(this))
}

/**
 * Initialzes connected boards with firmata
 */
Pinio.prototype.initBoards = function() {
	var pending = this._ports.length
	var self = this

	function initSingleBoard(board) {
		var firmataLib = new Firmata.Board(board, function (error) {
			if (error)
				console.log('Error initializing board: ', error)

			self._boards[board] = new Board(board, firmataLib)
			console.log('Instantiated board on:', board)
			next()
		})
	}

	for (var i = 0, board; board = this._ports[i]; i++) {
		board = '/dev/' + board
		console.log('Trying to initialize board: ', board)
		initSingleBoard(board)
	}

	function next() {
		if (!(--pending)) {
			var args = ['ready']
			for ( var i in self._boards) {
				args.push(self._boards[i])
			}
			self.emit.apply(self, args)
		}
	}
}

Pinio.prototype.convertPingToDistance = function(distance, unit) {
	unit = unit || 'inches'

	if (unit == 'cm')
		return +(distance / 29 / 2).toFixed(3)

	return +(distance / 74 / 2).toFixed(2)
}

exports.Pinio = Pinio