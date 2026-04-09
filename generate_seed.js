// generate_seed.js
const fs=require('fs');
class Dim0Builder{
constructor(){
this.universe=new Array(10).fill(null).map(()=>new Array(10).fill(null).map(()=>new Array(10).fill(0)));
this.invisibleMap=["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
}
build(){
let out="";
for(let x=0;x<10;x++){
out+=this.invisibleMap[this.universe[0][0][x]];
}
fs.writeFileSync('encoder.inc',out);
}
}
function main(){
let b=new Dim0Builder();
b.universe[0][0][0]=0;
b.universe[0][0][1]=3;
b.universe[0][0][2]=9;
b.universe[0][0][3]=0;
b.universe[0][0][4]=9;
b.universe[0][0][5]=0;
b.universe[0][0][6]=0;
b.universe[0][0][7]=0;
b.universe[0][0][8]=9;
b.universe[0][0][9]=9;
b.build();
}
main();
