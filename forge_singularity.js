const fs=require('fs');
function main(){
// The True Semantic Compiler Logic in Subleq (Space <-> Tab Swapper)
let arr=[
48,48,3, 49,49,6, 999,49,9, 50,50,12, 51,50,15, 49,50,45,
50,50,21, 49,50,24, 52,50,36, 50,50,30, 53,50,33, 50,999,0,
50,50,39, 54,50,42, 50,999,0, 48,48,999, 0,0,0,-1,15,-9,-32
];
let ex=[];
for(let i=0;i<arr.length;i++){
let v=arr[i];if(v<0)v=(v%1000+1000)%1000;
ex.push(v%10);ex.push(Math.floor((v/10)%10));ex.push(Math.floor((v/100)%10));
}
let im=["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
let exe="";
for(let i=0;i<ex.length;i++)exe+=im[ex[i]];
// compiler.inc is the source code: it is the executable with bits inverted!
let inc="";
for(let i=0;i<exe.length;i++)inc+=(exe[i]===' '?'\t':' ');
fs.writeFileSync('compiler.inc',inc);
// JS Compiler that does the exact same semantic bit-flip
let js=`const fs=require('fs');
let s=fs.readFileSync(process.argv[2],'utf8'), o="";
for(let i=0;i<s.length;i++) o+=(s[i]===' '?'\\t':s[i]==='\\t'?' ':'');
fs.writeFileSync(process.argv[3],o);`;
fs.writeFileSync('compiler.js',js);
console.log("The True Semantic Compiler Seed Generated.");
}
main();
