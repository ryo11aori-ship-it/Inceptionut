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
console.log("==> UNIVERSE EXPANDED TO DIMENSION: "+(maxDim+1));
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
function main(){
console.log("Inceptionut Interpreter Running...");
//本物の不可視文字(半角スペースとタブ)によるコード(SSTTSSSTSSSS)
//※iPhoneコピペ事故防止のためタブは \t で表現していますが、
//完全に生のタブ文字に打ち替えても動作します。
let testCode="  \t\t   \t    ";
let bin="";
for(let i=0;i<testCode.length;i++){
if(testCode[i]===' ')bin+="0";
if(testCode[i]==='\t')bin+="1";
}
console.log("Parsed Binary: "+bin);
console.log("Test: Memory Expansion");
//座標(3)に100を書き込む
writeMem([3],100);
console.log("Value at (3): "+readMem([3]));
//座標(0)〜(9)をすべて埋めて飽和(次元拡張)を引き起こす
for(let i=0;i<=9;i++)writeMem([i],i+1);
console.log("Current Max Dimension: "+maxDim);
//次元拡張後、過去の(3)のデータは(3,0)へ移動しているはず
console.log("Value at (3,0) should be 4: "+readMem([3,0]));
}
main();
