const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: [],
        textarea: null
    },

    eventHandlers: {
        oninput: null,
        onclose: null,

    },

    properties: {
        value: "",
        capsLock: false,
        language: 'en'  
    },

    init() {
        //Creates main elements 
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");
        this.elements.textarea = document.createElement("textarea")

        //Setup main elements
        this.elements.main.classList.add("keyboard")
        this.elements.keysContainer.classList.add("keyboard__keys")
        this.elements.keysContainer.append(this._createKeys());
        this.elements.textarea.classList.add("use-keyboard-input")
        this.elements.textarea.setAttribute("cols", "30")
        this.elements.textarea.setAttribute("rows", "10")





        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        //Add to Dom
        this.elements.main.append(this.elements.keysContainer)
        document.body.append(this.elements.main)
        document.body.append(this.elements.textarea)

        //Automatically use keyboard for elements with .use-keyboard-input
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener('focus', () => {
                this.open(element.value, currenValue => {
                    element.value = currenValue;
                })
            })
        })


    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspase",
            "Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "Del",
            "CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter",
            "ShiftLeft", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "arrow_up","ShiftRight",
            "Ctrl", "Win", "AltLeft", "Space", "AltRight", "arrow_left", "arrow_down", "arrow_right", "Ctrl"
        ];

        //Create Html for an icon
        const createIconHtml = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`
        }

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button")
            //Разбитие по линиям
            const insertLineBreak = ["backspase", "Del", "Enter", "ShiftRight" ].indexOf(key) !== -1


            //atribute classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");
            keyElement.id = key



            switch(key) {
                case "Tab":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = "Tab"
                    keyElement.addEventListener('click', () => {
                        this.properties.value += "   "
                        this._triggerEvent("oninput")
                    })


                    break;

                case "backspase":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.id = "Backspace"
                    keyElement.innerHTML = createIconHtml("backspace");

                    keyElement.addEventListener('click', () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length-1 );
                        this._triggerEvent("oninput")
                    })
                    break; 

                case "CapsLock":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHtml("keyboard_capslock");
    
                    keyElement.addEventListener('click', () => {
                        this._tooggleCapsLock();
                        keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                    });

                    break; 


                case "Enter":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHtml("keyboard_return");
        
                    keyElement.addEventListener('click', () => {
                        this.properties.value += "\n";
                        this._triggerEvent("oninput");
                    })
                    break; 

                case "Space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHtml("space_bar");
            
                    keyElement.addEventListener('click', () => {
                        this.properties.value += " ";
                        this._triggerEvent("oinput");
                    })
                    break;
                    
                    case "ShiftLeft":
                    keyElement.classList.add("keyboard__key-wide");
                    keyElement.innerHTML = "Shift";
                    keyElement.addEventListener('mousedown', () => {
                        this._tooggleCapsLock()
                    })
                    keyElement.addEventListener('mouseup', () => {
                        this._tooggleCapsLock()
                    })

                    break;

                    case "ShiftRight":
                        keyElement.classList.add("keyboard__key-wide");
                        keyElement.innerHTML = "Shift";
                        keyElement.addEventListener('mousedown', () => {
                            this._tooggleCapsLock()
                        })
                        keyElement.addEventListener('mouseup', () => {
                            this._tooggleCapsLock()
                        })
                    break;

                    case "arrow_up":
                        keyElement.innerHTML = "&#8593";
                        keyElement.addEventListener('click', () =>{
                            this.properties.value += keyElement.innerHTML;
                            this._triggerEvent("oinput");
                        })
                    break;

                    
                    default:
                        keyElement.textContent = key

                        keyElement.addEventListener('click', () => {
                            this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                            this._triggerEvent("oninput")
                        })


            }

            fragment.appendChild(keyElement);

            if(insertLineBreak) {
                fragment.appendChild(document.createElement("br"))
            }
        })

        return fragment;
    },

    _triggerEvent(handlerName) {
       if(typeof this.eventHandlers[handlerName] == "function")
       this.eventHandlers[handlerName](this.properties.value);

    },

    _tooggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for(const key of this.elements.keys) {
            if(key.childElementCount === 0 && key.innerHTML.length == 1) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    _getCaretPosition(ctrl) {
        // IE < 9 Support 
        if (document.selection) {
            ctrl.focus();
            var range = document.selection.createRange();
            var rangelen = range.text.length;
            range.moveStart('character', -ctrl.value.length);
            var start = range.text.length - rangelen;
            return {
                'start': start,
                'end': start + rangelen
            };
        } // IE >=9 and other browsers
        else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
            return {
                'start': ctrl.selectionStart,
                'end': ctrl.selectionEnd
            };
        } else {
            return {
                'start': 0,
                'end': 0
            };
        }
    },

    // _setCaretPosition(ctrl, start, end) {
    //     // IE >= 9 and other browsers
    //     if (ctrl.setSelectionRange) {
    //         ctrl.focus();
    //         ctrl.setSelectionRange(start, end);
    //     }
    //     // IE < 9 
    //     else if (ctrl.createTextRange) {
    //         var range = ctrl.createTextRange();
    //         range.collapse(true);
    //         range.moveEnd('character', end);
    //         range.moveStart('character', start);
    //         range.select();
    //     }
    // }

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden")

    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden")
    }
}


window.addEventListener('DOMContentLoaded', function() {
    Keyboard.init();
    Keyboard.open();
    setFocus()
})



function setFocus() {
    document.querySelector('.use-keyboard-input').focus()
}





document.onkeydown = function (event) {
    let key = document.getElementById(`${event.code}`)
    if(key != null){
        key.classList.add("keyboard__key-active")
    }
    
    if(key == CapsLock){
        console.log(key)
        Keyboard._tooggleCapsLock()
        key.classList.toggle("keyboard__key--active")
    }

    if(key == ShiftLeft | key == ShiftRight){
        Keyboard._tooggleCapsLock()
    }
   console.log(event)
}

document.onkeyup = function(event){
    let keys = document.querySelectorAll(".keyboard__key")
    keys.forEach(elem => {
        elem.classList.remove("keyboard__key-active")
    })
    let key = document.getElementById(`${event.code}`)
    if(key == ShiftLeft | key == ShiftRight ){
        Keyboard._tooggleCapsLock()
    }
    if(key == Backspace){
        
    }

}

document.onkeypress = function(event) {
    if(event.key.length == 1) {
        let key = document.getElementById(`${event.key.toLowerCase()}`)
        key.classList.add("keyboard__key--active")
    }
    else{
        key.classList.add("keyboard__key--active")
    }
      
}

// document.onkeydown = function (event) {
//     console.log(event);
// }
