// interpreter.js
const fs=require('fs');
let maxDim=0;
let universe=[0,0,0,0,0,0,0,0,0,0];
function checkSat(arr,dim){
if(dim===0){
for(let i=0;i<10;i++)if(arr[i]===0)return false;
return true;
}else{
for(let i=0;i<10;i++)if(!checkSat(arr[i],dim-1))return false;
return true;
}
}
function createEmpty(dim){
if(dim===0)return [0,0,0,0,0,0,0,0,0,0];
let arr=[];
for(let i=0;i<10;i++)arr.push(createEmpty(dim-1));
return arr;
}
function expand(){
console.error("\n==> BIG BANG! UNIVERSE EXPANDED TO DIM: "+(maxDim+1));
let newU=[];
newU.push(universe);
for(let i=1;i<10;i++)newU.push(createEmpty(maxDim));
universe=newU;
maxDim++;
}
function getTorus(c){
let v=c%10;
return v<0?v+10:v;
}
function writeMem(coords,val){
let t=universe;
for(let i=coords.length-1;i>0;i--)t=t[getTorus(coords[i])];
t[getTorus(coords[0])]=val;
if(checkSat(universe,maxDim))expand();
}
function readMem(coords){
let t=universe;
for(let i=coords.length-1;i>=0;i--)t=t[getTorus(coords[i])];
return t;
}
function getNextPC(pc){
let npc=[...pc];
npc[0]++;
if(npc[0]>9)npc[0]=0;
return npc;
}
function getNextLoadPC(pc){
let npc=[...pc];
let i=0;
while(i<npc.length){
npc[i]++;
if(npc[i]>9){
npc[i]=0;
i++;
}else{
break;
}
}
if(i>=npc.length)npc.push(1);
while(npc.length>maxDim+1)npc.pop();
return npc;
}
function isIOPort(coords){
if(coords.length!==maxDim+1)return false;
for(let i=0;i<coords.length;i++){
if(coords[i]!==9)return false;
}
return true;
}
function readStdin(){
let b=Buffer.alloc(1);
try{
let br=fs.readSync(0,b,0,1,null);
if(br===0)return -1;
return b[0];
}catch(e){return -1;}
}
let pc;
function readOperand(){
let coords=[];
for(let i=0;i<=maxDim;i++){
coords.push(readMem(pc));
pc=getNextPC(pc);
}
return coords;
}
function main(){
let filename=process.argv[2]||'echo.inc';
let rawCode;
try{
rawCode=fs.readFileSync(filename,'utf8');
}catch(e){
console.error("Failed to load native binary: "+filename);
return;
}
let cleanCode="";
for(let i=0;i<rawCode.length;i++){
if(rawCode[i]===' '||rawCode[i]==='S')cleanCode+="0";
if(rawCode[i]==='\t'||rawCode[i]==='T')cleanCode+="1";
}
let blocks=[];
let cur="";
for(let i=0;i<cleanCode.length;i++){
cur+=cleanCode[i];
if(cur.length===4){
blocks.push(cur);
cur="";
}
}
let loadPC=[0];
for(let i=0;i<blocks.length;i++){
let b=blocks[i];
let val=0;
if(b[0]==='1')val+=8;
if(b[1]==='1')val+=4;
if(b[2]==='1')val+=2;
if(b[3]==='1')val+=1;
let prevMax=maxDim;
writeMem(loadPC,val);
if(maxDim>prevMax){
let newPC=new Array(maxDim+1).fill(0);
newPC[maxDim]=1;
loadPC=newPC;
}else{
loadPC=getNextLoadPC(loadPC);
}
}
pc=new Array(maxDim+1).fill(0);
let cycles=0;
let maxCycles=5000;
while(cycles<maxCycles){
let currentPC=[...pc];
let coordA=readOperand();
let coordB=readOperand();
let coordC=readOperand();
let valA;
if(isIOPort(coordA)){
valA=readStdin();
}else{
valA=readMem(coordA);
}
let valB=isIOPort(coordB)?0:readMem(coordB);
let res=valB-valA;
if(isIOPort(coordB)){
let charOut=Buffer.alloc(1);
charOut[0]=res&255;
process.stdout.write(charOut);
}else{
writeMem(coordB,res);
}
if(res<=0){
if(JSON.stringify(currentPC)===JSON.stringify(coordC)){
break;
}
let hasNegative=false;
for(let c of coordC){
if(c<0)hasNegative=true;
}
if(hasNegative)break;
pc=[...coordC];
}
cycles++;
}
}
main();
