// generate_seed.js
const fs=require('fs');
class Dim0Builder{
constructor(){
this.universe=new Array(10).fill(null).map(()=>new Array(10).fill(null).map(()=>new Array(10).fill(0)));
this.invisibleMap=["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
}
simulate(inputChars){
console.error("[Simulator] Starting Internal Verification...");
let pc=[0,0,0];
let inputs=inputChars.split('').map(c=>c.charCodeAt(0));
let inputPtr=0;
let cycles=0;
const advancePC=()=>{
let val=this.universe[0][0][pc[0]];
pc[0]++;if(pc[0]>9)pc[0]=0;
return val;
};
const getTorus=(c)=>{
let v=c%10;return v<0?v+10:v;
};
while(cycles<1000){
let ax=advancePC();
let bx=advancePC();
let cx=advancePC();
let valA=(ax===9)?(inputPtr<inputs.length?inputs[inputPtr++]:-1):this.universe[0][0][getTorus(ax)];
let valB=(bx===9)?0:this.universe[0][0][getTorus(bx)];
let res=valB-valA;
if(bx===9){
console.error(`[Simulator] Output: ${String.fromCharCode(res&255)}`);
}else{
this.universe[0][0][getTorus(bx)]=res;
}
if(res<=0){
if(cx<0){
console.error("[Simulator] SUCCESS: Negative Address Halt.");
return true;
}
pc=[cx,0,0];
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
let b=new Dim0Builder();
b.universe[0][0][0]=1;
b.universe[0][0][1]=1;
b.universe[0][0][2]=3;
b.universe[0][0][3]=9;
b.universe[0][0][4]=1;
b.universe[0][0][5]=7;
b.universe[0][0][6]=2;
b.universe[0][0][7]=1;
b.universe[0][0][8]=9;
b.universe[0][0][9]=0;
try{
b.simulate("019");
b.build();
}catch(e){
console.error(e.message);
process.exit(1);
}
}
main();
