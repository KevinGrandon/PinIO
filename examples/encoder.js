var pinio = new (require('pinio')).Pinio()

pinio.on('ready', function(board) {

	board.firmata.setMaxListeners(100)

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

		var totalA = 0 
		var totalB = 0 

		function gotDataA(val) {
			totalA += val
			//console.log('Encoder: ', idx, ' a: ', val, totalA)
		}

		function gotDataB(val) {
			totalB += val
			//console.log('Encoder: ', idx, ' b: ',  val, totalB)
		}

		setInterval(function() {
			console.log('Encoders: ', totalA, totalB)
		}, 300)

		function startRead() {

			try {
				encodeA.mode('INPUT')
				encodeA.high()
				encodeB.mode('INPUT')
				encodeB.high()
			} catch(e) {
				console.log('Err ', e)
			}

			encodeA.read(gotDataA)
			encodeB.read(gotDataB)
		}
		startRead()
	}
	encoders.forEach(setupEncoder)

	// Start the motors
	var motor1Speed = new board.Component({
		pin: 5
	})

	var motor2Speed = new board.Component({
		pin: 6
	})

	var motor1Dir = new board.Component({
		pin: 4
	})

	var motor2Dir = new board.Component({
		pin: 7
	})

	motor1Speed.mode('PWM')
	motor2Speed.mode('PWM')

	var currSpeed = 50
	var incSpeed = 10

	function go() {
		currSpeed += incSpeed

		if (currSpeed >= 250) {
			incSpeed = 0 - incSpeed
		}

		motor1Speed.write(currSpeed)
		motor2Speed.write(currSpeed)

		motor1Dir.high()
		motor2Dir.high()

		setTimeout(go, 1000)
	}

	setTimeout(function() {
		go()
	}, 1000)
})
