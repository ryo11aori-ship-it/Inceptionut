const fs=require('fs');
function main(){
console.log("Inceptionut Stage-1 Compiler (I-MACRO)");
let code;
try{code=fs.readFileSync('echo.imac','utf8');}catch(e){return;}
let lines=code.split('\n');
let vars={};
let labels={};
let instructions=[];
let flatAddr=0;
let bootloaderSize=10; // Dim 0 is consumed by ignition
// Pass 1: Parse variables and labels
for(let i=0;i<lines.length;i++){
let l=lines[i].split('#')[0].trim();
if(!l)continue;
if(l.startsWith('.var ')){
let vName=l.split(' ')[1];
vars[vName]=-1; // Address assigned later
}else if(l.endsWith(':')){
labels[l.slice(0,-1)]=flatAddr;
}else{
let tokens=l.split(/\s+/);
instructions.push(tokens);
flatAddr+=3; // Each Subleq is A B C (3 elements)
}
}
// Assign variable addresses at the end of the program
for(let k in vars){
vars[k]=flatAddr;
flatAddr++;
}
// Helper: Map flat address to Dimensional Coordinate
// flat 0 -> [0,1], flat 1 -> [1,1] ... flat 10 -> [0,2]
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
// IO Port mapping for Dim 1
const IO_PORT=[9,9];
let outputBinary=[];
// 1. Insert Bootloader (Ignition Sequence to fill Dim 0 and jump to [0,1])
let bootloader=[9,1,9,1,0,1,1,1,1,1];
outputBinary.push(...bootloader);
// Pass 2: Resolve addresses and compile
for(let i=0;i<instructions.length;i++){
let toks=instructions[i];
let A=toks[0];
let B=toks[1];
let C=toks[2]||(i*3+3).toString(); // Fallthrough to next instruction if C is omitted
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
// Allocate space for variables
for(let k in vars)outputBinary.push(toDim(vars[k]));
console.log("Binary generated. Encoding to invisible characters...");
let invisibleMap=["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
let finalOut="";
for(let i=0;i<outputBinary.length;i++){
let coord;
if(Array.isArray(outputBinary[i]))coord=outputBinary[i];
else coord=[outputBinary[i]]; // For bootloader
for(let j=0;j<coord.length;j++){
let val=coord[j];
if(val>=0&&val<=9)finalOut+=invisibleMap[val];
}
}
fs.writeFileSync('out.inut',finalOut);
console.log("Compilation successful. Wrote "+finalOut.length+" bits to out.inut");
}
main();
