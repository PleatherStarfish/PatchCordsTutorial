
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
    console.log(cords);

    // Add the target DIVs location to the list indexed to the line ID
    cords[`line${patchCordCounter}`] = [{[selectedDiv]: [currentSelectionX, currentSelectionY]}, "->"];
    console.log(cords);
    patchCordActive = true; 
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
      delete cords[`line${patchCordCounter}`]
      patchCordActive = false;
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
      divs[event.target.id].push(`line${patchCordCounter}`);
      cords[`line${patchCordCounter}`].push({[event.target.id]: [event.target.getBoundingClientRect().x, event.target.getBoundingClientRect().y]});

      // Get the first and only key in each object
      let first = v => v[Object.keys(v)[0]];

      let x1 = first(cords[`line${patchCordCounter}`][0]);
      let y1 = first(cords[`line${patchCordCounter}`][0]);
      let x2 = first(cords[`line${patchCordCounter}`][2]);
      let y2 = first(cords[`line${patchCordCounter}`][2]);

      drawLine(x1[0], y1[1], x2[0], y2[1]);

      patchCordActive = false;
      patchCordCounter += 1;
  }


  // ====== CLICK OUTSIDE A DIV (PATCH CORD ACTIVE) ======
  else if (patchCordActive)
  {
    deleteCord();
    divs[selectedDiv].pop();
    delete cords[`line${patchCordCounter}`]
    patchCordActive = false;
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

    let movingCords = divs[target.id];
    let movingDiv = target.id;
    for (const pc of movingCords) {
      // Just get one of the cords attached to a div
      let oneCord = document.getElementById(pc);

      if (Object.keys(cords[pc][0])[0] == movingDiv) {
        oneCord.setAttribute('x1', x);
        oneCord.setAttribute('y1', y);
      }
      else if (Object.keys(cords[pc][2])[0] == movingDiv) {
        oneCord.setAttribute('x2', x);
        oneCord.setAttribute('y2', y);
      }
      else {
        throw "oneCord.setAttribute fell through to the error condition"
      }
    }
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
  
    div.innerHTML = "<div id='flex'><div id='inner' contenteditable='true' onclick='this.focus()' placeholder='Enter text here...'></div></div>";
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
            .setAttribute("id", "line" + patchCordCounter);
}

function deleteCord() {
  const select = document.getElementById("patchCords");
  select.removeChild(select.lastChild);
}