import { DrawConfig } from './draw-config';

export class GridSquare {
    public drawConfig = new DrawConfig();

    constructor(
        public name: string,
        public description: string,
        public roomConfig?: {
            north?: string,
            south?: string,
            east?: string,
            west?: string,
            up?: string,
            down?: string
        }
    ) { }
}


