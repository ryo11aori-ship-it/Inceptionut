const fs=require('fs');
function main(){
console.log("Inceptionut Stage-1 Compiler (Block-Aligned)");
let code;
try{code=fs.readFileSync('echo.imac','utf8');}catch(e){return;}
let lines=code.split('\n');
let vars={};
let labels={};
let instructions=[];
// 物理メモリ[0,2]と論理アドレスを一致させる (0〜9はBoot、10〜19はPadding)
let flatAddr=20; 
for(let i=0;i<lines.length;i++){
let l=lines[i].split('#')[0].trim();
if(!l)continue;
if(l.startsWith('.var ')){
let vName=l.split(' ')[1];
vars[vName]=-1;
}else if(l.endsWith(':')){
labels[l.slice(0,-1)]=flatAddr;
}else{
let tokens=l.split(/\s+/);
instructions.push(tokens);
// 1命令(6要素)につき、必ず10要素(1ブロック)を消費して境界またぎを防ぐ
flatAddr+=10; 
}
}
for(let k in vars){
vars[k]=flatAddr;
flatAddr+=2; // 変数は2要素のみでOK（実行されないためラップの罠にかからない）
}
function toDim(addr){
let pc=[0,1];
for(let i=0;i<addr;i++){
let j=0;
while(j<pc.length){
pc[j]++;
if(pc[j]>9){pc[j]=0;j++;}
else break;
}
if(j>=pc.length)pc.push(1);
}
return pc;
}
const IO_PORT=[9,9];
let outputBinary=[];
// Bootloader (Dim 0を飽和させつつ、安全な[0,2]へジャンプ)
let bootloader=[9,1,9,1,0,2,1,1,1,1];
outputBinary.push(...bootloader);
// Block 1 ([0,1]〜[9,1]) を0で埋める。これによりBootloaderの計算による破壊を吸収する
for(let i=0;i<10;i++) outputBinary.push(0);

for(let i=0;i<instructions.length;i++){
let toks=instructions[i];
let A=toks[0];
let B=toks[1];
// Cが省略された場合、次のブロックの先頭アドレスを自動計算
let fallthrough=20+i*10+10;
let C=toks[2]||fallthrough.toString();
function resolve(op){
if(op==="IN"||op==="OUT")return IO_PORT;
if(vars[op]!==undefined)return toDim(vars[op]);
if(labels[op]!==undefined)return toDim(labels[op]);
if(!isNaN(parseInt(op)))return toDim(parseInt(op));
console.log("Compiler Error: Unknown token "+op);
process.exit(1);
}
outputBinary.push(resolve(A));
outputBinary.push(resolve(B));
outputBinary.push(resolve(C));
// 残りの4要素を0でパディングし、次の命令を次のブロックの先頭に押し出す
outputBinary.push(0,0,0,0);
}
for(let k in vars)outputBinary.push([0,0]);
let invisibleMap=["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
let finalOut="";
for(let i=0;i<outputBinary.length;i++){
let coord;
if(Array.isArray(outputBinary[i]))coord=outputBinary[i];
else coord=[outputBinary[i]];
for(let j=0;j<coord.length;j++){
let val=coord[j];
if(val>=0&&val<=9)finalOut+=invisibleMap[val];
}
}
fs.writeFileSync('out.inut',finalOut);
console.log("Compilation successful. Binary Size: "+finalOut.length+" bits.");
}
main();
