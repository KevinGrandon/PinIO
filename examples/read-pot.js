var pinio = new (require('pinio')).Pinio()

pinio.on('ready', function(board) {
	var pot = board.pins('A0')
	pot.read(function(val) {
		console.log(val)
	})
})
