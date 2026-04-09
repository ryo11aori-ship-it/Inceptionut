const fs=require('fs');
function main(){
console.log("Inceptionut The First Seed - Platonic Ideal");
let invisibleMap=["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
let binary=[
9,1,9,1,2,1,5,5,5,5,
0,0,0,9,0,9,0,2,0,0,
2,9,2,9,0,3,0,0,0,0,
9,9,2,9,0,5,0,9,0,9,
0,8,0,0,0,0,0,0,0,0,
2,9,9,9,0,6,0,9,0,9,
0,2,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,
0,9,0,9,0,8,0,0,0,0,
0,0,0,0,0,0,0,0,0,0
];
let out="";
for(let i=0;i<binary.length;i++){
out+=invisibleMap[binary[i]];
}
fs.writeFileSync('echo.inc',out);
console.log("Perfect native binary 'echo.inc' has been forged.");
}
main();
