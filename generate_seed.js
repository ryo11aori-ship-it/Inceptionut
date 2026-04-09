const fs=require('fs');
class InceptionutBuilder{
constructor(){
this.universe=new Array(10).fill(null).map(()=>new Array(10).fill(0));
this.invisibleMap=["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
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
console.log("Inceptionut IR Builder - The Perfect Delayed Bounce");
let builder=new InceptionutBuilder();

// Block 0: Bootloader
builder.universe[0]=[9,1,9,1,2,1,5,5,5,5];
// Block 1: Slingshot -> [0,2]
builder.universe[1]=[0,0,0,9,0,9,0,2,0,0];
// Block 2: Clear InputVar[1,9] -> [0,3]
builder.universe[2]=[1,9,1,9,0,3,0,0,0,0];
// Block 3: IN to InputVar[1,9] -> [0,5]
builder.universe[3]=[9,9,1,9,0,5,0,0,0,0];
// Block 4: Halt Trap (安全な停止地点)
builder.universe[4]=[0,4,0,4,0,4,0,4,0,4];

// Block 5: The Delayed Bounce & Modifier!
// 1打目(PC=0): Target_Cy[5,8] = 6 - InputVar. (Inputが0なら6, 1なら7になる). >0でPC=6へ落下.
// 2打目(PC=6): 9 - [0,8](0) = 9. >0でPC=2へ落下.
// 3打目(PC=2): 0 - Target_Cy(6or7) = -6or-7. <=0で [0,8] へジャンプし見事に脱出！
builder.universe[5]=[1,9,5,8,2,9,0,8,0,0];

// Block 6: Target \x00 (Output [0,0]=9=\t -> Halt [0,4])
builder.universe[6]=[0,0,9,9,0,4,0,0,0,0];

// Block 7: Target \x01 (Output [6,0]=5=\x05 -> Halt [0,4])
builder.universe[7]=[6,0,9,9,0,4,0,0,0,0];

// Block 8: Dynamic Jump Execution! (PC=0)
// Jump to Target [0, 6] (or [0, 7] if modified)
builder.universe[8]=[0,9,0,9,0,6,0,0,0,0];

// Block 9: Unused Variables
// [0,9] = 0 (Zero)
// [1,9] = 0 (InputVar)
// [2,9] = 0 (Zero)
builder.universe[9]=[0,0,0,0,0,0,0,0,0,0];

fs.writeFileSync('encoder.inc',builder.build());
console.log("Perfect native binary forged.");
}
main();
