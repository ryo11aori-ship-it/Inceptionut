const fs=require('fs');
function main(){
console.log("Inceptionut The First Seed - The Absolute Void");
let invisibleMap=["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];

// The Sacred 100
// 次元ラップの暴走をすべて数学的に計算し、壁にバウンドさせて所定の座標に落とす奇跡の配列
let binary=[
9,1,9,1,2,1,5,5,5,5, // Block 0: Bootloader
0,0,0,0,0,0,0,2,0,0, // Block 1: Slingshot -> [0,2]
0,8,0,8,6,3,0,0,0,0, // Block 2: Clear t1 -> [6,3]
2,5,0,7,0,0,9,9,0,8, // Block 3: IN at [6,3]. EOF bounces to [0,7]
0,0,0,0,0,0,0,0,0,0, // Block 4: Vacuum
0,0,0,8,9,9,0,2,0,9, // Block 5: OUT at [2,5]. Bounces thrice to [9,9]
0,0,0,0,0,0,0,0,0,0, // Block 6: Vacuum
0,0,0,0,0,7,0,0,0,0, // Block 7: Halt Trap at [0,7]
0,0,0,0,0,0,0,0,0,0, // Block 8: Data (t1 is at [0,8])
0,0,0,0,2,0,0,0,0,0  // Block 9: Redirector at [9,9] -> [0,2]
];

let out="";
for(let i=0;i<binary.length;i++){
out+=invisibleMap[binary[i]];
}
fs.writeFileSync('echo.inc',out);
console.log("Perfect native binary 'echo.inc' has been forged.");
}
main();
