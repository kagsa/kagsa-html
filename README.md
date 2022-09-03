<center>
<img src="https://github.com/Zaky202/kagsa/blob/main/kagsa-web-logo.png?raw=true" width="300">
</center>
<h1 align="center">KAGSA WEB Framework</h1>

[KAGSA](https://github.com/kagsa/kagsa) Web is a framework for front-end development, using tags within HTML, read the [QuickStart](#quickstart) and [Document](#document) below.

## QuickStart
install `kagsa.js` , `kagsa.css` and import them inside you HTML<br>
or import them from github file raw
```html
<link rel="stylesheet" href="kagsa.css">
<script src="kagsa.js"></script>
```
now use the kagsa html tag :
```html
<kagsa>
    // kagsa codes here
</kagsa>
```
## Document
now the kagsa tag will run codes  manually when html start, but if you need to freeze it to later use `run` .
### run attr
if the value is `false` its will freezed ,else it will runed.

```html
<kagsa run="false">
    write 'Kagsa is on frontend now !!.'
</kagsa>
```
ok why i have to freeze an kagsa tag?<br>
this help you to use it inside `onclick` or any thing like that.

**Warnning** : don't use kagsa inside something like `onkeyup` because kagsa.js take all codes in the tag and send them to a server and get outputs, There will be problems due to too much requests

now we will use `kagsa()`

### kagsa () function
in this example i will create a button to say hello for user
```html
<button onclick="kagsa('#kg-say-hi')" >Say Hi</button>
<kagsa run="false" id="kg-say-hi">
    write 'Hello USER.'
</kagsa>
```
Output :

![](https://github.com/kagsa/kagsa-web/blob/main/img/img1.png?raw=true)
<br>`kagsa()` functions is used to run a kagsa tag within his selector.

### inputs attr
inputs its something to help kagsa to make connect with html tags, just add all the tags selectors to it with `,` between them.
```html
<h1 id="big" class="text" >Kagsa</h1>
<p id="small" class="text" >Programming Language</p>
<kagsa inputs="#big , #small , .text" >
    // do something
</kagsa>
```
but WAIT , how i can get informations about the tags or how to control them?

### Web Module
**Get inputs** : within the element selector

Right click - `inspect` > right click on element - `Copy` > `Copy selector`

![](https://github.com/kagsa/kagsa-web/blob/main/img/img2.png?raw=true)

```html
<kagsa inputs="#big , #small , .text" >
    
    Web.inputs.get('#big').innerHTML
    // Kagsa
    
    Web.inputs.get('#small').outerHTML
    // full p element
    
    // you can also get any type of attrs
    Web.inputs.get('#big').class
    // text
    
    // if the selector is give more than one ( class ) do this
    Web.inputs.get('.text').get(0) // this is the h1
    Web.inputs.get('.text').get(1) // this is the p
</kagsa>
```
**Edit Elements**

You can edit any tag in the html with the selector.
```html
<h1 class="text">Kagsa Big</h1>
<p class="text">Kagsa Small</p>
<kagsa inputs=".text">
    Web.inputs.edit('body > h1', innerHTML='Python Big')
    Web.inputs.edit('body > p', innerHTML='Python Small')
</kagsa>
```

**Box & Script**

if you write `<script></script>` inside `kagsa` tag you will get some problems.<br>
Except of this use `script()` to write a javascript tag and use `box()` to show alert with text.
```html
<kagsa>
    write Web.script('console.log("This is JS.")')
    Web.box('This is alert but with kagsa.')
</kagsa>
```

**Element()** : Create new element
```
Web.Element( tagName, n, innerHTML, **attrs)
// tagName    : element type ex: h1
// n          : 1 or 2 : <a> or <a></a>
// innerHTML  : you know what this mean
// attr       : ex: class="txt" id="bigtext"
```
a Example :
```html
<kagsa>
    write Web.Element('div',2,'a Sample Div',id="my-div", class='divs')
</kagsa>
```
You will get this : `<div id="my-div" class="divs">a Sample Div</div>`

### Kagsa Output
if there a problem in request to server i will print error in js console

![](https://github.com/kagsa/kagsa-web/blob/main/img/img3.png?raw=true)
if there an error output i will print error to a span under your current `kagsa` tag , like this:
```html
<span class="kagsa_output" state="400">
error catched [ (stdin)/SomethingERR ]
   |
 1 | somthing
   |
error: some error
</span>
```
the class will be `kagsa_output` and state is `400`

if the code run without problems, you will get this :
```html
<span class="kagsa_output" state="200">
    <h3>WELCOME FROM KAGSA</h3>
</span>
```
state is `200`.

## How to Build a Server
The Kagsa Web Server is use python flask to work, you can find the codes at [server/app.py](https://github.com/kagsa/kagsa-web/blob/server/app.py), You can edit on it and run it on Your server and **DON'T forget to change `SERVER` const in `kagsa.js`**

## Issues in Kagsa Web

### In kagsa web you can't use this thing
- `while true` : or any infinity loop.
- `input` : because you have to get acsess to server terminal to deal with inputs
- `File`,`System` Module : this will make a problems for my [pythonanywhere server](https://kagsa.pythonanywhere.com).
    - You can remove this exception on your own server.

Ok, why this is not allowed ??<br>
Because Frontend Framework is take your codes and encrypt it and send it to server, when the program is done the server will give back the response.

### Internet
You must be connect to internet to use kagsa web.