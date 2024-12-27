/*
 * RiotGalleryViewer class
 * make items in an image gallery clickable.
 * load a viewer with previous/next buttons to view each image in the gallery
 */

class RiotGalleryViewer {

    /*****************************************************************************
     ******************************************************************************
     * Properties - START */

    // added to initialized riot gallyery instances.
    // ex: <ul class="riot-gallery-viewer" data-riot-gallery-viewer-instance-number="1">
    static galleryNumberAttribute = 'data-riot-gallery-viewer-instance-number';

    // download jQuery from this location if not already available
    static jqueryUrl = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';

    // is this instance of RiotGalleryViewer initialized (items clickable)
    isInitialized = false;

    // 
    waitForJQuery  = null;

    // is the RiotGalleryViewer HTML (main image, background, previous/next butttons, close button, etc) loaded
    isHtmlLoaded = false;

    // is the RiotGalleryViewer currently open
    isOpen = false;

    // width and height of browser window
    // set on html initialization and updated on window resize
    windowWidth = 0;
    windowHeight = 0;

    // found elements, saved as jQuery objects
    elems = {
        // the main container that holds all gallery items
        gallery: null,
        // items in the gallery
        // each contains a full size image, clickable element, and optional caption
        galleryItems: null,
    };

    // array of images and optional captions
    galleryImages = [];

    options = {
        // write information to the console log. needed for troubeshooting/testing/development only
        doConsoleLog: false
    };

    /* Properties - END
    *****************************************************************************
    *****************************************************************************/


    /*****************************************************************************
     ******************************************************************************
     * Initialization - START */

    /*
    * load jquery (required) if not available, then automatically initialize riot gallery intance(s)
    */
    static autoInitialzie() {
        RiotGalleryViewer.loadJquery(RiotGalleryViewer.autoInitialzieInstances);
    }

    /*
    * load jquery (required) if not available, then automatically initialize riot gallery intance(s)
    */
    static loadJquery(actionOnComplete) {
        console.log('static autoInitialzie() {');
        if (!window.jQuery) {
            console.log('if (!window.jQuery) {');
            let head = document.getElementsByTagName('head')[0];
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = RiotGalleryViewer.jqueryUrl;
            head.appendChild(script);
            console.log('RiotGalleryViewer.waitForJQuery');
            RiotGalleryViewer.waitForJQuery = setInterval(function (action) {
                if (window.jQuery) {
                    clearInterval(RiotGalleryViewer.waitForJQuery);
                    console.log('clearInterval', action);
                    action();
                }
            }, 100, actionOnComplete);
        } else {
            //RiotGalleryViewer.autoInitialzieInstances();
            console.log('ELSE if (!window.jQuery) {');
            actionOnComplete();
        }
    }

