var fs = require('fs');
var path = require('path');

var colorguard = require('colorguard');
var Parker = require('parker/lib/Parker');

var sentinel = {
    report: function(filename) {
        var files = [];
        var css = fs.readFileSync(path.join(__dirname, filename), 'utf8');

        files.push(filename);

        return {
            files: files,
            tools: {
                backstopjs: {},
                colorguard: colorguard.inspect(css),
                parker: new Parker().run(css)
            }
        };
    }
};

module.exports = sentinel;
