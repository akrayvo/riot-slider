/*
 * RiotGalleryViewer class
 * make items in an image gallery clickable.
 * load a viewer with previous/next buttons to view each image in the gallery
 */

class RiotGalleryViewer {

    static galleryNumberAttribute = 'data-riot-gallery-viewer-instance-number';

    static jqueryUrl = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';

    isLoaded = false;
    doConsoleLog = true;
    
    elems = {};

    galleryImages = [];

    /*
     * constructor for the class
     */
    constructor(elem, innerSelector) {
        console.log('this.load(elem, innerSelector);', elem, innerSelector);
        this.load(elem, innerSelector);
    };

    /*
     * Load/initialize the gallery viewer
     * galleryElem is the jQuery ul element
     */
    load(galleryElem, innerSelector) {
        console.log('load(galleryElem)', galleryElem, innerSelector);

console.log('RiotGalleryViewer.galleryNumberAttribute',RiotGalleryViewer.galleryNumberAttribute);
        // check if it was already loaded
        if (galleryElem.attr(RiotGalleryViewer.galleryNumberAttribute)) {
            this.consoleLogInfo('gallery already added to element. skip.');
            return true;
        }

        // check if it was already loaded
        if (this.isLoaded) {
            this.consoleLogInfo('gallery already loaded. skip.');
            return true;
        }

        this.innerSelector = innerSelector;

        this.instanceKey = riotGalleryViewerInstances.length;

        galleryElem.attr(RiotGalleryViewer.galleryNumberAttribute, (this.instanceKey + 1));

        riotGalleryViewerInstances[this.instanceKey] = this;

        if (!galleryElem) {
            this.consoleLogInfo(
                'Riot Gallery Viewer not loaded. Selector falied.'
            );
            return false;
        }

        if (typeof galleryElem !== 'object') {
            this.consoleLogInfo(
                'Riot Gallery Viewer not loaded. Selector is not an object.'
            );
            return false;
        }

        if (!galleryElem instanceof jQuery) {
            this.consoleLogInfo(
                'Riot Gallery Viewer not loaded. Selector is not a jquery object.'
            );
            return false;
        }

        if (!galleryElem.length) {
            this.consoleLogInfo(
                'Riot Gallery Viewer not loaded. Element not found.'
            );
            return false;
        }

        const tagName = galleryElem.prop('tagName').toLowerCase();

        this.elems.gallery = galleryElem;

        this.elems.linkContainers = this.elems.gallery.find(innerSelector);

        if (this.elems.linkContainers.length < 1) {
            this.consoleLogInfo('Riot Gallery Viewer not loaded. No gallery items found.');
            return false;
        }

        this.bindGalleryLinks();

        this.isLoaded = true;

        return true;
    }

