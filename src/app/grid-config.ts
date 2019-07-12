import { GridSquare } from './models/grid-square';

export const gridConfig: GridSquare[] = [
    new GridSquare('1_myhouse_bedroom', 'You wake up in your bed', {west: '1_myhouse_bathroom', north: '1_myhouse_kitchen'}),
    new GridSquare('1_myhouse_kitchen', 'You wake up in your bed', {south: '1_myhouse_bedroom', west: '1_myhouse_livingroom'}),
    new GridSquare('1_myhouse_bathroom', 'You wake up in your bed', {east: '1_myhouse_bedroom'}),
    new GridSquare('1_myhouse_livingroom', 'You wake up in your bed', {east: '1_myhouse_kitchen', west: '1_myhouse_frontyard'}),
    new GridSquare('1_myhouse_frontyard', 'You wake up in your bed', {east: '1_myhouse_livingroom'})
];
