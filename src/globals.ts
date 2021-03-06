import { Blueprint } from './factorio-data/blueprint'
import { ToolbarContainer } from './containers/toolbar'
import { BlueprintContainer } from './containers/blueprint'
import { EditEntityContainer } from './containers/editEntity'
import { InventoryContainer } from './containers/inventory'

// tslint:disable:prefer-const

let app: PIXI.Application

let toolbarContainer: ToolbarContainer
let editEntityContainer: EditEntityContainer
let inventoryContainer: InventoryContainer
let BPC: BlueprintContainer

const gridData = {
    x: 0,
    y: 0,
    x16: 0,
    y16: 0,
    _callbacks: [] as Array<() => void>,
    _lastMousePos: { x: 0, y: 0 },

    onUpdate(cb: () => void) {
        this._callbacks.push(cb)
    },
    get position() {
        return { x: this.x16 * 16, y: this.y16 * 16 }
    },
    calculateRotationOffset(position: IPoint) {
        return {
            x: (position.x / 16 - this.x16) === 0 ? 0.5 : -0.5,
            y: (position.y / 16 - this.y16) === 0 ? 0.5 : -0.5
        }
    },

    recalculate(BPC: BlueprintContainer) {
        this.update(this._lastMousePos.x, this._lastMousePos.y, BPC)
    },
    update(x: number, y: number, BPC: BlueprintContainer) {
        this._lastMousePos = { x, y }
        const mousePositionInBP = {
            x: Math.abs(BPC.position.x - x) / BPC.zoomPan.getCurrentScale(),
            y: Math.abs(BPC.position.y - y) / BPC.zoomPan.getCurrentScale()
        }
        const gridCoordsOfCursor16 = {
            x: (mousePositionInBP.x - mousePositionInBP.x % 16) / 16,
            y: (mousePositionInBP.y - mousePositionInBP.y % 16) / 16
        }
        if (gridCoordsOfCursor16.x !== this.x16 || gridCoordsOfCursor16.y !== this.y16) {
            this.x = Math.floor(gridCoordsOfCursor16.x / 2)
            this.y = Math.floor(gridCoordsOfCursor16.y / 2)
            this.x16 = gridCoordsOfCursor16.x
            this.y16 = gridCoordsOfCursor16.y
            this._callbacks.forEach((cb: any) => cb())
        }
    }
}

let railMoveOffset: IPoint = { x: 0, y: 0 }

let openedGUIWindow: InventoryContainer | EditEntityContainer | undefined

const positionBPContainer = {
    x: 0,
    y: 32
}

const bpArea = {
    width: 400,
    height: 400
}

const sizeBPContainer = {
    width: bpArea.width * 32,
    height: bpArea.height * 32
}

let bp: Blueprint

const mouseStates = {
    NONE: 0,
    MOVING: 1,
    PAINTING: 2,
    PANNING: 3
}

const keyboard = {
    w: false,
    a: false,
    s: false,
    d: false,
    shift: false,
    movingViaWASD() {
        return this.w !== this.s || this.a !== this.d
    }
}

let currentMouseState = mouseStates.NONE

const copyData = {
    recipe: '',
    modules: []
}

let renderOnly = false

const UIColors = {
    primary: 0x303030,
    secondary: 0x181818,
    text: 0xFAFAFA,
    link: 0x03A9F4,
    accent: 0xFF8A65,
    background: 0x3A3A3A,
    slot: 0x9E9E9E
}

const fontFamily = '\'Roboto\', sans-serif'

export default {
    renderOnly,
    copyData,
    openedGUIWindow,
    inventoryContainer,
    editEntityContainer,
    BPC,
    app,
    keyboard,
    toolbarContainer,
    bpArea,
    positionBPContainer,
    sizeBPContainer,
    gridData,
    railMoveOffset,
    bp,
    mouseStates,
    currentMouseState,
    UIColors,
    fontFamily
}
