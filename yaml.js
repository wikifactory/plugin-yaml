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
    var getOverride = function(url) {
	return new Promise(function (resolve, reject) {
	    var xhttp = new XMLHttpRequest();
	    xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4) {
		    if (xhttp.status == 200) {
			resolve(xhttp.responseText);
		    } else {
			reject("No override found");
		    }
		}
	    };
	    xhttp.open("GET", url, true);
	    xhttp.send();
	});
    };

    var js = jsyaml.load(load.source);
    if (js.overrides) {
	if (!System.builder) {
	    // as hot-reloading tries to re-import the failed System import directly
	    // so we need to use an xmlhttprequest here instead of System.import.
	    return getOverride(System.map.overridesDir + '/' + js.overrides.slice(0, -1))
		.then(function(m) {
		    extend(js, jsyaml.load(m));
		    return 'module.exports = ' + JSON.stringify(js);
		})
		.catch(function(e) {
		    console.log("No override found for " + js.overrides);
		    return 'module.exports = ' + JSON.stringify(js);
		});
	} else {
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
    }
    return 'module.exports = ' + JSON.stringify(js);
}
