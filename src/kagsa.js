/*
KAGSA Programming Language Web Framework
*/


/*
This Function is help to :
-  read all the input elements
-  create a sample framework for html
*/
const SERVER = 'https://kagsa.pythonanywhere.com/run/'


var scriptsList = []
var build = (inputs) => {
    var framework = ''
    inputs = inputs.split(',')
    inputs.forEach(element => {
        elementName = element.replaceAll('"','\\"').trim()
        element = Array.from(document.querySelectorAll(element))
        // if the input is id
        if (element.length == 0) {
            // nothing
        }
        else if (element.length == 1){
            // get element and add it to kagsa code 
            tag = element[0]
            framework += 'Web.inputs.set("' + elementName + '", Web.HTMLElement( "' + btoa(tag.innerHTML) + '" , "' + btoa(tag.outerHTML) + '" ))\n'
            
            // if there "value" in tag add it
            if (tag.value != undefined) {
                framework += 'Web.inputs.get("' + elementName + '").value = "' + tag.value.replaceAll('"','\\"') + '"\n'
            }

            // add all attrs to kagsa html element
            tag.getAttributeNames().forEach(attr => {
                framework += 'Web.inputs.get("' + elementName + `").${attr} = "` + tag.getAttribute(attr).replaceAll('"','\\"') + '"\n'
            });
        // if the inputs is class
        }else{
            framework += 'Web.inputs.set("' + elementName + '", list())\n'
            // read all elements by class
            element.forEach(tag => {
                framework += 'Web.inputs.get("' + elementName + '").append( Web.HTMLElement( "' + btoa(tag.innerHTML) + '" , "' + btoa(tag.outerHTML) + '" ))\n'

                    // if there "value" in tag add it
                if (tag.value != undefined) {
                    framework += 'Web.inputs.get("' + elementName + '").get(-1).value = "' + tag.value.replaceAll('"','\\"') + '"\n'
                }

                // add all attrs to kagsa html element
                tag.getAttributeNames().forEach(attr => {
                    framework += 'Web.inputs.get("' + elementName + `").get(-1).${attr} = "` + tag.getAttribute(attr).replaceAll('"','\\"') + '"\n'
                });
            });
        // if not class or id
        }
    });
    return framework;
}

// encode the kagsa codes with base64 and make request to compiler
var runKAGSA = (codes,tag) => {
    codes = btoa(codes)

    let xhr = new XMLHttpRequest();
    xhr.open('GET', `${SERVER}${codes}`, true);

    xhr.onload = () => {
        let status = xhr.status;

        if (status == 200) {
            if (xhr.responseText.toString().includes('<h1>Internal Server Error</h1>')) {
                console.error('kagsa.js: error: cannot make request.\nerror: server error, try to check your codes')
            }
            else{
                data = JSON.parse(xhr.responseText)
                reg = /&lt;scrip(.*?)&gt;(.*?|\n)*&lt;\/script&gt;/
                while (true) {
                    try {
                        var scriptTag = data.code.match(reg)[0]
                    }catch(err){
                        //console.log('data.code  : '+data.code)
                        break
                    }
                    scriptTagAsText = scriptTag
                    scriptTag = scriptTag.replaceAll('&lt;','<').replaceAll('&gt;','>')
                    if (!scriptsList.includes(scriptTag)) scriptsList.push(scriptTag)
                    data.code = data.code.replace(scriptTagAsText,'')
                }
                reg2 = /<scrip(.*?)>(.*?|\n)*<\/script>/
                while (true) {
                    try {
                        var scriptTag = data.code.match(reg2)[0]
                    }catch(err){
                        //console.log('data.code  : '+data.code)
                        break
                    }
                    scriptTagAsText = scriptTag
                    scriptTag = scriptTag.replaceAll('&lt;','<').replaceAll('&gt;','>')
                    if (!scriptsList.includes(scriptTag)) scriptsList.push(scriptTag)
                    data.code = data.code.replace(scriptTagAsText,'')
                }
                if (data.code.replaceAll(' ','').replaceAll('\n','') != '') tag.outerHTML = tag.outerHTML + `<span class="kagsa_output" state="${ data.state }">${ data.code }</span>`;
                scriptsList.forEach(sc => {
                    document.body.appendChild(
                        document.createRange().createContextualFragment(sc)
                    )
                });
            }
        } else {
            console.error('kagsa.js: error: cannot make request, state:' + status)
        }
    };

    xhr.onerror = () => {
        let status = xhr.status;
        console.error('kagsa.js: error: cannot make request, state:' + status)
    }

    xhr.ontimeout = () => {
        let status = xhr.status;
        console.error('kagsa.js: error: cannot make request, state:' + status + '\nerror: net error, try to check your internet connection.')
    }
    
    xhr.send();
    //$.ajax({
    //    type: "GET",
    //    url: `https://kagsa.pythonanywhere.com/run/${codes}`
    //}).done(function (data) {
        
    //});
    //tag.outerHTML = tag.outerHTML + '<span class="kagsa_output">' + html + '</span>';
    
}

// js func to run a kagsa tag
var kagsa = (selector) => {
    var tag = document.querySelector(selector)
    var codes = ''
    if (tag.getAttribute('inputs') != undefined) { codes = codes + build(tag.getAttribute('inputs')) }
    codes += ( '\n' + tag.innerHTML )
    runKAGSA(codes,tag) 
}

window.addEventListener('load', () => {
    Array.from(document.getElementsByTagName('kagsa')).forEach(tag => {
        var RUN = true
        // if run="false" don't run it
        if (tag.getAttribute('run') != undefined) {
            if (tag.getAttribute('run') == 'false') { RUN=false}
        }
        if (RUN) {
            var codes = ''
            // if there a inputs read them
            if (tag.getAttribute('inputs') != undefined) { codes = codes + build(tag.getAttribute('inputs')) }
            // read the codes from the tag
            codes += ( '\n' + tag.innerHTML )
            // run
            runKAGSA(codes,tag)
        }
    });
},false);
