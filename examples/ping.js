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
