/*
  YAML plugin
*/

var jsyaml = require('js-yaml');

var extend = `var extend = function (a, b) {
    for (var x in b) {
	if (Object.prototype.toString.call(a[x]) === '[object Object]') {
	    extend(a[x], b[x]);
	} else {
	    a[x] = b[x];
	}
    }
}`

exports.fetch = function(load, fetch) {
      return fetch(load).catch(function (e) {
        // if overrides file doesn't exist - fake it
        // auto-create the file here?
        return ""
      })
}

exports.translate = function (load) {
    // add overridesDir to System.map by changing config.js using something like:
    // builder.config({
    //   map: {
    //     overridesDir: 'sites/siteName'
    //   }
    // });
    var js;
    if (load.source.trim() === "") {
	     js = {}
    } else {
	     js = jsyaml.load(load.source);
    }
    if (js.overrides) {
      var importPath =  System.map.overridesDir + '/' + js.overrides;
      if (System.builder) {
        //importPath = System.baseURL + importPath;
      }
      var js = JSON.stringify(js);
      var ModuleStr = `import {conf as overrides} from '${importPath}';
	     ${extend};
	     var js = ${js};
       extend(js, overrides);
       export var conf = js;`
	    return ModuleStr
    }
    return "export var conf =" +  JSON.stringify(js);
}
