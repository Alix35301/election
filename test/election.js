var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts) {
  var electionInstance;

  it("initializes with two candidates", function() {
    return Election.deployed().then(function(instance) {
      return instance.candidatesCount();
    }).then(function(count) {
      assert.equal(count, 2);
    });
  });

  it("it initializes the candidates with the correct values", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidates(1);
    }).then(function(candidate) {
      assert.equal(candidate[0], 1, "contains the correct id");
      assert.equal(candidate[1], "Candidate 1", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return electionInstance.candidates(2);
    }).then(function(candidate) {
      assert.equal(candidate[0], 2, "contains the correct id");
      assert.equal(candidate[1], "Candidate 2", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
    });
  });

  it("allows a voter to cast a vote", function() {
    return Election.deployed().then(async function(instance) {
      electionInstance = instance;
      candidateId = 1;
      return await electionInstance.vote(candidateId, { from: accounts[0] });
    }).then(async function(receipt) {
      return await electionInstance.voters(accounts[0]);
    }).then(async function(voted) {
      assert(voted, "the voter was marked as voted");
      return await electionInstance.candidates(candidateId);
    }).then(async function(candidate) {
      var voteCount = candidate[2];
      assert.equal(voteCount, 1, "increments the candidate's vote count");
    })
  });


  it("throws an exception for invalid candidates", function() {
    return Election.deployed().then(async function(instance) {
      electionInstance = instance;
      return await electionInstance.vote(99, { from: accounts[1] })
    }).then(assert.fail).catch(async function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return await electionInstance.candidates(1);
    }).then(async function(candidate1) {
      var voteCount = candidate1[2];
      assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
      return electionInstance.candidates(2);
    }).then(async function(candidate2) {
      var voteCount = candidate2[2];
      assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
    });
  });

  it("throws an exception for double voting", ()=>{
    return Election.deployed().then(async (instance)=>{
      electionInstance = instance;
      candidateId = 2;
     await electionInstance.vote(candidateId, { from: accounts[1] })
     .then(async (res)=>{
        // console.log(res);
        return await electionInstance.candidates(candidateId);
      }).then(async (candidate)=>{
        var voteCount = candidate[2];
        assert.equal(voteCount, 1, "accepts first vote");
        return await electionInstance.vote(candidateId, { from: accounts[1] });
      }).then(assert.fail).catch(async (error)=>{
        assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
        return await electionInstance.candidates(1);
      }).then(async (candidate1)=>{
        var voteCount = candidate1[2];
        assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
        return await electionInstance.candidates(2);
      }).then((candidate2)=>{
        var voteCount = candidate2[2];
        assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
      })

    })
  })

});