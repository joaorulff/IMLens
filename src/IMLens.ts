import {DOMUtils} from './utils/dom.utils';

// types
import { Point, Box, Pose } from './types';

// external
import * as d3 from 'd3';

export class IMLens {

    public image!: HTMLImageElement;
    public svg!: d3.Selection<any,any,any,any>;
    
    // scales
    private xScale!: d3.ScaleLinear<any, any>;
    private yScale!: d3.ScaleLinear<any, any>;

    constructor( public container: HTMLDivElement, public callbacks: {[name: string]: any} = {} ){}

    public async update_lens( imagePath: string ): Promise<void> {

        return new Promise( (resolve, reject) => {
            this.create_image( imagePath ).then( () => {
                resolve();
            })
        })
    }

    public update_points( points: {'color': string, points: number[][] }[] ): void {

        const _pointGroups = this.svg
            .selectAll('.points-group')
            .data( points )
            .join(
                enter => enter
                    .append('g')
                    .attr('class', 'points-group')
                    .attr('transform', 'translate(0,0)')
                    .attr('fill', ( pointGroup: {color: string, points: number[][] }) => pointGroup.color ),
                update => update,
                exit => exit.remove()
        )

        const _points = _pointGroups
            .selectAll('.point')
            .data( (points: {'color': string, points: number[][] }) => points.points )
            .join(
                enter => enter
                    .append('circle')
                    .attr('class', 'point')
                    .attr('cx', (coord: number[]) => this.xScale.invert(coord[0]) )
                    .attr('cy', (coord: number[]) => this.yScale.invert(coord[1]) )
                    .attr('r', 2),
                update => update  
                    .attr('cx', (coord: number[]) => this.xScale.invert(coord[0]) )
                    .attr('cy', (coord: number[]) => this.yScale.invert(coord[1]) ),
                exit => exit.remove()
            )
    }

    public update_shapes( shapes: { color: string, points: number[][] }[] ): void {

        const _shapesGroup = this.svg
            .selectAll('.shapes-group')
            .data( shapes )
            .join(
                enter => enter
                    .append('g')
                    .attr('class', 'shapes-group')
                    .attr('transform', 'translate(0,0)')
                    .attr('fill', ( shapeGroup: {color: string, points: number[][] }) => shapeGroup.color ),
                update => update,
                exit => exit.remove()
        )

    const _shapes = _shapesGroup

        .selectAll('.shape')
        .data( (shape: {'color': string, points: number[][] }) => [shape.points] )
        .join(
            enter => enter
                .append('polygon')
                .attr('class', 'shape')
                .attr('points', (points: number[][]) => {
                    
                    console.log("Caralho")
                    const a = points.map( (d: any) => [this.xScale.invert(d[0]), this.yScale.invert(d[1])].join(',') );
                    console.log(a.join(" "));
                    return a.join(" ");
                })
                .attr("stroke","black")
                .attr("stroke-width",2)
        )

    }

    public destroy(): void {

        if( this.container ){
            while (this.container.firstChild) {
                if( this.container.lastChild )
                this.container.removeChild(this.container.lastChild);
            }
        }

    }   

    private async create_image( imagePath: string ): Promise<void> {

        // creating video inside the container
        this.image = await DOMUtils.create_image( imagePath );

        // main container
        const mainWrapper: HTMLDivElement = DOMUtils.append_wrapper( this.container, '100%', '100%' );

        // image container
        const imageContainerSize: {width: number, height: number} = DOMUtils.get_image_container_size( this.image.naturalWidth, this.image.naturalHeight, mainWrapper.offsetWidth, mainWrapper.offsetHeight );
        const imageContainer: HTMLDivElement = DOMUtils.append_container( mainWrapper, `${imageContainerSize.width}px`, `${imageContainerSize.height}px` );
        imageContainer.append(this.image);

        // appending lens container
        const lensContainer: HTMLDivElement = DOMUtils.append_moveable_container( imageContainer, '150px', '150px');
        const canvas: HTMLCanvasElement = DOMUtils.create_canvas( lensContainer, this.image, lensContainer.offsetWidth, lensContainer.offsetHeight );
        const canvasContext: CanvasRenderingContext2D = canvas.getContext('2d')!;
        lensContainer.append(canvas);

        // // creating scales
        this.xScale = d3.scaleLinear().domain( [0,imageContainerSize.width] ).range([0,this.image.naturalWidth]);
        this.yScale = d3.scaleLinear().domain([0,imageContainerSize.height]).range( [0,this.image.naturalHeight]);

        // setting container invisible before start
        lensContainer.style.display = 'none';

        // setting callbacks
        imageContainer.onmousemove = (event: MouseEvent) => {
            
            lensContainer.style.left = `${event.offsetX + 15}px`;
            lensContainer.style.top = `${event.offsetY - 120}px`;

            const originalX: number = this.xScale( event.offsetX );
            const originalY: number = this.yScale( event.offsetY );

            canvasContext.clearRect( 0, 0, canvas.width, canvas.height );
            canvasContext.drawImage( this.image, originalX - 75, originalY - 75, 150, 150, 0, 0, 150, 150 );

            canvasContext.beginPath();
            canvasContext.arc(canvas.width/2, canvas.height/2, 5, 0, 2 * Math.PI);
            canvasContext.stroke();
            
        }

        imageContainer.onmouseleave = (a: MouseEvent) => {
            lensContainer.style.display = 'none';
        }

        imageContainer.onmouseenter = (a: MouseEvent) => {
            lensContainer.style.display = 'flex';
        }

        // creating SVG
        this.svg = DOMUtils.create_svg( imageContainer );


        this.svg.on('mousedown', (event: MouseEvent) => {

            const originalX: number = this.xScale( event.offsetX );
            const originalY: number = this.yScale( event.offsetY );

            if( 'mousedown' in this.callbacks ){
                this.callbacks['mousedown']( [originalX, originalY] );
            }

        })

        return;
    }



}