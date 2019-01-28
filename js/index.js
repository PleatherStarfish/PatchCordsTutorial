
// let divs = { 
//   "div0" : [line0, line1],
//   "div1" : [line0],
//   "div2" : [line1],
//   "div3" : [],
// }

// let cords = { 
//   line0 : {div0: [x1, y1], div1: [x2, y2]},
//   line2 : {div0: [x1, y1], div2: [x2, y2]]
// }

const divs = { };
const cords = { };

let patchCordActive = false;
let currentSelectionX;
let currentSelectionY;
let divCounter = 0;
let patchCordCounter = 0;
let selectedDiv;

window.addEventListener('click', function (event) {

  // ====== CLICK INSIDE DIV (PATCH CORD INACTIVE) ======
  if (document.getElementById("main").contains(event.target) 
      && !(patchCordActive)
      && (event.target.id != "inner")
      && (event.target.id != "flex")
      )
  {
    selectedDiv = event.target.id
    currentSelectionX = event.target.getBoundingClientRect().x;
    currentSelectionY = event.target.getBoundingClientRect().y;
    let mouse_x = event.clientX;     // Get the horizontal coordinate
    let mouse_y = event.clientY;
    drawLine(currentSelectionX, currentSelectionY, mouse_x, mouse_y);
    
    // Add the new line ID to the divs object
    divs[selectedDiv].push(`line${patchCordCounter}`);

    // Add the target DIVs location to the list indexed to the line ID
    cords[`line${patchCordCounter}`] = [{[selectedDiv]: [currentSelectionX, currentSelectionY]}, "->"];
    
    patchCordActive = true; 
    patchCordCounter += 1;
  }
  // ====== CLICK AGAIN INSIDE THE SAME DIV (PATCH CORD ACTIVE) ======
  else if (document.getElementById("main").contains(event.target) 
       && (patchCordActive)
       && (event.target.id != "inner")
       && (event.target.id != "flex")
       && (event.target.id == selectedDiv)
      ) 
  {
      deleteCord();
      divs[selectedDiv].pop();
      delete cords[`line${patchCordCounter-1}`]
      patchCordActive = false;
      patchCordCounter -= 1;
  }
  // ====== CLICK INSIDE A DIF DIV (PATCH CORD ACTIVE) ======
  else if (document.getElementById("main").contains(event.target) 
       && (patchCordActive)
       && (event.target.id != "inner")
       && (event.target.id != "flex")
       && (event.target.id != selectedDiv)
      ) 
  {
      deleteCord();
      divs[event.target.id].push(`line${patchCordCounter-1}`);
      cords[`line${patchCordCounter-1}`].push({[event.target.id]: [event.target.getBoundingClientRect().x, event.target.getBoundingClientRect().y]});
      
      let first = v => v[Object.keys(v)[0]];

      let x1 = first(cords[`line${patchCordCounter-1}`][0]);
      let y1 = first(cords[`line${patchCordCounter-1}`][0]);
      let x2 = first(cords[`line${patchCordCounter-1}`][2]);
      let y2 = first(cords[`line${patchCordCounter-1}`][2]);

      console.log(x1, y1, x2, y2);

      drawLine(x1[0], y1[1], x2[0], y2[1]);

      patchCordActive = false;
      console.log(cords);
  }
  // ====== CLICK OUTSIDE A DIV (PATCH CORD ACTIVE) ======
  else if (patchCordActive)
  {
    deleteCord();
    divs[selectedDiv].pop();
    delete cords[`line${patchCordCounter-1}`]
    patchCordActive = false;
    patchCordCounter -= 1;
  }
  // ====== CLICK OUTSIDE A DIV (PATCH CORD INACTIVE) ======
  else if (!patchCordActive) { 
    // pass
  }
  // ====== FALLBACK ======
  else {
    throw "Patch-cord logic fell through to the error condition!";
  }
  
});

window.addEventListener('mousemove', function (event) {
  if (patchCordActive) {
    let mouse_x = event.clientX;     // Get the horizontal coordinate
    let mouse_y = event.clientY;
    document.getElementById("patchCords").lastElementChild.setAttribute('x2', mouse_x);
    document.getElementById("patchCords").lastElementChild.setAttribute('y2', mouse_y);
  }
});


interact('.draggable')
  .draggable({
    inertia: false,
    autoScroll: true,
    onmove: dragMoveListener
    });

  function dragMoveListener (event) {
    let target = event.target;
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
    console.log(divs[event.target.getAttribute('id')]);
  }


function createDiv() {
    let div = document.createElement('div');
  
    // Move the new div down 70px from the origin
    div.style.transform = "translate(0px, 70px)";
    div.setAttribute('data-y', 70);
    div.setAttribute('onclick', 'this.focus()');
    
    //Append the new div onto the "main" node
    document.getElementById('main').appendChild(div);
    div.style.backgroundColor = randomColor({luminosity: 'light'});
    
    // Add the Interact.js class name to the div.
    div.className = 'draggable';

    div.id = "div" + divCounter;
    divs[div.id] = [];
    divCounter += 1;
  
    // innerHTML should include text input
    // div.innerHTML = '<input type="text" id="text" value="text">';
    // div.lastChild.className += "text-input";

    div.innerHTML = "<div id='flex'><div id='inner' contenteditable='true' onclick='this.focus()' placeholder='Enter text here...'></div></div>";
    // div.lastChild.className += "text-input";
}

function drawLine(x1, y1, x2, y2) {
    var newLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    newLine.setAttribute('x1', x1);
    newLine.setAttribute('y1', y1);
    newLine.setAttribute('x2', x2);
    newLine.setAttribute('y2', y2);
    newLine.setAttribute('stroke', "black");
    newLine.setAttribute('stroke-width', '6');
    document.getElementById("patchCords")
            .appendChild(newLine)
            .setAttribute("id", "patchCord" + patchCordCounter);
    cords[`line${patchCordCounter}`] = {};
}

function deleteCord() {
  const select = document.getElementById("patchCords");
  select.removeChild(select.lastChild);
}