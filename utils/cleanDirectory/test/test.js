const moduleName = 'clean-directory';
const assert = require('assert');
const chai = require('chai');
const cleanDirectory = require('../');

const should = chai.should();
const expect = chai.expect;


describe('Array', () => {
  describe('#indexOf()', () => {
    it('should return -1 when the value is not present', () => {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

describe('Parameters errors', () => {
  it('throw : path must be given', async () => {
    let threw = false;
    try {
      await cleanDirectory();
    } catch (error) {
      threw = true;
    }
    expect(threw).equal(true);
  });

  it('throw : fist param must be a string', async () => {
    let threw = false;
    try {
      await cleanDirectory(2);
    } catch (error) {
      threw = true;
    }
    expect(threw).equal(true);
  });

  it('throw : second param must be a callback', async () => {
    let threw = false;
    try {
      await cleanDirectory('', '');
    } catch (error) {
      threw = true;
    }
    expect(threw).equal(true);
  });

  it('throw : third param must be a callback', async () => {
    let threw = false;
    try {
      await cleanDirectory('', () => { }, '');
    } catch (error) {
      threw = true;
    }
    expect(threw).equal(true);
  });
});

describe('clean the directory', () => {
  describe('clean without filter', () => {
    
  })
});