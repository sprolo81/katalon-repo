var elementForInjectingScript = document.createElement("script");
elementForInjectingScript.src = browser.runtime.getURL("smartLocator/smart-locator.js");
(document.head || document.documentElement).appendChild(elementForInjectingScript);


var elementForInjectingBundleScript = document.createElement("script");
elementForInjectingBundleScript.src = browser.runtime.getURL("smartLocator/bundle.js");
(document.head || document.documentElement).appendChild(elementForInjectingBundleScript);