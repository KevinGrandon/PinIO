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
