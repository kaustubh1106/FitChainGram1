// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract Twitter {
address[] getalluser;
address[] allinstructor;
uint userid;
uint instructorid;
uint postid;
enum Status{
Free,
Busy
}
struct User{
uint ID;
string username;
address pubkey;
address[] following;
}
struct Instructor{
uint ID;
string username;
address pubkey;
uint nooffollower;
address[] followers;
uint postcount;
Status status;
string fileHash;
string qr;
}
struct Post{
uint ID;
string content;
uint nooflikes;
uint upvote;
}
struct Message{
address sender;
uint timestamp;
string message;
}
mapping (bytes32 => Message[]) messages;

mapping (address=>Instructor) addresstoInstructor;
mapping (address => Post[]) allpostoftheinstructor;
mapping (address => User) addresstouser;
mapping(uint => address) postidtoaddress;

Post[] allposts;
User[] users;
Instructor[] instructors;


function checkfollowing(address _address) public view returns(bool){
for(uint i=0;i<addresstouser[msg.sender].following.length;i++){
if(addresstouser[msg.sender].following[i]==_address){
return true;
}
}
return false;
}
function checkotheruser(address _address) public view returns(bool){
for(uint i=0;i<getalluser.length;i++){
if(getalluser[i]==_address){
return true;
}
}
return false;
}
function checkuserexist() public view returns(bool){
for(uint i=0;i<getalluser.length;i++){
if(getalluser[i]==msg.sender){
return true;
}
}
return false;
}
function checkinstructorexist() public view returns(bool){
for(uint i=0;i<allinstructor.length;i++){
if(allinstructor[i]==msg.sender){
return true;
}
}
return false;
}
function checkotherinstructorexist(address _address1) public view returns(bool){
for(uint i=0;i<allinstructor.length;i++){
if(allinstructor[i]==_address1){
return true;
}
}
return false;
}

function registerasUser(string memory _username) public{
require(bytes(_username).length>0,"username can't be empty");
require(!checkuserexist(),"already registered");
require(!checkinstructorexist(),"instructor can't register as user"); //premium functionality if time
users.push(User(userid,_username,msg.sender,new address[](0)));
addresstouser[msg.sender]=users[userid];
getalluser.push(msg.sender);
userid++;
}// DONE
function registerasInstructor(string calldata _username,string calldata _filehash,string calldata _qr) public{
require(bytes(_username).length>0 && bytes(_filehash).length>0,"username and filehash can't be empty");
require(!checkuserexist(),"user can't be a instructor");
require(!checkinstructorexist(),"instructor can't register as user");
instructors.push(Instructor(instructorid,_username,msg.sender,0,new address[](0),0,Status.Free,_filehash,_qr));
allinstructor.push(msg.sender);
addresstoInstructor[msg.sender]=instructors[instructorid];
instructorid++;
}//

// TO CHECK THE NO OF FOLLOWERS
function showinstructor(address _address) public view returns(Instructor memory){
return addresstoInstructor[_address];
}

function follow(address _address) public{
require(checkuserexist(),"only user can follow"); //only user can follow
require(!checkotheruser(_address),"only instructor can be followed");
require(!checkfollowing(_address),"already following");
addresstoInstructor[_address].nooffollower++;
addresstoInstructor[_address].followers.push(msg.sender);
instructors[addresstoInstructor[_address].ID].nooffollower++;
addresstouser[msg.sender].following.push(_address);
}

function showusername(address _address) public view returns( User memory ){
require(checkotheruser(_address),"abc");
return addresstouser[_address];
}

function createpost(string calldata _cid) public{
require(checkinstructorexist(),"only instrutcor can post");
allposts.push(Post(postid,_cid,0,0));
addresstoInstructor[msg.sender].postcount++;
allpostoftheinstructor[msg.sender].push(allposts[postid]);
postidtoaddress[postid]=msg.sender;
postid++;
} // Done
function showpostcount() view public returns(uint){
return addresstoInstructor[msg.sender].postcount;
} //. Done
function showpost() public view returns(Post[] memory){
return allposts;
}//------->DONE
mapping (address => mapping(uint =>bool)) liked;
function likepost(uint _id) public{
require(!liked[msg.sender][_id], "already liked");
liked[msg.sender][_id] = true;
allposts[_id].nooflikes++;
}//. DONE

function unfollow(address _address) public{
require(checkfollowing(_address),"already unfollowed");
for(uint i=0;i<addresstouser[msg.sender].following.length;i++){
if(addresstouser[msg.sender].following[i]==_address){
delete addresstouser[msg.sender].following[i];
break;
}
}
for(uint i=0;i<addresstoInstructor[_address].followers.length;i++){
if(addresstoInstructor[_address].followers[i]==msg.sender){
delete addresstoInstructor[_address].followers[i];
break;
}
}
}

