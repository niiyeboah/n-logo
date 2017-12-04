export class Logo {
    // var w, h, lw, iw, ih, params1, params2, resizing;
    constructor(canvas_id) {
        var logoSize = window.innerWidth
        if (logoSize > window.innerHeight) logoSize = window.innerHeight
        canvas.width = logoSize * 0.8;
        canvas.height = canvas.width;
        InitParams(canvas.width);
        context.lineWidth = lw;
        context.lineJoin = "miter";
        context.strokeStyle = "#000";
        context.globalAlpha = 0;
        canvas.style.margin = ((window.innerHeight - canvas.height) / 2 - 10).toString() + "px auto 0";
        animateLogo();
    }

    _drawLogo() {
        context.beginPath();
        context.moveTo(three4ths(w), h - three4ths(h / 2));
        context.lineTo(w - seven8ths(w / 2), three4ths(h / 2));
        context.lineTo(w - seven8ths(w / 2), lw / 2);
        context.lineTo(w - lw / 2, lw / 2);
        context.lineTo(w - lw / 2, h - lw / 2);
        context.lineTo(seven8ths(w / 2) + lw / 2, h - lw / 2);
        context.stroke();

        context.beginPath();
        context.moveTo(w - three4ths(w), three4ths(h / 2));
        context.lineTo(seven8ths(w / 2), h - three4ths(h / 2));
        context.lineTo(seven8ths(w / 2), h - lw / 2);
        context.lineTo(lw / 2, h - lw / 2);
        context.lineTo(lw / 2, lw / 2);
        context.lineTo(w - seven8ths(w / 2) - lw / 2, lw / 2);
        context.stroke();

        hideInnerLineEdges();
    }

    /*- Clears canvas
        *- Updates global alpha for the fade effect
        *- Draw the logo
        *- Draw updated lines 
        *- Recursively call until both lines are removed  */
    _animateLogo() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (context.globalAlpha < 1) context.globalAlpha += 0.01;
        updateAndDrawLine(params1);
        updateAndDrawLine(params2);
        if (!(params1.removed || params2.removed)) getAnimationFramePF(animateLogo);
    }

    _updateAndDrawLine(p) {
        var l = p.line,
            s = p.segmentIndex,
            f = p.f,
            x1 = l.vectorArray[s].x,
            y1 = l.vectorArray[s].y,
            x2 = l.vectorArray[s + 1].x,
            y2 = l.vectorArray[s + 1].y;
    
        // Interpolation Formula
        p.line.currX = Math.round(x1 + (x2 - x1) * f);
        p.line.currY = Math.round(y1 + (y2 - y1) * f);

        drawLine(p.line, p.segmentIndex);
        hideInnerLineEdges();
        
        if (f < 1) p.f += 0.05;
        else {
            p.f = 0;
            if (s + 2 <= p.line.segmentCount) p.segmentIndex++;
            else p.removed = true; // base case
        }

        if (!p.removed) {
            context.save();
            context.globalAlpha = 1;
            context.beginPath();
            context.arc(p.line.currX, p.line.currY, lw / 2, 0, 2 * Math.PI, false);
            context.fill();
            context.restore();
        }
    }

    /*- Draw Line segments until the segmentIndex  */
    _drawLine(line, segmentIndex) {
        context.beginPath();
        context.moveTo(line.vectorArray[0].x, line.vectorArray[0].y);
        for (var i = 1; i < segmentIndex + 1; i++) {
            context.lineTo(line.vectorArray[i].x, line.vectorArray[i].y);
        }
        context.lineTo(line.currX, line.currY);
        context.stroke();
    }

    _hideInnerLineEdges() {
        context.save();
        context.globalAlpha = 1;
        context.fillStyle = "#FFF";
        context.fillRect(w - lw - iw, h - lw - ih, iw, ih);
        context.fillRect(lw, lw, iw, ih);
        context.restore();
    }

    /*- Initializes global parameters */
    _InitParams(width) {
        w = width,
        h = w,
        lw = Math.round(w * 0.08), //-> Line Width
        iw = Math.round((w - lw * 2) / 2), //-> Inner Rect Width
        ih = Math.round(three4ths(iw) + (three4ths(iw) * 0.045)); //-> Inner Rect Height

        var line1 = new Line([
            new Vector(three4ths(w), h - three4ths(h / 2)),
            new Vector(w - seven8ths(w / 2), three4ths(h / 2)),
            new Vector(w - seven8ths(w / 2), lw / 2),
            new Vector(w - lw / 2, lw / 2),
            new Vector(w - lw / 2, h - lw / 2),
            new Vector(seven8ths(w / 2) + lw / 2, h - lw / 2)
        ]);

        var line2 = new Line([
            new Vector(w - three4ths(w), three4ths(h / 2)),
            new Vector(seven8ths(w / 2), h - three4ths(h / 2)),
            new Vector(seven8ths(w / 2), h - lw / 2),
            new Vector(lw / 2, h - lw / 2),
            new Vector(lw / 2, lw / 2),
            new Vector(w - seven8ths(w / 2) - lw / 2, lw / 2)
        ]);

        params1 = new ParamArray(line1, 0, 0, false);
        params2 = new ParamArray(line2, 0, 0, false);
    }

    static seven8ths(x) { return Math.round(x * 0.875) }
    static three4ths(x) { return Math.round(x * 0.75) }
}

export class Line {
    constructor(vectors) {
        this.vectorArray = vectors
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

export class Params {
    constructor(l, s, f, r) {
        this.line = l;          //- int         -> the Line to be animated
        this.segmentIndex = s;  //- int         -> used to iterate through the segments (Vector pairs) in a Line
        this.f = f;             //- float       -> factor f for the interpolation formula used to animate the Line
        this.removed = r;       //- boolean     -> used to determine if the animation is complete
    }
}