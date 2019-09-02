import videojs from 'video.js';

/*
 * Polyfill for adding CustomEvent
 * see : https://developer.mozilla.org/fr/docs/Web/API/CustomEvent
 */

if (!window.CustomEvent) { // Create only if it doesn't exist
  (function () {
    function CustomEvent ( event, params ) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      const evt = document.createEvent( 'CustomEvent' );
      evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
      return evt;
    };

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
  })();
}

// Concrete classes
const VideoJsMenuItemClass = videojs.getComponent('MenuItem');

/**
 * Extend vjs menu item class.
 */
export default class ConcreteMenuItem extends VideoJsMenuItemClass {

    /**
     * Menu item constructor.
     *
     * @param {Player} player - vjs player
     * @param {Object} item - Item object
     * @param {ConcreteButton} qualityButton - The containing button.
     * @param {HlsQualitySelectorPlugin} plugin - This plugin instance.
     */
  constructor(player, item, qualityButton, plugin) {
    super(player, {
      label: item.label,
      selectable: true,
      selected: item.selected || false
    });
    this.item = item;
    this.qualityButton = qualityButton;
    this.plugin = plugin;
  }

    /**
     * Click event for menu item.
     */
  handleClick() {
    const quality = this.item.value;
    const event = new CustomEvent('videoQualityChanged', {detail: quality});

    // Reset other menu items selected status.
    for (let i = 0; i < this.qualityButton.items.length; ++i) {
      this.qualityButton.items[i].selected(false);
    }

        // Set this menu item to selected, and set quality.
    this.plugin.setQuality(this.item.value);
    this.selected(true);
    window.dispatchEvent(event);

  }
}
