const fs = require('fs');

function main() {
    console.log("Inceptionut Stage-2 Compiler (Absolute Void Proof)");
    let invisibleMap = ["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
    
    // The Absolute Void
    // Dim 1空間 (100要素) を1ビットの無駄もなく使い切る完全なる幾何学バイナリ
    let binary = [
        // Block 0: Bootloader (0を完全に排除し、Big Bangを誘発して [2,1] へ飛ぶ)
        9, 1, 9, 1, 2, 1, 5, 5, 5, 5,
        
        // Block 1: Orbital Slingshot ([2,1] で受け止め、[0,2] へ射出する)
        9, 9, 0, 9, 0, 9, 0, 2, 9, 9,
        
        // Block 2: Clean Temp (tempを0に初期化し、Block 3の [4,3] へ飛ぶ)
        1, 9, 1, 9, 4, 3, 0, 0, 0, 0,
        
        // Block 3: Read IN & EOF Trampoline
        0, 4, 9, 0, 9, 9, 1, 9, 0, 5,
        
        // Block 4: EOF Halt (EOFを受信した場合、ここに到達して無限ループで安全に停止)
        0, 9, 0, 9, 0, 4, 0, 0, 0, 0,
        
        // Block 5: OUT Trampoline (Aを出力後、暴走するPCを制御してBlock 2へ跳ね返す)
        1, 9, 9, 9, 0, 9, 0, 2, 9, 0,
        
        // Block 6, 7, 8: 余白 (通過しない安全地帯)
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        
        // Block 9: Variable Area (変数 temp と zero)
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0
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
