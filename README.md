# IMLens :mag_right:

IMLens is a canvas-based javascript library to allow image exploration with dynamic zoom.

[Example](https://github.com/joaorulff/MLVideo/assets/7430591/447d3559-61ec-4252-bee3-3036f24ddcb3)

## Installation

A npm local package is provided under ``./package``.

## Development

To start a development server run ``npm install`` followed by ``npm run dev``. The server will start on port 4000. The static files must be under ``./playground``.

To generate a new version of the local package run: ```npm run build-dist```. Then, ```npm pack```

## Usage


```typescript
    const points: { color: string, points: number[][] }[] = [{color: 'red', points: []}];

    const mainDiv1: HTMLDivElement = <HTMLDivElement>document.getElementById('main-div-1');
    const lens: IMLens = new IMLens( mainDiv1, {'mousedown': (a: number[]) => {

        points[0].points.push( a );
        lens.update_points( points );

    }} );

    lens.update_lens( './data/frame.jpg' ).then( () => {
        lens.update_points( points );
    });
```





