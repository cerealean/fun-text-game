import { Component, OnInit } from '@angular/core';
import { GridSquare } from './models/grid-square';
import { gridConfig } from './grid-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  squareMap: Map<string, GridSquare>;

  private mapCanvasElement: HTMLCanvasElement;
  private mapCanvas2dContext: CanvasRenderingContext2D;

  private playerCanvasElement: HTMLCanvasElement;
  private playerCanvas2dContext: CanvasRenderingContext2D;

  private canvasWidth = 5000;
  private canvasHeight = 5000;
  private lineWidth = 5;
  private gridSquareSideSize = 250;
  private doorSize = this.gridSquareSideSize * 0.2;

  private currentSquare: GridSquare;
  private currentPlayerPosition = {
    x: 0,
    y: 0
  };

  ngOnInit() {
    this.squareMap = new Map<string, GridSquare>(gridConfig.map(config => [config.name, config]));
    console.log(this.squareMap);
    this.mapCanvasElement = document.getElementById('grid-map') as HTMLCanvasElement;
    this.playerCanvasElement = document.getElementById('player') as HTMLCanvasElement;
    this.mapCanvas2dContext = this.mapCanvasElement.getContext('2d');
    this.playerCanvas2dContext = this.playerCanvasElement.getContext('2d');
    this.mapCanvas2dContext.lineWidth = this.lineWidth;
    this.mapCanvas2dContext.lineCap = 'square';
    this.mapCanvas2dContext.strokeStyle = 'black';
    this.mapCanvasElement.width = this.canvasWidth;
    this.mapCanvasElement.height = this.canvasHeight;
    this.playerCanvasElement.width = this.canvasWidth;
    this.playerCanvasElement.height = this.canvasHeight;
    this.drawMap();
    Object.defineProperty(window, 'north', { get: () => { this.north(); } });
    Object.defineProperty(window, 'south', { get: () => { this.south(); } });
    Object.defineProperty(window, 'east', { get: () => { this.east(); } });
    Object.defineProperty(window, 'west', { get: () => { this.west(); } });
  }

  private north() {
    if (!this.currentSquare.roomConfig.north) {
      return 'You cannot move north right now';
    }
    this.clearPlayer();
    this.drawPlayer(this.currentPlayerPosition.x, this.currentPlayerPosition.y - this.gridSquareSideSize);
    this.currentSquare = this.squareMap.get(this.currentSquare.roomConfig.north);
  }

  private south() {
    if (!this.currentSquare.roomConfig.south) {
      return 'You cannot move south right now';
    }
    this.clearPlayer();
    this.drawPlayer(this.currentPlayerPosition.x, this.currentPlayerPosition.y + this.gridSquareSideSize);
    this.currentSquare = this.squareMap.get(this.currentSquare.roomConfig.south);
  }

  private east() {
    if (!this.currentSquare.roomConfig.east) {
      return 'You cannot move east right now';
    }
    this.clearPlayer();
    this.drawPlayer(this.currentPlayerPosition.x + this.gridSquareSideSize, this.currentPlayerPosition.y);
    this.currentSquare = this.squareMap.get(this.currentSquare.roomConfig.east);
  }

  private west() {
    if (!this.currentSquare.roomConfig.west) {
      return 'You cannot move west right now';
    }
    this.clearPlayer();
    this.drawPlayer(this.currentPlayerPosition.x - this.gridSquareSideSize, this.currentPlayerPosition.y);
    this.currentSquare = this.squareMap.get(this.currentSquare.roomConfig.west);
  }

  private drawMap() {
    const xLoc = this.canvasWidth / 2 - this.gridSquareSideSize / 2;
    const yLoc = this.canvasHeight / 2 - this.gridSquareSideSize / 2;

    const startingSquare = this.squareMap.get('1_myhouse_bedroom');
    this.currentSquare = startingSquare;
    this.drawRecursive(startingSquare, xLoc, yLoc, this.gridSquareSideSize);
    this.drawPlayer(xLoc + this.gridSquareSideSize / 2, yLoc + this.gridSquareSideSize / 2);
  }

  private drawRecursive(square: GridSquare, x: number, y: number, squareSize: number) {
    if (!square.drawConfig.isDrawn) {
      this.mapCanvas2dContext.strokeRect(x, y, squareSize, squareSize);
      // this.canvas2dContext.strokeText(square.name, x + squareSize / 4, y + squareSize / 2);
      square.drawConfig.isDrawn = true;
    }

    if (square.roomConfig.north) {
      const nextSquare = this.squareMap.get(square.roomConfig.north);
      const nextX = x;
      const nextY = y - squareSize;
      if (!square.drawConfig.isNorthDoorDrawn) {
        this.drawDoor((x + squareSize / 2) - this.doorSize / 2, y + this.lineWidth, 'horizontal');
        square.drawConfig.isNorthDoorDrawn = true;
        this.drawRecursive(nextSquare, nextX, nextY, squareSize);
      }
    }
    if (square.roomConfig.west) {
      const nextSquare = this.squareMap.get(square.roomConfig.west);
      if (!nextSquare.drawConfig.isWestDoorDrawn) {
        const nextX = x - squareSize;
        const nextY = y;
        this.drawDoor(x + this.lineWidth, y + squareSize / 2 - this.doorSize / 2, 'vertical');
        nextSquare.drawConfig.isWestDoorDrawn = true;
        this.drawRecursive(nextSquare, nextX, nextY, squareSize);
      }
    }
    if (square.roomConfig.east) {
      const nextSquare = this.squareMap.get(square.roomConfig.east);
      if (!nextSquare.drawConfig.isEastDoorDrawn) {
        const nextX = x + squareSize;
        const nextY = y;
        this.drawDoor(x + squareSize - this.lineWidth, y + squareSize / 2 - this.doorSize / 2, 'vertical');
        nextSquare.drawConfig.isEastDoorDrawn = true;
        this.drawRecursive(nextSquare, nextX, nextY, squareSize);
      }
    }
    if (square.roomConfig.south) {
      const nextSquare = this.squareMap.get(square.roomConfig.south);
      const nextX = x;
      const nextY = y + squareSize;
      if (!square.drawConfig.isSouthDoorDrawn) {
        this.drawDoor((x + squareSize / 2) - this.doorSize / 2, y + squareSize - this.lineWidth, 'horizontal');
        square.drawConfig.isSouthDoorDrawn = true;
        this.drawRecursive(nextSquare, nextX, nextY, squareSize);
      }
    }
  }

  private drawDoor(x: number, y: number, direction: 'horizontal' | 'vertical') {
    const previousStrokeStyle = this.mapCanvas2dContext.strokeStyle;
    this.mapCanvas2dContext.strokeStyle = 'green';
    if (direction === 'horizontal') {
      this.mapCanvas2dContext.moveTo(x, y);
      this.mapCanvas2dContext.lineTo(x + this.doorSize, y);
      this.mapCanvas2dContext.stroke();
    }
    if (direction === 'vertical') {
      this.mapCanvas2dContext.moveTo(x, y);
      this.mapCanvas2dContext.lineTo(x, y + this.doorSize);
      this.mapCanvas2dContext.stroke();
    }
    this.mapCanvas2dContext.strokeStyle = previousStrokeStyle;
  }

  private drawPlayer(x: number, y: number) {
    this.currentPlayerPosition.x = x;
    this.currentPlayerPosition.y = y;
    console.debug(this.currentPlayerPosition);
    const previousStrokeStyle = this.playerCanvas2dContext.strokeStyle;
    const previousFillStyle = this.playerCanvas2dContext.fillStyle;
    this.playerCanvas2dContext.strokeStyle = 'purple';
    this.playerCanvas2dContext.fillStyle = 'purple';
    this.playerCanvas2dContext.moveTo(x, y);
    this.playerCanvas2dContext.ellipse(x, y, this.doorSize, this.doorSize, 360, 0, 360);
    this.playerCanvas2dContext.fill();
    this.playerCanvas2dContext.strokeStyle = previousStrokeStyle;
    this.playerCanvas2dContext.fillStyle = previousFillStyle;
  }

  private clearPlayer() {
    this.playerCanvas2dContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.playerCanvas2dContext.beginPath();
  }
}
