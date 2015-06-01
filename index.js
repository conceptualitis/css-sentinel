var fs = require('fs');
var path = require('path');

var colorguard = require('colorguard');
var Parker = require('parker/lib/Parker');

var sentinel = {
    report: function(filename, options) {
        var files = [];
        var lastRun = new Date();
        var historyKey = lastRun.setHours(0, 0, 0, 0);
        var css = fs.readFileSync(path.join(__dirname, filename), 'utf8');
        var report = {
            files: files,
            lastRun: lastRun.getTime(),
            name: options.name || 'CSS Sentinel Report',
            history: {}
        };

        report.history[historyKey] = {
            colorguard: colorguard.inspect(css),
            parker: new Parker().run(css)
        };

        report.files.push(filename);

        if (options.output && options.format == 'json') {
            fs.writeFileSync(path.join(__dirname, options.output), JSON.stringify(report));
        }

        return report;
    }
};

module.exports = sentinel;
