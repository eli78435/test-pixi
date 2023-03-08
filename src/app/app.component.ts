import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Injectable,
  Optional,
  ViewChild
} from '@angular/core';
import * as PIXI from 'pixi.js';
import {of, timer, concatMap, interval} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  pixiApp: PIXI.Application;

  @ViewChild('vid') canvasRef: ElementRef;

  graphics = [];
  squareGeometry: PIXI.GraphicsGeometry;

  constructor() {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xff0000);
    graphics.drawRect(0, 0, 50, 50);
    graphics.endFill();
    graphics.x = 100;
    graphics.y = 100;

    this.squareGeometry = graphics.geometry;
  }

  ngAfterViewInit(): void {
    this.pixiApp = new PIXI.Application({
      view: this.canvasRef.nativeElement,
      backgroundAlpha: 0
    });
    this.pixiApp.stage.interactive = true;

    const bg = new PIXI.Sprite(PIXI.Texture.EMPTY);
    bg.width = this.pixiApp.screen.width;
    bg.height = this.pixiApp.screen.height;
    bg.interactive = true;
    bg.on('pointerdown', pixiEvent => {
      const newSquare = new PIXI.Graphics(this.squareGeometry);
      newSquare.x = pixiEvent.client.x  - (newSquare.width / 2);
      newSquare.y = pixiEvent.clientY - (newSquare.height / 2);
      newSquare.interactive = true;

      newSquare.on('pointerdown', pixiEvent => {
        if(pixiEvent.buttons != 1) {
          return;
        }

        const g = pixiEvent.currentTarget as PIXI.Graphics;
        if(g) {
          this.pixiApp.stage.removeChild(g);
          g.destroy();
        }
      });

      newSquare.on('mousedown', (e) => {
        const g = pixiEvent.currentTarget as PIXI.Graphics;
        if(g) {
          g.alpha = 0.5;

          const anyG = g as any;
          anyG.dragging = true;
        }
      });

      newSquare.on('mousemove', (e) => {
        const g = pixiEvent.currentTarget as PIXI.Graphics;
        const anyG = g as any;

        if(g && anyG.dragging) {
          if(g && newSquare) {
            g.x = e.client.x  - (newSquare.width / 2);
            g.y = e.clientY - (newSquare.height / 2);
          }
        }
      });

      newSquare.on('mouseup', (e) => {
        const g = pixiEvent.currentTarget as PIXI.Graphics;
        const anyG = g as any;

        if(g && anyG.dragging) {
          g.x = e.client.x  - (newSquare.width / 2);
          g.y = e.clientY - (newSquare.height / 2);
          g.alpha = 1;

          const anyG = g as any;
          anyG.dragging = false;
        }
      });

      this.pixiApp.stage.addChild(newSquare);
    });
    this.pixiApp.stage.addChild(bg);



    const newSquare = new PIXI.Graphics(this.squareGeometry);
    this.pixiApp.stage.addChild(newSquare);
    // this.graphics.push(newSquare);

    const source = interval(150);
    source
      .subscribe(() => {
        newSquare.x  += 1;
        newSquare.y  += 2;

        // console.log(`square (${newSquare.x}, ${newSquare.y})`);
      });
  }
}
