const fs=require('fs');
function main(){
console.log("Inceptionut Stage-2 Compiler (The Sacred 100)");
let invisibleMap=["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
let binary=[
9,1,9,1,2,1,5,5,5,5,
0,0,0,9,0,9,0,2,0,0,
1,9,1,9,0,4,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,
9,9,1,9,0,5,8,9,1,9,
1,9,9,9,3,9,0,6,9,0,
0,9,0,9,0,2,0,0,0,0,
0,7,0,7,0,7,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,
0,0,8,9,0,7,0,0,0,0
];
let finalOut="";
for(let i=0;i<binary.length;i++){
finalOut+=invisibleMap[binary[i]];
}
fs.writeFileSync('out.inut',finalOut);
console.log("Compilation successful. The Absolute Void has been reached.");
}
main();
