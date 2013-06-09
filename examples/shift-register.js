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
