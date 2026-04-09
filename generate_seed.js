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
console.log("Inceptionut IR Builder - Dynamic Branch Flawless Fix");
let builder=new InceptionutBuilder();
builder.universe[0]=[9,1,9,1,2,1,5,5,5,5];
builder.universe[1]=[0,0,0,9,0,9,0,2,0,0];
builder.universe[2]=[0,8,0,8,0,3,0,0,0,0];
builder.universe[3]=[9,9,0,8,0,5,0,0,0,0];
builder.universe[4]=[0,4,0,4,0,4,0,4,0,4];
builder.universe[5]=[0,8,5,8,0,8,0,0,0,9];
builder.universe[6]=[6,0,9,9,0,4,0,0,0,0];
builder.universe[7]=[0,0,9,9,0,4,0,0,0,0];
builder.universe[8]=[0,8,0,8,0,6,0,0,0,0];
builder.universe[9]=[0,0,0,0,0,0,0,0,0,0];
fs.writeFileSync('encoder.inc',builder.build());
console.log("Native binary forged.");
}
main();
