var pinio = new (require('pinio')).Pinio()

pinio.on('ready', function(board) {
	var control = board.pins(2)
	control.pwm(200)
})