    /*
     * Bind the click action to gallyer images.
     * sets the image url and optional caption for each
     */
    bindGalleryLinks() {
        console.log('bindGalleryLinks()');
        console.log('this.elems.linkContainers.length', this.elems.linkContainers.length);
        for (let x = 0; x < this.elems.linkContainers.length; x++) {
            const linkContainer = $(this.elems.linkContainers[x]);
            const imageUrl = this.getImageUrlFromContainerElement(linkContainer);
            console.log('imageUrl', imageUrl);
            console.log('linkContainer', linkContainer);
            if (imageUrl !== null) {
                // clickable element. will be set to the container if no valid inner element found
                const clickElem = this.getClickElementFromContainerElement(linkContainer);
                // the image caption to display in the fallery viewer, will return empty ("") if not found
                const caption = this.getCaptionFromContainerElement(linkContainer);
                console.log(linkContainer, clickElem, imageUrl, caption);

                // add url and caption to galleryImages array
                this.galleryImages.push({ url: imageUrl, caption: caption });
                const key = this.galleryImages.length - 1;
                // bind click to 
                clickElem.on('click', { instanceKey: this.instanceKey, imageKey: key }, function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    console.log('click');
                    console.log(event.data.instanceKey);
                    console.log(event.data.imageKey);
                    console.log(riotGalleryViewerInstances[event.data.instanceKey]);
                    //riotGalleryViewerInstances[event.data.instanceKey].loadImg(event.data.imageKey);
                });
            }
        }
    }

    /*
     * Get image url and element to bind click action
     * uses several methods to find the image url
     * also returns the clickable element if found
     */
    getImageUrlFromContainerElement(linkContainer) {

        let url;
        let elem;

        // data-riot-gallery-image-url set on li container
        // <li data-riot-gallery-image-url="./image.jpg"><img src="./thumb.jpg"></li>
        url = this.getJqueryElemVal(linkContainer, 'data-riot-gallery-image-url');
        if (url) {
            return url;
        }

        // data-riot-gallery-image-url set on any element in container
        // <li><a href="./image.jpg" data-riot-gallery-image-url="./image.jpg"><img src="./thumb.jpg"></a></li>
        // <li><img src="./thumb.jpg" data-riot-gallery-image-url="./image.jpg"></li>
        url = this.getJqueryElemChildData(linkContainer, 'data-riot-gallery-image-url');
        if (url) {
            return url;
        }

        // data-image-url set on li container
        // <li data-image-url="./image.jpg"><img src="./thumb.jpg"></li>
        url = this.getJqueryElemVal(linkContainer, 'data-image-url');
        if (url) {
            return url;
        }

        // data-image-url set on any element in container
        // <li><a href="./image.jpg" data-image-url="./image.jpg"><img src="./thumb.jpg"></a></li>
        url = this.getJqueryElemChildData(linkContainer, 'data-image-url');
        if (url) {
            return url;
        }

        // href from a tag (link) with a class of "riot-gallery-image-link"
        // <li><a href="./image.jpg" class="riot-gallery-image-link"><img src="./thumb.jpg"></a></li>
        elem = linkContainer.find('a.riot-gallery-image-link');
        url = this.getJqueryElemVal(elem, 'href');
        if (url) {
            return url;
        }

        // src from img tag with "riot-gallery-image-thumb" class
        // <li><img src="./image.jpg" class="riot-gallery-image-thumb"></li>
        elem = linkContainer.find('img.riot-gallery-image-thumb');
        url = this.getJqueryElemVal(elem, 'src');
        if (url) {
            return url;
        }

        // href from a tag (link) with a class of "image-link"
        // <li><a href="./image.jpg" class="image-link"><img src="./thumb.jpg"></a></li>
        elem = linkContainer.find('a.image-link');
        url = this.getJqueryElemVal(elem, 'href');
        if (url) {
            return url;
        }

        // src from img tag with "image-thumb" class
        // <li><img src="./thumb.jpg" class="image-thumb"></li>
        elem = linkContainer.find('img.image-thumb');
        url = this.getJqueryElemVal(elem, 'src');
        if (url) {
            return url;
        }

        // href from a tag (link)
        // <li><a href="./image.jpg"><img src="./thumb.jpg"></a></li>
        elem = linkContainer.find('a');
        url = this.getJqueryElemVal(elem, 'href');
        if (url) {
            return url;
        }

        // src from img tag
        // <li><img src="./image.jpg"></li>
        elem = linkContainer.find('img');
        url = this.getJqueryElemVal(elem, 'src');
        if (url) {
            return url;
        }

        return null;
    }

    getClickElementFromContainerElement(linkContainer) {
        console.log('getClickElementFromContainerElement(linkContainer) {');
        // a tag (link) with a class of "riot-gallery-image-link"
        // <li><a href="./image.jpg" class="riot-gallery-image-link"><img src="./thumb.jpg"></a></li>
        let elem = linkContainer.find('a.riot-gallery-image-link');
        if (elem.length > 0) {
            return elem;
        }

        // img tag with "riot-gallery-image-thumb" class
        // <li><img src="./thumb.jpg" class="riot-gallery-image-thumb"></li>
        elem = linkContainer.find('img.riot-gallery-image-thumb');
        if (elem.length > 0) {
            return elem;
        }

        // a tag (link) with a class of "image-link"
        // <li><a href="./image.jpg" class="image-link"><img src="./thumb.jpg"></a></li>
        elem = linkContainer.find('a.image-link');
        if (elem.length > 0) {
            return elem;
        }

        // img tag with "image-thumb" class
        // <li><img src="./thumb.jpg" class="image-thumb"></li>
        elem = linkContainer.find('img.image-thumb');
        if (elem.length > 0) {
            return elem;
        }

        // data-riot-gallery-image-url set on an img
        // <li><img src="./thumb.jpg" data-riot-gallery-image-url="./image.jpg"></li>
        elem = linkContainer.find('[data-riot-gallery-image-url]');
        if (elem.length > 0) {
            return url;
        }

        // data-image-url set on an img
        // <li><img src="./thumb.jpg" data-image-url="./image.jpg"></li>
        elem = linkContainer.find('[data-image-url]');
        if (elem.length > 0) {
            return url;
        }

        // a tag (link)
        // <li><a href="./image.jpg"><img src="./thumb.jpg"></a></li>
        elem = linkContainer.find('a');
        if (elem.length > 0) {
            return elem;
        }

        // src from img tag
        // <li><img src="./image.jpg"></li>
        elem = linkContainer.find('img');
        if (elem.length > 0) {
            return elem;
        }

        // no link or image found
        return linkContainer;
    }

    getCaptionFromContainerElement(linkContainer) {

        // data-riot-gallery-image-caption on the container
        // <li data-riot-gallery-image-caption="My Pic"><img src="./image.jpg"></li>
        let caption = this.getJqueryElemVal(linkContainer, 'data-riot-gallery-image-caption');
        if (caption) {
            return caption;
        }

        // data-riot-gallery-image-caption on any inner element
        // <li><img src="./image.jpg" data-riot-gallery-image-caption="My Pic"></li>
        caption = this.getJqueryElemChildData(linkContainer, 'data-riot-gallery-image-caption');
        if (caption) {
            return caption;
        }

        // data-image-caption on the container
        // <li data-image-caption="My Pic"><img src="./image.jpg"></li>
        caption = this.getJqueryElemVal(linkContainer, 'data-image-caption');
        if (caption) {
            return caption;
        }

        // data-image-caption on any inner element
        // <li><img src="./image.jpg" data-image-caption="My Pic"></li>
        caption = this.getJqueryElemChildData(linkContainer, 'data-image-caption');
        if (caption) {
            return caption;
        }

        // riot-gallery-image-caption class on any text container
        // <li><img src="./image.jpg"><div class="riot-gallery-image-caption">My Pic</div></li>
        caption = this.getJqueryElemVal(linkContainer.find('.riot-gallery-image-caption'), 'text');
        if (caption) {
            return caption;
        }

        // image-caption class on any text container
        // <li><img src="./image.jpg"><div class="image-caption">My Pic</div></li>
        caption = this.getJqueryElemVal(linkContainer.find('.image-caption'), 'text');
        if (caption) {
            return caption;
        }

        // image-caption class on any text container
        // <li><figure><img src="./image.jpg"><figcaption>My Pic</figcaption></figure></li>
        caption = this.getJqueryElemVal(linkContainer.find('figcaption'), 'text');
        if (caption) {
            return caption;
        }

        // alt or title of an img with img.riot-gallery-image-thumb class
        // <li><img src="./image.jpg" class="riot-gallery-image-thumb" alt="My Pic"></li>
        let imgElems = linkContainer.find('img.riot-gallery-image-thumb');
        for (const x = 0; x < imgElems.length; x++) {
            const imgElem = $(imgElems[x]);
            caption = this.getJqueryElemVal(imgElem, 'alt');
            if (caption) {
                return caption;
            }
            caption = this.getJqueryElemVal(imgElem, 'title');
            if (caption) {
                return caption;
            }
        }

        // alt or title of an img with img.image-thumb class
        // <li><img src="./image.jpg" class="image-thumb" alt="My Pic"></li>
        imgElems = linkContainer.find('img.image-thumb');
        for (const x = 0; x < imgElems.length; x++) {
            const imgElem = $(imgElems[x]);
            caption = this.getJqueryElemVal(imgElem, 'alt');
            if (caption) {
                return caption;
            }
            caption = this.getJqueryElemVal(imgElem, 'title');
            if (caption) {
                return caption;
            }
        }

        // alt or title of an img
        // <li><img src="./image.jpg" alt="My Pic"></li>
        imgElems = linkContainer.find('img');
        for (let x = 0; x < imgElems.length; x++) {
            const imgElem = $(imgElems[x]);
            caption = this.getJqueryElemVal(imgElem, 'alt');
            if (caption) {
                return caption;
            }
            caption = this.getJqueryElemVal(imgElem, 'title');
            if (caption) {
                return caption;
            }
        }

        // nothing found. return empty string
        return '';
    }

    /*
     * automatically create gallery instances on elements
     */
    static autoInitialzieInstances() {
        console.log('static autoInitialzieInstances() {');
        $(document).ready(function () {
            $('.riot-gallery-viewer').each(function () {
                const galleryElem = $(this);
                if (!galleryElem.attr(RiotGalleryViewer.galleryNumberAttribute)) {
                    let selector = '.riot-gallery-viewer-item';
                    let elems = galleryElem.find(selector);
                    console.log('a', elems);
                    if (elems.length < 1) {
                        const tagName = galleryElem.prop('tagName').toLowerCase();
                        if (tagName == 'ul' || tagName == 'ol') {
                            selector = 'li';
                        } else if (tagName == 'table') {
                            selector = 'tr';
                        } else if (tagName == 'dl') {
                            // works on dt (Description Term), not dd (Description Details)
                            selector = 'dt';
                        }
                        elems = galleryElem.find(selector);
                    }
                    if (elems.length > 0) {
                        new RiotGalleryViewer(galleryElem, selector);
                    }
                }
            });
            console.log(riotGalleryViewerInstances);
        })
    }

    /*
     * load jquery (required) if not available, then automatically initialize riot gallery intance(s) if not manually initialized
     */
    static autoInitialzie() {
        console.log('static autoInitialzie() {');
        if (!window.jQuery) {
            let head = document.getElementsByTagName('head')[0];
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = RiotGalleryViewer.jqueryUrl;
            head.appendChild(script);
            let waitForJQuery = setInterval(function () {
                if (window.jQuery) {
                    clearInterval(waitForJQuery);
                    RiotGalleryViewer.autoInitialzieInstances();
                }
            }, 100);
        } else {
            RiotGalleryViewer.autoInitialzieInstances();
        }
    }


    /*****************************************************************************
     ******************************************************************************
     * Helper Functions - START */

    /*
     * return the text or attribute from a jquery element
     */
    getJqueryElemVal(elems, attr) {

        const returnOnError = null;

        if (!elems) {
            return returnOnError;
        }

        if (elems.length < 1) {
            return returnOnError;
        }

        let val;

        for (let x = 0; x < elems.length; x++) {
            const elem = $(elems[x]);
            if (attr == 'text') {
                val = elem.text();
                if (val) {
                    val = val.trim();
                    if (val.length > 0) {
                        return val;
                    }
                }
            } else {
                val = elem.attr(attr);
                if (val) {
                    val = val.trim();
                    if (val.length > 0) {
                        return val;
                    }
                }
            }
        }

        return returnOnError;
    }

    /*
     * return the data value if it exits in any child element
     */
    getJqueryElemChildData(parentElem, dataName) {
        const elem = parentElem.find('[' + dataName + ']');
        if (!elem) {
            return returnOnError;
        }
        if (elem.length) {
            return null;
        }
        return this.getJqueryElemVal(elem, dataName);
    }

    /*
     * write information to the console if doConsoleLog is true
     */
    consoleLogInfo(info) {
        if (this.options.doConsoleLog) {
            console.log(info);
        }
    }

    /* Helper Functions - END
    *****************************************************************************
    *****************************************************************************/
}


/*
 * on page load, load jquery (required) if not already loaded. then automatically initialize riot gallery intance(s) if not manually initialized
 */
// global variable to store an array of galleries
let riotGalleryViewerInstances = [];
window.onload = function () {
    RiotGalleryViewer.autoInitialzie();
}