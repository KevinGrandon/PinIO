/**
 * This file builds the examples in the README
 * Usage: node build.js
 */

var examples = [
	{
		title: 'Turning a LED on and off',
		file: 'led-toggle.js'
	},
	{
		title: 'Managing multiple boards',
		file: 'two-boards.js'
	},
	{
		title: 'Ping distance sensor',
		file: 'ping.js'
	},
	{
		title: 'Continuous Rotation Servo',
		file: 'continuous-rotation-servo.js',
		description: 'The best way to position a continuous rotation servo is to set it to stopped, servo.write(90), then adjust the potentiometer until the servo no longer moves.'
	},
	{
		title: 'Shift Register',
		file: 'shift-register.js',
		description: 'This example will implement a binary counter with 8 LEDs connected to a shift register on pins 2, 3, 4.'
	}	
]

console.log('Building readme example content.')

var exampleTemplate = "#### <<title>>\n\
\n\
<<description>>\n\
\n\
```\n\
<<content>>\n\
```\n"

var fs = require('fs')
var exampleContent = ''

examples.forEach(function(example) {

	example.description = example.description || ''

	var content = fs.readFileSync(__dirname + '/examples/' + example.file, {encoding: 'utf-8'})
	exampleContent += exampleTemplate
		.replace('<<content>>', content)
		.replace('<<title>>', example.title)
		.replace('<<description>>', example.description)
})

var readmeContent =  fs.readFileSync(__dirname + '/readme.template', {encoding: 'utf-8'})
readmeContent = readmeContent.replace('<<examples>>', exampleContent)

fs.writeFileSync(__dirname + '/README.md', readmeContent, {encoding: 'utf-8'})

console.log('All done!')
