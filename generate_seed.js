const fs=require('fs');
class InceptionutBuilder{
constructor(){
this.universe=new Array(10).fill(null).map(()=>new Array(10).fill(0));
this.invisibleMap=["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
}
emitBootloader(){
this.universe[0]=[9,1,9,1,2,1,5,5,5,5];
}
emitSlingshot(targetBlock){
this.universe[1]=[0,0,0,9,0,9,0,targetBlock,0,0];
}
emitInstruction(blockIndex,ax,ay,bx,by,cx,cy){
this.universe[blockIndex]=[ax,ay,bx,by,cx,cy,0,9,0,9];
}
emitFallthroughPad(blockIndex,jumpX,jumpY){
this.universe[blockIndex]=[jumpX,jumpY,0,0,0,0,0,0,0,0];
}
build(){
let out="";
for(let y=0;y<10;y++){
for(let x=0;x<10;x++){
let val=this.universe[y][x];
if(val<0||val>9)val=0;
out+=this.invisibleMap[val];
}
}
return out;
}
}
function main(){
console.log("Inceptionut IR Builder - Fixed Overflow");
let builder=new InceptionutBuilder();
const BOOT=0;
const SLINGSHOT=1;
const LOOP_START=2;
const IN_BLOCK=3;
const IN_PAD=4;
const OUT_BLOCK=5;
const OUT_PAD=6;
const HALT_BLOCK=9;
const V_CHAR=[0,8];
builder.emitBootloader();
builder.emitSlingshot(LOOP_START);
builder.emitInstruction(LOOP_START,...V_CHAR,...V_CHAR,0,IN_BLOCK);
builder.emitInstruction(IN_BLOCK,9,9,...V_CHAR,0,OUT_BLOCK);
builder.emitFallthroughPad(IN_PAD,0,HALT_BLOCK);
builder.emitInstruction(OUT_BLOCK,...V_CHAR,9,9,0,0);
builder.emitFallthroughPad(OUT_PAD,0,LOOP_START);
builder.emitInstruction(HALT_BLOCK,0,HALT_BLOCK,0,HALT_BLOCK,0,HALT_BLOCK);
fs.writeFileSync('echo.inc',builder.build());
console.log("Perfect native binary forged.");
}
main();
