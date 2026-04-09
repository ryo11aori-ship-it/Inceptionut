const fs=require('fs');
function main(){
console.log("Inceptionut Stage-1 Compiler (I-MACRO)");
let code;
try{code=fs.readFileSync('echo.imac','utf8');}catch(e){return;}
let lines=code.split('\n');
let vars={};
let labels={};
let instructions=[];
let flatAddr=2;
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
flatAddr+=6;
}
}
for(let k in vars){
vars[k]=flatAddr;
flatAddr+=2;
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
let bootloader=[9,1,9,1,2,1,1,1,1,1];
outputBinary.push(...bootloader);
// ここが修正箇所です。[0,0]という配列ではなく、純粋な値0を2つ押し込みます
outputBinary.push(0);
outputBinary.push(0);
for(let i=0;i<instructions.length;i++){
let toks=instructions[i];
let A=toks[0];
let B=toks[1];
let C=toks[2]||(2+i*6+6).toString();
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
