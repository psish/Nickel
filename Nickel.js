/*  
    Nickel.js
     ~ Nickel configuration file
       Part of Nickel.js

    @authors
        John Chavarria <m@psi.sh>
    @version 1.0
    @license LGPL v3.0 (http://www.gnu.org/licenses/lgpl.html)

    @copyright (c) 2010-2013, Authors.

*/

// Edit this configuration to import or configure Nickel assets.
this.Nickelconfig = {

	// Debug level: 3 all | 2 errors and warnings | 1 errors | 0 no debug.
	debug: 3,

	// Nickel Framework directory.
	directory: '../',

	// List of the assets that will be used.
	implement: [
		'template'	// NickelTemplate will be imported.
	],

	// Assets specific configuration.
	assets: {

		// NickelTemplate configuration.
		template: {
			directory: './tpl/',	// Templates directory location.
			extension: 'tpl.html'	// Templates extension format.
		}

	}

};





// Do not modify anything after this.





/*  
    NickelBase
     ~ Main file of Nickel Framework for Pokki
       Part of Nickel.js

    @authors
        John Chavarria <m@psi.sh>
    @version 1.0
    @license LGPL v3.0 (http://www.gnu.org/licenses/lgpl.html)

    @copyright (c) 2010-2013, Authors.

*/

(function() {

	window.addEventListener('load', function() {

		// Loading Nickel Framework.
		Nickel.load(Nickelconfig);
		delete this.Nickelconfig;

	}, true);

	this.Nickel = {

		// Basic Nickel Framework Configuration.
		configuration: {
			implement: new Array()
		},

		load: function load(config)
		{

			for (var key in config) {
				this.configuration[key] = config[key];
			}

			this.configuration.implement.push('extend');
			this.implement(this.configuration.implement);

		},

		implement: function implement(files)
		{

			if (typeof files == 'object') {
				for (var i = 0; i < files.length; i++) {
					this.implement(files[i])
				}
			} else {
				files 	= files.charAt(0).toUpperCase() +
						  files.substring(1, files.length).toLowerCase();

				var src = this.configuration.directory + 'Nickel' + files +
				          '/Nickel' + files + '.js';

				var script = document.createElement('script');
				script.setAttribute('src', src);
				document.head.appendChild(script);
			}

		},

		error: function error(asset, type, specific)
		{

			if (this.configuration.debug > 0) {
				specific = specific || false;

				if (specific) {
					switch(type) {
						case 'configuration':
							var code  = '000';
							var error =
							 'Missing asset configuration in Nickel.js';
							break;
					}
					var err = asset + ': Error ' + code + ' - ' + error;
				} else {
					var err = asset + ': Error - ' + type;
				}

				console.error(err);
			}

		},

	};

})();