var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var colorguard = require('colorguard');
var Parker = require('parker/lib/Parker');
var metrics = require('parker/metrics/all');


var summarize = function (report) {
    var parkerKeys = ['total-stylesheets', 'total-stylesheet-size', 'total-rules', 'selectors-per-rule',
                      'total-selectors', 'identifiers-per-selector', 'specificity-per-selector', 'top-selector-specificity',
                      'total-id-selectors', 'total-identifiers', 'total-declarations', 'total-unique-colours',
                      'total-important-keywords', 'total-media-queries'];
    
    var summary = _.pick(report.parker, parkerKeys);
    summary['total-collisions'] = report.colorguard.stats.total,
    summary['color-collisions'] = Object.keys(report.colorguard.stats.counts);

    return summary;
};

var sentinel = {
    report: function(css, options) {
        var lastRun = new Date();
        var report = {
            history: options.history.history,
            lastRun: lastRun.getTime(),
            name: options.name || 'CSS Sentinel Report'
        };
        var mdReport = '#' + report.name + '\n';

        report.history.unshift({
            time: lastRun.getTime(),
            colorguard: colorguard.inspect(css),
            parker: new Parker(metrics).run(css)
        });

        report.summary = summarize(report.history[0]);

        if (options.output) {
            if (options.format == 'json') {
                fs.writeFileSync(path.join(__dirname, options.output), JSON.stringify(report));
            }
            if (options.format == 'md') {
                mdReport += Object.keys(report.summary).map(function (key) {
                    return '- ' + key + ': ' + report.summary[key];
                }).join('\n');
                fs.writeFileSync(path.join(__dirname, options.output), mdReport);   
            }
        }

        return report;
    }
};

module.exports = sentinel;
