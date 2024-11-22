import { Component } from '@angular/core';
@Component({
  selector: 'app-resizer-three',
  templateUrl: './resizer-three.component.html',
  styleUrls: ['./resizer-three.component.scss']
})
export class ResizerThreeComponent {

  constructor() { }

  ngOnInit(): void {

    this.dragElement( document.getElementById("separator") as HTMLElement, "H" );
  }
  dragElement(element: any, direction: any)
  {
      var   md: any; // remember mouse down info
      const first  = document.getElementById("first") as HTMLElement;
      const second = document.getElementById("second") as HTMLElement;

      element.onmousedown = onMouseDown;

      function onMouseDown(e: any)
      {
          //console.log("mouse down: " + e.clientX);
          md = {e,
                offsetLeft:  element.offsetLeft,
                offsetTop:   element.offsetTop,
                firstWidth:  first.offsetWidth,
                secondWidth: second.offsetWidth
              };

          document.onmousemove = onMouseMove;
          document.onmouseup = () => {
              //console.log("mouse up");
              document.onmousemove = document.onmouseup = null;
          }
      }

      function onMouseMove(e: any)
      {
          //console.log("mouse move: " + e.clientX);
          var delta = {x: e.clientX - md.e.clientX,
                      y: e.clientY - md.e.clientY};

          if (direction === "H" ) // Horizontal
          {
              // Prevent negative-sized elements
              delta.x = Math.min(Math.max(delta.x, -md.firstWidth),
                        md.secondWidth);

              element.style.left = md.offsetLeft + delta.x + "px";
              first.style.width = (md.firstWidth + delta.x) + "px";
              second.style.width = (md.secondWidth - delta.x) + "px";
          }
      }
  }
}
