var fs = require('fs');
var path = require('path');

var colorguard = require('colorguard');
var Parker = require('parker/lib/Parker');
var metrics = require('parker/metrics/all');


var sentinel = {
    report: function(css, options) {
        var lastRun = new Date();
        var report = {
            history: options.history.history,
            lastRun: lastRun.getTime(),
            name: options.name || 'CSS Sentinel Report'
        };

        report.history.unshift({
            time: lastRun.getTime(),
            colorguard: colorguard.inspect(css),
            parker: new Parker(metrics).run(css)
        });

        report.summary = {
            collisionsTotal: report.history[0].colorguard.stats.total,
            collisionsColors: Object.keys(report.history[0].colorguard.stats.counts)
        }

        if (options.output) {
            if (options.format == 'json') {
                fs.writeFileSync(path.join(__dirname, options.output), JSON.stringify(report));
            }
            if (options.format == 'md') {
                fs.writeFileSync(path.join(__dirname, options.output), '#' + report.name + '\n');   
            }
        }

        return report;
    }
};

module.exports = sentinel;
