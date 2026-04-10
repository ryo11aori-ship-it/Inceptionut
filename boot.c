#include<stdio.h>
#include<stdlib.h>
int main(int argc,char**argv){
if(argc<3)return 1;
FILE*vm=fopen("vm.exe","rb");
FILE*in=fopen(argv[1],"rb");
FILE*out=fopen(argv[2],"wb");
int c;
while((c=fgetc(vm))!=EOF)fputc(c,out);
fprintf(out,"_INCEP_");
while((c=fgetc(in))!=EOF)fputc(c,out);
fclose(vm);fclose(in);fclose(out);
return 0;
}
