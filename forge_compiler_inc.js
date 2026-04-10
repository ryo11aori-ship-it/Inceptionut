const fs=require('fs');
function main(){
let im=["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
let o="";
function p(v){o+=im[v%10]+im[Math.floor((v/10)%10)]+im[Math.floor(v/100)];}
function op0(a,b,c){p(0);p(a);p(b);p(c);}
function op1(a){p(1);p(a);}
function op2(c){p(2);p(c);}
op1(50);
op2(10);
let src="";
for(let i=0;i<100;i++){
src+=im[0]+im[0]+im[0];
}
fs.writeFileSync('compiler.inc',src);
console.log("compiler.inc (The Source Code of Compiler) generated.");
}
main();
