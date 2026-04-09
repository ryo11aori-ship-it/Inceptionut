const fs = require('fs');

function main() {
    console.log("Inceptionut Stage-2 Compiler (Absolute Void Proof)");
    let invisibleMap = ["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
    
    // The Absolute Void Hardcoded Assembly
    // OUT命令のフォールスルー暴走を完璧に制御する、Dim 1空間(100要素)の完全幾何学配置
    let binary = [
        9, 1, 9, 1, 0, 1, 1, 1, 1, 1, // Block 0: Bootloader. 次元拡張後 [0,1] へ飛ぶ
        0, 9, 0, 9, 0, 2, 0, 0, 0, 0, // Block 1: [0,1] zero = 0. [0,2] へ飛ぶ
        2, 9, 2, 9, 0, 3, 0, 0, 0, 0, // Block 2: [0,2] temp = 0. [0,3] へ飛ぶ
        9, 9, 2, 9, 0, 5, 0, 0, 0, 0, // Block 3: [0,3] IN temp. 文字なら [0,5] へ飛び、EOFなら [0,4] へ落ちる
        0, 9, 0, 9, 0, 9, 0, 0, 0, 0, // Block 4: [0,4] EOF時の安全な停止(zero zero zeroで無限ループ)
        2, 9, 9, 9, 2, 9, 0, 9, 9, 0, // Block 5: [0,5] temp OUT temp. 'A'を出力し、わざと暴走してトランポリンを起動させる
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // Block 6: (暴走PCの通過領域)
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // Block 7: (暴走PCの通過領域)
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // Block 8: (暴走PCの通過領域)
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0  // Block 9: 変数領域. [0,9]=zero, [2,9]=temp
    ];

    let finalOut = "";
    for (let i = 0; i < binary.length; i++) {
        finalOut += invisibleMap[binary[i]];
    }
    
    fs.writeFileSync('out.inut', finalOut);
    console.log("Compilation successful. Binary Size: " + finalOut.length + " bits.");
    console.log("The Absolute Void has been reached.");
}
main();
