export default function EventManager(root) {
  this.root = root;
  this.typeHandlers = {};
}

EventManager.prototype = {
  /**
     * Registers event handlers for event types and
     * maps them to the provided target
     *
     * @param {String} type the type of event fired
     * (eg. click,focus)
     * @param {String} target a css compatible selector
     * that identifies a target HTMLElement for this
     * event
     * @param {Function} handler a handler function to
     * invoke when the event is triggered/fired
     */
  register(type, target, handler) {
    const
      eventType = this.typeHandlers[type] || {};
    const targetHandlers = eventType[target] || [];

    if (!this.typeHandlers[type]) {
      this.listen(type);
    }

    if (targetHandlers.indexOf(handler) === -1) {
      targetHandlers.push(handler);
      eventType[target] = targetHandlers;
      this.typeHandlers[type] = Object.assign({}, this.typeHandlers[type] || {}, eventType);
    }
  },

  /**
     * Handles the capture phase of an event type
     *
     * @param {String} eventType the type of
     * event that was fired
     * @param {Event} event the actual event object
     */
  capture(eventType, event) {
    if ((['click', 'touch'].indexOf(event.type) > -1) && event.detail === 0) {
      return false;
    }

    let el = event.target;
    while (el && !event.cancelBubble) {
      if (el === this.root) {
        this.bubble(eventType, el, event);
        break;
      }

      this.bubble(eventType, el, event);
      el = el.parentElement;
    }
  },

  /**
     * Handles the execution of all event handlers on
     * the event target for the given event type (
     * Simulates the bubble phase of event handling)
     *
     * @param {String} type - the type of
     * event that was fired
     * @param {HTMLElement} target - the current
     * target element on which the event is being
     * handled
     * @param {Event} event - the actual event object
     */
  bubble(type, target, event) {
    for (const pattern in this.typeHandlers[type]) {
      if (target.matches(`${pattern}`)) {
        Object.defineProperty(event, 'currentTarget', {
          value: target,
        });
        this.typeHandlers[type][pattern].forEach((handler) => {
          handler.call(target, event);
        });
      }
    }
  },

  /**
     * Adds an event type to the internal map of
     * monitored events
     *
     * @param {String} eventType - the type of event
     */
  listen(eventType) {
    const self = this;
    this.root.addEventListener(eventType, e => self.capture(eventType, e));
  },

};
