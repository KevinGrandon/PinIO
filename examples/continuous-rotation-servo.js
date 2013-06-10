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
