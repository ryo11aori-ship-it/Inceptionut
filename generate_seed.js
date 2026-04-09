const fs=require('fs');
function main(){
console.log("Inceptionut The First Seed - The Flawless Matrix");
let invisibleMap=["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];

// The Flawless Matrix
// VMの仕様変更は一切不要。[0,0]の破壊を防ぎ、ゴミを[0,6]に捨てる完全無欠の幾何学。
let binary=[
9,1,9,1,2,1,5,5,5,5, // Block 0: Bootloader (9を残す)
0,0,0,9,0,9,0,2,0,0, // Block 1: Slingshot. [0,0]を壊さず[0,9]を使って安全に[0,2]へ飛ぶ
0,8,0,8,6,3,0,0,0,0, // Block 2: Clear t1. 変数t1([0,8])を0に初期化し[6,3]へ
2,5,0,7,0,0,9,9,0,8, // Block 3: IN at [6,3]. 文字なら[2,5]へ。EOFなら落下して[0,7]へ跳ね返る
0,0,0,0,0,0,0,0,0,0, // Block 4: Vacuum
0,0,0,8,9,9,0,6,0,9, // Block 5: OUT at [2,5]. 落下し[0,0]の9を使って完璧に[0,9]へバウンドする
0,0,0,0,0,0,0,0,0,0, // Block 6: Garbage Bin. OUTの落下計算で生じる-65をここに捨てる
0,7,0,7,0,7,0,0,0,0, // Block 7: Halt Trap at [0,7]. EOF到達時の永遠の安息地
0,0,0,0,0,0,0,0,0,0, // Block 8: Data (t1 is at [0,8])
0,9,0,9,0,2,0,0,0,0  // Block 9: Redirector at [0,9] -> [0,2] へ安全にループ
];

let out="";
for(let i=0;i<binary.length;i++){
out+=invisibleMap[binary[i]];
}
fs.writeFileSync('echo.inc',out);
console.log("Perfect native binary 'echo.inc' has been forged.");
}
main();
