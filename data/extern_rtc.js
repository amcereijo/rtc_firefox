// functionality of the plugin
var ExternFunction = (function() {

	var l10n, 
		liTitle,
		liText,
		titleText,
		retweetText,
		//rtc li element
	    rtcLiElement,
		//to save the new tweet original title
		previusTitle = '',
		tweetButton,
		tweetDialog,
		tweetDialogContent,		
		elementToObserv,
		allElementLoaded = false,
		closeModalNewTweetElement,


	//action when rtc li element is clicked
	clickRtc = function (e) {
		//avoid to execute "a" default action
		e.preventDefault();
		var target = e.target,
			//tweet element
        	parent = $(target).closest('.content'),
        	//tweet text
			tweetText = parent.find('.js-tweet-text').text(),
			//twitter user
			twitterUser = retweetText + parent.find('span.username').find('b').text()+ ' ';
			
		//click to open new tweet modal
		tweetButton.click();
		
		//save previus title
		previusTitle = tweetDialogTitle.text();
			
		//change modal title,add class to title elemento to find it later and remove orginal title class and center new title
		tweetDialogTitle.text(titleText)
				.addClass('rtcTitle')
				.removeClass('modal-title')
				.css('text-align','center');
		//add retweet text
		tweetDialogContent.text(twitterUser+tweetText);

	},

	//function to set original title, class and empty content
	clickNewTweet = function () {
		if(previusTitle !== ''){			
			//remove center title, add original title class, remove temporal "rtc" title class and set original title
			tweetDialogTitle.css('text-align','')
				.addClass('modal-title')
				.removeClass('rtcTitle')
				.text(previusTitle);
			
			tweetDialogContent.find('div').empty().html('<br/>');
			previusTitle = '';
			tweetDialogContent.focus();
		}
		
	},

	//function to add li rtc elements and its actions
	addOptionsAndClickEvents = function () {
		var elements = $('.js-actions:not(.rtc)');
		if(elements.length !== 0){
			//add class to ul for mark as option rtc added and add rtc opction
			elements.addClass('rtc').prepend(rtcLiElement);
		}

		if(!allElementLoaded){
			//add click Rt+C 
    		elementToObserv.on('click', 'div.js-rtc', clickRtc);
		}
	},

	loadL10Vars = function (inl10n) {
		liTitle = inl10n[0];
		liText = inl10n[1];
		titleText = inl10n[2];
		retweetText = inl10n[3];
		rtcLiElement = $.parseHTML('<div class="ProfileTweet-action ProfileTweet-action--reply js-rtc"><button class="ProfileTweet-actionButton u-textUserColorHover js-actionButton js-actionReply js-tooltip" data-modal="ProfileTweet-reply" type="button" data-original-title="'+liTitle+'"><span class="Icon Icon--reply username">'+liText+'</span><span class="ProfileTweet-actionCount u-textUserColorHover ProfileTweet-actionCount--isZero"><span class="ProfileTweet-actionCountForPresentation" aria-hidden="true"></span></span></button></div>');
	},


	//load shared elements
	loadElementsVars = function () {
		tweetButton = $('#global-new-tweet-button');
		tweetDialog = $('#global-tweet-dialog');
		tweetDialogContent = tweetDialog.find('#tweet-box-global');
        if(tweetDialogContent.find('div').length!==0){
            tweetDialogContent = tweetDialogContent.find('div');
        }
        //modal title element 
		tweetDialogTitle = tweetDialog.find('.modal-title');
		elementToObserv = $('#page-outer');
		closeModalNewTweetElement = $('.modal-close.js-close');
	},

	//set l10 vars and init plugin functions
	setUpAndStart = function(inl10n) {
		//avoid profile page
		if($('.profile.active').length === 0){
			loadL10Vars(inl10n);
			loadElementsVars();
			//add listener to add new tweet elements       
			insertionQ('li.js-stream-item').every(function(element){
				addOptionsAndClickEvents();
			});
			addOptionsAndClickEvents();
			allElementLoaded = true;
			//add listener to new tweet close button 
			closeModalNewTweetElement.on('click', clickNewTweet);
		}

	};

	//listener methods
	self.port.on("setL10MessagesPort", setUpAndStart);

	//public methods
	return {
		initPlugin : function () {
			self.port.emit('getL10nMessagesPort');
		}
	}

})();

//execute when load
ExternFunction.initPlugin();
