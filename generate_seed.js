// generate_seed.js
const fs=require('fs');
class Dim2Builder{
constructor(){
this.universe=new Array(10).fill(null).map(()=>new Array(10).fill(null).map(()=>new Array(10).fill(0)));
this.invisibleMap=["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
}
emit(z,y,ax,ay,az,bx,by,bz,cx,cy,cz,w9=0){
this.universe[z][y][0]=ax;
this.universe[z][y][1]=ay;
this.universe[z][y][2]=az;
this.universe[z][y][3]=bx;
this.universe[z][y][4]=by;
this.universe[z][y][5]=bz;
this.universe[z][y][6]=cx;
this.universe[z][y][7]=cy;
this.universe[z][y][8]=cz;
this.universe[z][y][9]=w9;
}
simulate(inputChars){
console.error("[Simulator] Starting Internal Verification...");
let pc=[0,0,0];
let inputs=inputChars.split('').map(c=>c.charCodeAt(0));
let inputPtr=0;
let cycles=0;
const advancePC=()=>{
let val=this.universe[pc[2]][pc[1]][pc[0]];
pc[0]++;if(pc[0]>9)pc[0]=0;
return val;
};
while(cycles<1000){
let currentPC=[...pc];
let ax=advancePC();let ay=advancePC();let az=advancePC();
let bx=advancePC();let by=advancePC();let bz=advancePC();
let cx=advancePC();let cy=advancePC();let cz=advancePC();
let valA=(ax===9&&ay===9&&az===9)?(inputPtr<inputs.length?inputs[inputPtr++]:-1):this.universe[az][ay][ax];
let valB=(bx===9&&by===9&&bz===9)?0:this.universe[bz][by][bx];
let res=valB-valA;
if(bx===9&&by===9&&bz===9){
console.error(`[Simulator] Output: ${res&255}`);
}else{
this.universe[bz][by][bx]=res;
}
if(res<=0){
if(currentPC[0]===cx&&currentPC[1]===cy&&currentPC[2]===cz){
console.error("[Simulator] SUCCESS: Expected Halt Reached.");
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
console.error("[Simulator] Binary forged and verified.");
}
}
function main(){
let b=new Dim2Builder();
b.emit(0,0,9,9,9,9,9,9,0,1,0,0);
b.emit(0,1,0,0,0,0,0,0,0,0,0,0);
b.emit(1,0,0,0,0,0,0,9,0,1,0,0);
try{
b.simulate("019");
b.build();
}catch(e){
console.error(e.message);
process.exit(1);
}
}
main();
