import { Component, Input, ContentChildren, QueryList, Renderer, NgModule, OnInit, OnDestroy, ViewChild, Inject, forwardRef, ElementRef } from '@angular/core';
import { CommonModule } from "@angular/common";
import { HammerGesturesManager } from '../core/touch';

export interface IListChild
{
    index: number;
}

// ====================== LIST ================================
// The `<ig-list>` directive is a list container for items and headers 
@Component({
    selector: 'ig-list',
    moduleId: module.id, // commonJS standard
    templateUrl: 'list-content.html'
})

export class List { 
    private _innerStyle: string = "ig-list";

    children: IListChild[] = [];
    get items() {
        return this.children.filter((item: IListChild) => {
            return item instanceof ListItem;
        });
    }

    get headers() {
        return this.children.filter((header: IListChild) => {
            return header instanceof ListHeader;
        });
    }

    constructor(private element: ElementRef) {        
    }

    removeChild(index: number) {
        this.children.splice(index, 1);
    }

    addChild(child: IListChild) {
        this.children.push(child);
    }
}

// ====================== HEADER ================================
// The `<ig-header>` directive is a header intended for row items in
// a `<ig-list>` container.
@Component({
    selector: 'ig-list-header',
    moduleId: module.id, // commonJS standard
    templateUrl: 'list-content.html'
})

export class ListHeader implements OnInit, IListChild {
    private _innerStyle: string = "ig-list__header";
    get index(): number {
        return this.list.children.indexOf(this);
    }

    constructor( @Inject(forwardRef(() => List)) private list: List, public element: ElementRef) { }

    public ngOnInit() {
        this.list.addChild(this);
    }
}

// ====================== ITEM ================================
// The `<ig-item>` directive is a container intended for row items in
// a `<ig-list>` container.
@Component({
    selector: 'ig-list-item',
    moduleId: module.id, // commonJS standard
    templateUrl: 'list-content.html'
})

export class ListItem implements OnInit, OnDestroy, IListChild {
    @ViewChild('wrapper') wrapper: ElementRef;

    private _VISIBLE_AREA_ON_FULL_PAN = 40; // in pixels
    private _FRACTION_OF_WIDTH_TO_TRIGGER_GRIP = 0.5; // as a fraction of the item width
    private _initialLeft: number = null;
    private _innerStyle: string = "ig-list__item";

    hidden: boolean = false;
    get index(): number {
        return this.list.children.indexOf(this);
    }

    get width() {
        if (this.element && this.element.nativeElement) {
            return this.element.nativeElement.offsetWidth;
        } else {
            return 0;
        }
    }

    get left() {
        return this.wrapper.nativeElement.offsetLeft;
    }
    set left(value: number) {
        var val = value + "";

        if (val.indexOf("px") == -1) {
            val += "px";
        }

        this.wrapper.nativeElement.style.left = val;
    }

    get maxLeft() {
        return -this.width + this._VISIBLE_AREA_ON_FULL_PAN;
    }

    @Input() href: string;
    @Input() options: Array<Object>

    constructor( @Inject(forwardRef(() => List)) private list: List, public element: ElementRef, private _renderer: Renderer) {
        
    }

    public ngOnInit() {
        this.list.addChild(this);

        this._addEventListeners();        

        // Fix for default value of touch-action: none, set by Hammer.js
        this.element.nativeElement.style.touchAction = "inherit";
    }

    public ngOnDestroy() {
        this.list.removeChild(this.index);        
    }

    private _addEventListeners() {
        // Do not attach pan events if there is no options - no need to pan the item
        if (this._renderer && this.options) {
            this._renderer.listen(this.element.nativeElement, 'panstart', (event) => { this.panStart(event); });
            this._renderer.listen(this.element.nativeElement, 'panmove', (event) => { this.panMove(event); });
            this._renderer.listen(this.element.nativeElement, 'panend', (event) => { this.panEnd(event); });
        }        
    }

    private cancelEvent(ev: HammerInput) {
        return this.left > 0 || this._initialLeft == null;
    }

    private panStart(ev: HammerInput) {
        this._initialLeft = this.left;
    }

    private panMove(ev: HammerInput) {
        var newLeft;

        if (this.cancelEvent(ev))
        { return; }

        newLeft = this._initialLeft + ev.deltaX;
        newLeft = newLeft > 0 ? 0 : newLeft < this.maxLeft ? this.maxLeft : newLeft;

        this.left = newLeft;
    }

    private panEnd(ev: HammerInput) {
        if (this.left > 0) {
            this.rightMagneticGrip();
        } else {
            this.magneticGrip();
        }

        this._initialLeft = null;
    }

    private magneticGrip() {
        var left = this.left,
            partialWidth = this.width * this._FRACTION_OF_WIDTH_TO_TRIGGER_GRIP;

        if (partialWidth && left < 0 && -left > partialWidth) {
            this.leftMagneticGrip();
        } else {
            this.rightMagneticGrip();
        }
    }

    private rightMagneticGrip() {
        this.left = 0;
    }

    private leftMagneticGrip() {
        this.left = this.maxLeft;
    }
}

@NgModule({
    declarations: [List, ListItem, ListHeader],
    imports: [CommonModule],
    exports: [List, ListItem, ListHeader]
})
export class ListModule {
}