var pinio = new (require('pinio')).Pinio()

pinio.on('ready', function(board) {

	board.firmata.setMaxListeners(100)

	var movement = [0, 0]

	var encoders = [

		// Encoder 1
		[2, 3],

		// Encoder 2
		[11, 12]
	]

	function setupEncoder(pins, idx) {
		console.log('Setting up encoder:', idx, pins)
		var encodeA = board.pins(pins[0])
		var encodeB = board.pins(pins[1])

		function gotData(val) {
			movement[idx] += val
		}

		function startRead() {

			try {
				encodeA.mode('INPUT')
				encodeA.high()
				encodeB.mode('INPUT')
				encodeB.high()
			} catch(e) {
				console.log('Err ', e)
			}

			encodeA.read(gotData)
			encodeB.read(gotData)
		}
		startRead()
	}
	encoders.forEach(setupEncoder)

	setInterval(function() {
		console.log('Movement: ', movement)
	}, 300)
})