function showpostofanaddress(address _address) public view returns(Post[] memory){
require(checkfollowing(_address),"only follower"); //need to be followed by the caller
return allpostoftheinstructor[_address];
}
// constructor() payable {
// payable(address(this)).transfer(5 ether);
// }
receive() external payable{}
mapping (address => mapping(uint =>bool)) reviewed;
function review(uint _id,bool _check) public payable {
//require(allpostoftheinstructor[msg.sender][_id].ID!=_id, "message");
require(checkinstructorexist(), "only insrructor can review");
require(!reviewed[msg.sender][_id],"only once");
reviewed[msg.sender][_id]=true;
if(_check==true){
allposts[_id].upvote++;
payable (msg.sender).transfer(0.001 ether);
payable(postidtoaddress[_id]).transfer(0.001 ether);
}
else{
allposts[_id].upvote--;
}
}
function getinstructirsusername(address _address) public view returns(Instructor memory){
require(checkotherinstructorexist(_address),"user doesnt exist");
return addresstoInstructor[_address];
}
// DMS PART STARTED

event roomcreated(address indexed _instructor, address indexed _user,room);
struct room{
uint time;
address to;
uint no;
bool userwithdraw;
bool instructorwithdraw;
}
mapping (bytes32 => room) instructorassign;
function connectwithinstructor(address _address) public payable{
require(msg.value>=1.4 ether,"not enough ether"); //1ether se zyada pay kiya hai ya nhi
require(checkotherinstructorexist(_address), "not an instructor"); //is he really a instructor??
require(checkuserexist(),"only user can access");
require(addresstoInstructor[_address].status==Status.Free,"instructor not free");//is instructor free?
require(instructorassign[_getchatcode(msg.sender, _address)].to!=msg.sender,"already assigned");
require(_address!=msg.sender,"you can't connect to yourself");//you can't connect yourself
if(block.timestamp<=instructorassign[_getchatcode(msg.sender, _address)].time+60){
    revert("room is opened");
}
instructorassign[_getchatcode(msg.sender, _address)].time=block.timestamp;
instructorassign[_getchatcode(msg.sender, _address)].to=msg.sender;
instructorassign[_getchatcode(msg.sender, _address)].no=4;
instructorassign[_getchatcode(msg.sender, _address)]=instructorassign[_getchatcode(msg.sender, _address)];
addresstoInstructor[_address].status=Status.Busy;
emit roomcreated(_address,msg.sender,instructorassign[_getchatcode(msg.sender, _address)]);
}
function sendMessage(address _address2, string calldata _msg) public{
require(checkuserexist() || checkinstructorexist(), "register first");
if(checkuserexist()){
require(instructorassign[_getchatcode(msg.sender, _address2)].to==msg.sender,"1 con toinstructor");
require(block.timestamp <=instructorassign[_getchatcode(msg.sender, _address2)].time+60 ,"time expired");
}
else{
require(instructorassign[_getchatcode(msg.sender, _address2)].to==_address2,"");
require(block.timestamp <=instructorassign[_getchatcode(msg.sender, _address2)].time+60 ,"time expired");
}
//time expire toh nhi hua??
bytes32 chatcode = _getchatcode(msg.sender, _address2);
messages[chatcode].push(Message(msg.sender,block.timestamp,_msg));
}

function satisfied(address _address,bool check) public {
require(checkuserexist() && instructorassign[_getchatcode(msg.sender, _address)].no>=0,"all four answered");
if(check ==true){
instructorassign[_getchatcode(msg.sender, _address)].no--;
}
}

function withdrawFunds(address _address) public payable {
require(checkinstructorexist() || checkuserexist(), "only instructor");
require(block.timestamp>=instructorassign[_getchatcode(msg.sender, _address)].time+60,"time expired");
uint amountToWithdrawbyuser = instructorassign[_getchatcode(msg.sender, _address)].no * (0.25 ether); // 1 ether per question
uint amounttoWithdrawbyinstructor = (4-instructorassign[_getchatcode(msg.sender, _address)].no)*(0.25 ether);
//require(address(this).balance >= amountToWithdrawbyuser, "Contract balance insufficient");
if(checkuserexist()){
    require(instructorassign[_getchatcode(msg.sender, _address)].userwithdraw==false,"you have withdrawn");
    payable(msg.sender).transfer(amountToWithdrawbyuser);
    instructorassign[_getchatcode(msg.sender, _address)].userwithdraw=true;
}
else if(checkinstructorexist()){
    require(instructorassign[_getchatcode(msg.sender, _address)].instructorwithdraw==false,"you have withdrawn");
    payable(msg.sender).transfer(amounttoWithdrawbyinstructor);
    instructorassign[_getchatcode(msg.sender, _address)].instructorwithdraw=true;
    addresstoInstructor[msg.sender].status=Status.Free;
}
else{
    revert("open an account first");
}
}


function readMessage(address _address2) external view returns(Message[] memory){
bytes32 chatcode= _getchatcode(msg.sender, _address2);
return messages[chatcode];
}
function _getchatcode(address _address1,address _address2) internal pure returns(bytes32){
if(_address1 < _address2){
return keccak256(abi.encodePacked(_address1,_address2));
}
else{
return keccak256(abi.encodePacked(_address2,_address1));
}
}
}