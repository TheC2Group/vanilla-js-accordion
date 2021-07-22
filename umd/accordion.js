/*!
 * vanilla-js-accordion
 * undefined
 * @version 1.1.3
 * @license MIT (c) The C2 Group (c2experience.com)
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Accordion = factory());
}(this, function () { 'use strict';

    var count = 0;
    var defaults = {
      item: '.item',
      target: '.target',
      control: '.target',
      panel: '.panel',
      allowMultiple: true,
      attribute: 'data-status',
      expanded: 'expanded',
      contracted: 'contracted',
      prefix: 'Accordion-',
      transition: 'height .3s',
      setFocus: 'none',
      // options: none, item, panel, target, control, first
      hashEnabled: true
    }; // Pass in the objects to merge as arguments.
    // For a deep extend, set the first argument to `true`.

    var extend = function extend() {
      // Variables
      var extended = {};
      var deep = false;
      var i = 0;
      var length = arguments.length; // Check if a deep merge

      if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
        deep = arguments[0];
        i++;
      } // Merge the object into the extended object


      var merge = function merge(obj) {
        for (var prop in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            // If deep merge and property is an object, merge properties
            if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
              extended[prop] = extend(true, extended[prop], obj[prop]);
            } else {
              extended[prop] = obj[prop];
            }
          }
        }
      }; // Loop through each object and conduct a merge


      for (; i < length; i++) {
        var obj = arguments[i];
        merge(obj);
      }

      return extended;
    };

    var focusPreviousTarget = function focusPreviousTarget(index) {
      var previous = index - 1;

      if (previous < 0) {
        previous = this.items.length - 1;
      }

      this.items[previous].target.focus();
    };

    var focusNextTarget = function focusNextTarget(index) {
      var next = index + 1;

      if (next >= this.items.length) {
        next = 0;
      }

      this.items[next].target.focus();
    };

    var setFocusEnd = function setFocusEnd(item) {
      var target = this.opts.setFocus;

      switch (target) {
        case 'item':
          item.el.focus();
          break;

        case 'panel':
        case 'target':
        case 'control':
          item[target].focus();
          break;

        case 'first':
          item.panel.querySelector('a, :input').focus();
          break;
      }
    };

    var transitionEnd = function transitionEnd(index) {
      var thisItem = this.items[index];
      thisItem.el.removeAttribute('style');

      if (thisItem.isExpanded) {
        setFocusEnd.call(this, thisItem);
      } else {
        thisItem.panel.setAttribute('aria-hidden', 'true');
        thisItem.el.setAttribute(this.opts.attribute, this.opts.contracted);
        thisItem.target.setAttribute('aria-expanded', 'false');

        if (!this.opts.allowMultiple) {
          thisItem.target.setAttribute('aria-selected', 'false');
        }
      }

      thisItem.inTransition = false;
    };

    var expand = function expand(index) {
      var thisItem = this.items[index];
      if (thisItem.isExpanded) return;
      var controlHeight = thisItem.control.offsetHeight;

      if (!thisItem.inTransition) {
        thisItem.el.style.height = controlHeight.toString() + 'px'; //repaint for iOS, kind of a hack

        thisItem.el.getBoundingClientRect();
        thisItem.el.style.transition = this.opts.transition;
        thisItem.inTransition = true;
      }

      thisItem.el.setAttribute(this.opts.attribute, this.opts.expanded);
      thisItem.target.setAttribute('aria-expanded', 'true');

      if (!this.opts.allowMultiple) {
        thisItem.target.setAttribute('aria-selected', 'true');
      }

      thisItem.panel.setAttribute('aria-hidden', 'false');
      var panelHeight = thisItem.panel.offsetHeight;
      var totalHeight = controlHeight + panelHeight;
      thisItem.el.style.height = totalHeight.toString() + 'px';
      thisItem.isExpanded = true;

      if (this.opts.setFocus === 'target') {
        thisItem.target.focus();
      }
    };

    var contract = function contract(index) {
      var thisItem = this.items[index];
      if (!thisItem.isExpanded) return;
      var controlHeight = thisItem.control.offsetHeight;

      if (!thisItem.inTransition) {
        var panelHeight = thisItem.panel.offsetHeight;
        var totalHeight = controlHeight + panelHeight;
        thisItem.el.style.height = totalHeight.toString() + 'px'; // repaint for iOS, kind of a hack

        thisItem.el.getBoundingClientRect();
        thisItem.el.style.transition = this.opts.transition;
        thisItem.inTransition = true;
      }

      thisItem.el.style.height = controlHeight.toString() + 'px';
      thisItem.isExpanded = false;
    };

    var contractAll = function contractAll(skip) {
      var self = this;
      this.items.forEach(function (item, i) {
        if (i === skip) return;

        if (item.isExpanded) {
          contract.call(self, i);
        }
      });
    };

    var expandAll = function expandAll() {
      var self = this;
      this.items.forEach(function (item, i) {
        if (!item.isExpanded) {
          expand.call(self, i);
        }
      });
    };

    var activate = function activate(index) {
      var thisItem = this.items[index];

      if (thisItem.isExpanded) {
        contract.call(this, index);
        return;
      }

      if (!this.opts.allowMultiple) {
        contractAll.call(this, index);
      }

      expand.call(this, index);
    };

    var keyEvent = function keyEvent(e, index) {
      // enter, space
      if (e.which === 13 || e.which === 32) {
        e.preventDefault();
        activate.call(this, index);
        return;
      } // end


      if (e.which === 35) {
        e.preventDefault();
        this.items[this.items.length - 1].target.focus();
        return;
      } // home


      if (e.which === 36) {
        e.preventDefault();
        this.items[0].target.focus();
        return;
      } // left arrow, up arrow


      if (e.which === 37 || e.which === 38) {
        e.preventDefault();
        focusPreviousTarget.call(this, index);
        return;
      } // right arrow, down arrow


      if (e.which === 39 || e.which === 40) {
        e.preventDefault();
        focusNextTarget.call(this, index);
        return;
      }
    };

    var bindEvents = function bindEvents() {
      var self = this;
      this.items.forEach(function (item, i) {
        item.target.addEventListener('click', function (e) {
          if (!self._enabled) return;
          e.preventDefault();
          activate.call(self, i);
        });
        item.el.addEventListener('transitionend', function (e) {
          if (!self._enabled || e.target !== e.currentTarget) return;
          transitionEnd.call(self, i);
        });
        item.target.addEventListener('keydown', function (e) {
          if (!self._enabled) return;
          keyEvent.call(self, e, i);
        });
      });
      window.addEventListener('hashchange', function () {
        if (self.opts.hashEnabled && self._enabled) {
          checkHash.call(self);
        }
      });
    };

    var unbindEvents = function unbindEvents() {
      this.items.forEach(function (item, i) {
        item.target.removeEventListener('click', activate);
        item.target.removeEventListener('keydown', keyEvent);
        item.el.removeEventListener('transitionend', transitionEnd);
      });
      this._enabled = false;
    };

    var createItems = function createItems() {
      var self = this;
      var itemArray = Array.from(this.el.querySelectorAll(this.opts.item));
      return itemArray.map(function (item, i) {
        var el = item;
        var target = el.querySelector(self.opts.target);
        var control = self.opts.target === self.opts.control ? target : el.querySelector(self.opts.control);
        var panel = el.querySelector(self.opts.panel);

        if (!target.hasAttribute('role')) {
          target.setAttribute('role', 'tab');
        }

        if (!panel.hasAttribute('role')) {
          panel.setAttribute('role', 'tabpanel');
        }

        var attribute = el.getAttribute(self.opts.attribute);
        var isExpanded = attribute === self.opts.expanded;

        if (!attribute) {
          el.setAttribute(self.opts.attribute, isExpanded ? self.opts.expanded : self.opts.contracted);
        }

        target.setAttribute('aria-expanded', isExpanded);

        if (!self.opts.allowMultiple) {
          target.setAttribute('aria-selected', isExpanded);
        }

        panel.setAttribute('aria-hidden', !isExpanded);

        switch (self.opts.setFocus) {
          case 'item':
            if (el.hasAttribute('tabindex')) return;
            el.setAttribute('tabindex', '-1');
            break;

          case 'panel':
            if (panel.hasAttribute('tabindex')) return;
            panel.setAttribute('tabindex', '-1');
            break;

          case 'target':
            if (target.hasAttribute('tabindex')) return;
            target.setAttribute('tabindex', '0');
            break;

          case 'control':
            if (control.hasAttribute('tabindex')) return;
            control.setAttribute('tabindex', '-1');
            break;
        }

        var id = target.getAttribute('id');

        if (!id) {
          id = self.opts.prefix + self.count + '-' + (i + 1);
          target.setAttribute('id', id);
        }

        if (!panel.hasAttribute('aria-labelledby')) {
          panel.setAttribute('aria-labelledby', id);
        }

        return {
          el: item,
          target: target,
          control: control,
          panel: panel,
          isExpanded: isExpanded,
          inTransition: false
        };
      });
    };

    var removeAriaAttributes = function removeAriaAttributes() {
      var self = this;
      this.el.removeAttribute('role');
      this.el.removeAttribute('aria-multiselectable');
      this.el.querySelectorAll(this.opts.item).forEach(function (el) {
        var target = el.querySelector(self.opts.target);
        var control = self.opts.target === self.opts.control ? target : el.querySelector(self.opts.control);
        var panel = el.querySelector(self.opts.panel);
        el.removeAttribute('tabindex');
        target.removeAttribute('role');
        target.removeAttribute('aria-expanded');
        target.removeAttribute('aria-selected');
        target.removeAttribute('tabindex');
        panel.removeAttribute('role');
        panel.removeAttribute('aria-hidden');
        panel.removeAttribute('tabindex');
        control.removeAttribute('tabindex');
      });
    };

    var destroy = function destroy() {
      removeAriaAttributes.call(this);
      unbindEvents.call(this);
    };

    var checkHash = function checkHash() {
      var self = this;

      if (document.location.hash) {
        var hashKey = document.location.hash.split('#')[1];
        self.items.forEach(function (item, i) {
          var thisHash = item.target.getAttribute('id');

          if (thisHash === hashKey) {
            activate.call(self, i);
          }
        });
      }
    };

    var Group = function Group(el, options) {
      count += 1;
      this.count = count;
      this.el = el;
      this.opts = extend(defaults, options);
      this._enabled = true;

      if (!this.el.hasAttribute('role')) {
        this.el.setAttribute('role', 'tablist');
      }

      if (this.opts.allowMultiple) {
        this.el.setAttribute('aria-multiselectable', 'true');
      }

      this.items = createItems.call(this);
      bindEvents.call(this);

      if (this.opts.hashEnabled) {
        checkHash.call(this);
      }
    };

    Group.prototype.activate = activate;
    Group.prototype.expand = expand;
    Group.prototype.contract = contract;
    Group.prototype.contractAll = contractAll;
    Group.prototype.expandAll = expandAll;

    Group.prototype.enable = function () {
      this._enabled = true;
      return this;
    };

    Group.prototype.disable = function () {
      this._enabled = false;
      return this;
    };

    Group.prototype.destroy = destroy;

    return Group;

}));