    /*
     * automatically create gallery instances on ui, ol, table, and ld tags with the "riot-gallery-viewer" class
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
                        selector = '';
                        if (tagName == 'ul' || tagName == 'ol') {
                            selector = 'li';
                        } else if (tagName == 'table') {
                            selector = 'tr';
                        } else if (tagName == 'dl') {
                            // first check for dt (Description Term)
                            selector = 'dt';
                        }

                        if (selector) {
                            elems = galleryElem.find(selector);

                            if (tagName == 'dl') {
                                if (elems.length < 1) {
                                    // no dt (definition term) found in dl (definition list). try dd (definion details)
                                    // should not happen in correctly formatted html
                                    selector = 'dd';
                                    elems = galleryElem.find(selector);
                                } else {
                                    let checkImageUrl = RiotGalleryViewer.getImageUrlFromContainerElement(elems);
                                    if (!checkImageUrl) {
                                        // no image url found in the dt (definition term) of dl (definition list). try dd (definion details)
                                        selector = 'dd';
                                        elems = galleryElem.find(selector);
                                    }
                                }
                            }
                        }
                    }
                    if (elems.length > 0) {
                        new RiotGalleryViewer(galleryElem, selector);
                    }
                }
            });
            console.log(riotGalleryViewerInstances);
        })
    }

    static getElementSelector

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

        console.log('RiotGalleryViewer.galleryNumberAttribute', RiotGalleryViewer.galleryNumberAttribute);
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

        this.elems.galleryItems = this.elems.gallery.find(innerSelector);

        if (this.elems.galleryItems.length < 1) {
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
        console.log('this.elems.galleryItems.length', this.elems.galleryItems.length);
        for (let x = 0; x < this.elems.galleryItems.length; x++) {
            const linkContainer = $(this.elems.galleryItems[x]);
            const imageUrl = RiotGalleryViewer.getImageUrlFromContainerElement(linkContainer);
            console.log('imageUrl', imageUrl);
            console.log('linkContainer', linkContainer);
            if (imageUrl !== null) {
                // clickable element. will be set to the container if no valid inner element found
                const clickElem = RiotGalleryViewer.getClickElementFromContainerElement(linkContainer);
                // the image caption to display in the fallery viewer, will return empty ("") if not found
                const caption = RiotGalleryViewer.getCaptionFromContainerElement(linkContainer);
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
                    //console.log(riotGalleryViewerInstances[event.data.instanceKey]);
                    riotGalleryViewerInstances[event.data.instanceKey].loadImg(event.data.imageKey);
                });
            }
        }
    }

    /*
     * Get image url and element to bind click action
     * uses several methods to find the image url
     * also returns the clickable element if found
     */
    static getImageUrlFromContainerElement(linkContainer) {

        let url;
        let elem;

        // data-riot-gallery-image-url set on li container
        // <li data-riot-gallery-image-url="./image.jpg"><img src="./thumb.jpg"></li>
        url = RiotGalleryViewer.getJqueryElemVal(linkContainer, 'data-riot-gallery-image-url');
        if (url) {
            return url;
        }

        // data-riot-gallery-image-url set on any element in container
        // <li><a href="./image.jpg" data-riot-gallery-image-url="./image.jpg"><img src="./thumb.jpg"></a></li>
        // <li><img src="./thumb.jpg" data-riot-gallery-image-url="./image.jpg"></li>
        url = RiotGalleryViewer.getJqueryElemChildData(linkContainer, 'data-riot-gallery-image-url');
        if (url) {
            return url;
        }

        // data-image-url set on li container
        // <li data-image-url="./image.jpg"><img src="./thumb.jpg"></li>
        url = RiotGalleryViewer.getJqueryElemVal(linkContainer, 'data-image-url');
        if (url) {
            return url;
        }

        // data-image-url set on any element in container
        // <li><a href="./image.jpg" data-image-url="./image.jpg"><img src="./thumb.jpg"></a></li>
        url = RiotGalleryViewer.getJqueryElemChildData(linkContainer, 'data-image-url');
        if (url) {
            return url;
        }

        // href from a tag (link) with a class of "riot-gallery-image-link"
        // <li><a href="./image.jpg" class="riot-gallery-image-link"><img src="./thumb.jpg"></a></li>
        elem = linkContainer.find('a.riot-gallery-image-link');
        url = RiotGalleryViewer.getJqueryElemVal(elem, 'href');
        if (url) {
            return url;
        }

        // src from img tag with "riot-gallery-image-thumb" class
        // <li><img src="./image.jpg" class="riot-gallery-image-thumb"></li>
        elem = linkContainer.find('img.riot-gallery-image-thumb');
        url = RiotGalleryViewer.getJqueryElemVal(elem, 'src');
        if (url) {
            return url;
        }

        // href from a tag (link) with a class of "image-link"
        // <li><a href="./image.jpg" class="image-link"><img src="./thumb.jpg"></a></li>
        elem = linkContainer.find('a.image-link');
        url = RiotGalleryViewer.getJqueryElemVal(elem, 'href');
        if (url) {
            return url;
        }

        // src from img tag with "image-thumb" class
        // <li><img src="./thumb.jpg" class="image-thumb"></li>
        elem = linkContainer.find('img.image-thumb');
        url = RiotGalleryViewer.getJqueryElemVal(elem, 'src');
        if (url) {
            return url;
        }

        // href from a tag (link)
        // <li><a href="./image.jpg"><img src="./thumb.jpg"></a></li>
        elem = linkContainer.find('a');
        url = RiotGalleryViewer.getJqueryElemVal(elem, 'href');
        if (url) {
            return url;
        }

        // src from img tag
        // <li><img src="./image.jpg"></li>
        elem = linkContainer.find('img');
        url = RiotGalleryViewer.getJqueryElemVal(elem, 'src');
        if (url) {
            return url;
        }

        return null;
    }

