const fs = require('fs');

function main() {
    console.log("Inceptionut Stage-2 Compiler (The Sacred 100)");
    let invisibleMap = ["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
    
    // The Sacred 100
    // 次元ラップとOUTの絶対法則を、完全な幾何学バウンド(Triple Trampoline)で制圧した奇跡の配列
    let binary = [
        // Block 0: Bootloader (0を排除してBig Bangを着火し、[2,1]へ飛ぶ)
        // 最後に残る「5」は、後でPCをバウンドさせるための重要なクッションになります。
        9, 1, 9, 1, 2, 1, 5, 5, 5, 5,
        
        // Block 1: Orbital Slingshot ([2,1]で受け止め、安全な[0,2]へ射出)
        0, 0, 0, 9, 0, 9, 0, 2, 0, 0,
        
        // Block 2: Trampoline from Slingshot (無条件で[0,3]へ)
        0, 9, 0, 9, 0, 3, 0, 0, 0, 0,
        
        // Block 3: Clear Variable V ([2,9]を0で初期化し、[0,4]へ)
        2, 9, 2, 9, 0, 4, 0, 0, 0, 0,
        
        // Block 4: IN & EOF Triple Bouncer
        // 入力が文字なら[0,5]へ。EOFなら暴走し、クッション「5」に2回当たって[0,9](Halt)へ落ちる
        9, 9, 2, 9, 0, 5, 0, 9, 9, 0,
        
        // Block 5: OUT & Loop Triple Bouncer
        // Aを出力。直後にPCが暴走するが、クッション「5」と「0」に当たって[0,2]へ戻される
        2, 9, 9, 9, 0, 9, 0, 2, 9, 0,
        
        // Block 6, 7, 8: 真の虚無 (絶対にPCが到達しない安全な真空地帯)
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        
        // Block 9: Variable Area & Black Hole
        // [0,9]は0(Zero), [2,9]はV(Char)。
        // 最初の6要素は [0,9] [0,9] [0,9] であり、ここに落ちたPCは永遠に停止(Halt)する。
        0, 9, 0, 9, 0, 9, 0, 0, 0, 0
    ];

    let finalOut = "";
    for (let i = 0; i < binary.length; i++) {
        finalOut += invisibleMap[binary[i]];
    }
    
    fs.writeFileSync('out.inut', finalOut);
    console.log("Compilation successful. The Absolute Void has been reached.");
}
main();
