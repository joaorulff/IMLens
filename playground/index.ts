import { IMLens } from '../src/index';

const main = async () => {

    const points: { color: string, points: number[][] }[] = [{color: 'red', points: []}];

    const mainDiv1: HTMLDivElement = <HTMLDivElement>document.getElementById('main-div-1');
    const lens: IMLens = new IMLens( mainDiv1, {'mousedown': (a: number[]) => {

        points[0].points.push( a );
        lens.update_points( points );

    }} );

    lens.update_lens( './data/frame.jpg' ).then( () => {
        lens.update_points( points );
    });

}

main();