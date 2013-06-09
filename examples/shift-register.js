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
