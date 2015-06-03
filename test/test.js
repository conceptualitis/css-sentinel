var sentinel = require('..');
var fs = require('fs');

var filename = '../test/fixtures/simple.css';

describe('new report', function () {
    var report = null;

    before(function () {
        report = sentinel.report(filename, {
            name: 'Test Report',
            format: 'json',
            output: '../test/test-output.json'
        });

        mdReport = sentinel.report(filename, {
            name: 'Test Report',
            format: 'md',
            output: '../test/test-output.md'
        });
    });

    after(function () {
        fs.unlinkSync('./test/test-output.json');
        fs.unlinkSync('./test/test-output.md');
    })

    it('should contain a last run date', function () {
        report.lastRun.should.be.a.Number;
    });

    it('should generate reports from two tools', function () {
        var key = new Date(report.lastRun).setHours(0, 0, 0, 0);

        report.history.should.be.an.Object;

        report.history[key].colorguard.should.be.an.Object;
        report.history[key].colorguard.should.not.be.empty;

        report.history[key].parker.should.be.an.Object;
        report.history[key].parker.should.not.be.empty;
    });

    it('should generate an array of files inspected', function () {
        report.files.should.be.an.Array;
        report.files.should.containEql(filename);
    });

    it('should allow customization of the report name', function () {
        report.name.should.be.a.String;
        report.name.should.equal('Test Report');
    });

    it('should generate an output file if asked to', function () {
        fs.existsSync('./test/test-output.json').should.be.true;
    });

    it('should generate a markdown file if asked to', function () {
        fs.existsSync('./test/test-output.md').should.be.true;
    });
});
