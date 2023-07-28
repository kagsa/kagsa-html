/*
KAGSA Programming Language HTML data
*/

var SERVER = ''

// set the kagsa server using the base url 
// ex : https://server-kagsa.com
// ex : https://server-kagsa.com/index.php
var set_kagsa_server = (URL) => {
    if (URL.includes('?') || URL.includes('code=')) {
        console.error('kagsa.js: error: use only base url or the path to set the server')
    }
    else {
        SERVER = URL
    }
}

// read input html tags and write them as a kagsa code.
// inputs : str -> "input1, input2, .."
var read_inputs = (inputs) => {
    function canElementContainText(tagname) {
        try {
            var e = document.createElement(tagname);
            if (e.outerHTML.indexOf("/") != -1)
                return 'true'
            else return 'false'
        } catch (ex) {
            return 'false';
        }
    }
    var data = ''
    inputs = inputs.split(',')
    inputs.forEach(element => {
        elementName = element.replaceAll('"','\\"').trim()
        element = Array.from(document.querySelectorAll(element))
        // input is nothing
        if (element.length == 0) {
            // nothing
        }
        // input is id selector
        else if (element.length == 1){
            tag = element[0]
            attributeNodeArray = [...tag.attributes];
            attrs = attributeNodeArray.reduce((attrs, attribute) => {
                attrs[attribute.name] = attribute.value;
                return attrs;
            }, {});

            if (tag.value != undefined) {
                attrs['value'] = tag.value;
            }

            data += 'HTML.inputs.set("' + elementName + '", HTML.Element( "' + tag.tagName.toLowerCase() + '" , "' + tag.innerHTML + '" ,canContainText=' + canElementContainText(tag.tagName.toLowerCase()) + ', **JSON.toDict(\'' + JSON.stringify(attrs) + '\') ))\n'
            
        }
        // input is class selector
        else{
            data += 'HTML.inputs.set("' + elementName + '", list())\n'
            element.forEach(tag => {
                attributeNodeArray = [...tag.attributes];
                attrs = attributeNodeArray.reduce((attrs, attribute) => {
                    attrs[attribute.name] = attribute.value;
                    return attrs;
                }, {});

                if (tag.value != undefined) {
                    attrs['value'] = tag.value;
                }
                data += 'HTML.inputs.get("' + elementName + '").append( HTML.Element( "' + tag.tagName.toLowerCase() + '" , "' + tag.innerHTML + '" ,canContainText=' + canElementContainText(tag.tagName.toLowerCase()) +', **JSON.toDict(\'' + JSON.stringify(attrs) + '\') ))\n'

            });
        }
    });
    return data;
}

// send kagsa codes as requests to the server.
// codes : the kagsa lines.
// tag   : the current <kagsa> tag.
var request_server = (codes,tag) => {
    new_codes = ''
    codes.split('\n').forEach(line => {
        new_codes += line.trimLeft() + '\n'
    })
    codes = encodeURIComponent(new_codes)

    let xhr = new XMLHttpRequest();
    xhr.open('GET', `${SERVER}?code=${codes}`, true);

    xhr.onload = () => {
        let status = xhr.status;

        if (status == 200) {
            if (xhr.responseText.toString().includes('<h1>Internal Server Error</h1>')) {
                console.error('kagsa.js: error: cannot make request.\nerror: server error, try to check your codes')
            }
            else{
                data = xhr.responseText
                var scriptsList = []
                reg = /&lt;scrip(.*?)&gt;(.*?|\n)*&lt;\/script&gt;/
                while (true) {
                    try {
                        var scriptTag = data.match(reg)[0]
                    }catch(err){
                        //console.log('data  : '+data)
                        break
                    }
                    scriptTagAsText = scriptTag
                    scriptTag = scriptTag.replaceAll('&lt;','<').replaceAll('&gt;','>')
                    if (!scriptsList.includes(scriptTag)) scriptsList.push(scriptTag)
                    data = data.replace(scriptTagAsText,'')
                }
                reg2 = /<scrip(.*?)>(.*?|\n)*<\/script>/
                while (true) {
                    try {
                        var scriptTag = data.match(reg2)[0]
                    }catch(err){
                        //console.log('data  : '+data)
                        break
                    }
                    scriptTagAsText = scriptTag
                    scriptTag = scriptTag.replaceAll('&lt;','<').replaceAll('&gt;','>')
                    if (!scriptsList.includes(scriptTag)) scriptsList.push(scriptTag)
                    data = data.replace(scriptTagAsText,'')
                }
                if (data.replaceAll(' ','').replaceAll('\n','') != '') tag.outerHTML = tag.outerHTML + `<span class="kagsa">${ data }</span>`;
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
    
}

// js func to run a <kagsa> tag using selector.
var kagsa = (selector) => {
    var tag = document.querySelector(selector)
    var codes = ''
    if (tag.getAttribute('inputs') != undefined) { codes = read_inputs(tag.getAttribute('inputs')) }
    codes += ( '\n' + tag.innerHTML )
    request_server(codes,tag) 
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
            if (tag.getAttribute('inputs') != undefined) { codes = codes + read_inputs(tag.getAttribute('inputs')) }
            // read the codes from the tag
            codes += ( '\n' + tag.innerHTML )
            // run
            request_server(codes,tag)
        }
    });
},false);
