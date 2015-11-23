var folders = {
	app: 'app/',
	vendor: 'node_modules/',
	dist: 'build/'
};

var config = {
	test: function(){
		return config.dev.files.vendor.concat(config.dev.files.vendorMock, config.dev.files.scriptsTest);
	},
	deploy: function(){
		var files = [];
		files.push(config.folders.dist+config.dist.folders.scripts+config.dist.files.scripts);
		files.push(config.folders.dist+config.dist.folders.styles+config.dist.files.styles);
		files.push(config.folders.dist+config.dist.folders.vendor+config.dist.files.vendor);
		files.push(config.folders.dist+config.dist.folders.index+config.dist.files.index);
		files.push(config.folders.dist+config.dist.folders.views+'**/*.html');
		files.push(config.folders.dist+config.dist.folders.images+'**/*.{jpg,jpeg,png}');
		files.push(config.folders.dist+config.dist.folders.fonts+'**/*');
		
		return files;
	},
	folders: folders,
	dev:{
		folders: {
			scripts: folders.app+'scripts/',
			styles: folders.app+'styles/',
			views: folders.app+'scripts/',
			images: folders.app+'images/'
		},
		files: {
			scripts: [folders.app+'scripts/**/*.js', '!'+folders.app+'scripts/**/*.spec.js', folders.app+'main.js'],
			scriptsTest: [folders.app+'scripts/**/*.js', folders.app+'main.js'],
			scriptsMocks: [folders.app+'scripts/**/*.js', folders.app+'main.mock.js', folders.app+'scripts/**/*mock.js', '!'+folders.app+'scripts/**/*.spec.js'],
			tests: [folders.app+'scripts/**/*.spec.js'],
			sass: [
				folders.app+'styles/**/*.scss',
				folders.vendor+'foundation-sites/scss/foundation.scss',
				folders.vendor+'foundation-sites/scss/normalize.scss',
			],
      css: [folders.vendor+'fontawesome/css/font-awesome.min.css'],
      vendor: [
      	folders.vendor+'angular/angular.js',
				folders.vendor+'angular-sanitize/angular-sanitize.js',
				folders.vendor+'angular-route/angular-route.js'
        ],
      vendorMock: [
      	folders.vendor+'angular-mocks/angular-mocks.js'
      ],
    	views: [folders.app+'scripts/**/*.html'],
    	images: [folders.app+'images/**/*.{jpg,jpeg,png}'],
    	index: [
    		folders.app+'index.html'
    	]
		}
	},
	dist:{
		folders: {
			scripts: 'scripts/',
			mocks: 'mocks/',
			styles: 'styles/',
			fonts: 'fonts/',
			vendor: 'vendor/',
			views: 'views/',
			images: 'images/'
		},
		files: {
			scripts: 'scripts.js',
			mocks: 'mocks.js',
			styles: 'main.css',
			vendor: 'vendor.js',
			index: 'index.html'
		}
	},
	env: {
		isProduction: false
	}
}

module.exports = config;