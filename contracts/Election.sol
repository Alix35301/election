pragma solidity >= 0.5.16;

contract Election {
    // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Read/write candidates
    mapping(uint => Candidate) public candidates;

    // to keep track of people who have voted; this stores there address
    mapping(address => bool) public voters;

    // Store Candidates Count
    uint public candidatesCount;

    constructor () public {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    function addCandidate (string memory _name) private {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    
    }


    function vote (uint  _candidateId) public   {
        // make sure that the perosn has not voted
        require(!voters[msg.sender]);

        // ensure valid candidate Id
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // record
        voters[msg.sender] = true;


        // update canidates vote

        candidates[_candidateId].voteCount += 1;

    }

}