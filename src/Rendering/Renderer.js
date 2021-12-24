// const CellTypes = require("../Organism/Cell/CellTypes");
const CellStates = require("../Organism/Cell/CellStates");
const Directions = require("../Organism/Directions");

const colorLookup = {
    "food": [46, 122, 182],
    "wall": [128, 128, 128],
    "mouth": [222, 176, 76],
    "producer": [20, 223, 89],
    "mover": [96, 212, 255],
    "killer": [248, 35, 128],
    "armor": [114, 48, 219],
    "eye": [182, 193, 234],
}

// Renderer controls access to a canvas. There is one renderer for each canvas
class Renderer {
    constructor(canvas_id, container_id, cell_size) {
        this.cell_size = cell_size;
        this.canvas = document.getElementById(canvas_id);
        this.ctx = this.canvas.getContext("2d");
        this.fillWindow(container_id)
        this.height = this.canvas.height;
        this.width = this.canvas.width;
        this.cells_to_render = new Set();
        this.cells_to_highlight = new Set();
        this.highlighted_cells = new Set();
        this.imageData = new ImageData(this.canvas.width, this.canvas.height)

    }

    fillWindow(container_id) {
        this.fillShape($('#' + container_id).height(), $('#' + container_id).width());
    }

    fillShape(height, width) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.height = this.canvas.height;
        this.width = this.canvas.width;
    }

    clear() {
        this.imageData = new ImageData(this.canvas.width, this.canvas.height)
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.height, this.width);
    }

    renderFullGrid(grid) {
        for (var col of grid) {
            for (var cell of col) {
                this.renderCell(cell);
            }
        }
    }

    renderCells() {

        var imageData = this.imageData

        for (var cell of this.cells_to_render) {
            this.renderCell(cell);
        }

        this.ctx.putImageData(imageData, 0, 0);
        this.cells_to_render.clear();


    }

    renderCell(cell) {
        var color = colorLookup[cell.state.name];
        color = !!color ? color : [0, 0, 0];
        setPixel(this.imageData, cell.x, cell.y, color[0], color[1], color[2], 255);
    }

    renderOrganism(org) {
        for (var org_cell of org.anatomy.cells) {
            var cell = org.getRealCell(org_cell);
            this.renderCell(cell);
        }
    }

    addToRender(cell) {
        if (this.highlighted_cells.has(cell)) {
            this.cells_to_highlight.add(cell);
        }
        this.cells_to_render.add(cell);
    }

    renderHighlights() {
        for (var cell of this.cells_to_highlight) {
            this.renderCellHighlight(cell);
            this.highlighted_cells.add(cell);
        }
        this.cells_to_highlight.clear();

    }

    highlightOrganism(org) {
        for (var org_cell of org.anatomy.cells) {
            var cell = org.getRealCell(org_cell);
            this.cells_to_highlight.add(cell);
        }
    }

    highlightCell(cell) {
        this.cells_to_highlight.add(cell);
    }

    renderCellHighlight(cell) {
        var color = colorLookup[cell.state.name];
        color = !!color ? color : [0, 0, 0];
        var r = Math.min(color[0] + 180, 255);
        var g = Math.min(color[1] + 180, 255);
        var b = Math.max(color[2] - 180, 0);
        setPixel(this.imageData, cell.x, cell.y, r, g, b, 255);
    }


    clearAllHighlights(clear_to_highlight = false) {
        for (var cell of this.highlighted_cells) {
            this.renderCell(cell);
        }
        this.highlighted_cells.clear();
        if (clear_to_highlight) {
            this.cells_to_highlight.clear();
        }
    }
}

function setPixel(imageData, x, y, r, g, b, a) {
    var index = (x + y * imageData.width) * 4;
    imageData.data[index + 0] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = a;
}

module.exports = Renderer;