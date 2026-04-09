const fs = require('fs');

function main() {
    console.log("Inceptionut Stage-2 Compiler (The Sacred Geometry)");
    let invisibleMap = ["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
    
    // The Absolute Void: Flawless 100-element Array
    // 次元ラップの罠を「変数の座標シフト」による自己書き換え判定で完全に無効化する
    let binary = [
        // Block 0: Bootloader (0を排除してBig Bangを着火し、[2,1]へ飛ぶ)
        9, 1, 9, 1, 2, 1, 5, 5, 5, 5,
        
        // Block 1: Orbital Slingshot ([2,1]で受け止め、[0,2]へ射出)
        9, 9, 0, 9, 0, 9, 0, 2, 9, 9,
        
        // Block 2: Clean Temp (temp=[1,9]を0に初期化し、[0,3]へ飛ぶ)
        1, 9, 1, 9, 0, 3, 0, 0, 0, 0,
        
        // Block 3: IN & EOF Trampoline
        // Charなら[0,5]へ。EOFなら暴走してラップし、1-1=0の奇跡により[0,9](Halt)へ着地
        9, 9, 1, 9, 0, 5, 0, 9, 9, 0,
        
        // Block 4: Unused padding
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        
        // Block 5: OUT & Wrap Trampoline
        // Aを出力後、暴走するPCを制御して次の入力へループ([0,2]へ飛ぶ)
        1, 9, 9, 9, 1, 9, 0, 2, 9, 0,
        
        // Block 6, 7, 8: Safe padding
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        
        // Block 9: Variable Area (zero=[0,9], temp=[1,9])
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];

    let finalOut = "";
    for (let i = 0; i < binary.length; i++) {
        finalOut += invisibleMap[binary[i]];
    }
    
    fs.writeFileSync('out.inut', finalOut);
    console.log("Compilation successful. Binary Elements: " + binary.length + ", Bits: " + finalOut.length);
    console.log("The Absolute Void has been reached.");
}
main();
