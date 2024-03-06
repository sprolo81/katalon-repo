if ((typeof window.katalonpw == "undefined")) {
  (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
    const { InjectedScript } = require("./tmp/injectedScript.js");
    window.katalonpw = {
      InjectedScript: InjectedScript(),
    };
    
    },{"./tmp/injectedScript.js":2}],2:[function(require,module,exports){
    
    var __export = (target, all) => {for (var name in all) target[name] = all[name];};
    var __toCommonJS = mod => ({ ...mod, __esModule: true });
    // packages/playwright-core/src/server/injected/injectedScript.ts
    var injectedScript_exports = {};
    __export(injectedScript_exports, {
      InjectedScript: () => InjectedScript
    });
    module.exports = __toCommonJS(injectedScript_exports);
    
    // packages/playwright-core/src/server/injected/xpathSelectorEngine.ts
    var XPathEngine = {
      queryAll(root, selector) {
        if (selector.startsWith("/") && root.nodeType !== Node.DOCUMENT_NODE)
          selector = "." + selector;
        const result = [];
        const document = root.ownerDocument || root;
        if (!document)
          return result;
        const it = document.evaluate(selector, root, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE);
        for (let node = it.iterateNext(); node; node = it.iterateNext()) {
          if (node.nodeType === Node.ELEMENT_NODE)
            result.push(node);
        }
        return result;
      }
    };
    
    // packages/playwright-core/src/server/injected/domUtils.ts
    function isInsideScope(scope, element) {
      while (element) {
        if (scope.contains(element))
          return true;
        element = enclosingShadowHost(element);
      }
      return false;
    }
    function parentElementOrShadowHost(element) {
      if (element.parentElement)
        return element.parentElement;
      if (!element.parentNode)
        return;
      if (element.parentNode.nodeType === 11 && element.parentNode.host)
        return element.parentNode.host;
    }
    function enclosingShadowRootOrDocument(element) {
      let node = element;
      while (node.parentNode)
        node = node.parentNode;
      if (node.nodeType === 11 || node.nodeType === 9)
        return node;
    }
    function enclosingShadowHost(element) {
      while (element.parentElement)
        element = element.parentElement;
      return parentElementOrShadowHost(element);
    }
    function closestCrossShadow(element, css, scope) {
      while (element) {
        const closest = element.closest(css);
        if (scope && closest !== scope && (closest == null ? void 0 : closest.contains(scope)))
          return;
        if (closest)
          return closest;
        element = enclosingShadowHost(element);
      }
    }
    function getElementComputedStyle(element, pseudo) {
      return element.ownerDocument && element.ownerDocument.defaultView ? element.ownerDocument.defaultView.getComputedStyle(element, pseudo) : void 0;
    }
    function isElementStyleVisibilityVisible(element, style) {
      style = style != null ? style : getElementComputedStyle(element);
      if (!style)
        return true;
      if (Element.prototype.checkVisibility) {
        if (!element.checkVisibility({ checkOpacity: false, checkVisibilityCSS: false }))
          return false;
      } else {
        const detailsOrSummary = element.closest("details,summary");
        if (detailsOrSummary !== element && (detailsOrSummary == null ? void 0 : detailsOrSummary.nodeName) === "DETAILS" && !detailsOrSummary.open)
          return false;
      }
      if (style.visibility !== "visible")
        return false;
      return true;
    }
    function isElementVisible(element) {
      const style = getElementComputedStyle(element);
      if (!style)
        return true;
      if (style.display === "contents") {
        for (let child = element.firstChild; child; child = child.nextSibling) {
          if (child.nodeType === 1 && isElementVisible(child))
            return true;
          if (child.nodeType === 3 && isVisibleTextNode(child))
            return true;
        }
        return false;
      }
      if (!isElementStyleVisibilityVisible(element, style))
        return false;
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }
    function isVisibleTextNode(node) {
      const range = node.ownerDocument.createRange();
      range.selectNode(node);
      const rect = range.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }
    
    // packages/playwright-core/src/server/injected/roleUtils.ts
    function hasExplicitAccessibleName(e) {
      return e.hasAttribute("aria-label") || e.hasAttribute("aria-labelledby");
    }
    var kAncestorPreventingLandmark = "article:not([role]), aside:not([role]), main:not([role]), nav:not([role]), section:not([role]), [role=article], [role=complementary], [role=main], [role=navigation], [role=region]";
    var kGlobalAriaAttributes = [
      "aria-atomic",
      "aria-busy",
      "aria-controls",
      "aria-current",
      "aria-describedby",
      "aria-details",
      "aria-disabled",
      "aria-dropeffect",
      "aria-errormessage",
      "aria-flowto",
      "aria-grabbed",
      "aria-haspopup",
      "aria-hidden",
      "aria-invalid",
      "aria-keyshortcuts",
      "aria-label",
      "aria-labelledby",
      "aria-live",
      "aria-owns",
      "aria-relevant",
      "aria-roledescription"
    ];
    function hasGlobalAriaAttribute(e) {
      return kGlobalAriaAttributes.some((a) => e.hasAttribute(a));
    }
    var kImplicitRoleByTagName = {
      "A": (e) => {
        return e.hasAttribute("href") ? "link" : null;
      },
      "AREA": (e) => {
        return e.hasAttribute("href") ? "link" : null;
      },
      "ARTICLE": () => "article",
      "ASIDE": () => "complementary",
      "BLOCKQUOTE": () => "blockquote",
      "BUTTON": () => "button",
      "CAPTION": () => "caption",
      "CODE": () => "code",
      "DATALIST": () => "listbox",
      "DD": () => "definition",
      "DEL": () => "deletion",
      "DETAILS": () => "group",
      "DFN": () => "term",
      "DIALOG": () => "dialog",
      "DT": () => "term",
      "EM": () => "emphasis",
      "FIELDSET": () => "group",
      "FIGURE": () => "figure",
      "FOOTER": (e) => closestCrossShadow(e, kAncestorPreventingLandmark) ? null : "contentinfo",
      "FORM": (e) => hasExplicitAccessibleName(e) ? "form" : null,
      "H1": () => "heading",
      "H2": () => "heading",
      "H3": () => "heading",
      "H4": () => "heading",
      "H5": () => "heading",
      "H6": () => "heading",
      "HEADER": (e) => closestCrossShadow(e, kAncestorPreventingLandmark) ? null : "banner",
      "HR": () => "separator",
      "HTML": () => "document",
      "IMG": (e) => e.getAttribute("alt") === "" && !hasGlobalAriaAttribute(e) && Number.isNaN(Number(String(e.getAttribute("tabindex")))) ? "presentation" : "img",
      "INPUT": (e) => {
        const type = e.type.toLowerCase();
        if (type === "search")
          return e.hasAttribute("list") ? "combobox" : "searchbox";
        if (["email", "tel", "text", "url", ""].includes(type)) {
          const list = getIdRefs(e, e.getAttribute("list"))[0];
          return list && list.tagName === "DATALIST" ? "combobox" : "textbox";
        }
        if (type === "hidden")
          return "";
        return {
          "button": "button",
          "checkbox": "checkbox",
          "image": "button",
          "number": "spinbutton",
          "radio": "radio",
          "range": "slider",
          "reset": "button",
          "submit": "button"
        }[type] || "textbox";
      },
      "INS": () => "insertion",
      "LI": () => "listitem",
      "MAIN": () => "main",
      "MARK": () => "mark",
      "MATH": () => "math",
      "MENU": () => "list",
      "METER": () => "meter",
      "NAV": () => "navigation",
      "OL": () => "list",
      "OPTGROUP": () => "group",
      "OPTION": () => "option",
      "OUTPUT": () => "status",
      "P": () => "paragraph",
      "PROGRESS": () => "progressbar",
      "SECTION": (e) => hasExplicitAccessibleName(e) ? "region" : null,
      "SELECT": (e) => e.hasAttribute("multiple") || e.size > 1 ? "listbox" : "combobox",
      "STRONG": () => "strong",
      "SUB": () => "subscript",
      "SUP": () => "superscript",
      // For <svg> we default to Chrome behavior:
      // - Chrome reports 'img'.
      // - Firefox reports 'diagram' that is not in official ARIA spec yet.
      // - Safari reports 'no role', but still computes accessible name.
      "SVG": () => "img",
      "TABLE": () => "table",
      "TBODY": () => "rowgroup",
      "TD": (e) => {
        const table = closestCrossShadow(e, "table");
        const role = table ? getExplicitAriaRole(table) : "";
        return role === "grid" || role === "treegrid" ? "gridcell" : "cell";
      },
      "TEXTAREA": () => "textbox",
      "TFOOT": () => "rowgroup",
      "TH": (e) => {
        if (e.getAttribute("scope") === "col")
          return "columnheader";
        if (e.getAttribute("scope") === "row")
          return "rowheader";
        const table = closestCrossShadow(e, "table");
        const role = table ? getExplicitAriaRole(table) : "";
        return role === "grid" || role === "treegrid" ? "gridcell" : "cell";
      },
      "THEAD": () => "rowgroup",
      "TIME": () => "time",
      "TR": () => "row",
      "UL": () => "list"
    };
    var kPresentationInheritanceParents = {
      "DD": ["DL", "DIV"],
      "DIV": ["DL"],
      "DT": ["DL", "DIV"],
      "LI": ["OL", "UL"],
      "TBODY": ["TABLE"],
      "TD": ["TR"],
      "TFOOT": ["TABLE"],
      "TH": ["TR"],
      "THEAD": ["TABLE"],
      "TR": ["THEAD", "TBODY", "TFOOT", "TABLE"]
    };
    function getImplicitAriaRole(element) {
      var _a;
      const implicitRole = ((_a = kImplicitRoleByTagName[element.tagName.toUpperCase()]) == null ? void 0 : _a.call(kImplicitRoleByTagName, element)) || "";
      if (!implicitRole)
        return null;
      let ancestor = element;
      while (ancestor) {
        const parent = parentElementOrShadowHost(ancestor);
        const parents = kPresentationInheritanceParents[ancestor.tagName];
        if (!parents || !parent || !parents.includes(parent.tagName))
          break;
        const parentExplicitRole = getExplicitAriaRole(parent);
        if ((parentExplicitRole === "none" || parentExplicitRole === "presentation") && !hasPresentationConflictResolution(parent))
          return parentExplicitRole;
        ancestor = parent;
      }
      return implicitRole;
    }
    var allRoles = [
      "alert",
      "alertdialog",
      "application",
      "article",
      "banner",
      "blockquote",
      "button",
      "caption",
      "cell",
      "checkbox",
      "code",
      "columnheader",
      "combobox",
      "command",
      "complementary",
      "composite",
      "contentinfo",
      "definition",
      "deletion",
      "dialog",
      "directory",
      "document",
      "emphasis",
      "feed",
      "figure",
      "form",
      "generic",
      "grid",
      "gridcell",
      "group",
      "heading",
      "img",
      "input",
      "insertion",
      "landmark",
      "link",
      "list",
      "listbox",
      "listitem",
      "log",
      "main",
      "marquee",
      "math",
      "meter",
      "menu",
      "menubar",
      "menuitem",
      "menuitemcheckbox",
      "menuitemradio",
      "navigation",
      "none",
      "note",
      "option",
      "paragraph",
      "presentation",
      "progressbar",
      "radio",
      "radiogroup",
      "range",
      "region",
      "roletype",
      "row",
      "rowgroup",
      "rowheader",
      "scrollbar",
      "search",
      "searchbox",
      "section",
      "sectionhead",
      "select",
      "separator",
      "slider",
      "spinbutton",
      "status",
      "strong",
      "structure",
      "subscript",
      "superscript",
      "switch",
      "tab",
      "table",
      "tablist",
      "tabpanel",
      "term",
      "textbox",
      "time",
      "timer",
      "toolbar",
      "tooltip",
      "tree",
      "treegrid",
      "treeitem",
      "widget",
      "window"
    ];
    var abstractRoles = ["command", "composite", "input", "landmark", "range", "roletype", "section", "sectionhead", "select", "structure", "widget", "window"];
    var validRoles = allRoles.filter((role) => !abstractRoles.includes(role));
    function getExplicitAriaRole(element) {
      const roles = (element.getAttribute("role") || "").split(" ").map((role) => role.trim());
      return roles.find((role) => validRoles.includes(role)) || null;
    }
    function hasPresentationConflictResolution(element) {
      return !hasGlobalAriaAttribute(element);
    }
    function getAriaRole(element) {
      const explicitRole = getExplicitAriaRole(element);
      if (!explicitRole)
        return getImplicitAriaRole(element);
      if ((explicitRole === "none" || explicitRole === "presentation") && hasPresentationConflictResolution(element))
        return getImplicitAriaRole(element);
      return explicitRole;
    }
    function getAriaBoolean(attr) {
      return attr === null ? void 0 : attr.toLowerCase() === "true";
    }
    function isElementHiddenForAria(element) {
      if (["STYLE", "SCRIPT", "NOSCRIPT", "TEMPLATE"].includes(element.tagName))
        return true;
      const style = getElementComputedStyle(element);
      const isSlot = element.nodeName === "SLOT";
      if ((style == null ? void 0 : style.display) === "contents" && !isSlot) {
        for (let child = element.firstChild; child; child = child.nextSibling) {
          if (child.nodeType === 1 && !isElementHiddenForAria(child))
            return false;
          if (child.nodeType === 3 && isVisibleTextNode(child))
            return false;
        }
        return true;
      }
      const isOptionInsideSelect = element.nodeName === "OPTION" && !!element.closest("select");
      if (!isOptionInsideSelect && !isSlot && !isElementStyleVisibilityVisible(element, style))
        return true;
      return belongsToDisplayNoneOrAriaHiddenOrNonSlotted(element);
    }
    function belongsToDisplayNoneOrAriaHiddenOrNonSlotted(element) {
      let hidden = cacheIsHidden == null ? void 0 : cacheIsHidden.get(element);
      if (hidden === void 0) {
        hidden = false;
        if (element.parentElement && element.parentElement.shadowRoot && !element.assignedSlot)
          hidden = true;
        if (!hidden) {
          const style = getElementComputedStyle(element);
          hidden = !style || style.display === "none" || getAriaBoolean(element.getAttribute("aria-hidden")) === true;
        }
        if (!hidden) {
          const parent = parentElementOrShadowHost(element);
          if (parent)
            hidden = belongsToDisplayNoneOrAriaHiddenOrNonSlotted(parent);
        }
        cacheIsHidden == null ? void 0 : cacheIsHidden.set(element, hidden);
      }
      return hidden;
    }
    function getIdRefs(element, ref) {
      if (!ref)
        return [];
      const root = enclosingShadowRootOrDocument(element);
      if (!root)
        return [];
      try {
        const ids = ref.split(" ").filter((id) => !!id);
        const set = /* @__PURE__ */ new Set();
        for (const id of ids) {
          const firstElement = root.querySelector("#" + CSS.escape(id));
          if (firstElement)
            set.add(firstElement);
        }
        return [...set];
      } catch (e) {
        return [];
      }
    }
    function normalizeAccessbileName(s) {
      return s.replace(/\r\n/g, "\n").replace(/\u00A0/g, " ").replace(/\s\s+/g, " ").trim();
    }
    function queryInAriaOwned(element, selector) {
      const result = [...element.querySelectorAll(selector)];
      for (const owned of getIdRefs(element, element.getAttribute("aria-owns"))) {
        if (owned.matches(selector))
          result.push(owned);
        result.push(...owned.querySelectorAll(selector));
      }
      return result;
    }
    function getPseudoContent(pseudoStyle) {
      if (!pseudoStyle)
        return "";
      const content = pseudoStyle.content;
      if (content[0] === "'" && content[content.length - 1] === "'" || content[0] === '"' && content[content.length - 1] === '"') {
        const unquoted = content.substring(1, content.length - 1);
        const display = pseudoStyle.display || "inline";
        if (display !== "inline")
          return " " + unquoted + " ";
        return unquoted;
      }
      return "";
    }
    function getAriaLabelledByElements(element) {
      const ref = element.getAttribute("aria-labelledby");
      if (ref === null)
        return null;
      return getIdRefs(element, ref);
    }
    function allowsNameFromContent(role, targetDescendant) {
      const alwaysAllowsNameFromContent = ["button", "cell", "checkbox", "columnheader", "gridcell", "heading", "link", "menuitem", "menuitemcheckbox", "menuitemradio", "option", "radio", "row", "rowheader", "switch", "tab", "tooltip", "treeitem"].includes(role);
      const descendantAllowsNameFromContent = targetDescendant && ["", "caption", "code", "contentinfo", "definition", "deletion", "emphasis", "insertion", "list", "listitem", "mark", "none", "paragraph", "presentation", "region", "row", "rowgroup", "section", "strong", "subscript", "superscript", "table", "term", "time"].includes(role);
      return alwaysAllowsNameFromContent || descendantAllowsNameFromContent;
    }
    function getElementAccessibleName(element, includeHidden) {
      const cache = includeHidden ? cacheAccessibleNameHidden : cacheAccessibleName;
      let accessibleName = cache == null ? void 0 : cache.get(element);
      if (accessibleName === void 0) {
        accessibleName = "";
        const elementProhibitsNaming = ["caption", "code", "definition", "deletion", "emphasis", "generic", "insertion", "mark", "paragraph", "presentation", "strong", "subscript", "suggestion", "superscript", "term", "time"].includes(getAriaRole(element) || "");
        if (!elementProhibitsNaming) {
          accessibleName = normalizeAccessbileName(getElementAccessibleNameInternal(element, {
            includeHidden,
            visitedElements: /* @__PURE__ */ new Set(),
            embeddedInLabelledBy: "none",
            embeddedInLabel: "none",
            embeddedInTextAlternativeElement: false,
            embeddedInTargetElement: "self"
          }));
        }
        cache == null ? void 0 : cache.set(element, accessibleName);
      }
      return accessibleName;
    }
    function getElementAccessibleNameInternal(element, options) {
      if (options.visitedElements.has(element))
        return "";
      const childOptions = {
        ...options,
        embeddedInLabel: options.embeddedInLabel === "self" ? "descendant" : options.embeddedInLabel,
        embeddedInLabelledBy: options.embeddedInLabelledBy === "self" ? "descendant" : options.embeddedInLabelledBy,
        embeddedInTargetElement: options.embeddedInTargetElement === "self" ? "descendant" : options.embeddedInTargetElement
      };
      if (!options.includeHidden && options.embeddedInLabelledBy !== "self" && isElementHiddenForAria(element)) {
        options.visitedElements.add(element);
        return "";
      }
      const labelledBy = getAriaLabelledByElements(element);
      if (options.embeddedInLabelledBy === "none") {
        const accessibleName = (labelledBy || []).map((ref) => getElementAccessibleNameInternal(ref, {
          ...options,
          embeddedInLabelledBy: "self",
          embeddedInTargetElement: "none",
          embeddedInLabel: "none",
          embeddedInTextAlternativeElement: false
        })).join(" ");
        if (accessibleName)
          return accessibleName;
      }
      const role = getAriaRole(element) || "";
      if (options.embeddedInLabel !== "none" || options.embeddedInLabelledBy !== "none") {
        const isOwnLabel = [...element.labels || []].includes(element);
        const isOwnLabelledBy = (labelledBy || []).includes(element);
        if (!isOwnLabel && !isOwnLabelledBy) {
          if (role === "textbox") {
            options.visitedElements.add(element);
            if (element.tagName === "INPUT" || element.tagName === "TEXTAREA")
              return element.value;
            return element.textContent || "";
          }
          if (["combobox", "listbox"].includes(role)) {
            options.visitedElements.add(element);
            let selectedOptions;
            if (element.tagName === "SELECT") {
              selectedOptions = [...element.selectedOptions];
              if (!selectedOptions.length && element.options.length)
                selectedOptions.push(element.options[0]);
            } else {
              const listbox = role === "combobox" ? queryInAriaOwned(element, "*").find((e) => getAriaRole(e) === "listbox") : element;
              selectedOptions = listbox ? queryInAriaOwned(listbox, '[aria-selected="true"]').filter((e) => getAriaRole(e) === "option") : [];
            }
            return selectedOptions.map((option) => getElementAccessibleNameInternal(option, childOptions)).join(" ");
          }
          if (["progressbar", "scrollbar", "slider", "spinbutton", "meter"].includes(role)) {
            options.visitedElements.add(element);
            if (element.hasAttribute("aria-valuetext"))
              return element.getAttribute("aria-valuetext") || "";
            if (element.hasAttribute("aria-valuenow"))
              return element.getAttribute("aria-valuenow") || "";
            return element.getAttribute("value") || "";
          }
          if (["menu"].includes(role)) {
            options.visitedElements.add(element);
            return "";
          }
        }
      }
      const ariaLabel = element.getAttribute("aria-label") || "";
      if (ariaLabel.trim()) {
        options.visitedElements.add(element);
        return ariaLabel;
      }
      if (!["presentation", "none"].includes(role)) {
        if (element.tagName === "INPUT" && ["button", "submit", "reset"].includes(element.type)) {
          options.visitedElements.add(element);
          const value = element.value || "";
          if (value.trim())
            return value;
          if (element.type === "submit")
            return "Submit";
          if (element.type === "reset")
            return "Reset";
          const title = element.getAttribute("title") || "";
          return title;
        }
        if (element.tagName === "INPUT" && element.type === "image") {
          options.visitedElements.add(element);
          const labels = element.labels || [];
          if (labels.length && options.embeddedInLabelledBy === "none")
            return getAccessibleNameFromAssociatedLabels(labels, options);
          const alt = element.getAttribute("alt") || "";
          if (alt.trim())
            return alt;
          const title = element.getAttribute("title") || "";
          if (title.trim())
            return title;
          return "Submit";
        }
        if (!labelledBy && element.tagName === "BUTTON") {
          options.visitedElements.add(element);
          const labels = element.labels || [];
          if (labels.length)
            return getAccessibleNameFromAssociatedLabels(labels, options);
        }
        if (!labelledBy && element.tagName === "OUTPUT") {
          options.visitedElements.add(element);
          const labels = element.labels || [];
          if (labels.length)
            return getAccessibleNameFromAssociatedLabels(labels, options);
          return element.getAttribute("title") || "";
        }
        if (!labelledBy && (element.tagName === "TEXTAREA" || element.tagName === "SELECT" || element.tagName === "INPUT")) {
          options.visitedElements.add(element);
          const labels = element.labels || [];
          if (labels.length)
            return getAccessibleNameFromAssociatedLabels(labels, options);
          const usePlaceholder = element.tagName === "INPUT" && ["text", "password", "search", "tel", "email", "url"].includes(element.type) || element.tagName === "TEXTAREA";
          const placeholder = element.getAttribute("placeholder") || "";
          const title = element.getAttribute("title") || "";
          if (!usePlaceholder || title)
            return title;
          return placeholder;
        }
        if (!labelledBy && element.tagName === "FIELDSET") {
          options.visitedElements.add(element);
          for (let child = element.firstElementChild; child; child = child.nextElementSibling) {
            if (child.tagName === "LEGEND") {
              return getElementAccessibleNameInternal(child, {
                ...childOptions,
                embeddedInTextAlternativeElement: true
              });
            }
          }
          const title = element.getAttribute("title") || "";
          return title;
        }
        if (!labelledBy && element.tagName === "FIGURE") {
          options.visitedElements.add(element);
          for (let child = element.firstElementChild; child; child = child.nextElementSibling) {
            if (child.tagName === "FIGCAPTION") {
              return getElementAccessibleNameInternal(child, {
                ...childOptions,
                embeddedInTextAlternativeElement: true
              });
            }
          }
          const title = element.getAttribute("title") || "";
          return title;
        }
        if (element.tagName === "IMG") {
          options.visitedElements.add(element);
          const alt = element.getAttribute("alt") || "";
          if (alt.trim())
            return alt;
          const title = element.getAttribute("title") || "";
          return title;
        }
        if (element.tagName === "TABLE") {
          options.visitedElements.add(element);
          for (let child = element.firstElementChild; child; child = child.nextElementSibling) {
            if (child.tagName === "CAPTION") {
              return getElementAccessibleNameInternal(child, {
                ...childOptions,
                embeddedInTextAlternativeElement: true
              });
            }
          }
          const summary = element.getAttribute("summary") || "";
          if (summary)
            return summary;
        }
        if (element.tagName === "AREA") {
          options.visitedElements.add(element);
          const alt = element.getAttribute("alt") || "";
          if (alt.trim())
            return alt;
          const title = element.getAttribute("title") || "";
          return title;
        }
        if (element.tagName.toUpperCase() === "SVG" || element.ownerSVGElement) {
          options.visitedElements.add(element);
          for (let child = element.firstElementChild; child; child = child.nextElementSibling) {
            if (child.tagName.toUpperCase() === "TITLE" && child.ownerSVGElement) {
              return getElementAccessibleNameInternal(child, {
                ...childOptions,
                embeddedInLabelledBy: "self"
              });
            }
          }
        }
        if (element.ownerSVGElement && element.tagName.toUpperCase() === "A") {
          const title = element.getAttribute("xlink:title") || "";
          if (title.trim()) {
            options.visitedElements.add(element);
            return title;
          }
        }
      }
      if (allowsNameFromContent(role, options.embeddedInTargetElement === "descendant") || options.embeddedInLabelledBy !== "none" || options.embeddedInLabel !== "none" || options.embeddedInTextAlternativeElement) {
        options.visitedElements.add(element);
        const tokens = [];
        const visit = (node, skipSlotted) => {
          var _a;
          if (skipSlotted && node.assignedSlot)
            return;
          if (node.nodeType === 1) {
            const display = ((_a = getElementComputedStyle(node)) == null ? void 0 : _a.display) || "inline";
            let token = getElementAccessibleNameInternal(node, childOptions);
            if (display !== "inline" || node.nodeName === "BR")
              token = " " + token + " ";
            tokens.push(token);
          } else if (node.nodeType === 3) {
            tokens.push(node.textContent || "");
          }
        };
        tokens.push(getPseudoContent(getElementComputedStyle(element, "::before")));
        const assignedNodes = element.nodeName === "SLOT" ? element.assignedNodes() : [];
        if (assignedNodes.length) {
          for (const child of assignedNodes)
            visit(child, false);
        } else {
          for (let child = element.firstChild; child; child = child.nextSibling)
            visit(child, true);
          if (element.shadowRoot) {
            for (let child = element.shadowRoot.firstChild; child; child = child.nextSibling)
              visit(child, true);
          }
          for (const owned of getIdRefs(element, element.getAttribute("aria-owns")))
            visit(owned, true);
        }
        tokens.push(getPseudoContent(getElementComputedStyle(element, "::after")));
        const accessibleName = tokens.join("");
        if (accessibleName.trim())
          return accessibleName;
      }
      if (!["presentation", "none"].includes(role) || element.tagName === "IFRAME") {
        options.visitedElements.add(element);
        const title = element.getAttribute("title") || "";
        if (title.trim())
          return title;
      }
      options.visitedElements.add(element);
      return "";
    }
    var kAriaSelectedRoles = ["gridcell", "option", "row", "tab", "rowheader", "columnheader", "treeitem"];
    function getAriaSelected(element) {
      if (element.tagName === "OPTION")
        return element.selected;
      if (kAriaSelectedRoles.includes(getAriaRole(element) || ""))
        return getAriaBoolean(element.getAttribute("aria-selected")) === true;
      return false;
    }
    var kAriaCheckedRoles = ["checkbox", "menuitemcheckbox", "option", "radio", "switch", "menuitemradio", "treeitem"];
    function getAriaChecked(element) {
      const result = getChecked(element, true);
      return result === "error" ? false : result;
    }
    function getChecked(element, allowMixed) {
      if (allowMixed && element.tagName === "INPUT" && element.indeterminate)
        return "mixed";
      if (element.tagName === "INPUT" && ["checkbox", "radio"].includes(element.type))
        return element.checked;
      if (kAriaCheckedRoles.includes(getAriaRole(element) || "")) {
        const checked = element.getAttribute("aria-checked");
        if (checked === "true")
          return true;
        if (allowMixed && checked === "mixed")
          return "mixed";
        return false;
      }
      return "error";
    }
    var kAriaPressedRoles = ["button"];
    function getAriaPressed(element) {
      if (kAriaPressedRoles.includes(getAriaRole(element) || "")) {
        const pressed = element.getAttribute("aria-pressed");
        if (pressed === "true")
          return true;
        if (pressed === "mixed")
          return "mixed";
      }
      return false;
    }
    var kAriaExpandedRoles = ["application", "button", "checkbox", "combobox", "gridcell", "link", "listbox", "menuitem", "row", "rowheader", "tab", "treeitem", "columnheader", "menuitemcheckbox", "menuitemradio", "rowheader", "switch"];
    function getAriaExpanded(element) {
      if (element.tagName === "DETAILS")
        return element.open;
      if (kAriaExpandedRoles.includes(getAriaRole(element) || "")) {
        const expanded = element.getAttribute("aria-expanded");
        if (expanded === null)
          return "none";
        if (expanded === "true")
          return true;
        return false;
      }
      return "none";
    }
    var kAriaLevelRoles = ["heading", "listitem", "row", "treeitem"];
    function getAriaLevel(element) {
      const native = { "H1": 1, "H2": 2, "H3": 3, "H4": 4, "H5": 5, "H6": 6 }[element.tagName];
      if (native)
        return native;
      if (kAriaLevelRoles.includes(getAriaRole(element) || "")) {
        const attr = element.getAttribute("aria-level");
        const value = attr === null ? Number.NaN : Number(attr);
        if (Number.isInteger(value) && value >= 1)
          return value;
      }
      return 0;
    }
    var kAriaDisabledRoles = ["application", "button", "composite", "gridcell", "group", "input", "link", "menuitem", "scrollbar", "separator", "tab", "checkbox", "columnheader", "combobox", "grid", "listbox", "menu", "menubar", "menuitemcheckbox", "menuitemradio", "option", "radio", "radiogroup", "row", "rowheader", "searchbox", "select", "slider", "spinbutton", "switch", "tablist", "textbox", "toolbar", "tree", "treegrid", "treeitem"];
    function getAriaDisabled(element) {
      const isNativeFormControl = ["BUTTON", "INPUT", "SELECT", "TEXTAREA", "OPTION", "OPTGROUP"].includes(element.tagName);
      if (isNativeFormControl && (element.hasAttribute("disabled") || belongsToDisabledFieldSet(element)))
        return true;
      return hasExplicitAriaDisabled(element);
    }
    function belongsToDisabledFieldSet(element) {
      if (!element)
        return false;
      if (element.tagName === "FIELDSET" && element.hasAttribute("disabled"))
        return true;
      return belongsToDisabledFieldSet(element.parentElement);
    }
    function hasExplicitAriaDisabled(element) {
      if (!element)
        return false;
      if (kAriaDisabledRoles.includes(getAriaRole(element) || "")) {
        const attribute = (element.getAttribute("aria-disabled") || "").toLowerCase();
        if (attribute === "true")
          return true;
        if (attribute === "false")
          return false;
      }
      return hasExplicitAriaDisabled(parentElementOrShadowHost(element));
    }
    function getAccessibleNameFromAssociatedLabels(labels, options) {
      return [...labels].map((label) => getElementAccessibleNameInternal(label, {
        ...options,
        embeddedInLabel: "self",
        embeddedInTextAlternativeElement: false,
        embeddedInLabelledBy: "none",
        embeddedInTargetElement: "none"
      })).filter((accessibleName) => !!accessibleName).join(" ");
    }
    var cacheAccessibleName;
    var cacheAccessibleNameHidden;
    var cacheIsHidden;
    var cachesCounter = 0;
    function beginAriaCaches() {
      ++cachesCounter;
      cacheAccessibleName != null ? cacheAccessibleName : cacheAccessibleName = /* @__PURE__ */ new Map();
      cacheAccessibleNameHidden != null ? cacheAccessibleNameHidden : cacheAccessibleNameHidden = /* @__PURE__ */ new Map();
      cacheIsHidden != null ? cacheIsHidden : cacheIsHidden = /* @__PURE__ */ new Map();
    }
    function endAriaCaches() {
      if (!--cachesCounter) {
        cacheAccessibleName = void 0;
        cacheAccessibleNameHidden = void 0;
        cacheIsHidden = void 0;
      }
    }
    
    // packages/playwright-core/src/server/injected/selectorUtils.ts
    function matchesComponentAttribute(obj, attr) {
      for (const token of attr.jsonPath) {
        if (obj !== void 0 && obj !== null)
          obj = obj[token];
      }
      return matchesAttributePart(obj, attr);
    }
    function matchesAttributePart(value, attr) {
      const objValue = typeof value === "string" && !attr.caseSensitive ? value.toUpperCase() : value;
      const attrValue = typeof attr.value === "string" && !attr.caseSensitive ? attr.value.toUpperCase() : attr.value;
      if (attr.op === "<truthy>")
        return !!objValue;
      if (attr.op === "=") {
        if (attrValue instanceof RegExp)
          return typeof objValue === "string" && !!objValue.match(attrValue);
        return objValue === attrValue;
      }
      if (typeof objValue !== "string" || typeof attrValue !== "string")
        return false;
      if (attr.op === "*=")
        return objValue.includes(attrValue);
      if (attr.op === "^=")
        return objValue.startsWith(attrValue);
      if (attr.op === "$=")
        return objValue.endsWith(attrValue);
      if (attr.op === "|=")
        return objValue === attrValue || objValue.startsWith(attrValue + "-");
      if (attr.op === "~=")
        return objValue.split(" ").includes(attrValue);
      return false;
    }
    function shouldSkipForTextMatching(element) {
      const document = element.ownerDocument;
      return element.nodeName === "SCRIPT" || element.nodeName === "NOSCRIPT" || element.nodeName === "STYLE" || document.head && document.head.contains(element);
    }
    function elementText(cache, root) {
      let value = cache.get(root);
      if (value === void 0) {
        value = { full: "", immediate: [] };
        if (!shouldSkipForTextMatching(root)) {
          let currentImmediate = "";
          if (root instanceof HTMLInputElement && (root.type === "submit" || root.type === "button")) {
            value = { full: root.value, immediate: [root.value] };
          } else {
            for (let child = root.firstChild; child; child = child.nextSibling) {
              if (child.nodeType === Node.TEXT_NODE) {
                value.full += child.nodeValue || "";
                currentImmediate += child.nodeValue || "";
              } else {
                if (currentImmediate)
                  value.immediate.push(currentImmediate);
                currentImmediate = "";
                if (child.nodeType === Node.ELEMENT_NODE)
                  value.full += elementText(cache, child).full;
              }
            }
            if (currentImmediate)
              value.immediate.push(currentImmediate);
            if (root.shadowRoot)
              value.full += elementText(cache, root.shadowRoot).full;
          }
        }
        cache.set(root, value);
      }
      return value;
    }
    function elementMatchesText(cache, element, matcher) {
      if (shouldSkipForTextMatching(element))
        return "none";
      if (!matcher(elementText(cache, element)))
        return "none";
      for (let child = element.firstChild; child; child = child.nextSibling) {
        if (child.nodeType === Node.ELEMENT_NODE && matcher(elementText(cache, child)))
          return "selfAndChildren";
      }
      if (element.shadowRoot && matcher(elementText(cache, element.shadowRoot)))
        return "selfAndChildren";
      return "self";
    }
    function getElementLabels(textCache, element) {
      const labels = getAriaLabelledByElements(element);
      if (labels)
        return labels.map((label) => elementText(textCache, label));
      const ariaLabel = element.getAttribute("aria-label");
      if (ariaLabel !== null && !!ariaLabel.trim())
        return [{ full: ariaLabel, immediate: [ariaLabel] }];
      const isNonHiddenInput = element.nodeName === "INPUT" && element.type !== "hidden";
      if (["BUTTON", "METER", "OUTPUT", "PROGRESS", "SELECT", "TEXTAREA"].includes(element.nodeName) || isNonHiddenInput) {
        const labels2 = element.labels;
        if (labels2)
          return [...labels2].map((label) => elementText(textCache, label));
      }
      return [];
    }
    
    // packages/playwright-core/src/utils/isomorphic/cssTokenizer.ts
    var between = function(num, first, last) {
      return num >= first && num <= last;
    };
    function digit(code) {
      return between(code, 48, 57);
    }
    function hexdigit(code) {
      return digit(code) || between(code, 65, 70) || between(code, 97, 102);
    }
    function uppercaseletter(code) {
      return between(code, 65, 90);
    }
    function lowercaseletter(code) {
      return between(code, 97, 122);
    }
    function letter(code) {
      return uppercaseletter(code) || lowercaseletter(code);
    }
    function nonascii(code) {
      return code >= 128;
    }
    function namestartchar(code) {
      return letter(code) || nonascii(code) || code === 95;
    }
    function namechar(code) {
      return namestartchar(code) || digit(code) || code === 45;
    }
    function nonprintable(code) {
      return between(code, 0, 8) || code === 11 || between(code, 14, 31) || code === 127;
    }
    function newline(code) {
      return code === 10;
    }
    function whitespace(code) {
      return newline(code) || code === 9 || code === 32;
    }
    var maximumallowedcodepoint = 1114111;
    var InvalidCharacterError = class extends Error {
      constructor(message) {
        super(message);
        this.name = "InvalidCharacterError";
      }
    };
    function preprocess(str) {
      const codepoints = [];
      for (let i = 0; i < str.length; i++) {
        let code = str.charCodeAt(i);
        if (code === 13 && str.charCodeAt(i + 1) === 10) {
          code = 10;
          i++;
        }
        if (code === 13 || code === 12)
          code = 10;
        if (code === 0)
          code = 65533;
        if (between(code, 55296, 56319) && between(str.charCodeAt(i + 1), 56320, 57343)) {
          const lead = code - 55296;
          const trail = str.charCodeAt(i + 1) - 56320;
          code = Math.pow(2, 16) + lead * Math.pow(2, 10) + trail;
          i++;
        }
        codepoints.push(code);
      }
      return codepoints;
    }
    function stringFromCode(code) {
      if (code <= 65535)
        return String.fromCharCode(code);
      code -= Math.pow(2, 16);
      const lead = Math.floor(code / Math.pow(2, 10)) + 55296;
      const trail = code % Math.pow(2, 10) + 56320;
      return String.fromCharCode(lead) + String.fromCharCode(trail);
    }
    function tokenize(str1) {
      const str = preprocess(str1);
      let i = -1;
      const tokens = [];
      let code;
      let line = 0;
      let column = 0;
      let lastLineLength = 0;
      const incrLineno = function() {
        line += 1;
        lastLineLength = column;
        column = 0;
      };
      const locStart = { line, column };
      const codepoint = function(i2) {
        if (i2 >= str.length)
          return -1;
        return str[i2];
      };
      const next = function(num) {
        if (num === void 0)
          num = 1;
        if (num > 3)
          throw "Spec Error: no more than three codepoints of lookahead.";
        return codepoint(i + num);
      };
      const consume = function(num) {
        if (num === void 0)
          num = 1;
        i += num;
        code = codepoint(i);
        if (newline(code))
          incrLineno();
        else
          column += num;
        return true;
      };
      const reconsume = function() {
        i -= 1;
        if (newline(code)) {
          line -= 1;
          column = lastLineLength;
        } else {
          column -= 1;
        }
        locStart.line = line;
        locStart.column = column;
        return true;
      };
      const eof = function(codepoint2) {
        if (codepoint2 === void 0)
          codepoint2 = code;
        return codepoint2 === -1;
      };
      const donothing = function() {
      };
      const parseerror = function() {
      };
      const consumeAToken = function() {
        consumeComments();
        consume();
        if (whitespace(code)) {
          while (whitespace(next()))
            consume();
          return new WhitespaceToken();
        } else if (code === 34) {
          return consumeAStringToken();
        } else if (code === 35) {
          if (namechar(next()) || areAValidEscape(next(1), next(2))) {
            const token = new HashToken("");
            if (wouldStartAnIdentifier(next(1), next(2), next(3)))
              token.type = "id";
            token.value = consumeAName();
            return token;
          } else {
            return new DelimToken(code);
          }
        } else if (code === 36) {
          if (next() === 61) {
            consume();
            return new SuffixMatchToken();
          } else {
            return new DelimToken(code);
          }
        } else if (code === 39) {
          return consumeAStringToken();
        } else if (code === 40) {
          return new OpenParenToken();
        } else if (code === 41) {
          return new CloseParenToken();
        } else if (code === 42) {
          if (next() === 61) {
            consume();
            return new SubstringMatchToken();
          } else {
            return new DelimToken(code);
          }
        } else if (code === 43) {
          if (startsWithANumber()) {
            reconsume();
            return consumeANumericToken();
          } else {
            return new DelimToken(code);
          }
        } else if (code === 44) {
          return new CommaToken();
        } else if (code === 45) {
          if (startsWithANumber()) {
            reconsume();
            return consumeANumericToken();
          } else if (next(1) === 45 && next(2) === 62) {
            consume(2);
            return new CDCToken();
          } else if (startsWithAnIdentifier()) {
            reconsume();
            return consumeAnIdentlikeToken();
          } else {
            return new DelimToken(code);
          }
        } else if (code === 46) {
          if (startsWithANumber()) {
            reconsume();
            return consumeANumericToken();
          } else {
            return new DelimToken(code);
          }
        } else if (code === 58) {
          return new ColonToken();
        } else if (code === 59) {
          return new SemicolonToken();
        } else if (code === 60) {
          if (next(1) === 33 && next(2) === 45 && next(3) === 45) {
            consume(3);
            return new CDOToken();
          } else {
            return new DelimToken(code);
          }
        } else if (code === 64) {
          if (wouldStartAnIdentifier(next(1), next(2), next(3)))
            return new AtKeywordToken(consumeAName());
          else
            return new DelimToken(code);
        } else if (code === 91) {
          return new OpenSquareToken();
        } else if (code === 92) {
          if (startsWithAValidEscape()) {
            reconsume();
            return consumeAnIdentlikeToken();
          } else {
            parseerror();
            return new DelimToken(code);
          }
        } else if (code === 93) {
          return new CloseSquareToken();
        } else if (code === 94) {
          if (next() === 61) {
            consume();
            return new PrefixMatchToken();
          } else {
            return new DelimToken(code);
          }
        } else if (code === 123) {
          return new OpenCurlyToken();
        } else if (code === 124) {
          if (next() === 61) {
            consume();
            return new DashMatchToken();
          } else if (next() === 124) {
            consume();
            return new ColumnToken();
          } else {
            return new DelimToken(code);
          }
        } else if (code === 125) {
          return new CloseCurlyToken();
        } else if (code === 126) {
          if (next() === 61) {
            consume();
            return new IncludeMatchToken();
          } else {
            return new DelimToken(code);
          }
        } else if (digit(code)) {
          reconsume();
          return consumeANumericToken();
        } else if (namestartchar(code)) {
          reconsume();
          return consumeAnIdentlikeToken();
        } else if (eof()) {
          return new EOFToken();
        } else {
          return new DelimToken(code);
        }
      };
      const consumeComments = function() {
        while (next(1) === 47 && next(2) === 42) {
          consume(2);
          while (true) {
            consume();
            if (code === 42 && next() === 47) {
              consume();
              break;
            } else if (eof()) {
              parseerror();
              return;
            }
          }
        }
      };
      const consumeANumericToken = function() {
        const num = consumeANumber();
        if (wouldStartAnIdentifier(next(1), next(2), next(3))) {
          const token = new DimensionToken();
          token.value = num.value;
          token.repr = num.repr;
          token.type = num.type;
          token.unit = consumeAName();
          return token;
        } else if (next() === 37) {
          consume();
          const token = new PercentageToken();
          token.value = num.value;
          token.repr = num.repr;
          return token;
        } else {
          const token = new NumberToken();
          token.value = num.value;
          token.repr = num.repr;
          token.type = num.type;
          return token;
        }
      };
      const consumeAnIdentlikeToken = function() {
        const str2 = consumeAName();
        if (str2.toLowerCase() === "url" && next() === 40) {
          consume();
          while (whitespace(next(1)) && whitespace(next(2)))
            consume();
          if (next() === 34 || next() === 39)
            return new FunctionToken(str2);
          else if (whitespace(next()) && (next(2) === 34 || next(2) === 39))
            return new FunctionToken(str2);
          else
            return consumeAURLToken();
        } else if (next() === 40) {
          consume();
          return new FunctionToken(str2);
        } else {
          return new IdentToken(str2);
        }
      };
      const consumeAStringToken = function(endingCodePoint) {
        if (endingCodePoint === void 0)
          endingCodePoint = code;
        let string = "";
        while (consume()) {
          if (code === endingCodePoint || eof()) {
            return new StringToken(string);
          } else if (newline(code)) {
            parseerror();
            reconsume();
            return new BadStringToken();
          } else if (code === 92) {
            if (eof(next()))
              donothing();
            else if (newline(next()))
              consume();
            else
              string += stringFromCode(consumeEscape());
          } else {
            string += stringFromCode(code);
          }
        }
        throw new Error("Internal error");
      };
      const consumeAURLToken = function() {
        const token = new URLToken("");
        while (whitespace(next()))
          consume();
        if (eof(next()))
          return token;
        while (consume()) {
          if (code === 41 || eof()) {
            return token;
          } else if (whitespace(code)) {
            while (whitespace(next()))
              consume();
            if (next() === 41 || eof(next())) {
              consume();
              return token;
            } else {
              consumeTheRemnantsOfABadURL();
              return new BadURLToken();
            }
          } else if (code === 34 || code === 39 || code === 40 || nonprintable(code)) {
            parseerror();
            consumeTheRemnantsOfABadURL();
            return new BadURLToken();
          } else if (code === 92) {
            if (startsWithAValidEscape()) {
              token.value += stringFromCode(consumeEscape());
            } else {
              parseerror();
              consumeTheRemnantsOfABadURL();
              return new BadURLToken();
            }
          } else {
            token.value += stringFromCode(code);
          }
        }
        throw new Error("Internal error");
      };
      const consumeEscape = function() {
        consume();
        if (hexdigit(code)) {
          const digits = [code];
          for (let total = 0; total < 5; total++) {
            if (hexdigit(next())) {
              consume();
              digits.push(code);
            } else {
              break;
            }
          }
          if (whitespace(next()))
            consume();
          let value = parseInt(digits.map(function(x) {
            return String.fromCharCode(x);
          }).join(""), 16);
          if (value > maximumallowedcodepoint)
            value = 65533;
          return value;
        } else if (eof()) {
          return 65533;
        } else {
          return code;
        }
      };
      const areAValidEscape = function(c1, c2) {
        if (c1 !== 92)
          return false;
        if (newline(c2))
          return false;
        return true;
      };
      const startsWithAValidEscape = function() {
        return areAValidEscape(code, next());
      };
      const wouldStartAnIdentifier = function(c1, c2, c3) {
        if (c1 === 45)
          return namestartchar(c2) || c2 === 45 || areAValidEscape(c2, c3);
        else if (namestartchar(c1))
          return true;
        else if (c1 === 92)
          return areAValidEscape(c1, c2);
        else
          return false;
      };
      const startsWithAnIdentifier = function() {
        return wouldStartAnIdentifier(code, next(1), next(2));
      };
      const wouldStartANumber = function(c1, c2, c3) {
        if (c1 === 43 || c1 === 45) {
          if (digit(c2))
            return true;
          if (c2 === 46 && digit(c3))
            return true;
          return false;
        } else if (c1 === 46) {
          if (digit(c2))
            return true;
          return false;
        } else if (digit(c1)) {
          return true;
        } else {
          return false;
        }
      };
      const startsWithANumber = function() {
        return wouldStartANumber(code, next(1), next(2));
      };
      const consumeAName = function() {
        let result = "";
        while (consume()) {
          if (namechar(code)) {
            result += stringFromCode(code);
          } else if (startsWithAValidEscape()) {
            result += stringFromCode(consumeEscape());
          } else {
            reconsume();
            return result;
          }
        }
        throw new Error("Internal parse error");
      };
      const consumeANumber = function() {
        let repr = "";
        let type = "integer";
        if (next() === 43 || next() === 45) {
          consume();
          repr += stringFromCode(code);
        }
        while (digit(next())) {
          consume();
          repr += stringFromCode(code);
        }
        if (next(1) === 46 && digit(next(2))) {
          consume();
          repr += stringFromCode(code);
          consume();
          repr += stringFromCode(code);
          type = "number";
          while (digit(next())) {
            consume();
            repr += stringFromCode(code);
          }
        }
        const c1 = next(1), c2 = next(2), c3 = next(3);
        if ((c1 === 69 || c1 === 101) && digit(c2)) {
          consume();
          repr += stringFromCode(code);
          consume();
          repr += stringFromCode(code);
          type = "number";
          while (digit(next())) {
            consume();
            repr += stringFromCode(code);
          }
        } else if ((c1 === 69 || c1 === 101) && (c2 === 43 || c2 === 45) && digit(c3)) {
          consume();
          repr += stringFromCode(code);
          consume();
          repr += stringFromCode(code);
          consume();
          repr += stringFromCode(code);
          type = "number";
          while (digit(next())) {
            consume();
            repr += stringFromCode(code);
          }
        }
        const value = convertAStringToANumber(repr);
        return { type, value, repr };
      };
      const convertAStringToANumber = function(string) {
        return +string;
      };
      const consumeTheRemnantsOfABadURL = function() {
        while (consume()) {
          if (code === 41 || eof()) {
            return;
          } else if (startsWithAValidEscape()) {
            consumeEscape();
            donothing();
          } else {
            donothing();
          }
        }
      };
      let iterationCount = 0;
      while (!eof(next())) {
        tokens.push(consumeAToken());
        iterationCount++;
        if (iterationCount > str.length * 2)
          throw new Error("I'm infinite-looping!");
      }
      return tokens;
    }
    var CSSParserToken = class {
      constructor() {
        this.tokenType = "";
      }
      toJSON() {
        return { token: this.tokenType };
      }
      toString() {
        return this.tokenType;
      }
      toSource() {
        return "" + this;
      }
    };
    var BadStringToken = class extends CSSParserToken {
      constructor() {
        super(...arguments);
        this.tokenType = "BADSTRING";
      }
    };
    var BadURLToken = class extends CSSParserToken {
      constructor() {
        super(...arguments);
        this.tokenType = "BADURL";
      }
    };
    var WhitespaceToken = class extends CSSParserToken {
      constructor() {
        super(...arguments);
        this.tokenType = "WHITESPACE";
      }
      toString() {
        return "WS";
      }
      toSource() {
        return " ";
      }
    };
    var CDOToken = class extends CSSParserToken {
      constructor() {
        super(...arguments);
        this.tokenType = "CDO";
      }
      toSource() {
        return "<!--";
      }
    };
    var CDCToken = class extends CSSParserToken {
      constructor() {
        super(...arguments);
        this.tokenType = "CDC";
      }
      toSource() {
        return "-->";
      }
    };
    var ColonToken = class extends CSSParserToken {
      constructor() {
        super(...arguments);
        this.tokenType = ":";
      }
    };
    var SemicolonToken = class extends CSSParserToken {
      constructor() {
        super(...arguments);
        this.tokenType = ";";
      }
    };
    var CommaToken = class extends CSSParserToken {
      constructor() {
        super(...arguments);
        this.tokenType = ",";
      }
    };
    var GroupingToken = class extends CSSParserToken {
      constructor() {
        super(...arguments);
        this.value = "";
        this.mirror = "";
      }
    };
    var OpenCurlyToken = class extends GroupingToken {
      constructor() {
        super();
        this.tokenType = "{";
        this.value = "{";
        this.mirror = "}";
      }
    };
    var CloseCurlyToken = class extends GroupingToken {
      constructor() {
        super();
        this.tokenType = "}";
        this.value = "}";
        this.mirror = "{";
      }
    };
    var OpenSquareToken = class extends GroupingToken {
      constructor() {
        super();
        this.tokenType = "[";
        this.value = "[";
        this.mirror = "]";
      }
    };
    var CloseSquareToken = class extends GroupingToken {
      constructor() {
        super();
        this.tokenType = "]";
        this.value = "]";
        this.mirror = "[";
      }
    };
    var OpenParenToken = class extends GroupingToken {
      constructor() {
        super();
        this.tokenType = "(";
        this.value = "(";
        this.mirror = ")";
      }
    };
    var CloseParenToken = class extends GroupingToken {
      constructor() {
        super();
        this.tokenType = ")";
        this.value = ")";
        this.mirror = "(";
      }
    };
    var IncludeMatchToken = class extends CSSParserToken {
      constructor() {
        super(...arguments);
        this.tokenType = "~=";
      }
    };
    var DashMatchToken = class extends CSSParserToken {
      constructor() {
        super(...arguments);
        this.tokenType = "|=";
      }
    };
    var PrefixMatchToken = class extends CSSParserToken {
      constructor() {
        super(...arguments);
        this.tokenType = "^=";
      }
    };
    var SuffixMatchToken = class extends CSSParserToken {
      constructor() {
        super(...arguments);
        this.tokenType = "$=";
      }
    };
    var SubstringMatchToken = class extends CSSParserToken {
      constructor() {
        super(...arguments);
        this.tokenType = "*=";
      }
    };
    var ColumnToken = class extends CSSParserToken {
      constructor() {
        super(...arguments);
        this.tokenType = "||";
      }
    };
    var EOFToken = class extends CSSParserToken {
      constructor() {
        super(...arguments);
        this.tokenType = "EOF";
      }
      toSource() {
        return "";
      }
    };
    var DelimToken = class extends CSSParserToken {
      constructor(code) {
        super();
        this.tokenType = "DELIM";
        this.value = "";
        this.value = stringFromCode(code);
      }
      toString() {
        return "DELIM(" + this.value + ")";
      }
      toJSON() {
        const json = this.constructor.prototype.constructor.prototype.toJSON.call(this);
        json.value = this.value;
        return json;
      }
      toSource() {
        if (this.value === "\\")
          return "\\\n";
        else
          return this.value;
      }
    };
    var StringValuedToken = class extends CSSParserToken {
      constructor() {
        super(...arguments);
        this.value = "";
      }
      ASCIIMatch(str) {
        return this.value.toLowerCase() === str.toLowerCase();
      }
      toJSON() {
        const json = this.constructor.prototype.constructor.prototype.toJSON.call(this);
        json.value = this.value;
        return json;
      }
    };
    var IdentToken = class extends StringValuedToken {
      constructor(val) {
        super();
        this.tokenType = "IDENT";
        this.value = val;
      }
      toString() {
        return "IDENT(" + this.value + ")";
      }
      toSource() {
        return escapeIdent(this.value);
      }
    };
    var FunctionToken = class extends StringValuedToken {
      constructor(val) {
        super();
        this.tokenType = "FUNCTION";
        this.value = val;
        this.mirror = ")";
      }
      toString() {
        return "FUNCTION(" + this.value + ")";
      }
      toSource() {
        return escapeIdent(this.value) + "(";
      }
    };
    var AtKeywordToken = class extends StringValuedToken {
      constructor(val) {
        super();
        this.tokenType = "AT-KEYWORD";
        this.value = val;
      }
      toString() {
        return "AT(" + this.value + ")";
      }
      toSource() {
        return "@" + escapeIdent(this.value);
      }
    };
    var HashToken = class extends StringValuedToken {
      constructor(val) {
        super();
        this.tokenType = "HASH";
        this.value = val;
        this.type = "unrestricted";
      }
      toString() {
        return "HASH(" + this.value + ")";
      }
      toJSON() {
        const json = this.constructor.prototype.constructor.prototype.toJSON.call(this);
        json.value = this.value;
        json.type = this.type;
        return json;
      }
      toSource() {
        if (this.type === "id")
          return "#" + escapeIdent(this.value);
        else
          return "#" + escapeHash(this.value);
      }
    };
    var StringToken = class extends StringValuedToken {
      constructor(val) {
        super();
        this.tokenType = "STRING";
        this.value = val;
      }
      toString() {
        return '"' + escapeString(this.value) + '"';
      }
    };
    var URLToken = class extends StringValuedToken {
      constructor(val) {
        super();
        this.tokenType = "URL";
        this.value = val;
      }
      toString() {
        return "URL(" + this.value + ")";
      }
      toSource() {
        return 'url("' + escapeString(this.value) + '")';
      }
    };
    var NumberToken = class extends CSSParserToken {
      constructor() {
        super();
        this.tokenType = "NUMBER";
        this.type = "integer";
        this.repr = "";
      }
      toString() {
        if (this.type === "integer")
          return "INT(" + this.value + ")";
        return "NUMBER(" + this.value + ")";
      }
      toJSON() {
        const json = super.toJSON();
        json.value = this.value;
        json.type = this.type;
        json.repr = this.repr;
        return json;
      }
      toSource() {
        return this.repr;
      }
    };
    var PercentageToken = class extends CSSParserToken {
      constructor() {
        super();
        this.tokenType = "PERCENTAGE";
        this.repr = "";
      }
      toString() {
        return "PERCENTAGE(" + this.value + ")";
      }
      toJSON() {
        const json = this.constructor.prototype.constructor.prototype.toJSON.call(this);
        json.value = this.value;
        json.repr = this.repr;
        return json;
      }
      toSource() {
        return this.repr + "%";
      }
    };
    var DimensionToken = class extends CSSParserToken {
      constructor() {
        super();
        this.tokenType = "DIMENSION";
        this.type = "integer";
        this.repr = "";
        this.unit = "";
      }
      toString() {
        return "DIM(" + this.value + "," + this.unit + ")";
      }
      toJSON() {
        const json = this.constructor.prototype.constructor.prototype.toJSON.call(this);
        json.value = this.value;
        json.type = this.type;
        json.repr = this.repr;
        json.unit = this.unit;
        return json;
      }
      toSource() {
        const source = this.repr;
        let unit = escapeIdent(this.unit);
        if (unit[0].toLowerCase() === "e" && (unit[1] === "-" || between(unit.charCodeAt(1), 48, 57))) {
          unit = "\\65 " + unit.slice(1, unit.length);
        }
        return source + unit;
      }
    };
    function escapeIdent(string) {
      string = "" + string;
      let result = "";
      const firstcode = string.charCodeAt(0);
      for (let i = 0; i < string.length; i++) {
        const code = string.charCodeAt(i);
        if (code === 0)
          throw new InvalidCharacterError("Invalid character: the input contains U+0000.");
        if (between(code, 1, 31) || code === 127 || i === 0 && between(code, 48, 57) || i === 1 && between(code, 48, 57) && firstcode === 45)
          result += "\\" + code.toString(16) + " ";
        else if (code >= 128 || code === 45 || code === 95 || between(code, 48, 57) || between(code, 65, 90) || between(code, 97, 122))
          result += string[i];
        else
          result += "\\" + string[i];
      }
      return result;
    }
    function escapeHash(string) {
      string = "" + string;
      let result = "";
      for (let i = 0; i < string.length; i++) {
        const code = string.charCodeAt(i);
        if (code === 0)
          throw new InvalidCharacterError("Invalid character: the input contains U+0000.");
        if (code >= 128 || code === 45 || code === 95 || between(code, 48, 57) || between(code, 65, 90) || between(code, 97, 122))
          result += string[i];
        else
          result += "\\" + code.toString(16) + " ";
      }
      return result;
    }
    function escapeString(string) {
      string = "" + string;
      let result = "";
      for (let i = 0; i < string.length; i++) {
        const code = string.charCodeAt(i);
        if (code === 0)
          throw new InvalidCharacterError("Invalid character: the input contains U+0000.");
        if (between(code, 1, 31) || code === 127)
          result += "\\" + code.toString(16) + " ";
        else if (code === 34 || code === 92)
          result += "\\" + string[i];
        else
          result += string[i];
      }
      return result;
    }
    
    // packages/playwright-core/src/utils/isomorphic/cssParser.ts
    var InvalidSelectorError = class extends Error {
    };
    function parseCSS(selector, customNames) {
      let tokens;
      try {
        tokens = tokenize(selector);
        if (!(tokens[tokens.length - 1] instanceof EOFToken))
          tokens.push(new EOFToken());
      } catch (e) {
        const newMessage = e.message + ` while parsing selector "${selector}"`;
        const index = (e.stack || "").indexOf(e.message);
        if (index !== -1)
          e.stack = e.stack.substring(0, index) + newMessage + e.stack.substring(index + e.message.length);
        e.message = newMessage;
        throw e;
      }
      const unsupportedToken = tokens.find((token) => {
        return token instanceof AtKeywordToken || token instanceof BadStringToken || token instanceof BadURLToken || token instanceof ColumnToken || token instanceof CDOToken || token instanceof CDCToken || token instanceof SemicolonToken || // TODO: Consider using these for something, e.g. to escape complex strings.
        // For example :xpath{ (//div/bar[@attr="foo"])[2]/baz }
        // Or this way :xpath( {complex-xpath-goes-here("hello")} )
        token instanceof OpenCurlyToken || token instanceof CloseCurlyToken || // TODO: Consider treating these as strings?
        token instanceof URLToken || token instanceof PercentageToken;
      });
      if (unsupportedToken)
        throw new InvalidSelectorError(`Unsupported token "${unsupportedToken.toSource()}" while parsing selector "${selector}"`);
      let pos = 0;
      const names = /* @__PURE__ */ new Set();
      function unexpected() {
        return new InvalidSelectorError(`Unexpected token "${tokens[pos].toSource()}" while parsing selector "${selector}"`);
      }
      function skipWhitespace() {
        while (tokens[pos] instanceof WhitespaceToken)
          pos++;
      }
      function isIdent(p = pos) {
        return tokens[p] instanceof IdentToken;
      }
      function isString(p = pos) {
        return tokens[p] instanceof StringToken;
      }
      function isNumber(p = pos) {
        return tokens[p] instanceof NumberToken;
      }
      function isComma(p = pos) {
        return tokens[p] instanceof CommaToken;
      }
      function isCloseParen(p = pos) {
        return tokens[p] instanceof CloseParenToken;
      }
      function isStar(p = pos) {
        return tokens[p] instanceof DelimToken && tokens[p].value === "*";
      }
      function isEOF(p = pos) {
        return tokens[p] instanceof EOFToken;
      }
      function isClauseCombinator(p = pos) {
        return tokens[p] instanceof DelimToken && [">", "+", "~"].includes(tokens[p].value);
      }
      function isSelectorClauseEnd(p = pos) {
        return isComma(p) || isCloseParen(p) || isEOF(p) || isClauseCombinator(p) || tokens[p] instanceof WhitespaceToken;
      }
      function consumeFunctionArguments() {
        const result2 = [consumeArgument()];
        while (true) {
          skipWhitespace();
          if (!isComma())
            break;
          pos++;
          result2.push(consumeArgument());
        }
        return result2;
      }
      function consumeArgument() {
        skipWhitespace();
        if (isNumber())
          return tokens[pos++].value;
        if (isString())
          return tokens[pos++].value;
        return consumeComplexSelector();
      }
      function consumeComplexSelector() {
        const result2 = { simples: [] };
        skipWhitespace();
        if (isClauseCombinator()) {
          result2.simples.push({ selector: { functions: [{ name: "scope", args: [] }] }, combinator: "" });
        } else {
          result2.simples.push({ selector: consumeSimpleSelector(), combinator: "" });
        }
        while (true) {
          skipWhitespace();
          if (isClauseCombinator()) {
            result2.simples[result2.simples.length - 1].combinator = tokens[pos++].value;
            skipWhitespace();
          } else if (isSelectorClauseEnd()) {
            break;
          }
          result2.simples.push({ combinator: "", selector: consumeSimpleSelector() });
        }
        return result2;
      }
      function consumeSimpleSelector() {
        let rawCSSString = "";
        const functions = [];
        while (!isSelectorClauseEnd()) {
          if (isIdent() || isStar()) {
            rawCSSString += tokens[pos++].toSource();
          } else if (tokens[pos] instanceof HashToken) {
            rawCSSString += tokens[pos++].toSource();
          } else if (tokens[pos] instanceof DelimToken && tokens[pos].value === ".") {
            pos++;
            if (isIdent())
              rawCSSString += "." + tokens[pos++].toSource();
            else
              throw unexpected();
          } else if (tokens[pos] instanceof ColonToken) {
            pos++;
            if (isIdent()) {
              if (!customNames.has(tokens[pos].value.toLowerCase())) {
                rawCSSString += ":" + tokens[pos++].toSource();
              } else {
                const name = tokens[pos++].value.toLowerCase();
                functions.push({ name, args: [] });
                names.add(name);
              }
            } else if (tokens[pos] instanceof FunctionToken) {
              const name = tokens[pos++].value.toLowerCase();
              if (!customNames.has(name)) {
                rawCSSString += `:${name}(${consumeBuiltinFunctionArguments()})`;
              } else {
                functions.push({ name, args: consumeFunctionArguments() });
                names.add(name);
              }
              skipWhitespace();
              if (!isCloseParen())
                throw unexpected();
              pos++;
            } else {
              throw unexpected();
            }
          } else if (tokens[pos] instanceof OpenSquareToken) {
            rawCSSString += "[";
            pos++;
            while (!(tokens[pos] instanceof CloseSquareToken) && !isEOF())
              rawCSSString += tokens[pos++].toSource();
            if (!(tokens[pos] instanceof CloseSquareToken))
              throw unexpected();
            rawCSSString += "]";
            pos++;
          } else {
            throw unexpected();
          }
        }
        if (!rawCSSString && !functions.length)
          throw unexpected();
        return { css: rawCSSString || void 0, functions };
      }
      function consumeBuiltinFunctionArguments() {
        let s = "";
        while (!isCloseParen() && !isEOF())
          s += tokens[pos++].toSource();
        return s;
      }
      const result = consumeFunctionArguments();
      if (!isEOF())
        throw new InvalidSelectorError(`Error while parsing selector "${selector}"`);
      if (result.some((arg) => typeof arg !== "object" || !("simples" in arg)))
        throw new InvalidSelectorError(`Error while parsing selector "${selector}"`);
      return { selector: result, names: Array.from(names) };
    }
    
    // packages/playwright-core/src/utils/isomorphic/selectorParser.ts
    var kNestedSelectorNames = /* @__PURE__ */ new Set(["internal:has", "internal:has-not", "internal:and", "internal:or", "internal:chain", "left-of", "right-of", "above", "below", "near"]);
    var kNestedSelectorNamesWithDistance = /* @__PURE__ */ new Set(["left-of", "right-of", "above", "below", "near"]);
    var customCSSNames = /* @__PURE__ */ new Set(["not", "is", "where", "has", "scope", "light", "visible", "text", "text-matches", "text-is", "has-text", "above", "below", "right-of", "left-of", "near", "nth-match"]);
    function parseSelector(selector) {
      const parsedStrings = parseSelectorString(selector);
      const parts = [];
      for (const part of parsedStrings.parts) {
        if (part.name === "css" || part.name === "css:light") {
          if (part.name === "css:light")
            part.body = ":light(" + part.body + ")";
          const parsedCSS = parseCSS(part.body, customCSSNames);
          parts.push({
            name: "css",
            body: parsedCSS.selector,
            source: part.body
          });
          continue;
        }
        if (kNestedSelectorNames.has(part.name)) {
          let innerSelector;
          let distance;
          try {
            const unescaped = JSON.parse("[" + part.body + "]");
            if (!Array.isArray(unescaped) || unescaped.length < 1 || unescaped.length > 2 || typeof unescaped[0] !== "string")
              throw new InvalidSelectorError(`Malformed selector: ${part.name}=` + part.body);
            innerSelector = unescaped[0];
            if (unescaped.length === 2) {
              if (typeof unescaped[1] !== "number" || !kNestedSelectorNamesWithDistance.has(part.name))
                throw new InvalidSelectorError(`Malformed selector: ${part.name}=` + part.body);
              distance = unescaped[1];
            }
          } catch (e) {
            throw new InvalidSelectorError(`Malformed selector: ${part.name}=` + part.body);
          }
          const nested = { name: part.name, source: part.body, body: { parsed: parseSelector(innerSelector), distance } };
          const lastFrame = [...nested.body.parsed.parts].reverse().find((part2) => part2.name === "internal:control" && part2.body === "enter-frame");
          const lastFrameIndex = lastFrame ? nested.body.parsed.parts.indexOf(lastFrame) : -1;
          if (lastFrameIndex !== -1 && selectorPartsEqual(nested.body.parsed.parts.slice(0, lastFrameIndex + 1), parts.slice(0, lastFrameIndex + 1)))
            nested.body.parsed.parts.splice(0, lastFrameIndex + 1);
          parts.push(nested);
          continue;
        }
        parts.push({ ...part, source: part.body });
      }
      if (parts[0] && kNestedSelectorNames.has(parts[0].name))
        throw new InvalidSelectorError(`"${parts[0].name}" selector cannot be first`);
      return {
        capture: parsedStrings.capture,
        parts
      };
    }
    function selectorPartsEqual(list1, list2) {
      return stringifySelector({ parts: list1 }) === stringifySelector({ parts: list2 });
    }
    function stringifySelector(selector) {
      if (typeof selector === "string")
        return selector;
      return selector.parts.map((p, i) => {
        const prefix = p.name === "css" ? "" : p.name + "=";
        return `${i === selector.capture ? "*" : ""}${prefix}${p.source}`;
      }).join(" >> ");
    }
    function visitAllSelectorParts(selector, visitor) {
      const visit = (selector2, nested) => {
        for (const part of selector2.parts) {
          visitor(part, nested);
          if (kNestedSelectorNames.has(part.name))
            visit(part.body.parsed, true);
        }
      };
      visit(selector, false);
    }
    function parseSelectorString(selector) {
      if (!selector) {
        return {
          "parts": [],
        };
      }
      let index = 0;
      let quote;
      let start = 0;
      const result = { parts: [] };
      const append = () => {
        const part = selector.substring(start, index).trim();
        const eqIndex = part.indexOf("=");
        let name;
        let body;
        if (eqIndex !== -1 && part.substring(0, eqIndex).trim().match(/^[a-zA-Z_0-9-+:*]+$/)) {
          name = part.substring(0, eqIndex).trim();
          body = part.substring(eqIndex + 1);
        } else if (part.length > 1 && part[0] === '"' && part[part.length - 1] === '"') {
          name = "text";
          body = part;
        } else if (part.length > 1 && part[0] === "'" && part[part.length - 1] === "'") {
          name = "text";
          body = part;
        } else if (/^\(*\/\//.test(part) || part.startsWith("..")) {
          name = "xpath";
          body = part;
        } else {
          name = "css";
          body = part;
        }
        let capture = false;
        if (name[0] === "*") {
          capture = true;
          name = name.substring(1);
        }
        result.parts.push({ name, body });
        if (capture) {
          if (result.capture !== void 0)
            throw new InvalidSelectorError(`Only one of the selectors can capture using * modifier`);
          result.capture = result.parts.length - 1;
        }
      };
      if (!selector.includes(">>")) {
        index = selector.length;
        append();
        return result;
      }
      const shouldIgnoreTextSelectorQuote = () => {
        const prefix = selector.substring(start, index);
        const match = prefix.match(/^\s*text\s*=(.*)$/);
        return !!match && !!match[1];
      };
      while (index < selector.length) {
        const c = selector[index];
        if (c === "\\" && index + 1 < selector.length) {
          index += 2;
        } else if (c === quote) {
          quote = void 0;
          index++;
        } else if (!quote && (c === '"' || c === "'" || c === "`") && !shouldIgnoreTextSelectorQuote()) {
          quote = c;
          index++;
        } else if (!quote && c === ">" && selector[index + 1] === ">") {
          append();
          index += 2;
          start = index;
        } else {
          index++;
        }
      }
      append();
      return result;
    }
    function parseAttributeSelector(selector, allowUnquotedStrings) {
      let wp = 0;
      let EOL = selector.length === 0;
      const next = () => selector[wp] || "";
      const eat1 = () => {
        const result2 = next();
        ++wp;
        EOL = wp >= selector.length;
        return result2;
      };
      const syntaxError = (stage) => {
        if (EOL)
          throw new InvalidSelectorError(`Unexpected end of selector while parsing selector \`${selector}\``);
        throw new InvalidSelectorError(`Error while parsing selector \`${selector}\` - unexpected symbol "${next()}" at position ${wp}` + (stage ? " during " + stage : ""));
      };
      function skipSpaces() {
        while (!EOL && /\s/.test(next()))
          eat1();
      }
      function isCSSNameChar(char) {
        return char >= "\x80" || char >= "0" && char <= "9" || char >= "A" && char <= "Z" || char >= "a" && char <= "z" || char >= "0" && char <= "9" || char === "_" || char === "-";
      }
      function readIdentifier() {
        let result2 = "";
        skipSpaces();
        while (!EOL && isCSSNameChar(next()))
          result2 += eat1();
        return result2;
      }
      function readQuotedString(quote) {
        let result2 = eat1();
        if (result2 !== quote)
          syntaxError("parsing quoted string");
        while (!EOL && next() !== quote) {
          if (next() === "\\")
            eat1();
          result2 += eat1();
        }
        if (next() !== quote)
          syntaxError("parsing quoted string");
        result2 += eat1();
        return result2;
      }
      function readRegularExpression() {
        if (eat1() !== "/")
          syntaxError("parsing regular expression");
        let source = "";
        let inClass = false;
        while (!EOL) {
          if (next() === "\\") {
            source += eat1();
            if (EOL)
              syntaxError("parsing regular expression");
          } else if (inClass && next() === "]") {
            inClass = false;
          } else if (!inClass && next() === "[") {
            inClass = true;
          } else if (!inClass && next() === "/") {
            break;
          }
          source += eat1();
        }
        if (eat1() !== "/")
          syntaxError("parsing regular expression");
        let flags = "";
        while (!EOL && next().match(/[dgimsuy]/))
          flags += eat1();
        try {
          return new RegExp(source, flags);
        } catch (e) {
          throw new InvalidSelectorError(`Error while parsing selector \`${selector}\`: ${e.message}`);
        }
      }
      function readAttributeToken() {
        let token = "";
        skipSpaces();
        if (next() === `'` || next() === `"`)
          token = readQuotedString(next()).slice(1, -1);
        else
          token = readIdentifier();
        if (!token)
          syntaxError("parsing property path");
        return token;
      }
      function readOperator() {
        skipSpaces();
        let op = "";
        if (!EOL)
          op += eat1();
        if (!EOL && op !== "=")
          op += eat1();
        if (!["=", "*=", "^=", "$=", "|=", "~="].includes(op))
          syntaxError("parsing operator");
        return op;
      }
      function readAttribute() {
        eat1();
        const jsonPath = [];
        jsonPath.push(readAttributeToken());
        skipSpaces();
        while (next() === ".") {
          eat1();
          jsonPath.push(readAttributeToken());
          skipSpaces();
        }
        if (next() === "]") {
          eat1();
          return { name: jsonPath.join("."), jsonPath, op: "<truthy>", value: null, caseSensitive: false };
        }
        const operator = readOperator();
        let value = void 0;
        let caseSensitive = true;
        skipSpaces();
        if (next() === "/") {
          if (operator !== "=")
            throw new InvalidSelectorError(`Error while parsing selector \`${selector}\` - cannot use ${operator} in attribute with regular expression`);
          value = readRegularExpression();
        } else if (next() === `'` || next() === `"`) {
          value = readQuotedString(next()).slice(1, -1);
          skipSpaces();
          if (next() === "i" || next() === "I") {
            caseSensitive = false;
            eat1();
          } else if (next() === "s" || next() === "S") {
            caseSensitive = true;
            eat1();
          }
        } else {
          value = "";
          while (!EOL && (isCSSNameChar(next()) || next() === "+" || next() === "."))
            value += eat1();
          if (value === "true") {
            value = true;
          } else if (value === "false") {
            value = false;
          } else {
            if (!allowUnquotedStrings) {
              value = +value;
              if (Number.isNaN(value))
                syntaxError("parsing attribute value");
            }
          }
        }
        skipSpaces();
        if (next() !== "]")
          syntaxError("parsing attribute value");
        eat1();
        if (operator !== "=" && typeof value !== "string")
          throw new InvalidSelectorError(`Error while parsing selector \`${selector}\` - cannot use ${operator} in attribute with non-string matching value - ${value}`);
        return { name: jsonPath.join("."), jsonPath, op: operator, value, caseSensitive };
      }
      const result = {
        name: "",
        attributes: []
      };
      result.name = readIdentifier();
      skipSpaces();
      while (next() === "[") {
        result.attributes.push(readAttribute());
        skipSpaces();
      }
      if (!EOL)
        syntaxError(void 0);
      if (!result.name && !result.attributes.length)
        throw new InvalidSelectorError(`Error while parsing selector \`${selector}\` - selector cannot be empty`);
      return result;
    }
    
    // packages/playwright-core/src/server/injected/reactSelectorEngine.ts
    function getFunctionComponentName(component) {
      return component.displayName || component.name || "Anonymous";
    }
    function getComponentName(reactElement) {
      if (reactElement.type) {
        switch (typeof reactElement.type) {
          case "function":
            return getFunctionComponentName(reactElement.type);
          case "string":
            return reactElement.type;
          case "object":
            return reactElement.type.displayName || (reactElement.type.render ? getFunctionComponentName(reactElement.type.render) : "");
        }
      }
      if (reactElement._currentElement) {
        const elementType = reactElement._currentElement.type;
        if (typeof elementType === "string")
          return elementType;
        if (typeof elementType === "function")
          return elementType.displayName || elementType.name || "Anonymous";
      }
      return "";
    }
    function getComponentKey(reactElement) {
      var _a, _b;
      return (_b = reactElement.key) != null ? _b : (_a = reactElement._currentElement) == null ? void 0 : _a.key;
    }
    function getChildren(reactElement) {
      if (reactElement.child) {
        const children = [];
        for (let child = reactElement.child; child; child = child.sibling)
          children.push(child);
        return children;
      }
      if (!reactElement._currentElement)
        return [];
      const isKnownElement = (reactElement2) => {
        var _a;
        const elementType = (_a = reactElement2._currentElement) == null ? void 0 : _a.type;
        return typeof elementType === "function" || typeof elementType === "string";
      };
      if (reactElement._renderedComponent) {
        const child = reactElement._renderedComponent;
        return isKnownElement(child) ? [child] : [];
      }
      if (reactElement._renderedChildren)
        return [...Object.values(reactElement._renderedChildren)].filter(isKnownElement);
      return [];
    }
    function getProps(reactElement) {
      var _a;
      const props = (
        // React 16+
        reactElement.memoizedProps || // React 15
        ((_a = reactElement._currentElement) == null ? void 0 : _a.props)
      );
      if (!props || typeof props === "string")
        return props;
      const result = { ...props };
      delete result.children;
      return result;
    }
    function buildComponentsTree(reactElement) {
      var _a;
      const treeNode = {
        key: getComponentKey(reactElement),
        name: getComponentName(reactElement),
        children: getChildren(reactElement).map(buildComponentsTree),
        rootElements: [],
        props: getProps(reactElement)
      };
      const rootElement = (
        // React 16+
        // @see https://github.com/baruchvlz/resq/blob/5c15a5e04d3f7174087248f5a158c3d6dcc1ec72/src/utils.js#L29
        reactElement.stateNode || // React 15
        reactElement._hostNode || ((_a = reactElement._renderedComponent) == null ? void 0 : _a._hostNode)
      );
      if (rootElement instanceof Element) {
        treeNode.rootElements.push(rootElement);
      } else {
        for (const child of treeNode.children)
          treeNode.rootElements.push(...child.rootElements);
      }
      return treeNode;
    }
    function filterComponentsTree(treeNode, searchFn, result = []) {
      if (searchFn(treeNode))
        result.push(treeNode);
      for (const child of treeNode.children)
        filterComponentsTree(child, searchFn, result);
      return result;
    }
    function findReactRoots(root, roots = []) {
      const document = root.ownerDocument || root;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
      do {
        const node = walker.currentNode;
        const reactNode = node;
        const rootKey = Object.keys(reactNode).find((key) => key.startsWith("__reactContainer") && reactNode[key] !== null);
        if (rootKey) {
          roots.push(reactNode[rootKey].stateNode.current);
        } else {
          const legacyRootKey = "_reactRootContainer";
          if (reactNode.hasOwnProperty(legacyRootKey) && reactNode[legacyRootKey] !== null) {
            roots.push(reactNode[legacyRootKey]._internalRoot.current);
          }
        }
        if (node instanceof Element && node.hasAttribute("data-reactroot")) {
          for (const key of Object.keys(node)) {
            if (key.startsWith("__reactInternalInstance") || key.startsWith("__reactFiber"))
              roots.push(node[key]);
          }
        }
        const shadowRoot = node instanceof Element ? node.shadowRoot : null;
        if (shadowRoot)
          findReactRoots(shadowRoot, roots);
      } while (walker.nextNode());
      return roots;
    }
    var ReactEngine = {
      queryAll(scope, selector) {
        const { name, attributes } = parseAttributeSelector(selector, false);
        const reactRoots = findReactRoots(scope.ownerDocument || scope);
        const trees = reactRoots.map((reactRoot) => buildComponentsTree(reactRoot));
        const treeNodes = trees.map((tree) => filterComponentsTree(tree, (treeNode) => {
          var _a;
          const props = (_a = treeNode.props) != null ? _a : {};
          if (treeNode.key !== void 0)
            props.key = treeNode.key;
          if (name && treeNode.name !== name)
            return false;
          if (treeNode.rootElements.some((domNode) => !isInsideScope(scope, domNode)))
            return false;
          for (const attr of attributes) {
            if (!matchesComponentAttribute(props, attr))
              return false;
          }
          return true;
        })).flat();
        const allRootElements = /* @__PURE__ */ new Set();
        for (const treeNode of treeNodes) {
          for (const domNode of treeNode.rootElements)
            allRootElements.add(domNode);
        }
        return [...allRootElements];
      }
    };
    
    // packages/playwright-core/src/server/injected/vueSelectorEngine.ts
    function basename(filename, ext) {
      const normalized = filename.replace(/^[a-zA-Z]:/, "").replace(/\\/g, "/");
      let result = normalized.substring(normalized.lastIndexOf("/") + 1);
      if (ext && result.endsWith(ext))
        result = result.substring(0, result.length - ext.length);
      return result;
    }
    function toUpper(_, c) {
      return c ? c.toUpperCase() : "";
    }
    var classifyRE = /(?:^|[-_/])(\w)/g;
    var classify = (str) => {
      return str && str.replace(classifyRE, toUpper);
    };
    function buildComponentsTreeVue3(instance) {
      function getComponentTypeName(options) {
        const name = options.name || options._componentTag || options.__playwright_guessedName;
        if (name)
          return name;
        const file = options.__file;
        if (file)
          return classify(basename(file, ".vue"));
      }
      function saveComponentName(instance2, key) {
        instance2.type.__playwright_guessedName = key;
        return key;
      }
      function getInstanceName(instance2) {
        var _a, _b, _c, _d;
        const name = getComponentTypeName(instance2.type || {});
        if (name)
          return name;
        if (instance2.root === instance2)
          return "Root";
        for (const key in (_b = (_a = instance2.parent) == null ? void 0 : _a.type) == null ? void 0 : _b.components)
          if (((_c = instance2.parent) == null ? void 0 : _c.type.components[key]) === instance2.type)
            return saveComponentName(instance2, key);
        for (const key in (_d = instance2.appContext) == null ? void 0 : _d.components)
          if (instance2.appContext.components[key] === instance2.type)
            return saveComponentName(instance2, key);
        return "Anonymous Component";
      }
      function isBeingDestroyed(instance2) {
        return instance2._isBeingDestroyed || instance2.isUnmounted;
      }
      function isFragment(instance2) {
        return instance2.subTree.type.toString() === "Symbol(Fragment)";
      }
      function getInternalInstanceChildren(subTree) {
        const list = [];
        if (subTree.component)
          list.push(subTree.component);
        if (subTree.suspense)
          list.push(...getInternalInstanceChildren(subTree.suspense.activeBranch));
        if (Array.isArray(subTree.children)) {
          subTree.children.forEach((childSubTree) => {
            if (childSubTree.component)
              list.push(childSubTree.component);
            else
              list.push(...getInternalInstanceChildren(childSubTree));
          });
        }
        return list.filter((child) => {
          var _a;
          return !isBeingDestroyed(child) && !((_a = child.type.devtools) == null ? void 0 : _a.hide);
        });
      }
      function getRootElementsFromComponentInstance(instance2) {
        if (isFragment(instance2))
          return getFragmentRootElements(instance2.subTree);
        return [instance2.subTree.el];
      }
      function getFragmentRootElements(vnode) {
        if (!vnode.children)
          return [];
        const list = [];
        for (let i = 0, l = vnode.children.length; i < l; i++) {
          const childVnode = vnode.children[i];
          if (childVnode.component)
            list.push(...getRootElementsFromComponentInstance(childVnode.component));
          else if (childVnode.el)
            list.push(childVnode.el);
        }
        return list;
      }
      function buildComponentsTree2(instance2) {
        return {
          name: getInstanceName(instance2),
          children: getInternalInstanceChildren(instance2.subTree).map(buildComponentsTree2),
          rootElements: getRootElementsFromComponentInstance(instance2),
          props: instance2.props
        };
      }
      return buildComponentsTree2(instance);
    }
    function buildComponentsTreeVue2(instance) {
      function getComponentName2(options) {
        const name = options.displayName || options.name || options._componentTag;
        if (name)
          return name;
        const file = options.__file;
        if (file)
          return classify(basename(file, ".vue"));
      }
      function getInstanceName(instance2) {
        const name = getComponentName2(instance2.$options || instance2.fnOptions || {});
        if (name)
          return name;
        return instance2.$root === instance2 ? "Root" : "Anonymous Component";
      }
      function getInternalInstanceChildren(instance2) {
        if (instance2.$children)
          return instance2.$children;
        if (Array.isArray(instance2.subTree.children))
          return instance2.subTree.children.filter((vnode) => !!vnode.component).map((vnode) => vnode.component);
        return [];
      }
      function buildComponentsTree2(instance2) {
        return {
          name: getInstanceName(instance2),
          children: getInternalInstanceChildren(instance2).map(buildComponentsTree2),
          rootElements: [instance2.$el],
          props: instance2._props
        };
      }
      return buildComponentsTree2(instance);
    }
    function filterComponentsTree2(treeNode, searchFn, result = []) {
      if (searchFn(treeNode))
        result.push(treeNode);
      for (const child of treeNode.children)
        filterComponentsTree2(child, searchFn, result);
      return result;
    }
    function findVueRoots(root, roots = []) {
      const document = root.ownerDocument || root;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
      const vue2Roots = /* @__PURE__ */ new Set();
      do {
        const node = walker.currentNode;
        if (node.__vue__)
          vue2Roots.add(node.__vue__.$root);
        if (node.__vue_app__ && node._vnode && node._vnode.component)
          roots.push({ root: node._vnode.component, version: 3 });
        const shadowRoot = node instanceof Element ? node.shadowRoot : null;
        if (shadowRoot)
          findVueRoots(shadowRoot, roots);
      } while (walker.nextNode());
      for (const vue2root of vue2Roots) {
        roots.push({
          version: 2,
          root: vue2root
        });
      }
      return roots;
    }
    var VueEngine = {
      queryAll(scope, selector) {
        const document = scope.ownerDocument || scope;
        const { name, attributes } = parseAttributeSelector(selector, false);
        const vueRoots = findVueRoots(document);
        const trees = vueRoots.map((vueRoot) => vueRoot.version === 3 ? buildComponentsTreeVue3(vueRoot.root) : buildComponentsTreeVue2(vueRoot.root));
        const treeNodes = trees.map((tree) => filterComponentsTree2(tree, (treeNode) => {
          if (name && treeNode.name !== name)
            return false;
          if (treeNode.rootElements.some((rootElement) => !isInsideScope(scope, rootElement)))
            return false;
          for (const attr of attributes) {
            if (!matchesComponentAttribute(treeNode.props, attr))
              return false;
          }
          return true;
        })).flat();
        const allRootElements = /* @__PURE__ */ new Set();
        for (const treeNode of treeNodes) {
          for (const rootElement of treeNode.rootElements)
            allRootElements.add(rootElement);
        }
        return [...allRootElements];
      }
    };
    
    // packages/playwright-core/src/utils/isomorphic/stringUtils.ts
    function escapeWithQuotes(text, char = "'") {
      const stringified = JSON.stringify(text);
      const escapedText = stringified.substring(1, stringified.length - 1).replace(/\\"/g, '"');
      if (char === "'")
        return char + escapedText.replace(/[']/g, "\\'") + char;
      if (char === '"')
        return char + escapedText.replace(/["]/g, '\\"') + char;
      if (char === "`")
        return char + escapedText.replace(/[`]/g, "`") + char;
      throw new Error("Invalid escape char");
    }
    function toTitleCase(name) {
      return name.charAt(0).toUpperCase() + name.substring(1);
    }
    function toSnakeCase(name) {
      return name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").replace(/([A-Z])([A-Z][a-z])/g, "$1_$2").toLowerCase();
    }
    function cssEscape(s) {
      let result = "";
      for (let i = 0; i < s.length; i++)
        result += cssEscapeOne(s, i);
      return result;
    }
    function cssEscapeOne(s, i) {
      const c = s.charCodeAt(i);
      if (c === 0)
        return "\uFFFD";
      if (c >= 1 && c <= 31 || c >= 48 && c <= 57 && (i === 0 || i === 1 && s.charCodeAt(0) === 45))
        return "\\" + c.toString(16) + " ";
      if (i === 0 && c === 45 && s.length === 1)
        return "\\" + s.charAt(i);
      if (c >= 128 || c === 45 || c === 95 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122)
        return s.charAt(i);
      return "\\" + s.charAt(i);
    }
    function normalizeWhiteSpace(text) {
      return text.replace(/\u200b/g, "").trim().replace(/\s+/g, " ");
    }
    function normalizeEscapedRegexQuotes(source) {
      return source.replace(/(^|[^\\])(\\\\)*\\(['"`])/g, "$1$2$3");
    }
    function escapeRegexForSelector(re) {
      if (re.unicode || re.unicodeSets)
        return String(re);
      return String(re).replace(/(^|[^\\])(\\\\)*(["'`])/g, "$1$2\\$3").replace(/>>/g, "\\>\\>");
    }
    function escapeForTextSelector(text, exact) {
      if (typeof text !== "string")
        return escapeRegexForSelector(text);
      return `${JSON.stringify(text)}${exact ? "s" : "i"}`;
    }
    function escapeForAttributeSelector(value, exact) {
      if (typeof value !== "string")
        return escapeRegexForSelector(value);
      return `"${value.replace(/\\/g, "\\\\").replace(/["]/g, '\\"')}"${exact ? "s" : "i"}`;
    }
    
    // packages/playwright-core/src/server/injected/roleSelectorEngine.ts
    var kSupportedAttributes = ["selected", "checked", "pressed", "expanded", "level", "disabled", "name", "include-hidden"];
    kSupportedAttributes.sort();
    function validateSupportedRole(attr, roles, role) {
      if (!roles.includes(role))
        throw new Error(`"${attr}" attribute is only supported for roles: ${roles.slice().sort().map((role2) => `"${role2}"`).join(", ")}`);
    }
    function validateSupportedValues(attr, values) {
      if (attr.op !== "<truthy>" && !values.includes(attr.value))
        throw new Error(`"${attr.name}" must be one of ${values.map((v) => JSON.stringify(v)).join(", ")}`);
    }
    function validateSupportedOp(attr, ops) {
      if (!ops.includes(attr.op))
        throw new Error(`"${attr.name}" does not support "${attr.op}" matcher`);
    }
    function validateAttributes(attrs, role) {
      const options = { role };
      for (const attr of attrs) {
        switch (attr.name) {
          case "checked": {
            validateSupportedRole(attr.name, kAriaCheckedRoles, role);
            validateSupportedValues(attr, [true, false, "mixed"]);
            validateSupportedOp(attr, ["<truthy>", "="]);
            options.checked = attr.op === "<truthy>" ? true : attr.value;
            break;
          }
          case "pressed": {
            validateSupportedRole(attr.name, kAriaPressedRoles, role);
            validateSupportedValues(attr, [true, false, "mixed"]);
            validateSupportedOp(attr, ["<truthy>", "="]);
            options.pressed = attr.op === "<truthy>" ? true : attr.value;
            break;
          }
          case "selected": {
            validateSupportedRole(attr.name, kAriaSelectedRoles, role);
            validateSupportedValues(attr, [true, false]);
            validateSupportedOp(attr, ["<truthy>", "="]);
            options.selected = attr.op === "<truthy>" ? true : attr.value;
            break;
          }
          case "expanded": {
            validateSupportedRole(attr.name, kAriaExpandedRoles, role);
            validateSupportedValues(attr, [true, false]);
            validateSupportedOp(attr, ["<truthy>", "="]);
            options.expanded = attr.op === "<truthy>" ? true : attr.value;
            break;
          }
          case "level": {
            validateSupportedRole(attr.name, kAriaLevelRoles, role);
            if (typeof attr.value === "string")
              attr.value = +attr.value;
            if (attr.op !== "=" || typeof attr.value !== "number" || Number.isNaN(attr.value))
              throw new Error(`"level" attribute must be compared to a number`);
            options.level = attr.value;
            break;
          }
          case "disabled": {
            validateSupportedValues(attr, [true, false]);
            validateSupportedOp(attr, ["<truthy>", "="]);
            options.disabled = attr.op === "<truthy>" ? true : attr.value;
            break;
          }
          case "name": {
            if (attr.op === "<truthy>")
              throw new Error(`"name" attribute must have a value`);
            if (typeof attr.value !== "string" && !(attr.value instanceof RegExp))
              throw new Error(`"name" attribute must be a string or a regular expression`);
            options.name = attr.value;
            options.nameOp = attr.op;
            options.exact = attr.caseSensitive;
            break;
          }
          case "include-hidden": {
            validateSupportedValues(attr, [true, false]);
            validateSupportedOp(attr, ["<truthy>", "="]);
            options.includeHidden = attr.op === "<truthy>" ? true : attr.value;
            break;
          }
          default: {
            throw new Error(`Unknown attribute "${attr.name}", must be one of ${kSupportedAttributes.map((a) => `"${a}"`).join(", ")}.`);
          }
        }
      }
      return options;
    }
    function queryRole(scope, options, internal) {
      const result = [];
      const match = (element) => {
        if (getAriaRole(element) !== options.role)
          return;
        if (options.selected !== void 0 && getAriaSelected(element) !== options.selected)
          return;
        if (options.checked !== void 0 && getAriaChecked(element) !== options.checked)
          return;
        if (options.pressed !== void 0 && getAriaPressed(element) !== options.pressed)
          return;
        if (options.expanded !== void 0 && getAriaExpanded(element) !== options.expanded)
          return;
        if (options.level !== void 0 && getAriaLevel(element) !== options.level)
          return;
        if (options.disabled !== void 0 && getAriaDisabled(element) !== options.disabled)
          return;
        if (!options.includeHidden) {
          const isHidden = isElementHiddenForAria(element);
          if (isHidden)
            return;
        }
        if (options.name !== void 0) {
          const accessibleName = normalizeWhiteSpace(getElementAccessibleName(element, !!options.includeHidden));
          if (typeof options.name === "string")
            options.name = normalizeWhiteSpace(options.name);
          if (internal && !options.exact && options.nameOp === "=")
            options.nameOp = "*=";
          if (!matchesAttributePart(accessibleName, { name: "", jsonPath: [], op: options.nameOp || "=", value: options.name, caseSensitive: !!options.exact }))
            return;
        }
        result.push(element);
      };
      const query = (root) => {
        const shadows = [];
        if (root.shadowRoot)
          shadows.push(root.shadowRoot);
        for (const element of root.querySelectorAll("*")) {
          match(element);
          if (element.shadowRoot)
            shadows.push(element.shadowRoot);
        }
        shadows.forEach(query);
      };
      query(scope);
      return result;
    }
    function createRoleEngine(internal) {
      return {
        queryAll: (scope, selector) => {
          const parsed = parseAttributeSelector(selector, true);
          const role = parsed.name.toLowerCase();
          if (!role)
            throw new Error(`Role must not be empty`);
          const options = validateAttributes(parsed.attributes, role);
          beginAriaCaches();
          try {
            return queryRole(scope, options, internal);
          } finally {
            endAriaCaches();
          }
        }
      };
    }
    
    // packages/playwright-core/src/server/injected/layoutSelectorUtils.ts
    function boxRightOf(box1, box2, maxDistance) {
      const distance = box1.left - box2.right;
      if (distance < 0 || maxDistance !== void 0 && distance > maxDistance)
        return;
      return distance + Math.max(box2.bottom - box1.bottom, 0) + Math.max(box1.top - box2.top, 0);
    }
    function boxLeftOf(box1, box2, maxDistance) {
      const distance = box2.left - box1.right;
      if (distance < 0 || maxDistance !== void 0 && distance > maxDistance)
        return;
      return distance + Math.max(box2.bottom - box1.bottom, 0) + Math.max(box1.top - box2.top, 0);
    }
    function boxAbove(box1, box2, maxDistance) {
      const distance = box2.top - box1.bottom;
      if (distance < 0 || maxDistance !== void 0 && distance > maxDistance)
        return;
      return distance + Math.max(box1.left - box2.left, 0) + Math.max(box2.right - box1.right, 0);
    }
    function boxBelow(box1, box2, maxDistance) {
      const distance = box1.top - box2.bottom;
      if (distance < 0 || maxDistance !== void 0 && distance > maxDistance)
        return;
      return distance + Math.max(box1.left - box2.left, 0) + Math.max(box2.right - box1.right, 0);
    }
    function boxNear(box1, box2, maxDistance) {
      const kThreshold = maxDistance === void 0 ? 50 : maxDistance;
      let score = 0;
      if (box1.left - box2.right >= 0)
        score += box1.left - box2.right;
      if (box2.left - box1.right >= 0)
        score += box2.left - box1.right;
      if (box2.top - box1.bottom >= 0)
        score += box2.top - box1.bottom;
      if (box1.top - box2.bottom >= 0)
        score += box1.top - box2.bottom;
      return score > kThreshold ? void 0 : score;
    }
    var kLayoutSelectorNames = ["left-of", "right-of", "above", "below", "near"];
    function layoutSelectorScore(name, element, inner, maxDistance) {
      const box = element.getBoundingClientRect();
      const scorer = { "left-of": boxLeftOf, "right-of": boxRightOf, "above": boxAbove, "below": boxBelow, "near": boxNear }[name];
      let bestScore;
      for (const e of inner) {
        if (e === element)
          continue;
        const score = scorer(box, e.getBoundingClientRect(), maxDistance);
        if (score === void 0)
          continue;
        if (bestScore === void 0 || score < bestScore)
          bestScore = score;
      }
      return bestScore;
    }
    
    // packages/playwright-core/src/server/injected/selectorEvaluator.ts
    var SelectorEvaluatorImpl = class {
      constructor(extraEngines) {
        this._engines = /* @__PURE__ */ new Map();
        this._cacheQueryCSS = /* @__PURE__ */ new Map();
        this._cacheMatches = /* @__PURE__ */ new Map();
        this._cacheQuery = /* @__PURE__ */ new Map();
        this._cacheMatchesSimple = /* @__PURE__ */ new Map();
        this._cacheMatchesParents = /* @__PURE__ */ new Map();
        this._cacheCallMatches = /* @__PURE__ */ new Map();
        this._cacheCallQuery = /* @__PURE__ */ new Map();
        this._cacheQuerySimple = /* @__PURE__ */ new Map();
        this._cacheText = /* @__PURE__ */ new Map();
        this._retainCacheCounter = 0;
        for (const [name, engine] of extraEngines)
          this._engines.set(name, engine);
        this._engines.set("not", notEngine);
        this._engines.set("is", isEngine);
        this._engines.set("where", isEngine);
        this._engines.set("has", hasEngine);
        this._engines.set("scope", scopeEngine);
        this._engines.set("light", lightEngine);
        this._engines.set("visible", visibleEngine);
        this._engines.set("text", textEngine);
        this._engines.set("text-is", textIsEngine);
        this._engines.set("text-matches", textMatchesEngine);
        this._engines.set("has-text", hasTextEngine);
        this._engines.set("right-of", createLayoutEngine("right-of"));
        this._engines.set("left-of", createLayoutEngine("left-of"));
        this._engines.set("above", createLayoutEngine("above"));
        this._engines.set("below", createLayoutEngine("below"));
        this._engines.set("near", createLayoutEngine("near"));
        this._engines.set("nth-match", nthMatchEngine);
        const allNames = [...this._engines.keys()];
        allNames.sort();
        const parserNames = [...customCSSNames];
        parserNames.sort();
        if (allNames.join("|") !== parserNames.join("|"))
          throw new Error(`Please keep customCSSNames in sync with evaluator engines: ${allNames.join("|")} vs ${parserNames.join("|")}`);
      }
      begin() {
        ++this._retainCacheCounter;
      }
      end() {
        --this._retainCacheCounter;
        if (!this._retainCacheCounter) {
          this._cacheQueryCSS.clear();
          this._cacheMatches.clear();
          this._cacheQuery.clear();
          this._cacheMatchesSimple.clear();
          this._cacheMatchesParents.clear();
          this._cacheCallMatches.clear();
          this._cacheCallQuery.clear();
          this._cacheQuerySimple.clear();
          this._cacheText.clear();
        }
      }
      _cached(cache, main, rest, cb) {
        if (!cache.has(main))
          cache.set(main, []);
        const entries = cache.get(main);
        const entry = entries.find((e) => rest.every((value, index) => e.rest[index] === value));
        if (entry)
          return entry.result;
        const result = cb();
        entries.push({ rest, result });
        return result;
      }
      _checkSelector(s) {
        const wellFormed = typeof s === "object" && s && (Array.isArray(s) || "simples" in s && s.simples.length);
        if (!wellFormed)
          throw new Error(`Malformed selector "${s}"`);
        return s;
      }
      matches(element, s, context) {
        const selector = this._checkSelector(s);
        this.begin();
        try {
          return this._cached(this._cacheMatches, element, [selector, context.scope, context.pierceShadow, context.originalScope], () => {
            if (Array.isArray(selector))
              return this._matchesEngine(isEngine, element, selector, context);
            if (this._hasScopeClause(selector))
              context = this._expandContextForScopeMatching(context);
            if (!this._matchesSimple(element, selector.simples[selector.simples.length - 1].selector, context))
              return false;
            return this._matchesParents(element, selector, selector.simples.length - 2, context);
          });
        } finally {
          this.end();
        }
      }
      query(context, s) {
        const selector = this._checkSelector(s);
        this.begin();
        try {
          return this._cached(this._cacheQuery, selector, [context.scope, context.pierceShadow, context.originalScope], () => {
            if (Array.isArray(selector))
              return this._queryEngine(isEngine, context, selector);
            if (this._hasScopeClause(selector))
              context = this._expandContextForScopeMatching(context);
            const previousScoreMap = this._scoreMap;
            this._scoreMap = /* @__PURE__ */ new Map();
            let elements = this._querySimple(context, selector.simples[selector.simples.length - 1].selector);
            elements = elements.filter((element) => this._matchesParents(element, selector, selector.simples.length - 2, context));
            if (this._scoreMap.size) {
              elements.sort((a, b) => {
                const aScore = this._scoreMap.get(a);
                const bScore = this._scoreMap.get(b);
                if (aScore === bScore)
                  return 0;
                if (aScore === void 0)
                  return 1;
                if (bScore === void 0)
                  return -1;
                return aScore - bScore;
              });
            }
            this._scoreMap = previousScoreMap;
            return elements;
          });
        } finally {
          this.end();
        }
      }
      _markScore(element, score) {
        if (this._scoreMap)
          this._scoreMap.set(element, score);
      }
      _hasScopeClause(selector) {
        return selector.simples.some((simple) => simple.selector.functions.some((f) => f.name === "scope"));
      }
      _expandContextForScopeMatching(context) {
        if (context.scope.nodeType !== 1)
          return context;
        const scope = parentElementOrShadowHost(context.scope);
        if (!scope)
          return context;
        return { ...context, scope, originalScope: context.originalScope || context.scope };
      }
      _matchesSimple(element, simple, context) {
        return this._cached(this._cacheMatchesSimple, element, [simple, context.scope, context.pierceShadow, context.originalScope], () => {
          if (element === context.scope)
            return false;
          if (simple.css && !this._matchesCSS(element, simple.css))
            return false;
          for (const func of simple.functions) {
            if (!this._matchesEngine(this._getEngine(func.name), element, func.args, context))
              return false;
          }
          return true;
        });
      }
      _querySimple(context, simple) {
        if (!simple.functions.length)
          return this._queryCSS(context, simple.css || "*");
        return this._cached(this._cacheQuerySimple, simple, [context.scope, context.pierceShadow, context.originalScope], () => {
          let css = simple.css;
          const funcs = simple.functions;
          if (css === "*" && funcs.length)
            css = void 0;
          let elements;
          let firstIndex = -1;
          if (css !== void 0) {
            elements = this._queryCSS(context, css);
          } else {
            firstIndex = funcs.findIndex((func) => this._getEngine(func.name).query !== void 0);
            if (firstIndex === -1)
              firstIndex = 0;
            elements = this._queryEngine(this._getEngine(funcs[firstIndex].name), context, funcs[firstIndex].args);
          }
          for (let i = 0; i < funcs.length; i++) {
            if (i === firstIndex)
              continue;
            const engine = this._getEngine(funcs[i].name);
            if (engine.matches !== void 0)
              elements = elements.filter((e) => this._matchesEngine(engine, e, funcs[i].args, context));
          }
          for (let i = 0; i < funcs.length; i++) {
            if (i === firstIndex)
              continue;
            const engine = this._getEngine(funcs[i].name);
            if (engine.matches === void 0)
              elements = elements.filter((e) => this._matchesEngine(engine, e, funcs[i].args, context));
          }
          return elements;
        });
      }
      _matchesParents(element, complex, index, context) {
        if (index < 0)
          return true;
        return this._cached(this._cacheMatchesParents, element, [complex, index, context.scope, context.pierceShadow, context.originalScope], () => {
          const { selector: simple, combinator } = complex.simples[index];
          if (combinator === ">") {
            const parent = parentElementOrShadowHostInContext(element, context);
            if (!parent || !this._matchesSimple(parent, simple, context))
              return false;
            return this._matchesParents(parent, complex, index - 1, context);
          }
          if (combinator === "+") {
            const previousSibling = previousSiblingInContext(element, context);
            if (!previousSibling || !this._matchesSimple(previousSibling, simple, context))
              return false;
            return this._matchesParents(previousSibling, complex, index - 1, context);
          }
          if (combinator === "") {
            let parent = parentElementOrShadowHostInContext(element, context);
            while (parent) {
              if (this._matchesSimple(parent, simple, context)) {
                if (this._matchesParents(parent, complex, index - 1, context))
                  return true;
                if (complex.simples[index - 1].combinator === "")
                  break;
              }
              parent = parentElementOrShadowHostInContext(parent, context);
            }
            return false;
          }
          if (combinator === "~") {
            let previousSibling = previousSiblingInContext(element, context);
            while (previousSibling) {
              if (this._matchesSimple(previousSibling, simple, context)) {
                if (this._matchesParents(previousSibling, complex, index - 1, context))
                  return true;
                if (complex.simples[index - 1].combinator === "~")
                  break;
              }
              previousSibling = previousSiblingInContext(previousSibling, context);
            }
            return false;
          }
          if (combinator === ">=") {
            let parent = element;
            while (parent) {
              if (this._matchesSimple(parent, simple, context)) {
                if (this._matchesParents(parent, complex, index - 1, context))
                  return true;
                if (complex.simples[index - 1].combinator === "")
                  break;
              }
              parent = parentElementOrShadowHostInContext(parent, context);
            }
            return false;
          }
          throw new Error(`Unsupported combinator "${combinator}"`);
        });
      }
      _matchesEngine(engine, element, args, context) {
        if (engine.matches)
          return this._callMatches(engine, element, args, context);
        if (engine.query)
          return this._callQuery(engine, args, context).includes(element);
        throw new Error(`Selector engine should implement "matches" or "query"`);
      }
      _queryEngine(engine, context, args) {
        if (engine.query)
          return this._callQuery(engine, args, context);
        if (engine.matches)
          return this._queryCSS(context, "*").filter((element) => this._callMatches(engine, element, args, context));
        throw new Error(`Selector engine should implement "matches" or "query"`);
      }
      _callMatches(engine, element, args, context) {
        return this._cached(this._cacheCallMatches, element, [engine, context.scope, context.pierceShadow, context.originalScope, ...args], () => {
          return engine.matches(element, args, context, this);
        });
      }
      _callQuery(engine, args, context) {
        return this._cached(this._cacheCallQuery, engine, [context.scope, context.pierceShadow, context.originalScope, ...args], () => {
          return engine.query(context, args, this);
        });
      }
      _matchesCSS(element, css) {
        return element.matches(css);
      }
      _queryCSS(context, css) {
        return this._cached(this._cacheQueryCSS, css, [context.scope, context.pierceShadow, context.originalScope], () => {
          let result = [];
          function query(root) {
            result = result.concat([...root.querySelectorAll(css)]);
            if (!context.pierceShadow)
              return;
            if (root.shadowRoot)
              query(root.shadowRoot);
            for (const element of root.querySelectorAll("*")) {
              if (element.shadowRoot)
                query(element.shadowRoot);
            }
          }
          query(context.scope);
          return result;
        });
      }
      _getEngine(name) {
        const engine = this._engines.get(name);
        if (!engine)
          throw new Error(`Unknown selector engine "${name}"`);
        return engine;
      }
    };
    var isEngine = {
      matches(element, args, context, evaluator) {
        if (args.length === 0)
          throw new Error(`"is" engine expects non-empty selector list`);
        return args.some((selector) => evaluator.matches(element, selector, context));
      },
      query(context, args, evaluator) {
        if (args.length === 0)
          throw new Error(`"is" engine expects non-empty selector list`);
        let elements = [];
        for (const arg of args)
          elements = elements.concat(evaluator.query(context, arg));
        return args.length === 1 ? elements : sortInDOMOrder(elements);
      }
    };
    var hasEngine = {
      matches(element, args, context, evaluator) {
        if (args.length === 0)
          throw new Error(`"has" engine expects non-empty selector list`);
        return evaluator.query({ ...context, scope: element }, args).length > 0;
      }
      // TODO: we can implement efficient "query" by matching "args" and returning
      // all parents/descendants, just have to be careful with the ":scope" matching.
    };
    var scopeEngine = {
      matches(element, args, context, evaluator) {
        if (args.length !== 0)
          throw new Error(`"scope" engine expects no arguments`);
        const actualScope = context.originalScope || context.scope;
        if (actualScope.nodeType === 9)
          return element === actualScope.documentElement;
        return element === actualScope;
      },
      query(context, args, evaluator) {
        if (args.length !== 0)
          throw new Error(`"scope" engine expects no arguments`);
        const actualScope = context.originalScope || context.scope;
        if (actualScope.nodeType === 9) {
          const root = actualScope.documentElement;
          return root ? [root] : [];
        }
        if (actualScope.nodeType === 1)
          return [actualScope];
        return [];
      }
    };
    var notEngine = {
      matches(element, args, context, evaluator) {
        if (args.length === 0)
          throw new Error(`"not" engine expects non-empty selector list`);
        return !evaluator.matches(element, args, context);
      }
    };
    var lightEngine = {
      query(context, args, evaluator) {
        return evaluator.query({ ...context, pierceShadow: false }, args);
      },
      matches(element, args, context, evaluator) {
        return evaluator.matches(element, args, { ...context, pierceShadow: false });
      }
    };
    var visibleEngine = {
      matches(element, args, context, evaluator) {
        if (args.length)
          throw new Error(`"visible" engine expects no arguments`);
        return isElementVisible(element);
      }
    };
    var textEngine = {
      matches(element, args, context, evaluator) {
        if (args.length !== 1 || typeof args[0] !== "string")
          throw new Error(`"text" engine expects a single string`);
        const text = normalizeWhiteSpace(args[0]).toLowerCase();
        const matcher = (elementText2) => normalizeWhiteSpace(elementText2.full).toLowerCase().includes(text);
        return elementMatchesText(evaluator._cacheText, element, matcher) === "self";
      }
    };
    var textIsEngine = {
      matches(element, args, context, evaluator) {
        if (args.length !== 1 || typeof args[0] !== "string")
          throw new Error(`"text-is" engine expects a single string`);
        const text = normalizeWhiteSpace(args[0]);
        const matcher = (elementText2) => {
          if (!text && !elementText2.immediate.length)
            return true;
          return elementText2.immediate.some((s) => normalizeWhiteSpace(s) === text);
        };
        return elementMatchesText(evaluator._cacheText, element, matcher) !== "none";
      }
    };
    var textMatchesEngine = {
      matches(element, args, context, evaluator) {
        if (args.length === 0 || typeof args[0] !== "string" || args.length > 2 || args.length === 2 && typeof args[1] !== "string")
          throw new Error(`"text-matches" engine expects a regexp body and optional regexp flags`);
        const re = new RegExp(args[0], args.length === 2 ? args[1] : void 0);
        const matcher = (elementText2) => re.test(elementText2.full);
        return elementMatchesText(evaluator._cacheText, element, matcher) === "self";
      }
    };
    var hasTextEngine = {
      matches(element, args, context, evaluator) {
        if (args.length !== 1 || typeof args[0] !== "string")
          throw new Error(`"has-text" engine expects a single string`);
        if (shouldSkipForTextMatching(element))
          return false;
        const text = normalizeWhiteSpace(args[0]).toLowerCase();
        const matcher = (elementText2) => normalizeWhiteSpace(elementText2.full).toLowerCase().includes(text);
        return matcher(elementText(evaluator._cacheText, element));
      }
    };
    function createLayoutEngine(name) {
      return {
        matches(element, args, context, evaluator) {
          const maxDistance = args.length && typeof args[args.length - 1] === "number" ? args[args.length - 1] : void 0;
          const queryArgs = maxDistance === void 0 ? args : args.slice(0, args.length - 1);
          if (args.length < 1 + (maxDistance === void 0 ? 0 : 1))
            throw new Error(`"${name}" engine expects a selector list and optional maximum distance in pixels`);
          const inner = evaluator.query(context, queryArgs);
          const score = layoutSelectorScore(name, element, inner, maxDistance);
          if (score === void 0)
            return false;
          evaluator._markScore(element, score);
          return true;
        }
      };
    }
    var nthMatchEngine = {
      query(context, args, evaluator) {
        let index = args[args.length - 1];
        if (args.length < 2)
          throw new Error(`"nth-match" engine expects non-empty selector list and an index argument`);
        if (typeof index !== "number" || index < 1)
          throw new Error(`"nth-match" engine expects a one-based index as the last argument`);
        const elements = isEngine.query(context, args.slice(0, args.length - 1), evaluator);
        index--;
        return index < elements.length ? [elements[index]] : [];
      }
    };
    function parentElementOrShadowHostInContext(element, context) {
      if (element === context.scope)
        return;
      if (!context.pierceShadow)
        return element.parentElement || void 0;
      return parentElementOrShadowHost(element);
    }
    function previousSiblingInContext(element, context) {
      if (element === context.scope)
        return;
      return element.previousElementSibling || void 0;
    }
    function sortInDOMOrder(elements) {
      const elementToEntry = /* @__PURE__ */ new Map();
      const roots = [];
      const result = [];
      function append(element) {
        let entry = elementToEntry.get(element);
        if (entry)
          return entry;
        const parent = parentElementOrShadowHost(element);
        if (parent) {
          const parentEntry = append(parent);
          parentEntry.children.push(element);
        } else {
          roots.push(element);
        }
        entry = { children: [], taken: false };
        elementToEntry.set(element, entry);
        return entry;
      }
      for (const e of elements)
        append(e).taken = true;
      function visit(element) {
        const entry = elementToEntry.get(element);
        if (entry.taken)
          result.push(element);
        if (entry.children.length > 1) {
          const set = new Set(entry.children);
          entry.children = [];
          let child = element.firstElementChild;
          while (child && entry.children.length < set.size) {
            if (set.has(child))
              entry.children.push(child);
            child = child.nextElementSibling;
          }
          child = element.shadowRoot ? element.shadowRoot.firstElementChild : null;
          while (child && entry.children.length < set.size) {
            if (set.has(child))
              entry.children.push(child);
            child = child.nextElementSibling;
          }
        }
        entry.children.forEach(visit);
      }
      roots.forEach(visit);
      return result;
    }
    
    // packages/playwright-core/src/server/injected/selectorGenerator.ts
    var cacheAllowText = /* @__PURE__ */ new Map();
    var cacheDisallowText = /* @__PURE__ */ new Map();
    var kTextScoreRange = 10;
    var kExactPenalty = kTextScoreRange / 2;
    var kTestIdScore = 1;
    var kOtherTestIdScore = 2;
    var kIframeByAttributeScore = 10;
    var kBeginPenalizedScore = 50;
    var kPlaceholderScore = 100;
    var kLabelScore = 120;
    var kRoleWithNameScore = 140;
    var kAltTextScore = 160;
    var kTextScore = 180;
    var kTitleScore = 200;
    var kTextScoreRegex = 250;
    var kPlaceholderScoreExact = kPlaceholderScore + kExactPenalty;
    var kLabelScoreExact = kLabelScore + kExactPenalty;
    var kRoleWithNameScoreExact = kRoleWithNameScore + kExactPenalty;
    var kAltTextScoreExact = kAltTextScore + kExactPenalty;
    var kTextScoreExact = kTextScore + kExactPenalty;
    var kTitleScoreExact = kTitleScore + kExactPenalty;
    var kEndPenalizedScore = 300;
    var kCSSIdScore = 500;
    var kRoleWithoutNameScore = 510;
    var kCSSInputTypeNameScore = 520;
    var kCSSTagNameScore = 530;
    var kNthScore = 1e4;
    var kCSSFallbackScore = 1e7;
    function generateSelector(injectedScript, targetElement, options) {
      var _a;
      injectedScript._evaluator.begin();
      beginAriaCaches();
      try {
        targetElement = closestCrossShadow(targetElement, "button,select,input,[role=button],[role=checkbox],[role=radio],a,[role=link]", options.root) || targetElement;
        const targetTokens = generateSelectorFor(injectedScript, targetElement, options);
        const selector = joinTokens(targetTokens);
        const parsedSelector = injectedScript.parseSelector(selector);
        return {
          selector,
          elements: injectedScript.querySelectorAll(parsedSelector, (_a = options.root) != null ? _a : targetElement.ownerDocument)
        };
      } finally {
        cacheAllowText.clear();
        cacheDisallowText.clear();
        endAriaCaches();
        injectedScript._evaluator.end();
      }
    }
    function filterRegexTokens(textCandidates) {
      return textCandidates.filter((c) => c[0].selector[0] !== "/");
    }
    function generateSelectorFor(injectedScript, targetElement, options) {
      if (options.root && !isInsideScope(options.root, targetElement))
        throw new Error(`Target element must belong to the root's subtree`);
      if (targetElement === options.root)
        return [{ engine: "css", selector: ":scope", score: 1 }];
      if (targetElement.ownerDocument.documentElement === targetElement)
        return [{ engine: "css", selector: "html", score: 1 }];
      const calculate = (element, allowText) => {
        var _a;
        const allowNthMatch = element === targetElement;
        let textCandidates = allowText ? buildTextCandidates(injectedScript, element, element === targetElement) : [];
        if (element !== targetElement) {
          textCandidates = filterRegexTokens(textCandidates);
        }
        const noTextCandidates = buildNoTextCandidates(injectedScript, element, options).filter((token) => !options.omitInternalEngines || !token.engine.startsWith("internal:")).map((token) => [token]);
        let result = chooseFirstSelector(injectedScript, (_a = options.root) != null ? _a : targetElement.ownerDocument, element, [...textCandidates, ...noTextCandidates], allowNthMatch);
        textCandidates = filterRegexTokens(textCandidates);
        const checkWithText = (textCandidatesToUse) => {
          const allowParentText = allowText && !textCandidatesToUse.length;
          const candidates = [...textCandidatesToUse, ...noTextCandidates].filter((c) => {
            if (!result)
              return true;
            return combineScores(c) < combineScores(result);
          });
          let bestPossibleInParent = candidates[0];
          if (!bestPossibleInParent)
            return;
          for (let parent = parentElementOrShadowHost(element); parent && parent !== options.root; parent = parentElementOrShadowHost(parent)) {
            const parentTokens = calculateCached(parent, allowParentText);
            if (!parentTokens)
              continue;
            if (result && combineScores([...parentTokens, ...bestPossibleInParent]) >= combineScores(result))
              continue;
            bestPossibleInParent = chooseFirstSelector(injectedScript, parent, element, candidates, allowNthMatch);
            if (!bestPossibleInParent)
              return;
            const combined = [...parentTokens, ...bestPossibleInParent];
            if (!result || combineScores(combined) < combineScores(result))
              result = combined;
          }
        };
        checkWithText(textCandidates);
        if (element === targetElement && textCandidates.length)
          checkWithText([]);
        return result;
      };
      const calculateCached = (element, allowText) => {
        const cache = allowText ? cacheAllowText : cacheDisallowText;
        let value = cache.get(element);
        if (value === void 0) {
          value = calculate(element, allowText);
          cache.set(element, value);
        }
        return value;
      };
      return calculateCached(targetElement, true) || cssFallback(injectedScript, targetElement, options);
    }
    function buildNoTextCandidates(injectedScript, element, options) {
      const candidates = [];
      {
        for (const attr of ["data-testid", "data-test-id", "data-test"]) {
          if (attr !== options.testIdAttributeName && element.getAttribute(attr))
            candidates.push({ engine: "css", selector: `[${attr}=${quoteAttributeValue(element.getAttribute(attr))}]`, score: kOtherTestIdScore });
        }
        const idAttr = element.getAttribute("id");
        if (idAttr && !isGuidLike(idAttr))
          candidates.push({ engine: "css", selector: makeSelectorForId(idAttr), score: kCSSIdScore });
        candidates.push({ engine: "css", selector: cssEscape(element.nodeName.toLowerCase()), score: kCSSTagNameScore });
      }
      if (element.nodeName === "IFRAME") {
        for (const attribute of ["name", "title"]) {
          if (element.getAttribute(attribute))
            candidates.push({ engine: "css", selector: `${cssEscape(element.nodeName.toLowerCase())}[${attribute}=${quoteAttributeValue(element.getAttribute(attribute))}]`, score: kIframeByAttributeScore });
        }
        if (element.getAttribute(options.testIdAttributeName))
          candidates.push({ engine: "css", selector: `[${options.testIdAttributeName}=${quoteAttributeValue(element.getAttribute(options.testIdAttributeName))}]`, score: kTestIdScore });
        penalizeScoreForLength([candidates]);
        return candidates;
      }
      if (element.getAttribute(options.testIdAttributeName))
        candidates.push({ engine: "internal:testid", selector: `[${options.testIdAttributeName}=${escapeForAttributeSelector(element.getAttribute(options.testIdAttributeName), true)}]`, score: kTestIdScore });
      if (element.nodeName === "INPUT" || element.nodeName === "TEXTAREA") {
        const input = element;
        if (input.placeholder) {
          candidates.push({ engine: "internal:attr", selector: `[placeholder=${escapeForAttributeSelector(input.placeholder, false)}]`, score: kPlaceholderScore });
          candidates.push({ engine: "internal:attr", selector: `[placeholder=${escapeForAttributeSelector(input.placeholder, true)}]`, score: kPlaceholderScoreExact });
        }
      }
      const labels = getElementLabels(injectedScript._evaluator._cacheText, element);
      for (const label of labels) {
        const labelText = label.full.trim();
        candidates.push({ engine: "internal:label", selector: escapeForTextSelector(labelText, false), score: kLabelScore });
        candidates.push({ engine: "internal:label", selector: escapeForTextSelector(labelText, true), score: kLabelScoreExact });
      }
      const ariaRole = getAriaRole(element);
      if (ariaRole && !["none", "presentation"].includes(ariaRole))
        candidates.push({ engine: "internal:role", selector: ariaRole, score: kRoleWithoutNameScore });
      if (element.getAttribute("alt") && ["APPLET", "AREA", "IMG", "INPUT"].includes(element.nodeName)) {
        candidates.push({ engine: "internal:attr", selector: `[alt=${escapeForAttributeSelector(element.getAttribute("alt"), false)}]`, score: kAltTextScore });
        candidates.push({ engine: "internal:attr", selector: `[alt=${escapeForAttributeSelector(element.getAttribute("alt"), true)}]`, score: kAltTextScoreExact });
      }
      if (element.getAttribute("name") && ["BUTTON", "FORM", "FIELDSET", "FRAME", "IFRAME", "INPUT", "KEYGEN", "OBJECT", "OUTPUT", "SELECT", "TEXTAREA", "MAP", "META", "PARAM"].includes(element.nodeName))
        candidates.push({ engine: "css", selector: `${cssEscape(element.nodeName.toLowerCase())}[name=${quoteAttributeValue(element.getAttribute("name"))}]`, score: kCSSInputTypeNameScore });
      if (element.getAttribute("title")) {
        candidates.push({ engine: "internal:attr", selector: `[title=${escapeForAttributeSelector(element.getAttribute("title"), false)}]`, score: kTitleScore });
        candidates.push({ engine: "internal:attr", selector: `[title=${escapeForAttributeSelector(element.getAttribute("title"), true)}]`, score: kTitleScoreExact });
      }
      if (["INPUT", "TEXTAREA"].includes(element.nodeName) && element.getAttribute("type") !== "hidden") {
        if (element.getAttribute("type"))
          candidates.push({ engine: "css", selector: `${cssEscape(element.nodeName.toLowerCase())}[type=${quoteAttributeValue(element.getAttribute("type"))}]`, score: kCSSInputTypeNameScore });
      }
      if (["INPUT", "TEXTAREA", "SELECT"].includes(element.nodeName) && element.getAttribute("type") !== "hidden")
        candidates.push({ engine: "css", selector: cssEscape(element.nodeName.toLowerCase()), score: kCSSInputTypeNameScore + 1 });
      penalizeScoreForLength([candidates]);
      return candidates;
    }
    function buildTextCandidates(injectedScript, element, isTargetNode) {
      if (element.nodeName === "SELECT")
        return [];
      const candidates = [];
      const fullText = normalizeWhiteSpace(elementText(injectedScript._evaluator._cacheText, element).full);
      const text = fullText.substring(0, 80);
      if (text) {
        const escaped = escapeForTextSelector(text, false);
        if (isTargetNode) {
          candidates.push([{ engine: "internal:text", selector: escaped, score: kTextScore }]);
          candidates.push([{ engine: "internal:text", selector: escapeForTextSelector(text, true), score: kTextScoreExact }]);
        }
        const cssToken = { engine: "css", selector: cssEscape(element.nodeName.toLowerCase()), score: kCSSTagNameScore };
        candidates.push([cssToken, { engine: "internal:has-text", selector: escaped, score: kTextScore }]);
        if (fullText.length <= 80)
          candidates.push([cssToken, { engine: "internal:has-text", selector: "/^" + escapeRegExp(fullText) + "$/", score: kTextScoreRegex }]);
      }
      const ariaRole = getAriaRole(element);
      if (ariaRole && !["none", "presentation"].includes(ariaRole)) {
        const ariaName = getElementAccessibleName(element, false);
        if (ariaName) {
          candidates.push([{ engine: "internal:role", selector: `${ariaRole}[name=${escapeForAttributeSelector(ariaName, false)}]`, score: kRoleWithNameScore }]);
          candidates.push([{ engine: "internal:role", selector: `${ariaRole}[name=${escapeForAttributeSelector(ariaName, true)}]`, score: kRoleWithNameScoreExact }]);
        }
      }
      penalizeScoreForLength(candidates);
      return candidates;
    }
    function makeSelectorForId(id) {
      return /^[a-zA-Z][a-zA-Z0-9\-\_]+$/.test(id) ? "#" + id : `[id="${cssEscape(id)}"]`;
    }
    function cssFallback(injectedScript, targetElement, options) {
      var _a;
      const root = (_a = options.root) != null ? _a : targetElement.ownerDocument;
      const tokens = [];
      function uniqueCSSSelector(prefix) {
        const path = tokens.slice();
        if (prefix)
          path.unshift(prefix);
        const selector = path.join(" > ");
        const parsedSelector = injectedScript.parseSelector(selector);
        const node = injectedScript.querySelector(parsedSelector, root, false);
        return node === targetElement ? selector : void 0;
      }
      function makeStrict(selector) {
        const token = { engine: "css", selector, score: kCSSFallbackScore };
        const parsedSelector = injectedScript.parseSelector(selector);
        const elements = injectedScript.querySelectorAll(parsedSelector, root);
        if (elements.length === 1)
          return [token];
        const nth = { engine: "nth", selector: String(elements.indexOf(targetElement)), score: kNthScore };
        return [token, nth];
      }
      for (let element = targetElement; element && element !== root; element = parentElementOrShadowHost(element)) {
        const nodeName = element.nodeName.toLowerCase();
        let bestTokenForLevel = "";
        if (element.id) {
          const token = makeSelectorForId(element.id);
          const selector = uniqueCSSSelector(token);
          if (selector)
            return makeStrict(selector);
          bestTokenForLevel = token;
        }
        const parent = element.parentNode;
        const classes = [...element.classList];
        for (let i = 0; i < classes.length; ++i) {
          const token = "." + cssEscape(classes.slice(0, i + 1).join("."));
          const selector = uniqueCSSSelector(token);
          if (selector)
            return makeStrict(selector);
          if (!bestTokenForLevel && parent) {
            const sameClassSiblings = parent.querySelectorAll(token);
            if (sameClassSiblings.length === 1)
              bestTokenForLevel = token;
          }
        }
        if (parent) {
          const siblings = [...parent.children];
          const sameTagSiblings = siblings.filter((sibling) => sibling.nodeName.toLowerCase() === nodeName);
          const token = sameTagSiblings.indexOf(element) === 0 ? cssEscape(nodeName) : `${cssEscape(nodeName)}:nth-child(${1 + siblings.indexOf(element)})`;
          const selector = uniqueCSSSelector(token);
          if (selector)
            return makeStrict(selector);
          if (!bestTokenForLevel)
            bestTokenForLevel = token;
        } else if (!bestTokenForLevel) {
          bestTokenForLevel = cssEscape(nodeName);
        }
        tokens.unshift(bestTokenForLevel);
      }
      return makeStrict(uniqueCSSSelector());
    }
    function quoteAttributeValue(text) {
      return `"${cssEscape(text).replace(/\\ /g, " ")}"`;
    }
    function penalizeScoreForLength(groups) {
      for (const group of groups) {
        for (const token of group) {
          if (token.score > kBeginPenalizedScore && token.score < kEndPenalizedScore)
            token.score += Math.min(kTextScoreRange, token.selector.length / 10 | 0);
        }
      }
    }
    function joinTokens(tokens) {
      const parts = [];
      let lastEngine = "";
      for (const { engine, selector } of tokens) {
        if (parts.length && (lastEngine !== "css" || engine !== "css" || selector.startsWith(":nth-match(")))
          parts.push(">>");
        lastEngine = engine;
        if (engine === "css")
          parts.push(selector);
        else
          parts.push(`${engine}=${selector}`);
      }
      return parts.join(" ");
    }
    function combineScores(tokens) {
      let score = 0;
      for (let i = 0; i < tokens.length; i++)
        score += tokens[i].score * (tokens.length - i);
      return score;
    }
    function chooseFirstSelector(injectedScript, scope, targetElement, selectors, allowNthMatch) {
      const joined = selectors.map((tokens) => ({ tokens, score: combineScores(tokens) }));
      joined.sort((a, b) => a.score - b.score);
      let bestWithIndex = null;
      for (const { tokens } of joined) {
        const parsedSelector = injectedScript.parseSelector(joinTokens(tokens));
        const result = injectedScript.querySelectorAll(parsedSelector, scope);
        if (result[0] === targetElement && result.length === 1) {
          return tokens;
        }
        const index = result.indexOf(targetElement);
        if (!allowNthMatch || bestWithIndex || index === -1 || result.length > 5)
          continue;
        const nth = { engine: "nth", selector: String(index), score: kNthScore };
        bestWithIndex = [...tokens, nth];
      }
      return bestWithIndex;
    }
    function isGuidLike(id) {
      let lastCharacterType;
      let transitionCount = 0;
      for (let i = 0; i < id.length; ++i) {
        const c = id[i];
        let characterType;
        if (c === "-" || c === "_")
          continue;
        if (c >= "a" && c <= "z")
          characterType = "lower";
        else if (c >= "A" && c <= "Z")
          characterType = "upper";
        else if (c >= "0" && c <= "9")
          characterType = "digit";
        else
          characterType = "other";
        if (characterType === "lower" && lastCharacterType === "upper") {
          lastCharacterType = characterType;
          continue;
        }
        if (lastCharacterType && lastCharacterType !== characterType)
          ++transitionCount;
        lastCharacterType = characterType;
      }
      return transitionCount >= id.length / 4;
    }
    function escapeRegExp(s) {
      return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    
    // packages/playwright-core/src/utils/isomorphic/locatorGenerators.ts
    function asLocator(lang, selector, isFrameLocator = false, playSafe = false) {
      return asLocators(lang, selector, isFrameLocator, playSafe)[0];
    }
    function asLocators(lang, selector, isFrameLocator = false, playSafe = false, maxOutputSize = 20) {
      if (playSafe) {
        try {
          return innerAsLocators(generators[lang], parseSelector(selector), isFrameLocator, maxOutputSize);
        } catch (e) {
          return [selector];
        }
      } else {
        return innerAsLocators(generators[lang], parseSelector(selector), isFrameLocator, maxOutputSize);
      }
    }
    function innerAsLocators(factory, parsed, isFrameLocator = false, maxOutputSize = 20) {
      const parts = [...parsed.parts];
      for (let index = 0; index < parts.length - 1; index++) {
        if (parts[index].name === "nth" && parts[index + 1].name === "internal:control" && parts[index + 1].body === "enter-frame") {
          const [nth] = parts.splice(index, 1);
          parts.splice(index + 1, 0, nth);
        }
      }
      const tokens = [];
      let nextBase = isFrameLocator ? "frame-locator" : "page";
      for (let index = 0; index < parts.length; index++) {
        const part = parts[index];
        const base = nextBase;
        nextBase = "locator";
        if (part.name === "nth") {
          if (part.body === "0")
            tokens.push([factory.generateLocator(base, "first", ""), factory.generateLocator(base, "nth", "0")]);
          else if (part.body === "-1")
            tokens.push([factory.generateLocator(base, "last", ""), factory.generateLocator(base, "nth", "-1")]);
          else
            tokens.push([factory.generateLocator(base, "nth", part.body)]);
          continue;
        }
        if (part.name === "internal:text") {
          const { exact, text } = detectExact(part.body);
          tokens.push([factory.generateLocator(base, "text", text, { exact })]);
          continue;
        }
        if (part.name === "internal:has-text") {
          const { exact, text } = detectExact(part.body);
          if (!exact) {
            tokens.push([factory.generateLocator(base, "has-text", text, { exact })]);
            continue;
          }
        }
        if (part.name === "internal:has-not-text") {
          const { exact, text } = detectExact(part.body);
          if (!exact) {
            tokens.push([factory.generateLocator(base, "has-not-text", text, { exact })]);
            continue;
          }
        }
        if (part.name === "internal:has") {
          const inners = innerAsLocators(factory, part.body.parsed, false, maxOutputSize);
          tokens.push(inners.map((inner) => factory.generateLocator(base, "has", inner)));
          continue;
        }
        if (part.name === "internal:has-not") {
          const inners = innerAsLocators(factory, part.body.parsed, false, maxOutputSize);
          tokens.push(inners.map((inner) => factory.generateLocator(base, "hasNot", inner)));
          continue;
        }
        if (part.name === "internal:and") {
          const inners = innerAsLocators(factory, part.body.parsed, false, maxOutputSize);
          tokens.push(inners.map((inner) => factory.generateLocator(base, "and", inner)));
          continue;
        }
        if (part.name === "internal:or") {
          const inners = innerAsLocators(factory, part.body.parsed, false, maxOutputSize);
          tokens.push(inners.map((inner) => factory.generateLocator(base, "or", inner)));
          continue;
        }
        if (part.name === "internal:chain") {
          const inners = innerAsLocators(factory, part.body.parsed, false, maxOutputSize);
          tokens.push(inners.map((inner) => factory.generateLocator(base, "chain", inner)));
          continue;
        }
        if (part.name === "internal:label") {
          const { exact, text } = detectExact(part.body);
          tokens.push([factory.generateLocator(base, "label", text, { exact })]);
          continue;
        }
        if (part.name === "internal:role") {
          const attrSelector = parseAttributeSelector(part.body, true);
          const options = { attrs: [] };
          for (const attr of attrSelector.attributes) {
            if (attr.name === "name") {
              options.exact = attr.caseSensitive;
              options.name = attr.value;
            } else {
              if (attr.name === "level" && typeof attr.value === "string")
                attr.value = +attr.value;
              options.attrs.push({ name: attr.name === "include-hidden" ? "includeHidden" : attr.name, value: attr.value });
            }
          }
          tokens.push([factory.generateLocator(base, "role", attrSelector.name, options)]);
          continue;
        }
        if (part.name === "internal:testid") {
          const attrSelector = parseAttributeSelector(part.body, true);
          const { value } = attrSelector.attributes[0];
          tokens.push([factory.generateLocator(base, "test-id", value)]);
          continue;
        }
        if (part.name === "internal:attr") {
          const attrSelector = parseAttributeSelector(part.body, true);
          const { name, value, caseSensitive } = attrSelector.attributes[0];
          const text = value;
          const exact = !!caseSensitive;
          if (name === "placeholder") {
            tokens.push([factory.generateLocator(base, "placeholder", text, { exact })]);
            continue;
          }
          if (name === "alt") {
            tokens.push([factory.generateLocator(base, "alt", text, { exact })]);
            continue;
          }
          if (name === "title") {
            tokens.push([factory.generateLocator(base, "title", text, { exact })]);
            continue;
          }
        }
        let locatorType = "default";
        const nextPart = parts[index + 1];
        if (nextPart && nextPart.name === "internal:control" && nextPart.body === "enter-frame") {
          locatorType = "frame";
          nextBase = "frame-locator";
          index++;
        }
        const selectorPart = stringifySelector({ parts: [part] });
        const locatorPart = factory.generateLocator(base, locatorType, selectorPart);
        if (locatorType === "default" && nextPart && ["internal:has-text", "internal:has-not-text"].includes(nextPart.name)) {
          const { exact, text } = detectExact(nextPart.body);
          if (!exact) {
            const nextLocatorPart = factory.generateLocator("locator", nextPart.name === "internal:has-text" ? "has-text" : "has-not-text", text, { exact });
            const options = {};
            if (nextPart.name === "internal:has-text")
              options.hasText = text;
            else
              options.hasNotText = text;
            const combinedPart = factory.generateLocator(base, "default", selectorPart, options);
            tokens.push([factory.chainLocators([locatorPart, nextLocatorPart]), combinedPart]);
            index++;
            continue;
          }
        }
        tokens.push([locatorPart]);
      }
      return combineTokens(factory, tokens, maxOutputSize);
    }
    function combineTokens(factory, tokens, maxOutputSize) {
      const currentTokens = tokens.map(() => "");
      const result = [];
      const visit = (index) => {
        if (index === tokens.length) {
          result.push(factory.chainLocators(currentTokens));
          return currentTokens.length < maxOutputSize;
        }
        for (const taken of tokens[index]) {
          currentTokens[index] = taken;
          if (!visit(index + 1))
            return false;
        }
        return true;
      };
      visit(0);
      return result;
    }
    function detectExact(text) {
      let exact = false;
      const match = text.match(/^\/(.*)\/([igm]*)$/);
      if (match)
        return { text: new RegExp(match[1], match[2]) };
      if (text.endsWith('"')) {
        text = JSON.parse(text);
        exact = true;
      } else if (text.endsWith('"s')) {
        text = JSON.parse(text.substring(0, text.length - 1));
        exact = true;
      } else if (text.endsWith('"i')) {
        text = JSON.parse(text.substring(0, text.length - 1));
        exact = false;
      }
      return { exact, text };
    }
    var JavaScriptLocatorFactory = class {
      generateLocator(base, kind, body, options = {}) {
        switch (kind) {
          case "default":
            if (options.hasText !== void 0)
              return `locator(${this.quote(body)}, { hasText: ${this.toHasText(options.hasText)} })`;
            if (options.hasNotText !== void 0)
              return `locator(${this.quote(body)}, { hasNotText: ${this.toHasText(options.hasNotText)} })`;
            return `locator(${this.quote(body)})`;
          case "frame":
            return `frameLocator(${this.quote(body)})`;
          case "nth":
            return `nth(${body})`;
          case "first":
            return `first()`;
          case "last":
            return `last()`;
          case "role":
            const attrs = [];
            if (isRegExp(options.name)) {
              attrs.push(`name: ${this.regexToSourceString(options.name)}`);
            } else if (typeof options.name === "string") {
              attrs.push(`name: ${this.quote(options.name)}`);
              if (options.exact)
                attrs.push(`exact: true`);
            }
            for (const { name, value } of options.attrs)
              attrs.push(`${name}: ${typeof value === "string" ? this.quote(value) : value}`);
            const attrString = attrs.length ? `, { ${attrs.join(", ")} }` : "";
            return `getByRole(${this.quote(body)}${attrString})`;
          case "has-text":
            return `filter({ hasText: ${this.toHasText(body)} })`;
          case "has-not-text":
            return `filter({ hasNotText: ${this.toHasText(body)} })`;
          case "has":
            return `filter({ has: ${body} })`;
          case "hasNot":
            return `filter({ hasNot: ${body} })`;
          case "and":
            return `and(${body})`;
          case "or":
            return `or(${body})`;
          case "chain":
            return `locator(${body})`;
          case "test-id":
            return `getByTestId(${this.toTestIdValue(body)})`;
          case "text":
            return this.toCallWithExact("getByText", body, !!options.exact);
          case "alt":
            return this.toCallWithExact("getByAltText", body, !!options.exact);
          case "placeholder":
            return this.toCallWithExact("getByPlaceholder", body, !!options.exact);
          case "label":
            return this.toCallWithExact("getByLabel", body, !!options.exact);
          case "title":
            return this.toCallWithExact("getByTitle", body, !!options.exact);
          default:
            throw new Error("Unknown selector kind " + kind);
        }
      }
      chainLocators(locators) {
        return locators.join(".");
      }
      regexToSourceString(re) {
        return normalizeEscapedRegexQuotes(String(re));
      }
      toCallWithExact(method, body, exact) {
        if (isRegExp(body))
          return `${method}(${this.regexToSourceString(body)})`;
        return exact ? `${method}(${this.quote(body)}, { exact: true })` : `${method}(${this.quote(body)})`;
      }
      toHasText(body) {
        if (isRegExp(body))
          return this.regexToSourceString(body);
        return this.quote(body);
      }
      toTestIdValue(value) {
        if (isRegExp(value))
          return this.regexToSourceString(value);
        return this.quote(value);
      }
      quote(text) {
        return escapeWithQuotes(text, "'");
      }
    };
    var PythonLocatorFactory = class {
      generateLocator(base, kind, body, options = {}) {
        switch (kind) {
          case "default":
            if (options.hasText !== void 0)
              return `locator(${this.quote(body)}, has_text=${this.toHasText(options.hasText)})`;
            if (options.hasNotText !== void 0)
              return `locator(${this.quote(body)}, has_not_text=${this.toHasText(options.hasNotText)})`;
            return `locator(${this.quote(body)})`;
          case "frame":
            return `frame_locator(${this.quote(body)})`;
          case "nth":
            return `nth(${body})`;
          case "first":
            return `first`;
          case "last":
            return `last`;
          case "role":
            const attrs = [];
            if (isRegExp(options.name)) {
              attrs.push(`name=${this.regexToString(options.name)}`);
            } else if (typeof options.name === "string") {
              attrs.push(`name=${this.quote(options.name)}`);
              if (options.exact)
                attrs.push(`exact=True`);
            }
            for (const { name, value } of options.attrs) {
              let valueString = typeof value === "string" ? this.quote(value) : value;
              if (typeof value === "boolean")
                valueString = value ? "True" : "False";
              attrs.push(`${toSnakeCase(name)}=${valueString}`);
            }
            const attrString = attrs.length ? `, ${attrs.join(", ")}` : "";
            return `get_by_role(${this.quote(body)}${attrString})`;
          case "has-text":
            return `filter(has_text=${this.toHasText(body)})`;
          case "has-not-text":
            return `filter(has_not_text=${this.toHasText(body)})`;
          case "has":
            return `filter(has=${body})`;
          case "hasNot":
            return `filter(has_not=${body})`;
          case "and":
            return `and_(${body})`;
          case "or":
            return `or_(${body})`;
          case "chain":
            return `locator(${body})`;
          case "test-id":
            return `get_by_test_id(${this.toTestIdValue(body)})`;
          case "text":
            return this.toCallWithExact("get_by_text", body, !!options.exact);
          case "alt":
            return this.toCallWithExact("get_by_alt_text", body, !!options.exact);
          case "placeholder":
            return this.toCallWithExact("get_by_placeholder", body, !!options.exact);
          case "label":
            return this.toCallWithExact("get_by_label", body, !!options.exact);
          case "title":
            return this.toCallWithExact("get_by_title", body, !!options.exact);
          default:
            throw new Error("Unknown selector kind " + kind);
        }
      }
      chainLocators(locators) {
        return locators.join(".");
      }
      regexToString(body) {
        const suffix = body.flags.includes("i") ? ", re.IGNORECASE" : "";
        return `re.compile(r"${normalizeEscapedRegexQuotes(body.source).replace(/\\\//, "/").replace(/"/g, '\\"')}"${suffix})`;
      }
      toCallWithExact(method, body, exact) {
        if (isRegExp(body))
          return `${method}(${this.regexToString(body)})`;
        if (exact)
          return `${method}(${this.quote(body)}, exact=True)`;
        return `${method}(${this.quote(body)})`;
      }
      toHasText(body) {
        if (isRegExp(body))
          return this.regexToString(body);
        return `${this.quote(body)}`;
      }
      toTestIdValue(value) {
        if (isRegExp(value))
          return this.regexToString(value);
        return this.quote(value);
      }
      quote(text) {
        return escapeWithQuotes(text, '"');
      }
    };
    var JavaLocatorFactory = class {
      generateLocator(base, kind, body, options = {}) {
        let clazz;
        switch (base) {
          case "page":
            clazz = "Page";
            break;
          case "frame-locator":
            clazz = "FrameLocator";
            break;
          case "locator":
            clazz = "Locator";
            break;
        }
        switch (kind) {
          case "default":
            if (options.hasText !== void 0)
              return `locator(${this.quote(body)}, new ${clazz}.LocatorOptions().setHasText(${this.toHasText(options.hasText)}))`;
            if (options.hasNotText !== void 0)
              return `locator(${this.quote(body)}, new ${clazz}.LocatorOptions().setHasNotText(${this.toHasText(options.hasNotText)}))`;
            return `locator(${this.quote(body)})`;
          case "frame":
            return `frameLocator(${this.quote(body)})`;
          case "nth":
            return `nth(${body})`;
          case "first":
            return `first()`;
          case "last":
            return `last()`;
          case "role":
            const attrs = [];
            if (isRegExp(options.name)) {
              attrs.push(`.setName(${this.regexToString(options.name)})`);
            } else if (typeof options.name === "string") {
              attrs.push(`.setName(${this.quote(options.name)})`);
              if (options.exact)
                attrs.push(`.setExact(true)`);
            }
            for (const { name, value } of options.attrs)
              attrs.push(`.set${toTitleCase(name)}(${typeof value === "string" ? this.quote(value) : value})`);
            const attrString = attrs.length ? `, new ${clazz}.GetByRoleOptions()${attrs.join("")}` : "";
            return `getByRole(AriaRole.${toSnakeCase(body).toUpperCase()}${attrString})`;
          case "has-text":
            return `filter(new ${clazz}.FilterOptions().setHasText(${this.toHasText(body)}))`;
          case "has-not-text":
            return `filter(new ${clazz}.FilterOptions().setHasNotText(${this.toHasText(body)}))`;
          case "has":
            return `filter(new ${clazz}.FilterOptions().setHas(${body}))`;
          case "hasNot":
            return `filter(new ${clazz}.FilterOptions().setHasNot(${body}))`;
          case "and":
            return `and(${body})`;
          case "or":
            return `or(${body})`;
          case "chain":
            return `locator(${body})`;
          case "test-id":
            return `getByTestId(${this.toTestIdValue(body)})`;
          case "text":
            return this.toCallWithExact(clazz, "getByText", body, !!options.exact);
          case "alt":
            return this.toCallWithExact(clazz, "getByAltText", body, !!options.exact);
          case "placeholder":
            return this.toCallWithExact(clazz, "getByPlaceholder", body, !!options.exact);
          case "label":
            return this.toCallWithExact(clazz, "getByLabel", body, !!options.exact);
          case "title":
            return this.toCallWithExact(clazz, "getByTitle", body, !!options.exact);
          default:
            throw new Error("Unknown selector kind " + kind);
        }
      }
      chainLocators(locators) {
        return locators.join(".");
      }
      regexToString(body) {
        const suffix = body.flags.includes("i") ? ", Pattern.CASE_INSENSITIVE" : "";
        return `Pattern.compile(${this.quote(normalizeEscapedRegexQuotes(body.source))}${suffix})`;
      }
      toCallWithExact(clazz, method, body, exact) {
        if (isRegExp(body))
          return `${method}(${this.regexToString(body)})`;
        if (exact)
          return `${method}(${this.quote(body)}, new ${clazz}.${toTitleCase(method)}Options().setExact(true))`;
        return `${method}(${this.quote(body)})`;
      }
      toHasText(body) {
        if (isRegExp(body))
          return this.regexToString(body);
        return this.quote(body);
      }
      toTestIdValue(value) {
        if (isRegExp(value))
          return this.regexToString(value);
        return this.quote(value);
      }
      quote(text) {
        return escapeWithQuotes(text, '"');
      }
    };
    var CSharpLocatorFactory = class {
      generateLocator(base, kind, body, options = {}) {
        switch (kind) {
          case "default":
            if (options.hasText !== void 0)
              return `Locator(${this.quote(body)}, new() { ${this.toHasText(options.hasText)} })`;
            if (options.hasNotText !== void 0)
              return `Locator(${this.quote(body)}, new() { ${this.toHasNotText(options.hasNotText)} })`;
            return `Locator(${this.quote(body)})`;
          case "frame":
            return `FrameLocator(${this.quote(body)})`;
          case "nth":
            return `Nth(${body})`;
          case "first":
            return `First`;
          case "last":
            return `Last`;
          case "role":
            const attrs = [];
            if (isRegExp(options.name)) {
              attrs.push(`NameRegex = ${this.regexToString(options.name)}`);
            } else if (typeof options.name === "string") {
              attrs.push(`Name = ${this.quote(options.name)}`);
              if (options.exact)
                attrs.push(`Exact = true`);
            }
            for (const { name, value } of options.attrs)
              attrs.push(`${toTitleCase(name)} = ${typeof value === "string" ? this.quote(value) : value}`);
            const attrString = attrs.length ? `, new() { ${attrs.join(", ")} }` : "";
            return `GetByRole(AriaRole.${toTitleCase(body)}${attrString})`;
          case "has-text":
            return `Filter(new() { ${this.toHasText(body)} })`;
          case "has-not-text":
            return `Filter(new() { ${this.toHasNotText(body)} })`;
          case "has":
            return `Filter(new() { Has = ${body} })`;
          case "hasNot":
            return `Filter(new() { HasNot = ${body} })`;
          case "and":
            return `And(${body})`;
          case "or":
            return `Or(${body})`;
          case "chain":
            return `Locator(${body})`;
          case "test-id":
            return `GetByTestId(${this.toTestIdValue(body)})`;
          case "text":
            return this.toCallWithExact("GetByText", body, !!options.exact);
          case "alt":
            return this.toCallWithExact("GetByAltText", body, !!options.exact);
          case "placeholder":
            return this.toCallWithExact("GetByPlaceholder", body, !!options.exact);
          case "label":
            return this.toCallWithExact("GetByLabel", body, !!options.exact);
          case "title":
            return this.toCallWithExact("GetByTitle", body, !!options.exact);
          default:
            throw new Error("Unknown selector kind " + kind);
        }
      }
      chainLocators(locators) {
        return locators.join(".");
      }
      regexToString(body) {
        const suffix = body.flags.includes("i") ? ", RegexOptions.IgnoreCase" : "";
        return `new Regex(${this.quote(normalizeEscapedRegexQuotes(body.source))}${suffix})`;
      }
      toCallWithExact(method, body, exact) {
        if (isRegExp(body))
          return `${method}(${this.regexToString(body)})`;
        if (exact)
          return `${method}(${this.quote(body)}, new() { Exact = true })`;
        return `${method}(${this.quote(body)})`;
      }
      toHasText(body) {
        if (isRegExp(body))
          return `HasTextRegex = ${this.regexToString(body)}`;
        return `HasText = ${this.quote(body)}`;
      }
      toTestIdValue(value) {
        if (isRegExp(value))
          return this.regexToString(value);
        return this.quote(value);
      }
      toHasNotText(body) {
        if (isRegExp(body))
          return `HasNotTextRegex = ${this.regexToString(body)}`;
        return `HasNotText = ${this.quote(body)}`;
      }
      quote(text) {
        return escapeWithQuotes(text, '"');
      }
    };
    var JsonlLocatorFactory = class {
      generateLocator(base, kind, body, options = {}) {
        return JSON.stringify({
          kind,
          body,
          options
        });
      }
      chainLocators(locators) {
        const objects = locators.map((l) => JSON.parse(l));
        for (let i = 0; i < objects.length - 1; ++i)
          objects[i].next = objects[i + 1];
        return JSON.stringify(objects[0]);
      }
    };
    var generators = {
      javascript: new JavaScriptLocatorFactory(),
      python: new PythonLocatorFactory(),
      java: new JavaLocatorFactory(),
      csharp: new CSharpLocatorFactory(),
      jsonl: new JsonlLocatorFactory()
    };
    function isRegExp(obj) {
      return obj instanceof RegExp;
    }
    
    // packages/playwright-core/src/server/injected/highlight.ts
    var Highlight = class {
      constructor(injectedScript) {
        this._highlightEntries = [];
        this._language = "javascript";
        this._injectedScript = injectedScript;
        const document = injectedScript.document;
        this._isUnderTest = injectedScript.isUnderTest;
        this._glassPaneElement = document.createElement("x-pw-glass");
        this._glassPaneElement.style.position = "fixed";
        this._glassPaneElement.style.top = "0";
        this._glassPaneElement.style.right = "0";
        this._glassPaneElement.style.bottom = "0";
        this._glassPaneElement.style.left = "0";
        this._glassPaneElement.style.zIndex = "2147483647";
        this._glassPaneElement.style.pointerEvents = "none";
        this._glassPaneElement.style.display = "flex";
        this._glassPaneElement.style.backgroundColor = "transparent";
        this._actionPointElement = document.createElement("x-pw-action-point");
        this._actionPointElement.setAttribute("hidden", "true");
        this._glassPaneShadow = this._glassPaneElement.attachShadow({ mode: this._isUnderTest ? "open" : "closed" });
        this._glassPaneShadow.appendChild(this._actionPointElement);
        const styleElement = document.createElement("style");
        styleElement.textContent = `
            x-pw-tooltip {
              align-items: center;
              backdrop-filter: blur(5px);
              background-color: rgba(0, 0, 0, 0.7);
              border-radius: 2px;
              box-shadow: rgba(0, 0, 0, 0.1) 0px 3.6px 3.7px,
                          rgba(0, 0, 0, 0.15) 0px 12.1px 12.3px,
                          rgba(0, 0, 0, 0.1) 0px -2px 4px,
                          rgba(0, 0, 0, 0.15) 0px -12.1px 24px,
                          rgba(0, 0, 0, 0.25) 0px 54px 55px;
              color: rgb(204, 204, 204);
              display: none;
              font-family: 'Dank Mono', 'Operator Mono', Inconsolata, 'Fira Mono',
                          'SF Mono', Monaco, 'Droid Sans Mono', 'Source Code Pro', monospace;
              font-size: 12.8px;
              font-weight: normal;
              left: 0;
              line-height: 1.5;
              max-width: 600px;
              padding: 3.2px 5.12px 3.2px;
              position: absolute;
              top: 0;
            }
            x-pw-action-point {
              position: absolute;
              width: 20px;
              height: 20px;
              background: red;
              border-radius: 10px;
              pointer-events: none;
              margin: -10px 0 0 -10px;
              z-index: 2;
            }
            *[hidden] {
              display: none !important;
            }
        `;
        this._glassPaneShadow.appendChild(styleElement);
      }
      install() {
        this._injectedScript.document.documentElement.appendChild(this._glassPaneElement);
      }
      setLanguage(language) {
        this._language = language;
      }
      runHighlightOnRaf(selector) {
        if (this._rafRequest)
          cancelAnimationFrame(this._rafRequest);
        this.updateHighlight(this._injectedScript.querySelectorAll(selector, this._injectedScript.document.documentElement), stringifySelector(selector), false);
        this._rafRequest = requestAnimationFrame(() => this.runHighlightOnRaf(selector));
      }
      uninstall() {
        if (this._rafRequest)
          cancelAnimationFrame(this._rafRequest);
        this._glassPaneElement.remove();
      }
      isInstalled() {
        return this._glassPaneElement.parentElement === this._injectedScript.document.documentElement && !this._glassPaneElement.nextElementSibling;
      }
      showActionPoint(x, y) {
        this._actionPointElement.style.top = y + "px";
        this._actionPointElement.style.left = x + "px";
        this._actionPointElement.hidden = false;
        if (this._isUnderTest)
          console.error("Action point for test: " + JSON.stringify({ x, y }));
      }
      hideActionPoint() {
        this._actionPointElement.hidden = true;
      }
      clearHighlight() {
        var _a, _b;
        for (const entry of this._highlightEntries) {
          (_a = entry.highlightElement) == null ? void 0 : _a.remove();
          (_b = entry.tooltipElement) == null ? void 0 : _b.remove();
        }
        this._highlightEntries = [];
      }
      updateHighlight(elements, selector, isRecording) {
        let color;
        if (isRecording)
          color = "#dc6f6f7f";
        else
          color = elements.length > 1 ? "#f6b26b7f" : "#6fa8dc7f";
        this._innerUpdateHighlight(elements, { color, tooltipText: selector ? asLocator(this._language, selector) : "" });
      }
      maskElements(elements, color) {
        this._innerUpdateHighlight(elements, { color: color ? color : "#F0F" });
      }
      _innerUpdateHighlight(elements, options) {
        if (this._highlightIsUpToDate(elements, options.tooltipText))
          return;
        this.clearHighlight();
        for (let i = 0; i < elements.length; ++i) {
          const highlightElement = this._createHighlightElement();
          this._glassPaneShadow.appendChild(highlightElement);
          let tooltipElement;
          if (options.tooltipText) {
            tooltipElement = this._injectedScript.document.createElement("x-pw-tooltip");
            this._glassPaneShadow.appendChild(tooltipElement);
            const suffix = elements.length > 1 ? ` [${i + 1} of ${elements.length}]` : "";
            tooltipElement.textContent = options.tooltipText + suffix;
            tooltipElement.style.top = "0";
            tooltipElement.style.left = "0";
            tooltipElement.style.display = "flex";
          }
          this._highlightEntries.push({ targetElement: elements[i], tooltipElement, highlightElement, tooltipText: options.tooltipText });
        }
        for (const entry of this._highlightEntries) {
          entry.box = entry.targetElement.getBoundingClientRect();
          if (!entry.tooltipElement)
            continue;
          const tooltipWidth = entry.tooltipElement.offsetWidth;
          const tooltipHeight = entry.tooltipElement.offsetHeight;
          const totalWidth = this._glassPaneElement.offsetWidth;
          const totalHeight = this._glassPaneElement.offsetHeight;
          let anchorLeft = entry.box.left;
          if (anchorLeft + tooltipWidth > totalWidth - 5)
            anchorLeft = totalWidth - tooltipWidth - 5;
          let anchorTop = entry.box.bottom + 5;
          if (anchorTop + tooltipHeight > totalHeight - 5) {
            if (entry.box.top > tooltipHeight + 5) {
              anchorTop = entry.box.top - tooltipHeight - 5;
            } else {
              anchorTop = totalHeight - 5 - tooltipHeight;
            }
          }
          entry.tooltipTop = anchorTop;
          entry.tooltipLeft = anchorLeft;
        }
        for (const entry of this._highlightEntries) {
          if (entry.tooltipElement) {
            entry.tooltipElement.style.top = entry.tooltipTop + "px";
            entry.tooltipElement.style.left = entry.tooltipLeft + "px";
          }
          const box = entry.box;
          entry.highlightElement.style.backgroundColor = options.color;
          entry.highlightElement.style.left = box.x + "px";
          entry.highlightElement.style.top = box.y + "px";
          entry.highlightElement.style.width = box.width + "px";
          entry.highlightElement.style.height = box.height + "px";
          entry.highlightElement.style.display = "block";
          if (this._isUnderTest)
            console.error("Highlight box for test: " + JSON.stringify({ x: box.x, y: box.y, width: box.width, height: box.height }));
        }
      }
      _highlightIsUpToDate(elements, tooltipText) {
        if (elements.length !== this._highlightEntries.length)
          return false;
        for (let i = 0; i < this._highlightEntries.length; ++i) {
          if (tooltipText !== this._highlightEntries[i].tooltipText)
            return false;
          if (elements[i] !== this._highlightEntries[i].targetElement)
            return false;
          const oldBox = this._highlightEntries[i].box;
          if (!oldBox)
            return false;
          const box = elements[i].getBoundingClientRect();
          if (box.top !== oldBox.top || box.right !== oldBox.right || box.bottom !== oldBox.bottom || box.left !== oldBox.left)
            return false;
        }
        return true;
      }
      _createHighlightElement() {
        const highlightElement = this._injectedScript.document.createElement("x-pw-highlight");
        highlightElement.style.position = "absolute";
        highlightElement.style.top = "0";
        highlightElement.style.left = "0";
        highlightElement.style.width = "0";
        highlightElement.style.height = "0";
        highlightElement.style.boxSizing = "border-box";
        return highlightElement;
      }
    };
    
    // packages/playwright-core/src/server/injected/injectedScript.ts
    var InjectedScript = class {
      // eslint-disable-next-line no-restricted-globals
      constructor(window, isUnderTest, sdkLanguage, testIdAttributeNameForStrictErrorAndConsoleCodegen, stableRafCount, browserName, customEngines) {
        this.onGlobalListenersRemoved = /* @__PURE__ */ new Set();
        this._testIdAttributeNameForStrictErrorAndConsoleCodegen = "data-testid";
        this.window = window;
        this.document = window.document;
        this.isUnderTest = isUnderTest;
        this._sdkLanguage = sdkLanguage;
        this._testIdAttributeNameForStrictErrorAndConsoleCodegen = testIdAttributeNameForStrictErrorAndConsoleCodegen;
        this._evaluator = new SelectorEvaluatorImpl(/* @__PURE__ */ new Map());
        this._engines = /* @__PURE__ */ new Map();
        this._engines.set("xpath", XPathEngine);
        this._engines.set("xpath:light", XPathEngine);
        this._engines.set("_react", ReactEngine);
        this._engines.set("_vue", VueEngine);
        this._engines.set("role", createRoleEngine(false));
        this._engines.set("text", this._createTextEngine(true, false));
        this._engines.set("text:light", this._createTextEngine(false, false));
        this._engines.set("id", this._createAttributeEngine("id", true));
        this._engines.set("id:light", this._createAttributeEngine("id", false));
        this._engines.set("data-testid", this._createAttributeEngine("data-testid", true));
        this._engines.set("data-testid:light", this._createAttributeEngine("data-testid", false));
        this._engines.set("data-test-id", this._createAttributeEngine("data-test-id", true));
        this._engines.set("data-test-id:light", this._createAttributeEngine("data-test-id", false));
        this._engines.set("data-test", this._createAttributeEngine("data-test", true));
        this._engines.set("data-test:light", this._createAttributeEngine("data-test", false));
        this._engines.set("css", this._createCSSEngine());
        this._engines.set("nth", { queryAll: () => [] });
        this._engines.set("visible", this._createVisibleEngine());
        this._engines.set("internal:control", this._createControlEngine());
        this._engines.set("internal:has", this._createHasEngine());
        this._engines.set("internal:has-not", this._createHasNotEngine());
        this._engines.set("internal:and", { queryAll: () => [] });
        this._engines.set("internal:or", { queryAll: () => [] });
        this._engines.set("internal:chain", this._createInternalChainEngine());
        this._engines.set("internal:label", this._createInternalLabelEngine());
        this._engines.set("internal:text", this._createTextEngine(true, true));
        this._engines.set("internal:has-text", this._createInternalHasTextEngine());
        this._engines.set("internal:has-not-text", this._createInternalHasNotTextEngine());
        this._engines.set("internal:attr", this._createNamedAttributeEngine());
        this._engines.set("internal:testid", this._createNamedAttributeEngine());
        this._engines.set("internal:role", createRoleEngine(true));
        for (const { name, engine } of customEngines)
          this._engines.set(name, engine);
        this._stableRafCount = stableRafCount;
        this._browserName = browserName;
        this._setupGlobalListenersRemovalDetection();
        this._setupHitTargetInterceptors();
        if (isUnderTest)
          this.window.__injectedScript = this;
      }
      eval(expression) {
        return this.window.eval(expression);
      }
      testIdAttributeNameForStrictErrorAndConsoleCodegen() {
        return this._testIdAttributeNameForStrictErrorAndConsoleCodegen;
      }
      parseSelector(selector) {
        const result = parseSelector(selector);
        visitAllSelectorParts(result, (part) => {
          if (!this._engines.has(part.name))
            throw this.createStacklessError(`Unknown engine "${part.name}" while parsing selector ${selector}`);
        });
        return result;
      }
      generateSelector(targetElement, options) {
        return generateSelector(this, targetElement, { ...options, testIdAttributeName: this._testIdAttributeNameForStrictErrorAndConsoleCodegen }).selector;
      }
      querySelector(selector, root, strict) {
        const result = this.querySelectorAll(selector, root);
        if (strict && result.length > 1)
          throw this.strictModeViolationError(selector, result);
        return result[0];
      }
      _queryNth(elements, part) {
        const list = [...elements];
        let nth = +part.body;
        if (nth === -1)
          nth = list.length - 1;
        return new Set(list.slice(nth, nth + 1));
      }
      _queryLayoutSelector(elements, part, originalRoot) {
        const name = part.name;
        const body = part.body;
        const result = [];
        const inner = this.querySelectorAll(body.parsed, originalRoot);
        for (const element of elements) {
          const score = layoutSelectorScore(name, element, inner, body.distance);
          if (score !== void 0)
            result.push({ element, score });
        }
        result.sort((a, b) => a.score - b.score);
        return new Set(result.map((r) => r.element));
      }
      querySelectorAll(selector, root) {
        if (selector.capture !== void 0) {
          if (selector.parts.some((part) => part.name === "nth"))
            throw this.createStacklessError(`Can't query n-th element in a request with the capture.`);
          const withHas = { parts: selector.parts.slice(0, selector.capture + 1) };
          if (selector.capture < selector.parts.length - 1) {
            const parsed = { parts: selector.parts.slice(selector.capture + 1) };
            const has = { name: "internal:has", body: { parsed }, source: stringifySelector(parsed) };
            withHas.parts.push(has);
          }
          return this.querySelectorAll(withHas, root);
        }
        if (!root["querySelectorAll"])
          throw this.createStacklessError("Node is not queryable.");
        if (selector.capture !== void 0) {
          throw this.createStacklessError("Internal error: there should not be a capture in the selector.");
        }
        if (root.nodeType === 11 && selector.parts.length === 1 && selector.parts[0].name === "css" && selector.parts[0].source === ":scope")
          return [root];
        this._evaluator.begin();
        try {
          let roots = /* @__PURE__ */ new Set([root]);
          for (const part of selector.parts) {
            if (part.name === "nth") {
              roots = this._queryNth(roots, part);
            } else if (part.name === "internal:and") {
              const andElements = this.querySelectorAll(part.body.parsed, root);
              roots = new Set(andElements.filter((e) => roots.has(e)));
            } else if (part.name === "internal:or") {
              const orElements = this.querySelectorAll(part.body.parsed, root);
              roots = new Set(sortInDOMOrder(/* @__PURE__ */ new Set([...roots, ...orElements])));
            } else if (kLayoutSelectorNames.includes(part.name)) {
              roots = this._queryLayoutSelector(roots, part, root);
            } else {
              const next = /* @__PURE__ */ new Set();
              for (const root2 of roots) {
                const all = this._queryEngineAll(part, root2);
                for (const one of all)
                  next.add(one);
              }
              roots = next;
            }
          }
          return [...roots];
        } finally {
          this._evaluator.end();
        }
      }
      _queryEngineAll(part, root) {
        const result = this._engines.get(part.name).queryAll(root, part.body);
        for (const element of result) {
          if (!("nodeName" in element))
            throw this.createStacklessError(`Expected a Node but got ${Object.prototype.toString.call(element)}`);
        }
        return result;
      }
      _createAttributeEngine(attribute, shadow) {
        const toCSS = (selector) => {
          const css = `[${attribute}=${JSON.stringify(selector)}]`;
          return [{ simples: [{ selector: { css, functions: [] }, combinator: "" }] }];
        };
        return {
          queryAll: (root, selector) => {
            return this._evaluator.query({ scope: root, pierceShadow: shadow }, toCSS(selector));
          }
        };
      }
      _createCSSEngine() {
        return {
          queryAll: (root, body) => {
            return this._evaluator.query({ scope: root, pierceShadow: true }, body);
          }
        };
      }
      _createTextEngine(shadow, internal) {
        const queryAll = (root, selector) => {
          const { matcher, kind } = createTextMatcher(selector, internal);
          const result = [];
          let lastDidNotMatchSelf = null;
          const appendElement = (element) => {
            if (kind === "lax" && lastDidNotMatchSelf && lastDidNotMatchSelf.contains(element))
              return false;
            const matches = elementMatchesText(this._evaluator._cacheText, element, matcher);
            if (matches === "none")
              lastDidNotMatchSelf = element;
            if (matches === "self" || matches === "selfAndChildren" && kind === "strict" && !internal)
              result.push(element);
          };
          if (root.nodeType === Node.ELEMENT_NODE)
            appendElement(root);
          const elements = this._evaluator._queryCSS({ scope: root, pierceShadow: shadow }, "*");
          for (const element of elements)
            appendElement(element);
          return result;
        };
        return { queryAll };
      }
      _createInternalHasTextEngine() {
        return {
          queryAll: (root, selector) => {
            if (root.nodeType !== 1)
              return [];
            const element = root;
            const text = elementText(this._evaluator._cacheText, element);
            const { matcher } = createTextMatcher(selector, true);
            return matcher(text) ? [element] : [];
          }
        };
      }
      _createInternalHasNotTextEngine() {
        return {
          queryAll: (root, selector) => {
            if (root.nodeType !== 1)
              return [];
            const element = root;
            const text = elementText(this._evaluator._cacheText, element);
            const { matcher } = createTextMatcher(selector, true);
            return matcher(text) ? [] : [element];
          }
        };
      }
      _createInternalLabelEngine() {
        return {
          queryAll: (root, selector) => {
            const { matcher } = createTextMatcher(selector, true);
            const allElements = this._evaluator._queryCSS({ scope: root, pierceShadow: true }, "*");
            return allElements.filter((element) => {
              return getElementLabels(this._evaluator._cacheText, element).some((label) => matcher(label));
            });
          }
        };
      }
      _createNamedAttributeEngine() {
        const queryAll = (root, selector) => {
          const parsed = parseAttributeSelector(selector, true);
          if (parsed.name || parsed.attributes.length !== 1)
            throw new Error("Malformed attribute selector: " + selector);
          const { name, value, caseSensitive } = parsed.attributes[0];
          const lowerCaseValue = caseSensitive ? null : value.toLowerCase();
          let matcher;
          if (value instanceof RegExp)
            matcher = (s) => !!s.match(value);
          else if (caseSensitive)
            matcher = (s) => s === value;
          else
            matcher = (s) => s.toLowerCase().includes(lowerCaseValue);
          const elements = this._evaluator._queryCSS({ scope: root, pierceShadow: true }, `[${name}]`);
          return elements.filter((e) => matcher(e.getAttribute(name)));
        };
        return { queryAll };
      }
      _createControlEngine() {
        return {
          queryAll(root, body) {
            if (body === "enter-frame")
              return [];
            if (body === "return-empty")
              return [];
            if (body === "component") {
              if (root.nodeType !== 1)
                return [];
              return [root.childElementCount === 1 ? root.firstElementChild : root];
            }
            throw new Error(`Internal error, unknown internal:control selector ${body}`);
          }
        };
      }
      _createHasEngine() {
        const queryAll = (root, body) => {
          if (root.nodeType !== 1)
            return [];
          const has = !!this.querySelector(body.parsed, root, false);
          return has ? [root] : [];
        };
        return { queryAll };
      }
      _createHasNotEngine() {
        const queryAll = (root, body) => {
          if (root.nodeType !== 1)
            return [];
          const has = !!this.querySelector(body.parsed, root, false);
          return has ? [] : [root];
        };
        return { queryAll };
      }
      _createVisibleEngine() {
        const queryAll = (root, body) => {
          if (root.nodeType !== 1)
            return [];
          return isElementVisible(root) === Boolean(body) ? [root] : [];
        };
        return { queryAll };
      }
      _createInternalChainEngine() {
        const queryAll = (root, body) => {
          return this.querySelectorAll(body.parsed, root);
        };
        return { queryAll };
      }
      extend(source, params) {
        const constrFunction = this.window.eval(`
        (() => {
          const module = {};
          ${source}
          return module.exports.default();
        })()`);
        return new constrFunction(this, params);
      }
      isVisible(element) {
        return isElementVisible(element);
      }
      async viewportRatio(element) {
        return await new Promise((resolve) => {
          const observer = new IntersectionObserver((entries) => {
            resolve(entries[0].intersectionRatio);
            observer.disconnect();
          });
          observer.observe(element);
          requestAnimationFrame(() => {
          });
        });
      }
      pollRaf(predicate) {
        return this.poll(predicate, (next) => requestAnimationFrame(next));
      }
      poll(predicate, scheduleNext) {
        return this._runAbortableTask((progress) => {
          let fulfill;
          let reject;
          const result = new Promise((f, r) => {
            fulfill = f;
            reject = r;
          });
          const next = () => {
            if (progress.aborted)
              return;
            try {
              const success = predicate(progress);
              if (success !== progress.continuePolling)
                fulfill(success);
              else
                scheduleNext(next);
            } catch (e) {
              progress.log("  " + e.message);
              reject(e);
            }
          };
          next();
          return result;
        });
      }
      _runAbortableTask(task) {
        let unsentLog = [];
        let takeNextLogsCallback;
        let taskFinished = false;
        const logReady = () => {
          if (!takeNextLogsCallback)
            return;
          takeNextLogsCallback(unsentLog);
          unsentLog = [];
          takeNextLogsCallback = void 0;
        };
        const takeNextLogs = () => new Promise((fulfill) => {
          takeNextLogsCallback = fulfill;
          if (unsentLog.length || taskFinished)
            logReady();
        });
        let lastMessage = "";
        const progress = {
          injectedScript: this,
          aborted: false,
          continuePolling: Symbol("continuePolling"),
          log: (message) => {
            lastMessage = message;
            unsentLog.push({ message });
            logReady();
          },
          logRepeating: (message) => {
            if (message !== lastMessage)
              progress.log(message);
          }
        };
        const run = () => {
          const result = task(progress);
          result.finally(() => {
            taskFinished = true;
            logReady();
          });
          return result;
        };
        return {
          takeNextLogs,
          run,
          cancel: () => {
            progress.aborted = true;
          },
          takeLastLogs: () => unsentLog
        };
      }
      getElementBorderWidth(node) {
        if (node.nodeType !== Node.ELEMENT_NODE || !node.ownerDocument || !node.ownerDocument.defaultView)
          return { left: 0, top: 0 };
        const style = node.ownerDocument.defaultView.getComputedStyle(node);
        return { left: parseInt(style.borderLeftWidth || "", 10), top: parseInt(style.borderTopWidth || "", 10) };
      }
      describeIFrameStyle(iframe) {
        if (!iframe.ownerDocument || !iframe.ownerDocument.defaultView)
          return "error:notconnected";
        const defaultView = iframe.ownerDocument.defaultView;
        for (let e = iframe; e; e = parentElementOrShadowHost(e)) {
          if (defaultView.getComputedStyle(e).transform !== "none")
            return "transformed";
        }
        const iframeStyle = defaultView.getComputedStyle(iframe);
        return {
          left: parseInt(iframeStyle.borderLeftWidth || "", 10) + parseInt(iframeStyle.paddingLeft || "", 10),
          top: parseInt(iframeStyle.borderTopWidth || "", 10) + parseInt(iframeStyle.paddingTop || "", 10)
        };
      }
      retarget(node, behavior) {
        let element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
        if (!element)
          return null;
        if (behavior === "none")
          return element;
        if (!element.matches("input, textarea, select")) {
          if (behavior === "button-link")
            element = element.closest("button, [role=button], a, [role=link]") || element;
          else
            element = element.closest("button, [role=button], [role=checkbox], [role=radio]") || element;
        }
        if (behavior === "follow-label") {
          if (!element.matches("input, textarea, button, select, [role=button], [role=checkbox], [role=radio]") && !element.isContentEditable) {
            element = element.closest("label") || element;
          }
          if (element.nodeName === "LABEL")
            element = element.control || element;
        }
        return element;
      }
      waitForElementStatesAndPerformAction(node, states, force, callback) {
        let lastRect;
        let counter = 0;
        let samePositionCounter = 0;
        let lastTime = 0;
        return this.pollRaf((progress) => {
          if (force) {
            progress.log(`    forcing action`);
            return callback(node, progress);
          }
          for (const state of states) {
            if (state !== "stable") {
              const result = this.elementState(node, state);
              if (typeof result !== "boolean")
                return result;
              if (!result) {
                progress.logRepeating(`    element is not ${state} - waiting...`);
                return progress.continuePolling;
              }
              continue;
            }
            const element = this.retarget(node, "no-follow-label");
            if (!element)
              return "error:notconnected";
            if (++counter === 1)
              return progress.continuePolling;
            const time = performance.now();
            if (this._stableRafCount > 1 && time - lastTime < 15)
              return progress.continuePolling;
            lastTime = time;
            const clientRect = element.getBoundingClientRect();
            const rect = { x: clientRect.top, y: clientRect.left, width: clientRect.width, height: clientRect.height };
            const samePosition = lastRect && rect.x === lastRect.x && rect.y === lastRect.y && rect.width === lastRect.width && rect.height === lastRect.height;
            if (samePosition)
              ++samePositionCounter;
            else
              samePositionCounter = 0;
            const isStable = samePositionCounter >= this._stableRafCount;
            const isStableForLogs = isStable || !lastRect;
            lastRect = rect;
            if (!isStableForLogs)
              progress.logRepeating(`    element is not stable - waiting...`);
            if (!isStable)
              return progress.continuePolling;
          }
          return callback(node, progress);
        });
      }
      elementState(node, state) {
        const element = this.retarget(node, ["stable", "visible", "hidden"].includes(state) ? "none" : "follow-label");
        if (!element || !element.isConnected) {
          if (state === "hidden")
            return true;
          return "error:notconnected";
        }
        if (state === "visible")
          return this.isVisible(element);
        if (state === "hidden")
          return !this.isVisible(element);
        const disabled = getAriaDisabled(element);
        if (state === "disabled")
          return disabled;
        if (state === "enabled")
          return !disabled;
        const editable = !(["INPUT", "TEXTAREA", "SELECT"].includes(element.nodeName) && element.hasAttribute("readonly"));
        if (state === "editable")
          return !disabled && editable;
        if (state === "checked" || state === "unchecked") {
          const need = state === "checked";
          const checked = getChecked(element, false);
          if (checked === "error")
            throw this.createStacklessError("Not a checkbox or radio button");
          return need === checked;
        }
        throw this.createStacklessError(`Unexpected element state "${state}"`);
      }
      selectOptions(optionsToSelect, node, progress) {
        const element = this.retarget(node, "follow-label");
        if (!element)
          return "error:notconnected";
        if (element.nodeName.toLowerCase() !== "select")
          throw this.createStacklessError("Element is not a <select> element");
        const select = element;
        const options = [...select.options];
        const selectedOptions = [];
        let remainingOptionsToSelect = optionsToSelect.slice();
        for (let index = 0; index < options.length; index++) {
          const option = options[index];
          const filter = (optionToSelect) => {
            if (optionToSelect instanceof Node)
              return option === optionToSelect;
            let matches = true;
            if (optionToSelect.valueOrLabel !== void 0)
              matches = matches && (optionToSelect.valueOrLabel === option.value || optionToSelect.valueOrLabel === option.label);
            if (optionToSelect.value !== void 0)
              matches = matches && optionToSelect.value === option.value;
            if (optionToSelect.label !== void 0)
              matches = matches && optionToSelect.label === option.label;
            if (optionToSelect.index !== void 0)
              matches = matches && optionToSelect.index === index;
            return matches;
          };
          if (!remainingOptionsToSelect.some(filter))
            continue;
          selectedOptions.push(option);
          if (select.multiple) {
            remainingOptionsToSelect = remainingOptionsToSelect.filter((o) => !filter(o));
          } else {
            remainingOptionsToSelect = [];
            break;
          }
        }
        if (remainingOptionsToSelect.length) {
          progress.logRepeating("    did not find some options - waiting... ");
          return progress.continuePolling;
        }
        select.value = void 0;
        selectedOptions.forEach((option) => option.selected = true);
        progress.log("    selected specified option(s)");
        select.dispatchEvent(new Event("input", { "bubbles": true }));
        select.dispatchEvent(new Event("change", { "bubbles": true }));
        return selectedOptions.map((option) => option.value);
      }
      fill(value, node, progress) {
        const element = this.retarget(node, "follow-label");
        if (!element)
          return "error:notconnected";
        if (element.nodeName.toLowerCase() === "input") {
          const input = element;
          const type = input.type.toLowerCase();
          const kInputTypesToSetValue = /* @__PURE__ */ new Set(["color", "date", "time", "datetime", "datetime-local", "month", "range", "week"]);
          const kInputTypesToTypeInto = /* @__PURE__ */ new Set(["", "email", "number", "password", "search", "tel", "text", "url"]);
          if (!kInputTypesToTypeInto.has(type) && !kInputTypesToSetValue.has(type)) {
            progress.log(`    input of type "${type}" cannot be filled`);
            throw this.createStacklessError(`Input of type "${type}" cannot be filled`);
          }
          if (type === "number") {
            value = value.trim();
            if (isNaN(Number(value)))
              throw this.createStacklessError("Cannot type text into input[type=number]");
          }
          if (kInputTypesToSetValue.has(type)) {
            value = value.trim();
            input.focus();
            input.value = value;
            if (input.value !== value)
              throw this.createStacklessError("Malformed value");
            element.dispatchEvent(new Event("input", { "bubbles": true }));
            element.dispatchEvent(new Event("change", { "bubbles": true }));
            return "done";
          }
        } else if (element.nodeName.toLowerCase() === "textarea") {
        } else if (!element.isContentEditable) {
          throw this.createStacklessError("Element is not an <input>, <textarea> or [contenteditable] element");
        }
        this.selectText(element);
        return "needsinput";
      }
      selectText(node) {
        const element = this.retarget(node, "follow-label");
        if (!element)
          return "error:notconnected";
        if (element.nodeName.toLowerCase() === "input") {
          const input = element;
          input.select();
          input.focus();
          return "done";
        }
        if (element.nodeName.toLowerCase() === "textarea") {
          const textarea = element;
          textarea.selectionStart = 0;
          textarea.selectionEnd = textarea.value.length;
          textarea.focus();
          return "done";
        }
        const range = element.ownerDocument.createRange();
        range.selectNodeContents(element);
        const selection = element.ownerDocument.defaultView.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
        element.focus();
        return "done";
      }
      _activelyFocused(node) {
        const activeElement = node.getRootNode().activeElement;
        const isFocused = activeElement === node && !!node.ownerDocument && node.ownerDocument.hasFocus();
        return { activeElement, isFocused };
      }
      focusNode(node, resetSelectionIfNotFocused) {
        if (!node.isConnected)
          return "error:notconnected";
        if (node.nodeType !== Node.ELEMENT_NODE)
          throw this.createStacklessError("Node is not an element");
        const { activeElement, isFocused: wasFocused } = this._activelyFocused(node);
        if (node.isContentEditable && !wasFocused && activeElement && activeElement.blur) {
          activeElement.blur();
        }
        node.focus();
        node.focus();
        if (resetSelectionIfNotFocused && !wasFocused && node.nodeName.toLowerCase() === "input") {
          try {
            const input = node;
            input.setSelectionRange(0, 0);
          } catch (e) {
          }
        }
        return "done";
      }
      blurNode(node) {
        if (!node.isConnected)
          return "error:notconnected";
        if (node.nodeType !== Node.ELEMENT_NODE)
          throw this.createStacklessError("Node is not an element");
        node.blur();
        return "done";
      }
      setInputFiles(node, payloads) {
        if (node.nodeType !== Node.ELEMENT_NODE)
          return "Node is not of type HTMLElement";
        const element = node;
        if (element.nodeName !== "INPUT")
          return "Not an <input> element";
        const input = element;
        const type = (input.getAttribute("type") || "").toLowerCase();
        if (type !== "file")
          return "Not an input[type=file] element";
        const files = payloads.map((file) => {
          const bytes = Uint8Array.from(atob(file.buffer), (c) => c.charCodeAt(0));
          return new File([bytes], file.name, { type: file.mimeType });
        });
        const dt = new DataTransfer();
        for (const file of files)
          dt.items.add(file);
        input.files = dt.files;
        input.dispatchEvent(new Event("input", { "bubbles": true }));
        input.dispatchEvent(new Event("change", { "bubbles": true }));
      }
      expectHitTarget(hitPoint, targetElement) {
        const roots = [];
        let parentElement = targetElement;
        while (parentElement) {
          const root = enclosingShadowRootOrDocument(parentElement);
          if (!root)
            break;
          roots.push(root);
          if (root.nodeType === 9)
            break;
          parentElement = root.host;
        }
        let hitElement;
        for (let index = roots.length - 1; index >= 0; index--) {
          const root = roots[index];
          const elements = root.elementsFromPoint(hitPoint.x, hitPoint.y);
          const singleElement = root.elementFromPoint(hitPoint.x, hitPoint.y);
          if (singleElement && elements[0] && parentElementOrShadowHost(singleElement) === elements[0]) {
            const style = this.window.getComputedStyle(singleElement);
            if ((style == null ? void 0 : style.display) === "contents") {
              elements.unshift(singleElement);
            }
          }
          if (elements[0] && elements[0].shadowRoot === root && elements[1] === singleElement) {
            elements.shift();
          }
          const innerElement = elements[0];
          if (!innerElement)
            break;
          hitElement = innerElement;
          if (index && innerElement !== roots[index - 1].host)
            break;
        }
        const hitParents = [];
        while (hitElement && hitElement !== targetElement) {
          hitParents.push(hitElement);
          hitElement = parentElementOrShadowHost(hitElement);
        }
        if (hitElement === targetElement)
          return "done";
        const hitTargetDescription = this.previewNode(hitParents[0] || this.document.documentElement);
        let rootHitTargetDescription;
        let element = targetElement;
        while (element) {
          const index = hitParents.indexOf(element);
          if (index !== -1) {
            if (index > 1)
              rootHitTargetDescription = this.previewNode(hitParents[index - 1]);
            break;
          }
          element = parentElementOrShadowHost(element);
        }
        if (rootHitTargetDescription)
          return { hitTargetDescription: `${hitTargetDescription} from ${rootHitTargetDescription} subtree` };
        return { hitTargetDescription };
      }
      // Life of a pointer action, for example click.
      //
      // 0. Retry items 1 and 2 while action fails due to navigation or element being detached.
      //   1. Resolve selector to an element.
      //   2. Retry the following steps until the element is detached or frame navigates away.
      //     2a. Wait for the element to be stable (not moving), visible and enabled.
      //     2b. Scroll element into view. Scrolling alternates between:
      //         - Built-in protocol scrolling.
      //         - Anchoring to the top/left, bottom/right and center/center.
      //         This is to scroll elements from under sticky headers/footers.
      //     2c. Click point is calculated, either based on explicitly specified position,
      //         or some visible point of the element based on protocol content quads.
      //     2d. Click point relative to page viewport is converted relative to the target iframe
      //         for the next hit-point check.
      //     2e. (injected) Hit target at the click point must be a descendant of the target element.
      //         This prevents mis-clicking in edge cases like <iframe> overlaying the target.
      //     2f. (injected) Events specific for click (or some other action type) are intercepted on
      //         the Window with capture:true. See 2i for details.
      //         Note: this step is skipped for drag&drop (see inline comments for the reason).
      //     2g. Necessary keyboard modifiers are pressed.
      //     2h. Click event is issued (mousemove + mousedown + mouseup).
      //     2i. (injected) For each event, we check that hit target at the event point
      //         is a descendant of the target element.
      //         This guarantees no race between issuing the event and handling it in the page,
      //         for example due to layout shift.
      //         When hit target check fails, we block all future events in the page.
      //     2j. Keyboard modifiers are restored.
      //     2k. (injected) Event interceptor is removed.
      //     2l. All navigations triggered between 2g-2k are awaited to be either committed or canceled.
      //     2m. If failed, wait for increasing amount of time before the next retry.
      setupHitTargetInterceptor(node, action, hitPoint, blockAllEvents) {
        const element = this.retarget(node, "button-link");
        if (!element || !element.isConnected)
          return "error:notconnected";
        if (hitPoint) {
          const preliminaryResult = this.expectHitTarget(hitPoint, element);
          if (preliminaryResult !== "done")
            return preliminaryResult.hitTargetDescription;
        }
        if (action === "drag")
          return { stop: () => "done" };
        const events = {
          "hover": kHoverHitTargetInterceptorEvents,
          "tap": kTapHitTargetInterceptorEvents,
          "mouse": kMouseHitTargetInterceptorEvents
        }[action];
        let result;
        const listener = (event) => {
          if (!events.has(event.type))
            return;
          if (!event.isTrusted)
            return;
          const point = !!this.window.TouchEvent && event instanceof this.window.TouchEvent ? event.touches[0] : event;
          if (result === void 0 && point)
            result = this.expectHitTarget({ x: point.clientX, y: point.clientY }, element);
          if (blockAllEvents || result !== "done" && result !== void 0) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
          }
        };
        const stop = () => {
          if (this._hitTargetInterceptor === listener)
            this._hitTargetInterceptor = void 0;
          return result || "done";
        };
        this._hitTargetInterceptor = listener;
        return { stop };
      }
      dispatchEvent(node, type, eventInit) {
        let event;
        eventInit = { bubbles: true, cancelable: true, composed: true, ...eventInit };
        switch (eventType.get(type)) {
          case "mouse":
            event = new MouseEvent(type, eventInit);
            break;
          case "keyboard":
            event = new KeyboardEvent(type, eventInit);
            break;
          case "touch":
            event = new TouchEvent(type, eventInit);
            break;
          case "pointer":
            event = new PointerEvent(type, eventInit);
            break;
          case "focus":
            event = new FocusEvent(type, eventInit);
            break;
          case "drag":
            event = new DragEvent(type, eventInit);
            break;
          case "wheel":
            event = new WheelEvent(type, eventInit);
            break;
          default:
            event = new Event(type, eventInit);
            break;
        }
        node.dispatchEvent(event);
      }
      previewNode(node) {
        if (node.nodeType === Node.TEXT_NODE)
          return oneLine(`#text=${node.nodeValue || ""}`);
        if (node.nodeType !== Node.ELEMENT_NODE)
          return oneLine(`<${node.nodeName.toLowerCase()} />`);
        const element = node;
        const attrs = [];
        for (let i = 0; i < element.attributes.length; i++) {
          const { name, value } = element.attributes[i];
          if (name === "style")
            continue;
          if (!value && booleanAttributes.has(name))
            attrs.push(` ${name}`);
          else
            attrs.push(` ${name}="${value}"`);
        }
        attrs.sort((a, b) => a.length - b.length);
        let attrText = attrs.join("");
        if (attrText.length > 50)
          attrText = attrText.substring(0, 49) + "\u2026";
        if (autoClosingTags.has(element.nodeName))
          return oneLine(`<${element.nodeName.toLowerCase()}${attrText}/>`);
        const children = element.childNodes;
        let onlyText = false;
        if (children.length <= 5) {
          onlyText = true;
          for (let i = 0; i < children.length; i++)
            onlyText = onlyText && children[i].nodeType === Node.TEXT_NODE;
        }
        let text = onlyText ? element.textContent || "" : children.length ? "\u2026" : "";
        if (text.length > 50)
          text = text.substring(0, 49) + "\u2026";
        return oneLine(`<${element.nodeName.toLowerCase()}${attrText}>${text}</${element.nodeName.toLowerCase()}>`);
      }
      strictModeViolationError(selector, matches) {
        const infos = matches.slice(0, 10).map((m) => ({
          preview: this.previewNode(m),
          selector: this.generateSelector(m)
        }));
        const lines = infos.map((info, i) => `
        ${i + 1}) ${info.preview} aka ${asLocator(this._sdkLanguage, info.selector)}`);
        if (infos.length < matches.length)
          lines.push("\n    ...");
        return this.createStacklessError(`strict mode violation: ${asLocator(this._sdkLanguage, stringifySelector(selector))} resolved to ${matches.length} elements:${lines.join("")}
    `);
      }
      createStacklessError(message) {
        if (this._browserName === "firefox") {
          const error2 = new Error("Error: " + message);
          error2.stack = "";
          return error2;
        }
        const error = new Error(message);
        delete error.stack;
        return error;
      }
      maskSelectors(selectors, color) {
        if (this._highlight)
          this.hideHighlight();
        this._highlight = new Highlight(this);
        this._highlight.install();
        const elements = [];
        for (const selector of selectors)
          elements.push(this.querySelectorAll(selector, this.document.documentElement));
        this._highlight.maskElements(elements.flat(), color);
      }
      highlight(selector) {
        if (!this._highlight) {
          this._highlight = new Highlight(this);
          this._highlight.install();
        }
        this._highlight.runHighlightOnRaf(selector);
      }
      hideHighlight() {
        if (this._highlight) {
          this._highlight.uninstall();
          delete this._highlight;
        }
      }
      markTargetElements(markedElements, callId) {
        const customEvent = new CustomEvent("__playwright_target__", {
          bubbles: true,
          cancelable: true,
          detail: callId,
          composed: true
        });
        for (const element of markedElements)
          element.dispatchEvent(customEvent);
      }
      _setupGlobalListenersRemovalDetection() {
        const customEventName = "__playwright_global_listeners_check__";
        let seenEvent = false;
        const handleCustomEvent = () => seenEvent = true;
        this.window.addEventListener(customEventName, handleCustomEvent);
        new MutationObserver((entries) => {
          const newDocumentElement = entries.some((entry) => Array.from(entry.addedNodes).includes(this.document.documentElement));
          if (!newDocumentElement)
            return;
          seenEvent = false;
          this.window.dispatchEvent(new CustomEvent(customEventName));
          if (seenEvent)
            return;
          this.window.addEventListener(customEventName, handleCustomEvent);
          for (const callback of this.onGlobalListenersRemoved)
            callback();
        }).observe(this.document, { childList: true });
      }
      _setupHitTargetInterceptors() {
        const listener = (event) => {
          var _a;
          return (_a = this._hitTargetInterceptor) == null ? void 0 : _a.call(this, event);
        };
        const addHitTargetInterceptorListeners = () => {
          for (const event of kAllHitTargetInterceptorEvents)
            this.window.addEventListener(event, listener, { capture: true, passive: false });
        };
        addHitTargetInterceptorListeners();
        this.onGlobalListenersRemoved.add(addHitTargetInterceptorListeners);
      }
      async expect(element, options, elements) {
        const isArray = options.expression === "to.have.count" || options.expression.endsWith(".array");
        if (isArray)
          return this.expectArray(elements, options);
        if (!element) {
          if (!options.isNot && options.expression === "to.be.hidden")
            return { matches: true };
          if (options.isNot && options.expression === "to.be.visible")
            return { matches: false };
          if (!options.isNot && options.expression === "to.be.detached")
            return { matches: true };
          if (options.isNot && options.expression === "to.be.attached")
            return { matches: false };
          if (options.isNot && options.expression === "to.be.in.viewport")
            return { matches: false };
          return { matches: options.isNot, missingRecevied: true };
        }
        return await this.expectSingleElement(element, options);
      }
      async expectSingleElement(element, options) {
        var _a, _b;
        const expression = options.expression;
        {
          let elementState;
          if (expression === "to.have.attribute") {
            elementState = element.hasAttribute(options.expressionArg);
          } else if (expression === "to.be.checked") {
            elementState = this.elementState(element, "checked");
          } else if (expression === "to.be.unchecked") {
            elementState = this.elementState(element, "unchecked");
          } else if (expression === "to.be.disabled") {
            elementState = this.elementState(element, "disabled");
          } else if (expression === "to.be.editable") {
            elementState = this.elementState(element, "editable");
          } else if (expression === "to.be.readonly") {
            elementState = !this.elementState(element, "editable");
          } else if (expression === "to.be.empty") {
            if (element.nodeName === "INPUT" || element.nodeName === "TEXTAREA")
              elementState = !element.value;
            else
              elementState = !((_a = element.textContent) == null ? void 0 : _a.trim());
          } else if (expression === "to.be.enabled") {
            elementState = this.elementState(element, "enabled");
          } else if (expression === "to.be.focused") {
            elementState = this._activelyFocused(element).isFocused;
          } else if (expression === "to.be.hidden") {
            elementState = this.elementState(element, "hidden");
          } else if (expression === "to.be.visible") {
            elementState = this.elementState(element, "visible");
          } else if (expression === "to.be.attached") {
            elementState = true;
          } else if (expression === "to.be.detached") {
            elementState = false;
          }
          if (elementState !== void 0) {
            if (elementState === "error:notcheckbox")
              throw this.createStacklessError("Element is not a checkbox");
            if (elementState === "error:notconnected")
              throw this.createStacklessError("Element is not connected");
            return { received: elementState, matches: elementState };
          }
        }
        {
          if (expression === "to.have.property") {
            let target = element;
            const properties = options.expressionArg.split(".");
            for (let i = 0; i < properties.length - 1; i++) {
              if (typeof target !== "object" || !(properties[i] in target))
                return { received: void 0, matches: false };
              target = target[properties[i]];
            }
            const received = target[properties[properties.length - 1]];
            const matches = deepEquals(received, options.expectedValue);
            return { received, matches };
          }
        }
        {
          if (expression === "to.be.in.viewport") {
            const ratio = await this.viewportRatio(element);
            return { received: `viewport ratio ${ratio}`, matches: ratio > 0 && ratio > ((_b = options.expectedNumber) != null ? _b : 0) - 1e-9 };
          }
        }
        {
          if (expression === "to.have.values") {
            element = this.retarget(element, "follow-label");
            if (element.nodeName !== "SELECT" || !element.multiple)
              throw this.createStacklessError("Not a select element with a multiple attribute");
            const received = [...element.selectedOptions].map((o) => o.value);
            if (received.length !== options.expectedText.length)
              return { received, matches: false };
            return { received, matches: received.map((r, i) => new ExpectedTextMatcher(options.expectedText[i]).matches(r)).every(Boolean) };
          }
        }
        {
          let received;
          if (expression === "to.have.attribute.value") {
            const value = element.getAttribute(options.expressionArg);
            if (value === null)
              return { received: null, matches: false };
            received = value;
          } else if (expression === "to.have.class") {
            received = element.classList.toString();
          } else if (expression === "to.have.css") {
            received = this.window.getComputedStyle(element).getPropertyValue(options.expressionArg);
          } else if (expression === "to.have.id") {
            received = element.id;
          } else if (expression === "to.have.text") {
            received = options.useInnerText ? element.innerText : elementText(/* @__PURE__ */ new Map(), element).full;
          } else if (expression === "to.have.title") {
            received = this.document.title;
          } else if (expression === "to.have.url") {
            received = this.document.location.href;
          } else if (expression === "to.have.value") {
            element = this.retarget(element, "follow-label");
            if (element.nodeName !== "INPUT" && element.nodeName !== "TEXTAREA" && element.nodeName !== "SELECT")
              throw this.createStacklessError("Not an input element");
            received = element.value;
          }
          if (received !== void 0 && options.expectedText) {
            const matcher = new ExpectedTextMatcher(options.expectedText[0]);
            return { received, matches: matcher.matches(received) };
          }
        }
        throw this.createStacklessError("Unknown expect matcher: " + expression);
      }
      expectArray(elements, options) {
        const expression = options.expression;
        if (expression === "to.have.count") {
          const received2 = elements.length;
          const matches = received2 === options.expectedNumber;
          return { received: received2, matches };
        }
        let received;
        if (expression === "to.have.text.array" || expression === "to.contain.text.array")
          received = elements.map((e) => options.useInnerText ? e.innerText : elementText(/* @__PURE__ */ new Map(), e).full);
        else if (expression === "to.have.class.array")
          received = elements.map((e) => e.classList.toString());
        if (received && options.expectedText) {
          const lengthShouldMatch = expression !== "to.contain.text.array";
          const matchesLength = received.length === options.expectedText.length || !lengthShouldMatch;
          if (!matchesLength)
            return { received, matches: false };
          const matchers = options.expectedText.map((e) => new ExpectedTextMatcher(e));
          let mIndex = 0, rIndex = 0;
          while (mIndex < matchers.length && rIndex < received.length) {
            if (matchers[mIndex].matches(received[rIndex]))
              ++mIndex;
            ++rIndex;
          }
          return { received, matches: mIndex === matchers.length };
        }
        throw this.createStacklessError("Unknown expect matcher: " + expression);
      }
      getElementAccessibleName(element, includeHidden) {
        return getElementAccessibleName(element, !!includeHidden);
      }
      getAriaRole(element) {
        return getAriaRole(element);
      }
    };
    var autoClosingTags = /* @__PURE__ */ new Set(["AREA", "BASE", "BR", "COL", "COMMAND", "EMBED", "HR", "IMG", "INPUT", "KEYGEN", "LINK", "MENUITEM", "META", "PARAM", "SOURCE", "TRACK", "WBR"]);
    var booleanAttributes = /* @__PURE__ */ new Set(["checked", "selected", "disabled", "readonly", "multiple"]);
    function oneLine(s) {
      return s.replace(/\n/g, "\u21B5").replace(/\t/g, "\u21C6");
    }
    var eventType = /* @__PURE__ */ new Map([
      ["auxclick", "mouse"],
      ["click", "mouse"],
      ["dblclick", "mouse"],
      ["mousedown", "mouse"],
      ["mouseeenter", "mouse"],
      ["mouseleave", "mouse"],
      ["mousemove", "mouse"],
      ["mouseout", "mouse"],
      ["mouseover", "mouse"],
      ["mouseup", "mouse"],
      ["mouseleave", "mouse"],
      ["mousewheel", "mouse"],
      ["keydown", "keyboard"],
      ["keyup", "keyboard"],
      ["keypress", "keyboard"],
      ["textInput", "keyboard"],
      ["touchstart", "touch"],
      ["touchmove", "touch"],
      ["touchend", "touch"],
      ["touchcancel", "touch"],
      ["pointerover", "pointer"],
      ["pointerout", "pointer"],
      ["pointerenter", "pointer"],
      ["pointerleave", "pointer"],
      ["pointerdown", "pointer"],
      ["pointerup", "pointer"],
      ["pointermove", "pointer"],
      ["pointercancel", "pointer"],
      ["gotpointercapture", "pointer"],
      ["lostpointercapture", "pointer"],
      ["focus", "focus"],
      ["blur", "focus"],
      ["drag", "drag"],
      ["dragstart", "drag"],
      ["dragend", "drag"],
      ["dragover", "drag"],
      ["dragenter", "drag"],
      ["dragleave", "drag"],
      ["dragexit", "drag"],
      ["drop", "drag"],
      ["wheel", "wheel"]
    ]);
    var kHoverHitTargetInterceptorEvents = /* @__PURE__ */ new Set(["mousemove"]);
    var kTapHitTargetInterceptorEvents = /* @__PURE__ */ new Set(["pointerdown", "pointerup", "touchstart", "touchend", "touchcancel"]);
    var kMouseHitTargetInterceptorEvents = /* @__PURE__ */ new Set(["mousedown", "mouseup", "pointerdown", "pointerup", "click", "auxclick", "dblclick", "contextmenu"]);
    var kAllHitTargetInterceptorEvents = /* @__PURE__ */ new Set([...kHoverHitTargetInterceptorEvents, ...kTapHitTargetInterceptorEvents, ...kMouseHitTargetInterceptorEvents]);
    function cssUnquote(s) {
      s = s.substring(1, s.length - 1);
      if (!s.includes("\\"))
        return s;
      const r = [];
      let i = 0;
      while (i < s.length) {
        if (s[i] === "\\" && i + 1 < s.length)
          i++;
        r.push(s[i++]);
      }
      return r.join("");
    }
    function createTextMatcher(selector, internal) {
      if (selector[0] === "/" && selector.lastIndexOf("/") > 0) {
        const lastSlash = selector.lastIndexOf("/");
        const re = new RegExp(selector.substring(1, lastSlash), selector.substring(lastSlash + 1));
        return { matcher: (elementText2) => re.test(elementText2.full), kind: "regex" };
      }
      const unquote = internal ? JSON.parse.bind(JSON) : cssUnquote;
      let strict = false;
      if (selector.length > 1 && selector[0] === '"' && selector[selector.length - 1] === '"') {
        selector = unquote(selector);
        strict = true;
      } else if (internal && selector.length > 1 && selector[0] === '"' && selector[selector.length - 2] === '"' && selector[selector.length - 1] === "i") {
        selector = unquote(selector.substring(0, selector.length - 1));
        strict = false;
      } else if (internal && selector.length > 1 && selector[0] === '"' && selector[selector.length - 2] === '"' && selector[selector.length - 1] === "s") {
        selector = unquote(selector.substring(0, selector.length - 1));
        strict = true;
      } else if (selector.length > 1 && selector[0] === "'" && selector[selector.length - 1] === "'") {
        selector = unquote(selector);
        strict = true;
      }
      selector = normalizeWhiteSpace(selector);
      if (strict) {
        if (internal)
          return { kind: "strict", matcher: (elementText2) => normalizeWhiteSpace(elementText2.full) === selector };
        const strictTextNodeMatcher = (elementText2) => {
          if (!selector && !elementText2.immediate.length)
            return true;
          return elementText2.immediate.some((s) => normalizeWhiteSpace(s) === selector);
        };
        return { matcher: strictTextNodeMatcher, kind: "strict" };
      }
      selector = selector.toLowerCase();
      return { kind: "lax", matcher: (elementText2) => normalizeWhiteSpace(elementText2.full).toLowerCase().includes(selector) };
    }
    var ExpectedTextMatcher = class {
      constructor(expected) {
        this._normalizeWhiteSpace = expected.normalizeWhiteSpace;
        this._ignoreCase = expected.ignoreCase;
        this._string = expected.matchSubstring ? void 0 : this.normalize(expected.string);
        this._substring = expected.matchSubstring ? this.normalize(expected.string) : void 0;
        if (expected.regexSource) {
          const flags = new Set((expected.regexFlags || "").split(""));
          if (expected.ignoreCase === false)
            flags.delete("i");
          if (expected.ignoreCase === true)
            flags.add("i");
          this._regex = new RegExp(expected.regexSource, [...flags].join(""));
        }
      }
      matches(text) {
        if (!this._regex)
          text = this.normalize(text);
        if (this._string !== void 0)
          return text === this._string;
        if (this._substring !== void 0)
          return text.includes(this._substring);
        if (this._regex)
          return !!this._regex.test(text);
        return false;
      }
      normalize(s) {
        if (!s)
          return s;
        if (this._normalizeWhiteSpace)
          s = normalizeWhiteSpace(s);
        if (this._ignoreCase)
          s = s.toLocaleLowerCase();
        return s;
      }
    };
    function deepEquals(a, b) {
      if (a === b)
        return true;
      if (a && b && typeof a === "object" && typeof b === "object") {
        if (a.constructor !== b.constructor)
          return false;
        if (Array.isArray(a)) {
          if (a.length !== b.length)
            return false;
          for (let i = 0; i < a.length; ++i) {
            if (!deepEquals(a[i], b[i]))
              return false;
          }
          return true;
        }
        if (a instanceof RegExp)
          return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf)
          return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString)
          return a.toString() === b.toString();
        const keys = Object.keys(a);
        if (keys.length !== Object.keys(b).length)
          return false;
        for (let i = 0; i < keys.length; ++i) {
          if (!b.hasOwnProperty(keys[i]))
            return false;
        }
        for (const key of keys) {
          if (!deepEquals(a[key], b[key]))
            return false;
        }
        return true;
      }
      if (typeof a === "number" && typeof b === "number")
        return isNaN(a) && isNaN(b);
      return false;
    }
    
    const customEngines = [
      {
        name: "internal:role",
        engine: createRoleEngine(true),
      },
    ];
    
    },{}]},{},[1]);
    
}