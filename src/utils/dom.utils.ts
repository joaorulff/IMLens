import * as d3 from 'd3';

export class DOMUtils {

    /*
    *   
    * 
    */

    public static get_image_container_size( imageWidth: number, imageHeight: number, containerWidth: number, containerHeight: number ): {width: number, height: number} {

        const videoAspectRatio: number = imageWidth/imageHeight;
        const containerAspectRatio: number = containerWidth/containerHeight;

        if( containerAspectRatio >= videoAspectRatio ){
            const height: number = containerHeight;
            const width: number =  (imageWidth * containerHeight)/imageHeight;
            return {width, height};
        }

        const width: number = containerWidth;
        const height: number =  (containerWidth * imageHeight)/imageWidth;

        return {width, height};
    }

    public static append_moveable_container( container: HTMLDivElement, width: string, height: string,  color: string = '#000000' ): HTMLDivElement {

        const lensDiv = document.createElement('div');

        lensDiv.style.width = width;
        lensDiv.style.height = height;
        lensDiv.style.top = '0px';
        lensDiv.style.left = '0px';
        lensDiv.style.position = 'absolute';
        lensDiv.style.backgroundColor = color;
        lensDiv.style.zIndex = '2';
        lensDiv.style.borderRadius = `50%`;
        lensDiv.style.boxShadow = `rgba(0, 0, 0, 0.35) 0px 5px 15px`;

        container.append( lensDiv );

        return lensDiv;
    }

    public static append_wrapper( container: HTMLDivElement, width: string, height: string, color: string = '#000000' ): HTMLDivElement {

        const wrapper = document.createElement('div');

        wrapper.style.width = width;
        wrapper.style.height = height;
        wrapper.style.position = 'relative';
        wrapper.style.backgroundColor = color;
        wrapper.style.display = 'flex';
        wrapper.style.justifyContent = 'center';
        wrapper.style.alignItems = 'center';
        wrapper.style.zIndex = '1';

        container.append( wrapper );

        return wrapper;

    }

    public static append_container( container: HTMLDivElement, width: string, height: string, color: string = '#000000' ): HTMLDivElement {

        const imageContainer = document.createElement('div');

        imageContainer.style.width = width;
        imageContainer.style.height = height;
        imageContainer.style.position = 'relative'
        imageContainer.style.backgroundColor = color;

        container.append( imageContainer );

        return imageContainer;
    }
    
    public static create_svg( container: HTMLElement, zindex: number = 1, width?: number, height?: number ): d3.Selection<any,any,any,any> {
        
        // TODO: getBoundingClientRect seems more accurate. Need to understand why
        // container dimensions 
        let svgWidth: number = width ? width : container.getBoundingClientRect().width;
        let svgHeight: number = height ? height : container.getBoundingClientRect().height;

         // creating svg
        return d3.select(container)
            .append('svg')
            .style('position', 'absolute')
            .style('top', 0)
            .style('left', 0)
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .style('z-index', zindex);

    }

    public static async create_image( imagePath: string ): Promise<HTMLImageElement> {
        
        return new Promise( (resolve, reject) => {

            const image: HTMLImageElement = document.createElement('img');
            image.src = imagePath;
                
            // setting video styles
            image.style.width = '100%';
            image.style.height = '100%';

            image.onload = () => {
                resolve(image);
            }

        });

    }
 
    public static create_canvas( container: HTMLDivElement, image: HTMLImageElement, width: number, height: number ): HTMLCanvasElement {

        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.style.borderRadius = `50%`;

        return canvas;
    }



}