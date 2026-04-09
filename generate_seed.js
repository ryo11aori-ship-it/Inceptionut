const fs=require('fs');
function main(){
console.log("Inceptionut The First Seed - The Zero Trampoline");
let invisibleMap=["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];

// The Platonic Ideal Array
// 100要素の空間を完全に制御し、すべての暴走を[0,9]の特異点へ集約する究極の幾何学
let binary=[
9,1,9,1,2,1,5,5,5,5, // Block 0: Bootloader. 0を排除して着火し [2,1] へ飛ぶ
0,0,0,9,0,9,0,2,0,0, // Block 1: Slingshot. PCを安全な [0,2] へ射出
0,8,0,8,4,3,0,0,0,0, // Block 2: Clear t1. 変数t1([0,8])を0に初期化し [4,3] へ飛ぶ
0,9,0,0,9,9,0,8,0,5, // Block 3: IN. 文字なら [0,5] へ。EOFなら暴走し、完璧な計算で [0,9] へ落下する
0,0,0,0,0,0,0,0,0,0, // Block 4: Unused Padding
0,8,9,9,0,2,0,9,0,0, // Block 5: OUT. 出力後に暴走し、完璧な計算で [0,9] へ落下する
0,0,0,0,0,0,0,0,0,0, // Block 6: Unused Padding
0,0,0,0,0,0,0,0,0,0, // Block 7: Unused Padding
0,0,0,0,0,0,0,0,0,0, // Block 8: t1 Variable Data
0,0,0,0,0,0,0,0,0,0  // Block 9: Zero Trampoline. ここに落ちたPCは必ず [0,0] へ跳ね返される
];

let out="";
for(let i=0;i<binary.length;i++){
out+=invisibleMap[binary[i]];
}
fs.writeFileSync('echo.inc',out);
console.log("Perfect native binary 'echo.inc' has been forged.");
}
main();
