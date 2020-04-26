/* global customElements */

// Import the LitElement base class and html helper function
import { LitElement, html, css } from 'lit-element';

class ShibuiDropdown extends LitElement {
  static get properties() {
    return {
      /**
       * Determines whether the dropdown is opened or closed
       */
      opened: {
        type: Boolean,
        reflect: true
      },

      /**
       * Whether to align the dropdown to the 'right', 'center', or 'left' of its 'target'
       */
      alignment: {
        type: String
      },  
      /**
       * The buffer from the edge of the page
       */
      buffer: {
        type: Number,
      }
    };
  }

  static get styles() {
      return css`
        :host {
          background: var(--shibui-dropdown-background, white);
          z-index: var(--shibui-dropdown-zindex, 9999);

          display: inline-flex;
          font-size: 14px;
          position: fixed;
          width: auto;
          border-radius: 3px;
          box-shadow: 0 3px 20px rgba(89, 105, 129, 0.3), 0 1px 2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(89, 105, 129, .1);
          white-space: nowrap;
          overflow: hidden;

          opacity: 0;
          pointer-events: none;
          transition: ease 0.1s;
          transition-property: transform, opacity;
          transform: translateY(-10px);

          flex-direction: column;
          justify-content: center; 
          @apply --shibui-dropdown-content;
        }

        :host([opened]) {
          opacity: 1;
          transform: translateY(0);
          pointer-events: all;

          user-select: none;
        }

        :host ::slotted(*) {
          color: var(--shibui-dropdown-color, black);

          position: relative;
          box-sizing: border-box;
          width: 100%;
          padding: 10px;
          text-decoration: none;
          cursor: pointer;
          border-bottom: 1px solid #EEF1F6;
        }

        :host ::slotted(*:hover) {
          background-color: #F7F8FB;
        }
    `;
}

  render() {

    return html`
            <slot id="content"></slot>
        `;
  }

  constructor() {
    super();
    this.alignment = 'right';
    this.opened = false;
    this.buffer = 10;
    this.target = null;
    this._close = this.close.bind( this );
    this._resize = this.resize.bind( this );

  }

  /**
   * Toggles the opened state of the dropdown
   */
  toggle() {
    this.opened = !this.opened;
  }

  /**
   * Opens the dropdown
   */
  open() {
    this.opened = true;
  }

  /**
   * Closes the dropdown
   */
  close() {
    this.opened = false;
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName == 'opened' && typeof oldValue !== 'undefined') {
        this._openedChanged();
      }
    });
  }

  resize() {
    var target = this.target || this.parentElement;

    if (!this.opened || !target) return;

    var rect = target.getBoundingClientRect();
    var left = rect.x;
    if (this.alignment === 'right') {
      left += rect.width - this.clientWidth;
    } else if (this.alignment === 'center') {
      left += (rect.width / 2) - (this.clientWidth / 2);
    }

    left = Math.min(window.innerWidth - this.clientWidth - this.buffer, left);
    left = Math.max(this.buffer, left);

    this.style.left = left + 'px';
    this.style.top = rect.y + rect.height + this.buffer + 'px';
  }

  _openedChanged() {
    console.log("Target="+this.target);
    if (this.opened) {
      this.resize();
      // Note: setTimeout is used to delay adding the event listener until after the current event is complete
      setTimeout(() => {
        document.addEventListener('click', this._close);
        window.addEventListener('resize', this._resize, {
          passive: true
        });
        window.addEventListener('scroll', this._resize, {
          passive: true
        });
      });
    } else {
      document.removeEventListener('click', this._close);
    }
  }
};

customElements.define('shibui-dropdown', ShibuiDropdown);