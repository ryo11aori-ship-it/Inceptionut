#include<stdio.h>
#include<stdlib.h>
#include<string.h>
int mem[1000];
int main(int argc,char**argv){
if(argc<3)return 1;
FILE*f=fopen(argv[0],"rb");
if(!f)return 1;
fseek(f,0,SEEK_END);
long sz=ftell(f);
rewind(f);
char*buf=malloc(sz);
fread(buf,1,sz,f);
fclose(f);
char*start=strstr(buf,"_INCEP_");
if(!start)return 1;
start+=7;
int cc=0,v=0;
for(char*p=start;p<buf+sz;p++){
if(*p==' ')v=(v<<1)|0;
else if(*p=='\t')v=(v<<1)|1;
else continue;
cc++;
if(cc%4==0){mem[(cc/4-1)%1000]=v;v=0;}
}
FILE*inF=fopen(argv[1],"rb");
FILE*outF=fopen(argv[2],"wb");
int pc=0,c=0;
while(c++<99999){
int ax=mem[pc],ay=mem[pc+1],az=mem[pc+2],bx=mem[pc+3],by=mem[pc+4],bz=mem[pc+5],cx=mem[pc+6],cy=mem[pc+7],cz=mem[pc+8];
int aa=ax==9&&ay==9&&az==9?999:ax+ay*10+az*100;
int ab=bx==9&&by==9&&bz==9?999:bx+by*10+bz*100;
int ac=cx==9&&cy==9&&cz==9?999:cx+cy*10+cz*100;
int va=aa==999?fgetc(inF):mem[(aa%1000+1000)%1000];
if(va==EOF)va=-1;
int vb=ab==999?0:mem[(ab%1000+1000)%1000];
int res=vb-va;
if(ab==999)fputc(res&255,outF);
else mem[(ab%1000+1000)%1000]=res;
if(res<=0){if(pc==ac)break;pc=ac;}
else pc=(pc/10*10+10)%1000;
}
if(inF)fclose(inF);
if(outF)fclose(outF);
return 0;
}
