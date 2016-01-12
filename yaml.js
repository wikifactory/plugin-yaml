/*
  YAML plugin
*/

var jsyaml = require('js-yaml');

var extend = function (a, b) {
    for (x in b) {
	if (Object.prototype.toString.call(a[x]) === '[object Object]') {
	    extend(a[x], b[x]);
	} else {
	    a[x] = b[x];
	}
    }
}

exports.translate = function (load) {
    // add overridesDir to System.map by changing config.js using something like:
    // builder.config({
    //   map: {
    //     overridesDir: 'sites/siteName'
    //   }
    // });
    var js = jsyaml.load(load.source);
    if (js.overrides) {
	return System.import("overridesDir/" + js.overrides)
	    .then(function(m) {
		extend(js, m);
		return 'module.exports = ' + JSON.stringify(js);
	    })
	    .catch(function(e) {
		console.log("No override found for " + js.overrides);
		return 'module.exports = ' + JSON.stringify(js);
	    });
    }
    return 'module.exports = ' + JSON.stringify(js);
}
