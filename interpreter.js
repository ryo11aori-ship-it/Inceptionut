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
console.log("==> BIG BANG! UNIVERSE EXPANDED TO DIM: "+(maxDim+1));
let newU=[];
newU.push(universe);
for(let i=1;i<10;i++)newU.push(createEmpty(maxDim));
universe=newU;
maxDim++;
}
function writeMem(coords,val){
let t=universe;
for(let i=coords.length-1;i>0;i--)t=t[coords[i]];
t[coords[0]]=val;
if(checkSat(universe,maxDim))expand();
}
function readMem(coords){
let t=universe;
for(let i=coords.length-1;i>=0;i--)t=t[coords[i]];
return t;
}
function getNextPC(pc){
let npc=[...pc];
npc[0]++;
if(npc[0]>9)npc[0]=0;
return npc;
}
function main(){
console.log("Inceptionut Interpreter - Raw Whitespace Survival Test");
//ここが最重要テスト箇所です。
//クォーテーションの中には「スペース2個、タブ2個、スペース3個、タブ1個、スペース4個」
//という生の不可視文字が直接入力されています。(数値の 3, 1, 0 に対応)
let rawCode="  		   	    ";
let tabCount=0;
let spaceCount=0;
for(let i=0;i<rawCode.length;i++){
if(rawCode[i]==='\t')tabCount++;
if(rawCode[i]===' ')spaceCount++;
}
console.log("Code Length: "+rawCode.length);
console.log("Spaces: "+spaceCount+" / Tabs: "+tabCount);
if(tabCount===0){
console.log("!!! FATAL ERROR !!!");
console.log("Your environment converted tabs to spaces.");
return;
}
console.log("SUCCESS: Raw tabs survived!");
console.log("Starting Big Bang Loader...");
let blocks=[];
let cur="";
for(let i=0;i<rawCode.length;i++){
let c=rawCode[i];
if(c===' '||c==='\t'){
cur+=c;
if(cur.length===4){
blocks.push(cur);
cur="";
}
}
}
let loadPC=[0];
for(let i=0;i<blocks.length;i++){
let b=blocks[i];
let val=0;
if(b[0]==='\t')val+=8;
if(b[1]==='\t')val+=4;
if(b[2]==='\t')val+=2;
if(b[3]==='\t')val+=1;
writeMem(loadPC,val);
console.log("Loaded ["+val+"] at coord: "+JSON.stringify(loadPC));
loadPC=getNextPC(loadPC);
}
console.log("Loader finished. Next PC would be: "+JSON.stringify(loadPC));
//さらにビッグバン拡張テスト(残り全てに書き込む)
console.log("Forcing Universe Expansion...");
for(let i=0;i<15;i++){
writeMem(loadPC,i+1);
loadPC=getNextPC(loadPC);
}
}
main();
