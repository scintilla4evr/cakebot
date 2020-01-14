# CakeBot

CakeBot is a rather odd, general-purpose bot that does all sorts of stuff. Not moderation though. Find a different one for that.

## Built-in commands

### Module: `Crypto`

This module provides basic encoding and decoding commands.

### Module: `Graphics`

This module provides image manipulation commands.

#### Channel separation - `$red`, `$green`, `$blue`, `$alpha`

Extracts a single channel from an image

### Module: `RNG`

This module provides RNG-related commands.

#### Die roll - `$roll`

Rolls an n-sided die.

Examples:
* `$roll 6`
* `$roll 10`

#### A random number - `$random`

Generates a random integer within a given range.

Examples:
* `$random`
* `$random 4 19`

#### The 8-ball - `$8ball`

Predicts the future using machine learning methods to quickly provide a yes/no answer to any given question.

Examples:
* `$8ball will my fav team win today`
* `$8ball is this feature useless`

The answer to the 2nd one is no.

### Module: `Number crunching`

This module provides math related commands.

#### Unit conversion - `$convert`

Converts between two units.

Examples:
* `$convert 10kg to lbs`
* `$convert 10 gigakelvin to celsius`
* `$convert 10mm to inches`

Some common unit conversions have their own commands:
* `$ftok 10` == `$convert 10 degrees fahrenheit to degrees celsius`
* `$mtoin 10` == `$convert 10 metres to inches`
* `$mtoin 10` == `$convert 10 meters to inches`

#### The Math Engine - `$math`

Performs calculations, solves equations.

Examples:
* `$math 2+2`
* `$math x+4=1`
* `$math sin(x^2) - cos(x) = x`