var pinio = new (require('pinio')).Pinio()

pinio.on('ready', function(board) {

	var encoders = [

		// Encoder 1
		[1, 2],

		// Encoder 2
		[3, 4]
	]

	function setupEncoder(pins, idx) {
		console.log('Setting up encoder:', idx, pins)
		var encodeA = board.pins(pins[0])
		var encodeB = board.pins(pins[1])

		try {
			encodeA.mode('INPUT')
			encodeA.high()
			encodeB.mode('INPUT')
			encodeB.high()
		} catch(e) {
			console.log('Err ', e)
		}

		function gotDataA(val) {
			console.log('Encoder: ', idx, ' a: ', val)
		}

		function gotDataB(val) {
			console.log('Encoder: ', idx, ' b: ',  val)
		}

		encodeA.read(gotDataA)
		encodeB.read(gotDataB)
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

	var currSpeed = 100
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