    static getClickElementFromContainerElement(linkContainer) {
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

    static getCaptionFromContainerElement(linkContainer) {

        // data-riot-gallery-image-caption on the container
        // <li data-riot-gallery-image-caption="My Pic"><img src="./image.jpg"></li>
        let caption = RiotGalleryViewer.getJqueryElemVal(linkContainer, 'data-riot-gallery-image-caption');
        if (caption) {
            return caption;
        }

        // data-riot-gallery-image-caption on any inner element
        // <li><img src="./image.jpg" data-riot-gallery-image-caption="My Pic"></li>
        caption = RiotGalleryViewer.getJqueryElemChildData(linkContainer, 'data-riot-gallery-image-caption');
        if (caption) {
            return caption;
        }

        // data-image-caption on the container
        // <li data-image-caption="My Pic"><img src="./image.jpg"></li>
        caption = RiotGalleryViewer.getJqueryElemVal(linkContainer, 'data-image-caption');
        if (caption) {
            return caption;
        }

        // data-image-caption on any inner element
        // <li><img src="./image.jpg" data-image-caption="My Pic"></li>
        caption = RiotGalleryViewer.getJqueryElemChildData(linkContainer, 'data-image-caption');
        if (caption) {
            return caption;
        }

        // riot-gallery-image-caption class on any text container
        // <li><img src="./image.jpg"><div class="riot-gallery-image-caption">My Pic</div></li>
        caption = RiotGalleryViewer.getJqueryElemVal(linkContainer.find('.riot-gallery-image-caption'), 'text');
        if (caption) {
            return caption;
        }

        // image-caption class on any text container
        // <li><img src="./image.jpg"><div class="image-caption">My Pic</div></li>
        caption = RiotGalleryViewer.getJqueryElemVal(linkContainer.find('.image-caption'), 'text');
        if (caption) {
            return caption;
        }

        // image-caption class on any text container
        // <li><figure><img src="./image.jpg"><figcaption>My Pic</figcaption></figure></li>
        caption = RiotGalleryViewer.getJqueryElemVal(linkContainer.find('figcaption'), 'text');
        if (caption) {
            return caption;
        }

        // alt or title of an img with img.riot-gallery-image-thumb class
        // <li><img src="./image.jpg" class="riot-gallery-image-thumb" alt="My Pic"></li>
        let imgElems = linkContainer.find('img.riot-gallery-image-thumb');
        for (const x = 0; x < imgElems.length; x++) {
            const imgElem = $(imgElems[x]);
            caption = RiotGalleryViewer.getJqueryElemVal(imgElem, 'alt');
            if (caption) {
                return caption;
            }
            caption = RiotGalleryViewer.getJqueryElemVal(imgElem, 'title');
            if (caption) {
                return caption;
            }
        }

        // alt or title of an img with img.image-thumb class
        // <li><img src="./image.jpg" class="image-thumb" alt="My Pic"></li>
        imgElems = linkContainer.find('img.image-thumb');
        for (const x = 0; x < imgElems.length; x++) {
            const imgElem = $(imgElems[x]);
            caption = RiotGalleryViewer.getJqueryElemVal(imgElem, 'alt');
            if (caption) {
                return caption;
            }
            caption = RiotGalleryViewer.getJqueryElemVal(imgElem, 'title');
            if (caption) {
                return caption;
            }
        }

        // alt or title of an img
        // <li><img src="./image.jpg" alt="My Pic"></li>
        imgElems = linkContainer.find('img');
        for (let x = 0; x < imgElems.length; x++) {
            const imgElem = $(imgElems[x]);
            caption = RiotGalleryViewer.getJqueryElemVal(imgElem, 'alt');
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
     * load html (image container, previous/next buttons, caption ,etc)
     * set element selector values (this.elems)
     */
    loadHtml() {
        console.log('loadHtml() {');

        // skip if already loaded
        if (this.isHtmlLoaded) {
            return;
        }

        // body and window selectors added.
        // body needed for appending html and setting classes
        this.elems.body = $('body');
        // window needed for handling resizing
        this.elems.window = $(window);

        // make sure the gallery html isn't already loaded 
        // will not happen if mulitple galleries are on the same page and one has already been loaded
        const checkElem = $('#riot-gallery-viewer-bg');
        console.log(checkElem.length);
        if (checkElem.length < 1) {
            let html;

            // background
            html = '<div id="riot-gallery-viewer-bg"></div>';
            this.elems.body.append(html);

            // previous button
            html = '<div id="riot-gallery-viewer-prev-con"><a href="#">&laquo;</a></div>';
            this.elems.body.append(html);

            // next button
            html = '<div id="riot-gallery-viewer-next-con"><a href="#">&raquo;</a></div>';
            this.elems.body.append(html);

            html = '<div id="riot-gallery-viewer-image-con">' +
                '<img id="riot-gallery-viewer-image">' +
                '<div id="riot-gallery-viewer-loading"></div>' +
                '<div id="riot-gallery-viewer-transition-both-con">' +
                '<div id="riot-gallery-viewer-transition-both-left"></div>' +
                '<div id="riot-gallery-viewer-transition-both-right"></div>' +
                '</div>' +
                '</div>';
            this.elems.body.append(html);

            html = '<div id="riot-gallery-viewer-close-con"><a href="#">X</a></div>';
            this.elems.body.append(html);

            html = '<div id="riot-gallery-viewer-caption-con"><div id="riot-gallery-viewer-caption"></div</div>';
            this.elems.body.append(html);

            console.log('load html complete');
        }

        this.elems.bg = $('#riot-gallery-viewer-bg');
        this.elems.prevCon = $('#riot-gallery-viewer-prev-con');
        this.elems.nextCon = $('#riot-gallery-viewer-next-con');

        this.elems.imageCon = $('#riot-gallery-viewer-image-con');
        this.elems.image = $('#riot-gallery-viewer-image');
        this.elems.loading = $('#riot-gallery-viewer-loading');

        this.elems.closeCon = $('#riot-gallery-viewer-close-con');

        this.elems.captionCon = $('#riot-gallery-viewer-caption-con');
        this.elems.caption = $('#riot-gallery-viewer-caption');

        this.elems.transitionBothCon = $('#riot-gallery-viewer-transition-both-con');
        this.elems.transitionBothLeft = $('#riot-gallery-viewer-transition-both-left');
        this.elems.transitionBothRight = $('#riot-gallery-viewer-transition-both-right');

        console.log('jq elements done');

        this.isHtmlLoaded = true;
    }

    /*
     * bind events in the gallery viewr
     * previous/next buttons, close on background or X button click, next on image click
     */
    bindViewer() {
        console.log('bindViewer');

        const instanceData = { instanceKey: this.instanceKey };

        this.elems.prevCon.on('click', instanceData, function (event) {
            console.log('prevCon click');
            event.preventDefault();
            event.stopPropagation();
            riotGalleryInstances[event.data.instanceKey].prevClicked();
        });
        this.elems.nextCon.on('click', instanceData, function (event) {
            console.log('nextCon click');
            event.preventDefault();
            event.stopPropagation();
            riotGalleryInstances[event.data.instanceKey].nextClicked();
        });
        this.elems.closeCon.find('a').on('click', instanceData, function (event) {
            console.log('closeCon click');
            event.preventDefault();
            event.stopPropagation();
            riotGalleryInstances[event.data.instanceKey].closeViewer();
        });
        this.elems.bg.on('click', instanceData, function (event) {
            console.log('bg click');
            event.preventDefault();
            event.stopPropagation();
            riotGalleryInstances[event.data.instanceKey].closeViewer();
        });
        console.log('bind resize here');
        this.elems.window.resize(instanceData, function (event) {
            riotGalleryInstances[event.data.instanceKey].windowResized();
        });

        this.elems.image.on('click', instanceData, function (event) {
            console.log('image image');
            event.preventDefault();
            event.stopPropagation();
            riotGalleryInstances[event.data.instanceKey].nextClicked();
        });

        const jsImgElem = this.elems.image[0];
        jsImgElem.params = instanceData;
        jsImgElem.addEventListener("jsImgElem", function (event) {
            console.log('jsImgElem jsImgElem');
            event.preventDefault();
            riotGalleryInstances[event.data.instanceKey].slideSwipeStartEvent(event);
        });
        jsImgElem.addEventListener("touchend", function (event) {
            console.log('jsImgElem touchend');
            event.preventDefault();
            riotGalleryInstances[event.data.instanceKey].slideSwipeEndEvent(event);
        });
    }

    /* Initialization - END
    *****************************************************************************
    *****************************************************************************/


    /*****************************************************************************
     ******************************************************************************
     * Image Viewer Actions - START */

    /*
     * new image displayed in the viewer
     * happens on gallery image and previous/next button click
     */
    loadImg(newKey) {
        console.log('loadImg(newKey) {', newKey);

        // make sure the image key is valid.

        // previous image from the first, go to the last
        if (newKey < 0) {
            newKey = this.galleryImages.length - 1;
        }
        // next image from the last, go to the first
        if (newKey >= this.galleryImages.length) {
            newKey = 0;
        }

        if (!this.isHtmlLoaded) {
            this.loadHtml();
            this.bindViewer();
        }

        if (!this.isOpen) {
            // must be done before calculating the image size (loadAvailableImage)
            this.setWindowSize();
        }

        var img = new Image();
        img.src = this.galleryImages[newKey].url;

        this.openViewer();

        if (img.complete) {
            console.log('if (img.complete) {');
            this.loadAvailableImage(img, newKey);
            //this.setLoadedImage(this, newKey);
        } else {

            console.log('else if (img.complete) {');
            img.newKey = newKey;
            img.instanceKey = this.instanceKey;
            //this.startUnavailableImage(newKey);
            img.onload = function (e) {
                console.log('img.onload this.instanceKey', this.instanceKey);
                //riotGalleryInstances[this.instanceKey].completeUnavailableImage(this);
                riotGalleryViewerInstances[this.instanceKey].loadAvailableImage(this);
            }
        }
    }

    /*
     * open the viewer if it is not already open
     * load viewer html if not loaded
     * add riot-gallery-viewer-open class to html body
     * set isOpen to true so we do not load twice
     */
    openViewer() {
        console.log('openViewer() {');
        if (this.isOpen) {
            console.log('already open');
            return;
        }
        this.elems.body.addClass('riot-gallery-viewer-open');
        this.isOpen = true;
    }

    /*
     * set the dimensions of the browser window
     * run on page load and window resize.
     */
    setWindowSize() {
        console.log('setWindowSize()');
        this.windowWidth = this.elems.window.width();
        this.windowHeight = this.elems.window.height();
        this.consoleLogInfo('set window size, width = ' + this.windowWidth + ' | height=' + this.windowHeight);
    }

    /* Image Viewer Actions - END
    *****************************************************************************
    *****************************************************************************/

    /*****************************************************************************
     ******************************************************************************
     * Image Display - START */

    /*
     * load image that has already been downloaded (no waiting/loading)
     */
    loadAvailableImage(image, imageKey) {
        console.log('loadAvailableImage(image, imageKey)', image, imageKey);


        if (!this.curImgKey) {
            console.log('a this.curImgKey=', this.curImgKey);
            this.curImgKey = imageKey;
            console.log('b this.curImgKey=', this.curImgKey);
            this.curImgWidth = image.width;
            this.curImgHeight = image.height;
            this.elems.image.attr('src', image.src);
            console.log("this.elems.image.attr('url', image.url);", this.elems.image, image.src);
            this.positionMainImage();
            //this.displayCaption();
            this.elems.body.removeClass('riot-gallery-viewer-is-transitioning-both');
            return;
            // no current image, skip transition
            // set url
            // set dimensions
            // show caption
            // set curimgkey, curimgwidth, curimgheight
        }

        const leftSrc = this.galleryImages[this.curImgKey].url;
        const rightSrc = this.galleryImages[imageKey].url;

        console.log('aaaaaaaaaaaa images', this.curImgKey, imageKey, leftSrc, rightSrc);


        this.elems.transitionBothLeft.css("background-image", "url(" + leftSrc + ")");
        console.log(this.elems.transitionBothLeft);
        this.elems.transitionBothRight.css("background-image", "url(" + rightSrc + ")");

        this.elems.transitionBothLeft.css({ width: this.viewerWidth + 'px', height: this.viewerHeight + 'px' });

        this.curImgKey = imageKey;

        //this.elems.body.addClass('riot-gallery-viewer-is-transitioning-both');

        console.log('b this.curImgKey=', this.curImgKey);
        this.curImgWidth = image.width;
        this.curImgHeight = image.height;
        this.positionMainImage(true);
        this.elems.transitionBothRight.css({ width: this.viewerWidth, height: this.viewerHeight });
        //return;
        this.elems.image.attr('src', image.src);
        console.log("this.elems.image.attr('url', image.url);", this.elems.image, image.src);
        //this.positionLoaderImage();
        this.displayCaption();

        //this.elems.body.removeClass('riot-gallery-viewer-is-transitioning-both');
    }

    /*
     * position the main gallery view image and the close button in the top right corner
     */
    positionMainImage(isTransition) {

        console.log('positionImage() {)');
        //  console.log('this.viewerWidth a', this.viewerWidth);

        let pos;
        if (this.curImgWidth && this.curImgHeight) {
            pos = this.getPositionForViewer(this.curImgWidth, this.curImgHeight);
            console.log('this.viewerWidth b', this.viewerWidth);
            //let spinnerSize = this.curImgWidth;
            //if (this.curImgHeight < spinnerSize) {

            //}
            //pos = this.getPositionForViewer(this.loadingSpinnerSize, this.loadingSpinnerSize, true);
        } else {
            pos = this.getPositionForViewer(this.defaultViewerWidth, this.defaultViewerHeight);
            console.log('this.viewerWidth b', this.viewerWidth);
        }

        let cssSettings = {
            width: pos.width + 'px',
            height: pos.height + 'px',
            left: pos.left + 'px',
            top: pos.top + 'px'
        };

        //console.log(pos);
        if (isTransition) {
            this.elems.imageCon.animate(cssSettings, 1001);
        } else {
            this.elems.imageCon.css(cssSettings);
        }

        this.viewerWidth = pos.width;
        this.viewerHeight = pos.height;

        console.log(pos);
        let newLeft = pos.left - 30;
        let newTop = [pos.top] - 30;
        if (newTop < 10) {
            newTop = 10;
        }
        if (newLeft < 30) {
            newLeft = 30;
        }

        cssSettings = { right: newLeft + 'px', top: newTop + 'px' };
        if (isTransition) {
            this.elems.closeCon.animate(cssSettings, 1001);
        } else {
            this.elems.closeCon.css(cssSettings);
        }


    }

    /*
     * get the values for width, height, left, and top for the main gallery image
     */
    getPositionForViewer(imgWidth, imgHeight) {
        console.log('getPositionForViewer(imgWidth, imgHeight)', imgWidth, imgHeight);
        let viewerWidth = imgWidth;
        let viewerHeight = imgHeight;

        const maxWidth = this.windowWidth - 40;
        const maxHeight = this.windowHeight - 24;

        console.log('this.windowWidth this.windowHeight', this.windowWidth, this.windowHeight);

        if (viewerWidth > maxWidth) {
            viewerWidth = maxWidth;
            viewerHeight = imgHeight / imgWidth * viewerWidth;
        }

        if (viewerHeight > maxHeight) {
            viewerHeight = maxHeight;
            viewerWidth = imgWidth / imgHeight * viewerHeight;
        }

        console.log('this.viewerWidth set', this.viewerWidth);
        const newLeft = (this.windowWidth - viewerWidth) / 2;
        const newTop = (this.windowHeight - viewerHeight) / 2;

        return {
            width: viewerWidth,
            height: viewerHeight,
            left: newLeft,
            top: newTop
        };
    }

    /*
     * open the viewer if it is not already open
     * load viewer html if not loaded
     * add riot-gallery-viewer-open class to html body
     * set isOpen to true so we do not load twice
     */
    openViewer() {
        console.log('openViewer() {');
        if (this.isOpen) {
            console.log('already open');
            return;
        }
        this.elems.body.addClass('riot-gallery-viewer-open');
        this.isOpen = true;
    }    

    /* Image Display - END
    *****************************************************************************
    *****************************************************************************/    

    /*****************************************************************************
     ******************************************************************************
     * Helper Functions - START */

    /*
     * write information to the console if doConsoleLog is true
     */
    consoleLogInfo(info) {
        if (this.options.doConsoleLog) {
            console.log(info);
        }
    }

    /*
     * return the text or attribute from a jquery element
     */
    static getJqueryElemVal(elems, attr) {

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
    static getJqueryElemChildData(parentElem, dataName) {
        const returnOnError = null;

        const elem = parentElem.find('[' + dataName + ']');
        if (!elem) {
            return returnOnError;
        }
        if (elem.length) {
            return returnOnError;
        }
        return RiotGalleryViewer.getJqueryElemVal(elem, dataName);
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