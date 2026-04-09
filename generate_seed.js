const fs=require('fs');

function main(){
    console.log("Inceptionut IR Builder - The Dimension Expander (DIM: 2)");
    let invisibleMap=["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
    let binary = [];

    // 1. DIM 1 Expansion Header (10要素。0を含まない)
    // [0,0,0]実行時に Subleq([9,9,9], [9,9,9], [1,1,1]) となり、[1,1,1]へジャンプする！
    binary.push(9,9,9, 9,9,9, 1,1,1, 9);

    // 2. DIM 2 Expansion Payload (90要素。0を含まない)
    for(let i=0; i<90; i++) binary.push(9);

    // --- ここから宇宙は DIM: 2 (10x10x10 = 1000要素) に拡張される ---

    // 3. DIM 2 Positioning Padding (11要素)
    // 拡張直後、ローダーのPCは [0,0,1] にいる。
    // [1,1,1] にコードを配置するため、11個の0パディングを進める。
    for(let i=0; i<11; i++) binary.push(0);

    // 4. DIM 2 Payload (実行スタート地点: [1,1,1])
    // DIM 2では座標が3次元(x,y,z)になるため、1つのSubleq命令が「9要素」を消費する！
    // Subleq([0,0,1], [0,0,1], [1,1,1])
    binary.push(0,0,1, 0,0,1, 1,1,1);

    let out="";
    for(let i=0;i<binary.length;i++){
        let val=binary[i];
        if(val<0||val>9)val=0;
        out+=invisibleMap[val];
    }
    
    // 前回のYAML設定のまま動かせるよう encoder.inc で出力
    fs.writeFileSync('encoder.inc',out);
    console.log("Universal Expander Header forged. Ready for DIM 2.");
}
main();
