export default class Logo {
    constructor(element_id = false, width = 420, drawLogo = false) {
        var canvas;
        if (element_id) {
            var el = document.getElementById(element_id);
            if (el.tagName !== 'CANVAS') {
                canvas = document.createElement('canvas');
                el.appendChild(canvas);
            } else canvas = el;
        } else canvas = document.createElement('canvas');
        canvas.height = canvas.width = width;
        this._canvas = canvas;
        this._context = canvas.getContext('2d');
        this._context.lineJoin = 'miter';
        this._context.strokeStyle = '#000';
        this._context.globalAlpha = 0;
        this._initParams(this._canvas.width);
        if (drawLogo) this.draw();
    }

    draw() {
        this._initParams();
        this._resetCanvas();

        var w = this._canvas.width;
        var lw = this._lw;

        this._context.save();
        this._context.globalAlpha = 1;        

        this._context.beginPath();
        this._context.moveTo(Logo._3_4ths(w), w - Logo._3_4ths(w / 2));
        this._context.lineTo(w - Logo._7_8ths(w / 2), Logo._3_4ths(w / 2));
        this._context.lineTo(w - Logo._7_8ths(w / 2), lw / 2);
        this._context.lineTo(w - lw / 2, lw / 2);
        this._context.lineTo(w - lw / 2, w - lw / 2);
        this._context.lineTo(Logo._7_8ths(w / 2) + lw / 2, w - lw / 2);
        this._context.stroke();

        this._context.beginPath();
        this._context.moveTo(w - Logo._3_4ths(w), Logo._3_4ths(w / 2));
        this._context.lineTo(Logo._7_8ths(w / 2), w - Logo._3_4ths(w / 2));
        this._context.lineTo(Logo._7_8ths(w / 2), w - lw / 2);
        this._context.lineTo(lw / 2, w - lw / 2);
        this._context.lineTo(lw / 2, lw / 2);
        this._context.lineTo(w - Logo._7_8ths(w / 2) - lw / 2, lw / 2);
        this._context.stroke();

        this._context.restore();
        this._hideInnerLineEdges();
    }

    download() {
        var canvasdata = this._canvas.toDataURL('image/png');
        var a = document.createElement('a');
        a.download = 'n-logo.png';
        a.href = canvasdata;
        a.click();
    }

    /**
     *- Clears canvas
     *- Updates global alpha for the fade effect
     *- Draw the logo
     *- Draw updated lines 
     *- Recursively call until both lines are removed  
     */
    _animateLogo(callback) {
        this._resetCanvas();
        if (this._context.globalAlpha < 1) this._context.globalAlpha += 0.02;
        this._updateAllParam();
        if (!this._animationComplete()) requestAnimationFrame(() => this._animateLogo(callback));
        else if (callback) callback();
    }

    animate(callback) {
        this._initParams();
        this._animateLogo(callback);
    }

    setWidth(w) {
        this._canvas.height = this._canvas.width = w;
    }

    _resetCanvas() {
        var w = this._canvas.width;
        this._context.save();
        this._context.clearRect(0, 0, w, w);
        this._context.globalAlpha = 1;
        this._context.fillStyle = '#FFF';
        this._context.fillRect(0, 0, w, w);
        this._context.restore();
    }

    _animationComplete() {
        var complete = false;
        for (let i = 0; i < this._params.length; i++) {
            if (this._params[i].complete) complete = this._params[i].complete;
        }
        return complete;
    }

    _updateAllParam() {
        for (let i = 0; i < this._params.length; i++) {
            this._updateAndDrawLine(this._params[i]);
        }
    }

    _updateAndDrawLine(param) { // AnimationParam
        if (!param.complete) {
            var l = param.line,
                s = param.segmentIndex,
                f = param.f,
                x1 = l.vectorArray[s].x,
                y1 = l.vectorArray[s].y,
                x2 = l.vectorArray[s + 1].x,
                y2 = l.vectorArray[s + 1].y,
                IF_fn = (x, y, f) => Math.round(x + (y - x) * f); // Interpolation Formula
            
            param.line.currX = IF_fn(x1, x2, f);
            param.line.currY = IF_fn(y1, y2, f);

            this._drawLine(param.line, param.segmentIndex);
            this._hideInnerLineEdges();

            if (f < 1) param.f += 0.1;
            else {
                param.f = 0;
                if (s + 2 <= param.line.segmentCount) param.segmentIndex++;
                else param.complete = true; // base case
            }

            if (!param.complete) this._drawBrushTip(param.line.currX, param.line.currY);
            else this._outerBorder();
        }
    }

