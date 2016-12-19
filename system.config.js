/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  // map tells the System loader where to look for things
  var map = {
    // our app is within the app folder
    'app'                                 :'dist/app',
    // angular bundles
    '@angular/core'                       :'dist/lib/core',
    '@angular/common'                     :'dist/lib/common',
    '@angular/compiler'                   :'dist/lib/compiler',
    '@angular/platform-browser'           :'dist/lib/platform-browser',
    '@angular/platform-browser-dynamic'   :'dist/lib/platform-browser-dynamic',
    '@angular/http'                       :'dist/lib/http',
    '@angular/router'                     :'dist/lib/router',
    '@angular/forms'                      :'dist/lib/forms',
    // other libraries
    'symbol-observable'                   :'dist/lib',
    'rxjs'                                :'dist/lib',
    'angular2-in-memory-web-api'          :'dist/lib/angular2-in-memory-web-api'
  };

  var packages = {
    'app':                              { main: './main.js', defaultExtension: 'js' },
    'rxjs':                             { defaultExtension: 'js' },
    'angular2-in-memory-web-api':       { main: './index.js', defaultExtension: 'js' },
    'symbol-observable':                { defaultExtension: 'js' }
  };

  var packageNames = [
    '@angular/core',
    '@angular/common',
    '@angular/compiler',
    '@angular/platform-browser',
    '@angular/platform-browser-dynamic',
    '@angular/http',
    '@angular/router',
    '@angular/forms',
    // other libraries
    'symbol-observable',
    'rxjs',
    'angular2-in-memory-web-api'
  ];

  // add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
  packageNames.forEach(function(pkgName) {
      packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
  });

  var config = {
      map: map,
      packages: packages,
  };

  if (global.filterSystemConfig) { global.filterSystemConfig(config); }

  System.config(config);
})(this);
