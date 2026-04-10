const fs=require('fs');
function main(){
let im=["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
let o="";
function pushOp(op){o+=im[op];}
function pushVal(v){o+=im[v%10]+im[Math.floor((v/10)%10)]+im[Math.floor(v/100)];}
// ソースコードの記述
pushOp(1);pushVal(50); // CLR 50 -> [50, 50, 3] に展開されるはず
pushOp(2);pushVal(10); // JMP 10 -> [900, 900, 10] に展開されるはず
fs.writeFileSync('test_source.inc',o);
console.log("test_source.inc generated.");
}
main();
