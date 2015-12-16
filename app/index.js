'use strict';

var generators = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');

//var memFs = require('mem-fs');
//var editor = require('mem-fs-editor');

//var store = memFs.create();
//var fs = editor.create(store);

var extendedBase = generators.Base.extend({
	// The name `constructor` is important here
	constructor: function () {
		
		// Calling the super constructor is important so our generator is correctly set up
		generators.Base.apply(this, arguments);

		// Next, add your custom code
		this.option('foundation'); // This method adds support for a `--foundation` flag
	},


	initializing: function () {
		this.pkg = require('../package.json');
		//this.appname = path.basename(process.cwd());
	},
	prompting: function () {
		var questions = [
			{
				type: 'input',
				name: 'name',
				message: "What's your project's name?",
				default: this.appname // Default to current folder name
			},
			{
				type: 'confirm',
				name: 'jquery',
				message: "Install jQuery?",
				default: true
			},
			{
				type: "list",
				name: 'css_framework',
				message: "Which CSS framework would you like to use?",
				choices: ["Bootstrap", "Foundation"],
				filter: function (val) { return val.toLowerCase(); }
			},
			{
				type: "list",
				name: 'test_framework',
				message: "which test framework would you like to use?",
				choices: ["jasmine", "mocha"],
				filter: function (val) { return val.toLowerCase(); }
			}
			/*,
			
			{
			when: 'css_framework.Bootstrap',
			type: 'confirm',
			name: 'blue',
			message: 'SASS LESS'
			}
			*/
		];


		var done = this.async();
		
		//var welcomeText = 'Welcome to '+chalk.bgRed('single page app quickstart')+' generator!';
		this.log(yosay('Welcome to SinglePageApp quickstart generator!'));

		this.prompt(questions,
			function (answers) {
				//console.log("answers: ",answers);
				//self.log(answers);
				this.log(answers);
				this.props = answers;
				done();
			}.bind(this));  //bind answers 'this' to this (generator)
			
		
		/*
		this.prompt({
			type: 'input',
			name: 'name',
			message: 'Your project name',
			default: this.appname // Default to current folder name
			// ,store   : true  //store the previous answer and use it as default in the future
		}, function (answers) {
			this.log(answers.name);
			done();
		}.bind(this));
		*/
	},
	configuring: function () {
		this.log("configuring");
	},
	default: function () {
		this.log("default");
	},
	writing: {
		init: function () {
			this.log("writing");
		},
		
		//write main.js to lib folder
		/*
		mainJS: function() {
			this.log("copy main.js");
			this.fs.copyTpl(
				this.templatePath('main.js'),
				this.destinationPath('lib/main.js'),
				{ title: 'Templating with Yeoman' }
				);
		},
		*/
		JSPM_Config: function () {
			this.fs.copyTpl(
				this.templatePath('config.js'),
				this.destinationPath('config.json'),
				{
					//vars/options here
				}
				);
		},

		packageJSON: function () {
			this.fs.copyTpl(
				this.templatePath('_package.json'),
				this.destinationPath('package.json'),
				{
					//vars/options here
				}
				);
		},
		
		h5bp: function () {
			this.fs.copy(
				this.templatePath('favicon.ico'),
				this.destinationPath('app/favicon.ico')
			);
		
				/*
			this.fs.copy(
				this.templatePath('apple-touch-icon.png'),
				this.destinationPath('app/apple-touch-icon.png')
			);
			*/
		
			this.fs.copy(
				this.templatePath('robots.txt'),
				this.destinationPath('app/robots.txt'));
			},
		
		//write index.html to the project root
		index: function () {
			this.log("copy index.html");
			this.fs.copyTpl(
				this.templatePath('index_empty.html'),
				//this.destinationPath('public/index.html'),
				this.destinationPath('app/index.html'),
				{
					title: 'Templating with Yeoman',
					/*
					appname: this.appname,
					includeSass: this.includeSass,
					includeBootstrap: this.includeBootstrap,
					includeModernizr: this.includeModernizr,
					includeJQuery: this.includeJQuery,
					bsPath: bsPath,
					bsPlugins: [
						'affix',
						'alert',
						'dropdown',
						'tooltip',
						'modal',
						'transition',
						'button',
						'popover',
						'carousel',
						'scrollspy',
						'collapse',
						'tab'
					]
					*/
				}
				);
		},
		
		//write gulpfile.js to the project root
		
		//TODO: generate spec files
		
		gulpfile: function () {
			this.log("copy gulpfile");
			this.fs.copyTpl(
				this.templatePath('gulpfile.babel.js'),
				this.destinationPath('gulpfile.babel.js'),
				{
					date: (new Date).toISOString().split('T')[0],
					name: this.pkg.name,
					version: this.pkg.version,
					includeSass: this.includeSass,
					includeBootstrap: this.includeBootstrap,
					testFramework: this.options['test-framework']
				}
				);
		},
		
		

		git: function () {
		this.fs.copy(
			this.templatePath('gitignore'),
			this.destinationPath('.gitignore'));
	
		this.fs.copy(
			this.templatePath('gitattributes'),
			this.destinationPath('.gitattributes'));
		},
		

	},
	conflicts: function () {
		this.log("conflicts");
	},
	install: function () {
		//run bower and npm install
		this.installDependencies({});
	},
	end: {
		showAnswers: function () {
			this.log("end");
			console.log("End , we have props: ", this.props);
		},
		

		/* instance functions, will not be called automatically */
		/*
				this.installinBootstrapSass = function () {
					this.npmInstall(['bootstrap-sass'], { 'save': true });
				};
				this.installingFoundation = function () {
					this.npmInstall(['foundation'], { 'save': true });
				};
		*/


		//first write, create file if not exists
		createMainJS: function() {
			this.conflicter.force = true;	
			this.fs.delete('lib/main.js');
		},
		
		installjQuery: function () {
			if (this.props.jquery) {
				this.log(chalk.yellow('Installing jquery'));
				this.spawnCommandSync('jspm', ['install', 'jquery']);
				
				//update main.js
				var mainJSContent = this.fs.read('lib/main.js');
				mainJSContent += "import jquery from 'jquery';\n";
				this.fs.write('lib/main.js', mainJSContent);	
			}
		},
		installBootstrapSass: function () {

			if (this.props.css_framework === 'bootstrap') {
				this.log(chalk.yellow('Installing Bootstrap-sass from npm'));
				//this.npmInstall(['bootstrap-sass'], { 'save': true });
				this.spawnCommandSync('jspm', ['install', 'npm:bootstrap-sass']);
				
				
				this.fs.copyTpl(
				this.templatePath('index_bootstrap.html'),
				//this.destinationPath('public/index.html'),
				this.destinationPath('app/index.html'),
				{
					title: 'Templating with Yeoman',
					/*
					appname: this.appname,
					includeSass: this.includeSass,
					includeBootstrap: this.includeBootstrap,
					includeModernizr: this.includeModernizr,
					includeJQuery: this.includeJQuery,
					bsPath: bsPath,
					bsPlugins: [
						'affix',
						'alert',
						'dropdown',
						'tooltip',
						'modal',
						'transition',
						'button',
						'popover',
						'carousel',
						'scrollspy',
						'collapse',
						'tab'
					]
					*/
				}
				);
				
				
				//update main.js
				var mainJSContent = this.fs.read('lib/main.js');
				mainJSContent += "import bootstrap from 'bootstrap-sass';\n";
				this.fs.write('lib/main.js', mainJSContent);	
			}
		},

		installFoundation: function () {

			if (this.props.css_framework === 'foundation') {
				this.log(chalk.yellow('Installing Foundation'));
				this.spawnCommandSync('jspm', ['install', 'foundation']);
				
				//update main.js
				var mainJSContent = this.fs.read('lib/main.js');
				mainJSContent += "import foundation from 'foundation';\n";
				this.fs.write('lib/main.js', mainJSContent);
			}
		},
		
		instalTestFramework: function() {
			switch (this.props.test_framework) {
				case 'jasmine':
					this.spawnCommandSync('jspm', ['install', 'npm:jasmine']);
					break;
					
				case 'mocha':
					this.spawnCommandSync('jspm', ['install', 'npm:mocha']);
					break;	
					
					//TODO: chai, karma, sinon, qUnit, protractor etc.
			}
		},	
	
		conflicterForceOff : function () {
			this.conflicter.force = false;
		}
	},
	priorityName: {
		method1: function () {
			//console.log('method 1 just ran');
		},
		method2: function () {
			//console.log('method 2 just ran');
		},
	},
	init: function () {
		this.helperMethod = function () {
			//console.log('won\'t be called automatically');
		};
	}
});

module.exports = extendedBase;
 