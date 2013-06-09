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
