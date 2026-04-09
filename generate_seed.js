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
console.log("Inceptionut IR Builder - 10-Block Dynamic Branch Proof");
let builder=new InceptionutBuilder();

// The 10-Block Matrix
// Block 0: Bootloader -> Jumps to [0,1]
builder.universe[0]=[9,1,9,1,2,1,5,5,5,5];
// Block 1: Slingshot -> Jumps to [0,2]
builder.universe[1]=[0,0,0,9,0,9,0,2,0,0];
// Block 2: Clear InputVar[0,8] -> Jumps to [0,3]
builder.universe[2]=[0,8,0,8,0,3,0,0,0,0];
// Block 3: IN to InputVar[0,8]. Read \x00(0) or \x01(1) -> Jumps to [0,5]
builder.universe[3]=[9,9,0,8,0,5,0,0,0,0];
// Block 4: Halt Trap (安全な停止地点)
builder.universe[4]=[0,4,0,4,0,4,0,4,0,4];

// Block 5: The Magic Bounce & Target Modifier
// 1打目(PC=0): Target_Y[5,8] = 6 - InputVar. (Inputが0なら6, 1なら7になる). 必ず落下。
// 2打目(PC=6): 0 - 9 = -9 <= 0. 必ず Block 8 (Dynamic Jump) へバウンドして脱出！
builder.universe[5]=[0,8,5,8,0,8,0,0,0,6];

// Block 6: Target for Input \x00
// Output Bootloader[0] (9 -> \t). Jumps to Halt [0,4]
builder.universe[6]=[0,0,9,9,0,4,0,0,0,0];

// Block 7: Target for Input \x01
// Output Bootloader[6] (5 -> \x05). Jumps to Halt [0,4]
builder.universe[7]=[6,0,9,9,0,4,0,0,0,0];

// Block 8: Dynamic Jump Execution!
// Jump to Target_Y (6 or 7)
builder.universe[8]=[0,8,0,8,0,6,0,0,0,0];

// Block 9: Unused
builder.universe[9]=[0,0,0,0,0,0,0,0,0,0];

fs.writeFileSync('encoder.inc',builder.build());
console.log("Native binary forged.");
}
main();
