pragma solidity 0.5.0;

import {Graph} from './DataHandler.sol';
import {Ownable} from './Ownable.sol';

contract CaseHandler is Ownable, Graph {
  Case[] public cases;
  Data[] public data;
  mapping (uint32 => address) caseToAddress;
  mapping (address => uint32) caseCount;  // TODO INCREMENT THIS

  struct Case {
    uint id;
    CaseStatus status;
    mapping (bytes32 => Data) dataMapping;
    //mapping (uint => Data[]) extraDatas;
  }

  struct Data {
    bytes32 name;
    bytes32 dataHash;
    uint32 dbLocation;
    uint32 caseID;
    /* DataType dataType; */
    Status status;
  }

  /* event Resolution(Data data); */
  enum CaseStatus { ACTIVE, COMPLAINT, OLD }
  enum Status { UNDONE, DONE, MARKED, PENDING }


  modifier onlyOwnerOf(uint32 _caseID) {
    require(isOwner() || caseToAddress[_caseID] == msg.sender);
    _;
  }


  function addCase(address user) external onlyOwner {
    // if case exist, throw error
    uint32 idx = uint32(cases.length);
    cases.push(Case(idx, CaseStatus.ACTIVE));
    caseToAddress[idx] = user;
    caseCount[user]++;
  }

  function casesLength() public view onlyOwner returns (uint) {
    return cases.length;
  }

  function getCases(address user) public view returns (uint32[] memory) {
    require(isOwner() || msg.sender == user);
    uint32[] memory res = new uint32[](caseCount[user]);
    uint32 counter = 0;

    for(uint32 i = 0; i < caseCount[user]; i++){
      if (caseToAddress[i] == user){
        res[counter] = i;
        counter++;
      }
    }
    return res;
  }

  function addressFromCase(uint32 caseID) public view onlyOwnerOf(caseID) returns(address) {
    return caseToAddress[caseID];
  }

  function fillData(bytes32 _title, uint32 _caseID, bytes32 _dataHash, uint32 _dbLocation) public onlyOwner {
     /* TODO require at dataHash ikke er tom? */
    require(_caseID >= 0 && _caseID <= cases.length);
    cases[_caseID].dataMapping[_title] = Data(_title, _dataHash, _dbLocation, _caseID, Status.DONE);
  }

  /* function update(uint32 dataID, bytes32 _dataHash, uint32 _dbLocation) public onlyOwnerOf(data[dataID].caseID) {
    data[dataID].dbLocation = _dbLocation;
    data[dataID].dataHash = _dataHash;
  } */


  function getActions(uint caseID) public view returns (bytes32[] memory) {
    /* TODO if case doesnt exist, throw error */
    bytes32[] memory toDo = new bytes32[](vxs.length);
    uint count = 0;

    for (uint v = 0; v < vxs.length; v++) {
      if(_isReady(v, cases[caseID])) {
        toDo[count] = vxs[v].title;
        count++;
      }
    }

    return _cut(toDo, count);
  }

  function _isReady(uint v, Case storage c) private view returns (bool) {
    // if v doesnt exist, throw error
    if (c.dataMapping[vxs[v].title].status == Status.DONE) return false;
    for(uint j = 0; j < req[v].length; j++) {
      uint reqIdx = req[v][j];
      if (c.dataMapping[vxs[reqIdx].title].status != Status.DONE) return false;
    }

    return true;
  }

  function markData(bytes32 _title, uint _caseID) public {
    /* TODO EXPLANATION AS PARAMETER */

    cases[_caseID].dataMapping[_title].status = Status.MARKED;
    _cascade(_title, _caseID);
  }

  function _cascade(bytes32 _title, uint caseID) private {
    for (uint i = 0; i < adj[_getIdx(_title)].length; i++) {
      uint adjIdx = adj[_getIdx(_title)][i];
      if (cases[caseID].dataMapping[vxs[adjIdx].title].status == Status.DONE) {
        cases[caseID].dataMapping[vxs[adjIdx].title].status = Status.PENDING;
        _cascade(vxs[adjIdx].title, caseID);
      }
    }
  }

  function _cut(bytes32[] memory arr, uint count) internal pure returns (bytes32[] memory) {
    bytes32[] memory res = new bytes32[](count);
    for (uint i = 0; i < count; i++) { res[i] = arr[i]; }
    return res;
  }

  function _getStatusString(Status status) internal pure returns(bytes32) {
    if (status == Status.DONE) return "done";
    if (status == Status.UNDONE) return "undone";
    if (status == Status.PENDING) return "pending";
    if (status == Status.MARKED) return "marked";
    else return "";  /* TODO THROW ERROR !!! */
  }


}
