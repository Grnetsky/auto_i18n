# perfectI18n 

## Install

```shell
    npm install perfectI18n -g
```

## Usage

1. 翻译整个项目（目前仅支持vue3的模板部分）
```shell
    pI18n cli 
```
然后根据提示进行操作即可

2. 翻译单个文件 
若目标为vue文件，则只会翻译js部分，若目标为js/ts文件，则会翻译整个文件
```shell
    pI18n js <jsPath | vuePath> ...language
```
例如：
```shell
    pI18n js -f C:\Users\yourname\demo\vue3project\src\component\test.vue en ko fr
```
则会将test.vue的js部分翻译为en、ko、fr三种语言的文件，并将翻译后的内容放在src/i18n/lang文件夹对应的语言json下

3. 翻译当前文件下所有被$t()包裹的内容
```shell
    pI18n t <jsPath | vuePath> ...language
```
例如：
```shell
    pI18n t -f C:\Users\yourname\demo\vue3project\src\component\test.vue en ko fr
```
则会将test.vue中被$t()包裹的部分翻译为en、ko、fr三种语言的文件，并将翻译后的内容放在src/i18n/lang文件夹对应的语言json

