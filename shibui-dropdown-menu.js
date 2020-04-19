/* global customElements */

// Import the LitElement base class and html helper function
import { LitElement, html, css } from 'lit-element';
import './shibui-dropdown.js';

// Extend the LitElement base class
class ShibuiDropdownMenu extends LitElement {

    static get properties() {
        return {
            /**
             * Determines whether the dropdown is opened or closed
             */
            opened: {
                type: Boolean,
                notify: true,
                reflect: true
            },

            /**
             * Whether to align the dropdown to the 'right' or 'left' of the trigger
             */
            alignment: {
                type: String,
                reflect: true
            }
        };
    }

    static get styles() {
        return css`
            :host {
                display: inline-block;
                position: relative;
            }

            .trigger ::slotted(*) {
                cursor: pointer;
            }
        `;
    }

    render() {

        return html`
            <div class="trigger" @click="${this._toggle}">
              <slot id="trigger" name="trigger"></slot>
            </div>
            <shibui-dropdown id="dropdown" ?opened=${this.opened} alignment="${this.alignment}" target="${this._target}">
                <slot></slot>
            </shibui-dropdown>
        `;
    }

    constructor() {
        super();
        this.alignment = 'right';
        this.opened = false;
    }

    connectedCallback() {
        super.connectedCallback();
        this._target = this._triggerElement;
    }

    _toggle() {
        this.shadowRoot.querySelector("#dropdown").toggle();
    }
}
;
// Register the new element with the browser.
customElements.define('shibui-dropdown-menu', ShibuiDropdownMenu);
