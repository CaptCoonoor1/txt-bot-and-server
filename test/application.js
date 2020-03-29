//Tests for the application component

//Dependencies
const assert = require('assert');
const application = require('../src/application');
const data = require('../src/data');


const input_nonexistent_discord = {
  mc_ign: 'The__TxT',
  discord_id: '293029505457586175', //Non existent discord_id, as we dont want to trigger the accept_worklow
  email_address: 'bogus@nonexistent.eu',
  country: 'Germany',
  birth_month: 2,
  birth_year: 2000,
  about_me: 'This got generated by automating testing',
  motivation: 'I just want to test if everything works properly',
  build_images: 'None, as Im a computer',
  publish_about_me: true,
  publish_age: true,
  publish_country: true,
  accept_privacy_policy: true,
  accept_rules: true
};

const input = {
  mc_ign: 'The__TxT',
  discord_id: '293029505457586176',
  email_address: 'bogus@nonexistent.eu',
  country: 'Germany',
  birth_month: 2,
  birth_year: 2000,
  about_me: 'This got generated by automating testing',
  motivation: 'I just want to test if everything works properly',
  build_images: 'None, as Im a computer',
  publish_about_me: true,
  publish_age: true,
  publish_country: true,
  accept_privacy_policy: true,
  accept_rules: true
};

describe('application', function() {
  beforeEach(function(done) {
    data.delete({}, 'application', false, (err) => {
      assert.ok(!err);
      done();
    });
  });


  //New application tests
  describe('new', function() {


    it('saves new application', function(done) {
      application.save(input, false, function(status, res) {
        assert.equal(status, 201);
        done();
      });
    });

    it('saves new application when the same discord account got denied already', function(done) {
      application.save(input, false, function(status, res) {
        application.save({id: 1, status: 2, reason: 'no'}, false, function(status, res) {
          application.save(input, false, function(status, res) {
            assert.equal(status, 201);
            done();
          });
        });
      });
    });

    it('dont save new application when discord account has a pending application', function(done) {
      application.save(input, false, function(status, res) {
        input.discord_id = '212826594123710464';
        application.save(input, false, function(status, res) {
          assert.notEqual(status, 201);
          done();
        });
      });
    });

    it('dont save new application when minecraft nick has a pending application', function(done) {
      application.save(input, false, function(status, res) {
        input.mc_ign = 'ExxPlore';
        application.save(input, false, function(status, res) {
          assert.notEqual(status, 201);
          done();
        });
      });
    });

    it('dont save new application when user has an accepted application', function(done) {
      application.save(input_nonexistent_discord, false, function(status, res) {
        application.save({id: 1, status: 3, reason: 'no'}, false, function(status, res) {
          application.save(input_nonexistent_discord, false, function(status, res) {
            assert.notEqual(status, 201);
            done();
          });
        });
      });
    });


  });

  //Read application tests
  describe('read', function() {

    beforeEach(function(done) {
      application.save(input_nonexistent_discord, false, function(a, b) {done()});
    });


    it('read all applications when no filter is given', function(done) {
      application.get(false, false, function(err, docs) {
        assert.ok(!err);
        assert.ok(docs.length > 0);
        done();
      });
    });

    it('read specific application by id', function(done) {
      application.get({id: 1}, {first: true}, function(err, doc) {
        assert.ok(!err);
        assert.ok(!Array.isArray(doc));
        done();
      });
    });

    it('read specific application by discord_id', function(done) {
      application.get({discord_id: '293029505457586175'}, {first: true}, function(err, doc) {
        assert.ok(!err);
        assert.ok(!Array.isArray(doc));
        done();
      });
    });

    it('read specific application by mc_uuid', function(done) {
      application.get({mc_uuid: 'dac25e44d1024f3b819978ed62d209a1'}, {first: true}, function(err, doc) {
        assert.ok(!err);
        assert.ok(!Array.isArray(doc));
        done();
      });
    });

    it('read specific application by id and without option first=true', function(done) {
      application.get({id: 1}, {first: false}, function(err, docs) {
        assert.ok(!err);
        assert.ok(Array.isArray(docs));
        assert.ok(docs.length == 1)
        done();
      });
    });


  });


  //Accept application tests
  describe('accept', function() {


    it('accepting an application saves the result properly', function(done) {
      application.save(input_nonexistent_discord, false, function(status, res) {
        application.save({id: 1, status: 3, reason: 'no'}, false, function(status, res) {
          application.get({id: 1}, {first: true}, function(err, doc) {
            assert.ok(!err);
            assert.ok(doc);
            assert.equal(doc.status, 3);
            done();
          });
        });
      });
    });

    it('accepting an application emits the event correctly', function(done) {
      application.save(input_nonexistent_discord, false, function(status, res) {
        application.save({id: 1, status: 3, reason: 'no'}, false, function(status, res) {});
      });

      emitter.once('application_accepted', done());
    });

    it('acceptWorkflow executes all neccessary steps', function(done) {
      done();
    });


  });



  //Deny application tests
  describe('deny', function() {

    beforeEach(function(done) {
      application.save(input_nonexistent_discord, false, function(a, b) {
        done();
      });
    });


    it('denying an application saves the result properly', function(done) {
      application.save({id: 1, status: 2, reason: 'no'}, false, function(status, res) {
        application.get({id: 1}, {first: true}, function(err, doc) {
          assert.ok(!err);
          assert.ok(doc);
          assert.equal(doc.status, 2);
          done();
        });
      });
    });

    it('denying an application emits the event correctly', function(done) {
      application.save({id: 1, status: 2, reason: 'no'}, false, function(status, res) {});
      emitter.once('application_denied', done());
    });


  });


});
