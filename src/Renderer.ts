export class Renderer {
    public rasterize(
        target: HTMLImageElement, 
        markerImage: SVGSVGElement, 
        done: (dataUrl: string) => void, 
        naturalSize?: boolean, 
        imageType?: string, 
        imageQuality?: number,
        markersOnly?: boolean
    ) {
        const canvas = document.createElement("canvas");

        if (naturalSize === true) {
            // scale to full image size

            let width = target.naturalWidth;
            let height = target.naturalHeight;
            if (width > 1000) {
                height = height / width * 1000;
                width = 1000;
            }

            markerImage.width.baseVal.value = width;
            markerImage.height.baseVal.value = height;
        }

        canvas.width = markerImage.width.baseVal.value;
        canvas.height = markerImage.height.baseVal.value;

        const data = markerImage.outerHTML;

        const ctx = canvas.getContext("2d");
        if (markersOnly !== true) { 
            ctx.drawImage(target, 0, 0, canvas.width, canvas.height);
        }

        const DOMURL = window.URL; // || window.webkitURL || window;

        const img = new Image(canvas.width, canvas.height);
        img.setAttribute("crossOrigin", "anonymous");

        const blob = new Blob([data], { type: "image/svg+xml" });

        const url = DOMURL.createObjectURL(blob);

        img.onload = () => {
            ctx.drawImage(img, 0, 0);
            DOMURL.revokeObjectURL(url);

            done(canvas.toDataURL(imageType !== undefined ? imageType : "image/png", imageQuality));
        };

        img.src = url;
    }
}
