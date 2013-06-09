var pinio = new (require('pinio')).Pinio()

pinio.on('ready', function(board) {

	var led = board.pins(11)
	led.output()
	led.high()

	setTimeout(function() {
		led.low()
	}, 2000)

})
