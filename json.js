/*
  YAML plugin
*/

var jsyaml = require("js-yaml"),

exports.translate = function(load) {
  return 'module.exports = ' + jsyaml.load(load.source);
}
