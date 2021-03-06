import { Component } from "@angular/core";
import { ButtonModule } from "../../src/button/button";

@Component({
    selector: "button-sample",
    template: `
        <h3>Buttons</h3>
        <div style="margin: 0 20px">
            <span igButton="flat" igRipple>Flat</span>
        </div>
        <br>
        <div style="margin: 0 20px">
            <span igButton="raised" igRipple="white">Raised</span>
        </div>
        <br>
        <div style="margin: 0 20px">
            <span igButton="raised" igButtonColor="#FBB13C" igButtonBackground="#340068" igRipple="white">Raised Custom</span>
        </div>
        <br>
        <div style="margin: 0 20px">
            <span igButton="raised" igButtonColor="yellow" igButtonBackground="black" igRipple="yellow">Raised Custom</span>
        </div>
        <br>
        <div style="margin: 0 20px">
            <span igButton="gradient" igRipple="white">Gradient</span>
        </div>
        <br>
        <div style="margin: 0 20px">
            <span igButton="raised" [disabled]="true">Disabled</span>
        </div>
        <br>
        <div style="margin: 0 20px">
            <span igButton="fab" igRipple="white">
                <i class="material-icons">add</i>
            </span>
        </div>
        <br>
        <div style="margin: 0 20px">
            <span igButton="fab" igButtonColor="#484848" igButtonBackground="white" igRipple="#484848">
                <i class="material-icons">edit</i>
            </span>
        </div>
        <div style="display: flex; flex-wrap: row; padding: 10px 0">
            <span igButton="icon" igRipple igRippleCentered="true">
                <i class="material-icons">search</i>
            </span>
            <span igButton="icon" igRipple igButtonColor="#E41C77" igRippleCentered="true">
                <i class="material-icons">favorite</i>
            </span>
            <span igButton="icon" igRipple igRippleCentered="true">
                <i class="material-icons">more_vert</i>
            </span>
        </div>
    `
})

export class ButtonsSampleComponent { }