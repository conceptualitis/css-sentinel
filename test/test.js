var sentinel = require('..');
var fs = require('fs');

var filename = 'test/fixtures/simple.css';

describe('report', function () {
    var report = null;

    before(function () {
        report = sentinel.report(filename, {
            name: 'Test Report',
            format: 'json',
            output: './test/test-output.json'
        });
    });

    after(function () {
        fs.unlinkSync('./test/test-output.json');
    })

    it('should generate reports from three tools', function () {
        report.tools.should.be.an.Object;
        report.tools.colorguard.should.be.an.Object;
        report.tools.parker.should.be.an.Object;
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
});