    /**
     * Draw Line segments until the segmentIndex 
     */
    _drawLine(line, segmentIndex) {
        this._context.beginPath();
        this._context.moveTo(line.vectorArray[0].x, line.vectorArray[0].y);
        for (var i = 1; i < segmentIndex + 1; i++) {
            this._context.lineTo(line.vectorArray[i].x, line.vectorArray[i].y);
        }
        this._context.lineTo(line.currX, line.currY);
        this._context.stroke();
    }

    _hideInnerLineEdges() {
        var w = this._canvas.width,
            lw = this._lw,
            iw = this._iw,
            ih = this._lh;
        this._context.save();
        this._context.globalAlpha = 1;
        this._context.fillStyle = '#FFF';
        this._context.fillRect(w - lw - iw, w - lw - ih, iw, ih);
        this._context.fillRect(lw, lw, iw, ih);
        this._context.restore();
    }

    _outerBorder() {
        this._context.beginPath();
        this._context.moveTo(0, 0);
        this._context.lineTo(this._canvas.width, 0);
        this._context.lineTo(this._canvas.width, this._canvas.width);
        this._context.lineTo(0, this._canvas.width);
        this._context.lineTo(0, 0);
        this._context.stroke();
    }

    _drawBrushTip(x, y) {
        this._context.save();
        this._context.globalAlpha = 1;
        this._context.beginPath();
        this._context.arc(x, y, this._lw / 2, 0, 2 * Math.PI, false);
        this._context.fillStyle = '#000';
        this._context.fill();
        this._context.restore();
    }

    /**
     * Initializes global parameters
     */
    _initParams() {
        var w = this._canvas.width;
        var lw = Math.round(w * 0.08); //-> Line Width
        
        this._lw = lw;
        this._iw = Math.round((w - lw * 2) / 2); //-> Inner Rect Width
        this._lh = Math.round(Logo._3_4ths(this._iw) + (Logo._3_4ths(this._iw) * 0.045)); //-> Inner Rect Height
        this._context.globalAlpha = 0;
        this._context.lineWidth = lw;

        var l1 = new Line([
            new Vector(Logo._3_4ths(w), w - Logo._3_4ths(w / 2)),
            new Vector(w - Logo._7_8ths(w / 2), Logo._3_4ths(w / 2)),
            new Vector(w - Logo._7_8ths(w / 2), lw / 2),
            new Vector(w - lw / 2, lw / 2),
            new Vector(w - lw / 2, w - lw / 2),
            new Vector(Logo._7_8ths(w / 2) + lw / 2, w - lw / 2)
        ]);

        var l2 = new Line([
            new Vector(w - Logo._3_4ths(w), Logo._3_4ths(w / 2)),
            new Vector(Logo._7_8ths(w / 2), w - Logo._3_4ths(w / 2)),
            new Vector(Logo._7_8ths(w / 2), w - lw / 2),
            new Vector(lw / 2, w - lw / 2),
            new Vector(lw / 2, lw / 2),
            new Vector(w - Logo._7_8ths(w / 2) - lw / 2, lw / 2)
        ]);

        this._params = [];
        this._params.push(new AnimationParam(l1, 0, 0, false));
        this._params.push(new AnimationParam(l2, 0, 0, false));
    }

    static _7_8ths(x) { return Math.round(x * 0.875); }
    static _3_4ths(x) { return Math.round(x * 0.75); }
}

export class Line {
    constructor(vectors) {
        this.vectorArray = vectors;
        this.segmentCount = vectors.length - 1;
        this.currX = vectors[0].x;
        this.currY = vectors[0].y;
    }   
}

export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }  
}

export class AnimationParam {
    constructor(l, s, f, c) {
        this.line = l;          //- Line        -> the Line to be animated
        this.segmentIndex = s;  //- int         -> used to iterate through the segments (Vector pairs) in a Line
        this.f = f;             //- float       -> factor f for the interpolation formula used to animate the Line
        this.complete = c;      //- boolean     -> used to determine if the animation is complete
    }
}
