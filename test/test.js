var sentinel = require('..');
var fs = require('fs');

var filename = 'test/fixtures/simple.css';

describe('report', function () {
    var report = null;

    before(function () {
        report = sentinel.report(filename);
    });

    it('should generate reports from three tools', function () {
        report.tools.should.be.an.Object;
        report.tools.backstopjs.should.be.an.Object;
        report.tools.colorguard.should.be.an.Object;
        report.tools.parker.should.be.an.Object;
    });

    it('should generate an array of files inspected', function () {
        report.files.should.be.an.Array;
        report.files.should.containEql(filename);
    });
});
