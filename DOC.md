# KAGSA HTML Documents
KAGSA HTML does not contain many functions, but it is considered good and easy for programmers.

## Preparation
In the beginning, you have to create a server so that this server can run the KAGSA codes sent to it and give you the results. It is necessary, of course, that you have installed a cache on your computer and set its path in the environment variables, You can find two versions of the server, the PHP version and the second Python Flask, you can find it in the [repository](https://github.com/kagsa/kagsa-html) in the [server](https://github.com/kagsa/kagsa-html/tree/main/server) folder, just download the file and run it to have a server ready to deal with it from within HTML.

Now go to HTML and import the necessary files :
```html
<link rel="stylesheet" href="kagsa.css">
<script src="kagsa.js"></script>
```
We must now set our server link :
```html
<script>set_kagsa_server('http://127.0.0.1:5000')</script>
```
or
```html
<script>set_kagsa_server('http://127.0.0.1:8080/index.php')</script>
```
Now you can start.

## Start Coding

We use the `<kagsa>` tag to run a cagsa, for example :
```html
<kagsa>
    write "Hello World !!"
</kagsa>
```
The output of the KAGSA tag is automatically written into the `<span class="kagsa">` tag after the KAGSA tag :
```html
<kagsa>
    write "Hello World !!"
</kagsa><span class="kagsa">Hello World !!</span>
```
**Note** : That all KAGSA tags are triggered independently for each one when the HTML page has completed loading.

But can you turn off the automatic playback of a specific tag and turn it on later?

YES you can , just add `run="false"`
```html
<kagsa run="false">
    write "Welcome User"
</kagsa>
```
Ok good, how can you play it later? There is a **javascript** function that can run any tag you want, which is `kagsa( selector )`

- ### **kagsa( selector )**
This function takes the selector of the tag. What is selector? It is something through which we specify which tag we need in general in HTML .. You can simply get it by right click on your html page in the browser, then `Inspect`, then select the tag you want by right click, then choose `Copy`, then `CSS Selector` , in my case its `body > kagsa` , so :
```
<script>kagsa('body > kagsa')</script>
```

Or simply you can define your own selector by the id of the HTML tags, just add `id=".."` to the KAGSA tag for example and the selector will be the symbol `#` and then the id you wrote :
```
<kagsa run="false" id="great-the-user">
    write "Welcome User"
</kagsa>
```
Run it throw JavaScript :
```
<script>kagsa('#great-the-user')</script>
```
Well, can we add some professionalism? For example, if a button is pressed, then the tag is turned on. We can do something like this via `onclick` :
```
<kagsa run="false" id="great-the-user">
    write "Welcome User"
</kagsa>

<button onclick="kagsa('#great-the-user')" >Great Me</button>
```

Well, how can we handle external tags from an HTML file? Just write all their selectors in `inputs="selector1, selector2, .."` in the KAGSA tag and you can deal with them from the inside.

```html
<kagsa inputs="#usr , #psw">
    ...
</kagsa>
```
You will learn how to deal with these inputs through KAGSA code later at the end of the document in the function `HTML.inputs.get`.

#

Now we will learn how to program an KAGSA HTML from the inside

**Note** : This 3 functions ( `script`, `box`, `Element` ) It helps you to write HTML tags indirectly, because you are inside the `kagsa` tag, you cannot write other tags because the browser will consider them as ready-to-execute codes, so you create tags using the functions of the `HTML` library and print them.

- ### **HTML.script( data )**
Returns JavaScript code in tags ( `script` )
```
write HTML.script('window.location = "https://www.google.com";')
```
Output in HTML Page :
```html
<script>window.location = "https://www.google.com";</script>
```

- ### **HTML.box( data )**
Raise a alert box
```
HTML.box('Logged in Successfully')
```

- ### **HTML.Element( tagName,innerHTML,canContainText=true,\*\*attrs )**
Create an HTML tag, This class or function is smart, so you can access its tag and attribute information
```
image = HTML.Element('img','',canContainText=false, src="https://domain.com/img.jpg")
span = HTML.Element('span', 'Warning' , canContainText=true)
div1 = HTML.Element('div' , span+'Login first.' , canContainText=true,id='warn',class='box')

write div1;
```

Output in HTML Page :
```html
<div id="warn" class="box"><span>Warning</span>Login first.</div>
```
Get tag information :
```
div1.tagName
// div

div1.canContainText
// True

div1.innerHTML
// <span>Warning</span>Login first.

div1.attrs
// {'id':'warn', 'class':'box'}
```
- ### **HTML.inputs.get( selector )**
To call the tag you need via the selector, which you specified earlier in HTML ( `<kagsa inputs="#usr, #psw" > </kagsa>` ) , it return `HTML.Element` , and you can access the tag's attributes.
```html
usr = HTML.inputs.get('#usr').attrs.get('value')
psw = HTML.inputs.get('#psw').attrs.get('value')

if (usr == 'kagsa') && (psw == 'pass') {
    write "Right !!";
}else{
    write "Wrong !!"
}
```


- ### **HTML.inputs.edit( selector , \*\*attr )**
This function modifies the attributes of the tag (it is not required that the tag be entered in `inputs=""`, because CAGSA uses JavaScript to modify the tag)
```
HTML.inputs.edit('body > div' , class='boxes')
HTML.inputs.edit('body > h1' , innerHTML='Hello', id="header")
```

- ### **HTML.inputs.set( selector , htmlElement )**
This function is used to put a new tag entered by selector inside `HTML.inputs`, this function is usually used automatically to put the input that you specified in `input=".."` in the tag.
```
div1 = HTML.Element('div' , 'Login first.' , canContainText=true,id='warn',class='box')

HTML.inputs.set('#my-div', div1)
```