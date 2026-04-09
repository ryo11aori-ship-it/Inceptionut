// generate_seed.js
const fs=require('fs');
class Dim2Builder{
constructor(){
this.universe=new Array(10).fill(null).map(()=>new Array(10).fill(null).map(()=>new Array(10).fill(0)));
this.invisibleMap=["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
}
emit(z,y,ax,ay,az,bx,by,bz,cx,cy,cz){
this.universe[z][y][0]=ax;
this.universe[z][y][1]=ay;
this.universe[z][y][2]=az;
this.universe[z][y][3]=bx;
this.universe[z][y][4]=by;
this.universe[z][y][5]=bz;
this.universe[z][y][6]=cx;
this.universe[z][y][7]=cy;
this.universe[z][y][8]=cz;
this.universe[z][y][9]=0;
}
simulate(inputChars){
console.log("[Simulator] Starting Internal Verification...");
let pc=[0,0,0];
let inputs=inputChars.split('').map(c=>c.charCodeAt(0));
let inputPtr=0;
let cycles=0;
const advancePC=()=>{
pc[0]++;
if(pc[0]>9){pc[0]=0;pc[1]++;}
if(pc[1]>9){pc[1]=0;pc[2]++;}
if(pc[2]>9){pc[2]=0;}
};
while(cycles<1000){
let ax=this.universe[pc[2]][pc[1]][pc[0]];advancePC();
let ay=this.universe[pc[2]][pc[1]][pc[0]];advancePC();
let az=this.universe[pc[2]][pc[1]][pc[0]];advancePC();
let bx=this.universe[pc[2]][pc[1]][pc[0]];advancePC();
let by=this.universe[pc[2]][pc[1]][pc[0]];advancePC();
let bz=this.universe[pc[2]][pc[1]][pc[0]];advancePC();
let cx=this.universe[pc[2]][pc[1]][pc[0]];advancePC();
let cy=this.universe[pc[2]][pc[1]][pc[0]];advancePC();
let cz=this.universe[pc[2]][pc[1]][pc[0]];advancePC();
let valA=(ax===9&&ay===9&&az===9)?(inputPtr<inputs.length?inputs[inputPtr++]:-1):this.universe[az][ay][ax];
let valB=(bx===9&&by===9&&bz===9)?0:this.universe[bz][by][bx];
if(valA===undefined||valB===undefined){
throw new Error(`[Simulator] CRASH: Out of bounds read at Cycle ${cycles}`);
}
let res=valB-valA;
if(bx===9&&by===9&&bz===9){
console.log(`[Simulator] Output: ${String.fromCharCode(res&255)}`);
}else{
this.universe[bz][by][bx]=res;
}
if(res<=0){
if(pc[0]===cx&&pc[1]===cy&&pc[2]===cz){
console.log("[Simulator] SUCCESS: Expected Halt Reached.");
return true;
}
if(cx<0||cy<0||cz<0){
console.log("[Simulator] SUCCESS: Halt via Negative Jump Address.");
return true;
}
pc=[cx,cy,cz];
}
cycles++;
}
throw new Error("[Simulator] CRASH: Infinite Loop Timeout");
}
build(){
let out="";
for(let z=0;z<10;z++){
for(let y=0;y<10;y++){
for(let x=0;x<10;x++){
out+=this.invisibleMap[this.universe[z][y][x]];
}
}
}
fs.writeFileSync('encoder.inc',out);
console.log("Binary forged and verified.");
}
}
function main(){
let b=new Dim2Builder();
let Z=[0,0,0];
let T=[1,0,0];
let PORT=[9,9,9];
let currentNode=1;
const addInst=(A,B,jumpTarget=null)=>{
let z=Math.floor(currentNode/10)+1;
let y=currentNode%10;
let nextNode=jumpTarget!==null?jumpTarget:currentNode+1;
let nz=Math.floor(nextNode/10)+1;
let ny=nextNode%10;
b.emit(z,y,A[0],A[1],A[2],B[0],B[1],B[2],0,ny,nz);
currentNode++;
return currentNode-1;
};
let loopStart=currentNode;
addInst(T,T);
addInst(PORT,T,currentNode+2);
addInst(Z,Z,currentNode);
addInst(T,PORT);
addInst(Z,Z,loopStart);
try{
b.simulate("019");
b.build();
}catch(e){
console.error(e.message);
process.exit(1);
}
}
main();
