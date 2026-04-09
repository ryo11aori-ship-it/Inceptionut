const fs=require('fs');
function main(){
console.log("Inceptionut The First Seed - The Divine Engine");
let invisibleMap=["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];

// The Divine Engine
// OUTの絶対落下と意図せぬEOF(-1)をクッションとして利用し、完璧にループを成立させる神の配列
let binary=[
9,1,9,1,2,1,5,5,5,5, // Block 0: Bootloader (ブート完了後、[9,0]にクッション用の「5」を残す)
0,0,0,9,0,9,0,2,0,0, // Block 1: Slingshot -> [0,2] へ射出
0,8,0,8,6,3,0,0,0,0, // Block 2: Clear t1 -> 変数t1([0,8])を0に初期化し、[6,3]へ
0,5,0,9,9,0,9,9,0,8, // Block 3: IN (PC=6) -> 文字なら[0,5]へ。EOFなら落下し、完璧な軌道で[0,9]へバウンド
0,0,0,0,0,0,0,0,0,0, // Block 4: Vacuum
0,8,9,9,0,8,0,2,9,0, // Block 5: OUT (PC=0) -> 出力後落下し、EOF(-1)を読み込んで[0,2]へ跳ね返る！
0,0,0,0,0,0,0,0,0,0, // Block 6: Vacuum
0,0,0,0,0,0,0,0,0,0, // Block 7: Vacuum
0,0,0,0,0,0,0,0,0,0, // Block 8: Data (t1 is at [0,8])
0,9,0,9,0,9,0,0,0,0  // Block 9: Halt Trap (PC=0) -> EOF到達時の永遠の安息地
];

let out="";
for(let i=0;i<binary.length;i++){
out+=invisibleMap[binary[i]];
}
fs.writeFileSync('echo.inc',out);
console.log("Perfect native binary 'echo.inc' has been forged.");
}
main();
